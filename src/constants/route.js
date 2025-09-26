const ROUTE_PATH = Object.freeze({
  /* 가입/로그인 */
  ROOT: '/', // 랜딩
  LOGIN: '/login', // 로그인
  SIGNUP: '/signup', // 인트로+회원가입+온보딩
  SIGNUP_PROPOSER: '/signup/proposer', // 마이 페이지에서 제안자 프로필 추가 시
  SIGNUP_FOUNDER: '/signup/founder', // 마이 페이지에서 창업자 프로필 추가 시
  /* 제안 */
  PROPOSAL_CREATE: '/proposal/create', // 제안 추가
  PROPOSAL: '/proposal', // 제안 탐색
  PROPOSAL_DETAIL: (proposalId) => `/proposal/${proposalId}`, // 제안 상세
  /* 펀딩 */
  FUNDING_CREATE: '/funding/create', // 펀딩 추가
  FUNDING: '/funding', // 펀딩 탐색
  FUNDING_DETAIL: (fundingId) => `/funding/${fundingId}`, // 펀딩 상세
  FUNDING_DETAIL_PLEDGE: (fundingId) => `/funding/${fundingId}/pledge`, // 펀딩 후원
  /* AI 추천 */
  RECOMMENDATION_PROPOSAL: '/recommendation/proposal', // AI 추천 제안
  /* 리워드 */
  REWARD: '/reward', // 리워드 목록
  REWARD_DETAIL: (rewardId) => `/reward/${rewardId}`, // 리워드 상세
  /* 마이 */
  MY: '/my', // 마이
  MY_UPDATE: '/my/update', // 프로필 수정
  MY_UPDATE_ADDRESS: '/my/update/address', // 동네 설정
  MY_UPDATE_INDUSTRY: '/my/update/industry', // 업종 설정
  MY_SCRAP: '/my/scrap', // 스크랩
  MY_PROPOSAL: '/my/proposal', // 내가 만든 제안
  MY_FUNDING: '/my/funding', // 제안자-내가 후원한 펀딩, 창업자-내가 만든 펀딩
  LEVEL: '/level', // 지역주민 레벨 안내
  /* 알림 */
  NOTIFICATION: '/notification', // 알림 목록
});

export { ROUTE_PATH };
