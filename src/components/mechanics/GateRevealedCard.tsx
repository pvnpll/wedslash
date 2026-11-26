"use client";
import { memo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GateRevealedCardProps {
  guestName: string;
  headline: string;
  eyebrow?: string;
  subline?: string;
  badgeText?: string;
  primary: string;
  gold: string;
  surface?: "light" | "warm-dark" | "starlight";
  keepsake?: ReactNode;
  revealed: boolean;
  delay?: number;
}

/**
 * Container-responsive couture invitation card rendered smoothly inside
 * unlocked entry gates: fits compact mobile frames edge-to-edge while
 * expanding into a wide editorial keepsake spread inside desktop containers.
 */
function GateRevealedCardComponent({
  guestName,
  headline,
  eyebrow = "Cordially Welcoming",
  subline = "joyfully invite you to share in our celebration.",
  badgeText,
  primary,
  gold,
  surface = "light",
  keepsake,
  revealed,
  delay = 0,
}: GateRevealedCardProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const isStarlight = surface === "starlight";

  const surfaceStyles =
    surface === "starlight"
      ? {
          background:
            "radial-gradient(circle at 50% 0%, rgba(217,164,65,0.22), transparent 62%), linear-gradient(175deg, #0D1829 0%, #15233B 100%)",
          borderColor: `${gold}66`,
          color: "#F8F4EA",
        }
      : surface === "warm-dark"
      ? {
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,200,90,0.24), transparent 60%), linear-gradient(175deg, #FFFDF8 0%, #FFF5E4 100%)",
          borderColor: `${gold}77`,
          color: "#2A1215",
        }
      : {
          background: `radial-gradient(circle at 50% 0%, ${gold}1E, transparent 58%), linear-gradient(175deg, #FFFFFF 0%, #FAF5EC 100%)`,
          borderColor: `${gold}66`,
          color: "#161412",
        };

  return (
    <motion.div
      initial={false}
      animate={
        revealed
          ? { opacity: 1, y: 0, scale: 1 }
          : {
              opacity: 0,
              y: prefersReduced ? 0 : 20,
              scale: prefersReduced ? 1 : 0.96,
            }
      }
      transition={{
        type: prefersReduced ? "tween" : "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.9,
        duration: prefersReduced ? 0.16 : undefined,
        delay: prefersReduced || !revealed ? 0 : delay,
      }}
      className="relative z-10 mx-auto w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl overflow-hidden rounded-[2rem] border-2 px-5 py-7 text-center shadow-[0_36px_80px_-24px_rgba(22,20,18,0.42)] @2xl:px-10 @2xl:py-11"
      style={{
        ...surfaceStyles,
        willChange: "transform, opacity",
        pointerEvents: revealed ? "auto" : "none",
      }}
      aria-hidden={!revealed}
    >
      {/* Inner gilded hairline frame */}
      <div
        className="pointer-events-none absolute inset-2.5 rounded-[1.5rem] border @2xl:inset-3.5"
        style={{ borderColor: `${gold}44` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center @2xl:grid @2xl:grid-cols-[auto_1fr] @2xl:items-center @2xl:gap-8 @2xl:text-left">
        {keepsake ? (
          <div className="mb-3 flex shrink-0 items-center justify-center @2xl:mb-0 @2xl:pl-2">
            {keepsake}
          </div>
        ) : (
          <div className="hidden" aria-hidden="true" />
        )}

        <div className={keepsake ? "flex flex-col items-center @2xl:items-start" : "col-span-full flex flex-col items-center @2xl:text-center"}>
          <p
            className={`font-ui text-[10px] font-bold uppercase tracking-[0.3em] ${
              isStarlight ? "text-white/70" : "text-[#6E655F]"
            }`}
          >
            {eyebrow}
          </p>

          <p
            className="font-script mt-1 text-4xl leading-none @2xl:text-5xl"
            style={{ color: gold }}
          >
            {guestName}
          </p>

          <div
            className={`my-3 h-px w-20 @2xl:w-28 ${keepsake ? "@2xl:mx-0" : "mx-auto"}`}
            style={{
              background: `linear-gradient(90deg, ${keepsake ? gold : "transparent"}, ${gold}, transparent)`,
            }}
            aria-hidden="true"
          />

          <h2
            className="font-display break-words text-3xl font-bold leading-[1.06] sm:text-4xl @2xl:text-5xl"
            style={{ color: isStarlight ? "#FFF7E6" : primary }}
          >
            {headline}
          </h2>

          <p
            className={`font-editorial mt-3 max-w-xl text-base italic leading-relaxed sm:text-lg @2xl:text-xl ${
              isStarlight ? "text-white/80" : "text-[#161412]/80"
            }`}
          >
            {subline}
          </p>

          {badgeText && (
            <p
              className="font-ui mt-4 inline-block rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{
                borderColor: `${gold}66`,
                color: isStarlight ? gold : primary,
              }}
            >
              {badgeText}
            </p>
          )}

          <motion.p
            animate={prefersReduced || !revealed ? undefined : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
            className={`font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] ${
              isStarlight ? "text-white/60" : "text-[#6E655F]"
            }`}
          >
            Scroll ↓
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

const GateRevealedCard = memo(GateRevealedCardComponent);
export default GateRevealedCard;
