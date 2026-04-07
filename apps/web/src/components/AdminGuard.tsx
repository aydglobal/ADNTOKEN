import { useUser } from '../store/useUser';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (!user) {
    return <div style={{ padding: 24, color: 'white' }}>Loading...</div>;
  }

  if (!user.isAdmin) {
    return <div style={{ padding: 24, color: 'white' }}>Yetkin yok</div>;
  }

  return <>{children}</>;
}
