/**
 * Circle 컴포넌트(?)
 */

/**
 * 타입 & 선택 상태 → Cicle 스타일  반환
 * @param {number} type - 1: 우리동네, 2: 다른동네
 * @param {boolean} isSelected - 선택(selected) 상태
 * @returns {Object} Cicle 스타일 객체
 */
const getCircleStyles = (type, isSelected) => {
  const styles = {
    // Type 1: 우리동네 제안글/펀딩글
    1: {
      default: {
        fillColor: 'rgb(251, 191, 36)', // yellow.400
        fillOpacity: 0.1,
        strokeColor: 'rgb(251, 146, 60)', // orange.300
        strokeOpacity: 1.0,
        strokeWeight: 2,
        strokeStyle: 'solid',
      },
      selected: {
        fillColor: 'rgb(251, 146, 60)', // #fb923c
        fillOpacity: 0.2,
        strokeColor: 'rgb(234, 88, 12)', // orange/emphasized
        strokeOpacity: 1.0,
        strokeWeight: 3,
        strokeStyle: 'solid',
      },
    },
    // Type 2: 다른동네 제안글/펀딩글
    2: {
      default: {
        fillColor: 'rgb(107, 114, 128)', // gray.500
        fillOpacity: 0.2,
        strokeColor: 'rgb(156, 163, 175)', // gray.400
        strokeOpacity: 1.0,
        strokeWeight: 2,
        strokeStyle: 'solid',
      },
      selected: {
        fillColor: 'rgb(39, 39, 42)', // #27272A
        fillOpacity: 0.2,
        strokeColor: 'rgb(75, 85, 99)', // gray.600
        strokeOpacity: 1.0,
        strokeWeight: 3,
        strokeStyle: 'solid',
      },
    },
  };

  const styleKey = isSelected ? 'selected' : 'default';
  return styles[type][styleKey];
};

/**
 * Tyle과 state 따른 Ciecle 생성
 * m 단위 반경 사용하고, 백엔드 불리언 값으로 스타일 동적 변경하는 식으로 피드백 반영했습니다!
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} centerX - 중심점 X 좌표 (위도)
 * @param {number} centerY - 중심점 Y 좌표 (경도)
 * @param {number} radius - 반경 (미터 단위: 0, 250, 500, 750, 1000)
 * @param {number} type - 원 타입 (1: 우리동네, 2: 다른동네)
 * @param {boolean} isSelected - 선택 상태
 * @returns {Object|null} 네이버 지도 Circle 인스턴스 또는 null
 */
const createTypedCircle = (
  map,
  centerX,
  centerY,
  radius,
  type = 1,
  isSelected = false,
) => {
  // 반경 0이면 원 생성 X
  if (radius === 0) {
    return null;
  }

  // 네이버 지도 API 로드 확인
  if (!window.naver || !window.naver.maps || !window.naver.maps.Circle) {
    console.error('네이버 지도 API가 로드되지 않았습니다.');
    return null;
  }

  if (!map) {
    console.error('지도 인스턴스가 제공되지 않았습니다.');
    return null;
  }

  try {
    const circleStyles = getCircleStyles(type, isSelected);

    // m 단위 반경 사용으로 지도 확대/축소 시 자동 조절
    return new naver.maps.Circle({
      map: map,
      center: new naver.maps.LatLng(centerX, centerY),
      radius: radius, // m 단위로 네이버 지도가 자동 처리
      zIndex: isSelected ? 200 : 100, // 선택된 원이 위에 표시되도록
      ...circleStyles,
    });
  } catch (error) {
    console.error('원 생성 중 오류 발생:', error);
    return null;
  }
};

/**
 * 백엔드 Boolean 값) 활용해서 원 생성하는 함수
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} centerX - 중심점 X 좌표 (위도)
 * @param {number} centerY - 중심점 Y 좌표 (경도)
 * @param {number} radius - 반경 (미터 단위)
 * @param {boolean} isOurNeighborhood - 백엔드에서 제공되는 우리동네 여부 Boolean 값
 * @param {boolean} isSelected - 선택 상태
 * @returns {Object|null} 네이버 지도 Circle 인스턴스 or null
 */
const createCircleFromBoolean = (
  map,
  centerX,
  centerY,
  radius,
  isOurNeighborhood,
  isSelected = false,
) => {
  // 백엔드 Boolean 값으로 타입 결정
  const type = isOurNeighborhood ? 1 : 2;

  return createTypedCircle(map, centerX, centerY, radius, type, isSelected);
};

/**
 * Circle Style 을 업데이트하는 함수
 * 마커 클릭 시 원 스타일도 함께 변경..되는 걸로 이해했는데 맞는지 모르겠네요..
 * @param {Object} circle - 네이버 지도 Circle 인스턴스
 * @param {number} type - 원 타입
 * @param {boolean} isSelected - 새로운 선택 상태
 */
const updateCircleSelection = (circle, type, isSelected) => {
  if (!circle || !window.naver?.maps) {
    console.error('API 오류');
    return;
  }

  try {
    const newStyles = getCircleStyles(type, isSelected);

    // 스타일 업데이트
    circle.setOptions({
      ...newStyles,
      zIndex: isSelected ? 200 : 100,
    });
  } catch (error) {
    console.error('상태 업데이트 중 오류:', error);
  }
};

/**
 * 가이드라인에 명시된 반경 값들을 검증하는 함수
 * @param {number} radius - 검증할 반경 값
 * @returns {boolean} 유효한 반경인지 여부
 */
const isValidRadius = (radius) => {
  const validRadii = [0, 250, 500, 750, 1000];
  return validRadii.includes(radius);
};

/**
 * 반경 따른 원 픽셀크기 반환
 * @param {number} radius - 반경 (m)
 * @returns {string} CSS width 값
 */
const getCircleWidth = (radius) => {
  const sizeMap = {
    0: '0rem', // 반경 0인 경우 원 Xz
    250: '12.5rem',
    500: '18.75rem',
    750: '25rem',
    1000: '31.25rem',
  };

  return sizeMap[radius] || '0rem';
};

const createStyledCircle = (map, centerX, centerY, radius, styleType) => {
  console.warn(
    'createStyledCircle은 deprecated입니다. createTypedCircle을 사용하세요.',
  );

  let type = 1;
  let isSelected = false;

  if (styleType === 'secondary' || styleType === 'secondarySelected') {
    type = 2;
  }

  if (styleType === 'primarySelected' || styleType === 'secondarySelected') {
    isSelected = true;
  }

  return createTypedCircle(map, centerX, centerY, radius, type, isSelected);
};

export {
  createTypedCircle,
  createCircleFromBoolean,
  updateCircleSelection,
  getCircleStyles,
  getCircleWidth,
  isValidRadius,
  createStyledCircle,
};
