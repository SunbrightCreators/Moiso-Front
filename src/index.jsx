import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { system, theme } from './styles/theme';
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
        <Router />
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
