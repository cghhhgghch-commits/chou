import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupPushNotificationListeners } from './lib/fcm';
import AppErrorBoundary from './components/AppErrorBoundary';

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
