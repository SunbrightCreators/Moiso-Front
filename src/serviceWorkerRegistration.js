// serviceWorkerRegistration.js

const register = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('이 브라우저는 서비스워커를 지원하지 않습니다.');
    return null;
  }

  try {
    // 캐시 우회해서 최신 SW 받기 (루프 완화)
    const registration = await navigator.serviceWorker.register(
      '/service-worker.js',
      {
        updateViaCache: 'none',
      },
    );
    console.log('SW registered:', registration);
    return registration;
  } catch (error) {
    console.error('SW registration failed:', error);
    return null;
  }
};

const hasNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  switch (Notification.permission) {
    case 'granted':
      return true;
    case 'denied':
      return false;
    default:
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('권한 요청 중 오류:', error);
        return false;
      }
  }
};

const base64urlToUint8Array = (base64urlString) => {
  if (!base64urlString || typeof base64urlString !== 'string') {
    throw new Error('VAPID public key is missing');
  }
  // base64url → base64
  let base64 = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
  // padding
  while (base64.length % 4 !== 0) base64 += '=';
  // decode
  const rawData = atob(base64);
  const out = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) out[i] = rawData.charCodeAt(i);
  return out;
};

const subscribePush = async (registration) => {
  try {
    if (!registration || !registration.pushManager) {
      console.warn('[push] registration/pushManager 없음. skip');
      return null;
    }

    // 권한 없으면 구독 안 함
    if (Notification.permission !== 'granted') {
      console.warn('[push] notification not granted. skip');
      return null;
    }

    // 이미 구독돼 있으면 재구독 금지(루프/에러 방지)
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      console.log('푸시 구독(기존):', existing);
      return existing;
    }

    // CRA/Vite 둘 다 지원
    const vapidPublicKey =
      (typeof import.meta !== 'undefined' &&
        import.meta.env?.VITE_VAPID_PUBLIC_KEY) ||
      process.env.REACT_APP_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.warn('[push] VAPID key missing. skip subscribe');
      return null;
    }

    const applicationServerKey = base64urlToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('푸시 구독 정보:', subscription);
    return subscription;
  } catch (e) {
    console.warn('[push] subscribe failed:', e);
    return null;
  }
};

export { register, hasNotificationPermission, subscribePush };
