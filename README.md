# LAQTA Syria

A modern Syrian real-estate marketplace built with React 19, Vite, TypeScript, Tailwind, and Firebase.

## Features

- Real Firebase Auth sign in / sign up / forgot password
- Property listings with Firestore and Storage uploads
- Favorites backed by Firestore
- User profile management and My Ads dashboard
- Messaging conversations between buyer and seller
- AI-generated property description via Gemini API on a local Express server

## Local setup

1. Install dependencies:
   npm install
2. Create a Firebase project and add config values to your environment or Vite config.
3. Copy .env.example to .env and fill the fields.
4. Start the app with both services:
   npm run dev:full

This runs the Vite frontend on port 3000 and the AI server on port 3001.

## Production and deployment notes

- Vite frontend should be deployed behind a static host.
- The Express AI server can be deployed separately or kept local for staging.
- Firestore security rules should be published from the Firebase console.

## Important scripts

- npm run dev
- npm run server
- npm run dev:full
- npm run build
- npm run lint

## Environment variables

- GEMINI_API_KEY
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
- VITE_FIREBASE_DATABASE_ID
- PORT
