# Deployment Guide

## Overview

This project is currently a Supabase-backed React web app. It is not an Android project with Kotlin/Gradle in the current workspace, so the production readiness work here focuses on the live app architecture and secure deployment patterns.

## Required environment variables

Create a `.env` file with values like:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ENABLE_GOOGLE_AUTH=true`
- `PORT=3001` (if using local server features)

## Production hosting

### Frontend
- Host on Vercel, Netlify, Cloudflare Pages, or any static hosting service.
- Set the environment variables in the hosting dashboard.
- Use the built production bundle from `npm run build`.

### Supabase
- Keep database and auth in Supabase.
- Review and publish RLS policies.
- Ensure login, profile, and tables are protected by production rules.

### Optional push notifications
- Use Supabase Edge Functions or a dedicated backend.
- Store FCM tokens in a protected `fcm_tokens` table.
- Trigger send from server-side event handlers.

## Deployment checklist

- [ ] Environment variables configured
- [ ] Supabase project live
- [ ] Google provider enabled in Supabase if needed
- [ ] RLS verified
- [ ] Profile table permissions checked
- [ ] Build passes with `npm run build`
- [ ] No secrets committed to Git

## Important

Do not use localhost in production. Do not hardcode any keys. Do not embed FCM credentials in the frontend or repository.
