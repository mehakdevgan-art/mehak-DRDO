const browserHost = window.location.hostname;
const inferredApiUrl = (browserHost === 'localhost' || browserHost === '127.0.0.1')
  ? 'http://127.0.0.1:8000'
  : `http://${browserHost}:8000`;
// VITE_API_URL is still available for a separately hosted API; otherwise this
// makes Vite's Network URL call the backend on the same LAN host.
const API_URL = import.meta.env.VITE_API_URL ?? inferredApiUrl;
const TOKEN_KEY = 'defence_pms_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => { localStorage.removeItem(TOKEN_KEY); window.dispatchEvent(new Event('auth:changed')); };
export class ApiError extends Error { constructor(message, status) { super(message); this.status = status; } }
export async function request(path, options = {}) {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal, headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers } });
    if (!response.ok) { const body = await response.json().catch(() => ({})); if (response.status === 401) clearToken(); throw new ApiError(body.detail || `Request failed (${response.status})`, response.status); }
    return response.status === 204 ? null : response.json();
  } catch (error) { if (error.name === 'AbortError') throw new ApiError('The request timed out. Check the API connection and try again.', 408); throw error; } finally { clearTimeout(timeout); }
}
