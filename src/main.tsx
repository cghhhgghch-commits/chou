import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { scheduleAppReminder, setupPushNotificationListeners } from './lib/fcm';

void scheduleAppReminder();
void setupPushNotificationListeners();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
