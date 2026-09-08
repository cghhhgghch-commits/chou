import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupPushNotificationListeners } from './lib/fcm';
import AppErrorBoundary from './components/AppErrorBoundary';

if (typeof document !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.documentElement.classList.add('ios-device');
}

void setupPushNotificationListeners().catch((error) => {
  console.warn('Push notification initialization skipped:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
