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
import { ReactComponent as FounderIcon } from '../assets/icons/founder.svg';
import { ReactComponent as ProposerIcon } from '../assets/icons/proposal.svg'; // styled-components import

const StyledLoginButton = styled(Button)`
  width: 22.375rem;
  height: 3rem;
  min-width: 4rem;
  padding: 0.125rem 1.75rem;
  gap: 0.75rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
  background: bg/default;
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

const StyledFounderIcon = styled(Icon)`
  width: 6.25rem;
  height: 1rem;
`;

const StyledProposerIcon = styled(Icon)`
  width: 8.3125rem;
  height: 1rem;
`;

function SignUpPage1() {
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
        <StyledLoginButton>
          <StyledFounderIcon as={FounderIcon} mr={2} />
        </StyledLoginButton>
        <StyledLoginButton>
          <StyledProposerIcon as={ProposerIcon} mr={2} />
        </StyledLoginButton>
      </VStack>
    </Flex>
  );
}

export default SignUpPage1;
