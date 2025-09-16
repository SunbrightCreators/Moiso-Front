import {
  defineTokens,
  defineConfig,
  createSystem,
  defaultConfig,
} from '@chakra-ui/react';

// 1) 토큰 정의 (colors, fonts 등)
// prettier-ignore
const tokens = defineTokens({
  colors: {
    text: {
      default: 'var(--colors-gray-800)',
      muted: 'var(--colors-gray-600)',
      subtle: 'var(--colors-gray-400)',
      subtle2: 'var(--colors-gray-300)',
      inverted: 'var(--colors-gray-50)',
      error: 'var(--colors-red-500)',
      warning: 'var(--colors-yellow-600)',
      success: 'var(--colors-green-600)',
      info: 'var(--colors-blue-600)',
    },
  },
  lineHeights: {
    '2xs': '0.875',
    xs: '1',
    sm: '1.25',
    md: '1.5',
    lg: '1.75',
    xl: '1.875',
    '2xl': '2',
  },
  text: {
    '2xs': {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-2xs) / var(--line-heights-2xs) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-2xs) / var(--line-heights-2xs) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-2xs) / var(--line-heights-2xs) var(--fonts-body)',
    },
    xs: {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-xs) / var(--line-heights-xs) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-xs) / var(--line-heights-xs) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-xs) / var(--line-heights-xs) var(--fonts-body)',
    },
    sm: {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-sm) / var(--line-heights-sm) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-sm) / var(--line-heights-sm) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-sm) / var(--line-heights-sm) var(--fonts-body)',
    },
    md: {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-md) / var(--line-heights-md) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-md) / var(--line-heights-md) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-md) / var(--line-heights-md) var(--fonts-body)',
    },
    lg: {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-lg) / var(--line-heights-lg) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-lg) / var(--line-heights-lg) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-lg) / var(--line-heights-lg) var(--fonts-body)',
    },
    xl: {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-xl) / var(--line-heights-xl) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-xl) / var(--line-heights-xl) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-semibold) normal var(--font-sizes-xl) / var(--line-heights-xl)  var(--fonts-body)',
    },
    '2xl': {
      normal: 'normal normal var(--font-weights-normal) normal var(--font-sizes-2xl) / var(--line-heights-2xl) var(--fonts-body)',
      medium: 'normal normal var(--font-weights-medium) normal var(--font-sizes-2xl)  / var(--line-heights-2xl) var(--fonts-body)',
      semibold: 'normal normal var(--font-weights-normal) normal var(--font-sizes-2xl) / var(--line-heights-2xl) var(--fonts-body)',
    },
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
  '#root, #modal': {
    width: 'inherit',
    height: 'inherit',
  },
  '#modal': {
    position: 'fixed',
    'z-index': '900',
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
