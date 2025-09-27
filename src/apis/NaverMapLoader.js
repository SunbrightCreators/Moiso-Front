import { NCLOUD_CLIENT_ID } from '../constants/env';

/**
 * 인증 실패 핸들러 설정
 */
const setupAuthFailureHandler = () => {
  window.navermap_authFailure = function () {
    console.error('네이버 지도 API 인증 실패');
    console.error('클라이언트 ID와 도메인 등록을 확인해주세요.');
  };
};

/**
 * 네이버 지도 API가 완전히 로드될 때까지 대기
 */
const waitForNaverMaps = async () => {
  while (!window.naver || !window.naver.maps) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

/**
 * 스크립트 로드 완료를 대기
 */
const waitForScriptLoad = async (script) => {
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () => reject(new Error('네이버 지도 API 로드 실패'));
  });
};

/**
 * 네이버 지도 API 스크립트를 로드합니다.
 * @returns {Promise<void>}
 */
const loadNaverMapScript = async () => {
  // 인증 실패 핸들러 설정
  setupAuthFailureHandler();

  // 이미 로드된 경우 바로 리턴
  if (window.naver && window.naver.maps) {
    console.log('네이버 지도 API가 이미 로드되어 있습니다.');
    return;
  }

  const existingScript = document.querySelector(
    'script[src*="oapi.map.naver.com"]',
  );

  if (existingScript) {
    // 기존 스크립트가 있는 경우, 로딩 완료를 기다림
    console.log('기존 네이버 지도 API 스크립트 발견, 로딩 대기 중...');
    await waitForNaverMaps();
    console.log('네이버 지도 API 로드 완료');
    return;
  }

  // 새로운 스크립트 생성 및 로드
  console.log('네이버 지도 API 스크립트 로드 시작...');

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCLOUD_CLIENT_ID}`;

  document.head.appendChild(script);

  try {
    // 스크립트 로드 대기
    await waitForScriptLoad(script);

    // API 객체가 실제로 로드될 때까지 대기
    await waitForNaverMaps();

    console.log('네이버 지도 API 로드 완료');
  } catch (error) {
    console.error('네이버 지도 API 로드 실패:', error);
    script.remove();
    throw error;
  }
};

/**
 * 네이버 지도 API 스크립트를 제거합니다.
 */
const removeNaverMapScript = () => {
  const existingScript = document.querySelector(
    'script[src*="oapi.map.naver.com"]',
  );

  if (existingScript) {
    existingScript.remove();
    console.log('네이버 지도 API 스크립트 제거 완료');
  }

  // 전역 객체 정리
  if (window.naver) {
    delete window.naver;
    console.log('네이버 API 전역 객체 제거 완료');
  }
};

/**
 * 네이버 지도 API가 로드되었는지 확인합니다.
 * @returns {boolean}
 */
const isNaverMapLoaded = () => {
  return !!(window.naver && window.naver.maps);
};

export {
  loadNaverMapScript,
  removeNaverMapScript,
  isNaverMapLoaded,
  setupAuthFailureHandler,
};
