"use client";
/**
 * Cinematic Layout — 16:9 letterbox hero, film-strip event cards, grain overlay,
 * monochrome + accent palette. Feels like a movie title sequence.
 */
import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Phone, Shirt, Film, MapPin, Calendar } from "lucide-react";
import ParticleCanvas from "@/components/ParticleCanvas";
import { CulturalEmblem } from "@/components/icons/CulturalEmblems";
import IllustratedMapCard from "@/components/mechanics/IllustratedMapCard";
import RsvpForm from "@/components/mechanics/RsvpForm";
import StoryCarousel from "@/components/mechanics/StoryCarousel";
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

/** Grain canvas overlay for cinematic texture */
function GrainOverlay() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    function draw() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.random() * 28; // very light grain
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay opacity-30" />;
}

function CinematicLayoutComponent({ cfg, template, guestName, copy, Gate, DateReveal }: Props) {
  const fns = cfg.functions;

  return (
    <div className="@container relative overflow-x-clip bg-[#0a0a0a]" style={{ color: "#F8F4EE" }}>

      {/* ── ENTRY GATE ── */}
      <section id="invite-sec-gate" className="relative min-h-[min(580px,82dvh)] @2xl:min-h-[640px] overflow-hidden">
        {Gate}
      </section>

      {/* ── CINEMATIC HERO — letterbox format with film sprocket holes ── */}
      <section id="invite-sec-hero" className="relative overflow-hidden">
        <ParticleCanvas type={cfg.mechanics.particleType} density={15} />
        <GrainOverlay />

        {/* Letterbox bars */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 @2xl:h-10 bg-black z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 @2xl:h-10 bg-black z-10" />

        {/* Film sprocket decorations — desktop only */}
        <div className="hidden @2xl:flex absolute left-0 top-0 bottom-0 w-10 flex-col justify-around items-center bg-black z-10 py-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-5 w-6 rounded-sm border border-white/20 bg-white/5" />
          ))}
        </div>
        <div className="hidden @2xl:flex absolute right-0 top-0 bottom-0 w-10 flex-col justify-around items-center bg-black z-10 py-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-5 w-6 rounded-sm border border-white/20 bg-white/5" />
          ))}
        </div>

        <div className="relative z-20 flex min-h-[340px] @2xl:min-h-[500px] flex-col items-center justify-center px-14 @2xl:px-24 py-16 text-center">
          {/* Sacred symbol */}
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
            <motion.div
              className="mb-6 grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CulturalEmblem symbol={cfg.blessing.symbol} color={template.gold} size={28} />
            </motion.div>
          )}

          {/* Names in cinematic wide font */}
          <motion.div
            className="font-display"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[clamp(2.4rem,7vw,6rem)] font-bold tracking-tight leading-[0.9]" style={{ color: "#F8F4EE" }}>
              {cfg.couple.groomName}
            </div>
            <div className="font-script text-[clamp(2rem,5vw,3.5rem)] my-1" style={{ color: template.gold }}>
              &amp;
            </div>
            <div className="text-[clamp(2.4rem,7vw,6rem)] font-bold tracking-tight leading-[0.9]" style={{ color: "#F8F4EE" }}>
              {cfg.couple.brideName}
            </div>
          </motion.div>

          {/* Guest name ticker */}
          <motion.p
            className="font-ui mt-6 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: template.gold }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            A personal invitation for {guestName}
          </motion.p>

          <p className="font-editorial mt-3 text-base italic text-white/50">{cfg.couple.heroSubtitle}</p>
        </div>
      </section>

      {/* ── DATE REVEAL (kept on dark cinematic bg) ── */}
      <section id="invite-sec-date" className="relative px-2 py-14 bg-[#0d0d0d]">
        {DateReveal}
      </section>

      {/* ── FILM STRIP EVENTS — horizontal scrolling filmstrip cards ── */}
      <section id="invite-sec-functions" className="py-16 overflow-hidden">
        <div className="flex items-center gap-4 px-6 mb-8 @2xl:px-16">
          <Film size={16} style={{ color: template.gold }} />
          <span className="font-ui text-[10px] uppercase tracking-[0.4em] text-white/40">{copy.festivities}</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Horizontal filmstrip */}
        <div className="relative">
          {/* Strip holes top and bottom */}
          <div className="absolute top-0 inset-x-0 h-6 flex gap-2 px-3 items-center overflow-hidden opacity-20">
            {Array.from({ length: 50 }).map((_, i) => <div key={i} className="h-4 w-6 shrink-0 rounded-sm border border-white/40" />)}
          </div>
          <div className="absolute bottom-0 inset-x-0 h-6 flex gap-2 px-3 items-center overflow-hidden opacity-20">
            {Array.from({ length: 50 }).map((_, i) => <div key={i} className="h-4 w-6 shrink-0 rounded-sm border border-white/40" />)}
          </div>

          {/* Event cards in horizontal strip */}
          <div className="flex gap-4 overflow-x-auto px-6 py-6 @2xl:px-16 scrollbar-none snap-x snap-mandatory">
            {fns.map((fn, i) => (
              <motion.div
                key={fn.id}
                className="shrink-0 snap-center w-[260px] @2xl:w-[300px] rounded-2xl overflow-hidden border border-white/10"
                style={{ background: `${fn.cardThemeColor || template.primary}20` }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Frame number */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-white/30">Frame {String(i + 1).padStart(2, "0")}</span>
                  <span className="font-ui text-[9px] text-white/20">●</span>
                </div>
                <div className="p-5">
                  <Calendar size={14} className="mb-2" style={{ color: template.gold }} />
                  <h3 className="font-display text-xl font-bold text-white leading-tight">{fn.name}</h3>
                  <p className="font-ui mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">{fn.dayAndDate}</p>
                  <p className="font-editorial mt-1 text-base italic text-white/60">{fn.time}</p>
                  <p className="font-ui mt-2 text-xs text-white/40 leading-relaxed">{fn.venueName}</p>
                  {/* Dress swatch strip */}
                  <div className="mt-4 flex gap-1.5">
                    {fn.dressCodeColors.map((c, ci) => (
                      <div key={ci} className="h-3 w-3 rounded-full border border-white/20" style={{ background: c }} />
                    ))}
                    <span className="ml-1 font-ui text-[10px] text-white/35 self-center">{fn.dressCodeLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      {cfg.storyCarousel.length > 0 && (
        <section className="py-14 bg-[#0d0d0d]">
          <StoryCarousel slides={cfg.storyCarousel} heading={copy.story} primary={template.primary} gold={template.gold} />
        </section>
      )}

      {/* ── GRAND RECEPTION — cinematic poster style ── */}
      <section className="relative overflow-hidden py-20 px-6 @2xl:px-20 text-center">
        <GrainOverlay />
        <div className="relative z-10 mx-auto max-w-2xl">
          <Sparkles size={24} style={{ color: template.gold }} className="mx-auto mb-6" />
          <p className="font-ui text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: template.gold }}>
            Finale Night
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-bold text-white leading-[0.95]">
            {cfg.functions[fns.length - 1]?.name ?? "Grand Reception"}
          </h2>
          <p className="font-editorial mt-4 text-xl italic text-white/60">
            {cfg.functions[fns.length - 1]?.dayAndDate} · {cfg.functions[fns.length - 1]?.time}
          </p>
          <p className="font-ui mt-2 text-sm text-white/40 uppercase tracking-[0.2em]">
            {cfg.functions[fns.length - 1]?.venueName ?? cfg.location.venueTitle}
          </p>

          <div className="mt-10 grid grid-cols-1 @2xl:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Shirt size={16} className="mb-3" style={{ color: template.gold }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{copy.dressCode}</p>
              <p className="font-editorial text-sm italic text-white/70">{cfg.etiquetteAndDetails.ladiesDressNote}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Gift size={16} className="mb-3" style={{ color: template.gold }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Gift Note</p>
              <p className="font-editorial text-sm italic text-white/70">{cfg.etiquetteAndDetails.giftPreferenceNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VENUE + RSVP ── */}
      <div className="px-4 py-12 @2xl:px-10 @2xl:py-16 bg-[#0d0d0d]">
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
      <section className="relative overflow-hidden px-6 pt-16 pb-24 @2xl:pb-16 text-center text-white bg-black">
        <GrainOverlay />
        <div className="relative z-10">
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
            <div className="mb-3 flex justify-center"><CulturalEmblem symbol={cfg.blessing.symbol} color={template.gold} size={34} /></div>
          ) : <p className="font-display text-2xl" style={{ color: template.gold }}>— ✦ —</p>}
          <h2 className="font-display mt-2 text-4xl font-bold">{copy.closing}</h2>
          <p className="font-editorial mt-2 text-lg italic text-white/60">{cfg.couple.closingFamilyLine}</p>
          <p className="font-ui mt-4 text-xs uppercase tracking-[0.3em] text-white/35">{cfg.couple.hashtag}</p>
          <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.24em] text-white/20">Crafted with love on Wedslash</p>
        </div>
      </section>
    </div>
  );
}

export const CinematicLayout = memo(CinematicLayoutComponent);
