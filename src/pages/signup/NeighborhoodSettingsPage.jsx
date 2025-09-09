import React, { useState } from 'react';
import TopNavigation from '../components/common/navigation/TopNavigation';
import InputSearch from '../components/common/input/InputSearch';
import styled from 'styled-components';
import { Button } from '@chakra-ui/react';
import Dialog from '../components/common/Dialog';
import useDialogStore from '../stores/useDialogStore';
import useModeStore from '../stores/useModeStore';

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

const SearchInputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const NeighborhoodList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NeighborhoodItem = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem;
  border-bottom: 0.0625rem solid #e2e8f0;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;
const StyledButton = styled(Button)`
  background-color: ${(props) => (props.isAuthComplete ? 'gray' : 'black')};
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

const neighborhoods = [
  '서울 서대문구 대현동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
  '서울 서대문구 대신동',
];

const NeighborhoodSettingsPage = ({ onNextStep }) => {
  const { setConfirmDialog, setAlertDialog } = useDialogStore();
  const [isAuthComplete, setIsAuthComplete] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);

  const { isProposerMode } = useModeStore();

  const topNavTitle = isProposerMode ? '제안자 가입' : '창업자 가입';
  const topNavSubTitle = isProposerMode ? '제안 동네 설정' : '관심 동네 설정';

  const handleAuthentication = (neighborhood) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; //시뮬레이션용 !!!!

      if (isSuccess) {
        setAlertDialog({
          title: '동네 인증이 완료되었어요',
          content: `현재 위치가 '${neighborhood}'으로 확인되었습니다.\n이제 동네 활동을 시작할 수 있어요.`,
          actionText: '확인',
          onAction: () => {
            console.log('인증 완료 및 확인');
            setIsAuthComplete(true);
            setSelectedNeighborhoods((prev) => [...prev, neighborhood]);
          },
        });
      } else {
        setAlertDialog({
          title: '현재 위치로 인증할 수 없어요',
          content: `현재 위치가 '신사동'이에요.\n동네 인증은 ${neighborhood}에서만 할 수 있어요.`,
          actionText: '확인',
        });
      }
    }, 1000);
  };

  const handleItemClick = (neighborhood) => {
    if (selectedNeighborhoods.length >= 2) {
      return;
    }
    setConfirmDialog({
      title: '동네 인증이 필요해요',
      content: `관심 동네로 등록하려면\n'${neighborhood}' 인증을 완료해야 합니다.`,
      actionText: '인증하기',
      onAction: () => handleAuthentication(neighborhood),
      onCancel: () => {
        console.log('인증 취소');
      },
    });
  };

  return (
    <PageContainer>
      <TopNavigation
        left='back'
        title={topNavTitle}
        subTitle={topNavSubTitle}
      />
      <MainContent>
        <HeadingSection>
          <h1>우리 동네를 설정해주세요</h1>
          <p>최대 2개까지 설정 가능해요</p>
        </HeadingSection>
        <SearchInputContainer>
          <InputSearch />
        </SearchInputContainer>

        <ScrollableListContainer>
          <h3>동네 목록</h3>
          <NeighborhoodList>
            {neighborhoods.map((neighborhood, index) => (
              <NeighborhoodItem
                key={index}
                onClick={() => handleItemClick(neighborhood)}
              >
                {neighborhood}
              </NeighborhoodItem>
            ))}
          </NeighborhoodList>
        </ScrollableListContainer>
      </MainContent>
      {selectedNeighborhoods.length > 0 && (
        <TagContainer>
          {selectedNeighborhoods.map((neighborhood, index) => (
            <Tag key={index}>{neighborhood}</Tag>
          ))}
        </TagContainer>
      )}

      <BottomButtonContainer>
        <StyledButton
          width='100%'
          size='lg'
          disabled={!isAuthComplete}
          onClick={() => onNextStep?.({ neighborhoods: selectedNeighborhoods })}
        >
          다음
        </StyledButton>
      </BottomButtonContainer>

      <Dialog />
    </PageContainer>
  );
};

export default NeighborhoodSettingsPage;
