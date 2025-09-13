import {
  TopNavigation,
  BottomNavigation,
} from '../../components/common/navigation/index';
import styled from 'styled-components';
import EmptyIllust from '../../assets/icons/rewardempty.svg';
import { EmptyState } from '@chakra-ui/react';

const RewardPage = () => {
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
            <BorderedEmpty>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <img
                    src={EmptyIllust}
                    alt='리워드 없음'
                    width='32'
                    height='32'
                  />
                </EmptyState.Indicator>
                <CustomTitle>아직 발급된 리워드가 없어요</CustomTitle>
              </EmptyState.Content>
            </BorderedEmpty>
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

          <BorderedEmpty>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <img
                  src={EmptyIllust}
                  alt='리워드 없음'
                  width='var(--sizes-8, 2rem)'
                  height='var(--sizes-8, 2rem)'
                />
              </EmptyState.Indicator>
              <CustomTitle>아직 발급된 리워드가 없어요</CustomTitle>
            </EmptyState.Content>
          </BorderedEmpty>
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
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem); /* 150% */
`;

const SectionDesc = styled.p`
  flex: 1 0 0;
  color: var(--colors-text-subtle, #a1a1aa);

  /* sm/normal */
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: var(--line-heights-sm, 1.25rem); /* 142.857% */
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

  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-medium, 500);
  line-height: var(--line-heights-md, 1.5rem); /* 150% */
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e4e4e7;
  margin: 1rem 0;
`;
