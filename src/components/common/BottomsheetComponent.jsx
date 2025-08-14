import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useBottomsheetStore } from '../../stores/useBottomsheetStore';

// 공통 styled-components
const SHandleBar = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &::before {
    content: '';
    width: 2.5rem;
    height: 0.25rem;
    background-color: #d1d5db;
    border-radius: 0.125rem;
  }
`;

const SContent = styled.div`
  width: 100%;
  background-color: white;
  overflow-y: auto;
  transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 지도 탐색용 바텀시트 (non-modal)
const SMapBottomsheetLayout = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100%;

  @media (min-width: 360px) {
    left: 50%;
    transform: translateX(-50%);
    width: 360px;
  }
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

const SModalBottomsheetLayout = styled.div`
  width: 100%;
  max-width: 360px;
`;

const SModalBottomsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: ${({ $level }) => {
    if ($level === 2) return 'translateY(calc(100% - 51.5%))'; // 50% + 1.5rem
    if ($level === 3) return 'translateY(calc(100% - 81.5%))'; // 80% + 1.5rem
    return 'translateY(100%)';
  }};
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// 지도 탐색용 바텀시트 컴포넌트
const MapBottomsheet = () => {
  const {
    isMapBottomsheetOpen,
    mapBottomsheetLevel,
    mapBottomsheetChildren,
    setMapBottomsheetLevel,
    closeMapBottomsheet,
  } = useBottomsheetStore();

  const startYRef = useRef(0);
  const startLevelRef = useRef(1);
  const isDraggingRef = useRef(false);

  const getContentHeight = (level) => {
    if (level === 1) return '0';
    if (level === 2) return '40vh';
    return '70vh';
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    startYRef.current = e.clientY || e.touches?.[0]?.clientY || 0;
    startLevelRef.current = mapBottomsheetLevel;
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
      if (startLevelRef.current < 3) {
        setMapBottomsheetLevel(startLevelRef.current + 1);
      }
    } else {
      // 아래로 스와이프 - 레벨 감소
      if (startLevelRef.current > 1) {
        setMapBottomsheetLevel(startLevelRef.current - 1);
      } else {
        closeMapBottomsheet();
      }
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    handlePointerDown(e);
  };

  const handleTouchMove = (e) => {
    handlePointerMove(e);
  };

  const handleTouchEnd = (e) => {
    handlePointerUp(e);
  };

  if (!isMapBottomsheetOpen) return null;

  return (
    <SMapBottomsheetLayout>
      <SMapBottomsheetContainer $level={mapBottomsheetLevel}>
        <SHandleBar
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <SContent
          style={{
            height: getContentHeight(mapBottomsheetLevel),
          }}
        >
          {mapBottomsheetChildren}
        </SContent>
      </SMapBottomsheetContainer>
    </SMapBottomsheetLayout>
  );
};

// 모달 바텀시트 컴포넌트
const ModalBottomsheet = () => {
  const {
    isModalBottomsheetOpen,
    modalBottomsheetLevel,
    modalBottomsheetChildren,
    setModalBottomsheetLevel,
    closeModalBottomsheet,
  } = useBottomsheetStore();

  const startYRef = useRef(0);
  const startLevelRef = useRef(2);
  const isDraggingRef = useRef(false);

  const getContentHeight = (level) => {
    if (level === 2) return '50vh';
    return '80vh';
  };

  useEffect(() => {
    if (isModalBottomsheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalBottomsheetOpen]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    startYRef.current = e.clientY || e.touches?.[0]?.clientY || 0;
    startLevelRef.current = modalBottomsheetLevel;
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
      if (startLevelRef.current < 3) {
        setModalBottomsheetLevel(3);
      }
    } else {
      // 아래로 스와이프 - 레벨 감소 또는 닫기
      if (startLevelRef.current > 2) {
        setModalBottomsheetLevel(2);
      } else {
        closeModalBottomsheet();
      }
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    handlePointerDown(e);
  };

  const handleTouchMove = (e) => {
    handlePointerMove(e);
  };

  const handleTouchEnd = (e) => {
    handlePointerUp(e);
  };

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
      <SModalBottomsheetLayout>
        <SModalBottomsheetContainer $level={modalBottomsheetLevel}>
          <SHandleBar
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <SContent
            style={{
              height: getContentHeight(modalBottomsheetLevel),
            }}
          >
            {modalBottomsheetChildren}
          </SContent>
        </SModalBottomsheetContainer>
      </SModalBottomsheetLayout>
    </SModalBottomsheetScrim>,
    document.getElementById('root'),
  );
};

export { MapBottomsheet, ModalBottomsheet };
