import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '@chakra-ui/react';
import Separator from '../../assets/icons/Datepicker_Separator.svg';

/**
 * Datepicker 컴포넌트
 *
 * Props:
 * - register: react-hook-form의 register 함수
 * - min: 최소 날짜 (YYYY-MM-DD 형식)
 * - max: 최대 날짜 (YYYY-MM-DD 형식)
 * - required: 필수 입력 여부
 * - disabled: 비활성화 여부
 */

const Datepicker = ({
  register,
  min,
  max,
  required = false,
  disabled = false,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 시작일 변경 → 종료일 최소값 설정
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
  };

  // 종료일 변경 → 시작일 최대값 설정
  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
  };

  return (
    <SContainer>
      <SDateInputWrapper>
        <SDateInput
          as={Input}
          type='date'
          min={min}
          max={endDate || max}
          required={required}
          disabled={disabled}
          {...register('startDate', {
            required,
            onChange: handleStartDateChange,
          })}
        />
      </SDateInputWrapper>

      <SDivider>
        <img src={Separator} alt='separator' />
      </SDivider>

      <SDateInputWrapper>
        <SDateInput
          as={Input}
          type='date'
          min={startDate || min}
          max={max}
          required={required}
          disabled={disabled}
          {...register('endDate', {
            required,
            onChange: handleEndDateChange,
          })}
        />
      </SDateInputWrapper>
    </SContainer>
  );
};

const SContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: auto;
  max-width: 22.375rem;
`;

const SDateInputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  align-self: stretch;

  width: auto;
  height: var(--sizes-12, 3rem);
  padding: var(--spacing-1, 0.2rem) var(--spacing-1, 0.2rem);

  border: var(--borders-sm, 1px) solid var(--colors-border-default, #e4e4e7);
  border-radius: var(--radii-Semantic_tokens-l2, 0.25rem);
`;

const SDateInput = styled.input`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: space-between;

  width: 9.25rem;
  padding-top: var(--spacing-2, 0.2rem);
  gap: var(--spacing-0-5, 0.1rem);

  border-radius: 0.5rem;

  &:focus {
    outline: none;
    border-color: var(--colors-border-focused, #3182ce);
    box-shadow: 0 0 0 3px var(--colors-focus-ring, rgba(49, 130, 206, 0.1));
  }

  &:disabled {
    background-color: var(--colors-bg-muted, #f7fafc);
    color: var(--colors-fg-muted, #a0aec0);
    cursor: not-allowed;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const SDivider = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  img {
    stroke-width: 1px;
    stroke: var(--colors-border-default, #e4e4e7);
  }
`;

export default Datepicker;
