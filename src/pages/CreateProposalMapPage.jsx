import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import { createTypedCircle } from '../components/map/Circle';
import { createTypedMarker } from '../components/common/Marker';
import {
  getAddressToPosition,
  getAddressToLegal,
  getPositionToLegal,
} from '../apis/maps';

import CurrentLocation from '../assets/icons/CreateProposalMapPage_target.svg';
/**
 * 제안글 등록 시 장소 선택 페이지
 */
const CreateProposalMapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 지도 관련 상태
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(15);

  // 반경 옵션 (4단계)
  const radiusOptions = [250, 500, 750, 1000];
  const [radiusIndex, setRadiusIndex] = useState(0);
  const radius = radiusOptions[radiusIndex];

  // 현재 위치
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  // 우리 동네 옵션 (현위치 기준 가까운 동네)
  const [nearbyNeighborhoods] = useState([
    { value: 'gangnam', label: '서대문구 대현동' },
    { value: 'seocho', label: '서대문구 연희동' },
  ]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(
    nearbyNeighborhoods[0],
  );

  // 선택된 위치 정보 (테스트용 데이터)
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.564,
    lng: 126.95,
    address: '이화여대길 52',
    radius: 250,
  });

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 네이버 지도 초기화
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 선택된 위치가 변경될 때 지도 중심 이동 및 마커/서클 업데이트
  useEffect(() => {
    if (map && selectedLocation.lat && selectedLocation.lng) {
      const newCenter = new naver.maps.LatLng(
        selectedLocation.lat,
        selectedLocation.lng,
      );
      map.setCenter(newCenter);
      updateMarkerAndCircle(selectedLocation.lat, selectedLocation.lng);
    }
  }, [map, selectedLocation.lat, selectedLocation.lng, radius]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 마커 정리
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }
      // 서클 정리
      if (selectedCircle) {
        selectedCircle.setMap(null);
      }
    };
  }, [selectedMarker, selectedCircle]);

  // 지도 초기화 함수
  const initializeMap = () => {
    const checkNaverMaps = () => {
      if (
        window.naver &&
        window.naver.maps &&
        window.naver.maps.Map &&
        mapRef.current
      ) {
        try {
          const mapInstance = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(
              selectedLocation.lat,
              selectedLocation.lng,
            ),
            zoom: zoomLevel,
            mapTypeControl: false,
            zoomControl: false, // 기본 줌 컨트롤 비활성화
          });

          setMap(mapInstance);

          // 지도 줌 변경 이벤트 리스너
          naver.maps.Event.addListener(mapInstance, 'zoom_changed', () => {
            const mapZoom = mapInstance.getZoom();
            setZoomLevel(mapZoom);
          });

          // 초기 마커와 서클 생성
          updateMarkerAndCircle(selectedLocation.lat, selectedLocation.lng);

          console.log('네이버 지도 초기화 성공');
        } catch (error) {
          console.error('지도 초기화 실패:', error);
          setError('지도를 불러올 수 없습니다.');
        }
      } else {
        const retryCount = checkNaverMaps.retryCount || 0;
        if (retryCount < 50) {
          checkNaverMaps.retryCount = retryCount + 1;
          setTimeout(checkNaverMaps, 100);
        } else {
          console.error('네이버 지도 API 로드 타임아웃');
          setError('지도 API를 불러올 수 없습니다.');
        }
      }
    };
    checkNaverMaps();
  };

  // 마커와 서클 업데이트 함수
  const updateMarkerAndCircle = (lat, lng) => {
    if (!map) return;

    // 기존 마커 제거
    if (selectedMarker) {
      selectedMarker.setMap(null);
      setSelectedMarker(null);
    }

    // 새 마커 생성 (createTypedMarker 사용)
    const marker = createTypedMarker(map, lat, lng, 1, false); // 타입 1 (우리 동네), 선택되지 않음

    // 상태 업데이트
    setSelectedMarker(marker);

    // 서클은 별도 함수로 업데이트 (중복 생성 방지)
    updateCircle(lat, lng, radius);
  };

  // 검색창 클릭 핸들러 (다른 페이지로 이동)
  const handleSearchClick = () => {
    navigate('/search-location');
  };

  // 현위치 버튼 클릭 핸들러 (테스트용 - 기본 위치로 이동)
  const handleCurrentLocationClick = () => {
    // 테스트용: 서울 시청 위치로 이동
    const testLocation = {
      lat: 37.5665,
      lng: 126.978,
    };

    setCurrentLocation(testLocation);
    setSelectedLocation({
      lat: testLocation.lat,
      lng: testLocation.lng,
      address: '서울특별시 서대문구 이화여대길 52',
      radius: radius,
    });

    // 지도 중심 이동
    if (map) {
      const newCenter = new naver.maps.LatLng(
        testLocation.lat,
        testLocation.lng,
      );
      map.setCenter(newCenter);
      updateMarkerAndCircle(testLocation.lat, testLocation.lng);
    }
  };

  // 반경 변경 핸들러 (단계별 설정)
  const handleRadiusChange = (e) => {
    const newIndex = parseInt(e.target.value);
    setRadiusIndex(newIndex);
    const newRadius = radiusOptions[newIndex];

    // 선택된 위치의 반경 정보도 업데이트
    setSelectedLocation((prev) => ({
      ...prev,
      radius: newRadius,
    }));

    // 기존 서클 제거하고 새로운 반경으로 업데이트
    if (map && selectedLocation.lat && selectedLocation.lng) {
      updateCircle(selectedLocation.lat, selectedLocation.lng, newRadius);
    }
  };

  // 서클만 업데이트하는 함수 (중복 생성 방지)
  const updateCircle = (lat, lng, newRadius) => {
    if (!map) return;

    // 기존 서클 제거
    if (selectedCircle) {
      selectedCircle.setMap(null);
      setSelectedCircle(null);
    }

    // 새 서클 생성
    const circle = createTypedCircle(map, lat, lng, newRadius, 1);
    setSelectedCircle(circle);
  };

  // 설정 완료 핸들러 (테스트용)
  const handleComplete = () => {
    console.log('선택된 위치 정보:', {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: selectedLocation.address,
      neighborhood: selectedNeighborhood.label,
      radius: selectedLocation.radius,
    });

    alert(
      `설정 완료!\n위치: ${selectedLocation.address}\n반경: ${selectedLocation.radius}m`,
    );

    // 선택된 장소 정보를 이전 페이지로 전달
    navigate(-1, {
      state: {
        selectedLocation: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: selectedLocation.address,
          neighborhood: selectedNeighborhood.label,
          radius: selectedLocation.radius,
        },
      },
    });
  };

  return (
    <SLayout>
      <TopNavigation left='back' title='장소 선택' right={null} />

      <STopControls>
        <SNeighborhoodSelect
          value={selectedNeighborhood.value}
          onChange={(e) => {
            const selected = nearbyNeighborhoods.find(
              (n) => n.value === e.target.value,
            );
            setSelectedNeighborhood(selected);
          }}
        >
          {nearbyNeighborhoods.map((neighborhood) => (
            <option key={neighborhood.value} value={neighborhood.value}>
              {neighborhood.label}
            </option>
          ))}
        </SNeighborhoodSelect>

        <SSearchInput
          onClick={handleSearchClick}
          placeholder='지번, 도로명으로 검색'
          readOnly
        />
      </STopControls>

      <SMapContainer ref={mapRef} />

      <SCurrentLocationButton onClick={handleCurrentLocationClick}>
        <img src={CurrentLocation} alt='현재 위치' />
      </SCurrentLocationButton>

      <SBottomSheet>
        <SZoomContainer>
          <SZoomLabel>반경</SZoomLabel>
          <SZoomSlider
            type='range'
            min='0'
            max='3'
            step='1'
            value={radiusIndex}
            onChange={handleRadiusChange}
          />
          <SZoomLabel>{radius}m</SZoomLabel>
        </SZoomContainer>

        <SCompleteButton onClick={handleComplete}>설정 완료</SCompleteButton>
      </SBottomSheet>

      {loading && (
        <SLoadingOverlay>
          <SLoadingText>위치 정보를 가져오는 중...</SLoadingText>
        </SLoadingOverlay>
      )}

      {error && (
        <SErrorMessage>
          {error}
          <SErrorCloseButton onClick={() => setError(null)}>
            ✕
          </SErrorCloseButton>
        </SErrorMessage>
      )}
    </SLayout>
  );
};

export default CreateProposalMapPage;

// Styled Components
const SLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background-color: #ffffff;
`;

const STopControls = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e4e7;
  z-index: 100;
`;

const SNeighborhoodSelect = styled.select`
  flex: 0 0 auto;
  min-width: 120px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #27272a;
    box-shadow: 0 0 0 1px #27272a;
  }
`;

const SSearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #27272a;
    box-shadow: 0 0 0 1px #27272a;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SMapContainer = styled.div`
  flex: 1;
  width: 100%;
  background-color: #f3f4f6;
  position: relative;
`;

const SCurrentLocationButton = styled.button`
  position: absolute;
  bottom: 180px;
  right: 1rem;
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 200;

  &:hover {
    background-color: #f8fafc;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SBottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid #e4e4e7;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 300;
  max-width: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
`;

const SZoomContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SZoomLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #27272a;
  min-width: 30px;
`;

const SZoomSlider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #27272a;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #27272a;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SCompleteButton = styled.button`
  width: 90%;
  margin: 0 auto;
  padding: 0.875rem;
  background-color: #27272a;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;

  &:hover {
    background-color: #27272a;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const SLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SLoadingText = styled.div`
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const SErrorMessage = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const SErrorCloseButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
`;
