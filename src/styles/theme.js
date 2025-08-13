import {
  defineTokens,
  defineConfig,
  createSystem,
  defaultConfig,
} from '@chakra-ui/react';

// 1) 토큰 정의 (colors, fonts 등)
const tokens = defineTokens({
  colors: {
    primary: { value: '#3498db' },
  },
  fonts: {
    body: { value: 'system-ui, sans-serif' },
    heading: { value: 'Georgia, serif' },
  },
});

// 2) 글로벌 스타일 정의
// prettier-ignore
const globalCss = {
  'body': {
    '@supports (height: 100svh)': { height: '100svh' },
    '@supports not (height: 100svh)': { height: '100vh' },
    '@media (max-width: 480px)': {
      '@supports (width: 100svw)': { width: '100svw' },
      '@supports not (width: 100svw)': { width: '100vw' },
    },
    '@media (min-width: 480px)': {
      width: '480px',
      margin: '0 auto',
    },
  },
};

// 3) Chakra 설정(config) 정의
const config = defineConfig({
  cssVarsPrefix: '',
  preflight: true, // CSS Reset 켜기
  theme: { tokens },
  globalCss,
});

// 4) 실제 Provider에 전달할 “시스템” 생성
const system = createSystem(defaultConfig, config);

export default system;
