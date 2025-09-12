import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { Dialog } from '../../components/common';
import { TopNavigation } from '../../components/common/navigation';
import { SEX } from '../../constants/enum';
import useDialogStore from '../../stores/useDialogStore';

// --- 리액트 컴포넌트 정의 ---

const SignUpPage2 = ({ onNextStep }) => {
  const setAlertDialog = useDialogStore((s) => s.setAlertDialog);
  const TERMS_TXT = `본 약관은 지역 주민의 제안과 창업자의 참여를 기반으로 동네 상권을 활성화하는 크라우드 펀딩 플랫폼 「모이소」(이하 ‘서비스’) 의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.

제1조 (목적)
이 약관은 「모이소」 서비스를 제공하는 회사(이하 “회사”)와 서비스 이용자(이하 “이용자”) 간의 서비스 이용에 관한 권리, 의무 및 책임사항, 기타 필요한 사항을 규정합니다.

제2조 (정의)
	1.	“서비스”란 회사가 제공하는 웹/모바일 기반 플랫폼으로, 주민이 원하는 가게 아이디어(제안글)를 등록하고, 창업자가 이를 수락하여 펀딩 및 개업까지 이어질 수 있도록 지원하는 일련의 기능을 의미합니다.
	2.	“이용자”란 본 약관에 동의하고 서비스를 이용하는 자를 말하며, 제안자, 창업자, 후원자로 구분됩니다.
	3.	“제안자”란 특정 지역 내에서 필요한 가게 아이디어를 제안하는 이용자를 말합니다.
	4.	“창업자”란 제안글을 검토·수락하여 실제 개업을 준비하는 이용자를 말합니다.
	5.	“후원자”란 제안이나 창업 과정에 금전적으로 참여하는 이용자를 의미합니다.
	6.	“콘텐츠”란 서비스 내에서 제공되거나 이용자가 업로드하는 모든 텍스트, 이미지, 영상, 데이터 등을 포함합니다.

제3조 (약관의 효력 및 변경)
	1.	본 약관은 서비스 초기 화면 또는 별도 연결 화면에 게시함으로써 효력이 발생합니다.
	2.	회사는 합리적인 사유가 있는 경우 「전자상거래법」, 「정보통신망법」 등 관련 법령을 위반하지 않는 범위 내에서 약관을 개정할 수 있습니다.
	3.	개정된 약관은 공지한 시점부터 효력이 발생하며, 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.


제4조 (서비스의 제공)
	1.	회사는 다음과 같은 서비스를 제공합니다.
	1.	지역 주민이 가게 아이디어를 제안하는 기능
	2.	창업자가 제안글을 확인하고 수락 및 사업화를 준비하는 기능
	3.	주민과 창업자 간의 크라우드 펀딩 참여 기능
	4.	제안글 추천 알고리즘 및 개인화된 정보 제공
	5.	기타 회사가 정하는 부가 서비스
	2.	회사는 기술적, 운영적 필요에 따라 서비스의 일부를 변경하거나 중단할 수 있으며, 이에 대하여 별도의 보상을 하지 않습니다.


제5조 (이용자의 의무)
이용자는 서비스를 이용함에 있어 다음 행위를 하여서는 안 됩니다.
	1.	타인의 명의 또는 개인정보를 도용하는 행위
	2.	허위 정보 등록, 부정확한 제안글 작성 행위
	3.	저작권·초상권 등 제3자의 권리를 침해하는 행위
	4.	법령 위반 또는 공공질서·미풍양속에 반하는 행위
	5.	서비스의 정상적 운영을 방해하는 행위


제6조 (회원가입 및 탈퇴)
	1.	서비스 이용을 원하는 자는 회사가 정한 절차에 따라 회원가입을 할 수 있습니다.
	2.	회원은 언제든지 서비스 내 탈퇴 절차를 통해 이용계약을 해지할 수 있습니다.
	3.	회사는 이용자가 약관을 위반하거나 불법·부당한 행위를 한 경우 회원자격을 제한·정지·상실시킬 수 있습니다.


제7조 (펀딩 및 거래 관련 규정)
	1.	제안글을 기반으로 진행되는 펀딩은 투자 성격이 아닌 크라우드 후원의 성격을 가지며, 창업자의 사정에 따라 개업이 지연되거나 변경될 수 있습니다.
	2.	회사는 펀딩의 당사자가 아니며, 제안자·창업자·후원자 간의 거래에 직접적인 책임을 지지 않습니다.
	3.	다만, 회사는 안전한 거래 환경을 제공하기 위하여 결제 시스템 관리 및 분쟁 발생 시 중재를 위한 합리적 노력을 다합니다.


제8조 (개인정보 보호)
	1.	회사는 서비스 제공을 위해 이용자로부터 수집하는 개인정보를 관련 법령에 따라 보호합니다.
	2.	개인정보 처리에 관한 구체적 사항은 별도의 개인정보 처리방침에 따릅니다.


제9조 (지적재산권)
	1.	서비스 내 제공되는 콘텐츠에 대한 저작권과 지적재산권은 회사에 귀속되며, 이용자는 이를 무단으로 복제, 배포, 전송할 수 없습니다.
	2.	이용자가 직접 작성한 제안글 및 게시물의 저작권은 해당 이용자에게 있으며, 회사는 서비스 운영 및 홍보를 위하여 이를 활용할 수 있습니다.


제10조 (이용 제한 및 계약 해지)
회사는 이용자가 본 약관을 위반하는 경우 사전 통지 없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.


제11조 (면책 조항)
	1.	회사는 천재지변, 불가항력 등 회사의 책임 없는 사유로 발생한 서비스 장애에 대해 책임을 지지 않습니다.
	2.	회사는 제안자·창업자·후원자 간 거래에 직접적으로 개입하지 않으며, 이에 따른 분쟁은 당사자 간 해결을 원칙으로 합니다.


제12조 (분쟁 해결 및 관할 법원)
	1.	회사와 이용자 간 분쟁은 상호 협의하여 해결함을 원칙으로 합니다.
	2.	협의가 이루어지지 않을 경우, 회사 본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.
`;
  const PRIVACY_TXT = `「모이소」는 지역 기반 제안 및 크라우드 펀딩 서비스를 제공하기 위하여 이용자의 개인정보를 아래와 같이 수집·이용합니다.


1. 수집 항목
	•	회원가입 시: 이름, 이메일, 비밀번호, 관심 지역
	•	서비스 이용 시: 제안글·펀딩 참여 기록, 창업자/후원자 간 메시지 기록, 접속 로그, 쿠키, 이용 기기 정보
	•	결제 시: 신용카드 정보, 계좌번호, 결제 및 환불 기록


2. 수집 및 이용 목적
	1.	회원 식별 및 본인 확인
	2.	제안글 작성·등록, 창업자 참여, 후원자 펀딩 등 서비스 제공
	3.	펀딩 결제 처리 및 정산
	4.	관심 지역 및 활동 기록을 기반으로 한 맞춤형 제안글 추천
	5.	고객 문의 응대 및 민원 처리
	6.	서비스 안정성 확보 및 불법·부정 이용 방지


3. 보유 및 이용 기간
	•	원칙적으로 회원 탈퇴 시 즉시 파기
	•	단, 관계 법령에 따라 일정 기간 보관 후 파기
	•	계약 또는 청약 철회 관련 기록: 5년
	•	대금 결제 및 재화 공급 기록: 5년
	•	소비자 불만 및 분쟁 처리 기록: 3년
	•	웹사이트 접속 기록: 3개월


4. 동의 거부 권리 및 불이익 안내
	•	이용자는 개인정보 수집·이용에 동의하지 않을 권리가 있습니다.
	•	단, 필수 항목에 동의하지 않을 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.`;
  const MARKETING_TXT = `「「모이소」는 회원에게 더 나은 서비스를 제공하고, 지역 상권 활성화 및 펀딩 참여를 독려하기 위해 마케팅 정보를 발송할 수 있습니다.

1. 수집·이용 항목
	•	이름, 연락처(이메일), 서비스 이용 내역, 관심 지역, 제안 및 펀딩 참여 기록

2. 수집·이용 목적
	1.	신규 서비스, 이벤트 및 프로모션 안내
	2.	펀딩 개설, 달성 현황, 마감 임박 등 참여 독려 알림
	3.	제안글과 창업 소식, 후원자 리워드 등 서비스 관련 소식 제공

3. 보유 및 이용 기간
	•	회원 탈퇴 또는 수신 거부 요청 시까지 보관 및 이용

4. 동의 거부 권리 및 불이익 안내
	•	이용자는 마케팅 정보 수신 동의를 거부할 수 있으며, 거부 시에도 서비스 기본 기능 이용에는 제한이 없습니다.
	•	단, 신규 펀딩 및 이벤트 안내, 맞춤형 지역 정보 제공을 받지 못할 수 있습니다.
  `;
  const IDEA_TXT = `본 서비스에 게시된 제안글은 제안자의 고유한 창작물이며, 서비스 내에서의 협업과 사업화를 목적으로만 활용할 수 있습니다.

제안자의 동의 없이 제안글의 내용을 외부에서 무단으로 이용하거나, 이를 기반으로 별도의 창업·영업 활동을 진행하는 행위는 저작권법 및 부정경쟁방지법 등 관련 법령 위반에 해당할 수 있습니다.

회사는 이러한 행위가 적발될 경우 이용 제한, 손해배상 청구, 법적 조치 등 강력한 대응을 취할 수 있으며, 해당 이용자는 서비스 이용에 필요한 신뢰 자격을 영구적으로 상실하게 됩니다`;

  const openTerms = () =>
    setAlertDialog({
      title: '서비스 이용약관',
      content: <ScrollText>{TERMS_TXT}</ScrollText>,
      actionText: '닫기',
    });

  const openPrivacy = () =>
    setAlertDialog({
      title: '개인정보 수집 및 이용동의',
      content: <ScrollText>{PRIVACY_TXT}</ScrollText>,
      actionText: '닫기',
    });

  const openMarketing = () =>
    setAlertDialog({
      title: '마케팅 및 수신동의',
      content: <ScrollText>{MARKETING_TXT}</ScrollText>,
      actionText: '닫기',
    });

  const openidea = () =>
    setAlertDialog({
      title: '아이디어 도난 및 신뢰',
      content: <ScrollText>{IDEA_TXT}</ScrollText>,
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
    setValue('idea', allAgreed, { shouldValidate: true });
    setValue('privacy', allAgreed, { shouldValidate: true });
    setValue('marketing', allAgreed);
  }, [allAgreed, setValue]);

  const onSubmit = (data) => {
    onNextStep?.({ account: data });
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
              {SEX.map((option) => (
                <GenderOption
                  key={option.value}
                  isSelected={genderUI === option.value}
                  onClick={() => {
                    setGenderUI(option.value);
                    setValue('gender', option.value, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <input
                    type='radio'
                    value={option.value}
                    style={{ display: 'none' }}
                    checked={genderUI === option.value}
                    readOnly
                  />
                  {option.label}
                </GenderOption>
              ))}
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
                    {...register('idea', { required: true })}
                  />
                  <span>[필수] 아이디어 도난 및 신뢰</span>
                </div>
                <ChevronBtn
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openidea('아이디어 도난 및 신뢰', IDEA_TXT);
                  }}
                  aria-label='아이디어 도난 및 신뢰'
                >
                  <ChevronIcon />{' '}
                </ChevronBtn>
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
        <Button
          type='submit'
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          다음
        </Button>
      </ButtonArea>
      <Dialog />
    </Container>
  );
};

export default SignUpPage2;

// --- 스타일 정의 ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
  border: none;
  background: transparent;
  padding: 0.125rem;
  cursor: pointer;
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

const ScrollText = styled.div`
  line-height: 1.5; /* 단위 없는 line-height */
  max-block-size: calc(17 * 1lh); /* 정확히 7줄 높이 */
  overflow-y: auto; /* 이후 내용은 스크롤 */
  white-space: pre-wrap; /* 개행 유지 */
  word-break: keep-all; /* 한국어 단어 뭉텅이 방지 */
  overscroll-behavior: contain; /* 모달 밖으로 스크롤 전파 방지 */
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */

  /* 크롬/사파리/크로뮴 엣지 */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  /* IE/구버전 Edge */
  -ms-overflow-style: none;
`;
