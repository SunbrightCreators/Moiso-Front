import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Avatar } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { TopNavigation } from '../../components/common/navigation';
import { Carousel, toaster } from '../../components/common';
import { createTypedCircle, createTypedMarker } from '../../components/map';
import { loadNaverMapScript } from '../../apis/NaverMapLoader';
import {
  useGetProposalDetail,
  usePostProposalLike,
  usePostProposalScrap,
} from '../../apis/proposals';
import { INDUSTRY } from '../../constants/enum';
import useModeStore from '../../stores/useModeStore';
import DefaultImageSrc from '../../assets/default_image.svg';
import DefaultHeartIcon from '../../assets/icons/heart_default.svg';
import ActiveHeartIcon from '../../assets/icons/heart_pressed.svg';
import DefaultScrapIcon from '../../assets/icons/scrap_default.svg';
import ActiveScrapIcon from '../../assets/icons/scrap_pressed.svg';

const ProposalDetail = () => {
  const { proposalId } = useParams();
  const { isProposerMode } = useModeStore();
  const mode = isProposerMode ? 'proposer' : 'founder';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);

  // API 훅 사용
  const {
    data: proposalData,
    isLoading: loading,
    error,
  } = useGetProposalDetail(parseInt(proposalId), mode);

  const likeMutation = usePostProposalLike();
  const scrapMutation = usePostProposalScrap();

  const proposal = proposalData?.data;

  // 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      // proposal이 없거나 position이 없으면 종료
      if (!proposal || !proposal.position) return;

      // 이미 지도가 생성되었으면 종료 (중복 생성 방지)
      if (mapInstance) return;

      // DOM 요소가 준비될 때까지 대기
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('지도 컨테이너를 찾을 수 없습니다.');
        return;
      }

      try {
        console.log('지도 초기화 시작...', proposal.position);
        await loadNaverMapScript();
        const naverMaps = window.naver.maps;

        const mapOptions = {
          center: new naverMaps.LatLng(
            proposal.position.latitude,
            proposal.position.longitude,
          ),
          zoom: 15,
          mapTypeControl: false,
          scaleControl: false,
          logoControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: naverMaps.Position.TOP_RIGHT,
          },
        };

        const map = new naverMaps.Map('map', mapOptions);

        // 마커 생성
        createTypedMarker(
          map,
          proposal.position.latitude,
          proposal.position.longitude,
          1, // type: my_default (우리동네)
          false, // not selected
        );

        // 원 생성 - radius 안전하게 파싱
        const radiusValue = proposal.radius
          ? parseInt(proposal.radius.toString().replace('m', ''))
          : 500;
        createTypedCircle(
          map,
          proposal.position.latitude,
          proposal.position.longitude,
          radiusValue,
          1, // type: 우리동네
          false, // not selected
        );

        setMapInstance(map);
        console.log('지도 초기화 성공');
      } catch (error) {
        console.error('지도 초기화 실패:', error);
      }
    };

    // DOM이 완전히 렌더링된 후 지도 초기화
    const timer = setTimeout(initializeMap, 300);

    return () => clearTimeout(timer);
  }, [proposal, mapInstance]); // mapInstance도 의존성에 추가

  const getIndustryLabel = (industryValue) => {
    const industry = INDUSTRY.find((item) => item.value === industryValue);
    return industry ? industry.label : industryValue;
  };

  const handleLikeToggle = async () => {
    if (mode !== 'proposer') {
      toaster.create({
        title: "좋아요는 '제안자'일 때 가능해요.",
        status: 'info',
        duration: 3000,
      });
      return;
    }

    try {
      await likeMutation.mutateAsync({
        proposal_id: parseInt(proposalId),
      });
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      toaster.create({
        title: '좋아요 처리 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleScrapToggle = async () => {
    try {
      await scrapMutation.mutateAsync({
        profile: mode,
        proposal_id: parseInt(proposalId),
      });
    } catch (error) {
      console.error('스크랩 토글 실패:', error);
      toaster.create({
        title: '스크랩 처리 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAcceptProposal = () => {
    if (mode !== 'founder') {
      toaster.create({
        title: '제안글 수락은 "창업자"일 때 가능해요.',
        description: '창업자로 전환',
        status: 'info',
        duration: 3000,
      });
      return;
    }

    // 수락 로직 구현
    console.log('제안글 수락');
  };

  if (loading) return <SLoadingContainer>로딩 중...</SLoadingContainer>;
  if (error) return <SErrorContainer>오류: {error.message}</SErrorContainer>;
  if (!proposal)
    return <SErrorContainer>제안글을 찾을 수 없습니다.</SErrorContainer>;

  return (
    <SContainer>
      <TopNavigation
        leftIcon='chevron_left'
        backgroundColor='transparent'
        leftIconStyle={{
          backgroundColor: 'white',
          borderRadius: '50%',
          padding: '0.5rem',
        }}
      />

      {/* 사진 캐러셀 */}
      <SImageSection>
        <Carousel
          onSlideChange={(index) => setCurrentImageIndex(index)}
          gap='0'
        >
          {proposal.image && proposal.image.length > 0 ? (
            proposal.image.map((imageUrl, index) => (
              <SImageItem key={index}>
                <SImage src={imageUrl} alt={`제안글 이미지 ${index + 1}`} />
              </SImageItem>
            ))
          ) : (
            <SImageItem>
              <SImage src={DefaultImageSrc} alt='기본 이미지' />
            </SImageItem>
          )}
        </Carousel>
        {proposal.image && proposal.image.length > 1 && (
          <SImageIndicator>
            {currentImageIndex + 1}/{proposal.image.length}
          </SImageIndicator>
        )}
      </SImageSection>

      <SContentContainer>
        {/* 업종 표시 */}
        <SIndustryTag>{getIndustryLabel(proposal.industry)}</SIndustryTag>

        {/* 제목 */}
        <STitle>{proposal.title}</STitle>

        {/* 작성 시간 */}
        <SCreatedAt>{proposal.created_at}</SCreatedAt>

        {/* 작성자 정보 */}
        <SAuthorSection>
          <SAuthorInfo>
            <Avatar.Root size='xs'>
              <Avatar.Image src={proposal.user.profile_image} />
              <Avatar.Fallback>{proposal.user.name}</Avatar.Fallback>
            </Avatar.Root>
            <SAuthorName>{proposal.user.name}</SAuthorName>
          </SAuthorInfo>
          <SAuthorLevel>
            {proposal.user?.proposer_level?.address?.eupmyundong || ''} Lv.
            {proposal.user?.proposer_level?.level || '1'}
          </SAuthorLevel>
        </SAuthorSection>

        {/* 제안글 내용 */}
        <SContent>{proposal.content}</SContent>

        {/* 희망 운영 시간 */}
        <STimeSection>
          <SSectionTitle>희망 운영 시간</SSectionTitle>
          <SSectionContent>
            {proposal.business_hours?.start || '미정'} -{' '}
            {proposal.business_hours?.end || '미정'}
          </SSectionContent>
        </STimeSection>

        {/* 희망 장소 */}
        <SLocationSection>
          <SSectionTitle>희망 장소</SSectionTitle>
          <SSectionContent>
            {proposal.address?.eupmyundong || ''},{' '}
            {proposal.address?.road_detail || ''} +{proposal.radius || '0m'}
          </SSectionContent>
          <SMapContainer>
            <div id='map' style={{ width: '100%', height: '200px' }}></div>
          </SMapContainer>
        </SLocationSection>

        {/* 액션 버튼들 */}
        <SActionSection>
          <SActionGroup>
            <SActionButton onClick={handleLikeToggle}>
              <SActionIcon
                src={proposal.is_liked ? ActiveHeartIcon : DefaultHeartIcon}
                alt='좋아요'
              />
              <SActionCount>{proposal.likes_count}</SActionCount>
            </SActionButton>

            <SActionButton onClick={handleScrapToggle}>
              <SActionIcon
                src={proposal.is_scrapped ? ActiveScrapIcon : DefaultScrapIcon}
                alt='스크랩'
              />
              <SActionCount>{proposal.scraps_count}</SActionCount>
            </SActionButton>
          </SActionGroup>

          <SAcceptButton
            onClick={handleAcceptProposal}
            $isActive={mode === 'founder'}
          >
            수락하기
          </SAcceptButton>
        </SActionSection>
      </SContentContainer>
    </SContainer>
  );
};

// Styled Components
const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: white;
`;

const SLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1rem;
  color: var(--colors-text-subtle, #a1a1aa);
`;

const SErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1rem;
  color: var(--colors-red-solid, #dc2626);
`;

const SImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
`;

const SImageItem = styled.div`
  width: 100%;
  height: 250px;
  flex-shrink: 0;
`;

const SImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SImageIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 0.25rem;
  color: white;
  text-shadow:
    0 0 1px rgba(24, 24, 27, 0.05),
    0 1px 2px rgba(24, 24, 27, 0.1);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem);
`;

const SContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 5rem; /* SActionSection 공간 확보 */
  gap: 1rem;
`;

const SIndustryTag = styled.div`
  color: var(--colors-yellow-400, #facc15);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-bold, 700);
  line-height: 1.25rem;
`;

const STitle = styled.h1`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
  margin: 0;
`;

const SCreatedAt = styled.div`
  color: var(--colors-text-subtle, #a1a1aa);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem);
`;

const SAuthorSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SAuthorName = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SAuthorLevel = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SContent = styled.div`
  color: var(--colors-bg-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: 1.5rem;
`;

const STimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SLocationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SSectionTitle = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SSectionContent = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SMapContainer = styled.div`
  margin: 0.5rem 0;
  border-radius: 0.375rem;
  overflow: hidden;
  border-color: var(--colors-bg-default, #27272a);
`;

const SActionSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid var(--colors-border-subtle, #e4e4e7);
  z-index: 1000;
`;

const SActionGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const SActionIcon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const SActionCount = styled.span`
  /* xs/medium */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-xs, 1rem);
  color: var(--colors-text-default, #27272a);
`;

const SAcceptButton = styled.button`
  display: flex;
  width: 13.875rem;
  height: var(--sizes-12, 3rem);
  min-width: var(--sizes-16, 4rem);
  padding: 0.125rem var(--spacing-7, 1.75rem);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-3, 0.75rem);
  border-radius: var(--radii-md, 0.375rem);
  border: none;
  opacity: 0.9;
  cursor: ${(props) => (props.$isActive ? 'pointer' : 'not-allowed')};
  background: ${(props) =>
    props.$isActive
      ? 'var(--colors-bg-default, #27272A)'
      : 'var(--colors-fg-subtle2, #D4D4D8)'};
  color: white;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-weight: var(--font-weights-medium, 500);
`;

export default ProposalDetail;
