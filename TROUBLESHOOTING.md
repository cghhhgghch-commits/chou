# Troubleshooting Guide

## Profile changes do not appear after reload

Common cause:
- The app updated a local state but did not refresh from Supabase.
- The profile row was not fetched again after save.

Fix implemented:
- `refreshProfile()` now reloads the latest profile from Supabase after save.
- Save uses `upsert` with `onConflict: "id"`.
- The app validates the current user before modifying the profile.

## Google login fails

Check:
- Google provider is enabled in Supabase
- Redirect URL matches the app domain
- `VITE_ENABLE_GOOGLE_AUTH` is not set to false

## Notification system not showing data

Check:
- `NotificationsProvider` is mounted in the app root
- Local storage is available in the browser
- The notification object includes the required fields

## Build fails

Run:

```bash
npm install
npm run lint
npm run build
```

If it still fails, inspect the TypeScript errors closely because the build output is the final source of truth.

## Security notes

- Never commit `.env` files
- Never store FCM credentials inside the frontend
- Ensure `profiles` RLS restricts user access to their own row only

## Support flow

If Supabase or provider configuration is not available from within this project, stop and follow the exact platform setup instructions from the provider dashboard, then return to the app configuration.
