import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/user')
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return user;
};

export default useUser;
