import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, ChevronRight, Sparkles, Trophy, Zap } from "lucide-react";
import startlionImg from "../assets/startlion.jpg";

// ── i18n ──────────────────────────────────────────────────────────────────────
type Lang = "tr" | "en" | "ru" | "de" | "fr" | "es" | "ar" | "zh" | "ja" | "ko";

const translations: Record<Lang, {
  earlyAccess: string;
  title: string;
  tagline: string;
  description: string;
  enterBtn: string;
  litepaper: string;
  balance: string;
  combo: string;
  daily: string;
  dailyReady: string;
  dailyRewardReady: string;
  nextUnlock: string;
  bot: string;
  comboReady: string;
}> = {
  tr: {
    earlyAccess: "Erken Erişim",
    title: "ADN Ödül Motoru",
    tagline: "Tap. Büyü. Hükmet.",
    description: "ADN'nin premium oyun ekonomisinde ivme kazan. Kazanımları biriktir, yükseltmeleri aç, ödül döngülerini tetikle.",
    enterBtn: "ADN'YE GİR",
    litepaper: "Litepaper",
    balance: "Bakiye",
    combo: "Combo",
    daily: "Günlük",
    dailyReady: "Ödül Hazır",
    dailyRewardReady: "Günlük Ödül Hazır",
    nextUnlock: "Sonraki Kilit",
    bot: "@adntoken_bot",
    comboReady: "Hazır",
  },
  en: {
    earlyAccess: "Early Access",
    title: "ADN Reward Engine",
    tagline: "Tap. Scale. Dominate.",
    description: "Build momentum inside ADN's premium game economy. Stack gains, unlock upgrades, trigger reward loops.",
    enterBtn: "ENTER ADN",
    litepaper: "Litepaper",
    balance: "Balance",
    combo: "Combo",
    daily: "Daily",
    dailyReady: "Reward Ready",
    dailyRewardReady: "Daily Reward Ready",
    nextUnlock: "Next Unlock",
    bot: "@adntoken_bot",
    comboReady: "Ready",
  },
  ru: {
    earlyAccess: "Ранний доступ",
    title: "ADN Движок наград",
    tagline: "Тапай. Расти. Доминируй.",
    description: "Набирай обороты в премиум-экономике ADN. Копи награды, открывай улучшения, запускай петли вознаграждений.",
    enterBtn: "ВОЙТИ В ADN",
    litepaper: "Лайтпейпер",
    balance: "Баланс",
    combo: "Комбо",
    daily: "Ежедневно",
    dailyReady: "Награда готова",
    dailyRewardReady: "Ежедневная награда готова",
    nextUnlock: "Следующая разблокировка",
    bot: "@adntoken_bot",
    comboReady: "Готово",
  },
  de: {
    earlyAccess: "Früher Zugang",
    title: "ADN Belohnungsmotor",
    tagline: "Tippen. Wachsen. Dominieren.",
    description: "Baue Schwung in ADNs Premium-Spielwirtschaft auf. Sammle Gewinne, schalte Upgrades frei.",
    enterBtn: "ADN BETRETEN",
    litepaper: "Litepaper",
    balance: "Guthaben",
    combo: "Kombo",
    daily: "Täglich",
    dailyReady: "Belohnung bereit",
    dailyRewardReady: "Tägliche Belohnung bereit",
    nextUnlock: "Nächste Freischaltung",
    bot: "@adntoken_bot",
    comboReady: "Bereit",
  },
  fr: {
    earlyAccess: "Accès anticipé",
    title: "Moteur de récompenses ADN",
    tagline: "Tapez. Évoluez. Dominez.",
    description: "Construisez de l'élan dans l'économie premium d'ADN. Accumulez des gains, débloquez des améliorations.",
    enterBtn: "ENTRER ADN",
    litepaper: "Litepaper",
    balance: "Solde",
    combo: "Combo",
    daily: "Quotidien",
    dailyReady: "Récompense prête",
    dailyRewardReady: "Récompense quotidienne prête",
    nextUnlock: "Prochain déblocage",
    bot: "@adntoken_bot",
    comboReady: "Prêt",
  },
  es: {
    earlyAccess: "Acceso anticipado",
    title: "Motor de recompensas ADN",
    tagline: "Toca. Escala. Domina.",
    description: "Construye impulso en la economía premium de ADN. Acumula ganancias, desbloquea mejoras.",
    enterBtn: "ENTRAR ADN",
    litepaper: "Litepaper",
    balance: "Saldo",
    combo: "Combo",
    daily: "Diario",
    dailyReady: "Recompensa lista",
    dailyRewardReady: "Recompensa diaria lista",
    nextUnlock: "Próximo desbloqueo",
    bot: "@adntoken_bot",
    comboReady: "Listo",
  },
  ar: {
    earlyAccess: "وصول مبكر",
    title: "محرك مكافآت ADN",
    tagline: "انقر. انمُ. سيطر.",
    description: "ابنِ زخمًا في اقتصاد ADN المميز. راكم المكاسب، افتح الترقيات.",
    enterBtn: "ادخل ADN",
    litepaper: "الورقة البيضاء",
    balance: "الرصيد",
    combo: "كومبو",
    daily: "يومي",
    dailyReady: "المكافأة جاهزة",
    dailyRewardReady: "المكافأة اليومية جاهزة",
    nextUnlock: "الفتح التالي",
    bot: "@adntoken_bot",
    comboReady: "جاهز",
  },
  zh: {
    earlyAccess: "早期访问",
    title: "ADN 奖励引擎",
    tagline: "点击。成长。主宰。",
    description: "在ADN高级游戏经济中积累动力。叠加收益，解锁升级，触发奖励循环。",
    enterBtn: "进入 ADN",
    litepaper: "白皮书",
    balance: "余额",
    combo: "连击",
    daily: "每日",
    dailyReady: "奖励就绪",
    dailyRewardReady: "每日奖励就绪",
    nextUnlock: "下一个解锁",
    bot: "@adntoken_bot",
    comboReady: "就绪",
  },
  ja: {
    earlyAccess: "早期アクセス",
    title: "ADN リワードエンジン",
    tagline: "タップ。成長。支配。",
    description: "ADNのプレミアムゲーム経済で勢いをつけよう。利益を積み上げ、アップグレードを解放。",
    enterBtn: "ADNに入る",
    litepaper: "ライトペーパー",
    balance: "残高",
    combo: "コンボ",
    daily: "デイリー",
    dailyReady: "報酬準備完了",
    dailyRewardReady: "デイリー報酬準備完了",
    nextUnlock: "次のアンロック",
    bot: "@adntoken_bot",
    comboReady: "準備完了",
  },
  ko: {
    earlyAccess: "얼리 액세스",
    title: "ADN 리워드 엔진",
    tagline: "탭. 성장. 지배.",
    description: "ADN 프리미엄 게임 경제에서 모멘텀을 쌓으세요. 수익을 쌓고, 업그레이드를 잠금 해제하세요.",
    enterBtn: "ADN 입장",
    litepaper: "라이트페이퍼",
    balance: "잔액",
    combo: "콤보",
    daily: "데일리",
    dailyReady: "보상 준비됨",
    dailyRewardReady: "데일리 보상 준비됨",
    nextUnlock: "다음 잠금 해제",
    bot: "@adntoken_bot",
    comboReady: "준비됨",
  },
};

function detectLang(): Lang {
  try {
    // Telegram WebApp user language
    const tgLang = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.language_code as string | undefined;
    if (tgLang) {
      const code = tgLang.split("-")[0].toLowerCase() as Lang;
      if (code in translations) return code;
    }
  } catch { /* ignore */ }
  // Browser fallback
  const nav = navigator.language?.split("-")[0].toLowerCase() as Lang;
  return nav in translations ? nav : "en";
}

function fmt(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.floor(value));
}

// ── Floating coins ─────────────────────────────────────────────────────────────
const floatingCoins = [
  { left: "12%", top: "18%", delay: 0.2, size: 42 },
  { left: "82%", top: "26%", delay: 1.1, size: 30 },
  { left: "18%", top: "72%", delay: 0.7, size: 26 },
  { left: "76%", top: "66%", delay: 1.8, size: 34 },
];

// ── Props ──────────────────────────────────────────────────────────────────────
interface AdnOpeningScreenProps {
  onEnter: () => void;
  balance?: number;
  level?: number;
  combo?: number;
  dailyRewardAmount?: number;
  dailyRewardProgress?: number;
  nextUnlockTitle?: string;
  nextUnlockRemaining?: number;
  onClaimDaily?: () => void;
  onOpenLitepaper?: () => void;
}

export default function AdnOpeningScreen({
  onEnter,
  balance = 0,
  level = 1,
  combo = 0,
  dailyRewardAmount = 0,
  dailyRewardProgress = 0,
  nextUnlockTitle = "Vault Tier I",
  nextUnlockRemaining = 0,
  onClaimDaily,
  onOpenLitepaper,
}: AdnOpeningScreenProps) {
  const lang = useMemo(() => detectLang(), []);
  const t = translations[lang];

  const stats = [
    { label: t.balance, value: `${fmt(balance)} ADN`, icon: Trophy },
    { label: t.combo, value: `x${combo} ${t.comboReady}`, icon: Zap },
    { label: t.daily, value: t.dailyReady, icon: Sparkles },
  ];

  return (
    <div className="adn-opening-root">
      <BackgroundLayer />
      <FloatingParticles />
      <FloatingCoins />
      <div className="adn-opening-inner">
        <TopBar t={t} onSettings={() => {}} onBell={() => {}} />
        <main className="adn-opening-main">
          <LeftPanel
            t={t}
            stats={stats}
            dailyRewardAmount={dailyRewardAmount}
            nextUnlockTitle={nextUnlockTitle}
            nextUnlockRemaining={nextUnlockRemaining}
            onEnter={onEnter}
            onLitepaper={onOpenLitepaper}
            onClaimDaily={onClaimDaily}
          />
          <RightPanel
            t={t}
            balance={balance}
            level={level}
            combo={combo}
            dailyRewardAmount={dailyRewardAmount}
            dailyRewardProgress={dailyRewardProgress}
          />
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TopBar({ t, onSettings, onBell }: { t: typeof translations["en"]; onSettings: () => void; onBell: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="adn-opening-topbar"
    >
      <div className="adn-opening-brand">
        <div className="adn-opening-logo"><span>ADN</span></div>
        <div>
          <p className="adn-opening-eyebrow">{t.earlyAccess}</p>
          <h1 className="adn-opening-title">{t.title}</h1>
        </div>
      </div>
      <div className="adn-opening-topbar-actions">
        <IconGlassButton onClick={onBell}><Bell size={16} /></IconGlassButton>
        <IconGlassButton onClick={onSettings}><Settings size={16} /></IconGlassButton>
      </div>
    </motion.header>
  );
}

function LeftPanel({
  t, stats, dailyRewardAmount, nextUnlockTitle, nextUnlockRemaining,
  onEnter, onLitepaper, onClaimDaily,
}: {
  t: typeof translations["en"];
  stats: { label: string; value: string; icon: React.ElementType }[];
  dailyRewardAmount: number;
  nextUnlockTitle: string;
  nextUnlockRemaining: number;
  onEnter: () => void;
  onLitepaper?: () => void;
  onClaimDaily?: () => void;
}) {
  return (
    <section className="adn-opening-left">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="adn-opening-badge"
      >
        <span className="adn-opening-badge-dot" />
        <span>Momentum Rewards First Movers</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="adn-opening-headline-block"
      >
        <h2 className="adn-opening-headline">
          {t.tagline.split(". ").map((line, i) => (
            <React.Fragment key={i}>{line}.<br /></React.Fragment>
          ))}
        </h2>
        <p className="adn-opening-subtext">{t.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26 }}
        className="adn-opening-stats-grid"
      >
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="adn-opening-stat-card"
            >
              <div className="adn-opening-stat-card-inner">
                <div>
                  <p className="adn-opening-stat-label">{item.label}</p>
                  <p className="adn-opening-stat-value">{item.value}</p>
                </div>
                <div className="adn-opening-stat-icon"><Icon size={16} /></div>
              </div>
              <motion.div
                initial={{ scaleX: 0.3, opacity: 0.45 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
                className="adn-opening-stat-bar"
              >
                <div className="adn-opening-stat-bar-fill" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.34 }}
        className="adn-opening-cta-row"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="adn-opening-cta-primary"
          onClick={onEnter}
        >
          <span>{t.enterBtn}</span>
          <ChevronRight size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="adn-opening-cta-secondary"
          onClick={onLitepaper}
        >
          {t.litepaper}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42 }}
        className="adn-opening-info-grid"
      >
        <InfoCard
          title={t.dailyRewardReady}
          value={`+${fmt(dailyRewardAmount)} ADN`}
          sub={t.dailyReady}
          onClick={onClaimDaily}
        />
        <InfoCard
          title={t.nextUnlock}
          value={nextUnlockTitle}
          sub={`${nextUnlockRemaining} missions`}
        />
      </motion.div>
    </section>
  );
}

function RightPanel({
  t, balance, level, combo, dailyRewardAmount, dailyRewardProgress,
}: {
  t: typeof translations["en"];
  balance: number;
  level: number;
  combo: number;
  dailyRewardAmount: number;
  dailyRewardProgress: number;
}) {
  const progress = Math.max(0, Math.min(100, dailyRewardProgress));
  return (
    <section className="adn-opening-right">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12 }}
        className="adn-opening-visual-wrap"
      >
        <div className="adn-opening-visual-glow-left" />
        <div className="adn-opening-visual-glow-right" />
        <div className="adn-opening-visual-card">
          <div className="adn-opening-visual-inner">
            <img src={startlionImg} alt="ADN Lion" className="adn-opening-lion-img" />
            <div className="adn-opening-img-overlay-bottom" />
            <div className="adn-opening-img-overlay-top" />
            <HudPill className="adn-hud-tl" title={t.balance} value={`${fmt(balance)} ADN`} glow="cyan" />
            <HudPill className="adn-hud-tr" title="Level" value={`Lv. ${level}`} glow="gold" />
            <HudPill className="adn-hud-bl" title={t.combo} value={`x${combo} ${t.comboReady}`} glow="cyan" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="adn-opening-daily-card"
            >
              <p className="adn-opening-daily-label">{t.daily}</p>
              <p className="adn-opening-daily-value">+{fmt(dailyRewardAmount)} ADN</p>
              <div className="adn-opening-daily-bar">
                <div className="adn-opening-daily-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InfoCard({ title, value, sub, onClick }: { title: string; value: string; sub: string; onClick?: () => void }) {
  const El = onClick ? motion.button : motion.div;
  return (
    <El
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="adn-opening-info-card"
      onClick={onClick}
    >
      <p className="adn-opening-stat-label">{title}</p>
      <p className="adn-opening-stat-value">{value}</p>
      <p className="adn-opening-info-sub">{sub}</p>
    </El>
  );
}

function HudPill({ className, title, value, glow }: { className: string; title: string; value: string; glow: "cyan" | "gold" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`adn-hud-pill ${className} adn-hud-pill--${glow}`}
    >
      <p className="adn-hud-pill-label">{title}</p>
      <p className="adn-hud-pill-value">{value}</p>
    </motion.div>
  );
}

function IconGlassButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="adn-opening-icon-btn"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

function BackgroundLayer() {
  return (
    <div className="adn-opening-bg">
      <div className="adn-opening-bg-gradient" />
      <div className="adn-opening-bg-grid" />
      <div className="adn-opening-bg-orb-left" />
      <div className="adn-opening-bg-orb-right" />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="adn-opening-particles">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="adn-opening-particle"
          style={{ left: `${5 + ((i * 13) % 90)}%`, top: `${8 + ((i * 17) % 80)}%` }}
          animate={{ opacity: [0.25, 1, 0.35], y: [0, -10, 0] }}
          transition={{ duration: 2.8 + (i % 4), delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloatingCoins() {
  return (
    <div className="adn-opening-coins">
      {floatingCoins.map((coin, i) => (
        <motion.div
          key={i}
          className="adn-opening-coin"
          style={{ left: coin.left, top: coin.top, width: coin.size, height: coin.size }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0], opacity: [0.6, 1, 0.7] }}
          transition={{ duration: 5.5, delay: coin.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          ADN
        </motion.div>
      ))}
    </div>
  );
}
