import { useQuery, useMutation } from '@tanstack/react-query';
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
const usePostProposal = () => {
  return useMutation({
    mutationFn: ({
      title,
      content,
      industry,
      business_hours,
      address,
      position,
      radius,
      imageList,
    }) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('industry', industry);
      formData.append('business_hours', business_hours);
      formData.append('address', address);
      formData.append('position', position);
      formData.append('radius', radius);
      formData.append('image', imageList);
      return authClient.post(`/proposals`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
};

/**
 * 제안 지도 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const useGetProposalMap = (
  profile,
  zoom,
  sido,
  sigungu,
  eupmyundong,
  order,
  industry,
) => {
  return useQuery({
    queryKey: [
      'useGetProposalMap',
      profile,
      zoom,
      sido,
      sigungu,
      eupmyundong,
      order,
      industry,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('sido', sido);
      params.append('sigungu', sigungu);
      params.append('eupmyundong', eupmyundong);
      params.append('order', order);
      params.append('industry', industry);
      return authClient.get(`/proposals/${profile}/${zoom}`, {
        params: params,
      });
    },
  });
};

/**
 * 제안 상세 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const useGetProposalDetail = (proposal_id, profile) => {
  return useQuery({
    queryKey: ['useGetProposalDetail', proposal_id, profile],
    queryFn: () => {
      return authClient.get(`/proposals/${proposal_id}/${profile}`);
    },
  });
};

/**
 * 내가 만든 제안 목록 조회
 */
const useGetProposalMyCreatedList = (sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetProposalMyCreatedList', sido, sigungu, eupmyundong],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('sido', sido);
      params.append('sigungu', sigungu);
      params.append('eupmyundong', eupmyundong);
      return authClient.get(`/proposals/proposer/my-created`, {
        params: params,
      });
    },
  });
};

/**
 * 제안 좋아요 추가/삭제
 */
const usePostProposalLike = () => {
  return useMutation({
    mutationFn: ({ proposal_id }) => {
      return authClient.post(
        `/proposals/proposer/like`,
        { proposal_id },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 제안 스크랩 추가/삭제
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const usePostProposalScrap = () => {
  return useMutation({
    mutationFn: ({ profile, proposal_id }) => {
      return authClient.post(
        `/proposals/${profile}/scrap`,
        { proposal_id },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 제안 스크랩 목록 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const useGetProposalScrapList = (profile, sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetProposalScrapList', profile, sido, sigungu, eupmyundong],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('sido', sido);
      params.append('sigungu', sigungu);
      params.append('eupmyundong', eupmyundong);
      return authClient.get(`/proposals/${profile}/scrap`, {
        params: params,
      });
    },
  });
};

export {
  usePostProposal,
  useGetProposalMap,
  useGetProposalDetail,
  useGetProposalMyCreatedList,
  usePostProposalLike,
  usePostProposalScrap,
  useGetProposalScrapList,
};
