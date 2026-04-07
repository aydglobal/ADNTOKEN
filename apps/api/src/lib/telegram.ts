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
