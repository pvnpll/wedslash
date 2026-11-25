"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, Crown, PenTool, Star } from "lucide-react";

const TIERS = [
  { icon: Zap, name: "Save the Date", price: "₹1,499", sub: "€35 · one-time", time: "Ready in 3–5 days · Express 24–48h", features: ["Interactive scratch / petal / polaroid reveal", "Your names, date & venue", "Unlimited guests · one link", "Any language", "QR code for print"], cta: "Start free in Studio", href: "/studio", hot: false },
  { icon: Crown, name: "Template Invitation", price: "₹2,999", sub: "€75 · one-time", time: "Ready in 4–7 days · Express 1–2 days", features: ["Any of 16 couture templates, made yours", "3D book / tassel / scratch / boarding pass", "Multi-event itinerary + dress codes + maps", "Live RSVP dashboard + WhatsApp sync", "Unlimited revisions & guests", "Personal designer portal"], cta: "Customize a template", href: "/templates", hot: true },
  { icon: PenTool, name: "100% Bespoke Custom", price: "₹6,499", sub: "€155 · one-time", time: "Ready in 1–2 weeks · Express 2–4 days", features: ["Original design from scratch, only for you", "Custom illustrations & animations", "Your fonts, flowers, music & story", "Priority designer + updates till wedding day", "Everything in Template tier"], cta: "Talk to a designer", href: "/studio", hot: false },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">Pricing · one link, unlimited guests</p>
        <h1 className="font-display mx-auto mt-2 max-w-2xl text-4xl font-bold sm:text-5xl">Paper costs per head. Wedslash doesn&apos;t.</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-[#6E655F]">One-time payment, no per-guest fees. Send to 50 or 50,000 guests — same price. Prefer DIY? The studio + Netlify ZIP export are free forever.</p>
      </motion.div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`relative rounded-[2rem] p-8 ${t.hot ? "bg-[#161412] text-white shadow-2xl lg:-my-3 lg:py-11" : "border hairline bg-white"}`}>
            {t.hot && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#6E1F2F] px-4 py-1 font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-white">Most popular</span>}
            <t.icon size={26} className={t.hot ? "text-[#F6E27A]" : "text-[#6E1F2F]"} />
            <h2 className="font-display mt-3 text-3xl font-bold">{t.name}</h2>
            <p className={`font-display mt-1 text-5xl font-bold ${t.hot ? "gold-text" : ""}`}>{t.price}</p>
            <p className={`font-ui mt-1 text-xs ${t.hot ? "text-white/60" : "text-[#6E655F]"}`}>{t.sub} · {t.time}</p>
            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm"><Check size={16} className={`mt-0.5 shrink-0 ${t.hot ? "text-[#F6E27A]" : "text-[#2E7D32]"}`} /><span className={t.hot ? "text-white/85" : ""}>{f}</span></li>
              ))}
            </ul>
            <Link href={t.href} className={`font-ui mt-7 block rounded-full py-3.5 text-center text-xs font-bold uppercase tracking-[0.12em] transition ${t.hot ? "bg-[#F6E27A] text-[#161412] hover:bg-white" : "bg-[#161412] text-white hover:bg-[#6E1F2F]"}`}>{t.cta}</Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-5 rounded-[2rem] border hairline bg-white p-8 md:grid-cols-3">
        {[
          { t: "Unlimited revisions", d: "Not happy? We change it. Again and again. Done when you say it's done." },
          { t: "Free updates till wedding day", d: "Venue changed the night before? Message us — updated in hours, free." },
          { t: "Real designer, by your side", d: "Not a chatbot. A human designer from first message to wedding morning." },
        ].map((v) => (
          <div key={v.t}><p className="font-display text-xl font-bold">{v.t}</p><p className="mt-1 text-sm text-[#6E655F]">{v.d}</p></div>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] bg-[#6E1F2F] p-10 text-center text-white">
        <div className="flex justify-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-[#F6E27A] text-[#F6E27A]" />)}</div>
        <p className="font-editorial mx-auto mt-3 max-w-xl text-2xl italic">“For 50 guests, paper costs €150–€400. Our digital invite starts at €65 — for any number of guests.”</p>
        <Link href="/studio" className="font-ui mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#6E1F2F] hover:bg-[#F6E27A] hover:text-[#161412]">Try the studio free</Link>
      </div>
    </div>
  );
}
