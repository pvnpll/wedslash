"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function EnvelopeGate({ guestName, primary = "#0E6B5E", gold = "#C9A227", onOpen }: { guestName: string; primary?: string; gold?: string; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FDF8EF] px-6 py-10">
      {!open ? (
        <button onClick={() => { setOpen(true); onOpen?.(); }} className="relative z-10 outline-none" aria-label="Open the envelope">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative w-64 sm:w-72">
            <motion.div animate={{ rotateX: open ? 180 : 0 }} className="absolute inset-x-0 top-0 z-20 h-32 origin-top"
              style={{ background: `linear-gradient(180deg, ${primary}, ${primary}DD)`, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
            <div className="relative z-10 rounded-2xl border border-black/10 bg-[#FFFDF6] px-6 pb-8 pt-36 text-center shadow-2xl">
              <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#6E655F]">You are cordially invited</p>
              <p className="font-display mt-2 text-2xl font-bold">For · {guestName}</p>
              <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">Tap the seal to open</p>
            </div>
            <motion.span whileHover={{ scale: 1.12 }} className="absolute left-1/2 top-24 z-30 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full text-xl font-bold text-white shadow-xl"
              style={{ background: `radial-gradient(circle at 35% 30%, ${gold}, ${primary})` }}>A·P</motion.span>
          </motion.div>
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="z-10 max-w-sm text-center">
          <p className="font-script text-4xl" style={{ color: gold }}>Welcome, {guestName}</p>
          <h2 className="font-display mt-2 text-5xl font-bold">Alexa & Richard</h2>
          <p className="font-editorial mt-2 text-lg italic text-[#161412]/75">are getting married in Cancún — and you are on the guest list.</p>
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.3em] text-[#6E655F]">Scroll ↓</p>
        </motion.div>
      )}
    </div>
  );
}
