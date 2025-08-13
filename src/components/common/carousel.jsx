import { useRef, useState, useEffect, Children, cloneElement } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  gap: ${({ $gap }) => $gap};

  /* 스크롤바 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 스크롤 스냅 */
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  touch-action: pan-y;

  > * {
    flex: 0 0 100%; // 각 아이템이 컨테이너 너비를 100% 차지하도록 수정
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

const Carousel = ({ children, gap }) => {
  const carouselRef = useRef(null);
  const [firstX, setFirstX] = useState(0);
  const [lastX, setLastX] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!carouselRef.current) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0) {
          const index = parseInt(entries[0].target.dataset.index);
          setCurrentIndex(index);
        }
      },
      {
        root: carouselRef.current,
        threshold: 1.0,
        rootMargin: '0px',
      },
    );

    const domChildren = carouselRef.current.children;
    Array.from(domChildren).forEach((child) => {
      observerRef.current.observe(child);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (firstX === 0 || lastX === 0) return;

    const diff = firstX - lastX;
    const THRESHOLD = 50;

    if (Math.abs(diff) > THRESHOLD) {
      const el = carouselRef.current;
      el.scrollBy({
        left: diff > 0 ? 1 : -1,
        behavior: 'smooth',
      });
    }

    // 상태 초기화
    setFirstX(0);
    setLastX(0);
  }, [firstX, lastX]);

  const CarouselComponent = (
    <CarouselContainer
      ref={carouselRef}
      $gap={gap}
      onPointerDown={(e) => setFirstX(e.clientX ?? 0)}
      onPointerUp={(e) => setLastX(e.clientX ?? 0)}
      onPointerCancel={() => {
        setFirstX(0);
        setLastX(0);
      }}
      onPointerLeave={() => {
        setFirstX(0);
        setLastX(0);
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {Children.map(children, (child, index) =>
        cloneElement(child, { 'data-index': index }),
      )}
    </CarouselContainer>
  );

  return {
    CarouselComponent,
    currentIndex,
  };
};

export default Carousel;
