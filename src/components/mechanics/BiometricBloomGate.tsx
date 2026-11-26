"use client";
import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fingerprint, Heart } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface BiometricBloomGateProps {
  groom?: string;
  bride?: string;
  monogram?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

const HOLD_DURATION_MS = 1150;
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Hold-Together Heartbeat Lock with silky AnimatePresence sonar ripples,
 * elastic crest convergence, smooth early-release feedback crossfade,
 * and wide desktop radial sunburst reveal.
 */
function BiometricBloomGateComponent({
  groom,
  bride,
  monogram,
  guestName,
  primary = "#8B1E24",
  gold = "#D4AF37",
  tapLabel,
  onOpen,
}: BiometricBloomGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [releasedEarly, setReleasedEarly] = useState(false);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const displayMonogram =
    monogram ||
    [groom?.trim()?.[0], bride?.trim()?.[0]].filter(Boolean).join(" · ") ||
    "∞";
  const cta = tapLabel ?? "Press & hold seal for 1s to unlock";

  const completeUnlock = () => {
    cancelAnimationFrame(rafRef.current);
    setHolding(false);
    setProgress(1);
    setUnlocked(true);
    setReleasedEarly(false);
    onOpen?.();

    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // @ts-expect-error canvas-confetti ships without bundled TypeScript declarations
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 55,
          spread: 74,
          origin: { y: 0.55 },
          colors: [gold, primary, "#F6E27A", "#FFFDF6"],
        });
      });
    }
  };

  useEffect(() => {
    if (!holding || unlocked) return;
    startTimeRef.current = performance.now() - progress * HOLD_DURATION_MS;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const next = Math.min(1, elapsed / HOLD_DURATION_MS);
      setProgress(next);
      if (next >= 1) {
        completeUnlock();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holding, unlocked]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const beginHold = () => {
    if (unlocked) return;
    if (prefersReduced) {
      completeUnlock();
      return;
    }
    setReleasedEarly(false);
    setHolding(true);
  };

  const endHold = () => {
    if (!holding || unlocked) return;
    setHolding(false);
    cancelAnimationFrame(rafRef.current);
    if (progress < 1) {
      setReleasedEarly(true);
      setProgress(0);
    }
  };

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  const convergence = (1 - progress) * 18;

  return (
    <div
      className="relative flex h-full min-h-[min(580px,82dvh)] @2xl:min-h-[620px] w-full flex-col items-center justify-center overflow-hidden px-4 py-8 @2xl:px-10"
      style={{
        background: `radial-gradient(circle at 50% 42%, ${gold}22 0%, transparent 62%), #FDF8EF`,
      }}
    >
      {/* Revealed Invitation via Radial Sunburst Iris */}
      <motion.div
        initial={false}
        animate={
          unlocked
            ? { clipPath: "circle(145% at 50% 48%)", opacity: 1 }
            : { clipPath: "circle(0% at 50% 48%)", opacity: 0 }
        }
        transition={{ duration: prefersReduced ? 0.2 : 0.88, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center px-4 @2xl:px-10"
        style={{ pointerEvents: unlocked ? "auto" : "none", background: "#FDF8EF" }}
      >
        <div className="w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl">
          <GateRevealedCard
            guestName={guestName}
            headline={headline}
            eyebrow="Sealed With A Heartbeat"
            primary={primary}
            gold={gold}
            keepsake={
              <motion.span
                initial={false}
                animate={unlocked && !prefersReduced ? { scale: [0.7, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="grid h-14 w-14 @2xl:h-20 @2xl:w-20 place-items-center rounded-full border-2 shadow-sm"
                style={{ borderColor: gold, background: `${primary}14`, color: primary }}
              >
                <Heart size={22} className="@2xl:scale-125" fill={primary} />
              </motion.span>
            }
            revealed={unlocked}
            delay={0.18}
          />
        </div>
      </motion.div>

      {/* Biometric Heartbeat Hold Lock Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: unlocked ? 0 : 1, scale: unlocked ? 1.08 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 flex flex-col items-center text-center"
        style={{ pointerEvents: unlocked ? "none" : "auto" }}
      >
        <div
          className="rounded-full border bg-white/80 px-4 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.26em] text-[#6E655F]"
          style={{ borderColor: `${gold}66` }}
        >
          Private Keepsake · {guestName}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 font-display text-2xl sm:text-3xl font-bold" style={{ color: primary }}>
          <span
            style={{
              transform: `translate3d(-${convergence}px, 0, 0)`,
              transition: holding ? "none" : "transform 350ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {groom || "Bride"}
          </span>
          <span className="font-script mx-1.5 text-3xl sm:text-4xl" style={{ color: gold }}>
            &amp;
          </span>
          <span
            style={{
              transform: `translate3d(${convergence}px, 0, 0)`,
              transition: holding ? "none" : "transform 350ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {bride || "Groom"}
          </span>
        </div>

        <button
          type="button"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            beginHold();
          }}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              beginHold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") endHold();
          }}
          aria-label={cta}
          tabIndex={unlocked ? -1 : 0}
          className="relative mt-6 grid h-36 w-36 select-none place-items-center rounded-full outline-none"
          style={{ touchAction: "none" }}
        >
          <AnimatePresence>
            {holding && !prefersReduced && (
              <motion.span
                key="sonar-ring"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ repeat: Infinity, duration: 0.78, ease: "easeOut" }}
                className="pointer-events-none absolute inset-2 rounded-full border-2"
                style={{ borderColor: gold }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          <svg viewBox="0 0 128 128" className="h-36 w-36 -rotate-90" aria-hidden="true">
            <circle cx="64" cy="64" r={RING_RADIUS} stroke={`${gold}33`} strokeWidth="5" fill="none" />
            <circle
              cx="64"
              cy="64"
              r={RING_RADIUS}
              stroke={gold}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <motion.span
            animate={holding ? { scale: 0.94 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute grid h-24 w-24 place-items-center rounded-full border-2 text-white shadow-2xl"
            style={{
              borderColor: gold,
              background: `radial-gradient(circle at 30% 30%, ${primary}, #1E090C)`,
            }}
          >
            <Fingerprint size={34} style={{ color: gold }} />
            <span className="font-ui text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#FFF8E7" }}>
              {holding ? `${Math.round(progress * 100)}%` : displayMonogram}
            </span>
          </motion.span>
        </button>

        <div className="mt-5 min-h-[38px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={releasedEarly ? "early" : "prompt"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-ui rounded-full bg-[#161412] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg"
            >
              {releasedEarly ? "Hold continuously until ring completes" : cta}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const BiometricBloomGate = memo(BiometricBloomGateComponent);
export default BiometricBloomGate;
