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
          [{ text: '🚀 ▸ ARENA\'YI AÇ', web_app: { url: WEBAPP_URL } }],
          [
            { text: '👤 Profil', callback_data: 'profile' },
            { text: '💰 Bakiye', callback_data: 'balance' }
          ],
          [
            { text: '🎯 Görevler', callback_data: 'missions' },
            { text: '👥 Referans', callback_data: 'referral' }
          ],
          [
            { text: '🎁 Günlük Ödül', callback_data: 'daily' },
            { text: '⚙️ Ayarlar', callback_data: 'settings' }
          ],
          [{ text: '📊 Liderlik', callback_data: 'leaderboard' }],
        ]
      }
    };
  }

  function backMenu() {
    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 ▸ ARENA\'YI AÇ', web_app: { url: WEBAPP_URL } }],
          [{ text: '⬅️ Ana Menü', callback_data: 'menu' }],
        ]
      }
    };
  }

  bot.start(async (ctx) => {
    const firstName = ctx.from?.first_name || 'Operatif';
    const text = [
      `⚡ *ADN TOKEN — ARENA CORE*`,
      ``,
      `╔══════════════════════╗`,
      `║  Hoş geldin, *${firstName}*  `,
      `╚══════════════════════╝`,
      ``,
      `🦁 *Lion sahaya indi. Sistem aktif.*`,
      ``,
      `▸ 💎 Tap yap → ADN kazan`,
      `▸ 🎯 Görevleri tamamla → XP kazan`,
      `▸ 👥 Referans ver → Bonus al`,
      `▸ 🏆 Liderliğe yüksel`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🔋 *Enerji sistemi aktif* | 🌐 *Live Ops açık*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');
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
    await ctx.reply(
      `👤 *PROFIL KARTI*\n\n━━━━━━━━━━━━━━━\n🎖 Seviye: *4*\n🏅 Lig: *Silver*\n⚡ Enerji: *590/590*\n🔥 Günlük seri: *3 gün*\n━━━━━━━━━━━━━━━\n\n_Güncel veriler için Arena'yı aç._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('balance', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `💰 *BAKİYE PANELİ*\n\n━━━━━━━━━━━━━━━\n💎 Toplam ADN: *2.4K*\n📈 Saatlik üretim: *192/s*\n⚡ Boost: *Hazır*\n━━━━━━━━━━━━━━━\n\n_Güncel bakiye için Arena'yı aç._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('missions', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `🎯 *GÖREV MERKEZİ*\n\n━━━━━━━━━━━━━━━\n✅ Günlük giriş\n⬜ 25 tap yap\n⬜ 1 upgrade al\n━━━━━━━━━━━━━━━\n📊 Tamamlanan: *1/3*\n🏆 Ödül: *350 ADN + enerji*\n\n_Görevleri Arena içinden tamamla._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('referral', async (ctx) => {
    await ctx.answerCbQuery();
    const me = await bot.telegram.getMe();
    const link = `https://t.me/${me.username}?start=ref_adn`;
    await ctx.reply(
      `👥 *REFERANS MERKEZİ*\n\n━━━━━━━━━━━━━━━\n🔗 Davet bağlantın:\n\`${link}\`\n━━━━━━━━━━━━━━━\n💎 Her davet = bonus ADN\n⚡ Aktif referans = pasif gelir`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('daily', async (ctx) => {
    await ctx.answerCbQuery('🎁 Günlük ödül!');
    await ctx.reply(
      `🎁 *GÜNLÜK ÖDÜL*\n\n━━━━━━━━━━━━━━━\n💎 +250 ADN eklendi\n🔥 Seri devam ediyor!\n━━━━━━━━━━━━━━━\n\n_Daha fazla ödül için Arena'yı aç._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('leaderboard', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `📊 *LİDERLİK TABLOSU*\n\n━━━━━━━━━━━━━━━\n🥇 ADN Preview User\n🥈 Turbo Miner\n🥉 Lion Core\n━━━━━━━━━━━━━━━\n\n_Üste çıkmak için tap ve görevleri artır._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  bot.action('settings', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `⚙️ *AYARLAR*\n\n━━━━━━━━━━━━━━━\n• Bildirimler\n• WebApp açılış\n• Destek\n━━━━━━━━━━━━━━━\n\n_Ayarlar Arena içinden yönetilir._`,
      { parse_mode: 'Markdown', ...backMenu() }
    );
  });

  // Webhook'u temizle, polling başlat
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  bot.launch();
  console.log('[bot] Telegram bot polling modunda baslatildi.');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
