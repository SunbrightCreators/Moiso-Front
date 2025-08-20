import { VAPID_PUBLIC_KEY } from '../constants/env';

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
  const applicationServerKey = base64urlToUint8Array(VAPID_PUBLIC_KEY);

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    console.log('푸시 구독 정보:', subscription);
    return subscription;
  } catch (error) {
    console.error('푸시 구독 중 오류:', error);
    return error;
  }
};

export default subscribePush;
