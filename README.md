# ADN Token — Telegram Mini App

Telegram Mini App + REST API + Bot + Admin Panel monoreposu.

## Yapı

```
apps/
  api/   → Express API (auth, game, boosts, admin, payout, referral)
  bot/   → Telegram bot
  web/   → React mini app (Vite)
packages/
  shared/ → Ortak tipler
```

## Deploy

| Servis | Platform | Root Directory |
|--------|----------|----------------|
| API    | Render (Web Service) | `apps/api` |
| Bot    | Render (Background Worker) | `apps/bot` |
| Web    | Render (Static Site) | `apps/web` |

## Kurulum

```bash
pnpm install
# .env dosyalarını doldur (aşağıya bak)
pnpm --filter api prisma migrate dev
pnpm dev
```

## Env Değişkenleri

### `apps/api/.env`
```env
PORT=4000
DATABASE_URL=postgresql://...
BOT_TOKEN=YOUR_BOT_TOKEN
JWT_SECRET=long_random_secret
MINIAPP_URL=https://your-miniapp.onrender.com
ADMIN_SECRET=private_admin_secret
ADMIN_TELEGRAM_USERNAME=your_username
```

### `apps/bot/.env`
```env
BOT_TOKEN=YOUR_BOT_TOKEN
MINIAPP_URL=https://your-miniapp.onrender.com
```

### `apps/web/.env`
```env
VITE_API_URL=https://your-api.onrender.com
```

## Güvenlik

- `.env` dosyaları commit edilmez
- Public repoda gerçek token/secret tutma
- Daha önce paylaşılmış token varsa mutlaka yenile
- Admin panel: `ADMIN_SECRET` + admin Telegram kullanıcısı gerektirir
- `MINIAPP_URL` mutlaka `https` olmalı

## API Route Grupları

```
/auth
/game, /api/game
/boosts, /api/boosts
/payments, /api/payments
/withdrawals, /api/withdrawals
/referral-quests, /api/referral-quests
/admin/*, /api/admin/*
/webhooks/telegram
```
