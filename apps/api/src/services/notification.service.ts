import { prisma } from '../lib/prisma';

export type NotificationTrigger =
  | 'churn_risk'
  | 'daily_ready'
  | 'mission_ready'
  | 'energy_full'
  | 'chest_ready'
  | 'boost_expired';

function buildNudgeText(params: {
  username?: string | null;
  segment?: string;
  trigger: NotificationTrigger;
}): string {
  const name = params.username ? `@${params.username}` : 'Operatif';
  switch (params.trigger) {
    case 'churn_risk':
      return `${name}, ADN Arena seni bekliyor. Geri don ve kaldığın yerden devam et.`;
    case 'daily_ready':
      return `${name}, gunluk ADN akisin hazir. Seriyi bozma.`;
    case 'mission_ready':
      return `${name}, tamamlanmis gorevlerin var. Odulleri topla.`;
    case 'energy_full':
      return `${name}, enerji doldu. Tap core hazir.`;
    case 'chest_ready':
      return `${name}, cache kasanda acilmaya hazir sandik var.`;
    case 'boost_expired':
      return `${name}, boost suresi doldu. Yeni boost al ve hizi koru.`;
    default:
      return `${name}, ADN Arena'da yeni firsatlar seni bekliyor.`;
  }
}

export async function canSendNotification(input: {
  userId: string;
  type: NotificationTrigger;
  cooldownHours?: number;
}) {
  const cooldownHours = input.cooldownHours ?? 12;
  const threshold = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

  const last = await prisma.notificationLog.findFirst({
    where: {
      userId: input.userId,
      type: input.type,
      createdAt: { gt: threshold }
    },
    orderBy: { createdAt: 'desc' }
  });

  return !last;
}

export async function queueNotification(input: {
  userId: string;
  type: NotificationTrigger;
  username?: string | null;
  segment?: string;
  campaignKey?: string;
  metadata?: Record<string, unknown>;
}) {
  const text = buildNudgeText({
    username: input.username,
    segment: input.segment,
    trigger: input.type
  });

  return prisma.notificationLog.create({
    data: {
      userId: input.userId,
      type: input.type,
      campaignKey: input.campaignKey,
      messageText: text,
      status: 'queued',
      metadataJson: input.metadata ? JSON.stringify(input.metadata) : null
    }
  });
}

export async function markNotificationSent(id: string) {
  return prisma.notificationLog.update({
    where: { id },
    data: { status: 'sent', sentAt: new Date() }
  });
}

export async function getAdminNotificationSummary() {
  const [queued, sentToday] = await Promise.all([
    prisma.notificationLog.count({ where: { status: 'queued' } }),
    prisma.notificationLog.count({
      where: {
        status: 'sent',
        sentAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  return { queued, sentToday };
}
