import { prisma } from '../lib/prisma';

export async function getPublicLiveEvents() {
  const now = new Date();
  return prisma.liveEventConfig.findMany({
    where: { isEnabled: true, endsAt: { gt: now } }
  });
}

export async function getActiveTapMultiplier(): Promise<number> {
  const events = await getPublicLiveEvents();
  let multiplier = 1;
  for (const event of events) {
    try {
      const mods = JSON.parse(event.modifiersJson) as Record<string, number>;
      if (mods.tapMultiplier && mods.tapMultiplier > multiplier) {
        multiplier = mods.tapMultiplier;
      }
    } catch {
      // geçersiz JSON — atla
    }
  }
  return multiplier;
}

export async function getActiveChestLuckMultiplier(): Promise<number> {
  const events = await getPublicLiveEvents();
  let multiplier = 1;
  for (const event of events) {
    try {
      const mods = JSON.parse(event.modifiersJson) as Record<string, number>;
      if (mods.chestLuckMultiplier && mods.chestLuckMultiplier > multiplier) {
        multiplier = mods.chestLuckMultiplier;
      }
      if (mods.jackpotMultiplier) {
        const derived = mods.jackpotMultiplier * 0.5;
        if (derived > multiplier) multiplier = derived;
      }
    } catch {
      // geçersiz JSON — atla
    }
  }
  return multiplier;
}

export async function startLiveEvent(eventKey: string) {
  const event = await prisma.liveEventConfig.findUnique({ where: { key: eventKey } });
  if (!event) throw new Error('Event not found');

  return prisma.liveEventConfig.update({
    where: { key: eventKey },
    data: {
      isEnabled: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
    }
  });
}

export async function stopLiveEvent(eventKey: string) {
  const event = await prisma.liveEventConfig.findUnique({ where: { key: eventKey } });
  if (!event) throw new Error('Event not found');

  return prisma.liveEventConfig.update({
    where: { key: eventKey },
    data: { isEnabled: false, endsAt: new Date() }
  });
}

export async function getLiveEvents() {
  return prisma.liveEventConfig.findMany({ orderBy: { startsAt: 'desc' } });
}
