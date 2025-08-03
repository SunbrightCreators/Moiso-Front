const register = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('이 브라우저는 서비스워커를 지원하지 않습니다.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('SW registered: ', registration);
    return registration;
  } catch (error) {
    console.error('SW registration failed: ', error);
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
      console.log('알림 권한이 이미 허용되어 있습니다.');
      return true;
    case 'denied':
      console.log('알림 권한이 거부되어 있습니다. 브라우저 설정에서 수동으로 변경해야 합니다.');
      return false;
    case 'default':
      console.log('알림 권한을 요청합니다...');
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
  // base64url → base64
  let base64 = base64urlString.replace(/-/g, '+').replace(/_/g, '/');

  // padding 추가
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  // 디코딩
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
const subscribePush = async (registration) => {
  const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;

  const applicationServerKey = base64urlToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  console.log('푸시 구독 정보:', subscription);
  return subscription;
};

export { register, hasNotificationPermission, subscribePush };
