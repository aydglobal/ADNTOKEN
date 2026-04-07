import { prisma } from '../lib/prisma';

function subDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const d1 = subDays(now, 1);
  const d2 = subDays(now, 2);
  const d7 = subDays(now, 7);
  const d8 = subDays(now, 8);
  const d30 = subDays(now, 30);

  const [
    dau,
    newUsers,
    paidRevenue,
    totalTaps,
    chestOpens,
    prestigeCount,
    totalUsers,
    upgradedUsers,
    dailyClaimUsers,
    referralUsers,
    d1Cohort,
    d7Cohort
  ] = await Promise.all([
    prisma.user.count({ where: { lastSeenAt: { gte: d1 } } }),
    prisma.user.count({ where: { createdAt: { gte: d1 } } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'paid', createdAt: { gte: d30 } }
    }),
    prisma.user.aggregate({
      _sum: { totalTaps: true }
    }),
    prisma.userChest.count({ where: { status: 'opened', openedAt: { gte: d30 } } }),
    prisma.user.count({ where: { prestigePower: { gt: 0 } } }),
    prisma.user.count(),
    prisma.user.count({ where: { ownedUpgrades: { some: {} } } }),
    prisma.user.count({ where: { lastDailyClaimAt: { not: null } } }),
    prisma.user.count({ where: { referralsSent: { some: {} } } }),
    prisma.user.findMany({
      where: { createdAt: { gte: d2, lt: d1 } },
      select: { id: true }
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: d8, lt: d7 } },
      select: { id: true }
    })
  ]);

  const d1Ids = d1Cohort.map((item) => item.id);
  const d7Ids = d7Cohort.map((item) => item.id);

  const [d1Retained, d7Retained] = await Promise.all([
    d1Ids.length ? prisma.user.count({ where: { id: { in: d1Ids }, lastSeenAt: { gte: d1 } } }) : 0,
    d7Ids.length ? prisma.user.count({ where: { id: { in: d7Ids }, lastSeenAt: { gte: d7 } } }) : 0
  ]);

  return {
    totals: {
      dau,
      newUsers,
      revenueUsd: Number(paidRevenue._sum.amount || 0),
      taps: totalTaps._sum.totalTaps || 0,
      chestOpens,
      prestigeCount
    },
    retention: {
      d1: pct(d1Retained, d1Ids.length),
      d7: pct(d7Retained, d7Ids.length)
    },
    topFunnels: [
      { key: 'tap_to_first_upgrade', conversionRate: pct(upgradedUsers, totalUsers) },
      { key: 'first_upgrade_to_daily_claim', conversionRate: pct(dailyClaimUsers, Math.max(upgradedUsers, 1)) },
      { key: 'daily_claim_to_network_expansion', conversionRate: pct(referralUsers, Math.max(dailyClaimUsers, 1)) },
      { key: 'network_to_reboot_ready', conversionRate: pct(prestigeCount, Math.max(referralUsers, 1)) }
    ]
  };
}
