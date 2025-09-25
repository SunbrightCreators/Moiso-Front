import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from './instance';
import { ZOOM } from '../constants/enum';

/**
 * 펀딩 지도 조회
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {ZOOM.M0 | ZOOM.M500 | ZOOM.M2000 | ZOOM.M10000} zoom `ZOOM.M0 | ZOOM.M500 | ZOOM.M2000 | ZOOM.M10000`
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 * @param {string | null} order `string | null`
 * @param {INDUSTRY.value | null} industry `INDUSTRY.value | null`
 */
const useGetFundingMap = (
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
      'useGetFundingMap',
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
      sido && params.append('sido', sido);
      sigungu && params.append('sigungu', sigungu);
      eupmyundong && params.append('eupmyundong', eupmyundong);
      order && params.append('order', order);
      industry && params.append('industry', industry);
      return authClient.get(`/fundings/${profile}/${zoom}`, {
        params: params,
      });
    },
    enabled: [ZOOM.M0, ZOOM.M500, ZOOM.M2000, ZOOM.M10000].includes(zoom),
  });
};

/**
 * 펀딩 상세 조회
 * @param {number} funding_id `number`
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 */
const useGetFundingDetail = (funding_id, profile) => {
  return useQuery({
    queryKey: ['useGetFundingDetail', funding_id, profile],
    queryFn: () => {
      return authClient.get(`/fundings/${funding_id}/${profile}`);
    },
  });
};

/**
 * 내가 만든 펀딩 목록 조회
 */
const useGetFundingMyCreatedList = () => {
  return useQuery({
    queryKey: ['useGetFundingMyCreatedList'],
    queryFn: () => {
      return authClient.get(`/fundings/founder/my-created`);
    },
  });
};

/**
 * 내가 후원한 펀딩 목록 조회
 */
const useGetFundingMyPaidList = () => {
  return useQuery({
    queryKey: ['useGetFundingMyPaidList'],
    queryFn: () => {
      return authClient.get(`/fundings/proposer/my-paid`);
    },
  });
};

/**
 * 펀딩 좋아요 추가/삭제
 * @param {number} funding_id `number`
 */
const usePostFundingLike = () => {
  return useMutation({
    mutationFn: ({ funding_id }) => {
      return authClient.post(
        `/fundings/proposer/like`,
        { funding_id },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 펀딩 스크랩 추가/삭제
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {number} funding_id `number`
 */
const usePostFundingScrap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profile, funding_id }) => {
      return authClient.post(
        `/fundings/${profile}/scrap`,
        { funding_id },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
    onSuccess: async (response, { profile }) => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetFundingScrapList', profile],
      });
    },
  });
};

/**
 * 펀딩 스크랩 목록 조회
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 */
const useGetFundingScrapList = (profile, sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetFundingScrapList', profile, sido, sigungu, eupmyundong],
    queryFn: () => {
      const params = new URLSearchParams();
      sido && params.append('sido', sido);
      sigungu && params.append('sigungu', sigungu);
      eupmyundong && params.append('eupmyundong', eupmyundong);
      return authClient.get(`/fundings/${profile}/scrap`, {
        params: params,
      });
    },
  });
};

/**
 * 리워드 목록 조회
 * @param {'LEVEL' | 'GIFT' | 'COUPON' | null} category `'LEVEL' | 'GIFT' | 'COUPON' | null`
 */
const useGetRewardList = (category) => {
  return useQuery({
    queryKey: ['useGetRewardList', category],
    queryFn: () => {
      const params = new URLSearchParams();
      category && params.set('category', category);
      return authClient.get(`/fundings/proposer/reward`, {
        params: params,
      });
    },
  });
};

export {
  useGetFundingMap,
  useGetFundingDetail,
  useGetFundingMyCreatedList,
  useGetFundingMyPaidList,
  usePostFundingLike,
  usePostFundingScrap,
  useGetFundingScrapList,
  useGetRewardList,
};
