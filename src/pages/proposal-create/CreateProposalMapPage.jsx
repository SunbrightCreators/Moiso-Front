import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { TopNavigation } from '../../components/common/navigation';
import { createTypedCircle, createTypedMarker } from '../../components/map';
import { useGetPositionToFull } from '../../apis/maps';
import { useGetProfile } from '../../apis/accounts';
import { ROUTE_PATH } from '../../constants/route';
import CurrentLocation from '../../assets/icons/target.svg';

import {
  loadNaverMapScript,
  removeNaverMapScript,
} from '../../apis/NaverMapLoader';

/**
 * 제안글 등록 시 장소 선택 페이지
 */
const CreateProposalMapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(15);

  // Slider로 Radius 설정 (0, 250, 500, 750)
  const [radius, setRadius] = useState(250);

  // 현위치
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  // 선택된 위치 정보
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
    address: '',
  });

  // 프로필 정보 : '우리 동네' 가져오기!
  const { data: profileData } = useGetProfile('proposer', 'address');
  const [nearbyNeighborhoods, setNearbyNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  // 프로필 데이터 : '우리 동네' 설정!
  useEffect(() => {
    if (profileData?.data?.proposer_profile?.proposer_level) {
      const neighborhoods =
        profileData.data.proposer_profile.proposer_level.map(
          (level, index) => ({
            value: index.toString(),
            label: level.address[0].eupmyundong,
            sido: level.address[0].sido,
            sigungu: level.address[0].sigungu,
            eupmyundong: level.address[0].eupmyundong,
          }),
        );

      setNearbyNeighborhoods(neighborhoods);

      // 현위치 기준, 가장 가까운 동네 자동 선택 (첫 번째로 설정)
      if (neighborhoods.length > 0) {
        setSelectedNeighborhood(neighborhoods[0]);
      }
    } else {
      // 프로필 데이터가 없을 경우 기본 동네 설정
      const fallbackNeighborhoods = [
        {
          value: '0',
          label: '대현동',
          sido: '서울특별시',
          sigungu: '서대문구',
          eupmyundong: '대현동',
        },
      ];
      setNearbyNeighborhoods(fallbackNeighborhoods);
      setSelectedNeighborhood(fallbackNeighborhoods[0]);
    }
  }, [profileData]);

  // 좌표 → 주소변환 API - 조건부 호출
  const { data: addressData, isLoading: isAddressLoading } =
    useGetPositionToFull(
      selectedLocation.lat && selectedLocation.lng
        ? selectedLocation.lat
        : null,
      selectedLocation.lat && selectedLocation.lng
        ? selectedLocation.lng
        : null,
      selectedNeighborhood?.sido,
      selectedNeighborhood?.sigungu,
      selectedNeighborhood?.eupmyundong,
    );

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 네이버 지도 초기화
  useEffect(() => {
    (async () => {
      try {
        await loadNaverMapScript();
        const timer = setTimeout(() => {
          initializeMap();
        }, 100);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('네이버 지도 API 로드 오류:', error);
      }
    })();

    // 컴포넌트 언마운트 시 스크립트 태그 정리
    return () => {
      removeNaverMapScript();
    };
  }, []);

  // PlaceSearchPage에서 돌아온 검색 결과 처리
  useEffect(() => {
    if (stateData.searchResult) {
      const { address } = stateData.searchResult;

      // 검색된 주소를 selectedLocation에 설정
      setSelectedLocation((prev) => ({
        ...prev,
        address: address,
      }));

      // 검색 결과를 사용한 후 state 정리
      if (location.state?.searchResult) {
        navigate(location.pathname, {
          state: { ...stateData, searchResult: null },
          replace: true,
        });
      }
    }
  }, [stateData.searchResult, location.pathname, location.state, navigate]);

  // 선택된 위치가 변경 시, 지도중심 이동 + 마커/서클 업데이트
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

  // 주소 데이터 업데이트
  useEffect(() => {
    if (addressData?.data) {
      setSelectedLocation((prev) => ({
        ...prev,
        address:
          addressData.data.road_detail || addressData.data.jibun_detail || '',
      }));
    }
  }, [addressData]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }
      if (selectedCircle) {
        selectedCircle.setMap(null);
      }
    };
  }, [selectedMarker, selectedCircle]);

  const initializeMap = () => {
    if (!mapRef.current) {
      console.error('지도 컨테이너가 준비되지 않음');
      return;
    }

    try {
      const initialCenter = new naver.maps.LatLng(
        currentLocation.lat,
        currentLocation.lng,
      );

      const newMap = new naver.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: zoomLevel,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: false,
        mapDataControl: false,
        logoControl: false,
        scaleControl: false,
      });

      setMap(newMap);

      // 지도 클릭 이벤트
      naver.maps.Event.addListener(newMap, 'click', (e) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();
        handleMapClick(lat, lng);
      });

      // 초기 위치에 마커 및 서클 생성
      setSelectedLocation({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: '',
      });

      console.log('네이버 지도 초기화 성공');
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  };

  const handleMapClick = (lat, lng) => {
    setSelectedLocation({
      lat,
      lng,
      address: '', // 주소는 API 호출로 업데이트
    });
  };

  const updateMarkerAndCircle = (lat, lng) => {
    if (!map) return;

    // 기존 마커 제거
    if (selectedMarker) {
      selectedMarker.setMap(null);
      setSelectedMarker(null);
    }

    // 새 마커 생성 (createTypedMarker 사용) - Type1DefaultIcon
    const marker = createTypedMarker(map, lat, lng, 1, false); // 타입 1 (우리 동네), 선택 X

    if (marker) {
      setSelectedMarker(marker);
    }
    updateCircle(lat, lng, radius);
  };

  const handleSearchClick = () => {
    navigate('/proposal-create/place-search', {
      state: {
        selectedNeighborhood,
        returnTo: 'map',
        currentLocation: selectedLocation,
        radius,
      },
    });
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCurrentLocation({ lat, lng });
          setSelectedLocation({
            lat,
            lng,
            address: '',
          });

          if (map) {
            const newCenter = new naver.maps.LatLng(lat, lng);
            map.setCenter(newCenter);
            updateMarkerAndCircle(lat, lng);
          }
          setLoading(false);
        },
        (error) => {
          console.warn(
            '위치 정보를 가져올 수 없어 기본 위치로 설정합니다:',
            error,
          );

          if (error.code === error.PERMISSION_DENIED) {
            setError(
              '위치 권한이 필요합니다. n/브라우저 설정에서 위치 권한을 허용해주세요.',
            );
          }

          // 기본 위치로
          const defaultLocation = {
            lat: 37.5665,
            lng: 126.978,
          };

          setCurrentLocation(defaultLocation);
          setSelectedLocation({
            lat: defaultLocation.lat,
            lng: defaultLocation.lng,
            address: '',
          });

          if (map) {
            const newCenter = new naver.maps.LatLng(
              defaultLocation.lat,
              defaultLocation.lng,
            );
            map.setCenter(newCenter);
            updateMarkerAndCircle(defaultLocation.lat, defaultLocation.lng);
          }

          setLoading(false);
        },
      );
    } else {
      setError('이 브라우저에서는 위치 서비스가 지원되지 않습니다.');

      // 기본 위치로
      const defaultLocation = {
        lat: 37.5665,
        lng: 126.978,
      };

      setCurrentLocation(defaultLocation);
      setSelectedLocation({
        lat: defaultLocation.lat,
        lng: defaultLocation.lng,
        address: '',
      });

      if (map) {
        const newCenter = new naver.maps.LatLng(
          defaultLocation.lat,
          defaultLocation.lng,
        );
        map.setCenter(newCenter);
        updateMarkerAndCircle(defaultLocation.lat, defaultLocation.lng);
      }
    }
  };

  // 반경 변경 핸들러 (0, 250, 500, 750 중 하나)
  const handleRadiusChange = (event) => {
    const sliderValue = parseInt(event.target.value);
    // 슬라이더 값(0-3)을 실제 반경 값으로 변환
    const radiusValues = [0, 250, 500, 750];
    const newRadius = radiusValues[sliderValue];

    setRadius(newRadius);

    // 기존 서클 제거 + 새로운 반경으로 업데이트
    if (map && selectedLocation.lat && selectedLocation.lng) {
      updateCircle(selectedLocation.lat, selectedLocation.lng, newRadius);
    }
  };

  // 서클만 업데이트 함수 (중복생성 방지)
  const updateCircle = (lat, lng, newRadius) => {
    if (!map) return;

    // 기존 서클 제거
    if (selectedCircle) {
      selectedCircle.setMap(null);
      setSelectedCircle(null);
    }

    // 새 서클 생성 (Type1 색상으로)
    if (newRadius > 0) {
      const circle = createTypedCircle(map, lat, lng, newRadius, 1, false);
      if (circle) {
        setSelectedCircle(circle);
      }
    }
  };

  // 동네 선택 변경 핸들러
  const handleNeighborhoodChange = (e) => {
    const selected = nearbyNeighborhoods.find(
      (n) => n.value === e.target.value,
    );
    setSelectedNeighborhood(selected);
  };

  // 설정 완료 핸들러 - API 명세서 "제안 추가" 형식에 맞춤
  const handleComplete = () => {
    if (!selectedLocation.lat || !selectedLocation.lng) {
      setError('위치를 선택해주세요.');
      return;
    }

    const locationData = {
      address: {
        sido: selectedNeighborhood?.sido || '',
        sigungu: selectedNeighborhood?.sigungu || '',
        eupmyundong: selectedNeighborhood?.eupmyundong || '',
        jibun_detail: addressData?.data?.jibun_detail || '',
        road_detail: addressData?.data?.road_detail || selectedLocation.address,
      },
      position: {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      },
      radius: radius,
    };

    navigate(ROUTE_PATH.PROPOSAL_CREATE, {
      state: {
        locationData,
        displayAddress:
          selectedLocation.address || `${selectedNeighborhood?.label} 근처`,
      },
    });
  };

  const getSliderValueFromRadius = (radiusValue) => {
    const radiusValues = [0, 250, 500, 750];
    return radiusValues.indexOf(radiusValue);
  };

  return (
    <SLayout>
      <TopNavigation left='back' title='희망 장소 설정' right={null} />

      <STopControls>
        <SNeighborhoodSelect
          value={selectedNeighborhood?.value || ''}
          onChange={handleNeighborhoodChange}
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
        {/* 위치 표시 */}
        <SLocationInfo>
          <SLocationText>
            {selectedLocation.address ||
              addressData?.data?.road_detail ||
              addressData?.data?.jibun_detail ||
              `${selectedNeighborhood?.sigungu || ''} ${selectedNeighborhood?.eupmyundong || ''}`}
          </SLocationText>
          <SRadiusText>+ {radius}m</SRadiusText>
        </SLocationInfo>

        {/* Radius(반경) Slider */}
        <SSliderContainer>
          <SSliderTrack>
            <SSlider
              type='range'
              min='0'
              max='3'
              step='1'
              value={getSliderValueFromRadius(radius)}
              onChange={handleRadiusChange}
            />
            <SSliderMarks>
              <SSliderMark>0m</SSliderMark>
              <SSliderMark>250m</SSliderMark>
              <SSliderMark>500m</SSliderMark>
              <SSliderMark>750m</SSliderMark>
            </SSliderMarks>
          </SSliderTrack>
          <SSliderLabel>{radius}m</SSliderLabel>
        </SSliderContainer>

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

//
// —————————————————————— Styled Components ——————————————————————

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
  bottom: 18rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
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
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 1.5rem 1rem 2.5rem 1rem;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 300;
  max-width: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
`;

const SLocationInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
`;

const SLocationText = styled.div`
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #27272a;
  word-break: break-word;
  line-height: 1.4;
  max-width: 75%;
`;

const SRadiusText = styled.div`
  flex-shrink: 0;
  font-size: 0.9rem;
  color: #a1a1aa;
  white-space: nowrap;
`;

const SSliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SSliderTrack = styled.div`
  flex: 1;
  position: relative;
`;

const SSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${(props) => {
    const percentage = (props.value / props.max) * 100;
    return `linear-gradient(to right, #27272a 0%, #27272a ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  }};
  outline: none;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #27272a;
    cursor: pointer;
    border: none;
    margin-top: -6px; /* thumb를 track 중앙에 정렬 */
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

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: transparent;
  }

  &::-moz-range-track {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: transparent;
    border: none;
  }

  &::-moz-range-thumb {
    margin-top: -6px;
  }
`;

const SSliderMarks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 10px;
`;

const SSliderMark = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
`;

const SSliderLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #27272a;
  min-width: 50px;
  text-align: center;
`;

const SCompleteButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #27272a;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1f1f23;
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
  color: #ef5555;
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
