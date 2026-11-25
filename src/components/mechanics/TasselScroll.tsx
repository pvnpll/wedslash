"use client";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Hand, CalendarPlus } from "lucide-react";
import Countdown from "../Countdown";

interface Props {
  dateLabel: string;
  muhurat: string;
  target: string;
  title: string;
  venue: string;
  gold?: string;
  onReveal?: () => void;
}

export default function TasselScroll({ dateLabel, muhurat, target, title, venue, gold = "#D4AF37", onReveal }: Props) {
  const [unrolled, setUnrolled] = useState(false);
  const dragY = useMotionValue(0);
  const rodGlow = useTransform(dragY, [0, 120], [0.4, 1]);
  const reveal = () => { setUnrolled(true); onReveal?.(); };

  return (
    <div className="mx-auto w-full max-w-sm px-6 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">Save the Date</p>
      {/* golden rod */}
      <div className="relative mx-auto mt-4">
        <motion.div style={{ opacity: rodGlow }} className="mx-auto h-3.5 w-64 rounded-full shadow-md" />
        <div className="foil-sheen mx-auto h-3.5 w-64 rounded-full" />
        <div className="absolute -left-1 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#F6E27A] to-[#8a6d1c] shadow" />
        <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#F6E27A] to-[#8a6d1c] shadow" />
      </div>
      {/* scroll body */}
      <div className="relative mx-auto w-64 overflow-hidden rounded-b-2xl border-x border-b bg-[#FFFDF6] shadow-xl hairline">
        <AnimatePresence initial={false}>
          {unrolled && (
            <motion.div key="scroll" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 16 }} className="px-5 pb-6 pt-4">
              <p className="font-display text-lg" style={{ color: gold }}>॥</p>
              <p className="font-display mt-1 text-3xl font-bold leading-tight text-[#2A1215]">{dateLabel}</p>
              <p className="font-ui mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6E1F2F]">{muhurat}</p>
              <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <p className="font-editorial mt-2 text-base italic text-[#161412]/75">{venue}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!unrolled && (
          <div className="flex flex-col items-center px-5 py-5">
            {/* tassel pull */}
            <motion.button
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} style={{ y: dragY }}
              onDragEnd={(_, info) => { if (info.offset.y > 60) reveal(); }}
              onClick={reveal}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center outline-none"
              aria-label="Pull the tassel to reveal the date"
            >
              <div className="h-10 w-0.5" style={{ background: gold }} />
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="grid h-9 w-9 place-items-center rounded-full text-white shadow-lg" style={{ background: "#6E1F2F" }}>
                <Hand size={16} />
              </motion.span>
              <span className="mt-1.5 flex gap-[3px]" aria-hidden>
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="block h-5 w-[3px] rounded-full" style={{ background: gold, opacity: 0.55 + (i % 3) * 0.2 }} />
                ))}
              </span>
            </motion.button>
            <p className="font-ui mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E655F]">Pull the tassel to reveal</p>
          </div>
        )}
      </div>
      {unrolled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <Countdown target={target} title={title} venue={venue} />
        </motion.div>
      )}
    </div>
  );
}

export { CalendarPlus };
