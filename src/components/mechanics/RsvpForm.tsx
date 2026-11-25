"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, QrCode, Copy, CheckCheck } from "lucide-react";

const DRINKS = ["Champagne", "White Wine", "Red Wine", "Whiskey", "Cocktail", "Mocktail"];

export default function RsvpForm({ guestName, hostPhone = "919876543210", compact = false }: { guestName: string; hostPhone?: string; compact?: boolean }) {
  const [attendance, setAttendance] = useState("");
  const [name, setName] = useState(guestName);
  const [count, setCount] = useState(2);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [diet, setDiet] = useState("");
  const [song, setSong] = useState("");
  const [kids, setKids] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDrink = (d: string) => setDrinks((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  const waLink = () => {
    const msg = `Hello! This is ${name || guestName}.\nRSVP: ${attendance || "—"}\nGuests: ${count}\nDrinks: ${drinks.join(", ") || "—"}\nDietary: ${diet || "—"}\nKids: ${kids || "—"}\nSong request: ${song || "—"}`;
    return `https://wa.me/${hostPhone}?text=${encodeURIComponent(msg)}`;
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-full max-w-md rounded-3xl bg-[#161412] p-8 text-center text-white">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#2E7D32]"><Check size={26} /></span>
        <h3 className="font-display mt-4 text-3xl font-bold">Shukriya, {name || guestName}!</h3>
        <p className="font-ui mt-2 text-sm text-white/70">Your RSVP has been recorded. Show this pass at the venue entrance.</p>
        <div className="mx-auto mt-5 max-w-[220px] rounded-2xl bg-white p-4 text-[#161412]">
          <QrCode size={120} className="mx-auto" strokeWidth={1.2} />
          <p className="font-ui mt-2 text-[11px] font-bold uppercase tracking-[0.2em]">VIP Wedding Pass</p>
          <p className="font-display text-lg font-bold">{attendance === "later" ? "Tentative" : attendance === "yes" ? "Attending" : "Blessings"}</p>
          <p className="font-ui text-xs text-[#6E655F]">{count} guest{count > 1 ? "s" : ""} · WS-{Math.abs((name || guestName).length * 7919 % 8999 + 1000)}</p>
        </div>
        <button onClick={() => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="font-ui mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest">
          {copied ? <CheckCheck size={14} /> : <Copy size={14} />} {copied ? "Link copied" : "Copy invite link"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`mx-auto w-full ${compact ? "" : "max-w-md"} px-6`}>
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">Confirm Your Attendance</p>
      <h3 className="font-display mt-1 text-center text-3xl font-bold">Will you join us?</h3>
      <p className="font-ui mt-1 text-center text-xs text-[#6E655F]">Kindly respond before 20 January 2027</p>

      <div className="mt-5 space-y-4 rounded-3xl border hairline bg-white p-5 shadow-sm">
        <div>
          <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="font-ui mt-1.5 w-full rounded-xl border hairline bg-[#FAF7F2] px-4 py-3 text-sm outline-none focus:border-[#6E1F2F]" />
        </div>
        <div>
          <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Will you come?</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[{ v: "yes", l: "Joyfully accepts" }, { v: "no", l: "Regretfully declines" }, { v: "later", l: "Tell you later" }].map((o) => (
              <button key={o.v} onClick={() => setAttendance(o.v)}
                className={`rounded-xl border px-2 py-3 font-ui text-xs font-semibold transition ${attendance === o.v ? "border-[#6E1F2F] bg-[#6E1F2F] text-white shadow" : "hairline bg-[#FAF7F2] hover:border-[#6E1F2F]/40"}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {attendance === "yes" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Guests attending</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCount(Math.max(1, count - 1))} className="grid h-8 w-8 place-items-center rounded-full border hairline text-lg">−</button>
                  <span className="font-display text-xl font-bold">{count}</span>
                  <button onClick={() => setCount(Math.min(10, count + 1))} className="grid h-8 w-8 place-items-center rounded-full border hairline text-lg">+</button>
                </div>
              </div>
              <div>
                <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Drink preference</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DRINKS.map((d) => (
                    <button key={d} onClick={() => toggleDrink(d)} className={`rounded-full border px-3.5 py-1.5 font-ui text-xs font-medium transition ${drinks.includes(d) ? "border-[#6E1F2F] bg-[#6E1F2F]/10 text-[#6E1F2F]" : "hairline text-[#161412]/70"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Dietary needs</label>
                  <input value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Veg / Jain / allergies" className="font-ui mt-1.5 w-full rounded-xl border hairline bg-[#FAF7F2] px-3 py-2.5 text-sm outline-none focus:border-[#6E1F2F]" />
                </div>
                <div>
                  <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">Children (names, ages)</label>
                  <input value={kids} onChange={(e) => setKids(e.target.value)} placeholder="e.g. Aarav, 6" className="font-ui mt-1.5 w-full rounded-xl border hairline bg-[#FAF7F2] px-3 py-2.5 text-sm outline-none focus:border-[#6E1F2F]" />
                </div>
              </div>
              <div>
                <label className="font-ui text-xs font-bold uppercase tracking-[0.16em]">A song that gets you dancing</label>
                <input value={song} onChange={(e) => setSong(e.target.value)} placeholder="DJ request…" className="font-ui mt-1.5 w-full rounded-xl border hairline bg-[#FAF7F2] px-4 py-2.5 text-sm outline-none focus:border-[#6E1F2F]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={() => setSent(true)} disabled={!attendance} className="font-ui rounded-full bg-[#161412] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition enabled:hover:bg-[#6E1F2F] disabled:opacity-40">Submit RSVP</button>
          <a href={waLink()} target="_blank" rel="noreferrer" className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-95">
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
