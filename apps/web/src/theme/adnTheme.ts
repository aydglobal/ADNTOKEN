export const adnTheme = {
  colors: {
    bg0: "#F6F8FC",
    bg1: "#EEF3FF",
    bg2: "#E7EEFF",
    surface: "rgba(255,255,255,0.82)",
    surfaceStrong: "rgba(255,255,255,0.96)",
    border: "rgba(15,23,42,0.08)",
    gold: "#F7B500",
    cyan: "#26C6DA",
    mint: "#2ED8A7",
    pink: "#FF5FA2",
    red: "#FF6B6B",
    text: "#0F172A",
    textSoft: "rgba(15,23,42,0.78)",
    textMute: "rgba(15,23,42,0.56)",
    success: "#1FBF75",
    warning: "#F59E0B",
  },
  gradients: {
    appBg: "linear-gradient(180deg, #F8FBFF 0%, #EEF4FF 45%, #E6EEFF 100%)",
    goldCta: "linear-gradient(135deg, #FFD54A 0%, #F7B500 100%)",
    cyanPulse: "linear-gradient(135deg, rgba(38,198,218,0.18) 0%, rgba(46,216,167,0.14) 100%)",
    prestige: "linear-gradient(135deg, rgba(255,95,162,0.16) 0%, rgba(38,198,218,0.14) 100%)",
  },
  radius: {
    card: 24,
    button: 18,
    chip: 999,
  },
  shadow: {
    soft: "0 12px 32px rgba(15,23,42,0.08)",
    glowGold: "0 0 0 1px rgba(247,181,0,0.12), 0 10px 30px rgba(247,181,0,0.18)",
    glowCyan: "0 0 0 1px rgba(38,198,218,0.12), 0 10px 30px rgba(38,198,218,0.16)",
  },
  motion: {
    fast: 0.18,
    base: 0.26,
    soft: 0.36,
  }
} as const;
