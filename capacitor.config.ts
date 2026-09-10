import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laqta.syria',
  appName: 'لقطة',
  webDir: 'dist',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['alert', 'badge', 'sound'],
    },
  },
};

export default config;
