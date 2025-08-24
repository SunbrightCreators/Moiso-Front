import React from 'react';
import ReactDOM from 'react-dom/client';
import Provider from './styles/provider';
import Router from './Router';
import { ModalBottomsheet } from './components/common/Bottomsheet';
import Dialog from './components/common/Dialog';
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
      <ModalBottomsheet />
      <Dialog />
    </Provider>
  </React.StrictMode>,
);

window.addEventListener('load', async () => {
  const registration = await registerServiceWorker();
  if (registration) {
    const isGranted = await requestNotificationPermission();
    if (isGranted) await subscribePush(registration);
  }
});
