import React from 'react';
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
`;

/* 공통 트랙: 아이템 가로 나열 */
const CarouselTrack = styled.div`
  display: flex;
  gap: var(--gap, 0px);
`;

/* 공통 아이템: 폭과 스냅은 CSS 변수로 제어 */
const CarouselItem = styled.div`
  flex: 0 0 var(--item-width, 100%);
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

/* 1) 풀스크린 캐러셀 */
function FullscreenCarousel({ children, gap = 0 }) {
  const styleVars = {
    '--gap': `${gap / 16}rem`,
    '--item-width': '100%',
  };
  return (
    <CarouselContainer style={styleVars}>
      <CarouselTrack>
        {React.Children.map(children, (child, i) => (
          <CarouselItem key={i}>{child}</CarouselItem>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
}

/* 2) 멀티 아이템 캐러셀 */
function MultiItemCarousel({ children, itemWidth = 280, gap = 18 }) {
  const styleVars = {
    '--gap': `${gap / 16}rem`,
    '--item-width':
      typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth,
  };
  return (
    <CarouselContainer style={styleVars}>
      <CarouselTrack>
        {React.Children.map(children, (child, i) => (
          <CarouselItem key={i}>{child}</CarouselItem>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
}

export { FullscreenCarousel, MultiItemCarousel };
