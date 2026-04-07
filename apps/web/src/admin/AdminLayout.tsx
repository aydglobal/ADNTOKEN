type NavKey = 'dashboard' | 'users' | 'fraud' | 'payouts' | 'boost-logs' | 'events' | 'tuning' | 'campaigns' | 'corrections' | 'revenue' | 'notifications';

export function AdminLayout({
  active,
  onNavigate,
  onExit,
  children
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={shellStyle}>
      <aside style={sidebarStyle}>
        <h3 style={{ marginTop: 0 }}>Yonetim</h3>
        <NavButton active={active === 'dashboard'} onClick={() => onNavigate('dashboard')} label="Genel durum" />
        <NavButton active={active === 'users'} onClick={() => onNavigate('users')} label="Kullanicilar" />
        <NavButton active={active === 'fraud'} onClick={() => onNavigate('fraud')} label="Risk inceleme" />
        <NavButton active={active === 'payouts'} onClick={() => onNavigate('payouts')} label="Odeme talepleri" />
        <NavButton active={active === 'boost-logs'} onClick={() => onNavigate('boost-logs')} label="Guclendirme kayitlari" />
        <NavButton active={active === 'events'} onClick={() => onNavigate('events')} label="Canli eventler" />
        <NavButton active={active === 'tuning'} onClick={() => onNavigate('tuning')} label="Live tuning" />
        <NavButton active={active === 'campaigns'} onClick={() => onNavigate('campaigns')} label="Campaign control" />
        <NavButton active={active === 'corrections'} onClick={() => onNavigate('corrections')} label="Bakiye duzeltme" />
        <NavButton active={active === 'revenue'} onClick={() => onNavigate('revenue')} label="Gelir & Odeme" />
        <NavButton active={active === 'notifications'} onClick={() => onNavigate('notifications')} label="Bildirimler" />
        <button onClick={onExit} style={exitButtonStyle}>Oyuna don</button>
      </aside>
      <main style={contentStyle}>{children}</main>
    </div>
  );
}

function NavButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={navButtonStyle(active)}>
      {label}
    </button>
  );
}

const shellStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  background: '#05070b',
  color: 'white'
};

const sidebarStyle: React.CSSProperties = {
  width: 220,
  padding: 20,
  borderRight: '1px solid rgba(255,255,255,0.08)',
  background: '#0b1118',
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: 24
};

function navButtonStyle(active: boolean): React.CSSProperties {
  return {
    border: '1px solid rgba(255,255,255,0.08)',
    background: active ? '#1d3650' : '#111821',
    color: 'white',
    borderRadius: 12,
    padding: '12px 14px',
    textAlign: 'left',
    cursor: 'pointer'
  };
}

const exitButtonStyle: React.CSSProperties = {
  marginTop: 'auto',
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#1d1f29',
  color: 'white',
  borderRadius: 12,
  padding: '12px 14px',
  cursor: 'pointer'
};
