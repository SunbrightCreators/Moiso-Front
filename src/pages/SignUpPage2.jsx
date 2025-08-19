import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import TopNavigation from '../components/common/TopNavigation';

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
  padding: 24px 16px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonArea = styled.div`
  padding: 8px 16px 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 4px;
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
  height: 56px;
  border-radius: 0.5rem;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  ${(props) =>
    props.isSelected
      ? css`
          background: #303742;
          color: white;
          border: 1px solid #303742;
        `
      : css`
          background: white;
          color: #303742;
          border: 1px solid #cad1db;
        `}
`;

const ChevronIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-top: 2px solid #a6afbd;
  border-right: 2px solid #a6afbd;
  transform: rotate(45deg);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  > div {
    margin-bottom: 24px;
  }
  .gender-container {
    margin-bottom: 32px;
  }
  > div:last-child {
    margin-bottom: 0;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'] {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #cad1db;
    font-size: 16px;
    box-sizing: border-box;
    &::placeholder {
      color: #cad1db;
    }
  }

  .gender-group {
    display: flex;
    gap: 8px;
  }

  .agreement-group {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
  }

  .agreement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 10px 4px;
  }

  .agreement-group .agreement-item:first-child {
    border-bottom: 1px solid #f4f4f5;
  }

  .agreement-item-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
`;

const Button = styled.button`
  position: fixied;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.disabled ? '#a6afbd' : '#303742')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

// --- 리액트 컴포넌트 정의 ---

function SignUpPage2() {
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
                <ChevronIcon />
              </div>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input
                    type='checkbox'
                    {...register('privacy', { required: true })}
                  />
                  <span>[필수] 개인정보 수집 및 이용 동의</span>
                </div>
                <ChevronIcon />
              </div>
              <div className='agreement-item'>
                <div className='agreement-item-left'>
                  <input type='checkbox' {...register('marketing')} />
                  <span>[선택] 마케팅 및 메시지 수신 동의</span>
                </div>
                <ChevronIcon />
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
    </Container>
  );
}

export default SignUpPage2;
