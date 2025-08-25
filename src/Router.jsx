import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTE_PATH } from './constants/route';
import LandingPage from './pages/LandingPage';
import LogInPage from './pages/LogInPage';
import SignupIndex from './pages/SignUpIndex';
import ProposalCreatePage from './pages/ProposalCreatePage';
import ProposalListPage from './pages/ProposalListPage';
import ProposalRecPage from './pages/ProposalRecPage';
import RewardPage from './pages/RewardPage';
import MyPage from './pages/MyPage';
import MyProposalPage from './pages/MyProposalPage';
import MyFundingPage from './pages/MyFundingPage';
import LevelInfoPage from './pages/LevelInfoPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.ROOT} element={<LandingPage />} />
        <Route path={ROUTE_PATH.LOGIN} element={<LogInPage />} />
        <Route path={ROUTE_PATH.SIGNUP} element={<SignupIndex />} />
        <Route path={ROUTE_PATH.SIGNUP_PROPOSER} element={<SignupIndex />} />
        <Route path={ROUTE_PATH.SIGNUP_FOUNDER} element={<SignupIndex />} />
        <Route
          path={ROUTE_PATH.PROPOSAL_CREATE}
          element={<ProposalCreatePage />}
        />
        <Route path={ROUTE_PATH.PROPOSAL} element={<ProposalListPage />} />
        <Route path='/proposal/:proposalId' element={<div></div>} />
        <Route path={ROUTE_PATH.FUNDING_CREATE} element={<div></div>} />
        <Route path={ROUTE_PATH.FUNDING} element={<ProposalListPage />} />
        <Route path='/funding/:fundingId' element={<div></div>} />
        <Route path='/funding/:fundingId/pledge' element={<div></div>} />
        <Route
          path={ROUTE_PATH.RECOMMENDATION_PROPOSAL}
          element={<ProposalRecPage />}
        />
        <Route path={ROUTE_PATH.REWARD} element={<RewardPage />} />
        <Route path='/reward/:rewardId' element={<div></div>} />
        <Route path={ROUTE_PATH.MY} element={<MyPage />} />
        <Route path={ROUTE_PATH.MY_UPDATE} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_UPDATE_ADDRESS} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_UPDATE_INDUSTRY} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_SCRAP} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_PROPOSAL} element={<MyProposalPage />} />
        <Route path={ROUTE_PATH.MY_FUNDING} element={<MyFundingPage />} />
        <Route path={ROUTE_PATH.LEVEL} element={<LevelInfoPage />} />
        <Route path={ROUTE_PATH.NOTIFICATION} element={<div></div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
