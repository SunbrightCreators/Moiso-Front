import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import BottomNavigation from '../components/common/BottomNavigation';
import { MapBottomsheet } from '../components/common/Bottomsheet';
import ProposalItem from '../components/proposal/ProposalList';
import {
  createTypedMarker,
  updateMarkerSelection,
} from '../components/map/Marker';
import {
  createMarkerClusterer,
  getMapDisplayType,
  ZOOM_DISTANCE_MAPPING,
} from '../components/map/MarkerClustering';

import useModeStore from '../stores/useModeStore';
import PencilIcon from '../assets/icons/pencil.svg';
import { getProposalMap } from '../apis/proposals';
import { getPositionToLegal } from '../apis/maps';
import { INDUSTRY } from '../constants/enum';

/**
 * 제안글(Proposal) 지도 탐색 */

const ProposalMapPage = () => {
  const { isProposerMode } = useModeStore(); // 전역 상태

  // 지도
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13); // 클러스터링 보이게 -> 줌 레벨 낮게 설정
  const [bottomsheetLevel, setBottomsheetLevel] = useState(1); // 바텀시트 상태

  // 제안글 데이터 (바텀시트용 - 항상 개별 제안글만)
  const [proposals, setProposals] = useState([]);
  // 지도 마커용 데이터 (줌 레벨에 따라 집계/개별 데이터)
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 선택된 제안글 상태
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // 필터링 상태
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortOrder, setSortOrder] = useState('최신순');

  // 현재 화면 중심 지역 정보
  const [currentRegion, setCurrentRegion] = useState({
    sido: '',
    sigungu: '',
    eupmyundong: '',
  });

  // 필터 스크롤 컨테이너 ref
  const filterScrollRef = useRef(null);

  // 현재 위치 (기본
  const [currentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  // 우리 동네 정보 (실제로는 사용자 설정에서 가져와야 함)
  const [ourNeighborhood] = useState({
    sido: '서울특별시',
    sigungu: '서대문구',
    eupmyundong: '대현동',
  });

  // 지역이 우리 동네인지 판별하는 함수
  const isOurNeighborhood = (address) => {
    if (!address || !ourNeighborhood) return false;

    // 시/도, 시/군/구, 읍/면/동 중 하나라도 일치하면 우리 동네로 판단
    return (
      address.sido === ourNeighborhood.sido ||
      address.sigungu === ourNeighborhood.sigungu ||
      address.eupmyundong === ourNeighborhood.eupmyundong
    );
  };

  // 업종 필터 옵션 (enum.js에서 가져옴)
  const industryOptions = [
    { value: '', label: '전체' },
    ...INDUSTRY.map((item) => ({ value: item.value, label: item.label })),
  ];

  // 네이버 지도 초기화
  useEffect(() => {
    // DOM이 준비되면 지도 초기화
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
              currentLocation.lat,
              currentLocation.lng,
            ),
            zoom: zoomLevel,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: naver.maps.MapTypeControlStyle.BUTTON,
              position: naver.maps.Position.TOP_RIGHT,
            },
            zoomControl: true,
            zoomControlOptions: {
              style: naver.maps.ZoomControlStyle.SMALL,
              position: naver.maps.Position.TOP_RIGHT,
            },
          });
          setMap(mapInstance);

          // 지도 줌 변경 이벤트 리스너 추가
          naver.maps.Event.addListener(mapInstance, 'zoom_changed', () => {
            const mapZoom = mapInstance.getZoom();
            setZoomLevel(mapZoom);
          });

          // 지도 중심 변경 이벤트 리스너 추가 (현재 지역 정보 업데이트)
          naver.maps.Event.addListener(mapInstance, 'center_changed', () => {
            updateCurrentRegion(mapInstance);
          });

          console.log('네이버 지도 초기화 성공');
        } catch (error) {
          console.error('지도 초기화 실패:', error);
        }
      } else {
        // 100ms 후 다시 시도 (최대 50번)
        const retryCount = checkNaverMaps.retryCount || 0;
        if (retryCount < 50) {
          checkNaverMaps.retryCount = retryCount + 1;
          setTimeout(checkNaverMaps, 100);
        } else {
          console.error('네이버 지도 API 로드 오류');
        }
      }
    };
    checkNaverMaps();
  };

  // 슬라이더 줌 레벨 변경 핸들러
  const handleZoomChange = (value) => {
    setZoomLevel(value);
    if (map) {
      map.setZoom(value);
    }
  };

  // 현재 화면 중심의 지역 정보 업데이트
  const updateCurrentRegion = async (mapInstance) => {
    try {
      const center = mapInstance.getCenter();
      const response = await getPositionToLegal(center.lat(), center.lng());

      if (response.data) {
        setCurrentRegion({
          sido: response.data.sido || '',
          sigungu: response.data.sigungu || '',
          eupmyundong: response.data.eupmyundong || '',
        });
      }
    } catch (error) {
      console.error('현재 지역 정보 업데이트 실패:', error);
    }
  };

  // 마커 선택 상태 업데이트
  const handleMarkerClick = (proposal, markerId) => {
    console.log('마커 클릭:', proposal.title);

    // 이전 선택된 마커 해제
    if (selectedMarkerId && selectedMarkerId !== markerId) {
      const prevMarker = markers.find((m) => m.id === selectedMarkerId);
      if (prevMarker && prevMarker.marker) {
        const isOur = isOurNeighborhood(prevMarker.proposal.address);
        const markerType = isOur ? 1 : 2;
        updateMarkerSelection(prevMarker.marker, markerType, false);
      }
    }

    // 새로운 마커 선택
    const currentMarker = markers.find((m) => m.id === markerId);
    if (currentMarker && currentMarker.marker) {
      const isOur = isOurNeighborhood(proposal.address);
      const markerType = isOur ? 1 : 2;
      updateMarkerSelection(currentMarker.marker, markerType, true);
    }

    // 상태 업데이트
    setSelectedMarkerId(markerId);
    setSelectedProposal(proposal);
    setBottomsheetLevel(2);
  };

  // 제안글 데이터 로드 (API 명세서 기준)
  const loadProposals = async () => {
    setLoading(true);
    try {
      // 줌 레벨에 따른 zoom 파라미터 매핑 (API 명세서 기준)
      let zoomParam;
      if (zoomLevel >= 15) {
        zoomParam = 0; // 동이하지도 (개별 제안글)
      } else if (zoomLevel >= 12) {
        zoomParam = 500; // 500m~2km
      } else if (zoomLevel >= 10) {
        zoomParam = 2000; // 2km~10km
      } else {
        zoomParam = 10000; // 10km 이상
      }

      // 사용자 모드에 따른 profile 설정
      const profile = isProposerMode ? 'proposer' : 'founder';

      // API 호출
      const response = await getProposalMap(
        profile,
        zoomParam,
        currentRegion.sido || '',
        currentRegion.sigungu || '',
        currentRegion.eupmyundong || '',
        sortOrder,
        selectedIndustry,
      );

      let processedData = [];

      if (zoomParam === 0) {
        // 동이하지도 - 개별 제안글 데이터 (API 명세서 구조 그대로 사용)
        processedData = response.data.flatMap((item) =>
          item.proposals.map((proposal) => ({
            // API 응답 데이터 그대로 사용 (ProposalRecPage.jsx와 동일한 구조)
            ...proposal,
            // 지도 표시를 위한 최소한의 추가 필드만
            position: item.position,
            markerType: isOurNeighborhood(proposal.address) ? 1 : 2,
          })),
        );
      } else {
        // 집계된 지역 데이터 (도지도, 구지도, 동지도)
        processedData = response.data.map((item) => ({
          id: item.id,
          title: item.address,
          count: item.number,
          position: item.position,
          isAddressData: item.is_address,
          // 마커 표시를 위한 기본 정보
          address: {
            sido:
              item.address.includes('특별시') || item.address.includes('광역시')
                ? item.address
                : '',
            sigungu: item.address.includes('구') ? item.address : '',
            eupmyundong: item.address.includes('동') ? item.address : '',
          },
        }));
      }

      // 상태 업데이트
      setMapData(processedData);
      setProposals(processedData);
    } catch (err) {
      setError('제안글을 불러오는데 실패했습니다.');
      console.error('API 호출 실패:', err);

      // 오류 시 빈 배열로 설정
      setMapData([]);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경시 데이터 재로드
  useEffect(() => {
    if (map && currentRegion.sido) {
      loadProposals();
    }
  }, [selectedIndustry, sortOrder, map, currentRegion, zoomLevel]);

  // 지도 초기화 시 현재 위치의 지역 정보 가져오기
  useEffect(() => {
    if (map) {
      updateCurrentRegion(map);
    }
  }, [map]);

  // 바텀시트 아이템 클릭 핸들러 (상세페이지 이동)
  const handleProposalItemClick = (proposal) => {
    console.log(
      '제안글 상세페이지로 이동:',
      proposal.title,
      'ID:',
      proposal.id,
    );
    // TODO: 상세페이지가 만들어지면 navigate 사용
    // navigate(`/proposal/${proposal.id}`);

    // 마커도 선택 상태로 업데이트
    handleMarkerClick(proposal, proposal.id);

    setSelectedMarkerId(proposal.id);

    // 해당 마커 강조
    markers.forEach((marker) => {
      if (marker.proposalId === proposal.id) {
        updateMarkerSelection(marker, marker.type || 1, true);
      } else {
        updateMarkerSelection(marker, marker.type || 1, false);
      }
    });
  };

  // 지도에 마커와 서클 생성
  const createMarkersAndCircles = (proposalData) => {
    // 기존 마커 제거
    markers.forEach((marker) => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
    setMarkers([]);

    // 클러스터 제거
    if (markerCluster) {
      markerCluster.clearMarkers();
    }

    if (!map || !proposalData || proposalData.length === 0) return;

    // 줌 레벨에 따라 클러스터링 또는 개별 마커 표시
    const displayType = getMapDisplayType(zoomLevel);

    console.log('현재 줌 레벨:', zoomLevel, '표시 타입:', displayType);

    if (displayType === 'DETAILED') {
      // 동이하지도: 개별 마커 표시
      console.log('개별 마커 모드');
      const newMarkers = [];
      proposalData.forEach((proposal, index) => {
        if (
          proposal.position &&
          proposal.position.latitude &&
          proposal.position.longitude &&
          !proposal.isAddressData // 개별 제안글만 표시
        ) {
          // 우리 동네인지 판별
          const isOur = isOurNeighborhood(proposal.address);
          const markerType = isOur ? 1 : 2;

          // 개별 마커 생성
          const isSelected = selectedMarkerId === proposal.id;
          const marker = createTypedMarker(
            map,
            proposal.position.latitude,
            proposal.position.longitude,
            markerType,
            isSelected,
          );

          if (marker) {
            // 마커 객체에 ID와 제안글 정보 추가
            const markerWithData = {
              id: proposal.id,
              marker: marker,
              proposal: proposal,
            };
            newMarkers.push(markerWithData);

            // 마커 클릭 이벤트
            naver.maps.Event.addListener(marker, 'click', () => {
              handleMarkerClick(proposal, proposal.id);
            });
          }
        }
      });

      setMarkers(newMarkers);
    } else {
      // 집계된 지역 데이터: 클러스터링 사용
      console.log('클러스터링 모드, 데이터 수:', proposalData.length);
      const clusterer = createMarkerClusterer(map);
      const markersForCluster = [];

      proposalData.forEach((item, index) => {
        console.log(`지역 데이터 ${index + 1} 처리:`, item.title);
        if (
          item.position &&
          item.position.latitude &&
          item.position.longitude
        ) {
          // 마커 생성 (클러스터링용)
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              item.position.latitude,
              item.position.longitude,
            ),
          });

          // 지역 타입에 따른 마커 스타일 설정
          marker.type = item.isAddressData ? 1 : 2;
          marker.areaName = item.title;
          marker.count = item.count;

          markersForCluster.push(marker);
        }
      });

      console.log('클러스터링용 마커 수:', markersForCluster.length);
      clusterer.addMarkers(markersForCluster);
      console.log('클러스터러에 마커 추가 완료');
      setMarkerCluster(clusterer);
    }
  };

  // mapData가 변경될 때마다 마커와 서클 생성
  useEffect(() => {
    if (mapData.length > 0) {
      createMarkersAndCircles(mapData);
    }
  }, [mapData, map, zoomLevel, selectedProposal]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      markers.forEach((marker) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });

      // 클러스터 정리
      if (markerCluster) {
        markerCluster.clearMarkers();
      }
    };
  }, []);

  // 현재 지역 기반으로 제안글 필터링 (개별 제안글만)
  const getFilteredProposalsByRegion = (proposalData) => {
    // 개별 제안글만 필터링 (집계 데이터 제외)
    const individualProposals = proposalData.filter(
      (item) => !item.isAddressData,
    );

    if (
      !currentRegion.sido &&
      !currentRegion.sigungu &&
      !currentRegion.eupmyundong
    ) {
      return individualProposals; // 지역 정보가 없으면 전체 반환
    }

    return individualProposals.filter((proposal) => {
      if (!proposal.address) return false;

      // 시/도, 시/군/구, 읍/면/동 중 하나라도 일치하면 포함
      return (
        (currentRegion.sido && proposal.address.sido === currentRegion.sido) ||
        (currentRegion.sigungu &&
          proposal.address.sigungu === currentRegion.sigungu) ||
        (currentRegion.eupmyundong &&
          proposal.address.eupmyundong === currentRegion.eupmyundong)
      );
    });
  };

  // 필터 스크롤 터치 이벤트 핸들러
  const handleFilterTouchStart = (e) => {
    const container = filterScrollRef.current;
    if (container) {
      container.startX = e.touches[0].clientX;
      container.scrollStart = container.scrollLeft;
    }
  };

  const handleFilterTouchMove = (e) => {
    const container = filterScrollRef.current;
    if (container && container.startX !== undefined) {
      const touchX = e.touches[0].clientX;
      const diffX = Math.abs(touchX - container.startX);

      // 가로 스크롤이 감지되면 세로 스크롤 방지
      if (diffX > 10) {
        e.stopPropagation();
      }
    }
  };

  return (
    <SLayout>
      <TopNavigation />

      {/* ————————————————————— 여기서부터 지도 —————————————————— */}
      <SMapContainer>
        <SMapWrapper ref={mapRef} />

        {/*  슬라이더 - 바텀시트 레벨에 따라 위치 조정 */}
        <SSliderContainer
          $bottomsheetLevel={bottomsheetLevel}
          $isOverBottomsheet={bottomsheetLevel >= 2}
        >
          <SSliderWrapper>
            <SVerticalSlider
              type='range'
              min={10}
              max={18}
              step={1}
              value={zoomLevel}
              onChange={(e) => handleZoomChange(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to top, var(--colors-bg-default, #27272a) 0%, var(--colors-bg-default, #27272a) ${((zoomLevel - 10) / (18 - 10)) * 100}%, #e2e8f0 ${((zoomLevel - 10) / (18 - 10)) * 100}%, #e2e8f0 100%)`,
              }}
            />
          </SSliderWrapper>
          <SZoomLevelText>{zoomLevel}레벨</SZoomLevelText>
        </SSliderContainer>

        {/* 제안자 모드일 때만 : 플로팅 버튼으로, '제안하기' - 화면상 고정 위치 */}
        {isProposerMode && (
          <SProposeButton
            $bottomsheetLevel={bottomsheetLevel}
            onClick={() => {
              /* 페이지 이동 : 구현해야 됨! */
            }}
          >
            <img
              src={PencilIcon}
              alt='제안하기'
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            제안하기
          </SProposeButton>
        )}
      </SMapContainer>

      {/* ————————————————————————————————————————————————————————— */}

      {/* non-modal 바텀시트 (1단짜리) */}
      <SBottomsheetWrapper>
        <MapBottomsheet
          level={bottomsheetLevel}
          onLevelChange={setBottomsheetLevel}
        >
          {/* 업종 필터 (라디오 버튼 형식으로 스크롤되게) */}
          <SFilterRow>
            <SFilterScrollContainer
              ref={filterScrollRef}
              data-filter-scroll
              onTouchStart={handleFilterTouchStart}
              onTouchMove={handleFilterTouchMove}
            >
              {industryOptions.map((option) => (
                <SRadioButton
                  key={option.value}
                  $isSelected={selectedIndustry === option.value}
                  onClick={() => setSelectedIndustry(option.value)}
                >
                  {option.label}
                </SRadioButton>
              ))}
            </SFilterScrollContainer>
          </SFilterRow>

          {/* 정렬 컨테이너 */}
          <SSortContainer>
            <SProposalCount>
              {currentRegion.eupmyundong ||
                currentRegion.sigungu ||
                currentRegion.sido ||
                '현재 지역'}{' '}
              총 {getFilteredProposalsByRegion(proposals).length}개
            </SProposalCount>

            <SSortSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='최신순'>최신순</option>
              <option value='인기순'>인기순</option>
              <option value='레벨순'>레벨순</option>
            </SSortSelect>
          </SSortContainer>

          {/* 제안글 목록 - 현재 지역 기반 필터링 */}
          <div>
            {loading && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                로딩 중...
              </div>
            )}
            {error && (
              <div
                style={{ padding: '20px', textAlign: 'center', color: 'red' }}
              >
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              getFilteredProposalsByRegion(proposals).length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                  }}
                >
                  해당 지역에 제안글이 없습니다.
                </div>
              )}
            {!loading &&
              !error &&
              getFilteredProposalsByRegion(proposals).map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => handleProposalItemClick(proposal)}
                  style={{ cursor: 'pointer' }}
                >
                  <ProposalItem proposal={proposal} />
                </div>
              ))}
          </div>
        </MapBottomsheet>
      </SBottomsheetWrapper>
      <BottomNavigation />
    </SLayout>
  );
};

// Styled Components
const SLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: white;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  touch-action: none;
`;

const SBottomsheetWrapper = styled.div`
  & [data-filter-scroll] {
    touch-action: pan-x;
  }
`;

const SMapContainer = styled.div`
  position: relative;
  flex: 1;
  height: calc(100vh - 120px); /* TNB + BNB 높이 제외 */
  overflow: hidden;
  z-index: 5;
  touch-action: pan-x pan-y; /* 지도 내에서만 터치 OK */
`;

const SMapWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  position: relative;
  touch-action: pan-x pan-y; /* 지도 터치 OK */

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    font-size: 16px;
    z-index: 1;
  }
`;

const SSliderContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: absolute;
  right: 0.3rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  /* 바텀시트 레벨 따른 위치 조정 */
  ${({ $bottomsheetLevel, $isOverBottomsheet }) => {
    if ($bottomsheetLevel === 1) {
      return `
        bottom: 2rem;
        z-index: 10;
      `;
    } else if ($bottomsheetLevel === 2) {
      return `
        bottom: 40vh; 
        z-index: 15;
      `;
    } else if ($bottomsheetLevel >= 3) {
      return `
        bottom: 50vh; 
        z-index: 5; 
      `;
    }
    return `
      bottom: 100px;
      z-index: 10;
    `;
  }}
`;

const SSliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: white;
  align-items: center;
  height: 150px;
  justify-content: center;
  border-radius: 3px;
`;

const SVerticalSlider = styled.input.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  appearance: none;
  width: 0.5rem;
  height: 20rem;
  background: var(--colors-bg-default, #27272a);
  outline: none;
  border-radius: 10px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 0;
    height: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;

const SProposeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: fixed;
  right: 3rem;
  z-index: 10000;
  border-radius: 50px;
  background: white;
  box-shadow:
    0 0 1px 0 rgba(24, 24, 27, 0.3),
    0 8px 16px 0 rgba(24, 24, 27, 0.1);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  color: #333;
  transition: bottom 0.3s ease;

  /* 바텀시트 레벨에 따른 위치 조정 */
  bottom: ${({ $bottomsheetLevel }) => {
    if ($bottomsheetLevel === 1) return '6rem';
    if ($bottomsheetLevel === 2) return 'calc(40vh + 2rem)'; // 바텀시트 높이 + 여백
    if ($bottomsheetLevel >= 3) return 'calc(70vh + 2rem)'; // 바텀시트 높이 + 여백
    return '6rem';
  }};

  &:hover {
    background: #f8f9fa;
  }
`;

const SZoomLevelText = styled.div`
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #718096;
`;

const SSortContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 8px;
  padding: 0 1rem;
`;

const SFilterRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-x; /* 가로 스크롤만 허용 */

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SFilterScrollContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-x; /* 가로 스크롤만 허용 */

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SProposalCount = styled.div`
  font-size: 14px;
  color: var(--colors-fg/subtle);
`;

const SSortSelect = styled.select`
  font-size: 14px;
  padding: 4px 8px;
  border: 1px solid var(--colors-border-default, #e2e8f0);
  border-radius: 4px;
  background: white;
  color: var(--colors-text-default, #1a202c);
  width: 120px;

  &:focus {
    outline: none;
    border-color: var(--colors-bg-default, #27272a);
  }
`;

const SRadioButton = styled.div`
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid
    ${(props) =>
      props.$isSelected
        ? 'var(--colors-bg-default, #27272a)'
        : 'var(--colors-border-default, #e2e8f0)'};
  background-color: ${(props) =>
    props.$isSelected ? 'var(--colors-bg-default, #27272a)' : 'white'};
  color: ${(props) =>
    props.$isSelected
      ? 'var(--colors-text-inverted, #ffffff)'
      : 'var(--colors-text-subtle, #64748b)'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: ${(props) =>
      props.$isSelected ? 'var(--colors-bg-default, #27272a)' : '#f7fafc'};
    border-color: ${(props) =>
      props.$isSelected ? 'var(--colors-bg-default, #27272a)' : '#cbd5e0'};
  }
`;

export default ProposalMapPage;
