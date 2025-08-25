import { client, authClient } from './instance';

/**
 * 로그인
 */
const postLogin = async (email, password) => {
  return await client.post(
    `/accounts/login`,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 엑세스 토큰 재발급
 */
const postAccessToken = async (grant_type, refresh_token) => {
  return await client.post(
    `/accounts/access-token`,
    { grant_type, refresh_token },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 회원가입(회원 추가)
 * @param {list | null} target 창업자일 때만 지정
 * @param {object | null} business_hours 창업자일 때만 지정
 */
const postAccount = async (
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
) => {
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
  return await client.post(
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
};

/**
 * 회원이 보유한 프로필 목록 조회
 */
const getProfileList = async () => {
  return await authClient.get(`/accounts/`);
};

/**
 * 회원 탈퇴(회원 삭제)
 */
const deleteAccount = async () => {
  return await authClient.delete(`/accounts/`);
};

/**
 * 프로필 추가
 * @param {str} profile `'proposer'` 또는 `'founder'`
 * @param {list | null} target 창업자일 때만 지정
 * @param {object | null} business_hours 창업자일 때만 지정
 */
const postProfile = async (
  profile,
  industryList,
  addressList,
  targetList,
  business_hours,
) => {
  return await authClient.post(
    `/accounts/${profile}`,
    {
      industry: industryList,
      address: addressList,
      target: targetList,
      business_hours: business_hours,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

/**
 * 프로필 조회
 * @param {str} profile `'proposer'` 또는 `'founder'`
 * @param {list} fieldList Response Body에 포함할 필드
 */
const getProfile = async (profile, fieldList) => {
  const params = new URLSearchParams();
  fieldList.forEach((field) => params.append('field', field));
  return await authClient.get(`/accounts/${profile}`, { params: params });
};

/**
 * GPS 위치기록 추가
 */
const postLocationHistory = async (
  timestamp,
  latitude,
  longitude,
  accuracy,
) => {
  return await authClient.post(
    `/accounts/location-history`,
    { timestamp, latitude, longitude, accuracy },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

export {
  postLogin,
  postAccessToken,
  postAccount,
  getProfileList,
  deleteAccount,
  postProfile,
  getProfile,
  postLocationHistory,
};
