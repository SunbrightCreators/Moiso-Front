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
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

const Carousel = ({ children, gap = 0, setIndex }) => {
  /**
   * Carousel의 직계 자식 컴포넌트에 flex를 지정해 주세요.
   * 한 슬라이드에 하나의 요소만 보여주고 싶다면 `flex: 0 0 100%`을 지정해 주세요.
   * 여러 요소를 동시에 보여주고 싶다면 `flex: 0 0 아이템너비`를 지정해 주세요.
   * @param gap - 직계 자식 컴포넌트 간 간격을 지정해요.
   * @param setIndex - 부모 컴포넌트에 index state를 만들어 setter를 넘겨 주세요.
   */

  const carouselRef = useRef(null);
  const [firstX, setFirstX] = useState(0);
  const [lastX, setLastX] = useState(0);
  if (setIndex) {
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
            setIndex(index);
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
  }
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
  return (
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
        cloneElement(child, { 'data-index': index + 1 }),
      )}
    </CarouselContainer>
  );
};

export default Carousel;
