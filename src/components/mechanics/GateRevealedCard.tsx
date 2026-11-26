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
 * Shared couture invitation card rendered smoothly inside unlocked entry gates
 * so the gate choreography transitions into an integrated keepsake reveal.
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
  const isDark = surface !== "light";

  const surfaceStyles =
    surface === "starlight"
      ? {
          background:
            "radial-gradient(circle at 50% 0%, rgba(217,164,65,0.18), transparent 62%), linear-gradient(175deg, #0D1829 0%, #15233B 100%)",
          borderColor: `${gold}66`,
          color: "#F8F4EA",
        }
      : surface === "warm-dark"
      ? {
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,200,90,0.22), transparent 60%), linear-gradient(175deg, #FFFDF8 0%, #FFF5E4 100%)",
          borderColor: `${gold}77`,
          color: "#2A1215",
        }
      : {
          background:
            `radial-gradient(circle at 50% 0%, ${gold}18, transparent 58%), linear-gradient(175deg, #FFFFFF 0%, #FAF5EC 100%)`,
          borderColor: `${gold}66`,
          color: "#161412",
        };

  return (
    <motion.div
      initial={false}
      animate={
        revealed
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: prefersReduced ? 0 : 18, scale: prefersReduced ? 1 : 0.96 }
      }
      transition={{
        duration: prefersReduced ? 0.15 : 0.65,
        delay: prefersReduced || !revealed ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] border-2 px-6 py-8 text-center shadow-[0_32px_70px_-24px_rgba(22,20,18,0.42)]"
      style={{
        ...surfaceStyles,
        willChange: "transform, opacity",
        pointerEvents: revealed ? "auto" : "none",
      }}
      aria-hidden={!revealed}
    >
      {/* Inner gilded hairline frame */}
      <div
        className="pointer-events-none absolute inset-2.5 rounded-[1.5rem] border"
        style={{ borderColor: `${gold}44` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        {keepsake && <div className="mb-3">{keepsake}</div>}

        <p
          className={`font-ui text-[10px] font-bold uppercase tracking-[0.3em] ${
            isDark && surface === "starlight" ? "text-white/70" : "text-[#6E655F]"
          }`}
        >
          {eyebrow}
        </p>

        <p className="font-script mt-1 text-4xl leading-none" style={{ color: gold }}>
          {guestName}
        </p>

        <div
          className="mx-auto my-3 h-px w-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
          }}
          aria-hidden="true"
        />

        <h2
          className="font-display text-4xl font-bold leading-[1.06] sm:text-[2.65rem]"
          style={{ color: surface === "starlight" ? "#FFF7E6" : primary }}
        >
          {headline}
        </h2>

        <p
          className={`font-editorial mt-3 text-lg italic leading-relaxed ${
            surface === "starlight" ? "text-white/80" : "text-[#161412]/80"
          }`}
        >
          {subline}
        </p>

        {badgeText && (
          <p
            className="font-ui mt-4 inline-block rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              borderColor: `${gold}66`,
              color: surface === "starlight" ? gold : primary,
            }}
          >
            {badgeText}
          </p>
        )}

        <motion.p
          animate={prefersReduced || !revealed ? undefined : { y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
          className={`font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] ${
            surface === "starlight" ? "text-white/60" : "text-[#6E655F]"
          }`}
        >
          Scroll ↓
        </motion.p>
      </div>
    </motion.div>
  );
}

const GateRevealedCard = memo(GateRevealedCardComponent);
export default GateRevealedCard;
