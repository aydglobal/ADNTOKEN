import { useEffect } from 'react';
import { gameBus } from '../lib/gameBus';
import { playHaptic } from '../lib/haptics';
import { playSoftClick, playSuccessTone, playUpgradeTone } from '../lib/sfx';

export function useFeedbackLayer() {
  useEffect(() => {
    const offTap = gameBus.on('tap', () => {
      playHaptic('light');
      playSoftClick();
    });

    const offCrit = gameBus.on('crit', () => {
      playHaptic('medium');
      playSoftClick();
    });

    const offLevel = gameBus.on('level_up', () => {
      playHaptic('success');
      playSuccessTone();
    });

    const offChest = gameBus.on('chest_open', (payload: unknown) => {
      const p = payload as { rarity?: string; jackpot?: boolean } | undefined;
      const isRare = p?.rarity === 'legendary' || p?.rarity === 'mythic';
      playHaptic(isRare ? 'heavy' : 'medium');
      if (p?.jackpot || isRare) playSuccessTone();
      else playUpgradeTone();
    });

    const offUpgrade = gameBus.on('upgrade', () => {
      playHaptic('medium');
      playUpgradeTone();
    });

    const offError = gameBus.on('error', () => {
      playHaptic('warning');
    });

    return () => {
      offTap();
      offCrit();
      offLevel();
      offChest();
      offUpgrade();
      offError();
    };
  }, []);
}
