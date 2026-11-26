"use client";
/**
 * Minimal Zen Layout — vast negative space, single oversized word per section,
 * center-axis typography, breath-giving silence between elements. 
 * Inspired by Japanese minimalism × Swiss design.
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { Gift, Phone, Shirt, ArrowRight } from "lucide-react";
import { CulturalEmblem } from "@/components/icons/CulturalEmblems";
import IllustratedMapCard from "@/components/mechanics/IllustratedMapCard";
import RsvpForm from "@/components/mechanics/RsvpForm";
import type { InvitationConfig, Template } from "@/lib/types";
import type { LanguageCopy } from "@/lib/templates";

interface Props {
  cfg: InvitationConfig;
  template: Template;
  guestName: string;
  copy: LanguageCopy;
  Gate: React.ReactNode;
  DateReveal: React.ReactNode;
}

/** Thin animated line that draws in from left */
function DrawLine({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      className="h-px"
      style={{ background: color }}
      initial={{ scaleX: 0, transformOrigin: "left" }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

function MinimalZenLayoutComponent({ cfg, template, guestName, copy, Gate, DateReveal }: Props) {
  const fns = cfg.functions;
  const p = template.primary;
  const g = template.gold;
  const bg = template.bg;
  const ink = template.ink;

  return (
    <div className="@container relative overflow-x-clip" style={{ background: bg, color: ink }}>

      {/* ── ENTRY GATE ── */}
      <section id="invite-sec-gate" className="relative min-h-[min(580px,82dvh)] @2xl:min-h-[640px] overflow-hidden">
        {Gate}
      </section>

      {/* ── ZEN HERO — single breath of negative space with enormous names ── */}
      <section id="invite-sec-hero" className="relative px-8 @2xl:px-20 py-24 @2xl:py-36">
        {/* Thin top rule */}
        <DrawLine color={`${p}30`} />

        <div className="mt-20 @2xl:mt-28">
          {/* Sacred symbol — small, centered, restrained */}
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
            <motion.div
              className="mb-10 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <CulturalEmblem symbol={cfg.blessing.symbol} color={p} size={28} />
            </motion.div>
          )}

          {/* Groom name — full width, oversized */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.88] tracking-tight text-center"
              style={{ color: p }}
            >
              {cfg.couple.groomName}
            </h1>
            <p className="font-ui text-center text-[10px] uppercase tracking-[0.35em] mt-3 opacity-40">
              {cfg.couple.groomParents}
            </p>
          </motion.div>

          {/* Ampersand — huge, gold, breathing */}
          <div className="text-center py-6 @2xl:py-10">
            <motion.span
              className="font-script text-[clamp(4rem,12vw,8rem)] select-none"
              style={{ color: g }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              &amp;
            </motion.span>
          </div>

          {/* Bride name */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.88] tracking-tight text-center"
              style={{ color: p }}
            >
              {cfg.couple.brideName}
            </h1>
            <p className="font-ui text-center text-[10px] uppercase tracking-[0.35em] mt-3 opacity-40">
              {cfg.couple.brideParents}
            </p>
          </motion.div>
        </div>

        {/* Guest greeting + subtitle */}
        <motion.div
          className="mt-16 @2xl:mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="font-ui text-[10px] uppercase tracking-[0.4em] opacity-40">{copy.together}</p>
          <p className="font-editorial mt-3 text-xl @2xl:text-2xl italic opacity-55">{cfg.couple.heroSubtitle}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ background: g }} />
            <span className="font-ui text-[10px] uppercase tracking-[0.3em]" style={{ color: g }}>{guestName}</span>
            <div className="h-px w-8" style={{ background: g }} />
          </div>
        </motion.div>

        {/* Bottom rule */}
        <div className="mt-20 @2xl:mt-28">
          <DrawLine color={`${p}30`} delay={0.3} />
        </div>
      </section>

      {/* ── DATE REVEAL ── */}
      <section id="invite-sec-date" className="relative px-2 py-20" style={{ background: `${p}06` }}>
        {DateReveal}
      </section>

      {/* ── ZEN EVENTS — stark minimal list, left-aligned, hairline-separated ── */}
      <section id="invite-sec-functions" className="px-8 @2xl:px-20 py-20 @2xl:py-28">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-ui text-[10px] uppercase tracking-[0.5em] opacity-30 mb-3">{copy.festivities}</p>
          <DrawLine color={`${p}20`} />
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {fns.map((fn, i) => (
            <motion.div
              key={fn.id}
              className="group border-b py-8 @2xl:py-10"
              style={{ borderColor: `${p}12` }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-6 @2xl:flex-row flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-ui text-[9px] uppercase tracking-[0.4em] opacity-25">{String(i + 1).padStart(2, "0")}</span>
                    <div className="h-px flex-1" style={{ background: `${p}15` }} />
                  </div>
                  <h3
                    className="font-display text-2xl @2xl:text-3xl font-bold leading-tight"
                    style={{ color: p }}
                  >
                    {fn.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-4 font-ui text-[11px] uppercase tracking-[0.2em] opacity-45">
                    <span>{fn.dayAndDate}</span>
                    <span>·</span>
                    <span>{fn.time}</span>
                    <span>·</span>
                    <span>{fn.venueName}</span>
                  </div>
                </div>

                {/* Dress swatches */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    {fn.dressCodeColors.map((c, ci) => (
                      <div key={ci} className="h-4 w-4 rounded-full border border-black/5" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="font-ui text-[10px] opacity-30 text-right">{fn.dressCodeLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GRAND RECEPTION — full white space reveal ── */}
      <section className="px-8 @2xl:px-20 py-24 @2xl:py-36 text-center" style={{ background: p }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-white"
        >
          <p className="font-ui text-[9px] uppercase tracking-[0.6em] mb-6 text-white/40">Finale</p>
          <h2 className="font-display text-[clamp(3rem,9vw,7rem)] font-bold leading-[0.9]">
            {fns[fns.length - 1]?.name ?? "Grand Reception"}
          </h2>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "rgba(255,255,255,0.3)" }} />
            <span className="font-ui text-[11px] uppercase tracking-[0.3em] text-white/50">
              {fns[fns.length - 1]?.dayAndDate} · {fns[fns.length - 1]?.time}
            </span>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "rgba(255,255,255,0.3)" }} />
          </div>
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
            {fns[fns.length - 1]?.venueName ?? cfg.location.venueTitle}
          </p>
        </motion.div>
      </section>

      {/* ── DRESS CODE — minimal cards ── */}
      <section className="px-8 @2xl:px-20 py-16 @2xl:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="font-ui text-[10px] uppercase tracking-[0.5em] opacity-30 mb-6">{copy.dressCode}</p>
          <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5" style={{ background: `${p}08` }}>
              <Shirt size={16} className="mb-3" style={{ color: p }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] mb-2 opacity-50">Ladies</p>
              <p className="text-[13px] leading-relaxed opacity-70">{cfg.etiquetteAndDetails.ladiesDressNote}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: `${p}08` }}>
              <Shirt size={16} className="mb-3" style={{ color: p }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] mb-2 opacity-50">Gentlemen</p>
              <p className="text-[13px] leading-relaxed opacity-70">{cfg.etiquetteAndDetails.gentlemenDressNote}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: `${p}08` }}>
              <Gift size={16} className="mb-3" style={{ color: p }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] mb-2 opacity-50">Gift Note</p>
              <p className="text-[13px] leading-relaxed opacity-70">{cfg.etiquetteAndDetails.giftPreferenceNote}</p>
            </div>
          </div>
          {cfg.etiquetteAndDetails.reservedColorsNote && (
            <p className="mt-4 text-[12px] opacity-50 text-center italic">{cfg.etiquetteAndDetails.reservedColorsNote}</p>
          )}
          <div className="mt-6 flex justify-center">
            <a href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`} className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] opacity-40 hover:opacity-70 transition-opacity" style={{ color: p }}>
              <Phone size={12} /> {cfg.etiquetteAndDetails.organizerName}
              <ArrowRight size={11} />
            </a>
          </div>
        </div>
      </section>

      {/* ── VENUE + RSVP ── */}
      <div className="px-4 py-12 @2xl:px-10 @2xl:py-16" style={{ background: `${p}06` }}>
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 @2xl:max-w-5xl @2xl:grid-cols-[0.95fr_1.05fr] @2xl:items-start">
          <section id="invite-sec-map">
            <IllustratedMapCard venueTitle={cfg.location.venueTitle} fullAddress={cfg.location.fullAddress} city={cfg.location.city} googleMapsUrl={cfg.location.googleMapsUrl} primary={template.primary} gold={template.gold} heading={copy.venue} />
          </section>
          <section id="invite-sec-rsvp">
            <RsvpForm guestName={guestName} inviteSlug={cfg.slug} hostPhone={cfg.rsvpConfig.whatsappHostNumber} deadlineText={cfg.rsvpConfig.deadlineText} allowTellLater={cfg.rsvpConfig.allowTellLater} collectChildrenDetails={cfg.rsvpConfig.collectChildrenDetails} collectDietary={cfg.rsvpConfig.collectDietary} collectDrinkPreference={cfg.rsvpConfig.collectDrinkPreference} drinkOptions={cfg.rsvpConfig.drinkOptions} collectDanceSong={cfg.rsvpConfig.collectDanceSong} congratulationsPrompt={cfg.etiquetteAndDetails.congratulationsPrompt} heading={copy.rsvpHeading} subHeading={copy.rsvpSub} primary={template.primary} />
          </section>
        </div>
      </div>

      {/* ── CLOSING ── */}
      <section className="px-6 pt-24 pb-28 @2xl:pb-20 text-center" style={{ background: bg }}>
        <DrawLine color={`${p}20`} />
        <div className="pt-20">
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
            <div className="mb-6 flex justify-center"><CulturalEmblem symbol={cfg.blessing.symbol} color={p} size={30} /></div>
          ) : (
            <p className="font-display text-xl mb-6 opacity-30" style={{ color: p }}>✦</p>
          )}
          <h2 className="font-display text-5xl @2xl:text-6xl font-bold" style={{ color: p }}>{copy.closing}</h2>
          <p className="font-editorial mt-4 text-xl italic opacity-50">{cfg.couple.closingFamilyLine}</p>
          <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.4em] opacity-25">{cfg.couple.hashtag}</p>
        </div>
        <DrawLine color={`${p}20`} delay={0.3} />
        <p className="font-ui mt-8 text-[10px] uppercase tracking-[0.24em] opacity-20">Crafted with love on Wedslash</p>
      </section>
    </div>
  );
}

export const MinimalZenLayout = memo(MinimalZenLayoutComponent);
