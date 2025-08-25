import { authClient } from './instance';

/**
 * 펀딩 지도 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getFundingMap = async (
  profile,
  zoom,
  sido,
  sigungu,
  eupmyundong,
  order,
  industry,
) => {
  const params = new URLSearchParams();
  params.append('sido', sido);
  params.append('sigungu', sigungu);
  params.append('eupmyundong', eupmyundong);
  params.append('order', order);
  params.append('industry', industry);
  return await authClient.get(`/fundings/${profile}/${zoom}`, {
    params: params,
  });
};

/**
 * 펀딩 상세 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getFundingDetail = async (funding_id, profile) => {
  return await authClient.get(`/fundings/${funding_id}/${profile}`);
};

/**
 * 내가 만든 펀딩 목록 조회
 */
const getFundingMyCreatedList = async () => {
  return await authClient.get(`/fundings/founder/my-created`);
};

/**
 * 내가 후원한 펀딩 목록 조회
 */
const getFundingMyPaidList = async () => {
  return await authClient.get(`/fundings/proposer/my-paid`);
};

/**
 * 펀딩 좋아요 추가/삭제
 */
const postFundingLike = async (funding_id) => {
  return await authClient.post(
    `/fundings/proposer/like`,
    { funding_id },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 펀딩 스크랩 추가/삭제
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const postFundingScrap = async (profile, funding_id) => {
  return await authClient.post(
    `/fundings/${profile}/scrap`,
    { funding_id },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 펀딩 스크랩 목록 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getFundingScrapList = async (profile, sido, sigungu, eupmyundong) => {
  const params = new URLSearchParams();
  params.append('sido', sido);
  params.append('sigungu', sigungu);
  params.append('eupmyundong', eupmyundong);
  return await authClient.get(`/fundings/${profile}/scrap`, { params: params });
};

/**
 * 리워드 목록 조회
 */
const getRewardList = async (category) => {
  const params = new URLSearchParams();
  params.set('category', category);
  return await authClient.get(`/fundings/proposer/reward`, { params: params });
};

export {
  getFundingMap,
  getFundingDetail,
  getFundingMyCreatedList,
  getFundingMyPaidList,
  postFundingLike,
  postFundingScrap,
  getFundingScrapList,
  getRewardList,
};
