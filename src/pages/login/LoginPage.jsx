import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button, Field, Input } from '@chakra-ui/react';
import { usePostLogin } from '../../apis/accounts';
import { TopNavigation } from '../../components/common/navigation';
import { ROUTE_PATH } from '../../constants/route';
import logo from '../../assets/icons/symbol.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const { mutate: postLogin } = usePostLogin();

  const onSubmit = async (data) => {
    postLogin(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          console.log('login success:', data);
          navigate(ROUTE_PATH.PROPOSAL);
        },
        onError: (err) => {
          console.error('login failed:', err);
        },
      },
    );
  };

  return (
    <SLayout>
      <TopNavigation left='back' title='로그인 ' />
      <SMain>
        <SImg src={logo} alt='서비스 로고' />
        <SForm onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field.Root invalid={!!errors.email}>
            <Field.Label htmlFor='email'>이메일</Field.Label>
            <StyledInput
              id='email'
              placeholder='이메일 입력'
              autoComplete='email'
              aria-invalid={!!errors.email}
              {...register('email', {
                required: '이메일을 입력해 주세요.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다.',
                },
              })}
            />
            <Field.ErrorText id='email-error'>
              {errors.email?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label htmlFor='password'>비밀번호</Field.Label>
            <StyledInput
              type='password'
              placeholder='비밀번호 입력'
              autoComplete='current-password'
              aria-invalid={!!errors.password}
              {...register('password', {
                required: '비밀번호를 입력해 주세요.',
                minLength: {
                  value: 6,
                  message: '비밀번호는 6자리 이상이어야 합니다.',
                },
              })}
            />
            <Field.ErrorText id='password-error'>
              {errors.password?.message}
            </Field.ErrorText>
          </Field.Root>
          <LoginButton type='submit' mt='1.5rem'>
            로그인
          </LoginButton>
        </SForm>
      </SMain>
    </SLayout>
  );
};

export default LoginPage;

const SLayout = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: inherit;
  height: inherit;
`;
const SMain = styled.main`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;

  height: inherit;
`;
const SForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
`;
const SImg = styled.img`
  height: 4.5rem;
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
