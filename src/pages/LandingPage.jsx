import { Flex, VStack, Heading, Text, Button, Box } from '@chakra-ui/react';
import logo from '../assets/icons/logo.svg';
import styled from 'styled-components'; // styled-components import
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';

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

const StyledSignupButton = styled(Button)`
  width: 22.375rem;
  height: 3rem;
  min-width: 4rem;
  padding: 0.125rem 1.75rem;
  gap: 0.75rem;
  flex-shrink: 0;
  border-radius: var(--radii-md, 0.375rem);
  background: var(--colors-gray-subtle, #f4f4f5);
  color: black;
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

function LandingPage() {
  return (
    <Flex direction='column' minH='100vh' font='font: var(--text-sm-semibold);'>
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
        {/* 로그인 버튼 클릭 시 ROUTE_PATH.LOGIN 경로로 이동 */}
        <StyledLoginButton as={Link} to={ROUTE_PATH.LOGIN}>
          로그인
        </StyledLoginButton>

        {/* 회원가입 버튼 클릭 시 ROUTE_PATH.SIGNUP 경로로 이동 */}
        <StyledSignupButton as={Link} to={ROUTE_PATH.SIGNUP}>
          회원가입
        </StyledSignupButton>
      </VStack>
    </Flex>
  );
}

export default LandingPage;
