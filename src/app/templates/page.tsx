"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Smartphone, Monitor, ArrowUpRight, Sparkles } from "lucide-react";
import { TEMPLATES, CATEGORIES, MECHANIC_FILTERS } from "@/lib/templates";
import type { Template } from "@/lib/types";
import TemplateCard from "@/components/TemplateCard";
import AccessibleDialog from "@/components/AccessibleDialog";
import InviteRenderer from "@/components/InviteRenderer";

export default function TemplatesPage() {
  const [cat, setCat] = useState("All");
  const [mech, setMech] = useState("All");
  const [q, setQ] = useState("");
  const [previewTpl, setPreviewTpl] = useState<Template | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  const list = TEMPLATES.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const combinedMech = `${t.entry} ${t.reveal}`.toLowerCase();
    const matchMech =
      mech === "All" ||
      (mech === "Velvet Book" && combinedMech.includes("book")) ||
      (mech === "Heartbeat Hold" && combinedMech.includes("heartbeat")) ||
      (mech === "Connect Stars" && combinedMech.includes("stars")) ||
      (mech === "Foil Tear" && combinedMech.includes("tear")) ||
      (mech === "Mist Glass" && combinedMech.includes("mist")) ||
      (mech === "Mandala Dial" && combinedMech.includes("dial")) ||
      (mech === "Ring Box" && combinedMech.includes("ring")) ||
      (mech === "Diya Lamp" && (combinedMech.includes("diya") || combinedMech.includes("lamp"))) ||
      (mech === "Tassel Scroll" && combinedMech.includes("tassel")) ||
      (mech === "Scratch Foil" && combinedMech.includes("scratch")) ||
      (mech === "Brush Petals" && (combinedMech.includes("petal") || combinedMech.includes("marigold"))) ||
      (mech === "Polaroid" && combinedMech.includes("polaroid")) ||
      (mech === "Boarding Pass" && combinedMech.includes("boarding"));
    const matchSearch = (t.name + t.tagline + t.style + t.entry + t.reveal)
      .toLowerCase()
      .includes(q.toLowerCase());
    return matchCat && matchMech && matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">
          The collection · {TEMPLATES.length} templates
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold sm:text-5xl">
          Pick the one that feels like you.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6E655F]">
          Every template is its own world — a ring box that springs open, a brass diya you light, palace doors, boarding passes, tassel scrolls, scratch foil and brushable petals. No two share the same opening, reveal or soundtrack. Click Quick View to test it live, or hit Customize to open it in the Studio.
        </p>
      </motion.div>

      <div className="sticky top-[64px] z-30 -mx-5 mt-8 border-y hairline bg-[#FAF7F2]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] transition ${
                  cat === c
                    ? "bg-[#161412] text-white"
                    : "border hairline bg-white hover:border-[#161412]"
                }`}
              >
                {c}
              </button>
            ))}
            <search className="ml-auto">
              <label className="flex items-center gap-2 rounded-full border hairline bg-white px-4 py-2">
                <Search size={14} className="text-[#6E655F]" />
                <input
                  type="search"
                  aria-label="Search templates by style or mechanic"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search styles, mechanics…"
                  className="w-44 bg-transparent font-ui text-xs outline-none"
                />
              </label>
            </search>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-ui mr-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E655F]">
              Mechanic:
            </span>
            {MECHANIC_FILTERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMech(m)}
                className={`shrink-0 rounded-full px-3 py-1 font-ui text-[11px] font-semibold transition ${
                  mech === m
                    ? "bg-[#6E1F2F] text-white"
                    : "bg-[#F0EAE1] text-[#161412]/80 hover:bg-[#161412]/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="font-ui mt-6 text-xs uppercase tracking-[0.2em] text-[#6E655F]">
        Showing {list.length} of {TEMPLATES.length}
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <TemplateCard
            key={t.id}
            t={t}
            index={i}
            onQuickPreview={(tpl) => setPreviewTpl(tpl)}
          />
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-6 rounded-3xl border hairline bg-white p-12 text-center">
          <p className="font-display text-2xl font-bold">
            No matches — try another filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("All");
              setMech("All");
            }}
            className="font-ui mt-4 rounded-full bg-[#161412] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
          >
            Reset filters
          </button>
        </div>
      )}

      <AccessibleDialog
        open={Boolean(previewTpl)}
        onClose={() => setPreviewTpl(null)}
        title={previewTpl?.name ?? "Template Preview"}
        subtitle={previewTpl?.tagline}
        maxWidthClass="max-w-4xl"
      >
        {previewTpl && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1.5 rounded-full border hairline bg-white p-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-ui text-[11px] font-bold ${
                    previewMode === "mobile" ? "bg-[#161412] text-white" : ""
                  }`}
                >
                  <Smartphone size={13} /> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-ui text-[11px] font-bold ${
                    previewMode === "desktop" ? "bg-[#161412] text-white" : ""
                  }`}
                >
                  <Monitor size={13} /> Desktop
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/invite/${previewTpl.id}`}
                  className="font-ui inline-flex items-center gap-1.5 rounded-full border hairline bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-[#161412]"
                >
                  Open Full Invite <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/studio?t=${previewTpl.id}`}
                  className="font-ui inline-flex items-center gap-1.5 rounded-full bg-[#6E1F2F] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#161412]"
                >
                  <Sparkles size={13} /> Customize in Studio
                </Link>
              </div>
            </div>
            <div
              className={`mx-auto overflow-hidden bg-white shadow-2xl ${
                previewMode === "mobile"
                  ? "max-w-[390px] rounded-[2.2rem] border-[8px] border-[#161412]"
                  : "w-full rounded-2xl border hairline"
              }`}
            >
              <InviteRenderer
                template={previewTpl}
                guest="The Sharma Family"
                embedded
              />
            </div>
          </div>
        )}
      </AccessibleDialog>
    </div>
  );
}
