export function restoreEnergy(params: {
  currentEnergy: number;
  lastEnergyAt: Date;
  energyMax: number;
  regenPerMinute: number;
}) {
  const { currentEnergy, lastEnergyAt, energyMax, regenPerMinute } = params;
  const now = new Date();
  const minutesPassed = Math.max(
    0,
    Math.floor((now.getTime() - new Date(lastEnergyAt).getTime()) / 60000)
  );

  if (minutesPassed <= 0) {
    return {
      energy: Math.min(currentEnergy, energyMax),
      lastEnergyAt
    };
  }

  const restored = minutesPassed * regenPerMinute;

  return {
    energy: Math.min(currentEnergy + restored, energyMax),
    lastEnergyAt: now
  };
}
