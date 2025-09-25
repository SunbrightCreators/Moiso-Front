import styled from 'styled-components';
import { EmptyState } from '@chakra-ui/react';
import {
  TopNavigation,
  BottomNavigation,
} from '../../components/common/navigation';
import { ReactComponent as Reward } from '../../assets/icons/rewardempty.svg';
import { useGetRewardList } from '../../apis/fundings';

const RewardPage = () => {
  // 레벨 / 펀딩(= GIFT + COUPON) 조회
  const {
    data: levelRes,
    isLoading: levelLoading,
    isError: levelError,
  } = useGetRewardList('LEVEL');
  const {
    data: giftRes,
    isLoading: giftLoading,
    isError: giftError,
  } = useGetRewardList('GIFT');
  const {
    data: couponRes,
    isLoading: couponLoading,
    isError: couponError,
  } = useGetRewardList('COUPON');

  // 응답 → 배열만 뽑는 유틸(어떤 스키마여도 안전)
  const toList = (res) => {
    const d = res?.data ?? res;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.list)) return d.list;
    return [];
  };

  const levelRewards = toList(levelRes);
  const giftRewards = toList(giftRes);
  const couponRewards = toList(couponRes);
  const fundingRewards = [...giftRewards, ...couponRewards];

  return (
    <Page>
      <TopNavigation title='리워드 ' />

      <Main>
        <Section>
          <SectionHeader>
            <SectionTitle>펀딩 리워드</SectionTitle>
            <SectionDesc>
              후원에 성공하여 발급된 리워드예요. 기한 제한 없이 사용 가능하며,
              매장에서 직원에게 코드 입력을 요청하세요.
            </SectionDesc>
          </SectionHeader>
          <EmptyCard aria-label='펀딩 리워드 비어있음'>
            {giftLoading || couponLoading ? (
              <BorderedEmpty>
                <EmptyState.Content>
                  <CustomTitle>불러오는 중…</CustomTitle>
                </EmptyState.Content>
              </BorderedEmpty>
            ) : giftError || couponError ? (
              <BorderedEmpty>
                <EmptyState.Content>
                  <CustomTitle>리워드 불러오기에 실패했어요</CustomTitle>
                </EmptyState.Content>
              </BorderedEmpty>
            ) : fundingRewards.length > 0 ? (
              <RewardList>
                {fundingRewards.map((r) => (
                  <RewardItem key={r.id ?? `${r.code}-${r.category}`}>
                    <RewardLeft>
                      <RewardTitle>{r.title ?? r.name ?? '리워드'}</RewardTitle>
                      {(r.expire_at || r.expires_at) && (
                        <RewardMeta>
                          만료: {r.expire_at ?? r.expires_at}
                        </RewardMeta>
                      )}
                    </RewardLeft>
                    {r.code && <RewardCode>{r.code}</RewardCode>}
                  </RewardItem>
                ))}
              </RewardList>
            ) : (
              <BorderedEmpty aria-label='펀딩 리워드 비어있음'>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <Reward width={32} height={32} />
                  </EmptyState.Indicator>
                  <CustomTitle>아직 발급된 리워드가 없어요</CustomTitle>
                </EmptyState.Content>
              </BorderedEmpty>
            )}
          </EmptyCard>
        </Section>

        <Divider />

        <Section>
          <SectionHeader>
            <SectionTitle>레벨 리워드</SectionTitle>
            <SectionDesc>
              전월 지역주민 레벨로 발급된 리워드예요. 이번 달 안에 사용하지
              않으면 소멸돼요.
            </SectionDesc>
          </SectionHeader>

          {levelLoading ? (
            <BorderedEmpty>
              <EmptyState.Content>
                <CustomTitle>불러오는 중…</CustomTitle>
              </EmptyState.Content>
            </BorderedEmpty>
          ) : levelError ? (
            <BorderedEmpty>
              <EmptyState.Content>
                <CustomTitle>리워드 불러오기에 실패했어요</CustomTitle>
              </EmptyState.Content>
            </BorderedEmpty>
          ) : levelRewards.length > 0 ? (
            <RewardList>
              {levelRewards.map((r) => (
                <RewardItem key={r.id ?? `${r.code}-LEVEL`}>
                  <RewardLeft>
                    <RewardTitle>
                      {r.title ?? r.name ?? '레벨 리워드'}
                    </RewardTitle>
                    {(r.expire_at || r.expires_at) && (
                      <RewardMeta>
                        만료: {r.expire_at ?? r.expires_at}
                      </RewardMeta>
                    )}
                  </RewardLeft>
                  {r.code && <RewardCode>{r.code}</RewardCode>}
                </RewardItem>
              ))}
            </RewardList>
          ) : (
            <BorderedEmpty aria-label='레벨 리워드 비어있음'>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <Reward width={32} height={32} />
                </EmptyState.Indicator>
                <CustomTitle>아직 발급된 리워드가 없어요</CustomTitle>
              </EmptyState.Content>
            </BorderedEmpty>
          )}
        </Section>
      </Main>

      <BottomNavigation />
    </Page>
  );
};

export default RewardPage;

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  flex-flow: column nowrap;
`;

const Main = styled.main`
  flex: 1;
  flex-grow: 1;
  padding: 0 1rem 5.25rem;
`;

const Section = styled.section`
  padding-top: 1rem;
`;

const SectionHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--colors-text-default, #27272a);

  /* md/semibold */
  font: var(--text-md-semibold);
`;

const SectionDesc = styled.p`
  flex: 1 0 0;
  color: var(--colors-text-subtle, #a1a1aa);

  /* sm/normal */
  font: var(--text-sm-normal);
`;

const BorderedEmpty = styled(EmptyState.Root)`
  display: flex;
  width: 22.375rem;
  height: 10.5rem;
  margin: 0 auto;
  padding: var(--spacing-12, 3rem);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4, 1rem);
  align-self: stretch;

  border: 0.5px solid var(--colors-border-default, #e4e4e7);
  border-radius: var(--radii-lg, 0.5rem);
`;
const EmptyCard = styled.div`
  border-radius: 0.75rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const CustomTitle = styled(EmptyState.Title)`
  color: var(--colors-text-subtle, #a1a1aa);
  text-align: center;

  font: var(--text-md-medium);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e4e4e7;
  margin: 1rem 0;
`;
const RewardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

const RewardItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.75rem;
  background: #fff;
`;

const RewardLeft = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const RewardTitle = styled.span`
  color: #27272a;
  font-weight: 600;
  font-size: 0.95rem;
`;

const RewardMeta = styled.span`
  color: #a1a1aa;
  font-size: 0.8rem;
`;

const RewardCode = styled.code`
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  background: #f4f4f5;
  padding: 0.25rem 0.5rem;
  color: #27272a;
`;
