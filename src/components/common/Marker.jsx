import styled from 'styled-components';
import { useState } from 'react';
// Marker.jsx
// SVG 아이콘 Import
import Type1DefaultIcon from '../../assets/icons/Map-pin_T1_default.svg';
import Type1SelectedIcon from '../../assets/icons/Map-pin_T1_Selected.svg';
import Type2DefaultIcon from '../../assets/icons/Map-pin_T2_default.svg';
import Type2SelectedIcon from '../../assets/icons/Map-pin_T2_Selected.svg';

/**
 * Marker 컴포넌트
 * 지도 상에서 특정 위치에 나타나는 핀
 *
 * @param {number} type - 마커 타입 (1: 우리동네, 2: 다른동네)
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onClick - 클릭 이벤트 핸들러
 */
const Marker = ({ type = 1, isSelected = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick({ type, isSelected });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getMarkerIcon = () => {
    if (type === 1) {
      return isSelected ? Type1SelectedIcon : Type1DefaultIcon;
    } else {
      return isSelected ? Type2SelectedIcon : Type2DefaultIcon;
    }
  };

  return (
    <SMarkerContainer
      type={type}
      isSelected={isSelected}
      isHovered={isHovered}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SMarkerIcon
        src={getMarkerIcon()}
        alt={`Marker Type ${type} ${isSelected ? 'Selected' : 'Default'}`}
        type={type}
        isSelected={isSelected}
      />
    </SMarkerContainer>
  );
};

// Styled Components
const SMarkerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  ${({ isHovered }) =>
    isHovered &&
    `
    transform: scale(1.05);
  `}
`;

const SMarkerIcon = styled.img`
  flex-shrink: 0;

  /* Type 1 스타일 */
  ${({ type, isSelected }) =>
    type === 1 &&
    !isSelected &&
    `
    width: 2.25rem; 
    height: 2.625rem;
  `}
/* 크기같은 건 모두 피그마 기준으로 넣었습니다! */
  ${({ type, isSelected }) =>
    type === 1 &&
    isSelected &&
    `
    width: 2.89288rem;
    height: 3.45538rem;
  `}
  
  /* Type 2 스타일 */
  ${({ type, isSelected }) =>
    type === 2 &&
    !isSelected &&
    `
    width: 1.92856rem;
    height: 2.30356rem;
  `}
  
  ${({ type, isSelected }) =>
    type === 2 &&
    isSelected &&
    `
    width: 2.893rem;
    height: 3.4555rem;
  `}
`;

export default Marker;
