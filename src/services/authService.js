import { request, setToken, clearToken } from './apiClient';

export async function login(email, password) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setToken(response.access_token);
  window.dispatchEvent(new Event('auth:changed'));
  return response;
}

export { clearToken };
