"use client";
/**
 * Dark Cosmos Layout — near-black background, glowing nebula particles,
 * luminous minimal typography, celestial geometry. Feels otherworldly & sacred.
 */
import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Phone, Shirt, Star } from "lucide-react";
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

/** Animated star field canvas */
function StarField({ gold }: { gold: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars: { x: number; y: number; r: number; a: number; da: number }[] = [];
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 * devicePixelRatio,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.008,
      });
    }
    let raf = 0;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // Occasional golden star
        ctx.fillStyle = Math.random() > 0.97 ? gold : `rgba(255,255,255,${s.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const obs = new ResizeObserver(resize);
    obs.observe(canvas);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [gold]);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function DarkCosmosLayoutComponent({ cfg, template, guestName, copy, Gate, DateReveal }: Props) {
  const fns = cfg.functions;
  const cosmicPrimary = template.primary;
  const cosmicGold = template.gold;

  return (
    <div className="@container relative overflow-x-clip" style={{ background: "#07070F", color: "#E8E2D6" }}>

      {/* ── ENTRY GATE ── */}
      <section id="invite-sec-gate" className="relative min-h-[min(580px,82dvh)] @2xl:min-h-[640px] overflow-hidden">
        {Gate}
      </section>

      {/* ── COSMOS HERO — star field, glowing names, celestial orb ── */}
      <section id="invite-sec-hero" className="relative overflow-hidden min-h-[420px] @2xl:min-h-[560px]">
        <StarField gold={cosmicGold} />

        {/* Nebula radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${cosmicPrimary}22 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[420px] @2xl:min-h-[560px] px-6 @2xl:px-20 py-16 text-center">
          {/* Sacred symbol in glowing orb */}
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
            <motion.div
              className="mb-8 relative"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="grid h-20 w-20 place-items-center rounded-full border border-white/10"
                style={{
                  background: `radial-gradient(circle, ${cosmicPrimary}44 0%, ${cosmicPrimary}11 70%)`,
                  boxShadow: `0 0 40px ${cosmicGold}44, 0 0 80px ${cosmicPrimary}22`,
                }}
              >
                <CulturalEmblem symbol={cfg.blessing.symbol} color={cosmicGold} size={36} />
              </div>
            </motion.div>
          )}

          {/* Groom name */}
          <motion.h1
            className="font-display text-[clamp(3rem,9vw,7rem)] font-bold leading-[0.9] tracking-tight"
            style={{
              color: "#F0EAE0",
              textShadow: `0 0 60px ${cosmicGold}60`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {cfg.couple.groomName}
          </motion.h1>

          <motion.span
            className="font-script text-[clamp(2.5rem,6vw,4rem)] my-2"
            style={{ color: cosmicGold, textShadow: `0 0 30px ${cosmicGold}80` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            &amp;
          </motion.span>

          {/* Bride name */}
          <motion.h1
            className="font-display text-[clamp(3rem,9vw,7rem)] font-bold leading-[0.9] tracking-tight"
            style={{
              color: "#F0EAE0",
              textShadow: `0 0 60px ${cosmicGold}60`,
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {cfg.couple.brideName}
          </motion.h1>

          <motion.p
            className="font-ui mt-6 text-[11px] uppercase tracking-[0.4em] text-white/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {copy.together} · {guestName}
          </motion.p>

          <p className="font-editorial mt-3 text-base italic text-white/35">{cfg.couple.heroSubtitle}</p>

          {/* Orbital ring decoration */}
          <div
            className="mt-8 h-px w-24 mx-auto opacity-30"
            style={{ background: `linear-gradient(90deg, transparent, ${cosmicGold}, transparent)` }}
          />
        </div>
      </section>

      {/* ── DATE REVEAL ── */}
      <section id="invite-sec-date" className="relative px-2 py-14" style={{ background: "#0a0a14" }}>
        {DateReveal}
      </section>

      {/* ── CONSTELLATION EVENTS — dark glowing cards ── */}
      <section id="invite-sec-functions" className="py-16 px-4 @2xl:px-12">
        <div className="flex items-center gap-4 mb-10">
          <Star size={14} style={{ color: cosmicGold }} />
          <span className="font-ui text-[10px] uppercase tracking-[0.4em] text-white/30">{copy.festivities}</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {fns.map((fn, i) => (
            <motion.div
              key={fn.id}
              className="relative overflow-hidden rounded-3xl border p-6"
              style={{
                borderColor: `${cosmicGold}22`,
                background: `radial-gradient(ellipse at top left, ${fn.cardThemeColor || cosmicPrimary}18 0%, rgba(255,255,255,0.03) 70%)`,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow dot */}
              <div
                className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-30 blur-2xl"
                style={{ background: fn.cardThemeColor || cosmicPrimary }}
              />

              <div className="relative z-10">
                <span
                  className="font-ui text-[9px] uppercase tracking-[0.4em] font-bold"
                  style={{ color: cosmicGold }}
                >
                  {String(i + 1).padStart(2, "0")} / {String(fns.length).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-2 text-2xl font-bold text-white/90 leading-tight">
                  {fn.name}
                </h3>
                <p className="font-ui mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">{fn.dayAndDate}</p>
                <p className="font-editorial mt-1 text-base italic text-white/55">{fn.time}</p>
                <p className="font-ui mt-2 text-xs text-white/35">{fn.venueName}</p>
                <div className="mt-4 flex gap-2 items-center">
                  {fn.dressCodeColors.map((c, ci) => (
                    <div key={ci} className="h-3 w-3 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}80` }} />
                  ))}
                  <span className="font-ui text-[10px] text-white/30 ml-1">{fn.dressCodeLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      {cfg.storyCarousel.length > 0 && (
        <section className="py-14 bg-[#0a0a14]">
          <StoryCarousel slides={cfg.storyCarousel} heading={copy.story} primary={template.primary} gold={template.gold} />
        </section>
      )}

      {/* ── GRAND RECEPTION ── */}
      <section className="relative overflow-hidden px-6 py-20 @2xl:px-20 text-center">
        <StarField gold={cosmicGold} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${cosmicPrimary}30 0%, transparent 70%)` }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <Sparkles size={22} style={{ color: cosmicGold, filter: `drop-shadow(0 0 10px ${cosmicGold})` }} className="mx-auto mb-6" />
          <p className="font-ui text-[10px] uppercase tracking-[0.5em] mb-3 text-white/40">Finale Night</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-bold text-white leading-[0.95]" style={{ textShadow: `0 0 60px ${cosmicGold}50` }}>
            {fns[fns.length - 1]?.name ?? "Grand Reception"}
          </h2>
          <p className="font-editorial mt-4 text-xl italic text-white/50">{fns[fns.length - 1]?.dayAndDate} · {fns[fns.length - 1]?.time}</p>
          <p className="font-ui mt-2 text-sm uppercase tracking-[0.2em] text-white/30">{fns[fns.length - 1]?.venueName ?? cfg.location.venueTitle}</p>
          
          <div className="mt-10 grid grid-cols-1 @2xl:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <Shirt size={15} className="mb-3" style={{ color: cosmicGold }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">{copy.dressCode}</p>
              <p className="text-sm text-white/55 leading-relaxed">{cfg.etiquetteAndDetails.ladiesDressNote}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <Gift size={15} className="mb-3" style={{ color: cosmicGold }} />
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Gift Note</p>
              <p className="text-sm text-white/55 leading-relaxed">{cfg.etiquetteAndDetails.giftPreferenceNote}</p>
            </div>
          </div>
          <a href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`} className="font-ui mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors">
            <Phone size={12} /> {cfg.etiquetteAndDetails.organizerName} · {cfg.etiquetteAndDetails.organizerPhone}
          </a>
        </div>
      </section>

      {/* ── VENUE + RSVP ── */}
      <div className="px-4 py-12 @2xl:px-10 @2xl:py-16 bg-[#0a0a14]">
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
      <section className="relative overflow-hidden px-6 pt-16 pb-24 @2xl:pb-16 text-center text-white bg-[#07070F]">
        <StarField gold={cosmicGold} />
        <div className="relative z-10">
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
            <div className="mb-3 flex justify-center">
              <CulturalEmblem symbol={cfg.blessing.symbol} color={cosmicGold} size={34} />
            </div>
          ) : (
            <p className="font-display text-2xl" style={{ color: cosmicGold, textShadow: `0 0 20px ${cosmicGold}` }}>✦</p>
          )}
          <h2 className="font-display mt-2 text-4xl font-bold text-white/90">{copy.closing}</h2>
          <p className="font-editorial mt-2 text-lg italic text-white/50">{cfg.couple.closingFamilyLine}</p>
          <p className="font-ui mt-4 text-xs uppercase tracking-[0.3em] text-white/30">{cfg.couple.hashtag}</p>
          <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.24em] text-white/15">Crafted with love on Wedslash</p>
        </div>
      </section>
    </div>
  );
}

export const DarkCosmosLayout = memo(DarkCosmosLayoutComponent);
