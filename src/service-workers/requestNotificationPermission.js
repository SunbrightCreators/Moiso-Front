const requestNotificationPermission = async () => {
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

export default requestNotificationPermission;
