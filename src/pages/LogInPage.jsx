import { Field, Input, Button } from '@chakra-ui/react';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import logo from '../assets/icons/심볼.svg';
import { useForm } from 'react-hook-form';
import { postLogin } from '../apis/accounts';
import useModeStore from '../stores/useModeStore';
import { ROUTE_PATH } from '../constants/route';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsProposerMode } = useModeStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const response = await postLogin(data.email, data.password);
      const { profile, ...token } = response.data;
      localStorage.setItem('token', JSON.stringify(token));
      setIsProposerMode(profile.includes('proposer'));
      navigate(ROUTE_PATH.PROPOSAL);
    } catch (error) {}
  };

  return (
    <SLayout>
      <TopNavigation left='back' title='로그인 ' />
      <SMain>
        <SImg src={logo} alt='서비스 로고' />
        <SForm onSubmit={handleSubmit(onSubmit)}>
          <Field.Root>
            <Field.Label>이메일</Field.Label>
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
            <Field.ErrorText>
              {errors.email && errors.email.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root>
            <Field.Label>비밀번호</Field.Label>
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
            <Field.ErrorText>
              {errors.password && errors.password.message}
            </Field.ErrorText>
          </Field.Root>
          <LoginButton type='submit' mt='1.5rem'>
            이메일 로그인
          </LoginButton>
        </SForm>
      </SMain>
    </SLayout>
  );
};

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

export default LoginPage;
