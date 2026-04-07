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
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(94vw,760px)] -translate-x-1/2 rounded-[24px] border border-white/10 bg-[#0A1630]/82 p-2 backdrop-blur-2xl shadow-[0_12px_38px_rgba(0,0,0,0.34)]">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(item.key)}
              className={[
                "relative flex min-h-[62px] flex-col items-center justify-center rounded-[18px] px-2 py-2 text-center",
                isActive ? "text-white" : "text-white/60 hover:text-white/85"
              ].join(" ")}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-[18px] border border-white/12 bg-white/[0.08] shadow-[0_0_20px_rgba(77,226,255,0.14)]"
                />
              )}
              <div className="relative text-lg">
                {item.icon}
                {item.badge && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#FF5EA8]" />
                )}
              </div>
              <div className="relative mt-1 text-[11px] font-semibold tracking-wide">{item.label}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
