import React from 'react';
import ReactDOM from 'react-dom/client';
import Provider from './styles/provider';
import Router from './Router';
import {
  register,
  hasNotificationPermission,
  subscribePush,
} from './serviceWorkerRegistration';

document.documentElement.className = 'light';
document.documentElement.style.colorScheme = 'light';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider>
      <Router />
    </Provider>
  </React.StrictMode>,
);

window.addEventListener('load', async () => {
  const registration = await register();
  if (registration) {
    const isGranted = await hasNotificationPermission();
    const subscription = await subscribePush(registration);
  }
});
