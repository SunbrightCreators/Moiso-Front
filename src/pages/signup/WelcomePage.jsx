import React from 'react';
import styled from 'styled-components';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/common/navigation/TopNavigation';
import useModeStore from '../../stores/useModeStore';
import { ROUTE_PATH } from '../../constants/route';
import founderWelcomeGif from '../../assets/icons/symbol_animated_founder.gif';
import proposerWelcomeGif from '../../assets/icons/symbol_animated_proposer.gif';

const WelcomePage = ({ data }) => {
  //인덱스에서 데이터 가져오기
  const { isProposerMode } = useModeStore();
  const name = data?.account?.name || '회원';

  const topNavTitle = isProposerMode ? '지역주민 가입' : '창업자 가입';
  const mainText = `${name}님, 반가워요!`;
  const subText = isProposerMode
    ? '우리동네 창업을 후원하러 가볼까요?'
    : '우리동네 창업 제안을 보러 가볼까요?';

  const mainImageSrc = isProposerMode ? proposerWelcomeGif : founderWelcomeGif;

  const navigate = useNavigate();

  const handleNavBtnClick = () => {
    console.log('ROUTE_PATH.PROPOSAL:', ROUTE_PATH.PROPOSAL); // 디버깅+ 경로 확인
    try {
      navigate(ROUTE_PATH.PROPOSAL);
      console.log('네비게이트 실행됨'); // 네비게이트 실행됐는지 확인용-왜 안되지
    } catch (error) {
      console.error('네비게이트 에러:', error);
    }
  };

  return (
    <PageContainer>
      <TopNavigation left='back' title={topNavTitle} subTitle='' />
      <MainContent>
        <CenterTextWrapper>
          <MainText>{mainText}</MainText>
          <SubText>{subText}</SubText>
        </CenterTextWrapper>
        <img
          src={mainImageSrc}
          alt='환영 애니메이션'
          style={{ width: '100%', maxWidth: '300px' }}
        />
      </MainContent>

      <BottomButtonContainer>
        <NavBtn onClick={handleNavBtnClick} width='100%' size='lg'>
          확인
        </NavBtn>
      </BottomButtonContainer>
    </PageContainer>
  );
};

export default WelcomePage;

// === 레이아웃용 styled-components 정의 ===
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: space-between;
`;
const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;
const BottomButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 1.5rem;
  padding-top: 0;
  background-color: white;
`;

const NavBtn = styled(Button)`
  background-color: black;
  color: white;
`;

const CenterTextWrapper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;
const MainText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;
const SubText = styled.p`
  font-size: 1rem;
  color: #a1a1aa;
`;
