import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    @supports (height: 100svh) { height: 100svh; }
    @supports not (height: 100svh) { height: 100vh; }
    @media (max-width: 360px) {
      @supports (width: 100svw) { width: 100svw; }
      @supports not (width: 100svw) { width: 100vw; }
    }
    @media (min-width: 360px) {
      width: 360px;
      margin: 0 auto;
    }
  }
`;

export default GlobalStyle;
