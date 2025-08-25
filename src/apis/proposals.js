import { authClient } from './instance';

/**
 * 제안 추가
 * @param {str} title
 * @param {str} content
 * @param {INDUSTRY.value} industry
 * @param {object} business_hours
 * @param {object} address
 * @param {object} position
 * @param {int} radius
 * @param {list} imageList fileInput.files
 */
const postProposal = async (
  title,
  content,
  industry,
  business_hours,
  address,
  position,
  radius,
  imageList,
) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('industry', industry);
  formData.append('business_hours', business_hours);
  formData.append('address', address);
  formData.append('position', position);
  formData.append('radius', radius);
  formData.append('image', imageList);
  return await authClient.post(`/proposals`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 제안 지도 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getProposalMap = async (
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
  return await authClient.get(`/proposals/${profile}/${zoom}`, {
    params: params,
  });
};

/**
 * 제안 상세 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getProposalDetail = async (proposal_id, profile) => {
  return await authClient.get(`/proposals/${proposal_id}/${profile}`);
};

/**
 * 내가 만든 제안 목록 조회
 */
const getProposalMyCreatedList = async (sido, sigungu, eupmyundong) => {
  const params = new URLSearchParams();
  params.append('sido', sido);
  params.append('sigungu', sigungu);
  params.append('eupmyundong', eupmyundong);
  return await authClient.get(`/proposals/proposer/my-created`, {
    params: params,
  });
};

/**
 * 제안 좋아요 추가/삭제
 */
const postProposalLike = async (proposal_id) => {
  return await authClient.post(
    `/proposals/proposer/like`,
    { proposal_id },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 제안 스크랩 추가/삭제
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const postProposalScrap = async (profile, proposal_id) => {
  return await authClient.post(
    `/proposals/${profile}/scrap`,
    { proposal_id },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 제안 스크랩 목록 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const getProposalScrapList = async (profile, sido, sigungu, eupmyundong) => {
  const params = new URLSearchParams();
  params.append('sido', sido);
  params.append('sigungu', sigungu);
  params.append('eupmyundong', eupmyundong);
  return await authClient.get(`/proposals/${profile}/scrap`, {
    params: params,
  });
};

export {
  postProposal,
  getProposalMap,
  getProposalDetail,
  getProposalMyCreatedList,
  postProposalLike,
  postProposalScrap,
  getProposalScrapList,
};
