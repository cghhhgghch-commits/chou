import { Capacitor } from '@capacitor/core';
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

    let tokenValue: string | null = null;

    const listener = await PushNotifications.addListener('registration', ({ value }) => {
      tokenValue = value;
    });

    await PushNotifications.register();

    if (!tokenValue) {
      console.warn('Push registration completed but no token was returned yet.');
      listener.remove();
      return null;
    }

    const result = await registerFcmToken({
      token: tokenValue,
      platform: 'android',
      device_id: userId ? `android-${userId}` : getOrCreateDeviceId(),
      app_version: '1.0.0',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'android-capacitor',
    });

    listener.remove();
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
