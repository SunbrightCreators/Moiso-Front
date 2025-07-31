import axios from 'axios';

const token = JSON.parse(localStorage.getItem('token'));  // 예: { grantType: 'Bearer', accessToken: 'abc...' }

const authHeader = token ? `${token.grantType} ${token.accessToken}` : '';

const authInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: authHeader,
  },
  withCredentials: true,
});

export default authInstance;