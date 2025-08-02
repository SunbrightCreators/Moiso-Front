const CACHE_VERSION = '0.1.0'; // 배포시마다 증가시켜야 함!
const CACHE_NAME = `my-pwa-cache-v${CACHE_VERSION}`;
const urlsToCache = ['/', '/index.html', '/manifest.json', '/logo.svg'];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(urlsToCache);
        self.skipWaiting();
      } catch (error) {
        console.error(error);
        throw error;
      }
    })(),
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) return caches.delete(cacheName); // 오래된 캐시 삭제
          }),
        );
        await self.clients.claim();
      } catch (error) {
        console.error(error);
      }
    })(),
  );
});

// 요청 이벤트
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        } else {
          const response = await fetch(event.request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          }
          return response;
        }
      } catch (error) {
        console.error(error);
        return new Response('리소스를 불러올 수 없습니다.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })(),
  );
});

// 푸시 이벤트
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('Push 데이터가 없습니다.');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error('Push 데이터 파싱 실패: ', error);
    return;
  }

  event.waitUntil(
    (async () => {
      try {
        await self.registration.showNotification(data.title || '알림', {
          body: data.body || '새로운 알림이 있습니다',
          icon: data.icon || '/logo.svg',
          badge: data.badge || '/logo.svg',
          tag: data.tag || 'default',
          data: data.data || {},
          actions: data.actions || [],
          requireInteraction: data.requireInteraction || false,
        });
      } catch (error) {
        console.error('알림 표시 실패: ', error);
      }
    })(),
  );
});
