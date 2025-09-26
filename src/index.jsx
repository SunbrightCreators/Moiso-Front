import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChakraProvider from './styles/provider';
import Router from './routers/Router';
import { ModalBottomsheet } from './components/common/Bottomsheet';
import Dialog from './components/common/Dialog';
import { Toaster } from './components/common/toaster';
import registerServiceWorker from './service-workers/registerServiceWorker';
import requestNotificationPermission from './service-workers/requestNotificationPermission';
import subscribePush from './service-workers/subscribePush';

document.documentElement.className = 'light';
document.documentElement.style.colorScheme = 'light';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router />
        <ModalBottomsheet />
        <Dialog />
        <Toaster />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

window.addEventListener('load', async () => {
  const registration = await registerServiceWorker();
  if (registration) {
    const isGranted = await requestNotificationPermission();
    if (isGranted) await subscribePush(registration);
  }
});
