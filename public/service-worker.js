// 설치 이벤트
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  self.clients.claim();
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
