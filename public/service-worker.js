const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = ['/', '/index.html'];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

// 푸시 이벤트
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.svg',
    }),
  );
});
