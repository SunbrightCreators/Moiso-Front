import { client } from './instance';

/**
 * 주소 → 좌표 변환
 * @param {str | null} sido str 또는 null
 * @param {str | null} sigungu str 또는 null
 * @param {str | null} eupmyundong str 또는 null
 */
const getAddressToPosition = async (sido, sigungu, eupmyundong) => {
  const params = new URLSearchParams();
  params.set('query', [sido, sigungu, eupmyundong].filter(Boolean).join(' '));
  return await client.get(`/maps/geocoding/position`, { params: params });
};

/**
 * 일부 주소 → 법정동 주소 검색
 */
const getAddressToLegal = async (query) => {
  const params = new URLSearchParams();
  params.set('query', query);
  return await client.get(`/maps/geocoding/legal`, { params: params });
};

/**
 * 일부 주소 → 전체 주소 검색
 */
const getAddressToFull = async (
  query,
  filter_sido,
  filter_sigungu,
  filter_eupmyundong,
) => {
  const params = new URLSearchParams();
  params.append('query', query);
  params.append(
    'filter',
    `${filter_sido} ${filter_sigungu} ${filter_eupmyundong}`,
  );
  return await client.get(`/maps/geocoding/full`, { params: params });
};

/**
 * 좌표 → 법정동 주소 변환
 */
const getPositionToLegal = async (latitude, longitude) => {
  const params = new URLSearchParams();
  params.append('latitude', latitude);
  params.append('longitude', longitude);
  return await client.get(`/maps/reverse-geocoding/legal`, { params: params });
};

/**
 * 좌표 → 전체 주소 변환
 */
const getPositionToFull = async (
  latitude,
  longitude,
  filter_sido,
  filter_sigungu,
  filter_eupmyundong,
) => {
  const params = new URLSearchParams();
  params.append('latitude', latitude);
  params.append('longitude', longitude);
  params.append(
    'filter',
    `${filter_sido} ${filter_sigungu} ${filter_eupmyundong}`,
  );
  return await client.get(`/maps/reverse-geocoding/full`, { params: params });
};

export {
  getAddressToPosition,
  getAddressToLegal,
  getAddressToFull,
  getPositionToLegal,
  getPositionToFull,
};
