import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// 1. 테스트하려는 InputSearch 컴포넌트를 불러옵니다.
import InputSearch from './components/common/InputSearch'; // InputSearch 컴포넌트 경로 확인!

// 2. 라우트 안에서 렌더링할 테스트용 컴포넌트를 이 파일 안에 바로 만듭니다.
const SearchPage = () => {
  const handleSearch = (searchTerm) => {
    alert(`검색된 단어: ${searchTerm}`);
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>검색 컴포넌트 테스트</h1>
      <InputSearch
        onSearch={handleSearch}
        placeholder='검색어를 입력하고 Enter를 누르세요'
      />
    </div>
  );
};

const HomePage = () => (
  <div style={{ padding: '50px' }}>
    <h1>홈</h1>
    <Link to='/search'>검색 테스트 페이지로 가기</Link>
  </div>
);

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* 3. '/search' 경로에 위에서 만든 테스트용 컴포넌트를 연결합니다. */}
        <Route path='/search' element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
