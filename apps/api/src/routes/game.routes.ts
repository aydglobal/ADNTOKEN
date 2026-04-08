import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AntiCheatError } from '../lib/antiCheat';
import { collectMiningIncome, completeAirdropTask, getAirdropDashboard, submitClaimRequest } from '../services/game.service';
import { getPublicLiveEvents } from '../services/liveOpsAdmin.service';

const router = Router();

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function applyEnergyRegen(user: {
  energy: number;
  maxEnergy: number;
  lastEnergyAt?: Date | string | null;
}) {
  const now = Date.now();
  const last = user.lastEnergyAt ? new Date(user.lastEnergyAt).getTime() : now;
  const regenEveryMs = 3000; // 3 saniyede 1 enerji
  const elapsed = Math.max(0, now - last);
  const regenPoints = Math.floor(elapsed / regenEveryMs);

  if (regenPoints <= 0) {
    return { energy: user.energy, lastEnergyAt: new Date(last) };
  }

  const nextEnergy = Math.min(user.maxEnergy, user.energy + regenPoints);
  const consumedMs = regenPoints * regenEveryMs;
  const nextLast = new Date(last + consumedMs);
  return { energy: nextEnergy, lastEnergyAt: nextLast };
}

// ── /tap ──────────────────────────────────────────────────────────────────────
router.post('/tap', async (req, res) => {
  try {
    const userId = req.user!.id;
    const body = req.body ?? {};
    const tapsRequested = Number.isFinite(body.taps) ? Number(body.taps) : 1;
    const taps = clamp(Math.floor(tapsRequested), 1, 30);
    const clientNonce = Number.isFinite(body.clientNonce) ? Number(body.clientNonce) : 0;

    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        coins: true,
        energy: true,
        maxEnergy: true,
        tapPower: true,
        tapNonce: true,
        lastEnergyAt: true,
        level: true,
        passiveIncomePerHour: true,
      }
    });

    if (!current) {
      return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' });
    }

    const regen = applyEnergyRegen({
      energy: current.energy ?? 0,
      maxEnergy: current.maxEnergy ?? 100,
      lastEnergyAt: current.lastEnergyAt,
    });

    const baseEnergy = regen.energy;
    const maxEnergy = current.maxEnergy ?? 100;
    const tapPower = Math.max(1, current.tapPower ?? 1);
    const serverNonce = current.tapNonce ?? 0;

    // Eski nonce — idempotent cevap dön
    if (clientNonce < serverNonce) {
      return res.json({
        ok: true,
        coins: current.coins ?? 0,
        energy: baseEnergy,
        energyMax: maxEnergy,
        level: current.level ?? 1,
        tapNonce: serverNonce,
        tapMultiplier: 1,
        passiveIncomePerHour: current.passiveIncomePerHour ?? 0,
      });
    }

    const spendableTaps = Math.min(baseEnergy, taps);
    const gainPerTap = Math.max(1, tapPower);
    const totalGain = spendableTaps * gainPerTap;
    const nextCoins = (current.coins ?? 0) + totalGain;
    const nextEnergy = Math.max(0, baseEnergy - spendableTaps);
    const nextNonce = serverNonce + 1;

    // Level hesapla
    const nextLevel = calcLevelFromCoins(nextCoins);

    // Race condition koruması — nonce koşullu update
    const updateResult = await prisma.user.updateMany({
      where: { id: userId, tapNonce: serverNonce },
      data: {
        coins: nextCoins,
        energy: nextEnergy,
        level: nextLevel,
        tapNonce: nextNonce,
        lastEnergyAt: regen.lastEnergyAt,
        totalTaps: { increment: spendableTaps },
        lastTapAt: new Date(),
      }
    });

    // Başka bir istek önce güncelledi — güncel veriyi dön
    if (updateResult.count === 0) {
      const fresh = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          coins: true, energy: true, maxEnergy: true,
          level: true, tapNonce: true, passiveIncomePerHour: true
        }
      });
      return res.json({
        ok: true,
        coins: fresh?.coins ?? current.coins ?? 0,
        energy: fresh?.energy ?? baseEnergy,
        energyMax: fresh?.maxEnergy ?? maxEnergy,
        level: fresh?.level ?? current.level ?? 1,
        tapNonce: fresh?.tapNonce ?? serverNonce,
        tapMultiplier: 1,
        passiveIncomePerHour: fresh?.passiveIncomePerHour ?? 0,
      });
    }

    return res.json({
      ok: true,
      coins: nextCoins,
      energy: nextEnergy,
      energyMax: maxEnergy,
      level: nextLevel,
      tapNonce: nextNonce,
      tapMultiplier: 1,
      passiveIncomePerHour: current.passiveIncomePerHour ?? 0,
    });

  } catch (error) {
    if (error instanceof AntiCheatError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('POST /game/tap failed', error);
    return res.status(500).json({ ok: false, error: 'TAP_FAILED' });
  }
});

function calcLevelFromCoins(coins: number) {
  if (coins >= 500000) return 10;
  if (coins >= 250000) return 9;
  if (coins >= 100000) return 8;
  if (coins >= 50000)  return 7;
  if (coins >= 20000)  return 6;
  if (coins >= 10000)  return 5;
  if (coins >= 4000)   return 4;
  if (coins >= 1500)   return 3;
  if (coins >= 400)    return 2;
  return 1;
}

// ── Diğer route'lar ───────────────────────────────────────────────────────────
router.post('/collect', async (req, res) => {
  const userId = req.user!.id;
  try {
    const result = await collectMiningIncome(userId);
    res.json(result);
  } catch (error) {
    if (error instanceof AntiCheatError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    throw error;
  }
});

router.get('/leaderboard', async (_req, res) => {
  const { getSafeLeaderboard } = await import('../services/leaderboard.service');
  const users = await getSafeLeaderboard(20);
  res.json(users);
});

router.get('/live-events', async (_req, res) => {
  res.json(getPublicLiveEvents());
});

router.get('/airdrop', async (req, res) => {
  const userId = req.user!.id;
  const dashboard = await getAirdropDashboard(userId);
  res.json(dashboard);
});

router.post('/airdrop/task', async (req, res) => {
  const userId = req.user!.id;
  const body = z.object({ code: z.string().min(1) }).parse(req.body);
  try {
    await completeAirdropTask(userId, body.code);
    const dashboard = await getAirdropDashboard(userId);
    res.json(dashboard);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Gorev tamamlama basarisiz' });
  }
});

router.post('/airdrop/claim', async (req, res) => {
  const userId = req.user!.id;
  const body = z.object({ walletAddress: z.string().min(12).max(128) }).parse(req.body);
  try {
    const result = await submitClaimRequest(userId, body.walletAddress);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Cekim talebi basarisiz' });
  }
});

export default router;
