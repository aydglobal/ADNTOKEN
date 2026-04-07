import { useEffect } from 'react';

type Props = {
  level: number;
  visible: boolean;
  onDone: () => void;
};

export default function LevelUpOverlay({ level, visible, onDone }: Props) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(onDone, 1200);
    return () => window.clearTimeout(timer);
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div className="game-levelup-overlay" role="status" aria-live="assertive">
      <div className="game-levelup-overlay__content">
        <span className="game-levelup-overlay__label">LEVEL UP</span>
        <span className="game-levelup-overlay__level">{level}</span>
      </div>
    </div>
  );
}
