// src/styles/system.js
import {
  defineConfig,
  defineTokens,
  defineGlobalStyles,
  createSystem,
  defaultConfig,
} from '@chakra-ui/react';

// 1) 토큰 정의 (colors, fonts 등)
const tokens = defineTokens({
  colors: {
    primary: { value: '#3498db' },
    gray: { value: '#bdc3c7' },
  },
  fonts: {
    body: { value: 'system-ui, sans-serif' },
    heading: { value: 'Georgia, serif' },
  },
});

// 2) 글로벌 스타일 정의
const GlobalStyle = defineGlobalStyles({
  body: {
    '@supports(height: 100svh)': { height: '100svh' },
    '@supports not (height: 100svh)': { height: '100vh' },
    '@media(max-width:360px)': {
      '@supports(width:100svw)': { width: '100svw' },
      '@supports not(width:100svw)': { width: '100vw' },
    },
    '@media(min-width:360px)': {
      width: '360px',
      margin: '0 auto',
    },
  },
});
export const theme = {
  colors: {
    primary: tokens.colors.primary.value,
    gray: tokens.colors.gray.value,
  },
  fonts: {
    body: tokens.fonts.body.value,
    heading: tokens.fonts.heading.value,
  },
};

// 3) Chakra 설정(config) 정의
const config = defineConfig({
  cssVarsPrefix: 'ck', // CSS 변수 앞에 붙일 접두사
  initialColorMode: 'light',
  useSystemColorMode: false,
  preflight: true, // CSS Reset 켜기
  tokens,
  globalStyles: GlobalStyle,
});

// 4) 실제 Provider에 전달할 “시스템” 생성
export const system = createSystem(defaultConfig, config);
