"use client";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function BoardingPass({ guestName }: { guestName: string }) {
  return (
    <div className="mx-auto w-full max-w-md px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-3xl bg-[#0F2440] text-white shadow-2xl">
        <div className="flex items-center justify-between bg-white/5 px-5 py-3">
          <span className="font-ui text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6E27A]">Wedslash Airways</span>
          <Plane size={18} className="text-[#F6E27A]" />
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 py-5 text-center">
          <div><p className="font-display text-3xl font-bold">DEL</p><p className="font-ui text-[10px] uppercase tracking-widest text-white/60">Your city</p></div>
          <div className="flex flex-col items-center justify-center"><div className="h-px w-full bg-dashed bg-white/30" style={{ backgroundImage: "linear-gradient(90deg,#fff 50%,transparent 50%)", backgroundSize: "8px 1px" }} /><Plane size={16} className="my-1 rotate-90 text-[#F6E27A]" /><p className="font-ui text-[10px] uppercase tracking-widest">Direct</p></div>
          <div><p className="font-display text-3xl font-bold">MEX</p><p className="font-ui text-[10px] uppercase tracking-widest text-white/60">Puerto Vallarta</p></div>
        </div>
        <div className="border-t border-dashed border-white/25 px-5 py-4">
          <div className="grid grid-cols-3 gap-2 font-ui text-[11px]">
            <div><p className="uppercase tracking-widest text-white/50">Passenger</p><p className="mt-0.5 font-semibold">{guestName}</p></div>
            <div><p className="uppercase tracking-widest text-white/50">Date</p><p className="mt-0.5 font-semibold">05 · 05 · 27</p></div>
            <div><p className="uppercase tracking-widest text-white/50">Seat</p><p className="mt-0.5 font-semibold">LOVE-01A</p></div>
          </div>
          <p className="font-mono mt-3 text-[10px] tracking-[0.2em] text-white/50">{"<<<<CELEBRATE<<<<WITH<<<<YOU<<<<"}</p>
          <p className="font-ui mt-1 text-[10px] uppercase tracking-[0.24em] text-[#F6E27A]">Passport 050527 · Code Mexico</p>
        </div>
      </motion.div>
    </div>
  );
}
