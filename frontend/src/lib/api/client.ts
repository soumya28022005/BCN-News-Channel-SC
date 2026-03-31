import { apiUrl } from '../config';
let refreshPromise: Promise<void> | null = null;
const tryRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(apiUrl('/auth/refresh'), { method: 'POST', credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to refresh session');
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};
async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = init.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(apiUrl(path), { ...init, headers, credentials: 'include', cache: 'no-store' });
  if (response.status === 401 && retry) {
    await tryRefresh();
    return request<T>(path, init, false);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message ?? 'Something went wrong');
  return payload as T;
}
export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};