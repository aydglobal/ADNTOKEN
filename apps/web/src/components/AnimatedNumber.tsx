import { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({
  value,
  compact = false,
  prefix = '',
  suffix = ''
}: {
  value: number;
  compact?: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const delta = value - start;
    const startTime = performance.now();
    const duration = 480;
    let raf = 0;

    const tick = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + delta * eased);

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        previous.current = value;
        setDisplayValue(value);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [value]);

  return <>{prefix}{formatValue(displayValue, compact)}{suffix}</>;
}

function formatValue(value: number, compact: boolean) {
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 100 ? 0 : 1
  }).format(value);
}
