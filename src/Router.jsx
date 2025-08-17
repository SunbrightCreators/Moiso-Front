import React from 'react';
// 1. BrowserRouter를 react-router-dom에서 가져옵니다.
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import useModeStore from './stores/useModeStore';
import BottomNavigation from './components/common/BottomNavigation';

// --- 테스트용 임시 페이지 (이 부분은 수정할 필요 없습니다) ---
const DummyPage = () => {
  const location = useLocation();
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: '#f0f8ff',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {location.pathname}
      </h2>
      <p>페이지가 성공적으로 이동되었습니다.</p>
    </div>
  );
};

// --- 화면 구성 컴포넌트들 (이 부분도 수정할 필요 없습니다) ---
const MainApp = () => {
  const { userMode: mode, setUserMode } = useModeStore();
  return (
    <div>
      <header
        style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #eee',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px' }}>
          현재 모드:{' '}
          <strong style={{ color: '#007bff' }}>
            {mode === 'founder' ? '창업자' : '지역주민'}
          </strong>
        </h1>
        <button onClick={() => setUserMode(null)} style={{ marginTop: '10px' }}>
          모드 다시 선택
        </button>
      </header>
      <main>
        <Routes>
          <Route path='/proposal' element={<DummyPage />} />
          <Route path='/funding' element={<DummyPage />} />
          <Route path='/reward' element={<DummyPage />} />
          <Route path='/my' element={<DummyPage />} />
          <Route path='/recommend' element={<DummyPage />} />
          <Route path='*' element={<Navigate to='/proposal' replace />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
};

const ModeSelector = () => {
  const { setUserMode } = useModeStore();
  return (
    <div style={{ textAlign: 'center', paddingTop: '150px' }}>
      <h1 style={{ marginBottom: '30px' }}>어떤 모드로 시작하시겠어요?</h1>
      <button
        style={{ marginRight: '20px', padding: '15px 25px', fontSize: '16px' }}
        onClick={() => setUserMode('resident')}
      >
        지역주민으로 시작
      </button>
      <button
        style={{ padding: '15px 25px', fontSize: '16px' }}
        onClick={() => setUserMode('founder')}
      >
        창업자로 시작
      </button>
    </div>
  );
};

// --- 최종적으로 내보낼 Router 컴포넌트 ---
const Router = () => {
  const { userMode: mode } = useModeStore();

  // 2. 모든 것을 BrowserRouter로 감싸줍니다.
  return <BrowserRouter>{mode ? <MainApp /> : <ModeSelector />}</BrowserRouter>;
};

// 3. App 대신 Router를 기본으로 내보냅니다.
export default Router;
