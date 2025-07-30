import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    @supports (height: 100svh) { height: 100svh; }
    @supports not (height: 100svh) { height: 100vh; }
    @media (max-width: 375px) {
      @supports (width: 100svw) { width: 100svw; }
      @supports not (width: 100svw) { width: 100vw; }
    }
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #fff;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
