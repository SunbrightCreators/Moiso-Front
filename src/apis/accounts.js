import { useQuery, useMutation } from '@tanstack/react-query';
import { client, authClient } from './instance';
import useModeStore from '../../stores/useModeStore';

/**
 * 로그인
 * @param {string} email `string`
 * @param {string} password `string`
 */
const usePostLogin = () => {
  const { setIsProposerMode } = useModeStore();

  return useMutation({
    mutationFn: ({ email, password }) => {
      return client.post(
        `/accounts/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
    onSuccess: (response) => {
      const { profile, ...token } = response.data;
      localStorage.setItem('token', JSON.stringify(token));
      setIsProposerMode(profile.includes('proposer'));
    },
  });
};

/**
 * 엑세스 토큰 재발급
 * @param {string} grant_type `string`
 * @param {string} refresh_token `string`
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
    onSuccess: (response) => {
      const token = response.data;
      localStorage.setItem('token', JSON.stringify(token));
    },
  });
};

/**
 * 회원가입(회원 추가)
 * @param {string} email `string`
 * @param {string} password `string`
 * @param {string} name `string`
 * @param {string} birth `string`
 * @param {SEX.value} sex `SEX.value`
 * @param {boolean} is_marketing_allowed `boolean`
 * @param {Array<INDUSTRY.value>} industryList `Array<INDUSTRY.value>`
 * @param {Array<object>} addressList `Array<object>`
 * @param {Array<FOUNDER_TARGET.value> | null} targetList `Array<FOUNDER_TARGET.value> | null` 창업자일 때만 지정
 * @param {object | null} business_hours `object | null` 창업자일 때만 지정
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
    onSuccess: (response) => {
      const { profile, ...token } = response.data;
      localStorage.setItem('token', JSON.stringify(token));
      setIsProposerMode(profile.includes('proposer'));
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
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {Array<INDUSTRY.value>} industryList `Array<INDUSTRY.value>`
 * @param {Array<object>} addressList `Array<object>`
 * @param {Array<FOUNDER_TARGET.value> | null} targetList `Array<FOUNDER_TARGET.value> | null` 창업자일 때만 지정
 * @param {object | null} business_hours `object | null` 창업자일 때만 지정
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
 * @param {PROFILE.proposer | PROFILE.founder} profile `PROFILE.proposer | PROFILE.founder`
 * @param {Array<string> | null} fieldList `Array<string> | null` Response Body에 포함할 필드. `null`은 전체.
 */
const useGetProfile = (profile, fieldList) => {
  return useQuery({
    queryKey: ['useGetProfile', profile, fieldList],
    queryFn: () => {
      const params = new URLSearchParams();
      fieldList && fieldList.forEach((field) => params.append('field', field));
      return authClient.get(`/accounts/${profile}`, {
        params: params,
      });
    },
  });
};

/**
 * GPS 위치기록 추가
 * @param {number} timestamp `number`
 * @param {number} latitude `number`
 * @param {number} longitude `number`
 * @param {number} accuracy `number`
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
