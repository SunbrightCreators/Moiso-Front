import { Box, Flex, VStack, Input, Button } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import logo from '../assets/icons/logo.svg';
import { useForm } from 'react-hook-form';

const LogoArea = styled(Box)`
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
  border-radius: 0.4375rem;
  background: var(--Surface, #f0f4fa);
`;

const LoginButton = styled(Button)`
  display: flex;
  width: 22.375rem;
  height: 3.5rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: var(--Fill-primary, #303742);
`;
const StyledInput = styled(Input)`
  display: flex;
  width: 22.375rem;
  height: 3.5rem;
  padding: 0 1rem;
  align-items: center;
  gap: 0.75rem;
  align-self: stretch;
  border-radius: 0.5rem;
  border: 1px solid var(--Stroke, #cad1db);
  background: var(--White, #fff);
`;
const StyledFormLabel = styled(FormLabel)`
  width: 22.375rem;
  color: var(--Text-primary, #1c2129);
  font-family: Manrope;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.375rem; /* 137.5% */
  margin-bottom: 0.3rem;
`;
const SFormErrorMessage = styled(FormErrorMessage)`
  color: var(--Error, #e55050);

  /* Interface/Description/Main */
  font-family: Manrope;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    if (data.email !== 'test@example.com' || data.password !== 'password') {
      setError('root', {
        type: 'manual',
        message: '이메일 또는 비밀번호가 일치하지 않습니다.',
      });
    } else {
      console.log('로그인 성공:', data);
    }
  };

  return (
    <Flex direction='column' minH='100%'>
      <TopNavigation left='back' title='로그인 ' />

      <VStack spacing={6} flex='1' p={6} alignItems='center' mt='5.44rem'>
        <LogoArea mt={8}>
          <img src={logo} alt='서비스 로고' width='150' height='150' />
        </LogoArea>

        <VStack
          as='form'
          onSubmit={handleSubmit(onSubmit)}
          spacing={4}
          w='100%'
          maxW='md'
          mt='2.25rem'
        >
          <FormControl isInvalid={errors.email}>
            <StyledFormLabel>이메일</StyledFormLabel>
            <StyledInput
              type='email'
              placeholder='이메일 입력'
              {...register('email', {
                required: '이메일을 입력해 주세요.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다.',
                },
              })}
            />
            <SFormErrorMessage>
              {errors.email && errors.email.message}
            </SFormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <StyledFormLabel>비밀번호</StyledFormLabel>
            <StyledInput
              type='password'
              placeholder='비밀번호 입력'
              {...register('password', {
                required: '비밀번호를 입력해 주세요.',
                minLength: {
                  value: 6,
                  message: '비밀번호는 6자리 이상이어야 합니다.',
                },
              })}
            />
            <SFormErrorMessage>
              {errors.password && errors.password.message}
            </SFormErrorMessage>
          </FormControl>

          <LoginButton type='submit' mt='1.5rem'>
            이메일 로그인
          </LoginButton>
        </VStack>
      </VStack>
    </Flex>
  );
}
