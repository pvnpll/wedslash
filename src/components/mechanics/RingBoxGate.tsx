"use client";
import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gem, Hand } from "lucide-react";

export interface RingBoxGateProps {
  groom?: string;
  bride?: string;
  monogram?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

function RingBoxGateComponent({
  groom,
  bride,
  monogram,
  guestName,
  primary = "#3B2F2F",
  gold = "#C9A227",
  tapLabel,
  onOpen,
}: RingBoxGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<"closed" | "animating" | "open">("closed");

  useEffect(() => {
    if (stage !== "animating") return;
    const t = window.setTimeout(() => setStage("open"), prefersReduced ? 40 : 1100);
    return () => window.clearTimeout(t);
  }, [stage, prefersReduced]);

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage(prefersReduced ? "open" : "animating");
    onOpen?.();
  };

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const lidMonogram =
    monogram?.trim() ||
    [groom?.trim()?.[0], bride?.trim()?.[0]].filter(Boolean).join(" · ") ||
    "∞";
  const cta = tapLabel ?? "Tap the ring box to open";
  const isOpen = stage === "open";
  const isAnimating = stage === "animating";

  return (
    <div
      className="relative flex h-full min-h-[580px] w-full flex-col items-center justify-center overflow-hidden px-6 py-10"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${primary}22 0%, transparent 60%), linear-gradient(180deg, #FAF3E3 0%, #F3E7CF 100%)`,
        perspective: 1200,
      }}
    >
      {(isAnimating || isOpen) && (
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 36, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.7, delay: isAnimating ? 0.35 : 0 }}
          className="z-10 w-full max-w-sm rounded-3xl border bg-white/95 px-6 py-9 text-center shadow-2xl"
          style={{ borderColor: `${gold}66` }}
        >
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#6E655F]">
            She said yes · He said always
          </p>
          <p className="font-script mt-1 text-4xl" style={{ color: gold }}>
            {guestName}
          </p>
          <div
            className="mx-auto my-3 h-px w-16"
            style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
          />
          <h2 className="font-display text-4xl font-bold leading-tight" style={{ color: primary }}>
            {headline}
          </h2>
          <p className="font-editorial mt-3 text-lg italic text-[#161412]/80">
            are engaged — and you are on the guest list.
          </p>
          <motion.p
            animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6E655F]"
          >
            Scroll ↓
          </motion.p>
        </motion.div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label={cta}
          className={`${isAnimating ? "pointer-events-none absolute inset-0 m-auto" : "relative"} z-20 flex flex-col items-center outline-none`}
        >
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            {/* Glow burst when lid lifts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={isAnimating || isOpen ? { opacity: [0, 0.9, 0.25], scale: [0.4, 1.6, 1.2] } : {}}
              transition={{ duration: prefersReduced ? 0 : 1.0 }}
              className="absolute left-1/2 top-6 -z-0 h-40 w-40 -translate-x-1/2 rounded-full"
              style={{ background: `radial-gradient(circle, ${gold}AA 0%, transparent 70%)` }}
              aria-hidden
            />
            {/* Ring floating above box */}
            <motion.div
              initial={{ y: 46, opacity: 0, scale: 0.6, rotate: -14 }}
              animate={
                isAnimating || isOpen
                  ? { y: -34, opacity: 1, scale: 1, rotate: 0 }
                  : { y: 46, opacity: 0, scale: 0.6, rotate: -14 }
              }
              transition={{ duration: prefersReduced ? 0 : 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
              aria-hidden
            >
              <div className="relative grid h-20 w-20 place-items-center">
                <div
                  className="absolute inset-x-4 bottom-1 h-12 rounded-b-full border-4 border-t-0"
                  style={{ borderColor: gold }}
                />
                <Gem size={30} style={{ color: gold }} className="relative -mt-3 drop-shadow-lg" />
                <div className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.9)]" />
              </div>
            </motion.div>

            {/* Lid */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isAnimating || isOpen ? { rotateX: -108 } : { rotateX: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 mx-auto h-16 w-56 origin-top rounded-t-2xl border-b-0 shadow-xl"
              style={{
                transformStyle: "preserve-3d",
                background: `linear-gradient(180deg, ${primary}, #241D1D)`,
                border: `1px solid ${gold}66`,
              }}
            >
              <div
                className="absolute inset-x-8 top-2.5 h-2 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
              />
              <p className="pt-6 text-center font-ui text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: gold }}>
                {lidMonogram}
              </p>
            </motion.div>
            {/* Box base */}
            <div
              className="relative z-10 mx-auto -mt-0.5 w-60 rounded-b-2xl px-5 pb-6 pt-4 text-center shadow-2xl"
              style={{ background: `linear-gradient(180deg, ${primary}EE, #1D1515)`, border: `1px solid ${gold}55` }}
            >
              <div
                className="mx-auto inline-block rounded-full border px-3.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FFF6E3]"
                style={{ borderColor: `${gold}55` }}
              >
                For · {guestName}
              </div>
              <p className="font-display mt-2 text-xl font-bold text-white">{headline}</p>
            </div>
          </div>
          <span className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
            <Hand size={15} /> {cta}
          </span>
        </button>
      )}
    </div>
  );
}

const RingBoxGate = memo(RingBoxGateComponent);
export default RingBoxGate;
