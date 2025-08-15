import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CloseIcon from '../../../src/assets/icons/Topnavigation_X.svg';
import BackIcon from '../../../src/assets/icons/Topnavigation_Back.svg';
import BellIcon from '../../../src/assets/icons/Topnavigation_bell.svg';

/**
 * TopNavigation 컴포넌트
 *
 * Props:
 * - left: 'back' | 'close' | null (뒤로가기/닫기 버튼)
 * - title: string (중앙 제목)
 * - subTitle: string (중앙 부제목)
 * - right: 'notification' | null (오른쪽 알림 아이콘..인데 구현은 나중에?)
 *
 * Types:
 * - Type 1: left='back', title
 * - Type 2-1: right='close', title
 * - Type 2-2: right='close', title, subTitle
 * - Type 3: right='notification', title
 * - Type 4: left='back'
 */

const TopNavigation = ({ left, title, subTitle, right }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCloseClick = () => {
    navigate(-1);
  };

  const handleNotificationClick = () => {
    console.log('알림 페이지로 이동'); // 알림 페이지로 이동하는 것은 아직 구형X
  };

  return (
    <SLayout>
      <SContainer>
        <SLeftWrapper>
          {left === 'back' && (
            <SIconBtn onClick={handleBackClick}>
              <img src={BackIcon} alt='Back' />
            </SIconBtn>
          )}
        </SLeftWrapper>

        <SCenterWrapper>
          {title && <STitle>{title}</STitle>}
          {subTitle && <SSubTitle>{subTitle}</SSubTitle>}
        </SCenterWrapper>

        <SRightWrapper>
          {right === 'close' && (
            <SIconBtn onClick={handleCloseClick}>
              <img src={CloseIcon} alt='Close' />
            </SIconBtn>
          )}
          {right === 'notification' && (
            <SIconBtn onClick={handleNotificationClick}>
              <img src={BellIcon} alt='Notification' />
            </SIconBtn>
          )}
        </SRightWrapper>
      </SContainer>
    </SLayout>
  );
};

export default TopNavigation;

// Styled Components
const SLayout = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background: var(--bg-default, #ffffff);
  border-bottom: var(--borders-xs, 0.5px) solid
    var(--colors-border-default, #e4e4e7);
  z-index: 100;
`;

const SContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.25rem;
  padding: 1rem 0.375rem;
  gap: 2.375rem;
`;

const SLeftWrapper = styled.div`
  display: flex;
  width: var(--sizes-9, 2.25rem);
  height: var(--sizes-9, 2.25rem);
  min-width: var(--sizes-9, 2.25rem);
  padding: 0.125rem var(--spacing-3_5, 0.875rem);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
`;

const SCenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  width: 14.375rem;
`;

const SRightWrapper = styled.div`
  display: flex;
  width: var(--sizes-9, 2.25rem);
  height: var(--sizes-9, 2.25rem);
  min-width: var(--sizes-9, 2.25rem);
  padding: 0.125rem var(--spacing-3_5, 0.875rem);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
`;

const SIconBtn = styled.button`
  display: flex;
  width: var(--sizes-4, 1rem);
  height: var(--sizes-4, 1rem);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const STitle = styled.h1`
  color: var(--text-default, #27272a);
  text-align: center;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-md, 1rem);
  font-style: normal;
  font-weight: var(--font-weights-semibold, 600);
  line-height: 1.5rem; /* 150% */
  /* md/font-semibold */
`;

const SSubTitle = styled.h2`
  margin: 0;
  margin-top: 0.125rem;
  color: var(--colors-fg-subtle, #a1a1aa);
  text-align: center;
  font-family: var(--fonts-body, Inter);
  font-size: var(--font-sizes-sm, 0.875rem);
  font-style: normal;
  font-weight: var(--font-weights-normal, 400);
  line-height: 1.25rem; /* 142.857% */
  /* sm/font-normal */
`;
