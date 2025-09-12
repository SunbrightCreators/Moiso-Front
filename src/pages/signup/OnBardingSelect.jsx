import { useState } from 'react';
import styled from 'styled-components';
import { Button, CheckboxCard } from '@chakra-ui/react';
import { Dialog } from '../../components/common';
import { TopNavigation } from '../../components/common/navigation';
import { INDUSTRY } from '../../constants/enum';
import useModeStore from '../../stores/useModeStore';

const OnBoardingSelect = ({ onNextStep }) => {
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const { isProposerMode } = useModeStore();
  const toggleValue = (value) => {
    setSelectedIndustries((prev) => {
      const on = prev.includes(value);
      if (on) return prev.filter((v) => v !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const removeTag = (tagToRemove) => {
    setSelectedIndustries((prev) =>
      prev.filter((item) => item !== tagToRemove),
    );
  };

  const isButtonActive = selectedIndustries.length > 0;
  const topNavTitle = isProposerMode ? '지역주민 가입' : '창업자 가입';

  return (
    <PageContainer>
      <TopNavigation
        left='back'
        title={topNavTitle}
        subTitle='관심 업종 선택'
      />
      <MainContent>
        <HeadingSection>
          <h1>관심 업종을 선택해주세요</h1>
          <p>최대 3개까지 설정 가능해요</p>
        </HeadingSection>

        <ScrollableListContainer>
          <IndustryGrid>
            {INDUSTRY.map((item) => {
              const checked = selectedIndustries.includes(item.value);
              return (
                <StyledCheckboxCard
                  key={item.value}
                  checked={checked}
                  onCheckedChange={() => toggleValue(item.value)}
                  value={item.value}
                >
                  <CheckboxCard.HiddenInput />
                  <CheckboxCard.Content>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {item.icon}
                    </div>
                    <CheckboxCard.Label style={{ fontSize: '0.875rem' }}>
                      {item.label}
                    </CheckboxCard.Label>
                  </CheckboxCard.Content>
                </StyledCheckboxCard>
              );
            })}
          </IndustryGrid>
        </ScrollableListContainer>
      </MainContent>

      {selectedIndustries.length > 0 && (
        <TagContainer>
          {selectedIndustries.map((tag) => {
            const found = INDUSTRY.find((i) => i.value === tag);
            return (
              <Tag key={tag}>
                {found?.label ?? tag}
                <TagCloseButton onClick={() => removeTag(tag)}>
                  &times;
                </TagCloseButton>
              </Tag>
            );
          })}
        </TagContainer>
      )}

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          $active={isButtonActive}
          isDisabled={!isButtonActive}
          onClick={() =>
            isButtonActive && onNextStep?.({ industries: selectedIndustries })
          }
        >
          다음
        </StyledButton>
      </BottomButtonContainer>
      <Dialog />
    </PageContainer>
  );
};

export default OnBoardingSelect;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
`;
const ScrollableListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
const IndustryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const StyledCheckboxCard = styled(CheckboxCard.Root)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &[data-state='checked'] {
    border-radius: 0.375rem;
    border-color: #fde047;
    background: var(--colors-yellow-50, #fefce8);
  }

  &,
  &[data-focus],
  &[data-focus-visible],
  &:focus,
  &:focus-visible,
  &:focus-within {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => (props.$active ? 'black' : 'gray')};
  color: white;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
`;
const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f4f4f5;
  border-radius: 9999px;
  color: #27272a;
  font-size: 0.875rem;
`;
const TagCloseButton = styled.button`
  background: none;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  color: #a1a1aa;
`;
