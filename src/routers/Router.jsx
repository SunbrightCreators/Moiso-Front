import { createBrowserRouter } from 'react-router-dom';
import { ROUTE_PATH } from '../constants/route';

const router = createBrowserRouter([
  // No Layout
  {
    path: ROUTE_PATH.ROOT,
    lazy: () => import('../pages/root'),
  },
  {
    path: ROUTE_PATH.PROPOSAL_CREATE,
    lazy: () => import('../pages/proposal-create'),
  },
  // TopNavigation
  {
    lazy: () => import(''),
    children: [
      {
        path: ROUTE_PATH.LOGIN,
        lazy: () => import('../pages/login'),
        handle: {
          title: '로그인',
          left: 'back',
        },
      },
      // {
      //   path: ROUTE_PATH.REWARD_DETAIL(':rewardId'),
      //   lazy: () => import('../pages/reward-detail'),
      // },
      // {
      //   path: ROUTE_PATH.MY_UPDATE,
      //   lazy: () => import('../pages/my-update'),
      // },
      // {
      //   path: ROUTE_PATH.MY_UPDATE_ADDRESS,
      //   lazy: () => import('../pages/my-update-address'),
      // },
      {
        path: ROUTE_PATH.MY_SCRAP,
        lazy: () => import('../pages/my-scrap'),
        handle: {
          title: '스크랩',
          left: 'back',
        },
      },
      {
        path: ROUTE_PATH.MY_PROPOSAL,
        lazy: () => import('../pages/my-proposal'),
        handle: {
          title: '내가 작성한 제안',
          left: 'back',
        },
      },
      {
        path: ROUTE_PATH.MY_FUNDING,
        lazy: () => import('../pages/my-funding'),
        handle: {
          title: '',
          left: 'back',
        },
      },
      {
        path: ROUTE_PATH.LEVEL,
        lazy: () => import('../pages/level'),
        handle: {
          title: '지역주민 레벨 안내',
          left: 'back',
        },
      },
      // {
      //   path: ROUTE_PATH.NOTIFICATION,
      //   lazy: () => import('../pages/notification'),
      // },
    ],
  },
  // BottomNavigation
  {
    lazy: () => import(''),
    children: [
      {
        path: ROUTE_PATH.PROPOSAL,
        lazy: () => import('../pages/proposal'),
      },
      {
        path: ROUTE_PATH.FUNDING,
        lazy: () => import('../pages/funding'),
      },
      {
        path: ROUTE_PATH.RECOMMENDATION_PROPOSAL,
        lazy: () => import('../pages/recommendation-proposal'),
      },
    ],
  },
  // TopNavigation + BottomNavigation
  {
    lazy: () => import(''),
    children: [
      {
        path: ROUTE_PATH.REWARD,
        lazy: () => import('../pages/reward'),
        handle: {
          title: '리워드',
        },
      },
      {
        path: ROUTE_PATH.MY,
        lazy: () => import('../pages/my'),
        handle: {
          title: '마이',
        },
      },
    ],
  },
  // TopNavigation + BottomButton
  {
    lazy: () => import(''),
    children: [
      {
        path: ROUTE_PATH.SIGNUP,
        lazy: () => import('../pages/signup'),
        handle: {
          title: '회원가입',
          left: 'back',
        },
      },
      {
        path: ROUTE_PATH.SIGNUP_PROPOSER,
        lazy: () => import('../pages/signup-proposer'),
        handle: {
          title: '지역주민 가입',
          left: 'back',
        },
      },
      {
        path: ROUTE_PATH.SIGNUP_FOUNDER,
        lazy: () => import('../pages/signup-founder'),
        handle: {
          title: '창업자 가입',
          left: 'back',
        },
      },
      // {
      //   path: ROUTE_PATH.FUNDING_CREATE,
      //   lazy: () => import('../pages/funding-create'),
      // },
      // {
      //   path: ROUTE_PATH.FUNDING_DETAIL_PLEDGE(':fundingId'),
      //   lazy: () => import('../pages/funding-detail-pledge'),
      // },
      // {
      //   path: ROUTE_PATH.MY_UPDATE_INDUSTRY,
      //   lazy: () => import('../pages/my-update-industry'),
      // },
    ],
  },
  // TopBackButton
  {
    lazy: () => import(''),
    children: [
      {
        path: ROUTE_PATH.PROPOSAL_DETAIL(':proposalId'),
        lazy: () => import('../pages/proposal-detail'),
      },
      {
        path: ROUTE_PATH.FUNDING_DETAIL(':fundingId'),
        lazy: () => import('../pages/funding-detail'),
      },
    ],
  },
]);

export default router;
