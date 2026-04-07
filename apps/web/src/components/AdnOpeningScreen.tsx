import React from "react";
import { ChevronRight, FileText } from "lucide-react";

type OpeningScreenProps = {
  playerName?: string;
  balance: number;
  level: number;
  combo: number;
  dailyRewardAmount: number;
  dailyRewardProgress: number; // 0 - 100
  nextUnlockTitle: string;
  nextUnlockRemaining: number;
  heroImage: string;
  onEnterGame: () => void;
  onOpenLitepaper: () => void;
  onClaimDaily?: () => void;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.floor(value));
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function AdnOpeningScreen({
  balance,
  level,
  combo,
  dailyRewardAmount,
  dailyRewardProgress,
  nextUnlockTitle,
  nextUnlockRemaining,
  heroImage,
  onEnterGame,
  onOpenLitepaper,
  onClaimDaily,
}: OpeningScreenProps) {
  const progress = clampProgress(dailyRewardProgress);

  return (
    <div className="min-h-screen w-full bg-[#07111f] text-white flex items-start justify-center overflow-x-hidden">
      <div className="relative w-full max-w-[430px] min-h-screen px-4 pt-4 pb-6">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_38%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="relative z-10">
          {/* Top bar */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="text-[15px] font-semibold tracking-[0.02em]">ADN Token</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white/70"
              >
                ⋮
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white/70"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4 rounded-full border border-cyan-400/15 bg-white/[0.04] p-[5px] shadow-[0_0_24px_rgba(34,211,238,0.08)]">
            <div className="h-[8px] w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 shadow-[0_0_14px_rgba(56,189,248,0.55)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              onClick={onEnterGame}
              className="group flex h-[56px] items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-gradient-to-r from-sky-400 to-blue-500 px-4 text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>ENTER ADN</span>
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onOpenLitepaper}
              className="flex h-[56px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[15px] font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:bg-white/[0.06] active:scale-[0.99]"
            >
              <FileText className="h-4 w-4" />
              <span>View Litepaper</span>
            </button>
          </div>

          {/* Info cards */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              onClick={onClaimDaily}
              className="rounded-[24px] border border-cyan-300/10 bg-white/[0.04] p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition hover:bg-white/[0.055]"
            >
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-cyan-200/45">
                Daily Reward Ready
              </div>
              <div className="text-[15px] font-semibold leading-tight text-white">
                Claim +{formatNumber(dailyRewardAmount)} ADN
              </div>
              <div className="mt-1 text-[13px] text-white/55">Available now</div>
            </button>
            <div className="rounded-[24px] border border-cyan-300/10 bg-white/[0.04] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-cyan-200/45">
                Next Unlock
              </div>
              <div className="text-[15px] font-semibold text-white">{nextUnlockTitle}</div>
              <div className="mt-1 text-[13px] text-white/55">
                {nextUnlockRemaining} missions remaining
              </div>
            </div>
          </div>

          {/* Hero visual card */}
          <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(31,61,93,0.95),rgba(8,19,34,0.96))] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.34),0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_34%)]" />
            <div className="relative overflow-hidden rounded-[24px] border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(11,28,47,0.92),rgba(7,17,31,0.96))] px-3 pt-4 pb-3">
              {/* HUD pills */}
              <div className="absolute left-3 top-3 rounded-[18px] border border-cyan-300/15 bg-[#091a2d]/90 px-4 py-2 shadow-[0_0_22px_rgba(34,211,238,0.12)] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-200/45">Balance</div>
                <div className="mt-1 text-[14px] font-semibold text-white">
                  {formatNumber(balance)} ADN
                </div>
              </div>
              <div className="absolute right-3 top-3 rounded-[18px] border border-yellow-300/10 bg-[#0f1f33]/90 px-4 py-2 shadow-[0_0_22px_rgba(56,189,248,0.1)] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-[0.26em] text-yellow-200/45">Level</div>
                <div className="mt-1 text-[14px] font-semibold text-white">Lv.{level}</div>
              </div>

              {/* Hero image */}
              <div className="flex justify-center px-4 pt-10">
                <img
                  src={heroImage}
                  alt="ADN Hero"
                  className="h-[300px] w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                />
              </div>

              {/* Bottom stats */}
              <div className="mt-2 grid grid-cols-[1fr_1.35fr] gap-3">
                <div className="rounded-[20px] border border-cyan-300/10 bg-[#081727]/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/45">Combo</div>
                  <div className="mt-2 text-[24px] font-bold leading-none text-white">x{combo}</div>
                  <div className="mt-1 text-[13px] text-white/55">Ready</div>
                </div>
                <div className="rounded-[20px] border border-cyan-300/10 bg-[#081727]/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/45">
                    Daily Reward
                  </div>
                  <div className="mt-2 text-[28px] font-bold leading-none text-white">
                    +{formatNumber(dailyRewardAmount)} ADN
                  </div>
                  <div className="mt-4 h-[8px] overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-[13px] text-cyan-100/70">@adntoken_bot</div>
        </div>
      </div>
    </div>
  );
}
