import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
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
const DAILY_NOTIFICATION_ID = 7001;
const DAILY_NOTIFICATION_TITLE = 'عرض جديد قد يناسبك';
const DAILY_NOTIFICATION_BODY = 'افتح لقطة وشاهد ما أضيف بالقرب منك اليوم.';
const SYRIA_TIME_ZONE = 'Asia/Damascus';

const getNextSyriaEleven = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SYRIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, Number(value)]));
  const targetDay = values.hour >= 11 ? values.day + 1 : values.day;
  const approximateUtc = Date.UTC(values.year, values.month - 1, targetDay, 11, 0, 0);
  const formattedTarget = new Intl.DateTimeFormat('en-US', {
    timeZone: SYRIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(approximateUtc));
  const targetValues = Object.fromEntries(formattedTarget.map(({ type, value }) => [type, Number(value)]));
  const displayedUtc = Date.UTC(targetValues.year, targetValues.month - 1, targetValues.day, targetValues.hour, targetValues.minute);
  const desiredUtc = Date.UTC(values.year, values.month - 1, targetDay, 11, 0);
  return new Date(approximateUtc + desiredUtc - displayedUtc);
};

const scheduleDailyRecommendation = async () => {
  await LocalNotifications.cancel({ notifications: [{ id: DAILY_NOTIFICATION_ID }] });
  await LocalNotifications.schedule({
    notifications: [{
      id: DAILY_NOTIFICATION_ID,
      title: DAILY_NOTIFICATION_TITLE,
      body: DAILY_NOTIFICATION_BODY,
      channelId: 'laqta_default',
      schedule: {
        at: getNextSyriaEleven(),
        every: 'day',
        allowWhileIdle: true,
      },
      sound: 'default',
    }],
  });
};

export const setupPushNotificationListeners = async () => {
  if (!Capacitor.isNativePlatform()) return;

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  await LocalNotifications.createChannel({
    id: 'laqta_default',
    name: 'إشعارات لقطة',
    description: 'إعلانات وتنبيهات تطبيق لقطة',
    importance: 4,
    visibility: 1,
    sound: 'default',
  });
  await scheduleDailyRecommendation();

  await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now() % 2147483647,
        title: notification.title || 'لقطة',
        body: notification.body || 'لديك تنبيه جديد من لقطة.',
        channelId: 'laqta_default',
        largeIcon: 'ic_launcher',
        summaryText: 'إشعارات تطبيق لقطة',
        sound: 'default',
      }],
    });
  });
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
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      console.warn('Push permission denied by user; skipping push registration.');
      return null;
    }

    let registrationListener: { remove: () => Promise<void> } | null = null;
    let registrationErrorListener: { remove: () => Promise<void> } | null = null;
    const tokenPromise = new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('FCM registration timeout')), 15000);
      void PushNotifications.addListener('registration', ({ value }) => {
        window.clearTimeout(timeout);
        resolve(value);
      }).then((listener) => { registrationListener = listener; });
      void PushNotifications.addListener('registrationError', (error) => {
        window.clearTimeout(timeout);
        reject(new Error(error.error || 'FCM registration failed'));
      }).then((listener) => { registrationErrorListener = listener; });
    });

    await PushNotifications.register();
    const tokenValue = await tokenPromise;

    const result = await registerFcmToken({
      token: tokenValue,
      platform: 'android',
      device_id: userId ? `android-${userId}` : getOrCreateDeviceId(),
      app_version: '1.0.0',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'android-capacitor',
    });

    await registrationListener?.remove();
    await registrationErrorListener?.remove();
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
