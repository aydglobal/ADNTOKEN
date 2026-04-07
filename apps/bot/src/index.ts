import 'dotenv/config';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { Context, Input, Markup, Telegraf } from 'telegraf';

const BOT_TOKEN = requireEnv('BOT_TOKEN');
const MINIAPP_URL = requireEnv('MINIAPP_URL');
const LITEPAPER_URL = 'https://aydglobal.github.io/adntoken-lite-paper/';
const BOT_USERNAME = process.env.BOT_USERNAME || 'trump_empire_like_bot';
const PORT = Number(process.env.PORT || 10000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const BOT_IMAGE_PATH = resolveBotImagePath();

const LABEL_MINIAPP = '\uD83D\uDE80 Mini App Ac';
const LABEL_TASKS = '\uD83D\uDCCB Gorevler';
const LABEL_INVITE = '\uD83D\uDC65 Davet Paneli';
const LABEL_LITEPAPER = '\uD83D\uDCD8 Litepaper';
const LABEL_HELP = '\u2753 Yardim';
const LABEL_OPEN_PANEL = '\uD83D\uDE80 ADN panelini ac';

const BOT_MENU = Markup.keyboard([
  [LABEL_MINIAPP, LABEL_TASKS],
  [LABEL_INVITE, LABEL_LITEPAPER],
  [LABEL_HELP]
])
  .resize()
  .persistent();

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const payload = ctx.payload?.trim();
  const referralMessage = payload
    ? `Bu davet kodu algilandi: ${payload}. Mini App acildiginda referral otomatik uygulanacak.`
    : 'Mini App ac ve ADN airdrop gorevlerini tamamlamaya basla.';

  await replyWithLaunchCard(
    ctx,
    [
      'ADN Token merkezine hos geldin.',
      referralMessage,
      'Mini App butonuna dokunup panele gecis yapabilirsin.',
      'Alt menuden gorevler, davet paneli, litepaper ve yardima hizli gecis yapabilirsin.'
    ],
    createMiniAppUrl(payload),
    LABEL_OPEN_PANEL
  );

  await sendMainMenu(ctx);
});

bot.command('start', async (ctx) => {
  await sendMainMenu(ctx);
});

bot.command('airdrop', async (ctx) => {
  await sendAirdropMenu(ctx);
});

bot.command('tasks', async (ctx) => {
  await sendTasksMenu(ctx);
});

bot.command('invite', async (ctx) => {
  await sendInviteMenu(ctx);
});

bot.command('litepaper', async (ctx) => {
  await sendLitepaperMenu(ctx);
});

bot.command('menu', async (ctx) => {
  await sendMainMenu(ctx);
});

bot.command('help', async (ctx) => {
  await sendHelpMenu(ctx);
});

bot.hears(LABEL_MINIAPP, async (ctx) => {
  await sendAirdropMenu(ctx);
});

bot.hears(LABEL_TASKS, async (ctx) => {
  await sendTasksMenu(ctx);
});

bot.hears(LABEL_INVITE, async (ctx) => {
  await sendInviteMenu(ctx);
});

bot.hears(LABEL_LITEPAPER, async (ctx) => {
  await sendLitepaperMenu(ctx);
});

bot.hears(LABEL_HELP, async (ctx) => {
  await sendHelpMenu(ctx);
});

async function setupBotMeta() {
  await bot.telegram.callApi('setMyName', { name: 'ADN Token' }).catch((e) => console.error('BOT_NAME_ERROR', e));
  await bot.telegram.callApi('setMyDescription', { description: 'ADN Token mini app merkezi. Gorevler, davet sistemi, claim durumu ve madencilik paneli burada.' }).catch((e) => console.error('BOT_DESCRIPTION_ERROR', e));
  await bot.telegram.callApi('setMyShortDescription', { short_description: 'ADN Token mini app, gorev ve claim merkezi.' }).catch((e) => console.error('BOT_SHORT_DESCRIPTION_ERROR', e));
  await bot.telegram.callApi('setMyCommands', {
    commands: [
      { command: 'start', description: 'Ana giris ve mini app butonu' },
      { command: 'airdrop', description: 'Mini app panelini ac' },
      { command: 'tasks', description: 'Gorev listesini goster' },
      { command: 'invite', description: 'Davet panelini ac' },
      { command: 'litepaper', description: 'Litepaper sayfasini ac' },
      { command: 'menu', description: 'Hizli bot menusunu goster' },
      { command: 'help', description: 'Kullanim yardimini goster' }
    ]
  }).catch((e) => console.error('BOT_COMMANDS_ERROR', e));
  await syncChatMenuButton();
}

async function syncChatMenuButton() {
  if (!hasPublicMiniAppUrl(MINIAPP_URL)) {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: { type: 'default' }
    }).catch((e) => console.error('BOT_MENU_BUTTON_RESET_ERROR', e));
    return;
  }

  await bot.telegram.callApi('setChatMenuButton', {
    menu_button: { type: 'web_app', text: '\uD83D\uDE80 ADN Ac', web_app: { url: MINIAPP_URL } }
  }).catch((e) => console.error('BOT_MENU_BUTTON_ERROR', e));
}

async function startBot() {
  if (NODE_ENV === 'production' && WEBHOOK_URL) {
    await bot.telegram.setWebhook(WEBHOOK_URL, {
      secret_token: WEBHOOK_SECRET || undefined
    }).catch((e) => {
      console.error('WEBHOOK_SET_ERROR', e);
      throw e;
    });

    console.log(`ADN bot webhook set: ${WEBHOOK_URL}`);
    await setupBotMeta();

    http.createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            await bot.handleUpdate(JSON.parse(body));
            res.writeHead(200);
            res.end('ok');
          } catch {
            res.writeHead(500);
            res.end('error');
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'webhook' }));
      }
    }).listen(PORT, () => {
      console.log(`Bot webhook server started on http://0.0.0.0:${PORT}`);
    });

    return;
  }

  await bot.launch();
  console.log(`ADN bot started (polling) for @${BOT_USERNAME}`);
  await setupBotMeta();

  http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'adn-bot', mode: 'polling' }));
  }).listen(PORT, () => {
    console.log(`Bot health server started on http://0.0.0.0:${PORT}`);
  });
}

void startBot().catch((error) => {
  console.error('BOT_START_ERROR', error);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function createMiniAppUrl(referralCode?: string) {
  if (!referralCode) return MINIAPP_URL;
  const glue = MINIAPP_URL.includes('?') ? '&' : '?';
  return `${MINIAPP_URL}${glue}ref=${encodeURIComponent(referralCode)}`;
}

function hasPublicMiniAppUrl(value: string) {
  try {
    const url = new URL(value);
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return url.protocol === 'https:' && !isLocalHost;
  } catch {
    return false;
  }
}

function requireEnv(name: 'BOT_TOKEN' | 'MINIAPP_URL') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

async function replyWithLaunchCard(
  ctx: Context,
  lines: string[],
  url: string,
  buttonText: string
) {
  const text = lines.join('\n');
  const keyboard = Markup.inlineKeyboard([Markup.button.webApp(buttonText, url)]);

  if (BOT_IMAGE_PATH) {
    return ctx.replyWithPhoto(Input.fromLocalFile(BOT_IMAGE_PATH), {
      caption: text,
      ...keyboard
    });
  }

  return ctx.reply(text, keyboard);
}

async function sendMainMenu(ctx: Context) {
  await ctx.reply(
    [
      'ADN hizli menu hazir:',
      `${LABEL_MINIAPP}: oyuna ve claim paneline gir`,
      `${LABEL_TASKS}: aktif gorevleri gor`,
      `${LABEL_INVITE}: davet akisini ac`,
      `${LABEL_LITEPAPER}: proje dokumanini ac`,
      `${LABEL_HELP}: kullanim rehberi`
    ].join('\n'),
    BOT_MENU
  );
}

async function sendAirdropMenu(ctx: Context) {
  await replyWithLaunchCard(
    ctx,
    [
      'ADN paneli hazir.',
      'Mini App uzerinden gorevleri dogrula, claim durumunu takip et ve madenciligi yonet.'
    ],
    MINIAPP_URL,
    LABEL_OPEN_PANEL
  );
}

async function sendTasksMenu(ctx: Context) {
  await ctx.reply(
    [
      `${LABEL_TASKS} ADN gorev listesi:`,
      '1. Telegram kanalina katil',
      '2. X hesabini takip et',
      '3. Arkadas davet et',
      '4. Claim ekranini ac ve durumunu kontrol et'
    ].join('\n'),
    Markup.inlineKeyboard([
      [Markup.button.webApp(`${LABEL_TASKS} panelini ac`, MINIAPP_URL)],
      [Markup.button.webApp(LABEL_MINIAPP, MINIAPP_URL)]
    ])
  );
}

async function sendInviteMenu(ctx: Context) {
  await replyWithLaunchCard(
    ctx,
    [
      `${LABEL_INVITE} hazir.`,
      'Kisisel referral linkin Mini App icindeki Davet bolumunde olusur.',
      'Kodunu kopyalayip arkadaslarinla paylasabilirsin.'
    ],
    MINIAPP_URL,
    LABEL_INVITE
  );
}

async function sendHelpMenu(ctx: Context) {
  await ctx.reply(
    [
      `${LABEL_HELP} kullanim yardimi:`,
      '1. Mini App Ac ile panele gir',
      '2. Gorevleri tamamla',
      '3. Davet kodunu paylas',
      '4. Litepaper ile proje dokumanini oku',
      '5. Claim durumunu panelden takip et',
      'Komutlar: /start /airdrop /tasks /invite /litepaper /menu /help'
    ].join('\n'),
    BOT_MENU
  );
}

async function sendLitepaperMenu(ctx: Context) {
  await ctx.reply(
    [
      `${LABEL_LITEPAPER} hazir.`,
      'Proje yapisi, ekonomi ve hedefler icin dokumani asagidan acabilirsin.'
    ].join('\n'),
    Markup.inlineKeyboard([
      [Markup.button.url(`${LABEL_LITEPAPER} ac`, LITEPAPER_URL)],
      [Markup.button.webApp(LABEL_MINIAPP, MINIAPP_URL)]
    ])
  );
}

function resolveBotImagePath() {
  const candidates = [
    path.resolve(process.cwd(), 'adn_simge.png'),
    path.resolve(process.cwd(), 'adn_icon.jpg')
  ];

  return candidates.find((filePath) => fs.existsSync(filePath));
}
