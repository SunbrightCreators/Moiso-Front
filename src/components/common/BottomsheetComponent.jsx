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
  transition: height 0.3s ease;
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
  transform: ${({ level }) => {
    if (level === 1) return 'translateY(calc(100% - 1.5rem))';
    return 'translateY(0)';
  }};
  transition: transform 0.3s ease;
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
`;

const SModalBottomsheetLayout = styled.div`
  width: 100%;
  max-width: 360px;
`;

const SModalBottomsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: ${({ level }) => {
    if (level === 2) return 'translateY(calc(100% - 51.5%))'; // 50% + 1.5rem
    if (level === 3) return 'translateY(calc(100% - 81.5%))'; // 80% + 1.5rem
    return 'translateY(100%)';
  }};
  transition: transform 0.3s ease;
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

  const handlePointerDown = (e) => {
    startYRef.current = e.clientY;
    startLevelRef.current = mapBottomsheetLevel;
  };

  const handlePointerUp = (e) => {
    const deltaY = startYRef.current - e.clientY;
    const threshold = 50;

    if (Math.abs(deltaY) < threshold) return;

    if (deltaY > 0) {
      // 위로 스와이프 - 레벨 uo
      if (startLevelRef.current < 3) {
        setMapBottomsheetLevel(startLevelRef.current + 1);
      }
    } else {
      // 아래로 스와이프 - 레벨 ↓↓
      if (startLevelRef.current > 1) {
        setMapBottomsheetLevel(startLevelRef.current - 1);
      } else {
        closeMapBottomsheet();
      }
    }
  };

  if (!isMapBottomsheetOpen) return null;

  return (
    <SMapBottomsheetLayout>
      <SMapBottomsheetContainer level={mapBottomsheetLevel}>
        <SHandleBar
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
        <SContent
          style={{
            height:
              mapBottomsheetLevel === 1
                ? '0'
                : mapBottomsheetLevel === 2
                ? '40vh'
                : '70vh',
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
    startYRef.current = e.clientY;
    startLevelRef.current = modalBottomsheetLevel;
  };

  const handlePointerUp = (e) => {
    const deltaY = startYRef.current - e.clientY;
    const threshold = 50;

    if (Math.abs(deltaY) < threshold) return;

    if (deltaY > 0) {
      // 위로 스와이프 - 레벨 ↑
      if (startLevelRef.current < 3) {
        setModalBottomsheetLevel(3);
      }
    } else {
      // 아래로 스와이프 - 레벨 ↓↓ ro 닫기
      if (startLevelRef.current > 2) {
        setModalBottomsheetLevel(2);
      } else {
        closeModalBottomsheet();
      }
    }
  };

  const handleScrimClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModalBottomsheet();
    }
  };

  if (!isModalBottomsheetOpen) return null;

  return createPortal(
    <SModalBottomsheetScrim onClick={handleScrimClick}>
      <SModalBottomsheetLayout>
        <SModalBottomsheetContainer level={modalBottomsheetLevel}>
          <SHandleBar
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />
          <SContent
            style={{
              height: modalBottomsheetLevel === 2 ? '50vh' : '80vh',
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