import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LogInPage';
import SignUpIndex from './pages/SignUpIndex';
import NeighborhoodSettingsPage from './pages/NeighborhoodSettingsPage';
import FounderTarget from './pages/FounderTarget';
import FounderTime from './pages/FounderTime';
import WelcomePage from './pages/WelcomePage';

import { ROUTE_PATH } from './constants/route';
import OnBaoardingSelect from './pages/OnBardingSelect';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATH.SIGNUP} element={<SignUpIndex />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
