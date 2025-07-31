// src/apis/exampleApiFunctions.js
import { apiAuth } from './authInstance';

// GET 요청
export const getExample = async () => {
  const response = await apiAuth.get(`/example`);
  return response.data;
};

// POST 요청
export const postExample = async (title, content) => {
  const response = await apiAuth.post(
    `/example`,
    { title, content },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

// PATCH 요청
export const patchExample = async (content) => {
  const response = await apiAuth.patch(
    `/example`,
    { content },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

// DELETE 요청
export const deleteExample = async () => {
  const response = await apiAuth.delete(`/example`);
  return response.data;
};
