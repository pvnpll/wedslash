"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Hand } from "lucide-react";
import ParticleCanvas from "../ParticleCanvas";

interface Props {
  groom: string;
  bride: string;
  guestName: string;
  primary?: string;
  gold?: string;
  compact?: boolean;
  onOpen?: () => void;
}

export default function BookGate({ groom, bride, guestName, primary = "#6E1F2F", gold = "#D4AF37", compact = false, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const handle = () => { setOpen(true); onOpen?.(); };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FDF3EC] paper-grain px-6 py-8" style={{ perspective: 1400 }}>
      <ParticleCanvas type="marigold-petals" density={compact ? 18 : 30} />
      {/* hanging toran */}
      <div className="absolute left-0 right-0 top-0 flex justify-center gap-1.5 px-4" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="animate-sway flex flex-col items-center" style={{ animationDelay: `${i * 0.18}s` }}>
            <div className="h-6 w-px bg-[#2E7D32]/50" />
            <div className="h-3.5 w-3.5 rounded-full" style={{ background: i % 2 ? "#F5B301" : "#E4572E" }} />
            <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
          </div>
        ))}
      </div>

      {!open ? (
        <button onClick={handle} className="relative z-10 flex flex-col items-center outline-none" aria-label="Tap the book to open">
          <motion.div
            initial={{ rotateY: 0 }}
            whileHover={{ rotateY: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="relative aspect-[3/4.1] w-52 overflow-hidden rounded-r-xl rounded-l-[4px] shadow-[0_30px_60px_-15px_rgba(110,31,47,0.55)] sm:w-60"
            style={{ background: `linear-gradient(150deg, ${primary} 0%, #3d0f1a 70%, ${primary} 100%)`, transformStyle: "preserve-3d", border: `1px solid ${gold}` }}
          >
            <div className="absolute inset-2 rounded-r-lg rounded-l-[2px] border" style={{ borderColor: `${gold}88` }} />
            <div className="absolute left-3 top-0 h-full w-[3px] bg-black/30" />
            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border-2" style={{ borderColor: gold }}>
                <span className="font-display text-2xl" style={{ color: gold }}>॥</span>
              </div>
              <p className="font-ui mt-4 text-[10px] uppercase tracking-[0.3em]" style={{ color: `${gold}` }}>Shree Ganeshaya Namah</p>
              <p className="font-display mt-3 text-3xl font-bold leading-tight text-[#FFF8E7]">{groom} <span className="font-script text-2xl" style={{ color: gold }}>&</span> {bride}</p>
              <p className="font-ui mt-2 text-[10px] uppercase tracking-[0.24em] text-[#FFF8E7]/70">Wedding Invitation</p>
              <div className="mt-4 rounded-full border px-4 py-1.5 font-ui text-[10px] uppercase tracking-[0.18em] text-[#FFF8E7]/90" style={{ borderColor: `${gold}66` }}>
                For · {guestName}
              </div>
            </div>
            {/* spine shine */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/15 to-transparent" />
          </motion.div>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
            <Hand size={15} /> Tap the book to open
          </motion.span>
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full border-2 bg-white shadow" style={{ borderColor: gold }}>
            <span className="font-display text-xl" style={{ color: primary }}>॥</span>
          </div>
          <p className="font-ui mt-3 text-[10px] uppercase tracking-[0.3em] text-[#6E655F]">Together with their families</p>
          <h2 className="font-display mt-2 text-5xl font-bold leading-none" style={{ color: primary }}>{groom}</h2>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">Son of Rajesh & Sunita Sharma</p>
          <p className="font-script my-1 text-4xl" style={{ color: gold }}>&</p>
          <h2 className="font-display text-5xl font-bold leading-none" style={{ color: primary }}>{bride}</h2>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">Daughter of Vikram & Meera Kapoor</p>
          <p className="font-editorial mt-3 text-lg italic text-[#161412]/80">joyfully invite {guestName} to celebrate with them</p>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="font-ui mt-4 text-[11px] uppercase tracking-[0.3em] text-[#6E655F]">Scroll ↓</motion.span>
        </motion.div>
      )}
    </div>
  );
}
