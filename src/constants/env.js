const API_URL = Object.freeze(process.env.REACT_APP_API_URL);

const VAPID_PUBLIC_KEY = Object.freeze(process.env.REACT_APP_VAPID_PUBLIC_KEY);

const NCLOUD_CLIENT_ID = Object.freeze(process.env.REACT_APP_NCLOUD_CLIENT_ID);
const NCLOUD_CLIENT_SECRET = Object.freeze(process.env.REACT_APP_NCLOUD_CLIENT_SECRET);

export {
  API_URL,
  VAPID_PUBLIC_KEY,
  NCLOUD_CLIENT_ID,
  NCLOUD_CLIENT_SECRET
};
