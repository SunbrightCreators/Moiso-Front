import './styles/reset.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/global';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>앱 시작!</div>
    </ThemeProvider>
  );
}

export default App;
