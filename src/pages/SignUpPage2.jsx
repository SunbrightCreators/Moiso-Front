import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import TopNavigation from '../components/common/TopNavigation';
import Dialog from '../components/common/Dialog';
import useDialogStore from '../stores/useDialogStore';

// --- 스타일 정의 ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: white;
`;

const ContentArea = styled.main`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonArea = styled.div`
  padding: 0.5rem 1rem 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  color: #27272a;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`;

const GenderOption = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  ${(props) =>
    props.isSelected
      ? css`
          background: #303742;
          color: white;
          border: 0.0625rem solid #303742;
        `
      : css`
          background: white;
          color: #303742;
          border: 0.0625rem solid #cad1db;
        `}
`;

const ChevronIcon = styled.span`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-top: 0.125rem solid #a6afbd;
  border-right: 0.125rem solid #a6afbd;
  transform: rotate(45deg);
`;

const ChevronBtn = styled.button`
border;);
background: transparent;
padding: 0.125rem;
cursor:pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  > div {
    margin-bottom: 1.5rem;
  }
  .gender-container {
    margin-bottom: 2rem;
  }
  > div:last-child {
    margin-bottom: 0;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'] {
    width: 22.375rem;
    height: 3.5rem; /* 56px */
    padding: 0 1rem; /* 0 16px */
    border-radius: 0.5rem; /* 8px */
    border: 0.0625rem solid #cad1db; /* 1px */
    font-size: 1rem; /* 16px */
    box-sizing: border-box;
    &::placeholder {
      color: #cad1db;
    }
  }

  .gender-group {
    display: flex;
    gap: 0.5rem;
  }

  .agreement-group {
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }

  .agreement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    padding: 0.625rem 0.25rem;
  }

  .agreement-group .agreement-item:first-child {
    border-bottom: 0.0625rem solid #f4f4f5;
  }

  .agreement-item-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.disabled ? '#a6afbd' : '#303742')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

// --- 리액트 컴포넌트 정의 ---

function SignUpPage2() {
  const setAlertDialog = useDialogStore((s) => s.setAlertDialog);
  const TERMS_TXT = `여기에 서비스 이용약관 전문을 넣으세요...`;
  const PRIVACY_TXT = `여기에 개인정보 수집 및 이용 동의 전문을 넣으세요...`;
  const MARKETING_TXT = `여기에 마케팅 수신 동의 안내를 넣으세요...`;

  const openTerms = () =>
    setAlertDialog({
      title: '서비스 이용약관',
      content: TERMS_TXT,
      actionText: '닫기',
    });

  const openPrivacy = () =>
    setAlertDialog({
      title: '개인정보 수집 및 이용동의',
      content: PRIVACY_TXT,
      actionText: '닫기',
    });

  const openMarketing = () =>
    setAlertDialog({
      title: '마케팅 및 수신동의',
      content: MARKETING_TXT,
      actionText: '닫기',
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
  });

  const [genderUI, setGenderUI] = useState('');

  useEffect(() => {
    register('gender', { required: '성별을 선택해주세요.' });
  }, [register]);

  const allAgreed = watch('allAgreed');
  useEffect(() => {
    setValue('terms', allAgreed, { shouldValidate: true });
    setValue('privacy', allAgreed, { shouldValidate: true });
    setValue('marketing', allAgreed);
  }, [allAgreed, setValue]);

  const onSubmit = (data) => {
    alert('회원가입이 완료되었습니다.');
  };

  return (
    <Container>
      <TopNavigation left='back' title='회원가입' />
      <ContentArea>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormLabel>이메일</FormLabel>
            <input
              type='email'
              placeholder='이메일 입력'
              {...register('email', {
                required: '이메일은 필수 항목입니다.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '유효한 이메일 형식이 아닙니다.',
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          <div>
            <FormLabel>비밀번호</FormLabel>
            <input
              type='password'
              placeholder='비밀번호 입력'
              {...register('password', {
                required: '비밀번호는 필수 항목입니다.',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다.',
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <div>
            <FormLabel>이름</FormLabel>
            <input
              type='text'
              placeholder='이름 입력'
              {...register('name', { required: '이름은 필수 항목입니다.' })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div>
            <FormLabel>생년월일 6자리</FormLabel>
            <input
              type='text'
              placeholder='ex) 020918'
              {...register('birthdate', {
                required: '생년월일은 필수 항목입니다.',
                pattern: {
                  value: /^\d{6}$/,
                  message: '6자리 숫자로 입력해주세요.',
                },
              })}
            />
            {errors.birthdate && (
              <ErrorMessage>{errors.birthdate.message}</ErrorMessage>
            )}
          </div>

          <div className='gender-container'>
            <FormLabel>성별</FormLabel>
            <div className='gender-group'>
              <GenderOption isSelected={genderUI === 'male'}>
                <input
                  type='radio'
                  value='male'
                  style={{ display: 'none' }}
                  checked={genderUI === 'male'}
                  onChange={(e) => {
                    setGenderUI(e.target.value);
                    setValue('gender', e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                />
                남성
              </GenderOption>
              <GenderOption isSelected={genderUI === 'female'}>
                <input
                  type='radio'
                  value='female'
                  style={{ display: 'none' }}
                  checked={genderUI === 'female'}
                  onChange={(e) => {
                    setGenderUI(e.target.value);
                    setValue('gender', e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                />
                여성
              </GenderOption>
            </div>
            {errors.gender && (
              <ErrorMessage>{errors.gender.message}</ErrorMessage>
            )}
          </div>

          <div>
            <div className='agreement-group'>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input type='checkbox' {...register('allAgreed')} />
                  <span>전체 동의(선택 정보 포함)</span>
                </div>
              </div>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input
                    type='checkbox'
                    {...register('terms', { required: true })}
                  />
                  <span>[필수] 서비스 이용 약관</span>
                </div>
                <ChevronBtn
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openTerms('서비스 이용약관', TERMS_TXT);
                  }}
                  aria-label='서비스 이용약관 보기'
                >
                  <ChevronIcon />{' '}
                </ChevronBtn>
              </div>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input
                    type='checkbox'
                    {...register('privacy', { required: true })}
                  />
                  <span>[필수] 개인정보 수집 및 이용 동의</span>
                </div>
                <ChevronBtn
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPrivacy('개인정보 수집 및 이용 동의', PRIVACY_TXT);
                  }}
                  aria-label='개인정보 수집 및 이용 동의'
                >
                  <ChevronIcon />{' '}
                </ChevronBtn>
              </div>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input type='checkbox' {...register('marketing')} />
                  <span>[선택] 마케팅 및 메시지 수신 동의</span>
                </div>
                <ChevronBtn
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openMarketing('마케팅 및 메시지 수신 동의', MARKETING_TXT);
                  }}
                  aria-label='마케팅 및 메시지 수신 동의'
                >
                  <ChevronIcon />{' '}
                </ChevronBtn>
              </div>
            </div>
            {(errors.terms || errors.privacy) && (
              <ErrorMessage>필수 약관에 동의해주세요.</ErrorMessage>
            )}
          </div>
        </Form>
      </ContentArea>
      <ButtonArea>
        <Button type='submit' disabled={!isValid}>
          다음
        </Button>
      </ButtonArea>
      <Dialog />
    </Container>
  );
}

export default SignUpPage2;
