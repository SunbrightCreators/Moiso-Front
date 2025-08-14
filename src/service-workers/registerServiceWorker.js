const registerServiceWorker = async () => {
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

export default registerServiceWorker;
