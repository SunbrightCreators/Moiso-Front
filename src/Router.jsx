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
              <SpinnerComponent />
              <Button type='primary'>테스트 버튼</Button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
