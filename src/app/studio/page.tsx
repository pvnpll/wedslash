"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Wand2, CalendarDays, Palette, Music, Share2, Download, QrCode, Link2, Check, Smartphone, Monitor, ChevronRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { useInvite } from "@/store/useInvite";
import InviteRenderer from "@/components/InviteRenderer";

const TABS = [
  { id: "couple", label: "Couple & Family", icon: Heart },
  { id: "entry", label: "Entry & Reveal", icon: Wand2 },
  { id: "functions", label: "Functions", icon: CalendarDays },
  { id: "theme", label: "Theme & Music", icon: Palette },
  { id: "rsvp", label: "RSVP", icon: Users },
  { id: "share", label: "Publish & Share", icon: Share2 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E655F]">{label}</span><div className="mt-1.5">{children}</div></label>;
}
const input = "font-ui w-full rounded-xl border hairline bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#6E1F2F]";

function StudioInner() {
  const sp = useSearchParams();
  const s = useInvite();
  const cfg = s.config;
  const [tab, setTab] = useState("couple");
  const [view, setView] = useState<"mobile" | "desktop">("mobile");
  const [copied, setCopied] = useState(false);
  const template = TEMPLATES.find((t) => t.id === sp.get("t")) ?? TEMPLATES[0];
  const [templateId, setTemplateId] = useState(template.id);
  const active = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const shareLink = `https://wedslash.com/invite/${active.id}?guest=${encodeURIComponent(s.guestName || "Guest")}`;

  const downloadZip = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${cfg.couple.groomName} weds ${cfg.couple.brideName} — Wedslash Invite</title></head><body style="font-family:Georgia,serif;text-align:center;padding:48px 20px;background:${active.bg};color:${active.ink}"><p>Shree Ganeshaya Namah</p><h1>${cfg.couple.groomName} & ${cfg.couple.brideName}</h1><p>${cfg.location.venueTitle}, ${cfg.location.city}</p><p>${cfg.couple.muhuratTime}</p><p>${cfg.couple.hashtag}</p><p><small>Exported from Wedslash Studio · Template: ${active.name}</small></p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `wedslash-${active.id}-invite.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] flex-col lg:flex-row">
      {/* LEFT: editor */}
      <aside className="w-full border-b hairline bg-white lg:w-[380px] lg:border-b-0 lg:border-r">
        <div className="border-b hairline p-4">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E655F]">Template</p>
          <select value={templateId} onChange={(e) => { setTemplateId(e.target.value); s.selectTemplate(e.target.value, true); }} className={`${input} mt-1.5 font-semibold`}>
            {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.style}</option>)}
          </select>
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-ui text-[11px] font-bold uppercase tracking-[0.08em] transition ${tab === t.id ? "bg-[#161412] text-white" : "bg-[#F0EAE1] hover:bg-[#161412]/10"}`}>
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="scrollbar-thin max-h-[520px] space-y-4 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.18 }}>
              {tab === "couple" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Groom name"><input className={input} value={cfg.couple.groomName} onChange={(e) => s.patchCouple({ groomName: e.target.value })} /></Field>
                    <Field label="Bride name"><input className={input} value={cfg.couple.brideName} onChange={(e) => s.patchCouple({ brideName: e.target.value })} /></Field>
                  </div>
                  <Field label="Groom parents line"><input className={input} value={cfg.couple.groomParents} onChange={(e) => s.patchCouple({ groomParents: e.target.value })} /></Field>
                  <Field label="Bride parents line"><input className={input} value={cfg.couple.brideParents} onChange={(e) => s.patchCouple({ brideParents: e.target.value })} /></Field>
                  <Field label="Wedding hashtag"><input className={input} value={cfg.couple.hashtag} onChange={(e) => s.patchCouple({ hashtag: e.target.value })} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Venue"><input className={input} value={cfg.location.venueTitle} onChange={(e) => s.patchLocation({ venueTitle: e.target.value })} /></Field>
                    <Field label="City"><input className={input} value={cfg.location.city} onChange={(e) => s.patchLocation({ city: e.target.value })} /></Field>
                  </div>
                  <Field label="Muhurat line"><input className={input} value={cfg.couple.muhuratTime} onChange={(e) => s.patchCouple({ muhuratTime: e.target.value })} /></Field>
                </div>
              )}
              {tab === "entry" && (
                <div className="space-y-3.5">
                  <Field label="Entry experience">
                    <div className="grid grid-cols-2 gap-2">
                      {(["velvet-book", "wax-envelope", "palace-doors", "boarding-pass", "curtain-reveal"] as const).map((o) => (
                        <button key={o} onClick={() => s.patchMechanics({ entryType: o })} className={`rounded-xl border px-3 py-2.5 font-ui text-xs font-semibold capitalize transition ${cfg.mechanics.entryType === o ? "border-[#6E1F2F] bg-[#6E1F2F]/8 text-[#6E1F2F]" : "hairline"}`}>{o.replace("-", " ")}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Date reveal mechanic">
                    <div className="grid grid-cols-2 gap-2">
                      {(["pull-tassel-scroll", "scratch-3-circles", "scratch-heart", "brush-petals", "polaroid-develop"] as const).map((o) => (
                        <button key={o} onClick={() => s.patchMechanics({ dateRevealType: o })} className={`rounded-xl border px-3 py-2.5 font-ui text-xs font-semibold capitalize transition ${cfg.mechanics.dateRevealType === o ? "border-[#6E1F2F] bg-[#6E1F2F]/8 text-[#6E1F2F]" : "hairline"}`}>{o.replace(/-/g, " ")}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Preview guest name (personalized ?guest= link)"><input className={input} value={s.guestName} onChange={(e) => s.setGuestName(e.target.value)} placeholder="The Sharma Family" /></Field>
                </div>
              )}
              {tab === "functions" && (
                <div className="space-y-3">
                  {cfg.functions.map((f, i) => (
                    <div key={f.id} className="rounded-2xl border hairline p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ background: f.cardThemeColor }} />
                        <input className="font-display flex-1 bg-transparent text-lg font-bold outline-none" value={f.name} onChange={(e) => { const next = [...cfg.functions]; next[i] = { ...f, name: e.target.value }; s.setFunctions(next); }} />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input className={input} value={f.dayAndDate} onChange={(e) => { const next = [...cfg.functions]; next[i] = { ...f, dayAndDate: e.target.value }; s.setFunctions(next); }} />
                        <input className={input} value={f.time} onChange={(e) => { const next = [...cfg.functions]; next[i] = { ...f, time: e.target.value }; s.setFunctions(next); }} />
                      </div>
                      <input className={`${input} mt-2`} value={f.venueName} onChange={(e) => { const next = [...cfg.functions]; next[i] = { ...f, venueName: e.target.value }; s.setFunctions(next); }} />
                      <input className={`${input} mt-2`} value={f.dressCodeLabel} onChange={(e) => { const next = [...cfg.functions]; next[i] = { ...f, dressCodeLabel: e.target.value }; s.setFunctions(next); }} />
                    </div>
                  ))}
                  <p className="font-ui text-xs text-[#6E655F]">Rename, retime and restyle each function card live.</p>
                </div>
              )}
              {tab === "theme" && (
                <div className="space-y-3.5">
                  <Field label="Atmosphere particles">
                    <div className="grid grid-cols-2 gap-2">
                      {(["marigold-petals", "rose-petals", "gold-dust", "stars", "snow-blossom", "none"] as const).map((o) => (
                        <button key={o} onClick={() => s.patchMechanics({ particleType: o })} className={`rounded-xl border px-3 py-2.5 font-ui text-xs font-semibold capitalize transition ${cfg.mechanics.particleType === o ? "border-[#6E1F2F] bg-[#6E1F2F]/8 text-[#6E1F2F]" : "hairline"}`}>{o.replace("-", " ")}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Template palette"><p className="font-ui rounded-xl bg-[#F0EAE1] p-3 text-xs">Primary <strong>{active.primary}</strong> · Gold <strong>{active.gold}</strong> — switch templates above to remix the full palette instantly.</p></Field>
                  <Field label="Soundtrack">
                    <div className="flex items-center gap-2 rounded-xl border hairline p-3"><Music size={16} className="text-[#6E1F2F]" /><p className="font-ui text-xs">Ceremonial Shehnai · fade-in on open</p></div>
                  </Field>
                </div>
              )}
              {tab === "rsvp" && (
                <div className="space-y-3.5">
                  <Field label="Default plus-ones"><input type="number" min={1} max={10} className={input} value={cfg.rsvpConfig.defaultPlusOnes} onChange={(e) => s.patchRsvpConfig({ defaultPlusOnes: Number(e.target.value) })} /></Field>
                  <div className="rounded-2xl bg-[#F0EAE1] p-3.5 font-ui text-xs leading-relaxed">
                    RSVP collects: Yes / No / Tell-you-later · guest count · drink selector · dietary · children names & ages · DJ song · WhatsApp sync · QR pass.
                  </div>
                </div>
              )}
              {tab === "share" && (
                <div className="space-y-3.5">
                  <Field label="Shareable link">
                    <div className="flex items-center gap-2 rounded-xl border hairline bg-[#FAF7F2] p-2.5 pl-3.5">
                      <Link2 size={14} className="shrink-0 text-[#6E655F]" />
                      <span className="flex-1 truncate font-mono text-[11px]">{shareLink}</span>
                      <button onClick={() => { navigator.clipboard?.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 1600); }} className="rounded-full bg-[#161412] px-3.5 py-1.5 font-ui text-[11px] font-bold text-white">{copied ? <Check size={13} /> : "Copy"}</button>
                    </div>
                  </Field>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`You're invited! ${cfg.couple.groomName} weds ${cfg.couple.brideName} — ${shareLink}`)}`} target="_blank" rel="noreferrer" className="font-ui block rounded-2xl bg-[#25D366] py-3 text-center text-xs font-bold uppercase tracking-widest text-white">Send via WhatsApp</a>
                  <button onClick={downloadZip} className="font-ui flex w-full items-center justify-center gap-2 rounded-2xl bg-[#161412] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#6E1F2F]"><Download size={15} /> Download standalone file</button>
                  <div className="flex items-center gap-2 rounded-2xl border hairline p-3.5"><QrCode size={34} strokeWidth={1.4} /><p className="font-ui text-xs text-[#6E655F]">QR code studio + Netlify ZIP packaging.</p></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* CENTER: stage */}
      <div className="flex flex-1 flex-col bg-[#E9E2D6] paper-grain">
        <div className="flex items-center justify-between border-b hairline bg-white/70 px-4 py-2.5 backdrop-blur">
          <p className="font-ui inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6E655F]">Live preview <ChevronRight size={12} /> {active.name}</p>
          <div className="flex gap-1.5 rounded-full border hairline bg-white p-1">
            <button onClick={() => setView("mobile")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-ui text-[11px] font-bold ${view === "mobile" ? "bg-[#161412] text-white" : ""}`}><Smartphone size={13} /> Mobile</button>
            <button onClick={() => setView("desktop")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-ui text-[11px] font-bold ${view === "desktop" ? "bg-[#161412] text-white" : ""}`}><Monitor size={13} /> Desktop</button>
          </div>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
          <div className={`mx-auto overflow-hidden bg-white shadow-[0_40px_80px_-30px_rgba(22,20,18,0.45)] transition-all ${view === "mobile" ? "max-w-[400px] rounded-[2.2rem] border-[8px] border-[#161412]" : "max-w-4xl rounded-3xl border hairline"}`}>
            <InviteRenderer template={active} guest={s.guestName} />
          </div>
          <p className="font-ui mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">Every keystroke on the left renders here instantly</p>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return <Suspense fallback={<div className="p-10 text-center font-ui text-sm">Loading studio…</div>}><StudioInner /></Suspense>;
}
