"use client";
import { memo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface ConstellationGateProps {
  groom?: string;
  bride?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

const STARS = [
  { id: 0, x: 20, y: 66, label: "First Spark" },
  { id: 1, x: 38, y: 30, label: "Promise" },
  { id: 2, x: 64, y: 62, label: "Together" },
  { id: 3, x: 80, y: 26, label: "Forever" },
] as const;

/**
 * Constellation Trace Gate with animated SVG pathLength threads,
 * spring-smoothed live silk beam without per-move React lag, and desktop expansion.
 */
function ConstellationGateComponent({
  groom,
  bride,
  guestName,
  primary = "#4A6FA5",
  gold = "#D9A441",
  tapLabel,
  onOpen,
}: ConstellationGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [connectedCount, setConnectedCount] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const skyRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue<number>(STARS[0].x);
  const rawY = useMotionValue<number>(STARS[0].y);
  const smoothX = useSpring(rawX, { stiffness: 320, damping: 28 });
  const smoothY = useSpring(rawY, { stiffness: 320, damping: 28 });

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together Under One Sky";
  const cta = tapLabel ?? "Draw a line connecting all 4 glowing stars";

  const finishUnlock = () => {
    if (unlocked) return;
    setConnectedCount(STARS.length);
    setDrawing(false);
    setUnlocked(true);
    onOpen?.();
  };

  const toSkyPct = (clientX: number, clientY: number) => {
    const el = skyRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
  };

  const checkNextStar = (x: number, y: number) => {
    if (unlocked) return;
    const target = STARS[connectedCount];
    if (!target) return;
    if (Math.hypot(x - target.x, y - target.y) < 12) {
      const next = connectedCount + 1;
      setConnectedCount(next);
      if (next >= STARS.length) {
        finishUnlock();
      }
    }
  };

  const lastStar = STARS[Math.max(0, connectedCount - 1)];

  return (
    <div
      className="relative flex h-full min-h-[min(580px,82dvh)] @2xl:min-h-[620px] w-full flex-col items-center justify-center overflow-hidden px-4 py-8 @2xl:px-10"
      style={{
        background: "radial-gradient(circle at 50% 25%, #1D3557 0%, #091322 85%)",
      }}
    >
      {/* Revealed Night-Sky Celebration Card */}
      <motion.div
        initial={false}
        animate={
          unlocked
            ? { clipPath: "circle(145% at 80% 26%)", opacity: 1 }
            : { clipPath: "circle(0% at 80% 26%)", opacity: 0 }
        }
        transition={{ duration: prefersReduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center px-4 @2xl:px-10"
        style={{
          pointerEvents: unlocked ? "auto" : "none",
          background: "radial-gradient(circle at 50% 20%, #182947 0%, #091322 100%)",
        }}
      >
        <div className="w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl">
          <GateRevealedCard
            guestName={guestName}
            headline={headline}
            eyebrow="Written In The Stars"
            primary={primary}
            gold={gold}
            surface="starlight"
            keepsake={
              <span
                className="grid h-14 w-14 @2xl:h-20 @2xl:w-20 place-items-center rounded-full border bg-white/10"
                style={{ borderColor: gold }}
              >
                <Sparkles size={22} className="@2xl:scale-125" style={{ color: gold }} />
              </span>
            }
            revealed={unlocked}
            delay={0.2}
          />
        </div>
      </motion.div>

      {/* Interactive Constellation Sky */}
      <motion.div
        initial={false}
        animate={{ opacity: unlocked ? 0 : 1, scale: unlocked ? 1.06 : 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-20 flex w-full max-w-sm @2xl:max-w-xl flex-col items-center"
        style={{ pointerEvents: unlocked ? "none" : "auto" }}
      >
        <div
          className="rounded-full border bg-white/5 px-4 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFF3D6]"
          style={{ borderColor: `${gold}66` }}
        >
          For · {guestName} · Star {connectedCount} of {STARS.length}
        </div>

        <div
          ref={skyRef}
          onPointerDown={(e) => {
            if (unlocked) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrawing(true);
            const pt = toSkyPct(e.clientX, e.clientY);
            if (pt) {
              rawX.set(pt.x);
              rawY.set(pt.y);
              checkNextStar(pt.x, pt.y);
            }
          }}
          onPointerMove={(e) => {
            if (!drawing || unlocked) return;
            const pt = toSkyPct(e.clientX, e.clientY);
            if (pt) {
              rawX.set(pt.x);
              rawY.set(pt.y);
              checkNextStar(pt.x, pt.y);
            }
          }}
          onPointerUp={() => {
            setDrawing(false);
            rawX.set(lastStar.x);
            rawY.set(lastStar.y);
          }}
          onPointerCancel={() => {
            setDrawing(false);
            rawX.set(lastStar.x);
            rawY.set(lastStar.y);
          }}
          className="relative mt-4 h-72 @2xl:h-80 w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0A1628]/80 shadow-2xl"
          style={{ touchAction: "none" }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            {/* Completed constellation lines draw smoothly with pathLength */}
            {STARS.slice(0, Math.max(0, connectedCount - 1)).map((s, idx) => {
              const next = STARS[idx + 1];
              return (
                <motion.line
                  key={s.id}
                  x1={s.x}
                  y1={s.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={gold}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={prefersReduced ? false : { pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: prefersReduced ? 0.1 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}

            {connectedCount < STARS.length && (
              <line
                x1={lastStar.x}
                y1={lastStar.y}
                x2={STARS[connectedCount].x}
                y2={STARS[connectedCount].y}
                stroke="rgba(255,255,255,0.22)"
                strokeDasharray="2 2.5"
                strokeWidth="0.7"
              />
            )}

            <AnimatePresence>
              {drawing && connectedCount < STARS.length && (
                <motion.line
                  key="live-beam"
                  x1={lastStar.x}
                  y1={lastStar.y}
                  x2={smoothX}
                  y2={smoothY}
                  stroke={gold}
                  strokeWidth="1.05"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                />
              )}
            </AnimatePresence>
          </svg>

          {STARS.map((s, idx) => {
            const lit = idx < connectedCount;
            const isNext = idx === connectedCount;
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={unlocked ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx === connectedCount) {
                    const next = connectedCount + 1;
                    setConnectedCount(next);
                    if (next >= STARS.length) finishUnlock();
                  }
                }}
                aria-label={`Star ${idx + 1}: ${s.label}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
              >
                <motion.span
                  animate={
                    isNext && !prefersReduced
                      ? { scale: [1, 1.32, 1], opacity: [0.75, 1, 0.75] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="grid h-9 w-9 place-items-center rounded-full border transition-colors duration-300"
                  style={{
                    borderColor: lit || isNext ? gold : "rgba(255,255,255,0.25)",
                    background: lit ? gold : "rgba(15,28,50,0.9)",
                    color: lit ? "#091322" : gold,
                  }}
                >
                  <Star size={14} fill={lit ? "#091322" : "none"} />
                </motion.span>
                <span className="font-ui mt-1 block whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-white/75">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={finishUnlock}
          tabIndex={unlocked ? -1 : 0}
          className="font-ui mt-4 rounded-full bg-[#D9A441] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#091322] shadow-lg transition hover:bg-white"
        >
          {cta}
        </button>
      </motion.div>
    </div>
  );
}

const ConstellationGate = memo(ConstellationGateComponent);
export default ConstellationGate;
