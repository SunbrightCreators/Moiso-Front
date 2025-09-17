import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from './instance';

const queryClient = useQueryClient();

/**
 * 제안 추가
 * @param {string} title `string`
 * @param {string} content `string`
 * @param {INDUSTRY.value} industry `INDUSTRY.value`
 * @param {object} business_hours `object`
 * @param {object} address `object`
 * @param {object} position `object`
 * @param {RADIUS.M0 | RADIUS.M250 | RADIUS.M500 | RADIUS.M750 | RADIUS.M1000} radius `RADIUS.M0 | RADIUS.M250 | RADIUS.M500 | RADIUS.M750 | RADIUS.M1000`
 * @param {FileList | null} imageList `FileList | null` fileInput.files 또는 `null`
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['useGetProposalMap'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['useGetProposalMyCreatedList'],
        }),
      ]);
    },
  });
};

/**
 * 제안 지도 조회
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {ZOOM.M0 | ZOOM.M500 | ZOOM.M2000 | ZOOM.M10000} zoom `ZOOM.M0 | ZOOM.M500 | ZOOM.M2000 | ZOOM.M10000`
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 * @param {string | null} order `string | null`
 * @param {INDUSTRY.value | null} industry `INDUSTRY.value | null`
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
      return authClient.get(`/proposals/${profile}/${zoom}`, {
        params: new URLSearchParams({
          sido: sido,
          sigungu: sigungu,
          eupmyundong: eupmyundong,
          order: order,
          industry: industry,
        }),
      });
    },
  });
};

/**
 * 제안 상세 조회
 * @param {number} proposal_id `number`
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
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
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 */
const useGetProposalMyCreatedList = (sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetProposalMyCreatedList', sido, sigungu, eupmyundong],
    queryFn: () => {
      return authClient.get(`/proposals/proposer/my-created`, {
        params: new URLSearchParams({
          sido: sido,
          sigungu: sigungu,
          eupmyundong: eupmyundong,
        }),
      });
    },
  });
};

/**
 * 제안 좋아요 추가/삭제
 * @param {number} proposal_id `number`
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
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {number} proposal_id `number`
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
    onSuccess: async (data, { profile }) => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetProposalScrapList', profile],
      });
    },
  });
};

/**
 * 제안 스크랩 목록 조회
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 */
const useGetProposalScrapList = (profile, sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetProposalScrapList', profile, sido, sigungu, eupmyundong],
    queryFn: () => {
      return authClient.get(`/proposals/${profile}/scrap`, {
        params: new URLSearchParams({
          sido: sido,
          sigungu: sigungu,
          eupmyundong: eupmyundong,
        }),
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
