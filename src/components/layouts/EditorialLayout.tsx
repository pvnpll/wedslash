"use client";
/**
 * Editorial Layout — magazine-style, asymmetric, full-bleed hero photo strips,
 * diagonal oversized typography, overlapping elements. Think Vogue × Harper's Bazaar.
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Phone, Shirt } from "lucide-react";
import ParticleCanvas from "@/components/ParticleCanvas";
import { CulturalEmblem } from "@/components/icons/CulturalEmblems";
import FunctionCarousel from "@/components/mechanics/FunctionCarousel";
import StoryCarousel from "@/components/mechanics/StoryCarousel";
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

function EditorialLayoutComponent({ cfg, template, guestName, copy, Gate, DateReveal }: Props) {
  return (
    <div
      className="@container relative overflow-x-clip"
      style={{ background: template.bg, color: template.ink }}
    >
      {/* ── ENTRY GATE ── */}
      <section id="invite-sec-gate" className="relative min-h-[min(580px,82dvh)] @2xl:min-h-[640px] overflow-hidden">
        {Gate}
      </section>

      {/* ── EDITORIAL HERO — full-bleed horizontal band with giant diagonal monogram ── */}
      <section id="invite-sec-hero" className="relative overflow-hidden paper-grain">
        <ParticleCanvas type={cfg.mechanics.particleType} density={18} />

        {/* Top editorial rule line */}
        <div className="flex items-center gap-4 px-6 pt-10 @2xl:px-16 @2xl:pt-14">
          <div className="h-px flex-1" style={{ background: template.primary }} />
          <span className="font-ui text-[10px] uppercase tracking-[0.4em] opacity-50">
            {copy.together}
          </span>
          <div className="h-px flex-1" style={{ background: template.primary }} />
        </div>

        {/* Mobile: stacked; Desktop: asymmetric 3-column split */}
        <div className="relative mx-auto px-6 py-8 @2xl:px-16 @2xl:grid @2xl:grid-cols-[1fr_auto_1fr] @2xl:items-end @2xl:gap-0 @2xl:py-16">

          {/* LEFT — groom block, right-aligned on desktop */}
          <motion.div
            className="text-center @2xl:text-right @2xl:pb-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight"
              style={{ color: template.primary }}
            >
              {cfg.couple.groomName}
            </h1>
            <p className="font-ui mt-2 text-[10px] uppercase tracking-[0.25em] opacity-55">
              {cfg.couple.groomParents}
            </p>
          </motion.div>

          {/* CENTER — giant ampersand pillar with sacred symbol */}
          <div className="flex flex-col items-center justify-center py-4 @2xl:py-0 @2xl:px-10">
            {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
              <div
                className="mb-3 grid h-12 w-12 place-items-center rounded-full border-2 bg-white shadow-md"
                style={{ borderColor: template.gold }}
              >
                <CulturalEmblem symbol={cfg.blessing.symbol} color={template.primary} size={24} />
              </div>
            )}
            <span
              className="font-script text-[clamp(4rem,14vw,9rem)] leading-none select-none"
              style={{ color: template.gold }}
            >
              &amp;
            </span>
          </div>

          {/* RIGHT — bride block */}
          <motion.div
            className="text-center @2xl:text-left @2xl:pb-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight"
              style={{ color: template.primary }}
            >
              {cfg.couple.brideName}
            </h1>
            <p className="font-ui mt-2 text-[10px] uppercase tracking-[0.25em] opacity-55">
              {cfg.couple.brideParents}
            </p>
          </motion.div>
        </div>

        {/* Full-bleed editorial bottom bar */}
        <div
          className="relative overflow-hidden px-6 py-6 @2xl:px-16 @2xl:py-8"
          style={{ background: `${template.primary}0F` }}
        >
          <div className="mx-auto max-w-4xl flex flex-col items-center @2xl:flex-row @2xl:justify-between gap-3">
            <p className="font-editorial text-lg italic opacity-70 text-center @2xl:text-left">
              {cfg.couple.heroSubtitle}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px w-10" style={{ background: template.gold }} />
              <span className="font-ui text-[10px] uppercase tracking-[0.3em]" style={{ color: template.gold }}>
                {guestName}
              </span>
              <div className="h-px w-10" style={{ background: template.gold }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DATE REVEAL ── */}
      <section id="invite-sec-date" className="relative px-2 py-14" style={{ background: `${template.primary}0A` }}>
        {DateReveal}
      </section>

      {/* ── FUNCTIONS — full editorial strip ── */}
      <section id="invite-sec-functions" className="py-14">
        <div className="mb-6 flex items-center gap-4 px-6 @2xl:px-16">
          <div className="h-px flex-1" style={{ background: `${template.primary}30` }} />
          <span className="font-ui text-[10px] uppercase tracking-[0.4em] opacity-50">{copy.festivities}</span>
          <div className="h-px flex-1" style={{ background: `${template.primary}30` }} />
        </div>
        <FunctionCarousel functions={cfg.functions} heading="" />
      </section>

      {/* ── STORY ── */}
      {cfg.storyCarousel.length > 0 && (
        <section className="py-14" style={{ background: `${template.primary}08` }}>
          <StoryCarousel slides={cfg.storyCarousel} heading={copy.story} primary={template.primary} gold={template.gold} />
        </section>
      )}

      {/* ── GRAND RECEPTION + DRESS CODE — editorial 2-col split ── */}
      <div className="mx-auto max-w-md px-4 py-10 @2xl:grid @2xl:max-w-5xl @2xl:grid-cols-[55%_45%] @2xl:items-stretch @2xl:gap-0 @2xl:px-0 @2xl:py-14">
        {/* Grand Reception — full-bleed dark editorial card */}
        <section className="flex">
          <motion.div
            className="relative flex w-full flex-col items-start justify-end overflow-hidden p-8 @2xl:rounded-none text-white shadow-2xl min-h-[280px] @2xl:min-h-[380px]"
            style={{ background: `linear-gradient(160deg, ${template.primary} 0%, #0d0d0d 100%)`, borderRight: `1px solid ${template.gold}33` }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          >
            {/* Grid texture overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.5) 40px,rgba(255,255,255,0.5) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.5) 40px,rgba(255,255,255,0.5) 41px)`
            }} />
            <Sparkles size={20} style={{ color: template.gold }} className="mb-4 relative z-10" />
            <p className="font-ui text-[10px] uppercase tracking-[0.35em] relative z-10" style={{ color: template.gold }}>
              Finale Celebration
            </p>
            <h3 className="font-display mt-1 text-3xl @2xl:text-4xl font-bold relative z-10">
              {cfg.functions[cfg.functions.length - 1]?.name ?? "Grand Reception"}
            </h3>
            <p className="font-editorial mt-2 text-lg italic text-white/70 relative z-10">
              {cfg.functions[cfg.functions.length - 1]?.dayAndDate} · {cfg.functions[cfg.functions.length - 1]?.time}
            </p>
            <p className="font-ui mt-1 text-xs uppercase tracking-[0.2em] text-white/50 relative z-10">
              {cfg.functions[cfg.functions.length - 1]?.venueName ?? cfg.location.venueTitle}
            </p>
          </motion.div>
        </section>

        {/* Dress Code */}
        <section className="mt-6 flex @2xl:mt-0">
          <div className="w-full border p-7 @2xl:rounded-none" style={{ borderColor: `${template.gold}44`, background: "#FFFFFF" }}>
            <Shirt size={20} className="mx-auto @2xl:mx-0" style={{ color: template.primary }} />
            <h3 className="font-display mt-2 text-2xl font-bold text-[#161412] text-center @2xl:text-left">{copy.dressCode}</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FAF7F2] p-3.5">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: template.primary }}>Ladies</p>
                <p className="mt-1 text-[13px] leading-relaxed">{cfg.etiquetteAndDetails.ladiesDressNote}</p>
              </div>
              <div className="rounded-2xl bg-[#FAF7F2] p-3.5">
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: template.primary }}>Gentlemen</p>
                <p className="mt-1 text-[13px] leading-relaxed">{cfg.etiquetteAndDetails.gentlemenDressNote}</p>
              </div>
            </div>
            {cfg.etiquetteAndDetails.reservedColorsNote && (
              <p className="font-ui mt-3 rounded-2xl px-4 py-2.5 text-xs font-medium" style={{ background: `${template.primary}10`, color: template.primary }}>
                {cfg.etiquetteAndDetails.reservedColorsNote}
              </p>
            )}
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#FAF7F2] p-3.5 text-left text-[13px] text-[#161412]">
              <Gift size={15} className="mt-0.5 shrink-0" style={{ color: template.primary }} />
              <p><strong>Gift note:</strong> {cfg.etiquetteAndDetails.giftPreferenceNote}</p>
            </div>
            <a href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`} className="font-ui mt-3 inline-flex flex-wrap items-center gap-1.5 text-xs font-semibold underline" style={{ color: template.primary }}>
              <Phone size={13} /> {cfg.etiquetteAndDetails.organizerName} · {cfg.etiquetteAndDetails.organizerPhone}
            </a>
          </div>
        </section>
      </div>

      {/* ── VENUE + RSVP ── */}
      <div className="px-4 py-12 @2xl:px-10 @2xl:py-16" style={{ background: `${template.primary}0D` }}>
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
      <section className="px-6 pt-16 pb-24 @2xl:pb-16 text-center text-white" style={{ background: `linear-gradient(170deg, ${template.primary}, #161412)` }}>
        {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
          <div className="mb-3 flex justify-center">
            <CulturalEmblem symbol={cfg.blessing.symbol} color={template.gold} size={34} />
          </div>
        ) : <p className="font-display text-xl" style={{ color: template.gold }}>✦</p>}
        <h2 className="font-display mt-2 text-4xl font-bold">{copy.closing}</h2>
        <p className="font-editorial mt-2 text-lg italic text-white/75">{cfg.couple.closingFamilyLine}</p>
        <p className="font-ui mt-4 text-xs uppercase tracking-[0.3em] text-white/50">{cfg.couple.hashtag}</p>
        <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.24em] text-white/35">Crafted with love on Wedslash</p>
      </section>
    </div>
  );
}

export const EditorialLayout = memo(EditorialLayoutComponent);
