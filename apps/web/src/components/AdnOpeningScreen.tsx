import React from "react";
import { motion } from "framer-motion";
import { Settings, Bell, ChevronRight, Sparkles, Trophy, Zap } from "lucide-react";
import startlionImg from "../assets/startlion.jpg";

const stats = [
  { label: "Balance", value: "12,450 ADN", icon: Trophy },
  { label: "Combo", value: "x18 Ready", icon: Zap },
  { label: "Daily", value: "Reward Ready", icon: Sparkles },
];

const floatingCoins = [
  { left: "12%", top: "18%", delay: 0.2, size: 42 },
  { left: "82%", top: "26%", delay: 1.1, size: 30 },
  { left: "18%", top: "72%", delay: 0.7, size: 26 },
  { left: "76%", top: "66%", delay: 1.8, size: 34 },
];

interface AdnOpeningScreenProps {
  onEnter: () => void;
}

export default function AdnOpeningScreen({ onEnter }: AdnOpeningScreenProps) {
  return (
    <div className="adn-opening-root">
      <BackgroundLayer />
      <FloatingParticles />
      <FloatingCoins />
      <div className="adn-opening-inner">
        <TopBar />
        <main className="adn-opening-main">
          <LeftPanel onEnter={onEnter} />
          <RightPanel />
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="adn-opening-topbar"
    >
      <div className="adn-opening-brand">
        <div className="adn-opening-logo">
          <span>ADN</span>
        </div>
        <div>
          <p className="adn-opening-eyebrow">Early Access</p>
          <h1 className="adn-opening-title">ADN Reward Engine</h1>
        </div>
      </div>
      <div className="adn-opening-topbar-actions">
        <IconGlassButton><Bell size={16} /></IconGlassButton>
        <IconGlassButton><Settings size={16} /></IconGlassButton>
      </div>
    </motion.header>
  );
}

function LeftPanel({ onEnter }: { onEnter: () => void }) {
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
        <h2 className="adn-opening-headline">Tap.<br />Scale.<br />Dominate.</h2>
        <p className="adn-opening-subtext">
          Build momentum inside ADN's premium game economy. Stack gains, unlock upgrades,
          trigger reward loops, and grow your digital empire before the next phase opens.
        </p>
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
                <div className="adn-opening-stat-icon">
                  <Icon size={16} />
                </div>
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
          <span>ENTER ADN</span>
          <ChevronRight size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="adn-opening-cta-secondary"
        >
          View Litepaper
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42 }}
        className="adn-opening-info-grid"
      >
        <InfoCard title="Daily Reward Ready" value="Claim +2,400 ADN" sub="Available now" />
        <InfoCard title="Next Unlock" value="Vault Tier I" sub="4 missions remaining" />
      </motion.div>
    </section>
  );
}

function RightPanel() {
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
            <img
              src={startlionImg}
              alt="ADN Lion"
              className="adn-opening-lion-img"
            />
            <div className="adn-opening-img-overlay-bottom" />
            <div className="adn-opening-img-overlay-top" />
            <HudPill className="adn-hud-tl" title="Balance" value="12,450 ADN" glow="cyan" />
            <HudPill className="adn-hud-tr" title="Level" value="Lv. 12" glow="gold" />
            <HudPill className="adn-hud-bl" title="Combo" value="x18 Ready" glow="cyan" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="adn-opening-daily-card"
            >
              <p className="adn-opening-daily-label">Daily Reward</p>
              <p className="adn-opening-daily-value">+2,400 ADN</p>
              <div className="adn-opening-daily-bar">
                <div className="adn-opening-daily-bar-fill" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InfoCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="adn-opening-info-card"
    >
      <p className="adn-opening-stat-label">{title}</p>
      <p className="adn-opening-stat-value">{value}</p>
      <p className="adn-opening-info-sub">{sub}</p>
    </motion.div>
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

function IconGlassButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="adn-opening-icon-btn"
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
          style={{
            left: `${5 + ((i * 13) % 90)}%`,
            top: `${8 + ((i * 17) % 80)}%`,
          }}
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
