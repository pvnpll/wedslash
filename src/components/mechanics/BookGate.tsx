"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
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

/**
 * 3D Velvet Hardcover Book Gate:
 * - Liquid 1:1 spring-damped left-swipe cover peeling (`useMotionValue` + `useSpring`)
 *   with automatic velocity snapback if released early.
 * - Adapts from a full-bleed mobile arch spread to an editorial 2-column open book
 *   foliage spread on wide desktop containers (`@2xl:`), with zero character opacity dip.
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

  const rawRotateY = useMotionValue(0);
  const smoothRotateY = useSpring(rawRotateY, { stiffness: 260, damping: 28, mass: 0.9 });
  const spreadScale = useTransform(smoothRotateY, [-18, -168], [0.95, 1]);
  const spreadOpacity = useTransform(smoothRotateY, [-18, -135], [0, 1]);

  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  const resolvedQuote = sacredQuote ?? SYMBOL_DEFAULT_QUOTE[symbol];

  const triggerOpen = () => {
    if (opened) return;
    draggingRef.current = false;
    setOpened(true);
    rawRotateY.set(prefersReduced ? 0 : -168);
    onOpen?.();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (opened || prefersReduced) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || opened || prefersReduced) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) movedRef.current = true;
    const nextAngle = Math.max(-135, Math.min(0, (dx / 170) * 135));
    rawRotateY.set(nextAngle);
    if (dx <= -90) {
      triggerOpen();
    }
  };

  const handlePointerEnd = () => {
    if (!draggingRef.current || opened) return;
    draggingRef.current = false;
    if (rawRotateY.get() < -42 || !movedRef.current) {
      triggerOpen();
    } else {
      rawRotateY.set(0);
    }
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FDF3EC] paper-grain ${
        compact
          ? "min-h-[520px] sm:min-h-[580px] px-3 py-3"
          : "min-h-[min(580px,82dvh)] @2xl:min-h-[620px] px-4 py-6 @2xl:px-10 @2xl:py-10"
      }`}
      style={{ perspective: 1600 }}
    >
      <ParticleCanvas type="marigold-petals" density={compact ? 14 : 22} />

      <div
        className={`relative z-10 flex w-full items-center justify-center ${
          compact ? "max-w-[340px]" : "max-w-md @2xl:max-w-3xl"
        }`}
      >
        {/* Opened Arch Book Inner Page (switches to 2-column open-book spread on desktop) */}
        <motion.div
          style={{
            scale: opened || prefersReduced ? 1 : spreadScale,
            opacity: opened || prefersReduced ? 1 : spreadOpacity,
            willChange: "transform, opacity",
          }}
          className="relative w-full"
          aria-hidden={!opened}
        >
          <div
            className="arch-frame @2xl:rounded-3xl relative flex min-h-[510px] sm:min-h-[560px] w-full flex-col items-center justify-center overflow-hidden border-2 px-5 py-8 text-center @2xl:grid @2xl:min-h-[520px] @2xl:grid-cols-2 @2xl:gap-10 @2xl:px-12 @2xl:py-12"
            style={{
              borderColor: gold,
              background: "#FFFDF8",
              boxShadow: `inset 12px 0 24px -14px ${primary}55, 0 36px 80px -24px rgba(22,20,18,0.36)`,
            }}
          >
            {/* Left Velvet Spine Margin (plus central open-book spine shadow on desktop) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-2.5"
              style={{ background: `linear-gradient(180deg, ${primary}, #240910)` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none hidden @2xl:block absolute inset-y-6 left-1/2 w-px -translate-x-1/2 opacity-30"
              style={{ background: `linear-gradient(180deg, transparent, ${gold}, transparent)` }}
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
              className="arch-frame @2xl:rounded-2xl pointer-events-none absolute inset-2.5 left-4 border @2xl:inset-3.5"
              style={{ borderColor: `${gold}66` }}
              aria-hidden="true"
            />

            {/* Left Column (desktop) / Top (mobile): Emblem, Sacred Quote & Guest Welcome */}
            <div className="relative z-10 flex flex-col items-center pl-1 @2xl:pr-4">
              {symbol !== "none" && (
                <motion.div
                  initial={false}
                  animate={opened && !prefersReduced ? { scale: [0.88, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="grid h-14 w-14 @2xl:h-20 @2xl:w-20 place-items-center rounded-full border-2 bg-white/95 shadow-sm"
                  style={{ borderColor: gold }}
                >
                  <CulturalEmblem symbol={symbol} color={primary} size={32} />
                </motion.div>
              )}

              {resolvedQuote && (
                <p
                  className="font-ui mt-3 text-[10px] @2xl:text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{ color: primary }}
                >
                  {resolvedQuote}
                </p>
              )}

              <p className="font-ui mt-3 text-[10px] uppercase tracking-[0.28em] text-[#6E655F]">
                {inviteIntro}
              </p>

              <p className="font-editorial mt-3 hidden @2xl:block text-xl italic text-[#161412]/80">
                joyfully invite <span className="font-semibold not-italic" style={{ color: primary }}>{guestName}</span> to celebrate with them
              </p>
            </div>

            {/* Right Column (desktop) / Main Names (mobile) */}
            <motion.div
              initial={false}
              animate={opened && !prefersReduced ? { scale: [0.97, 1.02, 1], y: [8, 0] } : { scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center pl-1 @2xl:pl-4"
            >
              <h2
                className={`font-display mt-3 @2xl:mt-0 break-words font-bold leading-none ${
                  compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl @2xl:text-[3.25rem]"
                }`}
                style={{ color: primary }}
              >
                {groom}
              </h2>
              {groomParents && (
                <p className="font-ui mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#6E655F]">
                  {groomParents}
                </p>
              )}

              <p className="font-script my-1.5 text-4xl @2xl:text-5xl" style={{ color: gold }}>
                &amp;
              </p>

              <h2
                className={`font-display break-words font-bold leading-none ${
                  compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl @2xl:text-[3.25rem]"
                }`}
                style={{ color: primary }}
              >
                {bride}
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

              <p className="font-editorial @2xl:hidden text-lg italic text-[#161412]/80">
                joyfully invite <span className="font-semibold not-italic">{guestName}</span> to celebrate with them
              </p>

              <motion.span
                animate={prefersReduced || !opened ? undefined : { y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="font-ui mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]"
              >
                Scroll ↓
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* 3D Spring-Damped Hardcover Overlay */}
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
            style={{
              rotateY: smoothRotateY,
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              willChange: "transform",
              background: `linear-gradient(150deg, ${primary} 0%, #240910 72%, ${primary} 100%)`,
              border: `1.5px solid ${gold}`,
            }}
            whileHover={!opened && !prefersReduced ? { scale: 1.02 } : undefined}
            className={`relative aspect-[3/4.1] w-full overflow-hidden rounded-r-2xl rounded-l-[6px] shadow-[0_34px_65px_-16px_rgba(110,31,47,0.58)] ${
              compact ? "max-w-[232px] sm:max-w-[252px]" : "max-w-[244px] sm:max-w-[264px] @2xl:max-w-[290px]"
            }`}
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
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/15 to-transparent" />
          </motion.div>

          <span className="font-ui mt-4 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-[#6E1F2F]">
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
