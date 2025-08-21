/**
 * Circle 컴포넌트 유틸리티
 */

/**
 * 함수 : 스타일 적용된 원을 생성하는..
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} centerX - 중심점 X 좌표 (위도)
 * @param {number} centerY - 중심점 Y 좌표 (경도)
 * @param {number} radius - 반경 (미터 단위: 0, 250, 500, 750, 1000)
 * @param {string} styleType - 스타일 타입 ('primary', 'secondary')
 * @returns {Object|null} 네이버 지도 Circle 인스턴스 또는 null
 */
const createStyledCircle = (map, centerX, centerY, radius, styleType) => {
  // 반경 0이면 원 없음
  if (radius === 0) {
    return null;
  }

  const circleStyles = {
    primary: {
      // 예시로 적어주신 거에 primary 라고 적어주셔서 그대로 적었습니다!
      fillColor: 'rgb(251, 191, 36)', // yellow.400
      fillOpacity: 0.1,
      strokeColor:
        'linear-gradient (to right, rgb(251, 191, 36), rgb(251, 146, 60))',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      strokeStyle: 'solid',
    },
    primarySelected: {
      // 이건 primary(우리동네) 옵션 중에서도 state가 Selected 일 때
      fillColor: 'rgb(251, 146, 60)',
      fillOpacity: 0.2,
      strokeColor:
        'linear-gradient (rgba(253, 186, 116, 1), rgba(251, 146, 60, 1)',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      strokeStyle: 'solid',
    },
    secondary: {
      fillColor: 'rgb(107, 114, 128)',
      fillOpacity: 0.2,
      strokeColor:
        'linear-gradient (rgba(212, 212, 216, 1), rgba(161, 161, 170, 1))',
      strokeWeight: 2,
      strokeStyle: 'solid',
    },
    secondarySelected: {
      fillColor: 'rgb(39, 39, 42)',
      fillOpacity: 0.2,
      strokeColor:
        'linear-gradient (rgba(113, 113, 122, 1), rgba(82, 82, 91, 1))',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      strokeStyle: 'solid',
    },
  };

  return new naver.maps.Circle({
    map: map,
    center: new naver.maps.LatLng(centerX, centerY),
    radius: radius,
    zIndex: 100,
    ...circleStyles[styleType],
  });
};

/**
 * 타입과 선택 상태에 따른 원의 스타일을 반환하는 함수
 * @param {number} type // 1: 우리동네, 2: 다른동네
 * @param {boolean} isSelected - 선택(slected) 상태
 * @returns {Object} 원의 스타일 객체
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
        fillColor: 'rgb(251, 146, 60)',
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
        fillColor: 'rgb(39, 39, 42)',
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
 * 타입 + state 따른 원 생성!
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} centerX - 중심점 X 좌표 (위도?)
 * @param {number} centerY - 중심점 Y 좌표 (경도)
 * @param {number} radius - 반경 (미터 단위)
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

  const circleStyles = getCircleStyles(type, isSelected);

  return new naver.maps.Circle({
    map: map,
    center: new naver.maps.LatLng(centerX, centerY),
    radius: radius,
    zIndex: 100,
    ...circleStyles,
  });
};

/**
 * 반경 따른 원 픽셀크기 반환
 * @param {number} radius - 반경 (m)
 * @returns {string} CSS width 값
 */
const getCircleWidth = (radius) => {
  const sizeMap = {
    250: '12.5rem',
    500: '18.75rem',
    750: '25rem',
    1000: '31.25rem',
  };

  return sizeMap[radius] || '0rem';
};

export {
  createStyledCircle,
  createTypedCircle,
  getCircleStyles,
  getCircleWidth,
};
