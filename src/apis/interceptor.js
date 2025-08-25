import { toaster } from '../components/common/toaster';

const clientInterceptor = {
  request: {
    onFulfilled: (config) => {
      return Promise.resolve(config);
    },
    onRejected: (error) => {
      return Promise.reject(error);
    },
    options: null,
  },
  response: {
    onFulfilled: (response) => {
      response.data.detail &&
        toaster.create({
          description: response.data.detail,
          type: 'success',
        });
      return Promise.resolve(response);
    },
    onRejected: (error) => {
      error.response.data.detail &&
        toaster.create({
          description: error.response.data.detail,
          type: 'error',
        });
      return Promise.reject(error);
    },
    options: null,
  },
};

const authClientInterceptor = {
  request: {
    onFulfilled: (config) => {
      let token = localStorage.getItem('token');
      if (token) {
        token = JSON.parse(token);
        config.headers.Authorization = `${token.grant_type} ${token.access.token}`;
      }
      return Promise.resolve(config);
    },
    onRejected: (error) => {
      return Promise.reject(error);
    },
    options: null,
  },
  response: {
    onFulfilled: (response) => {
      response.data.detail &&
        toaster.create({
          description: response.data.detail,
          type: 'success',
        });
      return Promise.resolve(response);
    },
    onRejected: (error) => {
      error.response.data.detail &&
        toaster.create({
          description: error.response.data.detail,
          type: 'error',
        });
      return Promise.reject(error);
    },
    options: null,
  },
};

export { clientInterceptor, authClientInterceptor };
