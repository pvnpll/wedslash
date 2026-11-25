"use client";
import { useState } from "react";
import { MapPin, Copy, CheckCheck, Navigation, Music, VolumeX, Gift, Phone, Shirt } from "lucide-react";
import ParticleCanvas from "./ParticleCanvas";
import BookGate from "./mechanics/BookGate";
import EnvelopeGate from "./mechanics/EnvelopeGate";
import TasselScroll from "./mechanics/TasselScroll";
import ScratchCard from "./mechanics/ScratchCard";
import FunctionCarousel from "./mechanics/FunctionCarousel";
import BoardingPass from "./mechanics/BoardingPass";
import RsvpForm from "./mechanics/RsvpForm";
import Countdown from "./Countdown";
import { useInvite } from "@/store/useInvite";
import type { Template } from "@/lib/templates";

export default function InviteRenderer({ template, guest }: { template: Template; guest: string }) {
  const s = useInvite();
  const cfg = s.config;
  const [muted, setMuted] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const guestName = guest || s.guestName;

  const isBook = cfg.mechanics.entryType === "velvet-book" || cfg.mechanics.entryType === "palace-doors";
  const isBoarding = cfg.mechanics.entryType === "boarding-pass";
  const isScratch = cfg.mechanics.dateRevealType === "scratch-3-circles" || cfg.mechanics.dateRevealType === "scratch-heart";

  const copyAddress = () => {
    navigator.clipboard?.writeText(`${cfg.location.venueTitle}, ${cfg.location.city}`);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 1800);
  };

  return (
    <div className="relative" style={{ background: template.bg, color: template.ink }}>
      {/* music pill */}
      <button onClick={() => setMuted(!muted)} aria-label="Toggle music"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#161412] px-4 py-2.5 font-ui text-xs font-semibold text-white shadow-xl">
        {muted ? <VolumeX size={14} /> : <Music size={14} className="animate-pulse" />} {muted ? "Muted" : "Our Song ♪"}
      </button>

      {/* ENTRY GATE */}
      <section className="relative h-[92dvh] min-h-[620px] overflow-hidden">
        {isBoarding ? (
          <div className="flex h-full flex-col items-center justify-center bg-[#0F2440] px-6 py-10 text-white">
            <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#F6E27A]">Boarding for {guestName}</p>
            <div className="mt-5 w-full"><BoardingPass guestName={guestName} /></div>
            <p className="font-ui mt-5 text-[11px] uppercase tracking-[0.3em] text-white/60">Scroll to board ↓</p>
          </div>
        ) : isBook ? (
          <BookGate groom={cfg.couple.groomName} bride={cfg.couple.brideName} guestName={guestName} primary={template.primary} gold={template.gold} />
        ) : (
          <EnvelopeGate guestName={guestName} primary={template.primary} gold={template.gold} />
        )}
      </section>

      {/* COUPLE HERO */}
      <section className="relative overflow-hidden px-6 py-16 text-center paper-grain">
        <ParticleCanvas type={cfg.mechanics.particleType} density={26} />
        <div className="relative mx-auto max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 bg-white shadow" style={{ borderColor: template.gold }}>
            <span className="font-display text-xl" style={{ color: template.primary }}>✦</span>
          </div>
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.3em] opacity-70">{cfg.blessing.inviteIntroLine}</p>
          <h1 className="font-display mt-2 text-6xl font-bold leading-[1.02]" style={{ color: template.primary }}>{cfg.couple.groomName}</h1>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{cfg.couple.groomParents}</p>
          <p className="font-script my-1 text-5xl" style={{ color: template.gold }}>&</p>
          <h1 className="font-display text-6xl font-bold leading-[1.02]" style={{ color: template.primary }}>{cfg.couple.brideName}</h1>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{cfg.couple.brideParents}</p>
          <p className="font-editorial mt-4 text-xl italic opacity-80">joyfully invite {guestName} to celebrate · {cfg.couple.hashtag}</p>
        </div>
      </section>

      {/* DATE REVEAL */}
      <section className="relative px-2 py-14" style={{ background: `${template.primary}0D` }}>
        {isScratch ? (
          <ScratchCard day="13" month="FEB" year="2027" venue={`${cfg.location.venueTitle} · ${cfg.couple.muhuratTime}`} foil={template.id === "timeless-grace" ? "silver" : "gold"} />
        ) : (
          <TasselScroll dateLabel={cfg.couple.dateDisplayLabel} muhurat={cfg.couple.muhuratTime} target={cfg.couple.weddingDate} title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`} venue={cfg.location.venueTitle} gold={template.gold} />
        )}
        {isScratch && <div className="mx-auto mt-6 max-w-md"><Countdown target={cfg.couple.weddingDate} title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`} venue={cfg.location.venueTitle} /></div>}
      </section>

      {/* FUNCTIONS */}
      <section className="py-14">
        <FunctionCarousel functions={cfg.functions} />
      </section>

      {/* DRESS CODE + ETIQUETTE */}
      <section className="mx-auto max-w-md px-6 py-10">
        <div className="rounded-3xl border p-6 text-center shadow-sm" style={{ borderColor: `${template.gold}55`, background: "#FFFFFF" }}>
          <Shirt size={22} className="mx-auto" style={{ color: template.primary }} />
          <h3 className="font-display mt-2 text-2xl font-bold">Dress Code</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-[#FAF7F2] p-3.5">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: template.primary }}>Ladies</p>
              <p className="mt-1 text-[13px] leading-relaxed">{cfg.etiquetteAndDetails.ladiesDressNote}</p>
            </div>
            <div className="rounded-2xl bg-[#FAF7F2] p-3.5">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: template.primary }}>Gentlemen</p>
              <p className="mt-1 text-[13px] leading-relaxed">{cfg.etiquetteAndDetails.gentlemenDressNote}</p>
            </div>
          </div>
          <p className="font-ui mt-3 rounded-full bg-[#6E1F2F]/8 px-4 py-2 text-xs font-medium text-[#6E1F2F]">{cfg.etiquetteAndDetails.reservedColorsNote}</p>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#FAF7F2] p-3.5 text-left text-[13px]">
            <Gift size={16} className="mt-0.5 shrink-0" style={{ color: template.primary }} />
            <p><strong>Gift note:</strong> {cfg.etiquetteAndDetails.giftPreferenceNote}</p>
          </div>
          <a href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`} className="font-ui mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline" style={{ color: template.primary }}>
            <Phone size={13} /> Wedding organizer: {cfg.etiquetteAndDetails.organizerName} · {cfg.etiquetteAndDetails.organizerPhone}
          </a>
        </div>
      </section>

      {/* LOCATION */}
      <section className="mx-auto max-w-md px-6 py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
          <div className="relative grid h-44 place-items-center" style={{ background: `linear-gradient(150deg, ${template.primary}, ${template.primary}BB)` }}>
            <svg viewBox="0 0 300 120" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M10,100 C80,20 140,110 200,45 S270,60 295,30" fill="none" stroke="#F6E27A" strokeWidth="2.5" strokeDasharray="7 6" opacity="0.9" />
            </svg>
            <span className="animate-bounce text-5xl" aria-hidden>📍</span>
          </div>
          <div className="p-5 text-center">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] opacity-60">Venue</p>
            <h3 className="font-display mt-1 text-2xl font-bold">{cfg.location.venueTitle}</h3>
            <p className="font-ui mt-0.5 flex items-center justify-center gap-1 text-[13px] opacity-70"><MapPin size={13} /> {cfg.location.city}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={cfg.location.googleMapsUrl} target="_blank" rel="noreferrer" className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full bg-[#161412] py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                <Navigation size={13} /> Directions
              </a>
              <button onClick={copyAddress} className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full border hairline py-2.5 text-xs font-bold uppercase tracking-wider">
                {copiedAddr ? <CheckCheck size={14} /> : <Copy size={13} />} {copiedAddr ? "Copied!" : "Copy address"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-12" style={{ background: `${template.primary}0D` }}>
        <RsvpForm guestName={guestName} hostPhone={cfg.rsvpConfig.whatsappHostNumber} />
      </section>

      {/* CLOSING */}
      <section className="px-6 py-16 text-center text-white" style={{ background: `linear-gradient(170deg, ${template.primary}, #161412)` }}>
        <p className="font-display text-xl" style={{ color: template.gold }}>✦</p>
        <h2 className="font-display mt-2 text-4xl font-bold">We can&apos;t wait to celebrate with you</h2>
        <p className="font-editorial mt-2 text-lg italic text-white/75">{cfg.couple.closingFamilyLine}</p>
        <p className="font-ui mt-4 text-xs uppercase tracking-[0.3em] text-white/50">{cfg.couple.hashtag}</p>
        <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.24em] text-white/35">Crafted with love on Wedslash</p>
      </section>
    </div>
  );
}
