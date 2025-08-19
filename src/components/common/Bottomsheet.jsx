import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import useBottomsheetStore from '../../stores/useBottomsheetStore';

// 공통 styled-components
const SHandleBar = styled.div`
  position: absolute;
  top: 0.625rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2.5rem;
  height: 0.25rem;
  background-color: var(--colors-bg-emphasized);
  border-radius: 0.125rem;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const SContent = styled.div`
  width: 100%;
  background-color: var(--colors-bg);
  overflow-y: auto;
  transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const SMapContent = styled(SContent)`
  height: ${({ $level }) => {
    if ($level === 1) return '0';
    if ($level === 2) return '40vh';
    if ($level === 3) return '70vh';
  }};
`;

const SModalContent = styled(SContent)`
  height: ${({ $level }) => {
    if ($level === 2) return '50vh';
    if ($level === 3) return '80vh';
    return '50vh'; // 기본값
  }};
  max-height: calc(90vh - 1.5rem); // 핸들바 높이는 제외!!
`;

// 지도 탐색용 바텀시트 (non-modal)
const SMapBottomsheetLayout = styled.div`
  background-color: var(--colors-bg);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding-top: 1.5rem;
  transform: ${({ $level }) => {
    if ($level === 1) return 'translateX(-50%) translateY(calc(100% - 1.5rem))';
    return 'translateX(-50%) translateY(0)';
  }};
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 그 외 페이지용 바텀시트 (modal)
const SModalBottomsheetScrim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 480px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1300;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: ${({ $transition }) => ($transition === 'open' ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const SModalBottomsheetLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--colors-bg);
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%)
    translateY(${({ $transition }) => ($transition === 'open' ? '0' : '100%')});
  max-height: 90vh;
  border-radius: 1rem 1rem 0 0;
  padding-top: 1.5rem;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 공통 드래그 핸들러 훅
const useDragHandler = (
  currentLevel,
  setLevel,
  minLevel,
  maxLevel,
  onClose,
) => {
  const startYRef = useRef(0);
  const startLevelRef = useRef(currentLevel);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e) => {
    e.preventDefault();
    startYRef.current = e.clientY || e.touches?.[0]?.clientY || 0;
    startLevelRef.current = currentLevel;
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const currentY = e.clientY || e.changedTouches?.[0]?.clientY || 0;
    const deltaY = startYRef.current - currentY;
    const threshold = 50;

    if (Math.abs(deltaY) < threshold) return;

    if (deltaY > 0) {
      // 위로 스와이프 - 레벨 증가
      if (startLevelRef.current < maxLevel) {
        setLevel(startLevelRef.current + 1);
      }
    } else {
      // 아래로 스와이프 - 레벨 감소
      if (startLevelRef.current > minLevel) {
        setLevel(startLevelRef.current - 1);
      } else if (onClose && minLevel > 1) {
        // 지도 바텀시트는 완전히 닫지 않고 최소 레벨 유지
        onClose();
      }
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

// 지도 탐색용 바텀시트 컴포넌트
const MapBottomsheet = ({ children }) => {
  const [mapBottomsheetLevel, setMapBottomsheetLevel] = useState(1);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragHandler(
      mapBottomsheetLevel,
      setMapBottomsheetLevel,
      1, // 최소 레벨
      3, // 최대 레벨
      null, // 지도 바텀시트는 완전히 닫지 X
    );

  return (
    <SMapBottomsheetLayout $level={mapBottomsheetLevel}>
      <SHandleBar
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
      <SMapContent $level={mapBottomsheetLevel}>{children}</SMapContent>
    </SMapBottomsheetLayout>
  );
};

// 모달 바텀시트 컴포넌트
const ModalBottomsheet = () => {
  const { isOpen, transition, children, close } = useBottomsheetStore();

  const [modalBottomsheetLevel, setModalBottomsheetLevel] = useState(2);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragHandler(
      modalBottomsheetLevel,
      setModalBottomsheetLevel,
      2, // 최소 레벨
      3, // 최대 레벨
      close, // 완전히 닫을 수 O
    );


  const handleScrimClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <SModalBottomsheetScrim $transition={transition} onClick={handleScrimClick}>
      <SModalBottomsheetLayout
        onClick={(event) => event.stopPropagation()}
        $transition={transition}
      >
        <SHandleBar
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
        <SModalContent $level={modalBottomsheetLevel}>{children}</SModalContent>
      </SModalBottomsheetLayout>
    </SModalBottomsheetScrim>,
    document.getElementById('root'),
  );
};

export { MapBottomsheet, ModalBottomsheet };
