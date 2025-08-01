const apiInterceptor = {
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
    onFulfilled: (config) => {
      return Promise.resolve(config);
    },
    onRejected: (error) => {
      return Promise.reject(error);
    },
    options: null,
  },
};

const authApiInterceptor = {
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
    onFulfilled: (config) => {
      return Promise.resolve(config);
    },
    onRejected: (error) => {
      return Promise.reject(error);
    },
    options: null,
  },
};

export { apiInterceptor, authApiInterceptor };
