// src/pages/CarouselDemo.jsx
import React from 'react';
import {
  FullscreenCarousel,
  MultiItemCarousel,
} from './components/common/carousel';

export default function CarouselDemo() {
  return (
    <div>
      <h2>풀스크린 캐러셀</h2>
      <FullscreenCarousel>
        <div style={{ height: 200, background: '#eee' }}>슬라이드 1</div>
        <div style={{ height: 200, background: '#ccc' }}>슬라이드 2</div>
        <div style={{ height: 200, background: '#aaa' }}>슬라이드 3</div>
      </FullscreenCarousel>

      <h2>멀티 아이템 캐러셀</h2>
      <MultiItemCarousel itemWidth={280} gap={16}>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 160,
              border: '1px solid #cf2f2fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            카드 {i + 1}
          </div>
        ))}
      </MultiItemCarousel>
    </div>
  );
}
