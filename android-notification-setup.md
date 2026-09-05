# Android Notification Setup

## Production-ready architecture

This project is configured around a real push notification flow:

- Supabase stores user profile and auth state
- Supabase stores active FCM tokens
- A backend function sends push notifications via Firebase Cloud Messaging HTTP v1
- Android app presents local and system notifications

## Required real production services

You must provide the following real services externally:

1. Firebase project
2. Firebase Cloud Messaging enabled
3. Android app linked to Firebase
4. google-services.json placed in android/app/
5. Supabase project with `fcm_tokens` table
6. Supabase Edge Function with the Firebase service account JSON

## Required env vars

In Supabase Edge Function environment:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON` (the complete Firebase service-account JSON as one secret)

## App logic

The app can register tokens using the logic in `src/lib/fcm.ts`.

Use this in the real Android app after Firebase is enabled.

## Important rules

- Never hardcode server keys in the app
- Never use localhost in production
- Do not ship any credential inside APK or Git repository
- Use env secrets only

## FCM workflow

1. App generates token
2. App sends token to Supabase `fcm_tokens`
3. Backend triggers send on user event
4. FCM sends to device(s)
5. Device displays notification and routes to correct screen
