import { useQuery } from '@tanstack/react-query';
import { client } from './instance';

/**
 * 주소 → 좌표 변환
 * @param {string | null} sido `string | null`
 * @param {string | null} sigungu `string | null`
 * @param {string | null} eupmyundong `string | null`
 */
const useGetAddressToPosition = (sido, sigungu, eupmyundong) => {
  return useQuery({
    queryKey: ['useGetAddressToPosition', sido, sigungu, eupmyundong],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set(
        'query',
        [sido, sigungu, eupmyundong].filter(Boolean).join(' '),
      );
      return client.get(`/maps/geocoding/position`, { params: params });
    },
  });
};

/**
 * 일부 주소 → 법정동 주소 검색
 * @param {string} query `string`
 */
const useGetAddressToLegal = (query) => {
  return useQuery({
    queryKey: ['useGetAddressToLegal', query],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('query', query);
      return client.get(`/maps/geocoding/legal`, { params: params });
    },
  });
};

/**
 * 일부 주소 → 전체 주소 검색
 * @param {string} query `string`
 * @param {string | null} filter_sido `string | null`
 * @param {string | null} filter_sigungu `string | null`
 * @param {string | null} filter_eupmyundong `string | null`
 */
const useGetAddressToFull = (
  query,
  filter_sido,
  filter_sigungu,
  filter_eupmyundong,
) => {
  return useQuery({
    queryKey: [
      'useGetAddressToFull',
      query,
      filter_sido,
      filter_sigungu,
      filter_eupmyundong,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append(
        'filter',
        `${filter_sido} ${filter_sigungu} ${filter_eupmyundong}`,
      );
      return client.get(`/maps/geocoding/full`, { params: params });
    },
  });
};

/**
 * 좌표 → 법정동 주소 변환
 * @param {number} latitude `number`
 * @param {number} longitude `number`
 */
const useGetPositionToLegal = (latitude, longitude) => {
  return useQuery({
    queryKey: ['useGetPositionToLegal', latitude, longitude],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('latitude', latitude);
      params.append('longitude', longitude);
      return client.get(`/maps/reverse-geocoding/legal`, { params: params });
    },
  });
};

/**
 * 좌표 → 전체 주소 변환
 * @param {number} latitude `number`
 * @param {number} longitude `number`
 * @param {string | null} filter_sido `string | null`
 * @param {string | null} filter_sigungu `string | null`
 * @param {string | null} filter_eupmyundong `string | null`
 */
const useGetPositionToFull = (
  latitude,
  longitude,
  filter_sido,
  filter_sigungu,
  filter_eupmyundong,
) => {
  return useQuery({
    queryKey: [
      'useGetPositionToFull',
      latitude,
      longitude,
      filter_sido,
      filter_sigungu,
      filter_eupmyundong,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('latitude', latitude);
      params.append('longitude', longitude);
      params.append(
        'filter',
        `${filter_sido} ${filter_sigungu} ${filter_eupmyundong}`,
      );
      return client.get(`/maps/reverse-geocoding/full`, { params: params });
    },
  });
};

export {
  useGetAddressToPosition,
  useGetAddressToLegal,
  useGetAddressToFull,
  useGetPositionToLegal,
  useGetPositionToFull,
};
