import React from "react";
import { motion } from "framer-motion";
import { springs } from "../../motion/motionPresets";

type Props = {
  onTap: () => void;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
};

export function TapOrb({ onTap, disabled, label = "TAP", children }: Props) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Dış pulse halkası */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.1, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* İç pulse halkası */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,209,102,0.2), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.button
        whileTap={{ scale: 0.92, rotate: [0, -1, 1, 0] }}
        whileHover={{ scale: 1.04 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ ...springs.button, scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }}
        onClick={onTap}
        disabled={disabled}
        className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-white/15 text-white"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 26%, rgba(77,226,255,0.12) 62%, rgba(255,209,102,0.18) 100%)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08), 0 0 60px rgba(77,226,255,0.30), 0 0 100px rgba(255,209,102,0.20), inset 0 10px 30px rgba(255,255,255,0.08)',
        }}
      >
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        {children ?? (
          <div className="text-center">
            <div className="text-[14px] uppercase tracking-[0.38em] text-white/60">ADN CORE</div>
            <div className="mt-2 text-4xl font-black">{label}</div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
