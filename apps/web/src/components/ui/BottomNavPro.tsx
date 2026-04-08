import React from "react";
import { motion } from "framer-motion";

type Item = {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: boolean;
  badgeCount?: number;
};

type Props = {
  items: Item[];
  active: string;
  onChange: (key: string) => void;
};

export function BottomNavPro({ items, active, onChange }: Props) {
  return (
    <nav className="adn-bottom-dock" aria-label="Primary navigation">
      <div className="adn-bottom-dock__inner">
        {items.map((item) => {
          const isActive = active === item.key;
          const badgeText = item.badgeCount && item.badgeCount > 9 ? '9+' : item.badgeCount?.toString();
          const ariaLabel = item.badge && badgeText
            ? `${item.label}, ${badgeText} pending`
            : item.label;

          return (
            <motion.button
              key={item.key}
              type="button"
              whileTap={{ scale: 0.94 }}
              className={`adn-bottom-dock__item${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={ariaLabel}
              onClick={() => onChange(item.key)}
            >
              <span className="adn-bottom-dock__icon">
                {item.icon}
                {item.badge && (
                  <span className="adn-bottom-dock__badge">
                    {badgeText && badgeText !== '1' ? badgeText : ''}
                  </span>
                )}
              </span>
              <span className="adn-bottom-dock__label">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
