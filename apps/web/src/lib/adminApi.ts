const PRODUCTION_API_URL = 'https://adntoken.onrender.com';

function resolveApiUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://127.0.0.1:4000';
  }

  return PRODUCTION_API_URL;
}

const API_URL = resolveApiUrl();
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'change-admin-secret';

export async function adminFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('adn_airdrop_token') || '';
  const initData = (window as any).Telegram?.WebApp?.initData || '';

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': initData,
      'x-admin-secret': ADMIN_SECRET,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Admin request failed');
  }

  return response.json();
}
