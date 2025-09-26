import { createBrowserRouter } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';

const router = createBrowserRouter([
  {
    path: ROUTE_PATH.ROOT,
    lazy: () => import('../pages/root'),
  },
  {
    path: ROUTE_PATH.LOGIN,
    lazy: () => import('../pages/login'),
  },
  {
    path: ROUTE_PATH.SIGNUP,
    lazy: () => import('../pages/signup'),
  },
  {
    path: ROUTE_PATH.SIGNUP_PROPOSER,
    lazy: () => import('../pages/signup-proposer'),
  },
  {
    path: ROUTE_PATH.SIGNUP_FOUNDER,
    lazy: () => import('../pages/signup-founder'),
  },
  {
    path: ROUTE_PATH.PROPOSAL_CREATE,
    lazy: () => import('../pages/proposal-create'),
  },
  {
    path: ROUTE_PATH.PROPOSAL,
    lazy: () => import('../pages/proposal'),
  },
  {
    path: ROUTE_PATH.PROPOSAL_DETAIL(':proposalId'),
    lazy: () => import('../pages/proposal-detail'),
  },
  {
    path: ROUTE_PATH.FUNDING_CREATE,
    lazy: () => import('../pages/funding-create'),
  },
  {
    path: ROUTE_PATH.FUNDING,
    lazy: () => import('../pages/funding'),
  },
  {
    path: ROUTE_PATH.FUNDING_DETAIL(':fundingId'),
    lazy: () => import('../pages/funding-detail'),
  },
  {
    path: ROUTE_PATH.FUNDING_DETAIL_PLEDGE(':fundingId'),
    lazy: () => import('../pages/funding-detail-pledge'),
  },
  {
    path: ROUTE_PATH.RECOMMENDATION_PROPOSAL,
    lazy: () => import('../pages/recommendation-proposal'),
  },
  {
    path: ROUTE_PATH.REWARD,
    lazy: () => import('../pages/reward'),
  },
  {
    path: ROUTE_PATH.REWARD_DETAIL(':rewardId'),
    lazy: () => import('../pages/reward-detail'),
  },
  {
    path: ROUTE_PATH.MY,
    lazy: () => import('../pages/my'),
  },
  {
    path: ROUTE_PATH.MY_UPDATE,
    lazy: () => import('../pages/my-update'),
  },
  {
    path: ROUTE_PATH.MY_UPDATE_ADDRESS,
    lazy: () => import('../pages/my-update-address'),
  },
  {
    path: ROUTE_PATH.MY_UPDATE_INDUSTRY,
    lazy: () => import('../pages/my-update-industry'),
  },
  {
    path: ROUTE_PATH.MY_SCRAP,
    lazy: () => import('../pages/my-scrap'),
  },
  {
    path: ROUTE_PATH.MY_PROPOSAL,
    lazy: () => import('../pages/my-proposal'),
  },
  {
    path: ROUTE_PATH.MY_FUNDING,
    lazy: () => import('../pages/my-funding'),
  },
  {
    path: ROUTE_PATH.LEVEL,
    lazy: () => import('../pages/level'),
  },
  {
    path: ROUTE_PATH.NOTIFICATION,
    lazy: () => import('../pages/notification'),
  },
]);

export default router;
