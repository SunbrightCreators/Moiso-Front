import { authClient } from './instance';

/**
 * 단순 계산식 추천
 */
const getRecommendationCalcList = async () => {
  return await authClient.get(`/recommendations/proposal/calc`);
};

/**
 * 스크랩한 제안과 유사한 제안 AI 추천
 */
const getRecommendationScrapList = async () => {
  return await authClient.get(`/recommendations/proposal/scrap-similarity`);
};

export { getRecommendationCalcList, getRecommendationScrapList };
