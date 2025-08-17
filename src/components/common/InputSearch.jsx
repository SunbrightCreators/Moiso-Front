import { useState } from 'react';
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
  box-sizing: border-box;
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

const InputSearch = ({ onSearch, placeholder, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // 없애기 아이콘 클릭했을 때 실행될 함수
  const handleClear = () => {
    setValue('');
  };

  // 돋보기 아이콘을 클릭했을 때 실행될 검색 함수
  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <SearchBarContainer>
      <SearchButton onClick={handleSearch}>
        <SearchIcon />
      </SearchButton>

      <SearchInput
        type='text'
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {value && (
        <ClearButton onClick={handleClear}>
          <ClearIcon />
        </ClearButton>
      )}
    </SearchBarContainer>
  );
};

export default InputSearch;
