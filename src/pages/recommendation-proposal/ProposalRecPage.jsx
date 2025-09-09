import { useState } from 'react';
import styled from 'styled-components';
import { EmptyState, Badge, Avatar } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';
import Carousel from '../components/common/Carousel';
import BottomNavigation from '../components/common/navigation/BottomNavigation';
import HeartDefault from '../assets/icons/heart_default.svg';
import HeartPressed from '../assets/icons/heart_pressed.svg';
import HeartDisabled from '../assets/icons/heart_disabled.svg';
import ScrapDefault from '../assets/icons/scrap_default.svg';
import ScrapPressed from '../assets/icons/scrap_pressed.svg';
import { ReactComponent as Sparkle } from '../assets/icons/sparkle.svg';
import img_sandwich from '../assets/sandwich.jpg';
import img_toast from '../assets/toast.jpg';

const LikeButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: var(--sizes-4, 1rem);
  height: var(--sizes-4, 1rem);
  background: url(${HeartDefault}) no-repeat center/contain;
  cursor: pointer;

  &:checked {
    background: url(${HeartPressed}) no-repeat center/contain;
  }

  &:disabled {
    background: url(${HeartDisabled}) no-repeat center/contain;
    cursor: not-allowed;
  }
`;
const ScrapButton = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: var(--sizes-4, 1rem);
  height: var(--sizes-4, 1rem);
  background: url(${ScrapDefault}) no-repeat center/contain;
  cursor: pointer;

  &:checked {
    background: url(${ScrapPressed}) no-repeat center/contain;
  }
`;
const stop = (e) => {
  e.stopPropagation();
};
/* ----------------------------- 큰 카드 공통 ----------------------------- */
const LargeCard = styled.article`
  flex: 0 0 100%;
  background: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;
const LargeBody = styled.div`
  padding: 16px;
  display: grid;
  gap: 10px;
`;
const LargeTitle = styled.h3`
  align-self: stretch;
  color: var(--colors-text-default, #27272a);
  text-align: center;

  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-xl, 1.25rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-xl, 1.875rem);
`;
const LargeDesc = styled.p`
  display: flex;
  height: 6.25rem;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  overflow: hidden;
  color: var(--colors-text-default, #27272a);
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 4;
  overflow-wrap: anywhere;
  word-break: break-word;

  /* sm/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem); /* 142.857% */
`;

const LargeBtn = styled.button`
  position: fixied;
  margin-top: 8px;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 700;
`;
// === 상단 유저행 ===
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  color: var(--colors-text-default, #27272a);

  font: var(--text-sm-medium);
`;

const HeaderRight = styled.span`
  color: 'var(--colors-text-default, #27272A)';
  font-size: 14;
  font-family: 'Inter';
  font-weight: '500';
  line-height: 20;
  word-wrap: 'break-word';
`;

// === 정보 블록(운영 시간/장소) ===
const Tag = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const InfoSection = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20;
  color: 'var(--colors-text-default, #27272A)';
  font-family: 'Inter';
  word-wrap: 'break-word';
`;

const InfoValue = styled.span`
  color: 'var(--colors-text-default, #27272A)';
  font: var(--text-sm-normal);
`;

// === 아이콘 줄(버튼 위, 우측 정렬) ===
const StatsBar = styled.div`
  display: flex;
  justify-content: flex-end; /* 오른쪽 끝 */
  margin-left: auto;
  align-items: center;
  gap: var(--spacing-0_5, 0.125rem);
  color: #9ca3af;
  margin-top: 8px;
`;

/* ----------------------------- (위 캐러셀) ----------------------------- */
/* 페이지 패딩(16px)을 상쇄해서 가로 전체로 배경이 깔리게 */
const FullBleed = styled.div`
  margin: -16px -16px;
`;

const Section1 = styled.section`
  height: 52rem;
  position: relative;
  overflow: visible; /* 카드가 배경 밖으로 내려오게 */
  touch-action: pan-x;
`;

const HeroInner = styled.div`
  position: relative;
  height: 100%;
  & > * {
    height: 100%;
  }
  & > * > * {
    height: 100%;
  }
`;

const Slide = styled.div`
  position: relative;
  height: 100%;
  flex: 0 0 100%;
`;

/* 상단 65%만 배경 이미지 */
const HeroBg = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 60%;
  background: #e5e7eb url(${(p) => p.src}) center/cover no-repeat;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 45%,
      rgba(0, 0, 0, 0.08) 100%
    );
  }
`;

/* 카드+도트를 한 래퍼로 묶어 흐름 배치 → 도트가 카드 바로 아래에 위치 */
const OverlayWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  width: min(440px, calc(100% - 36px));
  display: grid;
  justify-items: center;
  gap: 10px;
  z-index: 2;
  pointer-events: none; /* 터치는 카드에만 */
`;

const OverlayCard = styled(LargeCard)`
  position: relative;
  width: 20rem;
  height: 32rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
`;

const Dots = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
`;
const Dot = styled.i`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? '#111827' : '#d1d5db')};
`;

/* ----------------------------- 작은 카드 ----------------------------- */
const SmallCard = styled.article`
  background: transparent;
  width: 20.375rem;
`;
const SImg = styled.img`
  width: 20.375rem;
  height: 11.375rem;
  border-radius: 16px;
  background: #e5e7eb url(${(p) => p.src}) center/cover no-repeat;
`;
const SmallBody = styled.div`
  padding: 12px 2px 24px;
  display: grid;
  gap: 8px;
`;
const TagRow = styled.div`
  width: 100%;
  margin-top: 6px;
  display: flex;
`;

const HeadBox = styled.div`
  width: 100%;
  display: grid;
  gap: 4px;
`;
const HeadTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
`;
const HeadDesc = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
  -webkit-line-clamp: 1;
`;
const MetaList = styled.div`
  width: 100%;
  margin-top: 6px;
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
`;
const MetaLine = styled.div`
  display: flex;
  gap: 8px;
`;
const MetaLabel = styled.span`
  min-width: 60px;
`;
const MetaValue = styled.span`
  color: #6b7280;
`;
const FooterRow = styled.div`
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-0_5, 0.125rem);
  color: #9ca3af;
`;

/* --------------------------- 섹션/페이지 --------------------------- */
const Section = styled.section`
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
`;
const SectionSub = styled.p`
  margin-top: -4px;
  color: #9ca3af;
  font-size: 12px;
`;
const SectionTitle = styled.h2`
  color: #27272a;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.75rem;
`;
const Page = styled.main`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  gap: 28px;

  padding: 16px;
`;
const BottomBarWrap = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
`;

/* =========================== 컴포넌트 =========================== */
const ProposalRecPage = () => {
  const [likedMap, setLikedMap] = useState({});
  const [scrappedMap, setScrappedMap] = useState({});
  const toggleLike = (id) => setLikedMap((m) => ({ ...m, [id]: !m[id] }));
  const toggleScrap = (id) => setScrappedMap((m) => ({ ...m, [id]: !m[id] }));

  const [bigIndex, setBigIndex] = useState(1);

  return (
    <>
      <Page>
        {/* 1) 상단 추천 - 큰 카드 (풀블리드 배경 + 오버레이 + 도트) */}
        <Section>
          <FullBleed>
            <Section1>
              <HeroInner>
                {big.length > 0 ? (
                  <Carousel gap='0' setIndex={setBigIndex}>
                    {big.map((item) => (
                      <Slide key={item.id}>
                        <HeroBg src={item.image} />
                        <OverlayWrap>
                          <Link to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                            <OverlayCard>
                              <LargeBody>
                                <Tag>
                                  <Badge
                                    variant='subtle'
                                    size='md'
                                    bg='#111827'
                                    color='white'
                                    borderRadius='999px'
                                    fontSize='12px'
                                    fontWeight='400'
                                  >
                                    {item.industry}
                                  </Badge>
                                </Tag>
                                <LargeTitle>{item.title}</LargeTitle>
                                <LargeDesc>{item.content}</LargeDesc>
                                <HeaderRow>
                                  <HeaderLeft>
                                    <Avatar.Root shape='full' size='xs'>
                                      <Avatar.Fallback
                                        name={item.user?.name}
                                        src={item.user?.profile_image}
                                      />
                                    </Avatar.Root>
                                    <UserName>{item.user?.name}</UserName>
                                  </HeaderLeft>
                                  <HeaderRight>
                                    {
                                      item.user?.proposer_level?.address
                                        ?.eupmyundong
                                    }{' '}
                                    · LV.{item.user?.proposer_level?.level}
                                  </HeaderRight>
                                </HeaderRow>
                                <InfoSection>
                                  <InfoBlock>
                                    <InfoTitle>희망 운영 시간</InfoTitle>
                                    <InfoValue>
                                      {item.business_hours?.start} -{' '}
                                      {item.business_hours?.end}
                                    </InfoValue>
                                  </InfoBlock>

                                  <InfoBlock>
                                    <InfoTitle>희망 장소</InfoTitle>
                                    <InfoValue>
                                      {item.address?.eupmyundong},{' '}
                                      {item.address?.road_detail} +{' '}
                                      {item.radius}
                                    </InfoValue>
                                  </InfoBlock>
                                </InfoSection>

                                <FooterRow>
                                  <StatsBar
                                    onClick={stop}
                                    onMouseDown={stop}
                                    onPointerDown={stop}
                                  >
                                    <LikeButton
                                      checked={!!likedMap[item.id]}
                                      onChange={() => toggleLike(item.id)}
                                    />
                                    <span>
                                      {item.likes_count +
                                        (likedMap[item.id] ? 1 : 0)}
                                    </span>

                                    <ScrapButton
                                      checked={!!scrappedMap[item.id]}
                                      onChange={() => toggleScrap(item.id)}
                                    />
                                    <span>
                                      {item.scraps_count +
                                        (scrappedMap[item.id] ? 1 : 0)}
                                    </span>
                                  </StatsBar>
                                </FooterRow>
                                <LargeBtn>수락하기</LargeBtn>
                              </LargeBody>
                            </OverlayCard>
                          </Link>

                          {/* 카드 바로 아래 중앙 도트 */}
                          <Dots>
                            {big.map((_, i) => (
                              <Dot key={i} $active={bigIndex === i + 1} />
                            ))}
                          </Dots>
                        </OverlayWrap>
                      </Slide>
                    ))}
                  </Carousel>
                ) : (
                  <>
                    <HeroBg />
                    <OverlayWrap>
                      <OverlayCard>
                        <EmptyState.Root
                          height='100%'
                          display='flex'
                          alignItems='center'
                          justifyContent='center'
                        >
                          <EmptyState.Content>
                            <EmptyState.Indicator>
                              <Sparkle />
                            </EmptyState.Indicator>
                            <EmptyState.Title>
                              추천 결과가 없어요
                            </EmptyState.Title>
                          </EmptyState.Content>
                        </EmptyState.Root>
                      </OverlayCard>
                    </OverlayWrap>
                  </>
                )}
              </HeroInner>
            </Section1>
          </FullBleed>
        </Section>

        {/* 2) 비슷한 제안 - 작은 카드 */}
        <Section>
          <SectionTitle>비슷한 제안, 골라봤어요</SectionTitle>
          <SectionSub>
            스크랩한 글을 바탕으로 비슷한 제안을 추천해드려요
          </SectionSub>
          {similar.length > 0 ? (
            <Carousel gap='1.5rem'>
              {similar.map((item) => (
                <Link key={item.id} to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                  <SmallCard key={item.id}>
                    <SImg src={item.image} />
                    <SmallBody>
                      <TagRow>
                        <Badge
                          variant='subtle'
                          size='md'
                          bg='#F4F4F5'
                          color='#27272A'
                          borderRadius='999px'
                          fontSize='12px'
                          fontWeight='400'
                        >
                          {item.industry}
                        </Badge>
                      </TagRow>
                      <HeadBox>
                        <HeadTitle>{item.title}</HeadTitle>
                        <HeadDesc>{item.subtitle}</HeadDesc>
                      </HeadBox>
                      <MetaList>
                        <MetaLine>
                          <MetaLabel>희망시간</MetaLabel>
                          <MetaValue>
                            {item.business_hours?.start} -{' '}
                            {item.business_hours?.end}
                          </MetaValue>
                        </MetaLine>
                        <MetaLine>
                          <MetaLabel>희망장소</MetaLabel>
                          <MetaValue>
                            {' '}
                            {item.address?.eupmyundong},{' '}
                            {item.address?.road_detail} + {item.radius}
                          </MetaValue>
                        </MetaLine>
                      </MetaList>

                      <FooterRow>
                        <UserRow>
                          <Avatar.Root shape='full' size='xs'>
                            <Avatar.Fallback
                              name={item.user?.name}
                              src={item.user?.profile_image}
                            />
                          </Avatar.Root>
                          <UserName>{item.user?.name}</UserName>
                        </UserRow>
                        <StatsRow
                          onClick={stop}
                          onMouseDown={stop}
                          onPointerDown={stop}
                        >
                          <LikeButton
                            checked={!!likedMap[item.id]}
                            onChange={() => toggleLike(item.id)}
                          />
                          <span>
                            {item.likes_count + (likedMap[item.id] ? 1 : 0)}
                          </span>

                          <ScrapButton
                            checked={!!scrappedMap[item.id]}
                            onChange={() => toggleScrap(item.id)}
                          />
                          <span>
                            {item.scraps_count + (scrappedMap[item.id] ? 1 : 0)}
                          </span>
                        </StatsRow>
                      </FooterRow>
                    </SmallBody>
                  </SmallCard>
                </Link>
              ))}
            </Carousel>
          ) : (
            <EmptyState.Root
              height='100%'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <Sparkle />
                </EmptyState.Indicator>
                <EmptyState.Title>추천 결과가 없어요</EmptyState.Title>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
        </Section>

        {/* 3) 성공률 높은 제안 - 작은 카드 */}
        <Section>
          <SectionTitle>성공률 높은 제안, 모아왔어요</SectionTitle>
          <SectionSub>
            관심 동네에서 펀딩 성공률이 높은 제안을 추천해드려요
          </SectionSub>
          {highSuccess.length > 0 ? (
            <Carousel gap='1.5rem'>
              {highSuccess.map((item) => (
                <Link key={item.id} to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                  <SmallCard key={item.id}>
                    <SImg src={item.image} />
                    <SmallBody>
                      <TagRow>
                        <Badge
                          variant='subtle'
                          size='md'
                          bg='#F4F4F5'
                          color='#27272A'
                          borderRadius='999px'
                          fontSize='12px'
                          fontWeight='400'
                        >
                          {item.industry}
                        </Badge>
                      </TagRow>
                      <HeadBox>
                        <HeadTitle>{item.title}</HeadTitle>
                        <HeadDesc>{item.subtitle}</HeadDesc>
                      </HeadBox>
                      <MetaList>
                        <MetaLine>
                          <MetaLabel>희망시간</MetaLabel>
                          <MetaValue>
                            {item.business_hours?.start} -{' '}
                            {item.business_hours?.end}
                          </MetaValue>
                        </MetaLine>
                        <MetaLine>
                          <MetaLabel>희망장소</MetaLabel>
                          <MetaValue>
                            {' '}
                            {item.address?.eupmyundong},{' '}
                            {item.address?.road_detail} + {item.radius}
                          </MetaValue>
                        </MetaLine>
                      </MetaList>
                      <FooterRow>
                        <UserRow>
                          <Avatar.Root shape='full' size='xs'>
                            <Avatar.Fallback
                              name={item.user?.name}
                              src={item.user?.profile_image}
                            />
                          </Avatar.Root>
                          <UserName>{item.user?.name}</UserName>
                        </UserRow>
                        <StatsRow
                          onClick={stop}
                          onMouseDown={stop}
                          onPointerDown={stop}
                        >
                          <LikeButton
                            checked={!!likedMap[item.id]}
                            onChange={() => toggleLike(item.id)}
                          />
                          <span>
                            {item.likes_count + (likedMap[item.id] ? 1 : 0)}
                          </span>

                          <ScrapButton
                            checked={!!scrappedMap[item.id]}
                            onChange={() => toggleScrap(item.id)}
                          />
                          <span>
                            {item.scraps_count + (scrappedMap[item.id] ? 1 : 0)}
                          </span>
                        </StatsRow>
                      </FooterRow>
                    </SmallBody>
                  </SmallCard>
                </Link>
              ))}
            </Carousel>
          ) : (
            <EmptyState.Root
              height='100%'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <Sparkle />
                </EmptyState.Indicator>
                <EmptyState.Title>추천 결과가 없어요</EmptyState.Title>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
        </Section>
      </Page>

      <BottomBarWrap>
        <BottomNavigation />
      </BottomBarWrap>
    </>
  );
};

export default ProposalRecPage;

/*목데이터 */
const big = [
  {
    id: 3,
    created_at: '30초 전',
    user: {
      name: '최**',
      profile_image: 'https://example.com/...',
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 2,
      },
    },
    title: '제안글 제목',
    content: '제안글 내용',
    industry: '카페/디저트',
    business_hours: {
      start: '09:00',
      end: '18:00',
    },
    address: {
      sido: '시도',
      sigungu: '시군구',
      eupmyundong: '읍면동',
      jibun_detail: '지번 주소 상세',
      road_detail: '도로명 주소 상세',
    },
    radius: '500m',
    image: ['https://example.com/...'],
    likes_count: 300,
    scraps_count: 178,
  },
  {
    id: 2,
    created_at: '30초 전',
    user: {
      name: '최**',
      profile_image: 'https://example.com/...',
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 2,
      },
    },
    title: '제안글 제목',
    content: '제안글 내용',
    industry: '카페/디저트',
    business_hours: {
      start: '09:00',
      end: '18:00',
    },
    address: {
      sido: '시도',
      sigungu: '시군구',
      eupmyundong: '읍면동',
      jibun_detail: '지번 주소 상세',
      road_detail: '도로명 주소 상세',
    },
    radius: '500m',
    image: ['https://example.com/...'],
    likes_count: 300,
    scraps_count: 178,
  },
];
const similar = [
  {
    id: 1,
    created_at: '30초 전',
    user: {
      name: '김**',
      profile_image: null,
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 2,
      },
    },
    title: '부담 없는 가격의 샐러드&샌드위치 브런치 카페',
    content:
      "건강 관리에 신경 쓰는 학생들이 많아졌지만, 근처 샐러드 가게는 가격이 비싸 자주 이용하기 어렵습니다. 저렴한 가격에 든든한 한 끼를 해결할 수 있는 '가성비 + 테이크아웃' 샐러드/샌드위치 전문점을 제안합니다. 모바일 선주문 시스템도 있으면 좋겠어요! 매일 다른 토핑과 소스로 신선함을 더하고, 닭가슴살이나 아보카도 등 건강한 재료를 듬뿍 넣어 만족도를 높이면 좋겠습니다. 간단한 음료나 스프를 세트 메뉴로 구성해서 점심시간 혼밥족에게 큰 편의를 제공해 줄 수 있을 거예요. 커피 없으면 서운할거에요…아이스 아메리카노 원두 2종류로 해서 판매해주시면 더욱 좋을 것 같아요! 이대, 서강대, 연대나 서강대 학생증 할인도 기대할게요~~ㅎㅎ",
    industry: '카페/디저트',
    business_hours: { start: '11:00', end: '21:00' },
    address: {
      sido: '서울특별시',
      sigungu: '마포구',
      eupmyundong: '대흥동',
      jibun_detail: '2-19',
      road_detail: '대흥로30길 6-8',
    },
    radius: '500m',
    image: [img_sandwich],
    likes_count: 300,
    scraps_count: 178,
  },
  {
    id: 2,
    created_at: '1시간 전',
    user: {
      name: '이**',
      profile_image: null,
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 1,
      },
    },
    title: '아침을 든든하게, 테이크아웃 커피&토스트 세트 전문점',
    content:
      "아침 식사를 거르는 학생들이 많지만, 든든한 한 끼를 저렴하게 먹을 곳은 부족합니다. 아침 등교 시간에 맞춰 따뜻한 토스트를 판매하는 테이크아웃 전문점을 제안합니다. 커피와 함께 세트 메뉴로 구성하면, 바쁜 아침에 큰 도움이 될 거예요. 카페인에 예민한 날을 위해 커피 외에 아이스티나 아샷추(아이스티 아메리카노 샷추가)같은 같이 먹을 음료도 꼭 있으면 좋겠어요!! 저렴하지만 속이 꽉 찬 메뉴를 개발하고, 모바일 앱을 통한 사전 주문 및 픽업 서비스를 제공해서 시간을 절약할 수 있도록 하면 너무 좋겠어요. 매일 바뀌는 '오늘의 토스트' 메뉴로 신선함을 더하면 좋을 것 같아요.  이대, 서강대, 연대 학생증 할인도 기대할게요~~ㅎㅎ",
    industry: '카페/디저트',
    business_hours: { start: '08:00', end: '22:00' },
    address: {
      sido: '서울특별시',
      sigungu: '서대문구',
      eupmyundong: '창천동',
      jibun_detail: '67-6',
      road_detail: '신촌로11길 39',
    },
    radius: '250m',
    image: [img_toast],
    likes_count: 240,
    scraps_count: 30,
  },
];
const highSuccess = [
  {
    id: 1,
    created_at: '30초 전',
    user: {
      name: '최**',
      profile_image: 'https://example.com/...',
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 2,
      },
    },
    title: '제안글 제목',
    content: '제안글 내용',
    industry: '카페/디저트',
    business_hours: {
      start: '09:00',
      end: '18:00',
    },
    address: {
      sido: '시도',
      sigungu: '시군구',
      eupmyundong: '읍면동',
      jibun_detail: '지번 주소 상세',
      road_detail: '도로명 주소 상세',
    },
    radius: '500m',
    image: ['https://example.com/...'],
    likes_count: 300,
    scraps_count: 178,
  },
  {
    id: 2,
    created_at: '30초 전',
    user: {
      name: '최**',
      profile_image: 'https://example.com/...',
      proposer_level: {
        address: {
          sido: '시도',
          sigungu: '시군구',
          eupmyundong: '읍면동',
        },
        level: 2,
      },
    },
    title: '제안글 제목',
    content: '제안글 내용',
    industry: '카페/디저트',
    business_hours: {
      start: '09:00',
      end: '18:00',
    },
    address: {
      sido: '시도',
      sigungu: '시군구',
      eupmyundong: '읍면동',
      jibun_detail: '지번 주소 상세',
      road_detail: '도로명 주소 상세',
    },
    radius: '500m',
    image: ['https://example.com/...'],
    likes_count: 300,
    scraps_count: 178,
  },
];
