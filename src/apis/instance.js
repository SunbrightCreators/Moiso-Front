import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

export default axiosInstance;


import axios from 'axios';

const token = JSON.parse(localStorage.getItem('token'));  // 예: { grantType: 'Bearer', accessToken: 'abc...' }

const authHeader = token ? `${token.grantType} ${token.accessToken}` : 'null';

const authInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: authHeader,
  },
  withCredentials: true,
});

export default authInstance;