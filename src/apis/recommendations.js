import { useQuery } from '@tanstack/react-query';
import { authClient } from './instance';

/**
 * 단순 계산식 추천
 */
const useGetRecommendationCalcList = () => {
  return useQuery({
    queryKey: ['useGetRecommendationCalcList'],
    queryFn: () => {
      return authClient.get(`/recommendations/proposal/calc`);
    },
  });
};

/**
 * 스크랩한 제안과 유사한 제안 AI 추천
 */
const useGetRecommendationScrapList = () => {
  return useQuery({
    queryKey: ['useGetRecommendationScrapList'],
    queryFn: () => {
      return authClient.get(`/recommendations/proposal/scrap-similarity`);
    },
  });
};

export { useGetRecommendationCalcList, useGetRecommendationScrapList };
