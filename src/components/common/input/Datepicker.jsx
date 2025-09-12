import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '@chakra-ui/react';

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
      <SDateInput
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

      <SDivider />

      <SDateInput
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

const SDateInput = styled(Input)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-items: flex-start;
  align-self: stretch;
  flex-direction: column;
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

export default Datepicker;
