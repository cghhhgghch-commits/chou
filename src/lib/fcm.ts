import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { supabase } from './supabase';

export type FcmPlatform = 'android' | 'ios' | 'web';

export interface FcmTokenPayload {
  token: string;
  platform: FcmPlatform;
  device_id?: string;
  app_version?: string;
  user_agent?: string;
}

const STORAGE_KEY = 'laqta.fcm.device_id';
const TOKEN_STORAGE_KEY = 'laqta.fcm.pending_token';
const LEGACY_DAILY_NOTIFICATION_ID = 7001;

export const setupPushNotificationListeners = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const platform = Capacitor.getPlatform();

    await FirebaseMessaging.addListener('tokenReceived', ({ token }) => {
      if (token && typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    });

    if (platform === 'android') {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') return;

      await LocalNotifications.cancel({ notifications: [{ id: LEGACY_DAILY_NOTIFICATION_ID }] });

      await LocalNotifications.createChannel({
        id: 'laqta_default',
        name: 'إشعارات لقطة',
        description: 'إعلانات وتنبيهات تطبيق لقطة',
        importance: 4,
        visibility: 1,
        sound: 'default',
      });
    }

    await FirebaseMessaging.addListener('notificationReceived', async (event) => {
      const nativePayload = (event as any)?.notification ?? event ?? {};
      const title = nativePayload?.title || nativePayload?.body || 'لقطة';
      const body = nativePayload?.body || nativePayload?.message || 'لديك تنبيه جديد من لقطة.';

      if (platform === 'android') {
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now() % 2147483647,
            title: String(title || 'لقطة'),
            body: String(body || 'لديك تنبيه جديد من لقطة.'),
            channelId: 'laqta_default',
            largeIcon: 'ic_launcher',
            summaryText: 'إشعارات تطبيق لقطة',
            sound: 'default',
          }],
        });
        return;
      }

      console.info('iOS push notification received:', title, body);
    });
  } catch (error) {
    console.warn('Push notification setup skipped:', error);
  }
};

const getOrCreateDeviceId = () => {
  if (typeof window === 'undefined') return 'web-device';

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const next = `device_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(STORAGE_KEY, next);
  return next;
};

export const registerFcmToken = async (payload: FcmTokenPayload) => {
  if (!payload?.token) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.warn('FCM registration skipped: user is not authenticated.');
    return null;
  }

  const deviceId = payload.device_id || getOrCreateDeviceId();
  const normalizedPayload = {
    user_id: userData.user.id,
    device_id: deviceId,
    token: payload.token,
    platform: payload.platform || 'android',
    app_version: payload.app_version || 'unknown',
    user_agent: payload.user_agent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'),
    is_active: true,
    last_seen_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('fcm_tokens')
    .upsert(normalizedPayload, { onConflict: 'user_id,device_id' })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to register FCM token:', error);
    return null;
  }

  return data;
};

export const syncNativePushToken = async (userId?: string) => {
  if (!Capacitor.isNativePlatform()) {
    console.info('Not on a native mobile platform; skipping native push registration.');
    return null;
  }

  try {
    let tokenListener: { remove: () => Promise<void> } | null = null;
    const tokenReceivedPromise = new Promise<string>((resolve) => {
      void FirebaseMessaging.addListener('tokenReceived', ({ token }) => resolve(token))
        .then((listener) => { tokenListener = listener; });
    });

    const permission = await FirebaseMessaging.requestPermissions();
    if (permission.receive !== 'granted') {
      console.warn('Push permission denied by user; skipping push registration.');
      await tokenListener?.remove();
      return null;
    }

    let tokenValue = typeof window !== 'undefined'
      ? window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''
      : '';
    for (let attempt = 0; attempt < 3 && !tokenValue; attempt += 1) {
      try {
        const result = await FirebaseMessaging.getToken();
        tokenValue = result.token || '';
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
    }

    if (!tokenValue) {
      tokenValue = await Promise.race([
        tokenReceivedPromise,
        new Promise<string>((_, reject) => window.setTimeout(() => reject(new Error('Firebase token timeout')), 5000)),
      ]);
    }

    if (!tokenValue) throw new Error('Firebase returned an empty FCM token');

    const result = await registerFcmToken({
      token: tokenValue,
      platform: Capacitor.getPlatform() as FcmPlatform,
      device_id: userId ? `${Capacitor.getPlatform()}-${userId}` : getOrCreateDeviceId(),
      app_version: '1.0.0',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : `${Capacitor.getPlatform()}-capacitor`,
    });

    await tokenListener?.remove();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    return result;
  } catch (error) {
    console.error('Failed to sync native push token:', error);
    return null;
  }
};

export const unregisterFcmToken = async (token?: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return false;

  let query = supabase.from('fcm_tokens').update({ is_active: false, updated_at: new Date().toISOString() });

  if (token) {
    query = query.eq('token', token).eq('user_id', userData.user.id);
  } else {
    query = query.eq('user_id', userData.user.id);
  }

  const { error } = await query;
  if (error) {
    console.error('Failed to unregister FCM token:', error);
    return false;
  }

  return true;
};

export const getActiveFcmTokens = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return [];

  const { data, error } = await supabase
    .from('fcm_tokens')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('is_active', true);

  if (error) {
    console.error('Failed to fetch FCM tokens:', error);
    return [];
  }

  return data ?? [];
};
