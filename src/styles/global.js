import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #fff;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
