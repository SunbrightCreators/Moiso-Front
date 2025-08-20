import {
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  Icon,
} from '@chakra-ui/react';
import logo from '../assets/icons/logo.svg';
import styled from 'styled-components';
import useModeStore from '../stores/useModeStore';

const StyledLoginButton = styled(Button)`
  width: 22.375rem;
  height: 3rem;
  min-width: 4rem;
  padding: 0.125rem 1.75rem;
  gap: 0.75rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
  background: #303742;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font: var(--text-sm-semibold);
`;

const LogoBox = styled(Box)`
  display: flex;
  width: 10.875rem;
  height: 10.875rem;
  padding: 3.25rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 0.4375rem;
  background: var(--Surface, #f0f4fa);
  font: var(--text-sm-semibold);
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
          <img src={logo} alt='서비스 로고' width='150' height='150' />
        </LogoBox>
        <VStack spacing={2}>
          <Heading as='h1'>서비스 슬로건</Heading>
          <Text>주민과 창업자를 이어주는 크라우드펀딩 플랫폼</Text>
        </VStack>
      </VStack>

      <VStack spacing={3} w='100%' maxW='md' mx='auto' mt='1.44rem' pb='5.5rem'>
        <StyledLoginButton onClick={handleFounderClick}>
          창업자로 가입
        </StyledLoginButton>
        <StyledLoginButton onClick={handleResidentClick}>
          지역주민으로 가입
        </StyledLoginButton>
      </VStack>
    </Flex>
  );
}

export default SignUpPage1;
