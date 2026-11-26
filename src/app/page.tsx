"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Hand,
  Sparkles,
  Users,
  Globe,
  MousePointerClick,
  Star,
  Check,
  Camera,
  Plane,
  Flower2,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import TemplateCard from "@/components/TemplateCard";
import BookGate from "@/components/mechanics/BookGate";
import TasselScroll from "@/components/mechanics/TasselScroll";
import ScratchCard from "@/components/mechanics/ScratchCard";
import BrushPetalsReveal from "@/components/mechanics/BrushPetalsReveal";
import PolaroidDevelop from "@/components/mechanics/PolaroidDevelop";
import BoardingPass from "@/components/mechanics/BoardingPass";
import ParticleCanvas from "@/components/ParticleCanvas";

const HERO_DEMOS = [
  { id: "book", label: "3D Book", hint: "Tap the velvet cover to open" },
  { id: "tassel", label: "Tassel", hint: "Pull or tap the silk tassel" },
  { id: "scratch", label: "Scratch", hint: "Scratch the 3 gold foil circles" },
  { id: "petals", label: "Petals", hint: "Brush petals aside to uncover the date" },
  { id: "polaroid", label: "Polaroid", hint: "Tap to develop the instant film" },
  { id: "boarding", label: "Boarding", hint: "Flip between ticket & passport stamp" },
] as const;

type HeroDemoId = (typeof HERO_DEMOS)[number]["id"];

export default function Home() {
  const [heroDemo, setHeroDemo] = useState<HeroDemoId>("book");
  const featured = TEMPLATES.slice(0, 6);
  const currentDemoMeta =
    HERO_DEMOS.find((d) => d.id === heroDemo) ?? HERO_DEMOS[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline paper-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 lg:grid-cols-2 lg:pt-16">
          <div>
            <p className="font-ui inline-flex items-center gap-2 rounded-full border hairline bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6E1F2F]">
              <Sparkles size={13} /> 16 couture templates · Zero code
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Invitations your guests{" "}
              <em className="gold-text not-italic font-bold">
                open, tap &amp; pull
              </em>{" "}
              — not just read.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#6E655F]">
              Wedslash turns weddings into cinematic phone experiences — a 3D velvet book that swings open, a tassel you pull to reveal the date, foil you scratch, petals you brush away. One link, unlimited guests, live RSVPs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="font-ui inline-flex items-center gap-2 rounded-full bg-[#6E1F2F] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-xl transition hover:bg-[#161412]"
              >
                Create my invite <ArrowRight size={16} />
              </Link>
              <Link
                href="/templates"
                className="font-ui inline-flex items-center gap-2 rounded-full border border-[#161412]/20 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]"
              >
                <BookOpen size={16} /> Browse 16 templates
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["2,200+", "invites delivered"],
                ["35+", "countries"],
                ["4.9★", "guest rating"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-3xl font-bold">{v}</p>
                  <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Phone Stage */}
          <div className="relative mx-auto w-full max-w-[380px]">
            <div
              className="mb-3 grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:justify-center"
              role="tablist"
              aria-label="Test live invitation mechanics"
            >
              {HERO_DEMOS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={heroDemo === d.id}
                  onClick={() => setHeroDemo(d.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 font-ui text-[11px] font-bold uppercase tracking-wider transition ${
                    heroDemo === d.id
                      ? "bg-[#6E1F2F] text-white shadow"
                      : "border hairline bg-white text-[#161412] hover:border-[#161412]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div
              className="pointer-events-none absolute -inset-6 top-8 rounded-[3rem]"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(110, 31, 47, 0.14) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 72%)",
              }}
              aria-hidden="true"
            />
            <div
              className="relative mx-auto max-w-[350px] overflow-hidden rounded-[2.6rem] border-[10px] border-[#161412] bg-[#FDF3EC] shadow-[0_36px_70px_-28px_rgba(22,20,18,0.45)]"
              style={{ height: 610 }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#161412]"
                aria-hidden="true"
              />
              {heroDemo === "book" && (
                <BookGate
                  groom="Arjun"
                  bride="Priya"
                  groomParents="Son of Rajesh & Sunita Sharma"
                  brideParents="Daughter of Vikram & Meera Kapoor"
                  guestName="You ♡"
                  compact
                />
              )}
              {heroDemo === "tassel" && (
                <div className="flex h-full items-center justify-center bg-[#FFF9EF] pt-6">
                  <TasselScroll
                    dateLabel="Fri, 13 Feb 2027"
                    muhurat="Pheras at 7:30 PM"
                    target="2027-02-13T19:30:00"
                    title="Arjun weds Priya"
                    venue="Lake Pichola Palace, Udaipur"
                  />
                </div>
              )}
              {heroDemo === "scratch" && (
                <div className="flex h-full items-center justify-center bg-[#FDF8EF] pt-6">
                  <ScratchCard
                    day="13"
                    month="FEB"
                    year="2027"
                    venue="Lake Pichola Palace · 7:30 PM"
                    target="2027-02-13T19:30:00"
                    title="Arjun weds Priya"
                  />
                </div>
              )}
              {heroDemo === "petals" && (
                <div className="flex h-full items-center justify-center bg-[#FDF0F3] pt-6">
                  <BrushPetalsReveal
                    dateLabel="Fri, 13 Feb 2027"
                    muhurat="Pheras at 7:30 PM"
                    venue="Lake Pichola Palace"
                    target="2027-02-13T19:30:00"
                    title="Arjun weds Priya"
                    compact
                  />
                </div>
              )}
              {heroDemo === "polaroid" && (
                <div className="flex h-full items-center justify-center bg-[#F6F1E6] pt-6">
                  <PolaroidDevelop
                    groom="Luca"
                    bride="Maya"
                    dateLabel="27 · 07 · 27"
                    venue="Villa Borghese · Rome"
                    target="2027-07-27T17:00:00"
                    title="Luca & Maya"
                    compact
                  />
                </div>
              )}
              {heroDemo === "boarding" && (
                <div className="flex h-full items-center justify-center bg-[#0F2440] pt-6">
                  <BoardingPass
                    guestName="You ♡"
                    groom="Marcus"
                    bride="Elisabeth"
                    departureCode="DEL"
                    departureCity="Your City"
                    arrivalCode="MEX"
                    arrivalCity="Puerto Vallarta"
                    targetDate="2027-05-05T17:00:00"
                    compact
                  />
                </div>
              )}
            </div>
            <p className="font-ui mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#6E655F]">
              <MousePointerClick size={14} /> Live demo — {currentDemoMeta.hint}
            </p>
          </div>
        </div>
      </section>

      {/* MECHANICS STRIP */}
      <section className="border-b hairline bg-[#161412] py-14 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#C59B27]">
                Signature mechanics
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold">
                Every gesture feels tactile and unforgettable
              </h2>
            </div>
            <Link
              href="/templates"
              className="font-ui inline-flex items-center gap-1.5 text-sm font-semibold text-[#F6E27A]"
            >
              Try them all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                t: "3D Velvet Book Open",
                d: "Wine-velvet hardcover with cultural SVG emblem swings open in 3D as petals fall and music fades up.",
              },
              {
                icon: Hand,
                t: "Pull-the-Tassel Scroll",
                d: "Drag the silk tassel down a golden rod — parchment unrolls to reveal your date with confetti.",
              },
              {
                icon: Sparkles,
                t: "Scratch-to-Reveal Foil",
                d: "Three metallic circles or a golden heart guests scratch with a finger to uncover Day · Month · Year.",
              },
              {
                icon: Flower2,
                t: "Brush-the-Petals",
                d: "Interactive rose or marigold petals cover the date — guests brush them away to uncover what's beneath.",
              },
              {
                icon: Camera,
                t: "Polaroid Tap-to-Develop",
                d: "Vintage instant film starts dark, flashes on tap, and develops cleanly into your date & venue.",
              },
              {
                icon: Plane,
                t: "Boarding Pass & Passport",
                d: "Flippable airline ticket with perforated stub, spinning compass rose, and takeoff countdown.",
              },
              {
                icon: Users,
                t: "Personalized Guest Links",
                d: "?guest=The+Sharma+Family greets every guest by name on the cover and pre-fills their RSVP.",
              },
              {
                icon: Globe,
                t: "One Link · Any Language",
                d: "English, Hindi, Hinglish, Arabic, French, Spanish. No app needed — link, QR, or Netlify ZIP.",
              },
            ].map((m) => (
              <div
                key={m.t}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-[#C59B27]/50"
              >
                <m.icon size={22} className="text-[#F6E27A]" />
                <h3 className="font-display mt-3 text-xl font-bold">{m.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLATES */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">
              The collection
            </p>
            <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">
              Sixteen templates. Zero boring ones.
            </h2>
          </div>
          <Link
            href="/templates"
            className="font-ui inline-flex items-center gap-1.5 rounded-full border hairline bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em]"
          >
            View all 16 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => (
            <TemplateCard key={t.id} t={t} index={i} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y hairline bg-[#F0EAE1]/60 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">
              How it works
            </p>
            <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">
              From idea to gasp in 3 steps
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Pick & personalize",
                d: "Choose from 16 templates, then edit names, parents, functions, dress codes, story slides and music in the 7-tab studio — every keystroke previews live.",
              },
              {
                n: "02",
                t: "Publish or export ZIP",
                d: "Publish a wedslash.com link with printable QR code, or download a self-contained Netlify/Vercel ZIP bundle to host free forever.",
              },
              {
                n: "03",
                t: "Send & track RSVPs",
                d: "Fire personalized WhatsApp invites (?guest=…) and watch Yes / No / Tell-you-later, drinks, dietary and song requests roll into your CRM.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border hairline bg-white p-7"
              >
                <p className="font-display text-5xl font-bold text-[#6E1F2F]/15">
                  {s.n}
                </p>
                <h3 className="font-display -mt-3 text-2xl font-bold">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6E655F]">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">
            Loved worldwide
          </p>
          <h2 className="font-display mt-2 text-4xl font-bold">
            5.0 ★ from 2,200+ celebrations
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              q: "Guests kept scratching the date circles again and again — my mother-in-law thought it was magic.",
              n: "Ananya & Rohan",
              w: "Wine Velvet Royal Book · Udaipur",
            },
            {
              q: "The boarding-pass invite for our Mexico wedding got more replies in a day than paper got in a month.",
              n: "Elisabeth & Marcus",
              w: "Destination Love · Puerto Vallarta",
            },
            {
              q: "Pulling the tassel to reveal our Nikaah date made my grandmother cry. Worth every rupee.",
              n: "Zohan & Rose",
              w: "The Sacred Garden · New York",
            },
          ].map((r) => (
            <figure
              key={r.n}
              className="rounded-3xl border hairline bg-white p-7"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#C59B27] text-[#C59B27]"
                  />
                ))}
              </div>
              <blockquote className="font-editorial mt-3 text-lg italic leading-relaxed">
                “{r.q}”
              </blockquote>
              <figcaption className="font-ui mt-4 text-xs font-bold uppercase tracking-[0.14em]">
                {r.n}
                <span className="block font-normal normal-case tracking-normal text-[#6E655F]">
                  {r.w}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#6E1F2F] py-20 text-center text-white">
        <ParticleCanvas type="gold-dust" density={22} />
        <div className="relative mx-auto max-w-2xl px-5">
          <p className="font-ui text-xs font-bold uppercase tracking-[0.28em] text-[#F6E27A]">
            Ready when you are
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Your guests&apos; first gasp starts here.
          </h2>
          <p className="font-ui mt-3 text-[15px] text-white/70">
            Free studio · No card · Publish or export ZIP in minutes
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/studio"
              className="font-ui inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#6E1F2F] transition hover:bg-[#F6E27A] hover:text-[#161412]"
            >
              <Check size={16} /> Start creating — free
            </Link>
            <Link
              href="/invite/wine-velvet-book"
              className="font-ui inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] transition hover:bg-white/10"
            >
              See a live invite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
