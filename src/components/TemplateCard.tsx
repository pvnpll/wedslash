"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Zap } from "lucide-react";
import type { Template } from "@/lib/templates";

export default function TemplateCard({ t, index = 0 }: { t: Template; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.07 }}
      className="group overflow-hidden rounded-3xl border hairline bg-white shadow-sm transition hover:shadow-[0_28px_60px_-24px_rgba(22,20,18,0.35)]"
    >
      <Link href={`/invite/${t.id}`} className="block">
        <div className="relative h-64 overflow-hidden" style={{ background: t.bg }}>
          <div className="absolute inset-4 overflow-hidden rounded-2xl shadow-lg" style={{ background: `linear-gradient(160deg, ${t.secondary}, ${t.bg})` }}>
            <div className="absolute inset-x-8 top-6 bottom-0 arch-frame border-2 opacity-90" style={{ borderColor: t.gold, background: `linear-gradient(180deg, ${t.primary} 0%, ${t.primary}CC 60%, ${t.primary} 100%)` }}>
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <span className="font-script text-2xl" style={{ color: t.gold }}>A & P</span>
                <span className="font-display mt-1 text-xl font-bold leading-tight text-white">Arjun<br />Priya</span>
                <span className="font-ui mt-2 rounded-full border px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white/85" style={{ borderColor: `${t.gold}88` }}>13 · 02 · 27</span>
              </div>
            </div>
            <div className="absolute left-1/2 top-2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full text-[11px] font-bold text-white shadow" style={{ background: t.primary }}>✦</div>
          </div>
          {t.badge && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#161412] px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#F6E27A]">
              <Zap size={11} /> {t.badge}
            </span>
          )}
          <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg opacity-0 transition group-hover:opacity-100" aria-hidden><ArrowUpRight size={17} /></span>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E1F2F]">{t.category}</p>
          <span className="inline-flex items-center gap-1 font-ui text-xs font-semibold"><Star size={12} className="fill-[#C59B27] text-[#C59B27]" />{t.rating} <span className="font-normal text-[#6E655F]">({t.uses})</span></span>
        </div>
        <Link href={`/invite/${t.id}`}><h3 className="font-display mt-1.5 text-[22px] font-bold leading-tight hover:text-[#6E1F2F]">{t.name}</h3></Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#6E655F]">{t.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">{t.entry}</span>
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">{t.reveal}</span>
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">{t.particle}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/invite/${t.id}`} className="font-ui rounded-full border hairline py-2.5 text-center text-xs font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]">Preview</Link>
          <Link href={`/studio?t=${t.id}`} className="font-ui rounded-full bg-[#161412] py-2.5 text-center text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#6E1F2F]">Customize</Link>
        </div>
      </div>
    </motion.article>
  );
}
