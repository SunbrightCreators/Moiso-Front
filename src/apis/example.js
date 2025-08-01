import { authClient } from './instance';

/**
 * GET 요청
 */
const getExample = async () => {
  const response = await authClient.get(`/example`);
  return response;
};

/**
 * POST 요청
 */
const postExample = async (title, content) => {
  const response = await authClient.post(
    `/example`,
    { title, content },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response;
};

/**
 * PUT 요청
 */
const putExample = async (title, content) => {
  const response = await authClient.put(
    `/example`,
    { title, content },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response;
};

/**
 * PATCH 요청
 */
const patchExample = async (content) => {
  const response = await authClient.patch(
    `/example`,
    { content },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response;
};

/**
 * DELETE 요청
 */
const deleteExample = async () => {
  const response = await authClient.delete(`/example`);
  return response;
};

export { getExample, postExample, putExample, patchExample, deleteExample };
