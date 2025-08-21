import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@chakra-ui/react';
import TopNavigation from '../components/common/TopNavigation';
import Timepicker from '../components/common/Timepicker';
import { useForm } from 'react-hook-form';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

  &:disabled,
  &[aria-disabled='true'],
  &[data-disabled] {
    background-color: #a1a1aa;
    cursor: not-allowed;
    pointer-events: none; /* ✅ 클릭 차단 */
  }
`;

const FounderTime = ({ onNextStep }) => {
  const { register, watch } = useForm();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const isButtonActive = startTime && endTime;

  return (
    <PageContainer>
      <TopNavigation
        left='back'
        title='창업자 가입'
        subTitle='선호 운영 시간대'
      />
      <MainContent>
        <HeadingSection>
          <StyledHeading>선호하는 운영 시간을 입력해주세요</StyledHeading>
          <StyledSubHeading>
            선호하는 운영 시간에 맞는 창업 제안을 추천해드릴게요!
          </StyledSubHeading>
        </HeadingSection>
        <Timepicker register={register} />
      </MainContent>

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          isactive={isButtonActive}
          isDisabled={!isButtonActive}
          onClick={(e) => {
            if (!isButtonActive) return;
            onNextStep?.({ startTime, endTime });
          }}
        >
          다음
        </StyledButton>
      </BottomButtonContainer>
    </PageContainer>
  );
};

export default FounderTime;
