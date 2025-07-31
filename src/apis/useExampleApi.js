import { useQuery } from 'react-query';
import axiosInstance from './axiosInstance';

const fetchSomething = async () => {
  const res = await axiosInstance.get('/something');
  return res.data;
};

export const useSomething = () => {
  return useQuery('something', fetchSomething);
};
