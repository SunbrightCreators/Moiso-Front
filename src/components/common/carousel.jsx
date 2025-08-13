// carousel.jsx
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

/* 가로 스크롤 + 스냅 + 스크롤바 숨김 */
const CarouselContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

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

  /* 모바일에서 세로 스크롤 허용 */
  touch-action: pan-y;

  display: flex;
  gap: ${({ $gap }) => $gap};

  > * {
    /* itemWidth로 한 칸의 폭을 고정 */
    flex: 0 0 ${({ $itemWidth = '100%' }) => $itemWidth};
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

const Carousel = ({ gap, children }) => {
  const carouselRef = useRef(null);
  const [firstX, setFirstX] = useState(0);
  const [lastX, setLastX] = useState(0);

  useEffect(() => {
    if (!carouselRef.current) return;
    if (firstX === 0 || lastX === 0) return;

    const diff = firstX - lastX;
    const THRESHOLD = 50; // 스와이프 감지 임계값 (px)

    if (Math.abs(diff) > THRESHOLD) {
      const el = carouselRef.current;

      el.scrollBy({
        left: diff > 0 ? 1 : -1, // 왼쪽으로 끌면 다음, 오른쪽으로 끌면 이전
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
      onDragStart={(e) => e.preventDefault()} // 이미지/텍스트 드래그 방지
      $gap={gap}
    >
      {children}
    </CarouselContainer>
  );
};

export default Carousel;
