// ProposalCreatePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopNavigation from '../components/common/TopNavigation';
import Timepicker from '../components/common/Timepicker';
import { Field, Input, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useModalBottomsheetStore from '../stores/useModalBottomsheetStore';
import { INDUSTRY } from '../constants/enum';
import useDialogStore from '../stores/useDialogStore';
import { ROUTE_PATH } from '../constants/route';

const ProposalCreatePage = ({ data, onNextStep, onPrevStep }) => {
  const open = useModalBottomsheetStore((s) => s.open);
  const close = useModalBottomsheetStore((s) => s.close);

  const navigate = useNavigate();
  const { setConfirmDialog } = useDialogStore();

  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  const handlePick = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3); // 최대 3장
    setPhotos(files);
    e.target.value = ''; // 같은 파일 다시 선택 가능하게 리셋
  };

  // RHF 세팅 (실시간 검증)
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm({
    mode: 'all',
    defaultValues: {
      title: '',
      content: '',
      industry: '',
      operatingTime: '',
      location: '',
    },
  });

  useEffect(() => {
    // 현재 페이지 위에 가드용 히스토리 한 칸 쌓기
    history.pushState(null, '', location.href);

    const onBackAttempt = () => {
      if (!isDirty) {
        // 변경사항 없으면 그냥 뒤로가기 허용
        window.removeEventListener('popstate', onBackAttempt);
        return;
      }

      // 되돌려놓기(페이지 유지)
      history.pushState(null, '', location.href);

      // 확인 다이얼로그
      setConfirmDialog({
        title: '작성을 중단하시겠습니까?',
        content: '지금 나가면 현재까지 작성한 내용은 저장되지 않아요',
        actionText: '나가기',
        onAction: () => {
          // 전 페이지로 가는 대신, 목록(또는 네가 원하는 고정 경로)으로 바로 이동
          navigate(ROUTE_PATH.PROPOSAL, { replace: true });
          // 상세로 바로 가고 싶으면:
          // navigate(ROUTE_PATH.PROPOSAL_DETAIL(targetId), { replace: true });
        },
        onCancel: () => {
          // 취소 시 그냥 머무름 (아무 것도 안 해도 됨)
        },
      });
    };

    window.addEventListener('popstate', onBackAttempt);
    return () => window.removeEventListener('popstate', onBackAttempt);
  }, [isDirty, navigate, setConfirmDialog]);

  // 업종 바텀시트 열기
  const openIndustrySheet = () => {
    open(
      <IndustrySheetContent
        onConfirm={(label) => {
          setValue('industry', label, { shouldValidate: true });
          close();
        }}
        onCancel={close}
      />,
    );
  };

  const onSubmit = (values) => {
    console.log('submit:', values);
  };

  useEffect(() => {
    if (data?.location) {
      setValue('location', data.location, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    }
  }, [data?.location, setValue]);

  return (
    <Page>
      <TopNavigation left='back' title='제안하기' />

      {/* 폼 */}
      <main>
        <Form id='proposalForm' onSubmit={handleSubmit(onSubmit)}>
          {/* 제안 제목 */}
          <Field.Root invalid={!!errors.title} required>
            <Field.Label>
              제안 제목 <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder='제안 제목을 입력해주세요'
              {...register('title', {
                required: '제안 제목은 필수 입력입니다.',
              })}
            />
            {errors.title && (
              <Field.ErrorText>{errors.title.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* 제안 내용 */}
          <Field.Root invalid={!!errors.content} required>
            <Field.Label>
              제안 내용 <Field.RequiredIndicator />
            </Field.Label>
            <Textarea
              placeholder='제안 배경/필요성, 기대 컨셉/분위기, 기대 서비스/메뉴를 자유롭게 작성해주세요. 구체적으로 적어주실수록 실제 창업으로 이어질 가능성이 높아져요!'
              rows={8}
              resize='none'
              {...register('content', {
                required: '제안 내용은 필수 입력입니다.',
              })}
            />
            {errors.content && (
              <Field.ErrorText>{errors.content.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* 희망 업종 */}
          <Field.Root invalid={!!errors.industry} required>
            <Field.Label>
              희망 업종 <Field.RequiredIndicator />
            </Field.Label>

            {/* RHF 실제 필드(숨김) */}
            <input
              type='hidden'
              {...register('industry', {
                required: '희망 업종을 선택해주세요.',
              })}
            />

            {/* 표시용 인풋 */}
            <SelectInput
              placeholder='업종을 선택해주세요'
              value={watch('industry') || ''}
              readOnly
              onClick={openIndustrySheet}
            />
            {errors.industry && (
              <Field.ErrorText>{errors.industry.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* 희망 운영 시간 (Timepicker 하나에 시작/종료 포함) */}
          <Field.Root invalid={!!errors.operatingTime} required>
            <Field.Label>
              희망 운영 시간 <Field.RequiredIndicator />
            </Field.Label>
            <Row>
              <Timepicker register={register} name='operatingTime' required />
            </Row>
            {errors.operatingTime && (
              <Field.ErrorText>희망 운영 시간을 선택해주세요.</Field.ErrorText>
            )}
          </Field.Root>

          {/* 희망 장소 */}
          <Field.Root invalid={!!errors.location} required>
            <Field.Label>
              희망 장소 <Field.RequiredIndicator />
            </Field.Label>

            {/* RHF 실제 필드(숨김) */}
            <input
              type='hidden'
              {...register('location', {
                required: '희망 장소를 설정해주세요.',
              })}
            />

            {/* 표시용 인풋 (지도 연동 시 setValue 호출) */}
            <SelectInput
              placeholder='지도에서 설정'
              readOnly
              value={watch('location') || ''} // RHF 쓰는 중이면 그대로
              onClick={() => onNextStep && onNextStep()} // ← placeSearch로 이동
            />
            {errors.location && (
              <Field.ErrorText>{errors.location.message}</Field.ErrorText>
            )}
          </Field.Root>

          {/* 사진 업로드(선택) */}
          <Field.Root>
            <Field.Label>사진</Field.Label>

            {/* 숨김 input: label의 htmlFor 또는 ref로 열기 */}
            <input
              id='proposal-photo-input'
              ref={fileRef}
              type='file'
              accept='image/*'
              multiple
              onChange={handlePick}
              style={{ display: 'none' }}
            />

            {/* 트리거 버튼 */}
            <UploadLabel
              as='label'
              htmlFor='proposal-photo-input' // ← 연결
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  fileRef.current?.click();
              }}
            >
              사진 업로드
            </UploadLabel>

            {/* 선택한 파일 개수/미리보기 (옵션) */}
            {photos.length > 0 && (
              <PreviewWrap>
                <PreviewText>{photos.length}장 선택됨</PreviewText>
                <Thumbs>
                  {photos.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt='' />
                  ))}
                </Thumbs>
              </PreviewWrap>
            )}
          </Field.Root>
        </Form>
      </main>

      {/* 하단 고정 버튼 */}
      <Footer>
        <PrimaryButton
          type='submit'
          form='proposalForm'
          formNoValidate
          disabled={!isValid}
        >
          등록하기
        </PrimaryButton>
      </Footer>
    </Page>
  );
};

/** 바텀시트 내부 업종 선택 UI (이 파일 안에 선언) */
function IndustrySheetContent({ onConfirm, onCancel }) {
  const [temp, setTemp] = useState('');

  return (
    <SheetWrap onClick={(e) => e.stopPropagation()}>
      <List>
        {INDUSTRY.map((opt) => (
          <Item key={opt.value}>
            <input
              id={`ind-${opt.value}`}
              type='radio'
              name='industry'
              value={opt.label}
              checked={temp === opt.label}
              onChange={(e) => setTemp(e.target.value)}
            />
            <label htmlFor={`ind-${opt.value}`}>
              {opt.icon} {opt.label}
            </label>
          </Item>
        ))}
      </List>

      <SheetFooter>
        <GhostButton type='button' onClick={onCancel}>
          취소
        </GhostButton>
        <GhostButton
          type='button'
          disabled={!temp}
          onClick={() => onConfirm?.(temp)}
        >
          확인
        </GhostButton>
      </SheetFooter>
    </SheetWrap>
  );
}

/* ===== styled ===== */
const Page = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12, 3rem);
  flex-grow: 1;

  height: 100%;
  overflow: auto;

  /* 상단은 헤더만큼 띄우고, 하단은 고정 푸터(5rem)만큼 띄움 */
  padding: var(--spacing-8, 2rem) var(--spacing-4, 1rem) 96px
    var(--spacing-4, 1rem);
  padding-top: calc(var(--nav-h) + 16px);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SelectInput = styled(Input)`
  cursor: pointer;
`;

const UploadLabel = styled.label`
  display: flex;
  height: var(--sizes-10, 40px);
  min-width: var(--sizes-10, 40px);
  padding: 2px var(--spacing-4, 16px);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2, 8px);
  border-radius: var(--radii-md, 6px);
  border: 1px solid var(--colors-gray-muted, #e4e4e7);
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  display: flex;
  height: 5rem;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background: #fff;
`;

const PrimaryButton = styled.button`
  height: 4rem;
  width: 100%;
  border: none;
  border-radius: 0.8rem;
  background: #111827; /* 활성(검정) */
  color: #fff;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
  &:disabled {
    background: #e5e7eb; /* 비활성(회색) */
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

/* ---- bottomsheet 내부 스타일 (내용만) ---- */
const SheetWrap = styled.div`
  padding-bottom: env(safe-area-inset-bottom);
`;
const Title = styled.h3`
  margin: 1rem 1.2rempx 0.7rem;
  font-size: 16px;
  font-weight: 700;
`;
const List = styled.div`
  max-height: 50vh;
  overflow-y: hidden;
  padding: 0 1.2rem 16rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem 2rem;
`;
const Item = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  height: 3.5rem;
  input {
    accent-color: #111827;
  }
`;
const SheetFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px 16px 16px;
  border-top: 1px solid #e5e7eb;
`;
const GhostButton = styled.button`
  height: 3.4rem;
  flex: 1;
  border: 1px solid #e5e7eb;
  background: #fff;
`;
const PreviewWrap = styled.div`
  margin-top: 0.9rem;
`;
const PreviewText = styled.p`
  margin: 0 0 0.5rem;
  font-size: 12px;
  color: #6b7280;
`;
const Thumbs = styled.div`
  display: flex;
  gap: 0.5rem;
  img {
    width: 6rem;
    height: 6rem;
    object-fit: cover;
    border-radius: 0.9rem;
    border: 0.1rem solid #e5e7eb;
  }
`;

export default ProposalCreatePage;
