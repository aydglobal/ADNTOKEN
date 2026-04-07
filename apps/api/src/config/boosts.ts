export type BoostKey = 'tap_x2' | 'energy_cap' | 'regen_x2';

type BoostConfig = {
  name: string;
  basePrice: number;
  durationHours: number;
  value: number;
  maxLevel: number;
  freeClaimCooldownHours?: number;
  premiumStarsPrice?: number;
};

export const BOOSTS: Record<BoostKey, BoostConfig> = {
  tap_x2: {
    name: '2x Tap',
    basePrice: 500,
    durationHours: 24,
    value: 2,
    maxLevel: 5,
    freeClaimCooldownHours: 24,
    premiumStarsPrice: 25
  },
  energy_cap: {
    name: '+500 Max Energy',
    basePrice: 700,
    durationHours: 24,
    value: 500,
    maxLevel: 5,
    premiumStarsPrice: 35
  },
  regen_x2: {
    name: '2x Regen',
    basePrice: 600,
    durationHours: 24,
    value: 2,
    maxLevel: 5,
    premiumStarsPrice: 30
  }
};

export function getBoostPrice(type: BoostKey, currentLevel: number) {
  const cfg = BOOSTS[type];
  return cfg.basePrice + currentLevel * Math.floor(cfg.basePrice * 0.4);
}
