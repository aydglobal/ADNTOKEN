import crypto from 'crypto';

function buildDataCheckString(params: URLSearchParams) {
  const entries = [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);

  return entries.join('\n');
}

export function getAuthDateFromInitData(initData: string): number | null {
  const params = new URLSearchParams(initData);
  const raw = params.get('auth_date');
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? null : parsed;
}

export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 300
): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;

  // auth_date replay attack koruması
  const authDate = getAuthDateFromInitData(initData);
  if (authDate === null) return false;
  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (ageSeconds > maxAgeSeconds) return false;

  const dataCheckString = buildDataCheckString(params);
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

export function getTelegramUserFromInitData(initData: string) {
  const params = new URLSearchParams(initData);
  const rawUser = params.get('user');
  if (!rawUser) return null;
  return JSON.parse(rawUser) as {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
}

// ── Telegram Bot (polling) ────────────────────────────────────────────────────
export async function startTelegramBot() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const WEBAPP_URL = process.env.MINIAPP_URL || process.env.WEBAPP_URL || '';

  if (!BOT_TOKEN) {
    console.log('[bot] BOT_TOKEN yok, bot baslatilmadi.');
    return;
  }

  // Telegraf dinamik import — API'nin build'ine dahil
  const { Telegraf } = await import('telegraf');
  const bot = new Telegraf(BOT_TOKEN);

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

  bot.start(async (ctx) => {
    const firstName = ctx.from?.first_name || 'Operatif';
    const text = `🔥 *ADN Token*\n\nHoş geldin, *${firstName}!*\nADN Arena'ya hoş geldin.\n\n• ⚡ Tap yap → ADN kazan\n• 🎯 Görevleri tamamla\n• 👥 Arkadaş davet et, bonus kazan\n• 🏆 Liderlik tablosunda yüksel`;
    await ctx.reply(text, { parse_mode: 'Markdown', ...mainMenu() });
  });

  bot.command('menu', async (ctx) => {
    await ctx.reply('📌 *Ana Menü*', { parse_mode: 'Markdown', ...mainMenu() });
  });

  bot.action('menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('📌 *Ana Menü*', { parse_mode: 'Markdown', ...mainMenu() });
  });

  bot.action('profile', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('👤 *Profil*\n\nSeviye: *4*\nLig: *Silver*\nEnerji: *590/590*\n\nGüncel veriler için oyunu aç.', { parse_mode: 'Markdown', ...backMenu() });
  });

  bot.action('balance', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('💰 *Bakiye*\n\nToplam ADN: *2.4K*\nSaatlik üretim: *192/s*\n\nGüncel bakiye için oyunu aç.', { parse_mode: 'Markdown', ...backMenu() });
  });

  bot.action('missions', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('🎯 *Görevler*\n\n✅ Günlük giriş\n⬜ 25 tap yap\n⬜ 1 upgrade al\n\nOyun içinden tamamla.', { parse_mode: 'Markdown', ...backMenu() });
  });

  bot.action('referral', async (ctx) => {
    await ctx.answerCbQuery();
    const me = await bot.telegram.getMe();
    const link = `https://t.me/${me.username}?start=ref_adn`;
    await ctx.reply(`👥 *Referans Merkezi*\n\nDavet bağlantın:\n\`${link}\``, { parse_mode: 'Markdown', ...backMenu() });
  });

  bot.action('settings', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('⚙️ *Ayarlar*\n\nAyarlar mini app içinden yönetilir.', { parse_mode: 'Markdown', ...backMenu() });
  });

  // Webhook'u temizle, polling başlat
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  bot.launch();
  console.log('[bot] Telegram bot polling modunda baslatildi.');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
