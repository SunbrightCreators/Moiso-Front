import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import useBottomsheetStore from '../../stores/useBottomsheetStore';

// 공통 styled-components
const SHandleBarLayout = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  background-color: var(--colors-bg);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const SHandleBar = styled.div`
  width: 2.5rem;
  height: 0.25rem;
  background-color: var(--colors-bg-emphasized);
  border-radius: 0.125rem;
`;

const SContent = styled.div`
  width: 100%;
  background-color: var(--colors-bg);
  overflow-y: auto;
  transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: ${({ $level, $type }) => {
    if ($type === 'map') {
      if ($level === 1) return '0';
      if ($level === 2) return '40vh';
      return '70vh';
    } else {
      if ($level === 2) return '50vh';
      return '80vh';
    }
  }};
`;

// 지도 탐색용 바텀시트 (non-modal)
const SMapBottomsheetLayout = styled.div`
  background-color: var(--colors-bg);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100%;
`;

const SMapBottomsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: ${({ $level }) => {
    if ($level === 1) return 'translateY(calc(100% - 1.5rem))';
    return 'translateY(0)';
  }};
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 모달 바텀시트 (modal)
const SModalBottomsheetScrim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1300;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const SModalBottomsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--colors-bg);
  transform: ${({ $level }) => {
    if ($level === 2) return 'translateY(calc(100% - 51.5%))'; // 50% + 1.5rem
    if ($level === 3) return 'translateY(calc(100% - 81.5%))'; // 80% + 1.5rem
    return 'translateY(100%)';
  }};
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
  const [isMapBottomsheetOpen, setIsMapBottomsheetOpen] = useState(false);
  const [mapBottomsheetLevel, setMapBottomsheetLevel] = useState(1);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragHandler(
      mapBottomsheetLevel,
      setMapBottomsheetLevel,
      1, // 최소 레벨
      3, // 최대 레벨
      null, // 지도 바텀시트는 완전히 닫지 않음
    );

  const openMapBottomsheet = (level = 2) => {
    setIsMapBottomsheetOpen(true);
    setMapBottomsheetLevel(Math.max(1, Math.min(3, level)));
  };

  const closeMapBottomsheet = () => {
    setMapBottomsheetLevel(1);
  };

  // 외부에서 호출할 수 있도록 useEffect로 전역 함수 등록
  useEffect(() => {
    window.openMapBottomsheet = openMapBottomsheet;
    window.closeMapBottomsheet = closeMapBottomsheet;

    return () => {
      delete window.openMapBottomsheet;
      delete window.closeMapBottomsheet;
    };
  }, []);

  // 초기에 바텀시트를 열린 상태로 설정
  useEffect(() => {
    setIsMapBottomsheetOpen(true);
  }, []);

  if (!isMapBottomsheetOpen) return null;

  return (
    <SMapBottomsheetLayout>
      <SMapBottomsheetContainer $level={mapBottomsheetLevel}>
        <SHandleBarLayout
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <SHandleBar />
        </SHandleBarLayout>
        <SContent $level={mapBottomsheetLevel} $type="map">
          {children}
        </SContent>
      </SMapBottomsheetContainer>
    </SMapBottomsheetLayout>
  );
};

// 모달 바텀시트 컴포넌트
const ModalBottomsheet = () => {
  const {
    isModalBottomsheetOpen,
    modalBottomsheetChildren,
    closeModalBottomsheet,
  } = useBottomsheetStore();

  const [modalBottomsheetLevel, setModalBottomsheetLevel] = useState(2);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragHandler(
      modalBottomsheetLevel,
      setModalBottomsheetLevel,
      2, // 최소 레벨
      3, // 최대 레벨
      closeModalBottomsheet, // 완전히 닫을 수 있음
    );

  useEffect(() => {
    if (isModalBottomsheetOpen) {
      document.body.style.overflow = 'hidden';
      setModalBottomsheetLevel(2);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalBottomsheetOpen]);

  const handleScrimClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModalBottomsheet();
    }
  };

  if (!isModalBottomsheetOpen) return null;

  return createPortal(
    <SModalBottomsheetScrim
      $isVisible={isModalBottomsheetOpen}
      onClick={handleScrimClick}
    >
      <SModalBottomsheetContainer $level={modalBottomsheetLevel}>
        <SHandleBarLayout
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <SHandleBar />
        </SHandleBarLayout>
        <SContent $level={modalBottomsheetLevel} $type="modal">
          {modalBottomsheetChildren}
        </SContent>
      </SModalBottomsheetContainer>
    </SModalBottomsheetScrim>,
    document.getElementById('root'),
  );
};

export { MapBottomsheet, ModalBottomsheet };
