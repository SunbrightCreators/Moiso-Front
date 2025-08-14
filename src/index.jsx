import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './styles/snippets/provider';
import Router from './Router';
import register from './service-workers/register';
import hasNotificationPermission from './service-workers/hasNotificationPermission';
import subscribePush from './service-workers/subscribePush';

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
