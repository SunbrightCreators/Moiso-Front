import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

/* 공통 컨테이너: 가로 스크롤 + 스냅 + 스크롤바 숨김 */
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
  -ms-use-select: none;
  user-select: none;

  display: flex;

  > * {
    flex: 0 0 ${({ $itemWidth = '100%' }) => $itemWidth};
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  gap: ${({ $gap }) => $gap};
`;

const Carousel = ({ children, gap = 0, itemWidth = '100%' }) => {
  const ref = useRef(null);

  const [firstX, setFirstX] = useState(-1);
  const [lastX, setLastX] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);

  const itemWidthPx = ref.current?.firstElementChild?.clientWidth || 0;
  const containerWidth = ref.current?.clientWidth || 0;

  let itemsPerPage;
  if (itemWidthPx / containerWidth > 0.9) {
    // 거의 꽉 차면 풀스크린 취급
    itemsPerPage = 1;
  } else {
    itemsPerPage = Math.max(1, Math.floor(containerWidth / itemWidthPx));
  }

  const pageWidth = itemsPerPage * itemWidthPx;
  const pageLength = Math.ceil(children.length / itemsPerPage);

  // 스와이프 방향 감지
  useEffect(() => {
    if (firstX != -1 && lastX != -1) {
      if (firstX - lastX < 0) {
        if (currentPage != 0) setCurrentPage(currentPage - 1);
      } else if (firstX - lastX > 0) {
        if (currentPage != pageLength - 1) setCurrentPage(currentPage + 1);
      }
      setFirstX(-1);
      setLastX(-1);
    }
  }, [firstX, lastX]);

  // 페이지 이동
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        left: pageWidth * currentPage,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  return (
    <CarouselContainer
      ref={ref}
      $gap={gap}
      $itemWidth={itemWidth}
      onPointerDown={(e) => setFirstX(e.clientX)}
      onPointerUp={(e) => setLastX(e.clientX)}
    >
      {children}
    </CarouselContainer>
  );
};

export { Carousel };
