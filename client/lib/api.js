'use client';

// Browser-side API client used by the admin panel and interactive storefront widgets.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'nova_token';

export const tokenStore = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// After admin writes, ask Next.js to purge its cached storefront pages (debounced).
let revalidateTimer;
function scheduleRevalidate() {
  clearTimeout(revalidateTimer);
  revalidateTimer = setTimeout(() => {
    fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${tokenStore.get()}` } }).catch(() => {});
  }, 150);
}

async function request(method, path, body, { isForm } = {}) {
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  if (res.ok && method !== 'GET' && path.startsWith('/admin')) scheduleRevalidate();
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !path.startsWith('/auth/login')) {
      tokenStore.clear();
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(res.status, data.message || 'Something went wrong', data);
  }
  return data;
}

const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString();
  return s ? `?${s}` : '';
};

export const api = {
  get: (path, params) => request('GET', `${path}${qs(params)}`),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, { isForm: true }),
  // Downloads an authenticated file (CSV export, backup) and saves it with the server's filename.
  download: async (path, fallbackName = 'download') => {
    const res = await fetch(`${API_URL}/api${path}`, { headers: { Authorization: `Bearer ${tokenStore.get()}` } });
    if (!res.ok) throw new ApiError(res.status, (await res.json().catch(() => ({}))).message || 'Download failed');
    const name = /filename="?([^";]+)"?/.exec(res.headers.get('Content-Disposition') || '')?.[1] || fallbackName;
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
