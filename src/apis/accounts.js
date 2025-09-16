import { useQuery, useMutation } from '@tanstack/react-query';
import { client, authClient } from './instance';

/**
 * 로그인
 */
const usePostLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }) => {
      return client.post(
        `/accounts/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 엑세스 토큰 재발급
 */
const usePostAccessToken = () => {
  return useMutation({
    mutationFn: ({ grant_type, refresh_token }) => {
      return client.post(
        `/accounts/access-token`,
        { grant_type, refresh_token },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 회원가입(회원 추가)
 * @param {list | null} target 창업자일 때만 지정
 * @param {object | null} business_hours 창업자일 때만 지정
 */
const usePostAccount = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
      birth,
      sex,
      is_marketing_allowed,
      industryList,
      addressList,
      targetList,
      business_hours,
    }) => {
      let founder_profile = null;
      let proposer_profile = null;
      if (targetList || business_hours) {
        founder_profile = {
          industry: industryList,
          address: addressList,
          target: targetList,
          business_hours: business_hours,
        };
      } else {
        proposer_profile = {
          industry: industryList,
          address: addressList,
        };
      }
      return client.post(
        `/accounts/`,
        {
          email,
          password,
          name,
          birth,
          sex,
          is_marketing_allowed,
          proposer_profile,
          founder_profile,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 회원이 보유한 프로필 목록 조회
 */
const useGetProfileList = () => {
  return useQuery({
    queryKey: ['useGetProfileList'],
    queryFn: () => {
      return authClient.get(`/accounts/`);
    },
    initialData: [],
  });
};

/**
 * 회원 탈퇴(회원 삭제)
 */
const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => {
      return authClient.delete(`/accounts/`);
    },
  });
};

/**
 * 프로필 추가
 * @param {str} profile `'proposer'` 또는 `'founder'`
 * @param {list | null} target 창업자일 때만 지정
 * @param {object | null} business_hours 창업자일 때만 지정
 */
const usePostProfile = () => {
  return useMutation({
    mutationFn: ({
      profile,
      industryList,
      addressList,
      targetList,
      business_hours,
    }) => {
      return authClient.post(
        `/accounts/${profile}`,
        {
          industry: industryList,
          address: addressList,
          target: targetList,
          business_hours: business_hours,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

/**
 * 프로필 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 * @param {list} fieldList Response Body에 포함할 필드
 */
const useGetProfile = (profile, fieldList) => {
  return useQuery({
    queryKey: ['useGetProfile', profile, fieldList],
    queryFn: () => {
      const params = new URLSearchParams();
      fieldList.forEach((field) => params.append('field', field));
      return authClient.get(`/accounts/${profile}`, { params: params });
    },
  });
};

/**
 * GPS 위치기록 추가
 */
const usePostLocationHistory = () => {
  return useMutation({
    mutationFn: ({ timestamp, latitude, longitude, accuracy }) => {
      return authClient.post(
        `/accounts/location-history`,
        { timestamp, latitude, longitude, accuracy },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  });
};

export {
  usePostLogin,
  usePostAccessToken,
  usePostAccount,
  useGetProfileList,
  useDeleteAccount,
  usePostProfile,
  useGetProfile,
  usePostLocationHistory,
};
