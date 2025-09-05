/**
 * MarkerClustering
 */

const DEFAULT_CLUSTER_OPTIONS = {
  minClusterSize: 1, // 클러스터 최소 마커 수 : 1개 이상이면 클러스터로 표시
  maxZoom: 17, // 클러스터가 해제되는 최대 줌 레벨 (500m 미만에서 개별 마커)
  gridSize: 120, // 클러스터링을 위한 그리드 크기 (픽셀)
  averageCenter: true, // 클러스터 중심을 평균으로 계산
  zoomOnClick: true, // 클러스터 클릭 시 줌인
};

/**
 * 줌 레벨에 따른 거리 매핑
 * 네이버 지도의 줌 레벨과 실제 거리 관계
 */
const ZOOM_DISTANCE_MAPPING = {
  // 10km 이상: 도(시)지도 - 줌 레벨 10~11
  PROVINCE: { minZoom: 10, maxZoom: 11, distance: '10km 이상' },
  // 2km~10km: 구지도 - 줌 레벨 12~14
  DISTRICT: { minZoom: 12, maxZoom: 14, distance: '2km~10km' },
  // 500m~2km: 동지도 - 줌 레벨 15~16
  NEIGHBORHOOD: { minZoom: 15, maxZoom: 16, distance: '500m~2km' },
  // 500m 미만: 동 미만 지도 - 줌 레벨 17~18
  DETAILED: { minZoom: 17, maxZoom: 18, distance: '500m 미만' },
};

/**
 * 줌 레벨에 따른 지도 표시 타입 반환
 * @param {number} zoomLevel - 현재 줌 레벨
 * @returns {string} 지도 표시 타입
 */
const getMapDisplayType = (zoomLevel) => {
  if (zoomLevel >= ZOOM_DISTANCE_MAPPING.DETAILED.minZoom) {
    return 'DETAILED'; // 500m 미만 - 개별 마커
  } else if (zoomLevel >= ZOOM_DISTANCE_MAPPING.NEIGHBORHOOD.minZoom) {
    return 'NEIGHBORHOOD'; // 500m~2km - 동지도 클러스터링
  } else if (zoomLevel >= ZOOM_DISTANCE_MAPPING.DISTRICT.minZoom) {
    return 'DISTRICT'; // 2km~10km - 구지도 클러스터링
  } else {
    return 'PROVINCE'; // 10km 이상 - 도(시)지도 클러스터링
  }
};

/**
 * 줌 레벨에 따른 지역명 결정
 * @param {string} fullAreaName - 전체 지역명 (예: "서울특별시 강남구 역삼동")
 * @param {number} zoomLevel - 현재 줌 레벨
 * @returns {string} 줌 레벨에 맞는 지역명
 */
const getAreaNameByZoom = (fullAreaName, zoomLevel) => {
  if (!fullAreaName) return '지역';

  const parts = fullAreaName.split(' ').filter((part) => part.length > 0);

  if (zoomLevel <= 11) {
    // 도(시) 단위 - 시/도만 표시
    return parts[0] || '지역';
  } else if (zoomLevel <= 14) {
    // 구 단위 - 구까지 표시
    return parts.slice(0, 2).join(' ') || parts[0] || '지역';
  } else {
    // 동 단위 - 동까지 표시 (전체)
    return parts.join(' ') || '지역';
  }
};

/**
 * 줌 레벨에 따른 클러스터 크기 결정
 * @param {number} zoomLevel - 현재 줌 레벨
 * @returns {Object} 크기 정보 {width, height, fontSize, padding}
 */
const getClusterSizeByZoom = (zoomLevel) => {
  if (zoomLevel <= 11) {
    // 도(시) 단위 - 큰 크기
    return {
      width: '5rem',
      height: '2.5rem',
      fontSize: '14px',
      padding: '4px 6px',
      iconSize: { width: 64, height: 40 },
      anchor: { x: 32, y: 20 },
    };
  } else if (zoomLevel <= 14) {
    // 구 단위 - 중간 크기
    return {
      width: '3.5rem',
      height: '2.2rem',
      fontSize: '12px',
      padding: '3px 5px',
      iconSize: { width: 56, height: 36 },
      anchor: { x: 28, y: 18 },
    };
  } else {
    // 동 단위 - 작은 크기
    return {
      width: '4rem',
      height: '2rem',
      fontSize: '12px',
      padding: '2px 4px',
      iconSize: { width: 48, height: 32 },
      anchor: { x: 24, y: 16 },
    };
  }
};

/**
 * 줌 레벨에 따른 클러스터 원 크기 결정
 * @param {number} zoomLevel
 * @returns {Object}
 */
const getClusterCircleSizeByZoom = (zoomLevel) => {
  if (zoomLevel <= 11) {
    return {
      baseRadius: 4000,
      overlayRadius: 3000,
    };
  } else if (zoomLevel <= 14) {
    return {
      baseRadius: 2000,
      overlayRadius: 1700,
    };
  } else {
    return {
      baseRadius: 600,
      overlayRadius: 400,
    };
  }
};

/**
 * 클러스터 아이콘 스타일을 생성하는 함수 (새로운 스펙)
 * @param {number} size - 클러스터 내 마커 수
 * @param {number} type - 클러스터 타입 (1: 우리동네, 2: 다른동네)
 * @param {string} areaName - 지역명 (시/도 or 구 or 동)
 * @param {number} zoomLevel - 현재 줌 레벨
 */
const createClusterIcon = (size, type = 1, areaName = '', zoomLevel = 13) => {
  console.log('createClusterIcon 호출:', { size, type, areaName, zoomLevel });

  const displayAreaName = getAreaNameByZoom(areaName, zoomLevel);
  const sizeConfig = getClusterSizeByZoom(zoomLevel);

  console.log('표시할 지역명:', displayAreaName, '크기 설정:', sizeConfig);
  if (type === 1) {
    // 우리 동네: 노란색 배경, 지역명 + 제안글 개수 표시
    const result = {
      content: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        ">
          <div style="
            display: flex;
            width: ${sizeConfig.width};
            padding: ${sizeConfig.padding};
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background: var(--colors-yellow-400, #FACC15);
            color: #FFFFFF;
            font-size: ${sizeConfig.fontSize};
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            white-space: nowrap;
          ">
            ${displayAreaName}
          </div>
          <div style="
            color: var(--colors-yellow-500, #EAB308);
            text-align: center;
            font-family: var(--fonts-body, Inter);
            font-size: ${sizeConfig.fontSize};
            font-style: normal;
            font-weight: 500;
            line-height: 1.4;
            display: flex;
            width: ${sizeConfig.width};
            padding: ${sizeConfig.padding};
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background: #FFFFFF;
          ">
            ${size}
          </div>
        </div>
      `,
      size: new naver.maps.Size(
        sizeConfig.iconSize.width,
        sizeConfig.iconSize.height,
      ),
      anchor: new naver.maps.Point(sizeConfig.anchor.x, sizeConfig.anchor.y),
    };
    console.log('우리 동네 클러스터 아이콘 생성됨:', result);
    return result;
  } else {
    // 다른 동네: 회색 배경, 지역명 + 제안글 개수 표시
    const result = {
      content: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        ">
          <div style="
            display: flex;
            width: ${sizeConfig.width};
            padding: ${sizeConfig.padding};
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background: var(--colors-gray-500, #71717A);
            color: #FFFFFF;
            font-size: ${sizeConfig.fontSize};
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            white-space: nowrap;
          ">
            ${displayAreaName}
          </div>
          <div style="
            display: flex;
            width: ${sizeConfig.width};
            padding: ${sizeConfig.padding};
            justify-content: center;
            align-items: center;
            color: var(--colors-gray-500, #71717A);
            text-align: center;
            font-family: var(--fonts-body, Inter);
            font-size: ${sizeConfig.fontSize};
            font-style: normal;
            font-weight: 500;
            line-height: 1.4;
            background: #FFFFFF;
            border-radius: 3px;
          ">
            ${size}
          </div>
        </div>
      `,
      size: new naver.maps.Size(
        sizeConfig.iconSize.width,
        sizeConfig.iconSize.height,
      ),
      anchor: new naver.maps.Point(sizeConfig.anchor.x, sizeConfig.anchor.y),
    };
    console.log('다른 동네 클러스터 아이콘 생성됨:', result);
    return result;
  }
};

/**
 * @param {Object} pos1 - 첫 번째 위치 {lat, lng}
 * @param {Object} pos2 - 두 번째 위치 {lat, lng}
 * @returns {number} 거리 (미터)
 */
const calculateDistance = (pos1, pos2) => {
  const R = 6371e3;
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * 마커들을 클러스터링하는 함수
 * @param {Array} markers - 마커 배열
 * @param {number} zoomLevel - 현재 줌 레벨
 * @returns {Array} 클러스터 배열
 */
const clusterMarkers = (markers, gridSize = 120, zoomLevel = 13) => {
  console.log(
    'clusterMarkers 시작, 마커 수:',
    markers.length,
    '줌 레벨:',
    zoomLevel,
  );
  const clusters = [];
  const processed = new Set();

  markers.forEach((marker, index) => {
    if (processed.has(index)) return;

    const cluster = {
      markers: [marker],
      center: marker.getPosition(),
      type: marker.type || 1, // 마커 타입
      areaName: marker.areaName || '지역', // 지역명 추가
    };

    console.log(`마커 ${index}: 타입=${marker.type}, 지역=${marker.areaName}`);

    // 같은 타입과 같은 지역명의 근처 마커들을 클러스터에 추가
    markers.forEach((otherMarker, otherIndex) => {
      if (
        processed.has(otherIndex) ||
        index === otherIndex ||
        (marker.type || 1) !== (otherMarker.type || 1) ||
        (marker.areaName || '지역') !== (otherMarker.areaName || '지역') // 같은 지역명인지 확인
      )
        return;

      const distance = calculateDistance(
        {
          lat: marker.getPosition().lat(),
          lng: marker.getPosition().lng(),
        },
        {
          lat: otherMarker.getPosition().lat(),
          lng: otherMarker.getPosition().lng(),
        },
      );

      // 줌 레벨에 따른 클러스터링 거리 조정
      const clusterDistance =
        (gridSize * 156543.03392) / Math.pow(2, zoomLevel);

      if (distance < clusterDistance) {
        cluster.markers.push(otherMarker);
        processed.add(otherIndex);
      }
    });

    processed.add(index);

    // 평균 중심점 계산
    if (cluster.markers.length > 1) {
      let totalLat = 0;
      let totalLng = 0;

      cluster.markers.forEach((m) => {
        totalLat += m.getPosition().lat();
        totalLng += m.getPosition().lng();
      });

      cluster.center = new naver.maps.LatLng(
        totalLat / cluster.markers.length,
        totalLng / cluster.markers.length,
      );
    }
    //
    clusters.push(cluster);
  });

  console.log('클러스터링 완료, 클러스터 수:', clusters.length);
  clusters.forEach((cluster, i) => {
    console.log(
      `클러스터 ${i}: 마커 수=${cluster.markers.length}, 타입=${cluster.type}, 지역=${cluster.areaName}`,
    );
  });

  return clusters;
};

/**
 * 마커 클러스터링을 생성하고 관리하는 클래스
 */
class MarkerClusterer {
  constructor(map, options = {}) {
    this.map = map;
    this.options = { ...DEFAULT_CLUSTER_OPTIONS, ...options };
    this.markers = [];
    this.clusters = [];
    this.clusterMarkers = [];

    // 지도 이벤트 리스너 등록
    this.setupEventListeners();
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 줌 변경 시 클러스터 재계산
    naver.maps.Event.addListener(this.map, 'zoom_changed', () => {
      this.redraw();
    });

    // 지도 이동 시 클러스터 재계산
    naver.maps.Event.addListener(this.map, 'dragend', () => {
      this.redraw();
    });
  }

  /**
   * 마커 추가
   * @param {Object} marker - 네이버 지도 Marker 인스턴스
   */
  addMarker(marker) {
    this.markers.push(marker);
    marker.setMap(null); // 개별 마커는 숨김
    this.redraw();
  }

  /**
   * 여러 마커 추가
   * @param {Array} markers - 마커 배열
   */
  addMarkers(markers) {
    markers.forEach((marker) => {
      this.markers.push(marker);
      marker.setMap(null);
    });
    this.redraw();
  }

  /**
   * 클러스터 재그리기
   */
  redraw() {
    console.log('클러스터 redraw 시작, 마커 수:', this.markers.length);
    this.clearClusters();

    const zoomLevel = this.map.getZoom();
    console.log(
      '현재 지도 줌 레벨:',
      zoomLevel,
      'maxZoom:',
      this.options.maxZoom,
    );

    // 최대 줌 레벨에서는 개별 마커 표시
    if (zoomLevel >= this.options.maxZoom) {
      console.log('최대 줌 레벨 - 개별 마커 표시');
      this.markers.forEach((marker) => {
        marker.setMap(this.map);
      });
      return;
    }

    // 개별 마커 숨김
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });

    // 클러스터링 수행
    this.clusters = clusterMarkers(
      this.markers,
      this.options.gridSize,
      zoomLevel,
    );

    console.log('클러스터링 결과 클러스터 수:', this.clusters.length);

    // 클러스터 마커 생성
    this.clusters.forEach((cluster, index) => {
      console.log(
        `클러스터 ${index}: 마커 수 ${cluster.markers.length}, 최소 크기 ${this.options.minClusterSize}`,
      );
      if (cluster.markers.length >= this.options.minClusterSize) {
        console.log(`클러스터 ${index} 생성`);
        this.createClusterMarker(cluster);
      } else {
        console.log(`클러스터 ${index} 조건 미달 - 개별 마커 표시`);
        // 클러스터 조건을 만족하지 않으면 개별 마커 표시
        cluster.markers.forEach((marker) => {
          marker.setMap(this.map);
        });
      }
    });

    console.log(
      '클러스터 마커 생성 완료, 총 생성된 클러스터 마커 수:',
      this.clusterMarkers.length,
    );
  }

  /**
   * 클러스터 마커 생성
   * @param {Object} cluster - 클러스터 객체
   */
  createClusterMarker(cluster) {
    console.log('클러스터 마커 생성 시작:', cluster);

    // 클러스터에서 지역명 추출 (첫 번째 마커의 지역 정보 사용)
    const areaName = cluster.markers[0]?.areaName || '지역';
    const zoomLevel = this.map.getZoom();
    console.log(
      '지역명:',
      areaName,
      '마커 수:',
      cluster.markers.length,
      '타입:',
      cluster.type,
      '줌 레벨:',
      zoomLevel,
    );

    const icon = createClusterIcon(
      cluster.markers.length,
      cluster.type,
      areaName,
      zoomLevel,
    );
    console.log('클러스터 아이콘 생성됨:', icon);

    const clusterMarker = new naver.maps.Marker({
      position: cluster.center,
      map: this.map,
      icon: icon,
      zIndex: 1000,
    });
    console.log('클러스터 마커 생성됨:', clusterMarker);

    // 생성
    this.createClusterCircle(cluster);

    // 클러스터 클릭 이벤트
    naver.maps.Event.addListener(clusterMarker, 'click', () => {
      if (this.options.zoomOnClick) {
        this.map.setCenter(cluster.center);
        this.map.setZoom(this.map.getZoom() + 2);
      }
    });

    this.clusterMarkers.push(clusterMarker);
    console.log(
      '클러스터 마커 배열에 추가됨, 현재 총 수:',
      this.clusterMarkers.length,
    );
  }

  /**
   * 클러스터 서클(반경) 생성
   * @param {Object} cluster - 클러스터 객체
   */
  createClusterCircle(cluster) {
    const zoomLevel = this.map.getZoom();
    const circleSize = getClusterCircleSizeByZoom(zoomLevel);

    let baseCircleOptions, overlayCircleOptions;

    if (cluster.type === 1) {
      // 우리 동네: 노란색 원
      baseCircleOptions = {
        center: cluster.center,
        radius: circleSize.baseRadius,
        strokeColor: 'rgba(234, 179, 8, 0.60)',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: 'rgba(250, 204, 21, 0.30)',
        fillOpacity: 0.4,
      };

      overlayCircleOptions = {
        center: cluster.center,
        radius: circleSize.overlayRadius,
        strokeColor: 'rgba(234, 179, 8, 0.80)',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: 'rgba(250, 204, 21, 0.50)',
        fillOpacity: 0.5,
      };
    } else {
      // 다른 동네: 회색 원
      baseCircleOptions = {
        center: cluster.center,
        radius: circleSize.baseRadius,
        strokeColor: 'rgba(82, 82, 91, 0.40)',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: 'rgba(82, 82, 91, 0.25)',
        fillOpacity: 0.4,
      };

      overlayCircleOptions = {
        center: cluster.center,
        radius: circleSize.overlayRadius,
        strokeColor: 'rgba(82, 82, 91, 0.60)',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: 'rgba(82, 82, 91, 0.40)',
        fillOpacity: 0.5,
      };
    }

    const baseCircle = new naver.maps.Circle(baseCircleOptions);
    baseCircle.setMap(this.map);

    const overlayCircle = new naver.maps.Circle(overlayCircleOptions);
    overlayCircle.setMap(this.map);

    // 서클들도 클러스터 마커와 함께 관리
    if (!this.clusterCircles) {
      this.clusterCircles = [];
    }
    this.clusterCircles.push(baseCircle);
    this.clusterCircles.push(overlayCircle);
  }

  /**
   * 클러스터 제거
   */
  clearClusters() {
    this.clusterMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.clusterMarkers = [];

    // 클러스터 서클도 제거
    if (this.clusterCircles) {
      this.clusterCircles.forEach((circle) => {
        circle.setMap(null);
      });
      this.clusterCircles = [];
    }
  }

  /**
   * 모든 마커 제거
   */
  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.clearClusters();
    this.markers = [];
  }

  /**
   * 마커 클러스터러 제거
   */
  destroy() {
    this.clearMarkers();
    // 이벤트 리스너 제거는 네이버 지도 API 특성상 자동으로 처리됨
  }
}

/**
 * 간단한 마커 클러스터링 생성 함수
 * @param {Object} map - 네이버 지도 인스턴스
 * @param {Array} markers - 마커 배열
 * @param {Object} options - 클러스터링 옵션
 * @returns {MarkerClusterer} 마커 클러스터러 인스턴스
 */
const createMarkerClusterer = (map, markers = [], options = {}) => {
  const clusterer = new MarkerClusterer(map, options);

  if (markers.length > 0) {
    clusterer.addMarkers(markers);
  }

  return clusterer;
};

export {
  MarkerClusterer,
  createMarkerClusterer,
  createClusterIcon,
  clusterMarkers,
  calculateDistance,
  getMapDisplayType,
  getAreaNameByZoom,
  getClusterSizeByZoom,
  getClusterCircleSizeByZoom,
  ZOOM_DISTANCE_MAPPING,
  DEFAULT_CLUSTER_OPTIONS,
};
