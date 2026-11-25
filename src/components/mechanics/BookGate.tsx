"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Hand } from "lucide-react";
import ParticleCanvas from "../ParticleCanvas";
import { CulturalEmblem } from "../icons/CulturalEmblems";
import type { SacredSymbol } from "@/lib/types";

export interface BookGateProps {
  groom: string;
  bride: string;
  groomParents?: string;
  brideParents?: string;
  guestName: string;
  sacredQuote?: string;
  inviteIntro?: string;
  symbol?: SacredSymbol;
  primary?: string;
  gold?: string;
  compact?: boolean;
  tapLabel?: string;
  heroPhotoUrl?: string;
  kenBurnsEnabled?: boolean;
  onOpen?: () => void;
}

const SYMBOL_DEFAULT_QUOTE: Record<SacredSymbol, string> = {
  ganesh: "Shree Ganeshaya Namah",
  om: "Om Shanti · Shubh Vivah",
  "ik-onkar": "Ik Onkar Satnam",
  bismillah: "With Blessings & Grace",
  cross: "Joined in Love & Faith",
  "floral-crest": "A Celebration of Love",
  passport: "Cleared for Celebration",
  crown: "Royal Celebration",
  none: "",
};

function BlurInText({
  text,
  delay = 0,
  reduced,
  className = "",
  style,
}: {
  text: string;
  delay?: number;
  reduced: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const chars = Array.from(text);
  return (
    <span className={className} style={style} aria-label={text}>
      {chars.map((char, idx) =>
        reduced ? (
          <span key={`${idx}-${char}`}>{char === " " ? "\u00A0" : char}</span>
        ) : (
          <motion.span
            key={`${idx}-${char}`}
            aria-hidden="true"
            initial={{ opacity: 0.25, filter: "blur(4px)", y: 3 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.26,
              delay: delay * 0.4 + idx * 0.025,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        )
      )}
    </span>
  );
}

export default function BookGate({
  groom,
  bride,
  groomParents,
  brideParents,
  guestName,
  sacredQuote,
  inviteIntro = "Together with their families",
  symbol = "ganesh",
  primary = "#6E1F2F",
  gold = "#D4AF37",
  compact = false,
  tapLabel = "Tap the book to open",
  heroPhotoUrl,
  kenBurnsEnabled = true,
  onOpen,
}: BookGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = window.setTimeout(
      () => setPhase("open"),
      prefersReduced ? 50 : 920
    );
    return () => window.clearTimeout(timer);
  }, [phase, prefersReduced]);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase(prefersReduced ? "open" : "opening");
    onOpen?.();
  };

  const resolvedQuote = sacredQuote ?? SYMBOL_DEFAULT_QUOTE[symbol];
  const isOpened = phase === "open";
  const isSwinging = phase === "opening";

  return (
    <div
      className={`relative flex h-full min-h-[580px] w-full flex-col items-center justify-center overflow-hidden bg-[#FDF3EC] paper-grain ${
        compact ? "px-4 py-2" : "px-4 py-4"
      }`}
      style={{ perspective: 1400 }}
    >
      <ParticleCanvas type="marigold-petals" density={compact ? 18 : 28} />

      {/* Page 1 Arch Frame (scales in during cover hinge & rests when open) */}
      {(isSwinging || isOpened) && (
        <motion.div
          initial={prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full max-w-[360px] flex-col items-center justify-center"
        >
          <div
            className="arch-frame relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden border-2 px-6 py-8 text-center shadow-[0_30px_70px_-24px_rgba(22,20,18,0.32)]"
            style={{
              borderColor: `${gold}`,
              background: "#FFFDF8",
            }}
          >
            {/* Soft Ken Burns portrait or gradient + shimmer background */}
            {heroPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroPhotoUrl}
                alt=""
                aria-hidden="true"
                className={`${
                  kenBurnsEnabled && !prefersReduced ? "animate-kenburns" : ""
                } pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 blur-[2px]`}
              />
            ) : null}
            <div
              className={`${
                kenBurnsEnabled && !prefersReduced ? "animate-kenburns" : ""
              } pointer-events-none absolute inset-0 opacity-75`}
              style={{
                background: `radial-gradient(circle at 50% 24%, ${gold}2B 0%, transparent 54%), radial-gradient(circle at 20% 80%, ${primary}22 0%, transparent 55%), linear-gradient(170deg, #FFFDF8 0%, ${primary}12 52%, ${gold}1C 100%)`,
              }}
              aria-hidden="true"
            />
            <div
              className="foil-sheen pointer-events-none absolute inset-0 opacity-[0.07]"
              aria-hidden="true"
            />
            <div
              className="arch-frame pointer-events-none absolute inset-2.5 border"
              style={{ borderColor: `${gold}66` }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
              {symbol !== "none" && (
                <div
                  className="grid h-14 w-14 place-items-center rounded-full border-2 bg-white/90 shadow-sm"
                  style={{ borderColor: gold }}
                >
                  <CulturalEmblem symbol={symbol} color={primary} size={32} />
                </div>
              )}

              {resolvedQuote && (
                <p
                  className="font-ui mt-3 text-[10px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: primary }}
                >
                  {resolvedQuote}
                </p>
              )}

              <p className="font-ui mt-3 text-[10px] uppercase tracking-[0.28em] text-[#6E655F]">
                {inviteIntro}
              </p>

              <h2
                className={`font-display mt-3 font-bold leading-none ${compact ? "text-4xl" : "text-5xl"}`}
                style={{ color: primary }}
              >
                <BlurInText text={groom} delay={0.18} reduced={prefersReduced} />
              </h2>
              {groomParents && (
                <p className="font-ui mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#6E655F]">
                  {groomParents}
                </p>
              )}

              <p className="font-script my-1.5 text-4xl" style={{ color: gold }}>
                &amp;
              </p>

              <h2
                className={`font-display font-bold leading-none ${compact ? "text-4xl" : "text-5xl"}`}
                style={{ color: primary }}
              >
                <BlurInText text={bride} delay={0.5} reduced={prefersReduced} />
              </h2>
              {brideParents && (
                <p className="font-ui mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#6E655F]">
                  {brideParents}
                </p>
              )}

              <div
                className="my-4 h-px w-20"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
                }}
              />

              <p className="font-editorial text-lg italic text-[#161412]/80">
                joyfully invite <span className="font-semibold not-italic">{guestName}</span> to celebrate with them
              </p>

              <motion.span
                animate={prefersReduced ? undefined : { y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]"
              >
                Scroll ↓
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3D Hinged Velvet Cover */}
      {!isOpened && (
        <button
          type="button"
          onClick={handleOpen}
          className={`${isSwinging ? "pointer-events-none absolute inset-0 m-auto" : "relative"} z-20 flex flex-col items-center justify-center outline-none`}
          style={{ transformStyle: "preserve-3d" }}
          aria-label={tapLabel}
        >
          <motion.div
            initial={{ rotateY: 0, opacity: 1 }}
            animate={
              isSwinging
                ? { rotateY: -165, opacity: [1, 1, 0] }
                : { rotateY: 0, opacity: 1 }
            }
            whileHover={!isSwinging && !prefersReduced ? { rotateY: -8, scale: 1.02 } : undefined}
            transition={{
              rotateY: { duration: prefersReduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: prefersReduced ? 0 : 0.9, times: [0, 0.65, 1] },
              scale: { type: "spring", stiffness: 180, damping: 20 },
            }}
            className="relative aspect-[3/4.1] w-56 overflow-hidden rounded-r-xl rounded-l-[4px] shadow-[0_30px_60px_-15px_rgba(110,31,47,0.55)] sm:w-64"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              background: `linear-gradient(150deg, ${primary} 0%, #240910 72%, ${primary} 100%)`,
              border: `1.5px solid ${gold}`,
            }}
          >
            <div
              className="absolute inset-2.5 rounded-r-lg rounded-l-[2px] border"
              style={{ borderColor: `${gold}88` }}
            />
            <div className="absolute left-3.5 top-0 h-full w-[3px] bg-black/35" />
            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
              {symbol !== "none" && (
                <div
                  className="grid h-16 w-16 place-items-center rounded-full border-2 bg-black/20"
                  style={{ borderColor: gold }}
                >
                  <CulturalEmblem symbol={symbol} color={gold} size={compact ? 34 : 38} />
                </div>
              )}
              {resolvedQuote && (
                <p
                  className="font-ui mt-3.5 text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: gold }}
                >
                  {resolvedQuote}
                </p>
              )}
              <p className="font-display mt-3 text-3xl font-bold leading-tight text-[#FFF8E7]">
                {groom}{" "}
                <span className="font-script text-2xl" style={{ color: gold }}>
                  &amp;
                </span>{" "}
                {bride}
              </p>
              <p className="font-ui mt-2 text-[10px] uppercase tracking-[0.24em] text-[#FFF8E7]/70">
                Wedding Invitation
              </p>
              <div
                className="mt-4 rounded-full border px-4 py-1.5 font-ui text-[10px] uppercase tracking-[0.18em] text-[#FFF8E7]/90"
                style={{ borderColor: `${gold}66` }}
              >
                For · {guestName}
              </div>
            </div>
            {/* Spine shine */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/15 to-transparent" />
          </motion.div>

          {!isSwinging && (
            <motion.span
              animate={prefersReduced ? undefined : { y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg"
            >
              <Hand size={15} /> {tapLabel}
            </motion.span>
          )}
        </button>
      )}
    </div>
  );
}
