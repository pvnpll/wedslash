"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import type { FunctionEvent } from "@/lib/types";

const SCENES: Record<string, { emoji: string; bg: string }> = {
  haldi: { emoji: "🌼", bg: "linear-gradient(160deg,#FFF3D6,#F5B301)" },
  mehendi: { emoji: "🌿", bg: "linear-gradient(160deg,#E4F2E6,#0E6B3A)" },
  sangeet: { emoji: "💃", bg: "linear-gradient(160deg,#EDE4FF,#6C2BD9)" },
  pheras: { emoji: "🔥", bg: "linear-gradient(160deg,#FFE9D6,#8B1E24)" },
  reception: { emoji: "🥂", bg: "linear-gradient(160deg,#2A2A44,#161412)" },
  default: { emoji: "✦", bg: "linear-gradient(160deg,#FAF7F2,#E8DFD2)" },
};

export default function FunctionCarousel({ functions }: { functions: FunctionEvent[] }) {
  const [[index, dir], setIndex] = useState<[number, number]>([0, 0]);
  const go = (d: number) => setIndex([(index + d + functions.length) % functions.length, d]);
  const f = functions[index];
  const scene = SCENES[f.scene] ?? SCENES.default;

  return (
    <div className="mx-auto w-full max-w-md px-6">
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">Wedding Festivities</p>
      <p className="font-ui mt-1 text-center text-[11px] uppercase tracking-[0.2em] text-[#6E655F]/70">Swipe · {index + 1} of {functions.length}</p>
      <div className="relative mt-3 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.article
            key={f.id}
            custom={dir}
            initial={{ x: dir >= 0 ? 120 : -120, opacity: 0, rotateY: dir >= 0 ? 18 : -18, scale: 0.94 }}
            animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ x: dir >= 0 ? -120 : 120, opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
            onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
            className="cursor-grab overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-20px_rgba(22,20,18,0.35)] ring-1 ring-black/5 active:cursor-grabbing"
          >
            <div className="relative grid h-44 place-items-center" style={{ background: scene.bg }}>
              <span className="text-7xl drop-shadow-lg" aria-hidden>{scene.emoji}</span>
              <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">{f.name}</span>
              <span className="absolute bottom-3 right-4 h-2.5 w-2.5 rounded-full shadow" style={{ background: f.cardThemeColor }} />
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl font-bold">{f.name}</h3>
              <p className="font-ui mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#161412]/70"><Clock size={14} /> {f.dayAndDate} · {f.time}</p>
              <p className="font-ui mt-1 flex items-center gap-1.5 text-[13px] text-[#161412]/70"><MapPin size={14} /> {f.venueName}</p>
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FAF7F2] p-3">
                <div className="flex -space-x-1.5">
                  {f.dressCodeColors.map((c) => (
                    <span key={c} className="h-6 w-6 rounded-full ring-2 ring-white" style={{ background: c }} title={c} />
                  ))}
                </div>
                <p className="font-ui text-xs font-medium text-[#161412]/75">{f.dressCodeLabel}</p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={() => go(-1)} className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white" aria-label="Previous function"><ChevronLeft size={18} /></button>
        <div className="flex gap-1.5">
          {functions.map((_, i) => (
            <button key={i} onClick={() => setIndex([i, i > index ? 1 : -1])} aria-label={`Go to ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-[#6E1F2F]" : "w-2 bg-[#161412]/20"}`} />
          ))}
        </div>
        <button onClick={() => go(1)} className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white" aria-label="Next function"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
