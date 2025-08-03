import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpinnerComponent from './components/common/SpinnerComponent';
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div>
              <h1>홈</h1>
              <h2>스피너 테스트</h2>
              <SpinnerComponent />
            </div>
          }
        />{' '}
        <Route path='/' element={<div>홈</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
