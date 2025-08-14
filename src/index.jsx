import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './styles/snippets/provider';
import Router from './Router';
import registerServiceWorker from './service-workers/registerServiceWorker';
import requestNotificationPermission from './service-workers/requestNotificationPermission';
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
  const registration = await registerServiceWorker();
  if (registration) {
    const isGranted = await requestNotificationPermission();
    const subscription = await subscribePush(registration);
  }
});
