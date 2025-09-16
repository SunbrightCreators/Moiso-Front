import { useQuery, useMutation } from '@tanstack/react-query';
import { authClient } from './instance';

/**
 * 펀딩 지도 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
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
      params.append('sido', sido);
      params.append('sigungu', sigungu);
      params.append('eupmyundong', eupmyundong);
      params.append('order', order);
      params.append('industry', industry);
      return authClient.get(`/fundings/${profile}/${zoom}`, {
        params: params,
      });
    },
  });
};

/**
 * 펀딩 상세 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
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
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const usePostFundingScrap = () => {
  return useMutation({
    mutationFn: ({ profile, funding_id }) => {
      return authClient.post(
        `/fundings/${profile}/scrap`,
        { funding_id },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 펀딩 스크랩 목록 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 */
const useGetFundingScrapList = (profile, sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetFundingScrapList', profile, sido, sigungu, eupmyundong],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('sido', sido);
      params.append('sigungu', sigungu);
      params.append('eupmyundong', eupmyundong);
      return authClient.get(`/fundings/${profile}/scrap`, { params: params });
    },
  });
};

/**
 * 리워드 목록 조회
 */
const useGetRewardList = (category) => {
  return useQuery({
    queryKey: ['useGetRewardList', category],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('category', category);
      return authClient.get(`/fundings/proposer/reward`, { params: params });
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
