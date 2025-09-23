import { NCLOUD_CLIENT_ID } from '../constants/env';

/**
 * @returns {Promise<void>}
 */
const loadNaverMapScript = async () => {
  if (window.naver && window.naver.maps) {
    return;
  }

  const existingScript = document.querySelector(
    'script[src*="openapi.map.naver.com"]',
  );

  if (existingScript) {
    await new Promise((resolve, reject) => {
      if (existingScript.onload) {
        resolve();
        return;
      }
      existingScript.onload = () => resolve();
      existingScript.onerror = () =>
        reject(new Error('네이버 지도 API 로드 실패'));
    });
    return;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCLOUD_CLIENT_ID}`;

    script.onload = () => {
      console.log('네이버 지도 API 로드 완료');
      resolve();
    };

    script.onerror = () => {
      console.error('네이버 지도 API 로드 실패');
      reject(new Error('네이버 지도 API 로드 실패'));
    };

    document.head.appendChild(script);
  });
};

const removeNaverMapScript = () => {
  const existingScript = document.querySelector(
    'script[src*="openapi.map.naver.com"]',
  );

  if (existingScript) {
    existingScript.remove();
    console.log('네이버 지도 API 스크립트 제거 완료');
  }

  if (window.naver && window.naver.maps) {
    delete window.naver.maps;
  }
};

export { loadNaverMapScript, removeNaverMapScript };
