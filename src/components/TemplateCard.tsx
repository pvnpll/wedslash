"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Zap, Plane, Camera, Sparkles } from "lucide-react";
import type { Template } from "@/lib/types";
import { getPresetConfig } from "@/lib/templates";

interface Props {
  t: Template;
  index?: number;
  onQuickPreview?: (t: Template) => void;
}

function ThumbnailVisual({ t }: { t: Template }) {
  const preset = getPresetConfig(t.id);
  const g = preset.couple.groomName.split(" ")[0];
  const b = preset.couple.brideName.split(" ")[0];
  const dt = new Date(preset.couple.weddingDate);
  const dStr = isNaN(dt.getTime()) ? "13" : String(dt.getDate()).padStart(2, "0");
  const mStr = isNaN(dt.getTime())
    ? "FEB"
    : dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const yStr = isNaN(dt.getTime()) ? "27" : String(dt.getFullYear()).slice(-2);
  const dep = preset.location.departureCode ?? "DEL";
  const arr = preset.location.arrivalCode ?? "MEX";

  if (t.previewType === "book") {
    return (
      <div className="flex h-full items-center justify-center p-4" style={{ background: t.bg }}>
        <div
          className="relative flex h-48 w-36 flex-col items-center justify-center rounded-r-xl rounded-l-[4px] border p-3 text-center shadow-2xl transition duration-500 group-hover:-rotate-3 group-hover:scale-105"
          style={{
            background: `linear-gradient(150deg, ${t.primary}, #22090e)`,
            borderColor: t.gold,
          }}
        >
          <div className="absolute left-2 top-0 h-full w-[2px] bg-black/35" />
          <div
            className="grid h-10 w-10 place-items-center rounded-full border text-sm"
            style={{ borderColor: t.gold, color: t.gold }}
          >
            ॥
          </div>
          <p className="font-display mt-2.5 text-lg font-bold leading-tight text-[#FFF8E7]">
            {g}
            <br />
            <span className="font-script text-base" style={{ color: t.gold }}>
              &amp;
            </span>{" "}
            {b}
          </p>
          <span
            className="mt-2 rounded-full border px-2.5 py-0.5 font-ui text-[8px] uppercase tracking-[0.2em] text-white/80"
            style={{ borderColor: `${t.gold}77` }}
          >
            {dStr} · {mStr} · {yStr}
          </span>
        </div>
      </div>
    );
  }

  if (t.previewType === "boarding") {
    return (
      <div className="flex h-full items-center justify-center p-4" style={{ background: t.bg }}>
        <div
          className="w-full max-w-[260px] overflow-hidden rounded-2xl p-4 text-white shadow-xl transition duration-500 group-hover:scale-[1.03]"
          style={{ background: t.primary }}
        >
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: t.gold }}>
            <span>{g} &amp; {b} Air</span>
            <Plane size={13} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-bold">{dep}</p>
              <p className="font-ui text-[9px] text-white/60">{preset.location.departureCity ?? "Origin"}</p>
            </div>
            <span className="text-xs opacity-70">✈ ──</span>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{arr}</p>
              <p className="font-ui text-[9px] text-white/60">{preset.location.city}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-dashed border-white/25 pt-2 font-mono text-[9px] tracking-[0.18em] text-white/65">
            &lt;&lt;&lt;CELEBRATE&lt;&lt;&lt;WITH&lt;&lt;&lt;YOU
          </div>
        </div>
      </div>
    );
  }

  if (t.previewType === "scratch") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center p-4 text-center"
        style={{ background: `linear-gradient(150deg, ${t.secondary}, ${t.bg})` }}
      >
        <p className="font-ui text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: t.primary }}>
          ✦ Scratch to Reveal ✦
        </p>
        <div className="mt-3 flex gap-2.5 transition duration-500 group-hover:scale-105">
          {[
            [dStr, "DAY"],
            [mStr, "MON"],
            [yStr, "YR"],
          ].map(([v, l]) => (
            <div
              key={l}
              className="grid h-16 w-16 place-items-center rounded-full text-center shadow-lg ring-2 ring-white"
              style={{
                background: `linear-gradient(135deg, ${t.primary}, ${t.gold})`,
                color: "#FFFFFF",
              }}
            >
              <div>
                <p className="font-display text-lg font-bold leading-none">{v}</p>
                <p className="font-ui text-[8px] uppercase tracking-widest opacity-80">{l}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-display mt-3 text-base font-bold" style={{ color: t.ink }}>
          {g} &amp; {b}
        </p>
      </div>
    );
  }

  if (t.previewType === "polaroid") {
    return (
      <div className="flex h-full items-center justify-center p-4" style={{ background: t.bg }}>
        <div className="w-40 -rotate-3 rounded-sm bg-white p-2.5 pb-6 shadow-2xl ring-1 ring-black/10 transition duration-500 group-hover:rotate-0 group-hover:scale-105">
          <div
            className="grid h-32 place-items-center rounded-xs"
            style={{ background: `linear-gradient(145deg, ${t.primary}, ${t.gold})` }}
          >
            <Camera size={28} className="text-white/85" />
          </div>
          <p className="font-script mt-2 text-center text-xl" style={{ color: t.primary }}>
            {g} &amp; {b} · {dStr} {mStr}
          </p>
        </div>
      </div>
    );
  }

  if (t.previewType === "petals") {
    return (
      <div
        className="relative flex h-full flex-col items-center justify-center overflow-hidden p-4 text-center"
        style={{ background: t.bg }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-75">
          <span className="absolute left-6 top-6 h-7 w-10 rotate-12 rounded-full" style={{ background: t.primary }} />
          <span className="absolute right-8 top-9 h-6 w-9 -rotate-45 rounded-full bg-[#F4A7C3]" />
          <span className="absolute bottom-8 left-10 h-6 w-10 rotate-45 rounded-full bg-[#E56399]" />
          <span className="absolute bottom-6 right-8 h-8 w-11 -rotate-12 rounded-full" style={{ background: t.primary }} />
        </div>
        <div className="relative rounded-2xl border bg-white/95 px-6 py-4 shadow-lg" style={{ borderColor: t.gold }}>
          <p className="font-ui text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: t.primary }}>
            Brush Petals · {g} &amp; {b}
          </p>
          <p className="font-display mt-1 text-2xl font-bold" style={{ color: t.ink }}>
            {dStr} · {mStr} · {yStr}
          </p>
        </div>
      </div>
    );
  }

  if (t.previewType === "envelope") {
    return (
      <div className="flex h-full items-center justify-center p-4" style={{ background: t.bg }}>
        <div className="relative w-52 overflow-hidden rounded-2xl border border-black/10 bg-[#FFFDF6] px-4 pb-5 pt-16 text-center shadow-xl transition duration-500 group-hover:scale-105">
          <div
            className="absolute inset-x-0 top-0 h-20"
            style={{
              background: `linear-gradient(180deg, ${t.primary}, ${t.primary}DD)`,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
          <span
            className="absolute left-1/2 top-11 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full text-xs font-bold text-white shadow-md"
            style={{ background: t.gold }}
          >
            {preset.couple.monogram}
          </span>
          <p className="font-display mt-3 text-lg font-bold" style={{ color: t.ink }}>
            {g} &amp; {b}
          </p>
          <p className="font-ui text-[9px] uppercase tracking-[0.18em] opacity-60">{preset.location.city}</p>
        </div>
      </div>
    );
  }

  if (t.previewType === "vip") {
    return (
      <div className="flex h-full items-center justify-center p-4" style={{ background: t.bg }}>
        <div
          className="w-56 rounded-2xl border p-4 text-center shadow-2xl transition duration-500 group-hover:scale-105"
          style={{
            borderColor: t.gold,
            background: `linear-gradient(145deg, ${t.primary}, #090910)`,
            color: "#FFFFFF",
          }}
        >
          <Sparkles size={18} className="mx-auto" style={{ color: t.gold }} />
          <p className="font-ui mt-2 text-[9px] font-bold uppercase tracking-[0.26em]" style={{ color: t.gold }}>
            {t.style}
          </p>
          <p className="font-display mt-1 text-xl font-bold">{g} {b}</p>
          <p className="font-ui mt-2 inline-block rounded-full border border-white/20 px-3 py-0.5 text-[9px] uppercase tracking-widest">
            {dStr} · {mStr} · {yStr}
          </p>
        </div>
      </div>
    );
  }

  // Default arch thumbnail
  return (
    <div className="relative h-full overflow-hidden" style={{ background: t.bg }}>
      <div
        className="absolute inset-4 overflow-hidden rounded-2xl shadow-lg"
        style={{ background: `linear-gradient(160deg, ${t.secondary}, ${t.bg})` }}
      >
        <div
          className="arch-frame absolute inset-x-8 top-6 bottom-0 border-2 opacity-95"
          style={{
            borderColor: t.gold,
            background: `linear-gradient(180deg, ${t.primary} 0%, ${t.primary}CC 60%, ${t.primary} 100%)`,
          }}
        >
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="font-script text-2xl" style={{ color: t.gold }}>
              {preset.couple.monogram}
            </span>
            <span className="font-display mt-1 text-xl font-bold leading-tight text-white">
              {g}
              <br />
              {b}
            </span>
            <span
              className="mt-2 rounded-full border px-2.5 py-0.5 font-ui text-[8px] uppercase tracking-[0.2em] text-white/85"
              style={{ borderColor: `${t.gold}88` }}
            >
              {dStr} · {mStr} · {yStr}
            </span>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full text-[11px] font-bold text-white shadow"
          style={{ background: t.primary }}
        >
          ✦
        </div>
      </div>
    </div>
  );
}

export default function TemplateCard({ t, index = 0, onQuickPreview }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.06 }}
      className="group overflow-hidden rounded-3xl border hairline bg-white shadow-sm transition hover:shadow-[0_28px_60px_-24px_rgba(22,20,18,0.35)]"
    >
      <Link href={`/invite/${t.id}`} className="relative block h-64 overflow-hidden">
        <ThumbnailVisual t={t} />
        {t.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#161412] px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#F6E27A]">
            <Zap size={11} /> {t.badge}
          </span>
        )}
        <span
          className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[#161412] shadow-lg opacity-0 transition group-hover:opacity-100"
          aria-hidden
        >
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E1F2F]">
            {t.category}
          </p>
          <span className="inline-flex items-center gap-1 font-ui text-xs font-semibold">
            <Star size={12} className="fill-[#C59B27] text-[#C59B27]" />
            {t.rating}{" "}
            <span className="font-normal text-[#6E655F]">({t.uses})</span>
          </span>
        </div>
        <Link href={`/invite/${t.id}`}>
          <h3 className="font-display mt-1.5 text-[22px] font-bold leading-tight hover:text-[#6E1F2F]">
            {t.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#6E655F]">
          {t.tagline}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">
            {t.entry}
          </span>
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">
            {t.reveal}
          </span>
          <span className="rounded-full bg-[#F0EAE1] px-2.5 py-1 font-ui text-[10px] font-semibold">
            {t.particle}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {onQuickPreview ? (
            <button
              type="button"
              onClick={() => onQuickPreview(t)}
              className="font-ui rounded-full border hairline py-2.5 text-center text-xs font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]"
            >
              Quick View
            </button>
          ) : (
            <Link
              href={`/invite/${t.id}`}
              className="font-ui rounded-full border hairline py-2.5 text-center text-xs font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]"
            >
              Preview
            </Link>
          )}
          <Link
            href={`/studio?t=${t.id}`}
            className="font-ui rounded-full bg-[#161412] py-2.5 text-center text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#6E1F2F]"
          >
            Customize
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
