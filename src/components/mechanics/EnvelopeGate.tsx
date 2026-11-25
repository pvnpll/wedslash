"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Hand } from "lucide-react";

export interface EnvelopeGateProps {
  variant?: "wax-envelope" | "palace-doors" | "curtain-reveal";
  groom?: string;
  bride?: string;
  monogram?: string;
  venueTitle?: string;
  city?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

export default function EnvelopeGate({
  variant = "wax-envelope",
  groom,
  bride,
  monogram,
  venueTitle,
  city,
  guestName,
  primary = "#0E6B5E",
  gold = "#C9A227",
  tapLabel,
  onOpen,
}: EnvelopeGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<"closed" | "animating" | "open">("closed");

  useEffect(() => {
    if (stage !== "animating") return;
    const timer = window.setTimeout(
      () => setStage("open"),
      prefersReduced ? 40 : 950
    );
    return () => window.clearTimeout(timer);
  }, [stage, prefersReduced]);

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage(prefersReduced ? "open" : "animating");
    onOpen?.();
  };

  const displayMonogram =
    monogram ||
    (groom && bride
      ? `${groom.trim().charAt(0)} · ${bride.trim().charAt(0)}`
      : "✦");

  const coupleHeadline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";

  const locationLine =
    venueTitle && city
      ? `celebrating at ${venueTitle}, ${city} — and you are on the guest list.`
      : venueTitle
      ? `celebrating at ${venueTitle} — and you are on the guest list.`
      : city
      ? `celebrating in ${city} — and you are on the guest list.`
      : "joyfully invite you to share in our celebration.";

  const defaultTapLabel =
    variant === "palace-doors"
      ? "Tap to open the palace doors"
      : variant === "curtain-reveal"
      ? "Tap to part the curtains"
      : "Tap the seal to open";
  const ctaText = tapLabel ?? defaultTapLabel;

  const isAnimating = stage === "animating";
  const isOpen = stage === "open";

  return (
    <div
      className="relative flex h-full min-h-[580px] w-full flex-col items-center justify-center overflow-hidden bg-[#FDF8EF] paper-grain px-6 py-10"
      style={{ perspective: 1300 }}
    >
      {/* Revealed Invitation Card */}
      {(isAnimating || isOpen) && (
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 36, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.75, delay: isAnimating ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 w-full max-w-sm rounded-3xl border bg-white/95 px-6 py-9 text-center shadow-2xl"
          style={{ borderColor: `${gold}66` }}
        >
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[#6E655F]">
            Cordially Welcoming
          </p>
          <p className="font-script mt-1 text-4xl" style={{ color: gold }}>
            {guestName}
          </p>
          <div
            className="mx-auto my-3 h-px w-16"
            style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
          />
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl" style={{ color: primary }}>
            {coupleHeadline}
          </h2>
          <p className="font-editorial mt-3 text-lg italic leading-relaxed text-[#161412]/80">
            {locationLine}
          </p>
          {(venueTitle || city) && (
            <p
              className="font-ui mt-4 inline-block rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ borderColor: `${gold}66`, color: primary }}
            >
              {[venueTitle, city].filter(Boolean).join(" · ")}
            </p>
          )}
          <motion.p
            animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6E655F]"
          >
            Scroll ↓
          </motion.p>
        </motion.div>
      )}

      {/* Closed / Animating Entry Gates */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className={`${isAnimating ? "pointer-events-none absolute inset-0 m-auto" : "relative"} z-20 flex flex-col items-center justify-center outline-none`}
          aria-label={ctaText}
        >
          {variant === "wax-envelope" && (
            <motion.div
              whileHover={!isAnimating && !prefersReduced ? { scale: 1.03 } : undefined}
              whileTap={!isAnimating && !prefersReduced ? { scale: 0.98 } : undefined}
              className="relative w-72 sm:w-80"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Inner letter peeking when flap lifts */}
              <motion.div
                initial={{ y: 0, opacity: 0.9 }}
                animate={isAnimating ? { y: -28, opacity: 1 } : { y: 0, opacity: 0.9 }}
                transition={{ duration: 0.65, delay: 0.25 }}
                className="absolute inset-x-4 top-5 z-10 h-24 rounded-t-xl border bg-white/95 p-3 text-center shadow-sm"
                style={{ borderColor: `${gold}55` }}
              >
                <p className="font-script text-2xl" style={{ color: primary }}>
                  {coupleHeadline}
                </p>
              </motion.div>

              {/* Top Flap (rotateX 180deg on crack) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={isAnimating ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.72, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-0 z-20 h-36 origin-top shadow-md"
                style={{
                  transformStyle: "preserve-3d",
                  background: `linear-gradient(180deg, ${primary}, ${primary}DD)`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />

              {/* Envelope body */}
              <div className="relative z-10 rounded-2xl border border-black/10 bg-[#FFFDF6] px-6 pb-8 pt-40 text-center shadow-2xl">
                <div
                  className="mx-auto inline-block rounded-full border px-3.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6E655F]"
                  style={{ borderColor: `${gold}55` }}
                >
                  Invitation For
                </div>
                <p className="font-display mt-2 text-2xl font-bold text-[#161412]">{guestName}</p>
                <p className="font-ui mt-1.5 text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">
                  {ctaText}
                </p>
              </div>

              {/* Wax seal with crack animation */}
              <motion.div
                animate={
                  isAnimating
                    ? { scale: [1, 1.12, 0.92], opacity: [1, 1, 0] }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.45 }}
                className="absolute left-1/2 top-28 z-30 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full border-2 text-base font-bold text-white shadow-xl"
                style={{
                  borderColor: `${gold}99`,
                  background: `radial-gradient(circle at 35% 30%, ${gold}, ${primary})`,
                }}
              >
                <span className="font-display tracking-wider">{displayMonogram}</span>
                {isAnimating && (
                  <svg viewBox="0 0 64 64" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                    <motion.path
                      d="M32 6L28 24L36 36L29 58"
                      stroke="#FFFDF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.25 }}
                    />
                  </svg>
                )}
              </motion.div>
            </motion.div>
          )}

          {variant === "palace-doors" && (
            <div className="flex flex-col items-center">
              <div
                className="arch-frame relative h-80 w-72 overflow-hidden border-2 bg-[#1A0D0E] shadow-2xl sm:w-80"
                style={{ borderColor: gold }}
              >
                {/* Left Palace Door */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={isAnimating ? { x: "-100%" } : { x: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 w-1/2 border-r p-3"
                  style={{
                    borderColor: `${gold}AA`,
                    background: `linear-gradient(135deg, ${primary} 0%, #240A10 100%)`,
                  }}
                >
                  <div className="h-full w-full rounded-tl-full border p-2" style={{ borderColor: `${gold}66` }}>
                    <div className="h-full w-full rounded-tl-full border border-dashed" style={{ borderColor: `${gold}44` }} />
                  </div>
                </motion.div>

                {/* Right Palace Door */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={isAnimating ? { x: "100%" } : { x: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 right-0 w-1/2 border-l p-3"
                  style={{
                    borderColor: `${gold}AA`,
                    background: `linear-gradient(225deg, ${primary} 0%, #240A10 100%)`,
                  }}
                >
                  <div className="h-full w-full rounded-tr-full border p-2" style={{ borderColor: `${gold}66` }}>
                    <div className="h-full w-full rounded-tr-full border border-dashed" style={{ borderColor: `${gold}44` }} />
                  </div>
                </motion.div>

                {/* Center Brass Door Knocker & Guest Tag */}
                <motion.div
                  animate={isAnimating ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
                >
                  <div
                    className="grid h-16 w-16 place-items-center rounded-full border-2 bg-black/35 shadow-lg"
                    style={{ borderColor: gold, color: gold }}
                  >
                    <span className="font-display text-lg font-bold">{displayMonogram}</span>
                  </div>
                  <div
                    className="mt-4 rounded-full border bg-black/45 px-4 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFF8E7] backdrop-blur-sm"
                    style={{ borderColor: `${gold}88` }}
                  >
                    For · {guestName}
                  </div>
                </motion.div>
              </div>
              <span className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
                <Hand size={15} /> {ctaText}
              </span>
            </div>
          )}

          {variant === "curtain-reveal" && (
            <div className="flex flex-col items-center">
              <div
                className="relative h-80 w-72 overflow-hidden rounded-3xl border bg-[#1B1715] shadow-2xl sm:w-80"
                style={{ borderColor: `${gold}88` }}
              >
                {/* Left Pleated Drape */}
                <motion.div
                  initial={{ x: 0, scaleX: 1 }}
                  animate={isAnimating ? { x: "-100%", scaleX: 0.72 } : { x: 0, scaleX: 1 }}
                  transition={{ duration: prefersReduced ? 0 : 0.88, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 w-[52%] origin-left"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${primary} 0px, ${primary} 14px, #1B090D 22px, ${primary} 30px)`,
                  }}
                />

                {/* Right Pleated Drape */}
                <motion.div
                  initial={{ x: 0, scaleX: 1 }}
                  animate={isAnimating ? { x: "100%", scaleX: 0.72 } : { x: 0, scaleX: 1 }}
                  transition={{ duration: prefersReduced ? 0 : 0.88, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 right-0 w-[52%] origin-right"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${primary} 0px, #1B090D 10px, ${primary} 22px, ${primary} 30px)`,
                  }}
                />

                {/* Valance & Center Medallion */}
                <div
                  className="absolute inset-x-0 top-0 h-4 border-b"
                  style={{ background: gold, borderColor: "#FFFDF6" }}
                />
                <motion.div
                  animate={isAnimating ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
                >
                  <div
                    className="grid h-16 w-16 place-items-center rounded-full border-2 bg-black/40 backdrop-blur-sm"
                    style={{ borderColor: gold, color: gold }}
                  >
                    <span className="font-display text-lg font-bold">{displayMonogram}</span>
                  </div>
                  <p className="font-ui mt-4 rounded-full bg-black/45 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    For · {guestName}
                  </p>
                </motion.div>
              </div>
              <span className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
                <Hand size={15} /> {ctaText}
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
