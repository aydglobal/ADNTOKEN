import 'dotenv/config';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { Context, Input, Telegraf } from 'telegraf';

const BOT_TOKEN = requireEnv('BOT_TOKEN');
const WEBAPP_URL = requireEnv('MINIAPP_URL');
const BOT_NAME = process.env.BOT_NAME || 'ADN Arena';
const SUPPORT_URL = process.env.SUPPORT_URL || WEBAPP_URL;
const PORT = Number(process.env.PORT || 10000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const BOT_IMAGE_PATH = resolveBotImagePath();

const bot = new Telegraf(BOT_TOKEN);

// ── Inline keyboard'lar ────────────────────────────────────────────────────────
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 Oyunu Aç', web_app: { url: WEBAPP_URL } }],
        [
          { text: '👤 Profil', callback_data: 'profile' },
          { text: '💰 Bakiye', callback_data: 'balance' }
        ],
        [
          { text: '🎯 Görevler', callback_data: 'missions' },
          { text: '👥 Referans', callback_data: 'referral' }
        ],
        [{ text: '⚙️ Ayarlar', callback_data: 'settings' }],
      ]
    }
  };
}

function backMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⬅️ Ana Menü', callback_data: 'menu' }],
        [{ text: '🚀 Oyunu Aç', web_app: { url: WEBAPP_URL } }],
      ]
    }
  };
}

// ── /start ─────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const payload = (ctx as any).payload?.trim() || '';
  const firstName = ctx.from?.first_name || 'Operatif';

  const text = [
    `🔥 *${BOT_NAME}*`,
    '',
    `Hoş geldin, *${firstName}!*`,
    'ADN Arena\'ya hoş geldin.',
    '',
    '• ⚡ Tap yap → ADN kazan',
    '• 🎯 Görevleri tamamla',
    '• 👥 Arkadaş davet et, bonus kazan',
    '• 🏆 Liderlik tablosunda yüksel',
    payload.startsWith('ref_') ? `\n🎁 Davet bağlantısıyla geldin. Referans bonusu oyun içinde işlenecek.` : '',
  ].filter(Boolean).join('\n');

  if (BOT_IMAGE_PATH) {
    await ctx.replyWithPhoto(Input.fromLocalFile(BOT_IMAGE_PATH), {
      caption: text,
      parse_mode: 'Markdown',
      ...mainMenu()
    });
  } else {
    await ctx.reply(text, { parse_mode: 'Markdown', ...mainMenu() });
  }
});

bot.command('menu', async (ctx) => {
  await ctx.reply('📌 *Ana Menü*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    '❓ *Komutlar*\n\n/start — Başlangıç\n/menu — Ana menü\n/profile — Profil\n/balance — Bakiye\n/missions — Görevler\n/referral — Davet\n/help — Yardım',
    { parse_mode: 'Markdown', ...backMenu() }
  );
});

bot.command('profile', (ctx) => sendProfile(ctx));
bot.command('balance', (ctx) => sendBalance(ctx));
bot.command('missions', (ctx) => sendMissions(ctx));
bot.command('referral', (ctx) => sendReferral(ctx));

// ── Callback handler ───────────────────────────────────────────────────────────
bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📌 *Ana Menü*', { parse_mode: 'Markdown', ...mainMenu() });
});

bot.action('profile', async (ctx) => {
  await ctx.answerCbQuery('Profil açıldı');
  await sendProfile(ctx);
});

bot.action('balance', async (ctx) => {
  await ctx.answerCbQuery('Bakiye açıldı');
  await sendBalance(ctx);
});

bot.action('missions', async (ctx) => {
  await ctx.answerCbQuery('Görevler açıldı');
  await sendMissions(ctx);
});

bot.action('boost', async (ctx) => {
  await ctx.answerCbQuery('Boost açıldı');
  await ctx.reply(
    '⚡ *Boost Merkezi*\n\nEtki: *2x kısa süreli hızlanma*\n\nBoostu mini app içinden kullan.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
});

bot.action('referral', async (ctx) => {
  await ctx.answerCbQuery('Referans açıldı');
  await sendReferral(ctx);
});

bot.action('leaderboard', async (ctx) => {
  await ctx.answerCbQuery('Liderlik açıldı');
  await ctx.reply(
    '📈 *Liderlik Tablosu*\n\n🥇 ADN Preview User\n🥈 Turbo Miner\n🥉 Lion Core\n\nDaha üste çıkmak için tap ve görevleri artır.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
});

bot.action('daily', async (ctx) => {
  await ctx.answerCbQuery('Günlük ödül alındı! 🎁');
  await ctx.reply(
    '🎁 *Günlük Ödül*\n\n+250 ADN eklendi.\nGünlük seriniz devam ediyor! 🔥\n\nOyun içinden daha fazla ödül topla.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
});

bot.action('settings', async (ctx) => {
  await ctx.answerCbQuery('Ayarlar açıldı');
  await ctx.reply(
    '⚙️ *Ayarlar*\n\n• Bildirimler\n• WebApp açılış butonu\n• Destek bağlantısı\n\nAyarlar mini app içinden yönetilir.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
});

// ── Mesaj dinleyici ────────────────────────────────────────────────────────────
bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  if (text.startsWith('/')) return;
  if (text.includes('oyun') || text.includes('app')) {
    await ctx.reply('Oyunu açmak için:', {
      reply_markup: {
        inline_keyboard: [[{ text: '🚀 Oyunu Aç', web_app: { url: WEBAPP_URL } }]]
      }
    });
  } else if (text.includes('görev')) {
    await ctx.reply('Görevler:', {
      reply_markup: {
        inline_keyboard: [[{ text: '🎯 Görevler', callback_data: 'missions' }]]
      }
    });
  }
});

// ── Yardımcı fonksiyonlar ──────────────────────────────────────────────────────
async function sendProfile(ctx: Context) {
  await ctx.reply(
    '👤 *Profil*\n\nSeviye: *4*\nLig: *Silver*\nEnerji: *590/590*\nGünlük seri: *3 gün*\n\nGüncel veriler için oyunu aç.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
}

async function sendBalance(ctx: Context) {
  await ctx.reply(
    '💰 *Bakiye*\n\nToplam ADN: *2.4K*\nSaatlik üretim: *192/s*\nBoost durumu: *Hazır* ⚡\n\nGüncel bakiye için oyunu aç.',
    { parse_mode: 'Markdown', ...backMenu() }
  );
}

async function sendMissions(ctx: Context) {
  await ctx.reply(
    '🎯 *Görevler*\n\n✅ Günlük giriş\n⬜ 25 tap yap\n⬜ 1 upgrade al\n\nTamamlanan: *1/3*\nÖdül: *350 ADN + enerji yenileme*',
    { parse_mode: 'Markdown', ...backMenu() }
  );
}

async function sendReferral(ctx: Context) {
  const me = await bot.telegram.getMe();
  const link = `https://t.me/${me.username}?start=ref_adn`;
  await ctx.reply(
    `👥 *Referans Merkezi*\n\nArkadaşlarını davet et, bonus kazan!\n\nDavet bağlantın:\n\`${link}\``,
    { parse_mode: 'Markdown', ...backMenu() }
  );
}

// ── Bot meta ───────────────────────────────────────────────────────────────────
async function setupBotMeta() {
  await bot.telegram.callApi('setMyName', { name: 'ADN Token' }).catch(() => {});
  await bot.telegram.callApi('setMyDescription', {
    description: '🦁 ADN Token Ödül Motoru\n\nTap yap, görev tamamla, arkadaş davet et ve ADN kazan!\n\n⚡ Günlük ödüller • 🏆 Liderlik • 💎 Chest sistemi'
  }).catch(() => {});
  await bot.telegram.callApi('setMyShortDescription', {
    short_description: '⚡ ADN Token — Tap, Kazan, Hükmet!'
  }).catch(() => {});
  await bot.telegram.callApi('setMyCommands', {
    commands: [
      { command: 'start', description: '🚀 Başlangıç ekranı' },
      { command: 'menu', description: '📌 Ana menü' },
      { command: 'profile', description: '👤 Profil bilgisi' },
      { command: 'balance', description: '💰 Bakiye bilgisi' },
      { command: 'missions', description: '🎯 Görev listesi' },
      { command: 'referral', description: '👥 Davet linki' },
      { command: 'help', description: '❓ Yardım' },
    ]
  }).catch(() => {});

  if (hasPublicUrl(WEBAPP_URL)) {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: { type: 'web_app', text: '🚀 ADN\'yi Aç', web_app: { url: WEBAPP_URL } }
    }).catch(() => {});
  }
}

// ── Başlatma ───────────────────────────────────────────────────────────────────
async function startBot() {
  if (NODE_ENV === 'production' && WEBHOOK_URL) {
    await bot.telegram.setWebhook(WEBHOOK_URL, { secret_token: WEBHOOK_SECRET || undefined });
    console.log(`ADN bot webhook: ${WEBHOOK_URL}`);
    await setupBotMeta();

    http.createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', async () => {
          try { await bot.handleUpdate(JSON.parse(body)); res.writeHead(200); res.end('ok'); }
          catch { res.writeHead(500); res.end('error'); }
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'webhook' }));
      }
    }).listen(PORT, () => console.log(`Bot webhook server: http://0.0.0.0:${PORT}`));
    return;
  }

  await bot.launch();
  const me = await bot.telegram.getMe();
  console.log(`ADN bot aktif: @${me.username}`);
  await setupBotMeta();

  http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'polling' }));
  }).listen(PORT, () => console.log(`Bot health server: http://0.0.0.0:${PORT}`));
}

void startBot().catch((e) => { console.error('BOT_START_ERROR', e); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function requireEnv(name: 'BOT_TOKEN' | 'MINIAPP_URL') {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

function hasPublicUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname !== 'localhost';
  } catch { return false; }
}

function resolveBotImagePath() {
  const candidates = [
    path.resolve(process.cwd(), 'adn_simge.png'),
    path.resolve(process.cwd(), 'adn_icon.jpg'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}
