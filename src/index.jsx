import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/global';
import Router from './Router';
import {
  register,
  hasNotificationPermission,
  subscribePush,
} from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  </React.StrictMode>,
);

window.addEventListener('load', async () => {
  const registration = await register();
  if (registration) {
    const isGranted = await hasNotificationPermission();
    const subscription = await subscribePush(registration);
  }
});
