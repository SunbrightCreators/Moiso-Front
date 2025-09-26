import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { EmptyState } from '@chakra-ui/react';
import { Carousel } from '../../components/common';
import { BottomNavigation } from '../../components/common/navigation';
import { BigCard, SmallCard } from '../../components/proposal';
import { ROUTE_PATH } from '../../constants/route';
import { ReactComponent as Sparkle } from '../../assets/icons/sparkle.svg';

import {
  useGetRecommendationCalcList,
  useGetRecommendationScrapList,
} from '../../apis/recommendations';

import {
  usePostProposalLike,
  usePostProposalScrap,
} from '../../apis/proposals';

/* =========================== 컴포넌트 =========================== */
const ProposalRecPage = () => {
  const { mutate: toggleLike } = usePostProposalLike();
  const { mutate: toggleScrap } = usePostProposalScrap();
  const [bigIndex, setBigIndex] = useState(1);

  const { data: calcRes } = useGetRecommendationCalcList();
  const { data: scrapRes } = useGetRecommendationScrapList();

  const big = calcRes?.data?.data ?? calcRes?.data ?? [];
  const similar = scrapRes?.data?.data ?? scrapRes?.data ?? [];
  const highSuccess = [];

  console.log('[REC_CALC]', calcRes);
  console.log('[REC_SCRAP]', scrapRes);

  return (
    <>
      <Page>
        <Section>
          <FullBleed>
            <Section1>
              <HeroInner>
                {big.length > 0 ? (
                  <Carousel gap='0' setIndex={setBigIndex}>
                    {big.map((item) => {
                      const bg = Array.isArray(item?.image)
                        ? item.image[0]
                        : item?.image || item?.thumbnail || '';
                      return (
                        <Slide key={item.id}>
                          <HeroBg src={bg} />
                          <OverlayWrap>
                            <Link to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                              <BigCard
                                item={item}
                                liked={!!item.liked}
                                scrapped={!!item.scrapped}
                                onToggleLike={() =>
                                  toggleLike({ proposal_id: item.id })
                                }
                                onToggleScrap={() =>
                                  toggleScrap({
                                    profile: 'proposer',
                                    proposal_id: item.id,
                                  })
                                }
                                stop={stop}
                              />
                            </Link>

                            <Dots>
                              {big.map((_, i) => (
                                <Dot key={i} $active={bigIndex === i + 1} />
                              ))}
                            </Dots>
                          </OverlayWrap>
                        </Slide>
                      );
                    })}
                  </Carousel>
                ) : (
                  <>
                    <HeroBg />
                    <OverlayWrap>
                      <EmptyCard>
                        <EmptyState.Root>
                          <EmptyState.Content>
                            <EmptyState.Indicator>
                              <Sparkle />
                            </EmptyState.Indicator>
                            <CustomTitle>추천 결과가 없어요</CustomTitle>
                          </EmptyState.Content>
                        </EmptyState.Root>
                      </EmptyCard>
                    </OverlayWrap>
                  </>
                )}
              </HeroInner>
            </Section1>
          </FullBleed>
        </Section>

        {/* 비슷한 제안 - 작은 카드 */}
        <Section>
          <SectionTitle>비슷한 제안, 골라봤어요</SectionTitle>
          <SectionSub>
            스크랩한 글을 바탕으로 비슷한 제안을 추천해드려요
          </SectionSub>

          {similar.length > 0 ? (
            <Carousel gap='1.5rem'>
              {similar.map((item) => (
                <Link key={item.id} to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                  <SmallCard
                    item={item}
                    liked={!!item.liked}
                    scrapped={!!item.scrapped}
                    onToggleLike={() => toggleLike({ proposal_id: item.id })}
                    onToggleScrap={() =>
                      toggleScrap({
                        profile: 'proposer',
                        proposal_id: item.id,
                      })
                    }
                    stop={stop}
                  />
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
                <CustomTitle>추천 결과가 없어요</CustomTitle>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
        </Section>

        {/*성공률 높은 제안 - 작은 카드 */}
        <Section>
          <SectionTitle>성공률 높은 제안, 모아왔어요</SectionTitle>
          <SectionSub>
            관심 동네에서 펀딩 성공률이 높은 제안을 추천해드려요
          </SectionSub>

          {highSuccess.length > 0 ? (
            <Carousel gap='1.5rem'>
              {highSuccess.map((item) => (
                <Link key={item.id} to={ROUTE_PATH.PROPOSAL_DETAIL(item.id)}>
                  <SmallCard
                    item={item}
                    liked={!!item.liked}
                    scrapped={!!item.scrapped}
                    onToggleLike={() => toggleLike({ proposal_id: item.id })}
                    onToggleScrap={() =>
                      toggleScrap({ profile: 'proposer', proposal_id: item.id })
                    }
                    stop={stop}
                  />
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
                <CustomTitle>추천 결과가 없어요</CustomTitle>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
        </Section>
      </Page>

      <BottomNavigation />
    </>
  );
};

export default ProposalRecPage;

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

/* 카드+도트*/
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
  pointer-events: none;
`;

const CustomTitle = styled(EmptyState.Title)`
  color: var(--colors-text-default, #27272a);
  text-align: center;

  font: var(--text-md-semibold);
`;
const CustomDescription = styled(EmptyState.Description)`
  color: var(--colors-text-muted, #52525b);
  text-align: center;

  /* sm/normal */
  font: var(--text-sm-normal);
  font-size: var(--font-sizes-sm, 0.875rem);
`;

const EmptyCard = styled.div`
  width: 20rem;
  height: 32rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  background: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  pointer-events: auto;
`;

/* 도트 */
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

const BottomBarWrap = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
`;
