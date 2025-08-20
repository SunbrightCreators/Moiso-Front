import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '@chakra-ui/react';

/**
 * Timepicker 컴포넌트
 *
 * Props:
 * - register: react-hook-form의 register 함수
 * - min: 최소 시간 (HH:MM 형식)
 * - max: 최대 시간 (HH:MM 형식)
 * - required: 필수 입력 여부
 * - disabled: 비활성화 여부
 */

const Timepicker = ({
  register,
  min,
  max,
  required = false,
  disabled = false,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // 시작시간 변경 → 종료시간 최소값 설정
  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);
  };

  // 종료시간 변경 → 시작시간 최대값 설정
  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    setEndTime(value);
  };

  return (
    <SContainer>
      <STimeInput
        type='time'
        min={min}
        max={endTime || max}
        required={required}
        disabled={disabled}
        {...register('startTime', {
          required,
          onChange: handleStartTimeChange,
        })}
      />

      <SDivider />

      <STimeInput
        type='Time'
        min={startTime || min}
        max={max}
        required={required}
        disabled={disabled}
        {...register('endTime', {
          required,
          onChange: handleEndTimeChange,
        })}
      />
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

const STimeInput = styled(Input)`
  flex: 1;
  justify-items: flex-start;
  align-self: stretch;
  width: auto;
  height: var(--sizes-12, 3rem);
  padding: var(--spacing-2, 0.5rem) var(--spacing-1, 0.25rem)
    var(--spacing-0\.5, 0.1rem) var(--spacing-1, 0.25rem);
  border-radius: var(--radii-sm, 0.25rem);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--colors-focus-ring, rgba(49, 130, 206, 0.1));
  }

  &:disabled {
    background-color: var(--colors-gray-100, #f4f4f5);
    color: var(--colors-gray-600, #52525b);
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

  width: 1rem;
  height: 1px;
  background-color: var(--colors-border, #e4e4e7);
  margin: 0 var(--spacing-2, 0.5rem);
`;

export default Timepicker;
