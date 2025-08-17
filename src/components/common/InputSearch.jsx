import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { ReactComponent as ClearIcon } from '../../assets/icons/x.svg';

// --- 스타일 정의 (모든 px 단위를 rem으로 수정) ---
const SearchBarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--chakra-space-2);
  width: 100%;
  padding: 0 var(--chakra-space-3)
  height: 3rem; /* 48px */
  background-color: var(--colors-gray-100, #f4f4f5);
  border-radius: var(--chakra-radii-md); 
  overflow: hidden;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 500;
  color: var(--text-default, #27272a);
  line-height: 1.5rem; /* 24px */
  &::placeholder {
    color: var(--colors-gray-400, #a1a1aa);
  }
`;

// 돋보기 아이콘을 클릭 가능한 버튼으로 만듭니다.
const SearchButton = styled.button`
  /* 아이콘 크기 및 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
`;

const ClearButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
`;
// ---------------------------------------------

const InputSearch = React.forwardRef(
  ({ placeholder, onChange: onChangeFromProps, name, ...props }, ref) => {
    const [value, setValue] = useState('');

    useEffect(() => {
      if (onChangeFromProps) {
        const event = { target: { name, value } };
        onChangeFromProps(event);
      }
    }, [value, name, onChangeFromProps]);

    const handleChange = (e) => {
      setValue(e.target.value);
      if (onChangeFromProps) {
        onChangeFromProps(e);
      }
    };

    // 4. 사용자님이 원하셨던 바로 그 코드! handleClear도 아주 간단해집니다.
    const handleClear = () => {
      setValue('');
      if (onChangeFromProps) {
        const event = { target: { name: props.name, value: '' } };
        onChangeFromProps(event);
      }
    };

    return (
      <SearchBarContainer>
        <SearchButton type='submit'>
          <SearchIcon />
        </SearchButton>

        <SearchInput
          type='search'
          placeholder={placeholder}
          ref={ref}
          // name을 input에 직접 전달해야 RHF가 인식합니다.
          name={name}
          {...props}
          // input의 값과 onChange는 우리 내부 상태와 함수를 사용합니다.
          value={value}
          onChange={handleChange}
        />

        {/* 내부 상태 value를 기준으로 X 버튼을 보여줍니다. */}
        {value && (
          <ClearButton type='button' onClick={handleClear}>
            <ClearIcon />
          </ClearButton>
        )}
      </SearchBarContainer>
    );
  },
);

export default InputSearch;
