import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import BottomNavigation from '../components/common/BottomNavigation';
import { MapBottomsheet } from '../components/common/Bottomsheet';
import ProposalItem from '../components/proposal/ProposalList';
import {
  createTypedCircle,
  createCircleFromBoolean,
} from '../components/common/Circle';
import {
  createTypedMarker,
  updateMarkerSelection,
} from '../components/common/Marker';
import {
  createMarkerClusterer,
  getMapDisplayType,
  ZOOM_DISTANCE_MAPPING,
} from '../components/common/MarkerClustering';

import useModeStore from '../stores/useModeStore';
import PencilIcon from '../assets/icons/pencil.svg';
/**
 * 제안글(Proposal) 지도 탐색 */

const ProposalMapPage = () => {
  const { isProposerMode } = useModeStore(); // 전역 상태

  // 지도
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13); // 클러스터링이 보이도록 낮은 줌 레벨로 설정
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

  // 현재 위치 (기본: 서울 중심)
  const [currentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  // 우리 동네 정보 (실제로는 사용자 설정에서 가져와야 함)
  const [ourNeighborhood] = useState({
    sido: '서울특별시',
    sigungu: '강남구',
    eupmyundong: '역삼동',
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

  // 업종 필터 옵션 (API 명세서 기준)
  const industryOptions = [
    { value: '', label: '전체' },
    { value: 'FOOD_DINING', label: '외식/음식점' },
    { value: 'CAFE_DESSERT', label: '카페/디저트' },
    { value: 'PUB_BAR', label: '주점' },
    { value: 'CONVENIENCE_RETAIL', label: '편의점/소매' },
    { value: 'GROCERY_MART', label: '마트/식료품' },
    { value: 'BEAUTY_CARE', label: '뷰티/미용' },
    { value: 'HEALTH_FITNESS', label: '건강' },
    { value: 'FASHION_GOODS', label: '패션/잡화' },
    { value: 'HOME_LIVING_INTERIOR', label: '생활용품/가구' },
    { value: 'HOBBY_LEISURE', label: '취미/오락/여가' },
    { value: 'CULTURE_BOOKS', label: '문화/서적' },
    { value: 'PET', label: '반려동물' },
    { value: 'LODGING', label: '숙박' },
    { value: 'EDUCATION_ACADEMY', label: '교육/학원' },
    { value: 'AUTO_TRANSPORT', label: '자동차/운송' },
    { value: 'IT_OFFICE', label: 'IT/사무' },
    { value: 'FINANCE_LEGAL_TAX', label: '금융/법률/회계' },
    { value: 'MEDICAL_PHARMA', label: '의료/의약' },
    { value: 'PERSONAL_SERVICES', label: '생활 서비스' },
    { value: 'FUNERAL_WEDDING', label: '장례/예식' },
    { value: 'PHOTO_STUDIO', label: '사진/스튜디오' },
    { value: 'OTHER_RETAIL', label: '기타 판매업' },
    { value: 'OTHER_SERVICE', label: '기타 서비스업' },
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
          console.error('네이버 지도 API 로드 타임아웃');
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
      const response = await getReverseGeocodingLegal(
        center.lat(),
        center.lng(),
      );

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

  // 주소를 좌표로 변환하는 함수 (실제 API 연동 시 사용)
  const convertAddressToCoordinates = async (address) => {
    try {
      const response = await getGeocoding(address);
      return {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      };
    } catch (error) {
      console.error('주소 → 좌표 변환 실패:', error);
      return null;
    }
  };

  // 제안글 데이터 로드 (테스트용 목 데이터)
  const loadProposals = async () => {
    setLoading(true);
    try {
      // API 명세서에 맞춘 Mock 데이터 - 동 단위 개별 제안글만
      const mockDetailProposals = [
        {
          id: 1,
          position: {
            latitude: 37.553,
            longitude: 126.909,
          },
          created_at: '30초 전',
          title: '제안글 제목 (1)',
          content: '.',
          user: {
            name: '김**',
            profile_image: null,
          },
          industry: 'CAFE_DESSERT',
          business_hours: {
            start: '09:00',
            end: '18:00',
          },
          address: {
            sido: '서울특별시',
            sigungu: '마포구',
            eupmyundong: '망원동',
            jibun_detail: '385-44',
            road_detail: '동교로 69 ',
          },
          radius: '500m',
          image: [],
          likes_count: 300,
          scraps_count: 178,
        },
        {
          id: 2,
          position: {
            latitude: 37.553,
            longitude: 126.921,
          },
          created_at: '1시간 전',
          title: '제안글 제목 (2)',
          content: '.',
          user: {
            name: '이**',
            profile_image: null,
          },
          industry: 'PUB_BAR',
          business_hours: {
            start: '18:00',
            end: '02:00',
          },
          address: {
            sido: '서울특별시',
            sigungu: '마포구',
            eupmyundong: '서교동',
            jibun_detail: '369-7',
            road_detail: '홍익로5길 43',
          },
          radius: '500m',
          image: [],
          likes_count: 245,
          scraps_count: 89,
        },
        {
          id: 3,
          position: {
            latitude: 37.532,
            longitude: 126.995,
          },
          created_at: '2시간 전',
          title: '제안글 제목 (3)',
          content: '.',
          user: {
            name: '박**',
            profile_image: null,
          },
          industry: 'FOOD_DINING',
          business_hours: {
            start: '11:00',
            end: '22:00',
          },
          address: {
            sido: '서울특별시',
            sigungu: '용산구',
            eupmyundong: '이태원동',
            jibun_detail: '127-2',
            road_detail: '이태원로 55길 12',
          },
          radius: '500m',
          image: [],
          likes_count: 189,
          scraps_count: 156,
        },
      ];

      // 동 단위 제안글 데이터 처리
      const processedProposals = mockDetailProposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        industry: proposal.industry,
        location: `${proposal.address.sigungu} ${proposal.address.eupmyundong}`,
        likes: proposal.likes_count,
        scraps: proposal.scraps_count,
        // API 명세서 기준 필드명 사용
        likes_count: proposal.likes_count,
        scraps_count: proposal.scraps_count,
        isLiked: false, // 기본값
        isScraped: false, // 기본값
        authorName: proposal.user.name,
        timeAgo: proposal.created_at,
        imageList: proposal.image,
        // ProposalList에서 사용하는 추가 필드들
        label:
          proposal.industry === 'CAFE_DESSERT'
            ? '카페/디저트'
            : proposal.industry === 'PUB_BAR'
              ? '주점'
              : proposal.industry === 'FOOD_DINING'
                ? '외식/음식점'
                : '기타',
        description: proposal.content,
        timeInput: proposal.business_hours.start,
        timeInputEnd: proposal.business_hours.end,
        locationInput: `${proposal.address.sigungu} ${proposal.address.eupmyundong}`,
        additionalText: proposal.radius,
        position: proposal.position,
        created_at: proposal.created_at,
        content: proposal.content,
        user: proposal.user,
        business_hours: proposal.business_hours,
        address: proposal.address,
        radius: proposal.radius,
        image: proposal.image,
        markerType: isOurNeighborhood(proposal.address) ? 1 : 2, // 동적으로 마커 타입 설정
      }));

      // 필터링 적용
      let filteredProposals = processedProposals;
      if (selectedIndustry) {
        filteredProposals = processedProposals.filter(
          (proposal) => proposal.industry === selectedIndustry,
        );
      }

      // 정렬 적용
      if (sortOrder === '인기순') {
        filteredProposals.sort((a, b) => b.likes - a.likes);
      } else if (sortOrder === '레벨순') {
        // 레벨순은 임시로 likes 기준으로 정렬
        filteredProposals.sort((a, b) => b.likes - a.likes);
      }
      // 최신순은 기본 순서 유지

      // 상태 업데이트 (마커용과 바텀시트용 동일한 데이터)
      setMapData(filteredProposals);
      setProposals(filteredProposals);

      // 실제 API 호출 : 일단 주석처리
      // const response = await getProposalsMap({
      //   lat: currentLocation.lat,
      //   lng: currentLocation.lng,
      //   radius: 1000,
      //   industry: selectedIndustry,
      //   sortBy: sortOrder,
      // });
      // setProposals(response.data || []);
    } catch (err) {
      setError('제안글을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경시 데이터 재로드
  useEffect(() => {
    if (map) {
      loadProposals();
    }
  }, [selectedIndustry, sortOrder, map]);

  // 현재 화면 중심 위치의 지역 정보 가져오기
  const getCurrentLocationInfo = async () => {
    if (!map) return;

    try {
      const center = map.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      setCurrentCenter({ lat, lng });

      // 역지오코딩으로 현재 위치의 지역 정보 가져오기
      const response = await getReverseGeocodingLegal(lat, lng);
      const locationInfo = response.data;

      setCurrentRegion({
        sido: locationInfo.sido || '',
        sigungu: locationInfo.sigungu || '',
        eupmyundong: locationInfo.eupmyundong || '',
      });

      console.log('현재 화면 중심 지역:', locationInfo);
      return locationInfo;
    } catch (error) {
      console.error('현재 위치 정보 가져오기 실패:', error);
      return null;
    }
  };

  // 현재 화면 영역의 제안글만 필터링
  const filterProposalsByCurrentView = (proposals) => {
    if (
      !currentRegion.sido &&
      !currentRegion.sigungu &&
      !currentRegion.eupmyundong
    ) {
      return proposals; // 지역 정보가 없으면 전체 반환
    }

    return proposals.filter((proposal) => {
      if (!proposal.address) return false;

      // 줌 레벨에 따라 다른 필터링 적용
      if (zoomLevel >= 15) {
        // 상세 레벨: 동 단위 필터링
        return proposal.address.eupmyundong === currentRegion.eupmyundong;
      } else if (zoomLevel >= 12) {
        // 중간 레벨: 구 단위 필터링
        return proposal.address.sigungu === currentRegion.sigungu;
      } else {
        // 넓은 레벨: 시 단위 필터링
        return proposal.address.sido === currentRegion.sido;
      }
    });
  };

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
  };
  setSelectedMarkerId(proposal.id);

  // 해당 마커 강조
  markers.forEach((marker) => {
    if (marker.proposalId === proposal.id) {
      updateMarkerSelection(marker, marker.type || 1, true);
    } else {
      updateMarkerSelection(marker, marker.type || 1, false);
    }
  });

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
      // 500m 미만: 개별 마커 표시
      console.log('개별 마커 모드');
      const newMarkers = [];
      proposalData.forEach((proposal, index) => {
        if (
          proposal.position &&
          proposal.position.latitude &&
          proposal.position.longitude
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
      // 클러스터링 사용 (10km 이상, 2km~10km, 500m~2km)
      console.log('클러스터링 모드, 제안글 수:', proposalData.length);
      const clusterer = createMarkerClusterer(map);
      const markersForCluster = [];

      proposalData.forEach((proposal, index) => {
        console.log(`제안글 ${index + 1} 처리:`, proposal.title);
        if (
          proposal.position &&
          proposal.position.latitude &&
          proposal.position.longitude
        ) {
          // 마커 생성 (클러스터링용)
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              proposal.position.latitude,
              proposal.position.longitude,
            ),
          });

          // 우리 동네인지 판별
          const isOur = isOurNeighborhood(proposal.address);
          marker.type = isOur ? 1 : 2;

          // 줌 레벨에 따른 지역명 설정
          let areaName = '지역';
          if (proposal.address) {
            switch (displayType) {
              case 'PROVINCE':
                areaName = proposal.address.sido || '시/도';
                break;
              case 'DISTRICT':
                areaName = proposal.address.sigungu || '구';
                break;
              case 'NEIGHBORHOOD':
                areaName = proposal.address.eupmyundong || '동';
                break;
            }
          }
          marker.areaName = areaName;

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

  // 현재 지역 기반으로 제안글 필터링
  const getFilteredProposalsByRegion = (proposalData) => {
    if (
      !currentRegion.sido &&
      !currentRegion.sigungu &&
      !currentRegion.eupmyundong
    ) {
      return proposalData; // 지역 정보가 없으면 전체 반환
    }

    return proposalData.filter((proposal) => {
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
                  isSelected={selectedIndustry === option.value}
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
            {getFilteredProposalsByRegion(proposals).map((proposal) => (
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

const SRadioButton = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSelected',
})`
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? 'var(--colors-bg-default, #27272a)'
        : 'var(--colors-border-default, #e2e8f0)'};
  background-color: ${(props) =>
    props.isSelected ? 'var(--colors-bg-default, #27272a)' : 'white'};
  color: ${(props) =>
    props.isSelected
      ? 'var(--colors-text-inverted, #ffffff)'
      : 'var(--colors-text-subtle, #64748b)'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? 'var(--colors-bg-default, #27272a)' : '#f7fafc'};
    border-color: ${(props) =>
      props.isSelected ? 'var(--colors-bg-default, #27272a)' : '#cbd5e0'};
  }
`;

export default ProposalMapPage;
