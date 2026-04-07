import 'dotenv/config';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { Context, Input, Markup, Telegraf } from 'telegraf';

const BOT_TOKEN = requireEnv('BOT_TOKEN');
const MINIAPP_URL = requireEnv('MINIAPP_URL');
const LITEPAPER_URL = 'https://aydglobal.github.io/adntoken-lite-paper/';
const BOT_USERNAME = process.env.BOT_USERNAME || 'adntoken_bot';
const PORT = Number(process.env.PORT || 10000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const BOT_IMAGE_PATH = resolveBotImagePath();

const bot = new Telegraf(BOT_TOKEN);

// ── Keyboard menü ──────────────────────────────────────────────────────────────
const MAIN_KEYBOARD = Markup.keyboard([
  ['🚀 Oyunu Aç', '📋 Görevler'],
  ['👥 Arkadaş Davet Et', '📖 Litepaper'],
  ['💰 Bakiyem', '❓ Yardım']
]).resize().persistent();

// ── /start ─────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const payload = ctx.payload?.trim();
  const firstName = ctx.from?.first_name || 'Operatif';

  const welcomeText = [
    `⚡ *Hoş geldin, ${firstName}!*`,
    '',
    '🦁 *ADN Token Ödül Motoruna* katıldın.',
    '',
    '🎯 *Ne yapabilirsin?*',
    '• Tap yaparak ADN kazan',
    '• Günlük görevleri tamamla',
    '• Arkadaşlarını davet et, bonus kazan',
    '• Yükselt, prestij kazan, liderliğe çık',
    '',
    payload
      ? `🔗 Referral kodu algılandı: \`${payload}\``
      : '💡 Hemen başlamak için aşağıdaki butona dokun!',
  ].join('\n');

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.webApp('🚀 ADN\'ye Gir', createMiniAppUrl(payload))],
    [Markup.button.url('📖 Litepaper', LITEPAPER_URL)],
  ]);

  if (BOT_IMAGE_PATH) {
    await ctx.replyWithPhoto(Input.fromLocalFile(BOT_IMAGE_PATH), {
      caption: welcomeText,
      parse_mode: 'Markdown',
      ...keyboard
    });
  } else {
    await ctx.reply(welcomeText, { parse_mode: 'Markdown', ...keyboard });
  }

  await ctx.reply('📌 *Hızlı menü aşağıda hazır:*', { parse_mode: 'Markdown', ...MAIN_KEYBOARD });
});

// ── Komutlar ───────────────────────────────────────────────────────────────────
bot.command('menu', async (ctx) => {
  await ctx.reply('📌 *Ana Menü*\n\nAşağıdaki butonları kullanabilirsin:', {
    parse_mode: 'Markdown',
    ...MAIN_KEYBOARD
  });
});

bot.command('airdrop', (ctx) => sendGameMenu(ctx));
bot.command('tasks', (ctx) => sendTasksMenu(ctx));
bot.command('invite', (ctx) => sendInviteMenu(ctx));
bot.command('litepaper', (ctx) => sendLitepaperMenu(ctx));
bot.command('balance', (ctx) => sendBalanceMenu(ctx));
bot.command('help', (ctx) => sendHelpMenu(ctx));

// ── Keyboard dinleyiciler ──────────────────────────────────────────────────────
bot.hears('🚀 Oyunu Aç', (ctx) => sendGameMenu(ctx));
bot.hears('📋 Görevler', (ctx) => sendTasksMenu(ctx));
bot.hears('👥 Arkadaş Davet Et', (ctx) => sendInviteMenu(ctx));
bot.hears('📖 Litepaper', (ctx) => sendLitepaperMenu(ctx));
bot.hears('💰 Bakiyem', (ctx) => sendBalanceMenu(ctx));
bot.hears('❓ Yardım', (ctx) => sendHelpMenu(ctx));

// ── Menü fonksiyonları ─────────────────────────────────────────────────────────
async function sendGameMenu(ctx: Context) {
  const text = [
    '🎮 *ADN Oyun Paneli*',
    '',
    '⚡ Tap yap → ADN kazan',
    '🔋 Enerji dolunca tekrar tap!',
    '🏆 Liderlik tablosunda yüksel',
    '💎 Chest aç, bonus kazan',
    '',
    '👇 Panele girmek için dokun:',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Oyunu Aç', MINIAPP_URL)],
    ])
  });
}

async function sendTasksMenu(ctx: Context) {
  const text = [
    '📋 *Aktif Görevler*',
    '',
    '✅ Telegram kanalına katıl',
    '✅ X (Twitter) hesabını takip et',
    '✅ Arkadaş davet et',
    '✅ Günlük ödülü al',
    '✅ İlk yükseltmeni yap',
    '',
    '🎁 Her görev tamamlandığında ADN kazanırsın!',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('📋 Görevleri Gör', MINIAPP_URL)],
      [Markup.button.webApp('🚀 Oyuna Dön', MINIAPP_URL)],
    ])
  });
}

async function sendInviteMenu(ctx: Context) {
  const text = [
    '👥 *Arkadaş Davet Sistemi*',
    '',
    '🔗 Kişisel referral linkin Mini App\'te oluşur',
    '💰 Her davet ettiğin kişi için bonus ADN kazan',
    '🏅 Davet milestonelarına ulaş, özel ödüller al',
    '',
    '📲 Davet linkini almak için oyunu aç:',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('👥 Davet Paneli', MINIAPP_URL)],
    ])
  });
}

async function sendLitepaperMenu(ctx: Context) {
  const text = [
    '📖 *ADN Token Litepaper*',
    '',
    '🔍 Proje yapısı ve ekonomi modeli',
    '📊 Token dağıtımı ve roadmap',
    '🎯 Hedefler ve vizyon',
    '',
    '👇 Litepaper\'ı okumak için:',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.url('📖 Litepaper\'ı Aç', LITEPAPER_URL)],
      [Markup.button.webApp('🚀 Oyuna Dön', MINIAPP_URL)],
    ])
  });
}

async function sendBalanceMenu(ctx: Context) {
  const text = [
    '💰 *Bakiye & İstatistikler*',
    '',
    '📊 Güncel bakiyeni ve istatistiklerini',
    '   Mini App\'ten takip edebilirsin.',
    '',
    '🏆 Liderlik tablosunda yerini gör',
    '⚡ Enerji durumunu kontrol et',
    '🎁 Bekleyen ödülleri topla',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('💰 Bakiyemi Gör', MINIAPP_URL)],
    ])
  });
}

async function sendHelpMenu(ctx: Context) {
  const text = [
    '❓ *Yardım & Komutlar*',
    '',
    '🚀 /start — Başlangıç ekranı',
    '🎮 /airdrop — Oyun paneli',
    '📋 /tasks — Görev listesi',
    '👥 /invite — Davet paneli',
    '📖 /litepaper — Proje dokümanı',
    '💰 /balance — Bakiye bilgisi',
    '📌 /menu — Hızlı menü',
    '❓ /help — Bu yardım mesajı',
    '',
    '💬 Sorun mu var? @adntoken_support',
  ].join('\n');

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Oyunu Aç', MINIAPP_URL)],
    ])
  });
}

// ── Bot meta & başlatma ────────────────────────────────────────────────────────
async function setupBotMeta() {
  await bot.telegram.callApi('setMyName', { name: 'ADN Token' }).catch(() => {});
  await bot.telegram.callApi('setMyDescription', {
    description: '🦁 ADN Token Ödül Motoru\n\nTap yap, görev tamamla, arkadaş davet et ve ADN kazan!\n\n⚡ Günlük ödüller • 🏆 Liderlik tablosu • 💎 Chest sistemi'
  }).catch(() => {});
  await bot.telegram.callApi('setMyShortDescription', {
    short_description: '⚡ ADN Token — Tap, Kazan, Hükmet!'
  }).catch(() => {});
  await bot.telegram.callApi('setMyCommands', {
    commands: [
      { command: 'start', description: '🚀 Başlangıç ekranı' },
      { command: 'airdrop', description: '🎮 Oyun panelini aç' },
      { command: 'tasks', description: '📋 Görev listesi' },
      { command: 'invite', description: '👥 Arkadaş davet et' },
      { command: 'balance', description: '💰 Bakiye bilgisi' },
      { command: 'litepaper', description: '📖 Proje dokümanı' },
      { command: 'menu', description: '📌 Hızlı menü' },
      { command: 'help', description: '❓ Yardım' },
    ]
  }).catch(() => {});

  if (hasPublicMiniAppUrl(MINIAPP_URL)) {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: { type: 'web_app', text: '🚀 ADN\'yi Aç', web_app: { url: MINIAPP_URL } }
    }).catch(() => {});
  }
}

async function startBot() {
  if (NODE_ENV === 'production' && WEBHOOK_URL) {
    await bot.telegram.setWebhook(WEBHOOK_URL, { secret_token: WEBHOOK_SECRET || undefined });
    console.log(`ADN bot webhook: ${WEBHOOK_URL}`);
    await setupBotMeta();

    http.createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            await bot.handleUpdate(JSON.parse(body));
            res.writeHead(200); res.end('ok');
          } catch {
            res.writeHead(500); res.end('error');
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'webhook' }));
      }
    }).listen(PORT, () => console.log(`Bot webhook server: http://0.0.0.0:${PORT}`));
    return;
  }

  await bot.launch();
  console.log(`ADN bot started (polling) @${BOT_USERNAME}`);
  await setupBotMeta();

  http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'polling' }));
  }).listen(PORT, () => console.log(`Bot health server: http://0.0.0.0:${PORT}`));
}

void startBot().catch((e) => { console.error('BOT_START_ERROR', e); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function createMiniAppUrl(ref?: string) {
  if (!ref) return MINIAPP_URL;
  const glue = MINIAPP_URL.includes('?') ? '&' : '?';
  return `${MINIAPP_URL}${glue}ref=${encodeURIComponent(ref)}`;
}

function hasPublicMiniAppUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1';
  } catch { return false; }
}

function requireEnv(name: 'BOT_TOKEN' | 'MINIAPP_URL') {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function resolveBotImagePath() {
  const candidates = [
    path.resolve(process.cwd(), 'adn_simge.png'),
    path.resolve(process.cwd(), 'adn_icon.jpg'),
    path.resolve(process.cwd(), 'startlion.jpg'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}
