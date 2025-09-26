import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';

const Root = lazy(() => import('../pages/root'));
const Login = lazy(() => import('../pages/login'));
const Signup = lazy(() => import('../pages/signup'));
const SignupProposer = lazy(() => import('../pages/signup-proposer'));
const SignupFounder = lazy(() => import('../pages/signup-founder'));
const ProposalCreate = lazy(() => import('../pages/proposal-create'));
const Proposal = lazy(() => import('../pages/proposal'));
const ProposalDetail = lazy(() => import('../pages/proposal-detail'));
const FundingCreate = lazy(() => import('../pages/funding-create'));
const Funding = lazy(() => import('../pages/funding'));
const FundingDetail = lazy(() => import('../pages/funding-detail'));
const FundingDetailPledge = lazy(() => import('../pages/funding-detail-pledge'));
const RecommendationProposal = lazy(() => import('../pages/recommendation-proposal'));
const Reward = lazy(() => import('../pages/reward'));
const RewardDetail = lazy(() => import('../pages/reward-detail'));
const My = lazy(() => import('../pages/my'));
const MyUpdate = lazy(() => import('../pages/my-update'));
const MyUpdateAddress = lazy(() => import('../pages/my-update-address'));
const MyUpdateIndustry = lazy(() => import('../pages/my-update-industry'));
const MyScrap = lazy(() => import('../pages/my-scrap'));
const MyProposal = lazy(() => import('../pages/my-proposal'));
const MyFunding = lazy(() => import('../pages/my-funding'));
const Level = lazy(() => import('../pages/level'));
const Notification = lazy(() => import('../pages/notification'));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.ROOT} element={<Root />} />
        <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
        <Route path={ROUTE_PATH.SIGNUP} element={<Signup />} />
        <Route path={ROUTE_PATH.SIGNUP_PROPOSER} element={<SignupProposer />} />
        <Route path={ROUTE_PATH.SIGNUP_FOUNDER} element={<SignupFounder />} />
        <Route path={ROUTE_PATH.PROPOSAL_CREATE} element={<ProposalCreate />} />
        <Route path={ROUTE_PATH.PROPOSAL} element={<Proposal />} />
        <Route
          path={ROUTE_PATH.PROPOSAL_DETAIL(':proposalId')}
          element={<ProposalDetail />}
        />
        <Route path={ROUTE_PATH.FUNDING_CREATE} element={<FundingCreate />} />
        <Route path={ROUTE_PATH.FUNDING} element={<Funding />} />
        <Route
          path={ROUTE_PATH.FUNDING_DETAIL(':fundingId')}
          element={<FundingDetail />}
        />
        <Route
          path={ROUTE_PATH.FUNDING_DETAIL_PLEDGE(':fundingId')}
          element={<FundingDetailPledge />}
        />
        <Route
          path={ROUTE_PATH.RECOMMENDATION_PROPOSAL}
          element={<RecommendationProposal />}
        />
        <Route path={ROUTE_PATH.REWARD} element={<Reward />} />
        <Route
          path={ROUTE_PATH.REWARD_DETAIL(':rewardId')}
          element={<RewardDetail />}
        />
        <Route path={ROUTE_PATH.MY} element={<My />} />
        <Route path={ROUTE_PATH.MY_UPDATE} element={<MyUpdate />} />
        <Route
          path={ROUTE_PATH.MY_UPDATE_ADDRESS}
          element={<MyUpdateAddress />}
        />
        <Route
          path={ROUTE_PATH.MY_UPDATE_INDUSTRY}
          element={<MyUpdateIndustry />}
        />
        <Route path={ROUTE_PATH.MY_SCRAP} element={<MyScrap />} />
        <Route path={ROUTE_PATH.MY_PROPOSAL} element={<MyProposal />} />
        <Route path={ROUTE_PATH.MY_FUNDING} element={<MyFunding />} />
        <Route path={ROUTE_PATH.LEVEL} element={<Level />} />
        <Route path={ROUTE_PATH.NOTIFICATION} element={<Notification />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
