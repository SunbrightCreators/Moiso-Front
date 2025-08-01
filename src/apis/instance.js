import axios from 'axios';
import { apiInterceptor, authApiInterceptor } from './interceptor';

/**
 * 일반 요청
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});
api.interceptors.request.use(
  apiInterceptor.request.onFulfilled,
  apiInterceptor.request.onRejected,
  apiInterceptor.request.options,
);
api.interceptors.response.use(
  apiInterceptor.response.onFulfilled,
  apiInterceptor.response.onRejected,
  apiInterceptor.response.options,
);

const getAuthHeader = () => {
  let token = localStorage.getItem('token');
  if (token) {
    token = JSON.parse(token);
    return `${token.grantType} ${token.accessToken}`;
  } else {
    return null;
  }
};
/**
 * 인증이 필요한 요청 (일반 요청을 상속함)
 */
const authInstance = api.create({
  headers: { Authorization: getAuthHeader() },
  withCredentials: true,
});
authInstance.interceptors.request.use(
  authApiInterceptor.request.onFulfilled,
  authApiInterceptor.request.onRejected,
  authApiInterceptor.request.options,
);
authInstance.interceptors.response.use(
  authApiInterceptor.response.onFulfilled,
  authApiInterceptor.response.onRejected,
  authApiInterceptor.response.options,
);

export { api, authInstance };
