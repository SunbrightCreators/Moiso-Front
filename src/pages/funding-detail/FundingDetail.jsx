import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Avatar } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TopNavigation } from '../../components/common/navigation';
import { Tab, toaster } from '../../components/common';
import { createTypedCircle, createTypedMarker } from '../../components/map';
import { loadNaverMapScript } from '../../apis/NaverMapLoader';
import {
  useGetFundingDetail,
  usePostFundingLike,
  usePostFundingScrap,
} from '../../apis/fundings';
import { INDUSTRY } from '../../constants/enum';
import useModeStore from '../../stores/useModeStore';
import DefaultImageSrc from '../../assets/default_image.svg';
import DefaultHeartIcon from '../../assets/icons/heart_default.svg';
import ActiveHeartIcon from '../../assets/icons/heart_pressed.svg';
import DefaultScrapIcon from '../../assets/icons/scrap_default.svg';
import ActiveScrapIcon from '../../assets/icons/scrap_pressed.svg';

const FundingDetail = () => {
  const { fundingId } = useParams();
  const parsedFundingId = parseInt(fundingId) || 1;
  const { isProposerMode } = useModeStore();
  const mode = isProposerMode ? 'proposer' : 'founder';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // 각 섹션의 ref
  const introRef = useRef(null);
  const amountScheduleRef = useRef(null);
  const rewardRef = useRef(null);
  const founderRef = useRef(null);
  const trustRef = useRef(null);

  // API 훅 사용
  const {
    data: fundingData,
    isLoading: loading,
    error,
  } = useGetFundingDetail(parsedFundingId, mode);

  const likeMutation = usePostFundingLike();
  const scrapMutation = usePostFundingScrap();

  const funding = fundingData?.data || {
    // ———————————————————————————— Mock Data ————————————————————————————
    id: 1,
    title: '테스트 펀딩',
    industry: 'CAFE_DESSERT',
    summary: '테스트 요약',
    progress: { rate: 50, amount: 100000 },
    goal_amount: 200000,
    schedule: { start: '2025.08.15.', end: '2025.09.14.' },
    expected_opening_date: '2025년 10월',
    content: '테스트 소개',
    business_hours: { start: '오전 9시', end: '오후 6시' },
    address: { eupmyundong: '테스트동', road_detail: '테스트로 123' },
    radius: '500m',
    founder: { name: '홍길동', description: '테스트 창업자', image: '' },
    reward: [],
    policy: '테스트 정책',
    expected_problem: '테스트 어려움',
    contact: '테스트 문의',
    likes_count: 0,
    scraps_count: 0,
    is_liked: false,
    is_scrapped: false,
  };

  // ———————————————————————————— Mock Data ————————————————————————————

  const tabList = ['소개', '금액/일정', '리워드', '창업자', '신뢰'];

  const getIndustryLabel = (industryValue) => {
    const industry = INDUSTRY.find((item) => item.value === industryValue);
    return industry ? industry.label : industryValue;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.eupmyundong}, ${address.road_detail || address.jibun_detail}`;
  };

  // 탭 클릭 핸들러
  const handleTabChange = (index) => {
    setActiveTab(index);
    const refs = [introRef, amountScheduleRef, rewardRef, founderRef, trustRef];
    const targetRef = refs[index];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 좋아요
  const queryClient = useQueryClient();
  const handleLikeClick = () => {
    if (mode === 'proposer') {
      likeMutation.mutate(
        { funding_id: parsedFundingId },
        {
          onSuccess: () => {
            // 쿼리 무효화로 데이터 새로고침
            queryClient.invalidateQueries([
              'useGetFundingDetail',
              parsedFundingId,
              mode,
            ]);
            toaster.create({
              title: '좋아요가 처리되었습니다.',
              status: 'success',
            });
          },
        },
      );
    }
  };

  // 스크랩
  const handleScrapClick = () => {
    scrapMutation.mutate(
      {
        profile: mode,
        funding_id: parsedFundingId,
      },
      {
        onSuccess: () => {
          toaster.create({
            title: funding.is_scrapped
              ? '스크랩을 취소했습니다.'
              : '스크랩에 추가했습니다.',
            status: 'success',
          });
        },
        onError: () => {
          toaster.create({
            title: '오류가 발생했습니다.',
            status: 'error',
          });
        },
      },
    );
  };

  // 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      if (!funding?.position || mapInstance) return; // mapInstance 체크를 조건문에서
      if (mapInstance) return;

      const mapElement = document.getElementById('funding-map');
      if (!mapElement) {
        console.error('지도 컨테이너를 찾을 수 없습니다.');
        return;
      }

      try {
        await loadNaverMapScript();
        const naverMaps = window.naver.maps;

        const mapOptions = {
          center: new naverMaps.LatLng(
            funding.position.latitude,
            funding.position.longitude,
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

        const map = new naverMaps.Map('funding-map', mapOptions);

        // 마커 생성
        createTypedMarker(
          map,
          funding.position.latitude,
          funding.position.longitude,
          1,
          false,
        );

        // 원 생성
        const radiusValue = funding.radius
          ? parseInt(funding.radius.toString().replace('m', ''))
          : 500;
        createTypedCircle(
          map,
          funding.position.latitude,
          funding.position.longitude,
          radiusValue,
          1,
          false,
        );

        setMapInstance(map);
      } catch (error) {
        console.error('지도 로드 실패:', error);
      }
    };
    initializeMap();
  }, [funding]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다.</div>;
  if (!funding) return <div>펀딩 정보를 찾을 수 없습니다.</div>;

  return (
    <SContainer>
      {/* TopNavigation */}
      <TopNavigation
        backButtonType='circular'
        isTransparent={true}
        showBackButton={true}
      />

      {/* 이미지 섹션 */}
      <SImageSection>
        <SImage src={DefaultImageSrc} alt='펀딩 이미지' />
      </SImageSection>

      {/* 메인 콘텐츠 */}
      <SContentContainer>
        {/* INDUSTRY 표시 */}
        <SIndustryTag>{getIndustryLabel(funding.industry)}</SIndustryTag>

        {/* 제목 */}
        <STitle>{funding.title}</STitle>

        {/* 프로젝트 요약 */}
        <SSummary>{funding.summary}</SSummary>

        {/* 후원금액 표시 */}
        <SFundingAmount>
          {funding.progress?.amount?.toLocaleString() || '0'}원 후원 받았어요
        </SFundingAmount>

        {/* 목표금액 달성률 + progress bar */}
        <SProgressSection>
          <SProgressText>
            목표 금액까지 {funding.progress?.rate || 0}% 달성!
          </SProgressText>
          <SProgressBar>
            <SProgressFill width={funding.progress?.rate || 0} />
          </SProgressBar>
        </SProgressSection>

        {/* 개요 표시 */}
        <SOverviewSection>
          <SOverviewItem>
            <SOverviewLabel>목표 금액</SOverviewLabel>
            <SOverviewValue>
              {funding.goal_amount?.toLocaleString() || '0'}원
            </SOverviewValue>
          </SOverviewItem>
          <SOverviewItem>
            <SOverviewLabel>펀딩 기간</SOverviewLabel>
            <SOverviewValue>
              {funding.schedule?.start} - {funding.schedule?.end}
            </SOverviewValue>
          </SOverviewItem>
          <SOverviewItem>
            <SOverviewLabel>예상 개업일</SOverviewLabel>
            <SOverviewValue>{funding.expected_opening_date}</SOverviewValue>
          </SOverviewItem>
          <SOverviewItem>
            <SOverviewLabel>리워드 발송</SOverviewLabel>
            <SOverviewValue>개업일 기준 3주 이내</SOverviewValue>
          </SOverviewItem>
        </SOverviewSection>

        {/* ———————————————————————————— 탭 ———————————————————————————— */}
        <STabSection>
          <Tab
            tabList={tabList}
            initialTab={activeTab}
            onTabChange={handleTabChange}
          />
        </STabSection>
        {/* —————————————————————————————————————————————————————————— */}

        {/* 소개 섹션 */}
        <SSectionContainer ref={introRef}>
          <SSectionLabel>| 소개</SSectionLabel>
          <SSectionContent>
            <SContentText>{funding.content}</SContentText>

            {/* 운영 시간 */}
            <SSubSection>
              <SSubSectionTitle>운영 시간</SSubSectionTitle>
              <SSubSectionContent>
                {formatTime(funding.business_hours?.start)} -{' '}
                {formatTime(funding.business_hours?.end)}
              </SSubSectionContent>
            </SSubSection>

            {/* 개업 장소 */}
            <SSubSection>
              <SSubSectionTitle>개업 장소</SSubSectionTitle>
              <SSubSectionContent>
                {formatAddress(funding.address)} + {funding.radius}
              </SSubSectionContent>
              <SMapContainer>
                <div
                  id='funding-map'
                  style={{ width: '100%', height: '200px' }}
                />
              </SMapContainer>
            </SSubSection>
          </SSectionContent>
        </SSectionContainer>

        {/* 금액/일정 섹션 */}
        <SSectionContainer ref={amountScheduleRef}>
          <SSectionLabel>| 금액/일정</SSectionLabel>
          <SSectionContent>
            <SSubSection>
              <SSubSectionTitle>예산 사용 계획서</SSubSectionTitle>
              <SSubSectionContent>
                {funding.amount_description}
              </SSubSectionContent>
            </SSubSection>
            <SSubSection>
              <SSubSectionTitle>프로젝트 일정</SSubSectionTitle>
              <SSubSectionContent>
                {funding.schedule_description}
              </SSubSectionContent>
            </SSubSection>
          </SSectionContent>
        </SSectionContainer>

        {/* 리워드 섹션 */}
        <SSectionContainer ref={rewardRef}>
          <SSectionLabel>| 리워드</SSectionLabel>
          <SSectionContent>
            {funding.reward?.map((reward) => (
              <SRewardCard key={reward.id}>
                <SRewardBadge>{reward.category}</SRewardBadge>
                <SRewardInfo>
                  <SRewardTitle>{reward.title}</SRewardTitle>
                  <SRewardPrice>
                    {reward.amount?.toLocaleString()}원
                  </SRewardPrice>
                </SRewardInfo>
              </SRewardCard>
            ))}
          </SSectionContent>
        </SSectionContainer>

        {/* 창업자 섹션 */}
        <SSectionContainer ref={founderRef}>
          <SSectionLabel>| 창업자</SSectionLabel>
          <SSectionContent>
            <SFounderInfo>
              <Avatar
                size='xs'
                src={funding.founder?.image}
                name={funding.founder?.name}
              />
              <SFounderName>{funding.founder?.name}</SFounderName>
            </SFounderInfo>
            <SFounderDescription>
              {funding.founder?.description}
            </SFounderDescription>
          </SSectionContent>
        </SSectionContainer>

        {/* 신뢰 섹션 */}
        <SSectionContainer ref={trustRef}>
          <SSectionLabel>| 신뢰</SSectionLabel>
          <SSectionContent>
            <SSubSection>
              <SSubSectionTitle>프로젝트 정책</SSubSectionTitle>
              <SSubSectionContent>{funding.policy}</SSubSectionContent>
            </SSubSection>
            <SSubSection>
              <SSubSectionTitle>예상되는 어려움</SSubSectionTitle>
              <SSubSectionContent>
                {funding.expected_problem}
              </SSubSectionContent>
            </SSubSection>
            <SSubSection>
              <SSubSectionTitle>문의 채널</SSubSectionTitle>
              <SSubSectionContent>{funding.contact}</SSubSectionContent>
            </SSubSection>
          </SSectionContent>
        </SSectionContainer>
      </SContentContainer>

      {/* 하단 액션 섹션 */}
      <SActionSection>
        <SActionGroup>
          <SActionButton onClick={handleLikeClick}>
            <SActionIcon
              src={funding.is_liked ? ActiveHeartIcon : DefaultHeartIcon}
              alt='좋아요'
            />
            <SActionCount>{funding.likes_count}</SActionCount>
          </SActionButton>
          <SActionButton onClick={handleScrapClick}>
            <SActionIcon
              src={funding.is_scrapped ? ActiveScrapIcon : DefaultScrapIcon}
              alt='스크랩'
            />
            <SActionCount>{funding.scraps_count}</SActionCount>
          </SActionButton>
        </SActionGroup>
        <SAcceptButton $isActive={true}>수락하기</SAcceptButton>
      </SActionSection>
    </SContainer>
  );
};

// ———————————————————————————— Styled Components ————————————————————————————
const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

const SImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
`;

const SImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 5rem; /* SActionSection 공간 확보,, */
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

const SSummary = styled.div`
  color: var(--colors-bg-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SFundingAmount = styled.div`
  color: var(--colors-fg-muted, #52525b);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
  letter-spacing: var(--letter-spacings-tight, -0.025rem);
`;

const SProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SProgressText = styled.div`
  color: var(--colors-border-success, #22c55e);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 1rem);
`;

const SProgressBar = styled.div`
  width: 11.5rem;
  height: var(--sizes-2_5, 0.625rem);
  background: var(--colors-bg-muted, #f4f4f5);
  border-radius: 0.3125rem;
  overflow: hidden;
`;

const SProgressFill = styled.div`
  width: ${(props) => props.width}%;
  height: 100%;
  background: var(--colors-yellow-solid, #fde047);
  border-radius: 0.3125rem;
`;

const SOverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SOverviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SOverviewLabel = styled.div`
  color: var(--colors-text-subtle, #a1a1aa);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 1rem);
`;

const SOverviewValue = styled.div`
  color: var(--colors-text-muted, #52525b);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xs, 0.75rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-xs, 1rem);
`;

const STabSection = styled.div`
  margin: 1rem 0;
`;

const SSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SSectionLabel = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
`;

const SSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SContentText = styled.div`
  color: var(--colors-bg-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: 1.5rem;
`;

const SSubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SSubSectionTitle = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SSubSectionContent = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SMapContainer = styled.div`
  margin: 1rem 2rem;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid var(--colors-border-default, #e4e4e7);
`;

const SRewardCard = styled.div`
  align-items: center;
  background-color: var(--colors-bg-default, #ffffff);
  border: 1px solid var(--colors-border-default, #e4e4e7);
  border-radius: var(--radii-lg, 0.5rem);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-5, 1.25rem);
  gap: var(--spacing-3, 0.75rem);
`;

const SRewardBadge = styled.div`
  align-items: center;
  background-color: var(--colors-gray-solid, #71717a);
  border-radius: var(--radii-4xl, 2rem);
  color: var(--colors-gray-contrast, #ffffff);
  display: inline-flex;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  justify-content: center;
  line-height: var(--line-heights-sm, 1.25rem);
  padding: 0.625rem var(--spacing-2, 0.5rem);
  width: fit-content;
`;

const SRewardInfo = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1, 0.25rem);
`;

const SRewardTitle = styled.div`
  color: var(--colors-fg-default, #18181b);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SRewardPrice = styled.div`
  color: var(--colors-fg-default, #18181b);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-sm, 1.25rem);
  text-align: center;
`;

const SFounderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SFounderName = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-sm, 1.25rem);
`;

const SFounderDescription = styled.div`
  color: var(--colors-text-default, #27272a);
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem);
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

export default FundingDetail;
