// One shared place for every backend call, so URLs are never repeated in components.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors; // field-level errors, e.g. { productId: 'Already exists' }
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Please check that the backend is running.');
  }
  let data = null;
  try { data = await response.json(); } catch { /* response had no JSON body */ }
  if (!response.ok) {
    throw new ApiError(data?.message || `Request failed (${response.status})`, response.status, data?.errors);
  }
  return data;
}

// Builds "?a=1&b=2" and skips empty values.
const qs = (params = {}) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) p.set(k, v); });
  const s = p.toString();
  return s ? `?${s}` : '';
};
const send = (method, body) => ({ method, body: JSON.stringify(body) });

const api = {
  health: () => request('/health'),
  dashboard: () => request('/dashboard'),
  products: {
    list: (params) => request(`/products${qs(params)}`),
    get: (id) => request(`/products/${id}`),
    search: (text) => request(`/products/search/${encodeURIComponent(text)}`),
    create: (data) => request('/products', send('POST', data)),
    update: (id, data) => request(`/products/${id}`, send('PUT', data)),
    remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  stock: {
    stockIn: (data) => request('/stock/in', send('POST', data)),
    stockOut: (data) => request('/stock/out', send('POST', data)),
    list: (params) => request(`/stock${qs(params)}`),
  },
  tasks: {
    list: (params) => request(`/tasks${qs(params)}`),
    create: (data) => request('/tasks', send('POST', data)),
    update: (id, data) => request(`/tasks/${id}`, send('PUT', data)),
    remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
};

export default api;
