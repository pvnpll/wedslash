"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import Countdown from "../Countdown";

export interface PolaroidDevelopProps {
  groom: string;
  bride: string;
  dateLabel: string;
  venue: string;
  target: string;
  title: string;
  primary?: string;
  gold?: string;
  imageUrl?: string;
  compact?: boolean;
  onReveal?: () => void;
}

function PolaroidDevelopComponent({
  groom,
  bride,
  dateLabel,
  venue,
  target,
  title,
  primary = "#2E4057",
  gold = "#B8860B",
  imageUrl,
  compact = false,
  onReveal,
}: PolaroidDevelopProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState<"dark" | "developing" | "developed">("dark");
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (stage !== "developing") return;
    const flashTimer = window.setTimeout(() => setFlashActive(false), 400);
    const doneTimer = window.setTimeout(
      () => {
        setStage("developed");
        onReveal?.();
      },
      prefersReduced ? 60 : 1800
    );
    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(doneTimer);
    };
  }, [stage, prefersReduced, onReveal]);

  const handleDevelop = () => {
    if (stage !== "dark") return;
    if (!prefersReduced) setFlashActive(true);
    setStage("developing");
  };

  const isRevealing = stage === "developing" || stage === "developed";
  const isDeveloped = stage === "developed";
  const hasValidTarget = Boolean(target && !Number.isNaN(Date.parse(target)));

  return (
    <div className="mx-auto w-full max-w-sm @2xl:max-w-lg px-4 sm:px-5 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        ✦ Tap the Polaroid to develop ✦
      </p>

      <motion.button
        type="button"
        onClick={handleDevelop}
        animate={
          prefersReduced
            ? undefined
            : { rotate: isRevealing ? 0 : -2, scale: isRevealing ? 1 : 0.98 }
        }
        whileHover={stage === "dark" && !prefersReduced ? { rotate: 0, scale: 1.015 } : undefined}
        whileTap={stage === "dark" && !prefersReduced ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative mx-auto mt-5 block w-full max-w-[290px] @2xl:max-w-[340px] rounded-sm border border-black/10 bg-[#FAF8F2] p-3.5 pb-6 text-left shadow-[0_26px_55px_-18px_rgba(22,20,18,0.45)] outline-none"
        aria-label={isRevealing ? `${groom} and ${bride} Polaroid` : "Tap to develop Polaroid"}
      >
        {/* Subtle vintage masking tape */}
        <span
          className="pointer-events-none absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-1 bg-[#EAE0CC]/80 shadow-sm"
          aria-hidden="true"
        />

        {/* Photo Aperture — Pure GPU opacity & scale transition (no slow CSS filter blur) */}
        <div
          className={`relative overflow-hidden bg-[#1A1614] ${
            compact ? "h-52" : "h-60 @2xl:h-68"
          } w-full`}
        >
          <div
            className="h-full w-full"
            style={{
              opacity: isRevealing ? 1 : 0.16,
              transform: isRevealing ? "scale(1)" : "scale(1.04)",
              transition: prefersReduced
                ? "opacity 150ms ease"
                : "opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1), transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "opacity, transform",
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`${groom} & ${bride}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="relative flex h-full w-full flex-col items-center justify-center px-4 text-center"
                style={{
                  background: `radial-gradient(circle at 50% 25%, ${gold}38, transparent 60%), linear-gradient(155deg, ${primary} 0%, #161412 100%)`,
                }}
              >
                <div
                  className="arch-frame flex h-44 w-44 flex-col items-center justify-center border px-3 text-center"
                  style={{ borderColor: `${gold}99`, background: "rgba(255,253,246,0.06)" }}
                >
                  <p
                    className="font-script text-3xl"
                    style={{ color: gold }}
                  >
                    {groom.trim().charAt(0)} &amp; {bride.trim().charAt(0)}
                  </p>
                  <p className="font-display mt-1 text-2xl font-bold leading-tight text-[#FFFDF6]">
                    {groom}
                  </p>
                  <p className="font-script text-xl" style={{ color: gold }}>
                    &amp;
                  </p>
                  <p className="font-display text-2xl font-bold leading-tight text-[#FFFDF6]">
                    {bride}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Warm chemical film tint overlay that fades out on GPU */}
          <div
            className="pointer-events-none absolute inset-0 bg-[#3B2618]"
            style={{
              opacity: isRevealing ? 0 : 0.72,
              transition: prefersReduced
                ? "opacity 150ms ease"
                : "opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden="true"
          />

          {/* Camera shutter flash */}
          <AnimatePresence>
            {flashActive && (
              <motion.div
                key="polaroid-flash"
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 bg-white"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Tap prompt overlay when dark */}
          <AnimatePresence>
            {stage === "dark" && (
              <motion.div
                key="polaroid-prompt"
                initial={{ opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 text-white"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-black/60">
                  <Camera size={20} />
                </span>
                <span className="font-ui rounded-full bg-black/65 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Tap to develop
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Polaroid handwritten border */}
        <div className="mt-3.5 text-center">
          <p
            className="font-script text-2xl leading-tight transition-opacity duration-700"
            style={{ color: primary, opacity: isRevealing ? 1 : 0.35 }}
          >
            {isRevealing ? dateLabel : "Developing memory…"}
          </p>
          <p
            className="font-editorial mt-0.5 text-sm italic text-[#161412]/75 transition-opacity duration-700"
            style={{ opacity: isRevealing ? 1 : 0.25 }}
          >
            {venue}
          </p>
        </div>
      </motion.button>

      <div className="mt-4 min-h-[34px]">
        <AnimatePresence>
          {isDeveloped && (
            <motion.p
              key="polaroid-captured"
              initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="font-ui inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
              style={{ background: primary }}
            >
              <Sparkles size={13} /> Captured forever
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {hasValidTarget && (
        <div className="mt-5">
          <Countdown target={target} title={title} venue={venue} />
        </div>
      )}
    </div>
  );
}

const PolaroidDevelop = memo(PolaroidDevelopComponent);
export default PolaroidDevelop;
