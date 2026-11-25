"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { TEMPLATES, CATEGORIES } from "@/lib/templates";
import TemplateCard from "@/components/TemplateCard";

export default function TemplatesPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = TEMPLATES.filter((t) => (cat === "All" || t.category === cat) && (t.name + t.tagline + t.style).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">The collection · {TEMPLATES.length} templates</p>
        <h1 className="font-display mt-2 text-4xl font-bold sm:text-5xl">Pick the one that feels like you.</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6E655F]">Every template is fully interactive — tap Preview to open the live invite, or hit Customize to make it yours in the studio. Switch templates anytime without losing your content.</p>
      </motion.div>

      <div className="sticky top-[65px] z-30 -mx-5 mt-8 border-y hairline bg-[#FAF7F2]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] transition ${cat === c ? "bg-[#161412] text-white" : "border hairline bg-white hover:border-[#161412]"}`}>{c}</button>
          ))}
          <label className="ml-auto flex items-center gap-2 rounded-full border hairline bg-white px-4 py-2">
            <Search size={14} className="text-[#6E655F]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search styles, mechanics…" className="w-40 bg-transparent font-ui text-xs outline-none" />
          </label>
        </div>
      </div>

      <p className="font-ui mt-6 text-xs uppercase tracking-[0.2em] text-[#6E655F]">Showing {list.length} of {TEMPLATES.length}</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => <TemplateCard key={t.id} t={t} index={i} />)}
      </div>
      {list.length === 0 && (
        <div className="rounded-3xl border hairline bg-white p-12 text-center">
          <p className="font-display text-2xl font-bold">No matches — try another search.</p>
          <button onClick={() => { setQ(""); setCat("All"); }} className="font-ui mt-4 rounded-full bg-[#161412] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white">Reset filters</button>
        </div>
      )}
    </div>
  );
}
