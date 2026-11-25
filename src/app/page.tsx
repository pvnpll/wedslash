"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Hand, Sparkles, Users, Zap, Globe, MousePointerClick, Star, Check } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import TemplateCard from "@/components/TemplateCard";
import BookGate from "@/components/mechanics/BookGate";
import ParticleCanvas from "@/components/ParticleCanvas";

const fade = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } };

export default function Home() {
  const featured = TEMPLATES.slice(0, 6);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline paper-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 lg:grid-cols-2 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-ui inline-flex items-center gap-2 rounded-full border hairline bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6E1F2F]">
              <Sparkles size={13} /> 16 couture templates · Zero code
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Invitations your guests <em className="gold-text not-italic font-bold">open, tap & pull</em> — not just read.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[#6E655F]">
              Wedslash turns weddings into cinematic phone experiences — a 3D velvet book that swings open, a tassel you pull to reveal the date, foil you scratch, petals you brush away. One link, unlimited guests, live RSVPs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/studio" className="font-ui inline-flex items-center gap-2 rounded-full bg-[#6E1F2F] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-xl transition hover:bg-[#161412]">
                Create my invite <ArrowRight size={16} />
              </Link>
              <Link href="/templates" className="font-ui inline-flex items-center gap-2 rounded-full border border-[#161412]/20 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]">
                <BookOpen size={16} /> Browse 16 templates
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[["2,200+", "invites delivered"], ["35+", "countries"], ["4.9★", "guest rating"]].map(([v, l]) => (
                <div key={l}><p className="font-display text-3xl font-bold">{v}</p><p className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">{l}</p></div>
              ))}
            </div>
          </motion.div>
          {/* live phone stage */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="relative mx-auto w-full max-w-[340px]">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#6E1F2F]/15 via-[#D4AF37]/15 to-transparent blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2.6rem] border-[10px] border-[#161412] bg-[#FDF3EC] shadow-[0_40px_80px_-30px_rgba(22,20,18,0.5)]" style={{ height: 620 }}>
              <div className="absolute left-1/2 top-2.5 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-[#161412]" aria-hidden />
              <BookGate groom="Arjun" bride="Priya" guestName="You ♡" compact />
            </div>
            <p className="font-ui mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#6E655F]">
              <MousePointerClick size={14} /> Live demo — tap the book
            </p>
          </motion.div>
        </div>
      </section>

      {/* MECHANICS STRIP */}
      <section className="border-b hairline bg-[#161412] py-14 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#C59B27]">Signature mechanics</p>
              <h2 className="font-display mt-2 text-4xl font-bold">Six ways to make guests gasp</h2>
            </div>
            <Link href="/templates" className="font-ui inline-flex items-center gap-1.5 text-sm font-semibold text-[#F6E27A]">Try them all <ArrowRight size={15} /></Link>
          </motion.div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, t: "3D Velvet Book Open", d: "Wine-velvet hardcover with gold emblem swings open in 3D, camera zooms in, petals fall, music fades up." },
              { icon: Hand, t: "Pull-the-Tassel Scroll", d: "Drag the silk tassel down a golden rod — the parchment unrolls to reveal your date with a petal burst." },
              { icon: Sparkles, t: "Scratch-to-Reveal Foil", d: "Three metallic circles for Day · Month · Year. Guests scratch with a finger, sparkles trail behind." },
              { icon: Zap, t: "Brush-the-Petals", d: "A pile of rose petals covers the date — guests brush them away to uncover what's beneath." },
              { icon: Users, t: "Personalized Guest Links", d: "?guest=The+Sharma+Family greets every guest by name on the cover and pre-fills their RSVP." },
              { icon: Globe, t: "One Link · Any Language", d: "English, Hindi, Hinglish, Arabic, French, Spanish. No app, no download — just a link or QR." },
            ].map((m) => (
              <motion.div key={m.t} {...fade} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-[#C59B27]/50">
                <m.icon size={22} className="text-[#F6E27A]" />
                <h3 className="font-display mt-3 text-xl font-bold">{m.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{m.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLATES */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">The collection</p>
            <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">Sixteen templates. Zero boring ones.</h2>
          </div>
          <Link href="/templates" className="font-ui inline-flex items-center gap-1.5 rounded-full border hairline bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em]">View all 16 <ArrowRight size={14} /></Link>
        </motion.div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => <TemplateCard key={t.id} t={t} index={i} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y hairline bg-[#F0EAE1]/60 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div {...fade} className="text-center">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">How it works</p>
            <h2 className="font-display mt-2 text-4xl font-bold sm:text-5xl">From idea to gasp in 3 steps</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Pick & personalize", d: "Choose from 16 templates, then edit names, parents, functions, dress codes, photos and music in the live studio — every keystroke previews instantly." },
              { n: "02", t: "Publish or export ZIP", d: "Get a wedslash.com link with QR code, or download a standalone ZIP to host free on Netlify or Vercel forever. Your call." },
              { n: "03", t: "Send & track RSVPs", d: "Fire personalized WhatsApp invites (?guest=…) and watch Yes / No / Tell-you-later, drinks, dietary and song requests roll into your dashboard." },
            ].map((s) => (
              <motion.div key={s.n} {...fade} className="rounded-3xl border hairline bg-white p-7">
                <p className="font-display text-5xl font-bold text-[#6E1F2F]/15">{s.n}</p>
                <h3 className="font-display -mt-3 text-2xl font-bold">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6E655F]">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <motion.div {...fade} className="text-center">
          <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">Loved worldwide</p>
          <h2 className="font-display mt-2 text-4xl font-bold">5.0 ★ from 2,200+ celebrations</h2>
        </motion.div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { q: "Guests kept scratching the date circles again and again — my mother-in-law thought it was magic.", n: "Ananya & Rohan", w: "Wine Velvet Royal Book · Udaipur" },
            { q: "The boarding-pass invite for our Mexico wedding got more replies in a day than paper got in a month.", n: "Elisabeth & Marcus", w: "Destination Love · Puerto Vallarta" },
            { q: "Pulling the tassel to reveal our Nikaah date made my grandmother cry. Worth every rupee.", n: "Zohan & Rose", w: "The Sacred Garden · New York" },
          ].map((r) => (
            <motion.figure key={r.n} {...fade} className="rounded-3xl border hairline bg-white p-7">
              <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-[#C59B27] text-[#C59B27]" />)}</div>
              <blockquote className="font-editorial mt-3 text-lg italic leading-relaxed">“{r.q}”</blockquote>
              <figcaption className="font-ui mt-4 text-xs font-bold uppercase tracking-[0.14em]">{r.n}<span className="block font-normal normal-case tracking-normal text-[#6E655F]">{r.w}</span></figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#6E1F2F] py-20 text-center text-white">
        <ParticleCanvas type="gold-dust" density={40} />
        <motion.div {...fade} className="relative mx-auto max-w-2xl px-5">
          <p className="font-ui text-xs font-bold uppercase tracking-[0.28em] text-[#F6E27A]">Ready when you are</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">Your guests&apos; first gasp starts here.</h2>
          <p className="font-ui mt-3 text-[15px] text-white/70">Free studio · No card · Publish in minutes</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/studio" className="font-ui inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#6E1F2F] transition hover:bg-[#F6E27A] hover:text-[#161412]">
              <Check size={16} /> Start creating — free
            </Link>
            <Link href="/invite/wine-velvet-book" className="font-ui inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] transition hover:bg-white/10">
              See a live invite
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
