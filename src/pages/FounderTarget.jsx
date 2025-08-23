import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, CheckboxCard } from '@chakra-ui/react';
import TopNavigation from '../components/common/TopNavigation';

// === 레이아웃용 styled-components 정의 ===
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;
const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
`;
const BottomButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 1.5rem;
  padding-top: 0;
  background-color: white;
`;
const HeadingSection = styled.div`
  margin-bottom: 1.5rem;
`;
const StyledHeading = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;
const StyledSubHeading = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
`;
const StyledButton = styled(Button)`
  background-color: ${(props) => (props.isactive ? 'black' : 'gray')};
  color: white;

  /* ✅ Chakra가 disabled를 aria-disabled/data-disabled로 줄 때도 완전 차단 */
  &:disabled,
  &[aria-disabled='true'],
  &[data-disabled] {
    background-color: #a1a1aa; /* gray */
    cursor: not-allowed;
    pointer-events: none; /* 클릭 자체 차단 */
  }
`;
const CardWrapper = styled.div`
  max-width: 100%;
  margin-bottom: 1rem;
`;

const FounderTarget = ({ onNextStep }) => {
  const [selectedTargets, setSelectedTargets] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedTargets((prevTargets) =>
      prevTargets.includes(value)
        ? prevTargets.filter((target) => target !== value)
        : [...prevTargets, value],
    );
  };

  const canNext = selectedTargets.length > 0; //  추가: 버튼 활성 조건

  return (
    <PageContainer>
      <TopNavigation
        left='back'
        title='창업자가입'
        subTitle='타겟 소비자 선택'
      />
      <MainContent>
        <HeadingSection>
          <StyledHeading>타겟 소비자를 선택해주세요</StyledHeading>
          <StyledSubHeading>
            타겟 소비자에 맞는 창업 제안을 추천해드릴게요!
          </StyledSubHeading>
        </HeadingSection>

        {/* 첫 번째 체크박스 카드 */}
        <CardWrapper>
          <CheckboxCard.Root
            maxW='100%'
            value='동네 주민'
            onChange={() => handleCheckboxChange('동네 주민')}
            isChecked={selectedTargets.includes('동네 주민')}
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Label>동네 주민</CheckboxCard.Label>
                <CheckboxCard.Description>
                  해당 동네에 거주하거나, 주로 생활하는 사람
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </CardWrapper>

        {/* 두 번째 체크박스 카드 */}
        <CardWrapper>
          <CheckboxCard.Root
            maxW='100%'
            value='외지인'
            onChange={() => handleCheckboxChange('외지인')}
            isChecked={selectedTargets.includes('외지인')}
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Label>외지인</CheckboxCard.Label>
                <CheckboxCard.Description>
                  잠시 방문하거나 관광/이용 목적으로 동네에 머무는 사람
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </CardWrapper>
      </MainContent>

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          isactive={canNext}
          isDisabled={!canNext}
          onClick={(e) => {
            if (!canNext) return;
            onNextStep?.({ targets: selectedTargets });
          }}
        >
          다음
        </StyledButton>
      </BottomButtonContainer>
    </PageContainer>
  );
};

export default FounderTarget;
