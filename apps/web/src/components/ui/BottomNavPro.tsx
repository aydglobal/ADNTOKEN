import React from "react";
import { motion } from "framer-motion";

type Item = {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: boolean;
};

type Props = {
  items: Item[];
  active: string;
  onChange: (key: string) => void;
};

export function BottomNavPro({ items, active, onChange }: Props) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(100%, 760px)',
      zIndex: 40,
      borderRadius: '24px 24px 0 0',
      border: '1px solid rgba(255,255,255,0.08)',
      borderBottom: 'none',
      background: 'rgba(8,12,22,0.94)',
      backdropFilter: 'blur(24px)',
      padding: '8px 8px 16px',
      boxShadow: '0 -4px 32px rgba(0,0,0,0.38)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 4,
      }}>
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(item.key)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
                borderRadius: 16,
                border: 'none',
                background: isActive
                  ? 'linear-gradient(180deg, rgba(56,189,248,0.18), rgba(214,178,94,0.1))'
                  : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                padding: '8px 4px',
                boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 18px rgba(56,189,248,0.12)' : 'none',
                transition: 'color 150ms ease, background 150ms ease',
              }}
            >
              <div style={{ position: 'relative', fontSize: 20, lineHeight: 1 }}>
                {item.icon}
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: -3,
                    right: -4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#FF5EA8',
                    boxShadow: '0 0 8px rgba(255,94,168,0.6)',
                  }} />
                )}
              </div>
              <div style={{
                marginTop: 4,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
