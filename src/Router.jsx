import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Carousel from './components/common/carousel'; // default export 기준

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div style={{ padding: '20px' }}>
              <h2>홈</h2>
              <Carousel gap='20px'>
                <div style={{ background: '#f99', height: '200px' }}>1</div>
                <div style={{ background: '#9f9', height: '200px' }}>2</div>
                <div style={{ background: '#99f', height: '200px' }}>3</div>
                <div style={{ background: '#ff9', height: '200px' }}>4</div>
              </Carousel>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
