import { Flex, VStack, Button, Box } from '@chakra-ui/react';
import logo from '../../assets/icons/logo.svg';
import styled from 'styled-components';
import useModeStore from '../stores/useModeStore';

const StyledLoginButton = styled(Button)`
  width: 22.375rem;
  height: 3rem;
  min-width: 4rem;
  padding: 0.125rem 1.75rem;
  gap: 0.75rem;
  flex-shrink: 0;
  border-radius: var(--radii-md, 0.375rem);
  background: var(--colors-yellow-focusRing, #facc15);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
`;
const StyledLoginButton2 = styled(Button)`
  width: 22.375rem;
  height: 3rem;
  min-width: 4rem;
  padding: 0.125rem 1.75rem;
  gap: 0.75rem;
  flex-shrink: 0;
  border-radius: var(--radii-md, 0.375rem);
  background: var(--colors-blue-solid, #2563eb);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: var(--line-heights-md, 1.5rem);
`;

const LogoBox = styled(Box)`
  display: flex;
  width: 13.4375rem;
  height: 10.875rem;
  flex-shrink: 0;
  padding: 3.25rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 0.4375rem;
  background: var(--Surface, #ffffffff);
`;

function SignUpPage1({ onNextStep }) {
  const setIsProposerMode = useModeStore((s) => s.setIsProposerMode);
  // '창업자로 가입' 버튼 클릭 시 실행될 함수
  const handleFounderClick = () => {
    setIsProposerMode(false); // 창업자 모드
    onNextStep?.();
  };

  const handleResidentClick = () => {
    setIsProposerMode(true); // 주민 모드
    onNextStep?.();
  };

  return (
    <Flex direction='column' minH='100%' font='font: var(--text-sm-semibold);'>
      <VStack spacing={4} flex='1' justify='center'>
        <LogoBox>
          <img src={logo} alt='서비스 로고' />
        </LogoBox>
      </VStack>

      <VStack spacing={3} w='100%' maxW='md' mx='auto' mt='1.44rem' pb='5.5rem'>
        <StyledLoginButton onClick={handleResidentClick}>
          지역주민으로 가입
        </StyledLoginButton>
        <StyledLoginButton2 onClick={handleFounderClick}>
          창업자로 가입
        </StyledLoginButton2>
      </VStack>
    </Flex>
  );
}

export default SignUpPage1;
