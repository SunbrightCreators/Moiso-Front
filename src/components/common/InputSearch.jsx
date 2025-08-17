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
    // 1. 전처럼 useState로 내부 상태를 관리합니다. 이게 유일한 "진실의 원천"이 됩니다.
    const [value, setValue] = useState('');

    // 2. useEffect를 사용해서, 우리 내부의 value가 바뀔 때
    useEffect(() => {
      if (onChangeFromProps) {
        const event = { target: { name, value } };
        onChangeFromProps(event);
      }
    }, [value, name, onChangeFromProps]);

    // 3. 이제 handleChange는 전처럼 아주 간단해집니다.
    const handleChange = (e) => {
      setValue(e.target.value);
      if (onChangeFromProps) {
        onChangeFromProps(e);
      }
    };

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
          name={name}
          {...props}
          value={value}
          onChange={handleChange}
        />
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
