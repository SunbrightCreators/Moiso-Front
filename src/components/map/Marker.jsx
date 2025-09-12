import Type1DefaultIcon from '../../assets/icons/marker_my_default.svg';
import Type1SelectedIcon from '../../assets/icons/marker_my_selected.svg';
import Type2DefaultIcon from '../../assets/icons/marker_other_default.svg';
import Type2SelectedIcon from '../../assets/icons/marker_other_selected.svg';

/**
 * 마커 타입과 선택 상태에 따른 아이콘을 반환하는 함수
 * @param {number} type - 마커 타입 (1: 우리동네, 2: 다른동네)
 * @param {boolean} isSelected - 선택 상태
 * @returns {string} 아이콘 경로
 */
const getMarkerIcon = (type, isSelected) => {
  if (type === 1) {
    return isSelected ? Type1SelectedIcon : Type1DefaultIcon;
  } else {
    return isSelected ? Type2SelectedIcon : Type2DefaultIcon;
  }
};

/**
 * 마커 타입과 선택 상태에 따른 크기를 반환하는 함
 * @param {number} type - 마커 타입 (1: 우리동네, 2: 다른동네)
 * @param {boolean} isSelected - 선택 상태
 * @returns {Object} 마커 크기 {width, height}
 */
const getMarkerSize = (type, isSelected) => {
  const sizes = {
    // Type 1: 우리동네
    1: {
      default: { width: 36, height: 42 }, // 피그마 GUI의 px 값으로
      selected: { width: 46, height: 55 },
    },
    // Type 2: 다른동네
    2: {
      default: { width: 31, height: 37 },
      selected: { width: 46, height: 55 },
    },
  };

  const sizeKey = isSelected ? 'selected' : 'default';
  return sizes[type][sizeKey];
};

/**
 * 네이버 지도 마커 객체 생성
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {number} type - 마커 Type (1: 우리동네, 2: 다른동네)
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @returns {Object} 네이버 지도 Marker 인스턴스
 */
const createTypedMarker = (
  map,
  latitude,
  longitude,
  type = 1,
  isSelected = false,
  onClick = null,
) => {
  // 네이버 지도 API 로드부터 확인
  if (!window.naver || !window.naver.maps || !window.naver.maps.Marker) {
    console.error('네이버 지도 API가 로드되지 않았습니다.');
    return null;
  }
  // → 아무리 고쳐도 오류페이지가 뜨길래 뭔가 했는데 알고보니 API 로드가 되기 전에 마커가 생성되서 그런 거였더라구요..
  // ㅤ그래서 추가한 부분입니다!

  if (!map) {
    console.error('지도 인스턴스가 제공되지 않았습니다.');
    return null;
  }

  try {
    const iconUrl = getMarkerIcon(type, isSelected);
    const size = getMarkerSize(type, isSelected);

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map: map,
      icon: {
        url: iconUrl,
        size: new naver.maps.Size(size.width, size.height),
        scaledSize: new naver.maps.Size(size.width, size.height),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(size.width / 2, size.height),
      },
      zIndex: isSelected ? 1000 : 100, // 선택된 항목 마커가가 위에 표시됨.
    });

    if (onClick) {
      naver.maps.Event.addListener(marker, 'click', () => {
        onClick({ type, isSelected, marker, latitude, longitude });
      });
    }

    return marker;
  } catch (error) {
    console.error('마커 생성 중 오류 발생:', error);
    return null;
  }
};

/**
 * 백엔드 Boolean 값을 활용한 마커 생성 함수
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {boolean} isOurNeighborhood - 백엔드에서 제공되는 우리동네 여부 Boolean 값
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @returns {Object} 네이버 지도 Marker 인스턴스
 */
const createMarkerFromBoolean = (
  map,
  latitude,
  longitude,
  isOurNeighborhood,
  isSelected = false,
  onClick = null,
) => {
  // 백엔드 Boolean 값으로 타입 결정
  const type = isOurNeighborhood ? 1 : 2;

  return createTypedMarker(map, latitude, longitude, type, isSelected, onClick);
};

/**
 *  마커 클릭하면 스타일 변경으로 재렌더링 자동 수행하게 함
 * @param {Object} marker - 네이버 지도 Marker 인스턴스
 * @param {number} type - 마커 타입
 * @param {boolean} isSelected - 새로운 선택 상태
 */
const updateMarkerSelection = (marker, type, isSelected) => {
  if (!marker || !window.naver?.maps) {
    console.error('마커 또는 네이버 지도 API가 유효하지 않습니다.');
    return;
  }

  try {
    const iconUrl = getMarkerIcon(type, isSelected);
    const size = getMarkerSize(type, isSelected);

    marker.setIcon({
      url: iconUrl,
      size: new naver.maps.Size(size.width, size.height),
      scaledSize: new naver.maps.Size(size.width, size.height),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(size.width / 2, size.height),
    });

    marker.setZIndex(isSelected ? 1000 : 100);
  } catch (error) {
    console.error('마커 선택 상태 업데이트 중 오류:', error);
  }
};

/**
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {Array} markersData - 마커 데이터 배열
 * @param {Function} createCircle - 서클 생성 함수
 * @returns {Object} {markers: Array, circles: Array}
 */
const createMarkersWithCircles = (map, markersData, createCircle) => {
  const markers = [];
  const circles = [];

  markersData.forEach((data) => {
    // 마커 생성
    const marker = createTypedMarker(
      map,
      data.latitude,
      data.longitude,
      data.type,
      data.isSelected,
      data.onClick,
    );

    // 서클 생성 (반경이 있는 경우)
    if (data.radius && data.radius > 0) {
      const circle = createCircle(
        map,
        data.latitude,
        data.longitude,
        data.radius,
        data.type,
        data.isSelected,
      );

      if (circle) circles.push(circle);
    }

    if (marker) markers.push(marker);
  });

  return { markers, circles };
};

export {
  createTypedMarker,
  createMarkerFromBoolean,
  updateMarkerSelection,
  createMarkersWithCircles,
  getMarkerIcon,
  getMarkerSize,
};
