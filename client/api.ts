const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handle = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    location.href = '/';
    throw new Error('Unauthorized');
  }
  const json = await res.json().catch(() => ({}));
  return json;
};

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${base}${path}`, { headers: { ...authHeader() } });
    return handle(res);
  },
  post: async (path: string, body?: any) => {
    const res = await fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: body ? JSON.stringify(body) : undefined });
    return handle(res);
  },
  put: async (path: string, body?: any) => {
    const res = await fetch(`${base}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: body ? JSON.stringify(body) : undefined });
    return handle(res);
  },
  del: async (path: string, body?: any) => {
    const res = await fetch(`${base}${path}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: body ? JSON.stringify(body) : undefined });
    return handle(res);
  }
};
