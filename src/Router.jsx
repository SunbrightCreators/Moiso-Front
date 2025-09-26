import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTE_PATH } from './constants/route';
import Root from './pages/root';
import Login from './pages/login';
import Signup from './pages/signup';
import SignupProposer from './pages/signup-proposer';
import SignupFounder from './pages/signup-founder';
import ProposalCreate from './pages/proposal-create';
import CreateProposalMapPage from './pages/proposal-create/CreateProposalMapPage';
import PlaceSearchPage from './pages/proposal-create/PlaceSearchPage';
import Proposal from './pages/proposal';
import ProposalDetail from './pages/proposal-detail';
import FundingCreate from './pages/funding-create';
import Funding from './pages/funding';
import FundingDetail from './pages/funding-detail';
import FundingDetailPledge from './pages/funding-detail-pledge';
import RecommendationProposal from './pages/recommendation-proposal';
import Reward from './pages/reward';
import RewardDetail from './pages/reward-detail';
import My from './pages/my';
import MyUpdate from './pages/my-update';
import MyUpdateAddress from './pages/my-update-address';
import MyUpdateIndustry from './pages/my-update-industry';
import MyScrap from './pages/my-scrap';
import MyProposal from './pages/my-proposal';
import MyFunding from './pages/my-funding';
import Level from './pages/level';
import Notification from './pages/notification';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.ROOT} element={<Root />} />
        <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
        <Route path={ROUTE_PATH.SIGNUP} element={<Signup />} />
        <Route path={ROUTE_PATH.SIGNUP_PROPOSER} element={<div></div>} />
        <Route path={ROUTE_PATH.SIGNUP_FOUNDER} element={<div></div>} />
        <Route path={ROUTE_PATH.PROPOSAL_CREATE} element={<ProposalCreate />} />
        <Route
          path={ROUTE_PATH.PROPOSAL_CREATE_MAP}
          element={<CreateProposalMapPage />}
        />
        <Route
          path='/proposal-create/place-search'
          element={<PlaceSearchPage />}
        />
        <Route path={ROUTE_PATH.PROPOSAL} element={<Proposal />} />
        <Route path='/proposal/:proposalId' element={<div></div>} />
        <Route path={ROUTE_PATH.FUNDING_CREATE} element={<div></div>} />
        <Route path={ROUTE_PATH.FUNDING} element={<div></div>} />
        <Route path='/funding/:fundingId' element={<div></div>} />
        <Route path='/funding/:fundingId/pledge' element={<div></div>} />
        <Route
          path={ROUTE_PATH.RECOMMENDATION_PROPOSAL}
          element={<RecommendationProposal />}
        />
        <Route path={ROUTE_PATH.REWARD} element={<Reward />} />
        <Route path='/reward/:rewardId' element={<div></div>} />
        <Route path={ROUTE_PATH.MY} element={<My />} />
        <Route path={ROUTE_PATH.MY_UPDATE} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_UPDATE_ADDRESS} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_UPDATE_INDUSTRY} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_SCRAP} element={<div></div>} />
        <Route path={ROUTE_PATH.MY_PROPOSAL} element={<MyProposal />} />
        <Route path={ROUTE_PATH.MY_FUNDING} element={<MyFunding />} />
        <Route path={ROUTE_PATH.LEVEL} element={<Level />} />
        <Route path={ROUTE_PATH.NOTIFICATION} element={<div></div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
