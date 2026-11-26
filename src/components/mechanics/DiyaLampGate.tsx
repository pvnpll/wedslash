"use client";
import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Hand } from "lucide-react";

export interface DiyaLampGateProps {
  groom?: string;
  bride?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

function DiyaLampGateComponent({
  groom,
  bride,
  guestName,
  primary = "#9A3412",
  gold = "#B8860B",
  tapLabel,
  onOpen,
}: DiyaLampGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<"closed" | "animating" | "open">("closed");

  useEffect(() => {
    if (stage !== "animating") return;
    const t = window.setTimeout(() => setStage("open"), prefersReduced ? 40 : 1000);
    return () => window.clearTimeout(t);
  }, [stage, prefersReduced]);

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage(prefersReduced ? "open" : "animating");
    onOpen?.();
  };

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const cta = tapLabel ?? "Light the lamp to begin";
  const isOpen = stage === "open";
  const isAnimating = stage === "animating";
  const lit = isAnimating || isOpen;

  return (
    <div
      className="relative flex h-full min-h-[580px] w-full flex-col items-center justify-center overflow-hidden px-6 py-10"
      style={{
        background: lit
          ? "radial-gradient(circle at 50% 38%, rgba(255,196,80,0.35) 0%, transparent 55%), linear-gradient(180deg, #2A0E04 0%, #431407 60%, #1C0A02 100%)"
          : "linear-gradient(180deg, #170806 0%, #2A0E04 70%, #170806 100%)",
        transition: "background 900ms ease",
      }}
    >
      {(isAnimating || isOpen) && (
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.7, delay: isAnimating ? 0.4 : 0 }}
          className="z-10 w-full max-w-sm rounded-3xl border bg-[#FFF9EE]/95 px-6 py-9 text-center shadow-2xl"
          style={{ borderColor: `${gold}77` }}
        >
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#6E655F]">
            Subha Muhurtham · Cordially Welcoming
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
            with elders&apos; blessings invite you to the Muhurtham.
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
          <div className="relative flex flex-col items-center">
            {/* Halo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={lit ? { opacity: 0.9, scale: 1 } : { opacity: 0.15, scale: 0.7 }}
              transition={{ duration: prefersReduced ? 0 : 0.9 }}
              className="absolute -top-10 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,200,90,0.55) 0%, transparent 70%)" }}
              aria-hidden
            />
            {/* Flame */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0.35 }}
              animate={lit ? { scale: [1, 1.12, 1], opacity: 1 } : { scale: 0.4, opacity: 0.35 }}
              transition={lit && !prefersReduced ? { repeat: Infinity, duration: 1.4 } : { duration: 0.4 }}
              aria-hidden
            >
              <Flame size={54} className={lit ? "text-[#FFC94D]" : "text-white/25"} fill={lit ? "#FF9D2E" : "transparent"} />
            </motion.div>
            {/* Wick + oil bowl */}
            <div className="mt-1 h-3 w-1.5 rounded-full bg-[#3A1C07]" aria-hidden />
            <div
              className="mt-0 grid h-20 w-52 place-items-center rounded-b-full border-t-4 shadow-2xl"
              style={{
                background: "linear-gradient(180deg, #7C2D12, #431407)",
                borderColor: gold,
              }}
              aria-hidden
            >
              <div className="flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: gold, opacity: 0.65 + (i % 3) * 0.15 }} />
                ))}
              </div>
            </div>
            <div
              className="mt-2 rounded-full border px-4 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFF3D6]"
              style={{ borderColor: `${gold}88`, background: "rgba(0,0,0,0.35)" }}
            >
              For · {guestName}
            </div>
          </div>
          <span className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#FFC94D] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#431407] shadow-lg">
            <Hand size={15} /> {cta}
          </span>
        </button>
      )}
    </div>
  );
}

const DiyaLampGate = memo(DiyaLampGateComponent);
export default DiyaLampGate;
