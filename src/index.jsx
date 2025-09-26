import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChakraProvider from './styles/provider';
import router from './routers/Router';
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
        <RouterProvider router={router} />
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
