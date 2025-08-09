import React from 'react';
import ReactDOM from 'react-dom/client';
import { system } from './styles/theme';
import { Provider } from './styles/snippets/provider';
import Router from './Router';
import {
  register,
  hasNotificationPermission,
  subscribePush,
} from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <Provider>
        <Router />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);

window.addEventListener('load', async () => {
  const registration = await register();
  if (registration) {
    const isGranted = await hasNotificationPermission();
    const subscription = await subscribePush(registration);
  }
});
