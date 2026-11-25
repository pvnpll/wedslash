"use client";
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Hand, CalendarPlus } from "lucide-react";
import Countdown from "../Countdown";
import { CulturalEmblem } from "../icons/CulturalEmblems";
import type { SacredSymbol } from "@/lib/types";

export interface TasselScrollProps {
  dateLabel: string;
  muhurat: string;
  target: string;
  title: string;
  venue: string;
  gold?: string;
  primary?: string;
  symbol?: SacredSymbol;
  label?: string;
  onReveal?: () => void;
}

export default function TasselScroll({
  dateLabel,
  muhurat,
  target,
  title,
  venue,
  gold = "#D4AF37",
  primary = "#6E1F2F",
  symbol = "ganesh",
  label = "Save the Date",
  onReveal,
}: TasselScrollProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [unrolled, setUnrolled] = useState(false);
  const burstFired = useRef(false);
  const dragY = useMotionValue(0);
  const rodGlow = useTransform(dragY, [0, 120], [0.4, 1]);

  const reveal = () => {
    setUnrolled(true);
    if (!burstFired.current) {
      burstFired.current = true;
      if (
        typeof window !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        // @ts-expect-error canvas-confetti ships without bundled TypeScript declarations
        void import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 70,
            spread: 76,
            origin: { y: 0.6 },
            colors: [gold, primary, "#F6E27A", "#E56399", "#F5B301"],
          });
        });
      }
      onReveal?.();
    }
  };

  const hasValidTarget = Boolean(target && !Number.isNaN(Date.parse(target)));

  return (
    <div className="mx-auto w-full max-w-sm px-6 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        {label}
      </p>

      {/* Golden rod */}
      <div className="relative mx-auto mt-4 w-64">
        <motion.div
          style={{ opacity: rodGlow, boxShadow: `0 6px 20px ${gold}55` }}
          className="foil-sheen mx-auto h-3.5 w-64 rounded-full shadow-md"
        />
        <div className="absolute -left-1.5 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#F6E27A] to-[#8a6d1c] shadow" />
        <div className="absolute -right-1.5 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#F6E27A] to-[#8a6d1c] shadow" />
      </div>

      {/* Scroll body */}
      <div className="relative mx-auto w-64 overflow-hidden rounded-b-2xl border-x border-b bg-[#FFFDF6] shadow-xl hairline">
        <AnimatePresence initial={false}>
          {unrolled && (
            <motion.div
              key="scroll"
              initial={prefersReduced ? { opacity: 1, height: "auto" } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 90, damping: 16 }
              }
              className="relative px-5 pb-6 pt-5"
            >
              {/* Subtle floral corner accents */}
              <span
                className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 rounded-tl-full border-l border-t opacity-60"
                style={{ borderColor: gold }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 rounded-tr-full border-r border-t opacity-60"
                style={{ borderColor: gold }}
                aria-hidden="true"
              />

              {symbol !== "none" && (
                <div className="mb-1.5 flex justify-center">
                  <CulturalEmblem symbol={symbol} color={gold} size={30} />
                </div>
              )}

              <p className="font-display mt-1 text-3xl font-bold leading-tight text-[#2A1215]">
                {dateLabel}
              </p>
              <p
                className="font-ui mt-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: primary }}
              >
                {muhurat}
              </p>
              <div
                className="mx-auto my-3 h-px w-24"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
                }}
              />
              <p className="font-editorial text-base italic text-[#161412]/80">{venue}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!unrolled && (
          <div className="flex flex-col items-center px-5 py-5">
            {/* Draggable & tappable silk tassel */}
            <motion.button
              type="button"
              drag={prefersReduced ? false : "y"}
              dragConstraints={{ top: 0, bottom: 72 }}
              dragElastic={0.25}
              style={{ y: dragY, touchAction: "none" }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 45) reveal();
              }}
              onClick={reveal}
              whileTap={prefersReduced ? undefined : { scale: 0.94 }}
              className="flex flex-col items-center outline-none"
              aria-label="Pull the tassel to reveal the date"
            >
              <div className="h-10 w-0.5" style={{ background: gold }} />
              <motion.span
                animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg"
                style={{ background: primary }}
              >
                <Hand size={16} />
              </motion.span>
              <span className="mt-1.5 flex gap-[3px]" aria-hidden="true">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className="block h-5 w-[3px] rounded-full"
                    style={{ background: gold, opacity: 0.55 + (i % 3) * 0.2 }}
                  />
                ))}
              </span>
            </motion.button>
            <p className="font-ui mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E655F]">
              Pull or tap tassel to reveal
            </p>
          </div>
        )}
      </div>

      {unrolled && hasValidTarget && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <Countdown target={target} title={title} venue={venue} />
        </motion.div>
      )}
    </div>
  );
}

export { CalendarPlus };
