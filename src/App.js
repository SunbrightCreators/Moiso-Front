import './styles/reset.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/global';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>앱 시작!</div>
    </ThemeProvider>
  );
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo192.png" className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
