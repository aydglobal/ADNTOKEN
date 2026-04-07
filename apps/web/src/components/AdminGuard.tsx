import { useUser } from '../store/useUser';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // URL'de ?admin_secret=xxx ile bypass
  const urlSecret = new URLSearchParams(window.location.search).get('admin_secret');
  const hasUrlAccess = ADMIN_SECRET && urlSecret === ADMIN_SECRET;

  if (!user && !hasUrlAccess) {
    return <div style={{ padding: 24, color: 'white' }}>Loading...</div>;
  }

  if (!hasUrlAccess && !user?.isAdmin) {
    return <div style={{ padding: 24, color: 'white' }}>Yetkin yok</div>;
  }

  return <>{children}</>;
}
