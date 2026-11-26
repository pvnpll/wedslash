"use client";
import { motion, useReducedMotion } from "framer-motion";
import { memo, useRef, useState } from "react";
import { BookOpen, MoveLeft } from "lucide-react";
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
  om: "Om Shubhamastu",
  "ik-onkar": "Ik Onkar Satnam",
  bismillah: "Bismillah-ir-Rahman-ir-Rahim",
  cross: "Joined Together in Christ",
  "floral-crest": "Two Souls, One Forever",
  passport: "Cleared for Takeoff",
  crown: "Royally Invited",
  none: "",
};

function RevealWordSpan({
  text,
  delay,
  reduced,
  className,
  style,
}: {
  text: string;
  delay: number;
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
            initial={{ opacity: 0.2, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.24,
              delay: delay * 0.4 + idx * 0.02,
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

/**
 * 3D Velvet Hardcover Book Gate: supports live left-swipe cover peeling
 * (1:1 rotateY follow) or accessible tap, keeping the velvet spine edge
 * and ribbon bookmark integrated after opening with zero snap/unmount pop.
 */
function BookGateComponent({
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
  tapLabel = "Swipe left or tap to turn cover",
  heroPhotoUrl,
  kenBurnsEnabled = true,
  onOpen,
}: BookGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [opened, setOpened] = useState(false);
  const [dragAngle, setDragAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  const resolvedQuote = sacredQuote ?? SYMBOL_DEFAULT_QUOTE[symbol];

  const triggerOpen = () => {
    if (opened) return;
    draggingRef.current = false;
    setIsDragging(false);
    setOpened(true);
    setDragAngle(-168);
    onOpen?.();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (opened || prefersReduced) return;
    draggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || opened || prefersReduced) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) movedRef.current = true;
    // Swiping left turns the cover open smoothly (up to -130 deg live)
    const nextAngle = Math.max(-130, Math.min(0, (dx / 180) * 130));
    setDragAngle(nextAngle);
    if (dx <= -95) {
      triggerOpen();
    }
  };

  const handlePointerEnd = () => {
    if (!draggingRef.current || opened) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (dragAngle < -42 || !movedRef.current) {
      triggerOpen();
    } else {
      setDragAngle(0);
    }
  };

  const progress = opened ? 1 : Math.min(1, Math.abs(dragAngle) / 140);

  return (
    <div
      className={`relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-[#FDF3EC] paper-grain ${
        compact ? "px-4 py-3" : "px-4 py-6"
      }`}
      style={{ perspective: 1500 }}
    >
      <ParticleCanvas type="marigold-petals" density={compact ? 14 : 20} />

      <div className="relative z-10 flex w-full max-w-[360px] items-center justify-center">
        {/* Inner Arch Page (always mounted inside the opened book cover; blooms smoothly as cover turns) */}
        <motion.div
          initial={false}
          animate={{
            opacity: opened ? 1 : 0.25 + progress * 0.75,
            scale: opened ? 1 : 0.94 + progress * 0.06,
          }}
          transition={{ duration: prefersReduced ? 0.15 : 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
          style={{ willChange: "transform, opacity" }}
          aria-hidden={!opened}
        >
          {/* Left Velvet Spine Binding Lip that stays visible as a physical book frame */}
          <div
            className="arch-frame relative flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden border-2 px-6 py-8 text-center shadow-[0_32px_70px_-24px_rgba(22,20,18,0.36)]"
            style={{
              borderColor: gold,
              background: "#FFFDF8",
              boxShadow: `inset 12px 0 24px -14px ${primary}55, 0 32px 70px -24px rgba(22,20,18,0.36)`,
            }}
          >
            {/* Left Velvet Margin Spine Strip */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-2.5"
              style={{ background: `linear-gradient(180deg, ${primary}, #240910)` }}
              aria-hidden="true"
            />

            {heroPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroPhotoUrl}
                alt=""
                aria-hidden="true"
                className={`${
                  kenBurnsEnabled && !prefersReduced ? "animate-kenburns" : ""
                } pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20`}
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
              className="arch-frame pointer-events-none absolute inset-2.5 left-4 border"
              style={{ borderColor: `${gold}66` }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center pl-1">
              {symbol !== "none" && (
                <div
                  className="grid h-14 w-14 place-items-center rounded-full border-2 bg-white/95 shadow-sm"
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
                {opened ? (
                  <RevealWordSpan text={groom} delay={0.08} reduced={prefersReduced} />
                ) : (
                  groom
                )}
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
                {opened ? (
                  <RevealWordSpan text={bride} delay={0.32} reduced={prefersReduced} />
                ) : (
                  bride
                )}
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
                animate={prefersReduced || !opened ? undefined : { y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]"
              >
                Scroll ↓
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Overlaid 3D Hinged Velvet Cover (stays mounted and smoothly fades after swinging past 160deg) */}
        <motion.button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClick={() => {
            if (!opened && !movedRef.current) triggerOpen();
          }}
          initial={false}
          animate={{
            opacity: opened ? 0 : 1,
            scale: opened ? 0.98 : 1,
          }}
          transition={{ duration: prefersReduced ? 0.15 : 0.78, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center outline-none"
          style={{
            transformStyle: "preserve-3d",
            touchAction: "pan-y",
            pointerEvents: opened ? "none" : "auto",
            willChange: "opacity, transform",
          }}
          aria-label={tapLabel}
          tabIndex={opened ? -1 : 0}
        >
          <motion.div
            initial={false}
            animate={
              opened
                ? { rotateY: prefersReduced ? 0 : -168 }
                : { rotateY: dragAngle }
            }
            whileHover={!opened && dragAngle === 0 && !prefersReduced ? { rotateY: -9, scale: 1.015 } : undefined}
            transition={
              isDragging
                ? { duration: 0 }
                : {
                    rotateY: { duration: prefersReduced ? 0 : 0.88, ease: [0.22, 1, 0.36, 1] },
                    scale: { type: "spring", stiffness: 200, damping: 22 },
                  }
            }
            className="relative aspect-[3/4.1] w-60 overflow-hidden rounded-r-2xl rounded-l-[6px] shadow-[0_34px_65px_-16px_rgba(110,31,47,0.58)] sm:w-64"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              willChange: "transform",
              background: `linear-gradient(150deg, ${primary} 0%, #240910 72%, ${primary} 100%)`,
              border: `1.5px solid ${gold}`,
            }}
          >
            <div
              className="absolute inset-2.5 rounded-r-xl rounded-l-[2px] border"
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
            {/* Spine specular sheen */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/15 to-transparent" />
          </motion.div>

          <span className="font-ui mt-4 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
            <MoveLeft size={14} className="text-[#F6E27A]" />
            <BookOpen size={14} /> {tapLabel}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

const BookGate = memo(BookGateComponent);
export default BookGate;
