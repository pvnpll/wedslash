"use client";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Users,
  Wand2,
  CalendarDays,
  Palette,
  Music,
  Share2,
  Download,
  QrCode,
  Link2,
  Check,
  Smartphone,
  Monitor,
  ChevronRight,
  MapPin,
  Shirt,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { useInvite } from "@/store/useInvite";
import { downloadInviteZip } from "@/lib/zipExporter";
import { SYNTH_TRACKS } from "@/lib/audioSynth";
import { useClientOrigin } from "@/lib/useClientOrigin";
import type {
  DateRevealType,
  EntryType,
  FunctionEvent,
  InviteLanguage,
  ParticleType,
  SacredSymbol,
  SceneIllustrationId,
} from "@/lib/types";
import InviteRenderer from "@/components/InviteRenderer";
import AccessibleDialog from "@/components/AccessibleDialog";
import QrSvg from "@/components/QrSvg";

const TABS = [
  { id: "couple", label: "Couple", icon: Heart },
  { id: "entry", label: "Entry & Reveal", icon: Wand2 },
  { id: "functions", label: "Functions", icon: CalendarDays },
  { id: "etiquette", label: "Dress & Gifts", icon: Shirt },
  { id: "story", label: "Story & Audio", icon: ImageIcon },
  { id: "location", label: "Location", icon: MapPin },
  { id: "share", label: "RSVP & Publish", icon: Share2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STAGE_JUMPS = [
  { id: "gate", label: "1. Cover" },
  { id: "hero", label: "2. Arch" },
  { id: "date", label: "3. Date" },
  { id: "functions", label: "4. Events" },
  { id: "map", label: "5. Map" },
  { id: "rsvp", label: "6. RSVP" },
] as const;

const SCENES: SceneIllustrationId[] = [
  "pujan",
  "haldi",
  "mehendi",
  "sangeet",
  "pheras",
  "reception",
  "nikah",
  "cocktail",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E655F]">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "font-ui w-full rounded-xl border hairline bg-white px-3.5 py-2 text-sm outline-none focus:border-[#6E1F2F]";

const subscribeDesktopViewport = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(min-width: 1024px)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getDesktopViewportSnapshot = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;
const getDesktopViewportServerSnapshot = () => false;

function StudioInner() {
  const sp = useSearchParams();
  const s = useInvite();
  const cfg = s.config;

  const isDesktopViewport = useSyncExternalStore(
    subscribeDesktopViewport,
    getDesktopViewportSnapshot,
    getDesktopViewportServerSnapshot
  );
  const [tab, setTab] = useState<TabId>("couple");
  const [viewOverride, setViewOverride] = useState<"mobile" | "desktop" | null>(
    null
  );
  const view = viewOverride ?? (isDesktopViewport ? "desktop" : "mobile");
  const [mobilePane, setMobilePane] = useState<"editor" | "preview">("editor");
  const [copied, setCopied] = useState(false);
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [cloudSaved, setCloudSaved] = useState<boolean | null>(null);
  const [exporting, setExporting] = useState(false);
  const origin = useClientOrigin();
  const stageScrollRef = useRef<HTMLDivElement>(null);

  const requestedTemplateId = sp.get("t");

  useEffect(() => {
    s.hydrateFromStorage();
    if (requestedTemplateId) {
      s.selectTemplate(requestedTemplateId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedTemplateId]);

  const active =
    TEMPLATES.find((t) => t.id === cfg.templateId) ?? TEMPLATES[0];

  const shareLink = `${origin}/invite/${cfg.slug}?guest=${encodeURIComponent(
    s.guestName || "Honored Guest"
  )}`;

  const jumpToSection = (sectionId: string) => {
    const container = stageScrollRef.current;
    const el = document.getElementById(`invite-sec-${sectionId}`);
    if (container && el) {
      const containerTop = container.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + (elTop - containerTop) - 16,
        behavior: "smooth",
      });
    } else {
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await s.publishToCloud(cfg.slug);
      setPublishedSlug(result.slug);
      setCloudSaved(result.cloudSaved);
      setPublishedOpen(true);
    } finally {
      setPublishing(false);
    }
  };

  const handleDownloadZip = async () => {
    setExporting(true);
    try {
      await downloadInviteZip(cfg, s.guestName);
    } finally {
      setExporting(false);
    }
  };

  const addFunction = () => {
    const next: FunctionEvent = {
      id: `fn-${Date.now()}`,
      name: "Cocktail Soirée",
      scene: "cocktail",
      dayAndDate: "Fri, 13 Feb 2027",
      time: "5:30 PM",
      venueName: cfg.location.venueTitle,
      dressCodeLabel: "Evening Chic",
      dressCodeColors: [cfg.theme.primaryColor, cfg.theme.accentGold, "#FAF7F2"],
      cardThemeColor: cfg.theme.primaryColor,
    };
    s.setFunctions([...cfg.functions, next]);
  };

  const moveFunction = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= cfg.functions.length) return;
    const copy = [...cfg.functions];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    s.setFunctions(copy);
  };

  const removeFunction = (idx: number) => {
    if (cfg.functions.length <= 1) return;
    s.setFunctions(cfg.functions.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex min-h-[calc(100dvh-65px)] flex-col md:h-[calc(100dvh-65px)] md:flex-row md:overflow-hidden">
      {/* Mobile Pane Switcher so Editor & Live Preview stay 1 tap apart on phones */}
      <div className="sticky top-[64px] z-30 flex items-center gap-2 border-b hairline bg-white/95 px-4 py-2 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMobilePane("editor")}
          className={`flex-1 rounded-full py-2 font-ui text-xs font-bold uppercase tracking-wider transition-colors ${
            mobilePane === "editor" ? "bg-[#161412] text-white" : "bg-[#F0EAE1] text-[#161412]"
          }`}
        >
          Customize
        </button>
        <button
          type="button"
          onClick={() => setMobilePane("preview")}
          className={`flex-1 rounded-full py-2 font-ui text-xs font-bold uppercase tracking-wider transition-colors ${
            mobilePane === "preview" ? "bg-[#6E1F2F] text-white" : "bg-[#F0EAE1] text-[#161412]"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* LEFT: 7-tab editor */}
      <aside className={`${mobilePane === "editor" ? "flex" : "hidden"} md:flex w-full shrink-0 flex-col border-b hairline bg-white md:w-[350px] md:border-b-0 md:border-r lg:w-[420px]`}>
        <div className="border-b hairline p-4">
          <div className="flex items-center justify-between">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E655F]">
              Template preset
            </span>
            <span className="font-ui rounded-full bg-[#F0EAE1] px-2.5 py-0.5 text-[10px] font-semibold">
              {active.style}
            </span>
          </div>
          <select
            aria-label="Select invitation template"
            value={cfg.templateId}
            onChange={(e) => s.selectTemplate(e.target.value, true)}
            className={`${inputCls} mt-1.5 font-semibold`}
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.style}
              </option>
            ))}
          </select>

          <div
            role="tablist"
            aria-label="Studio customization sections"
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {TABS.map((t) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.07em] transition ${
                    selected
                      ? "bg-[#161412] text-white"
                      : "bg-[#F0EAE1] text-[#161412] hover:bg-[#161412]/10"
                  }`}
                >
                  <t.icon size={12} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {tab === "couple" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Groom / Honoree 1">
                      <input
                        className={inputCls}
                        value={cfg.couple.groomName}
                        onChange={(e) => s.patchCouple({ groomName: e.target.value })}
                      />
                    </Field>
                    <Field label="Bride / Honoree 2">
                      <input
                        className={inputCls}
                        value={cfg.couple.brideName}
                        onChange={(e) => s.patchCouple({ brideName: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Groom parents line">
                    <input
                      className={inputCls}
                      value={cfg.couple.groomParents}
                      onChange={(e) => s.patchCouple({ groomParents: e.target.value })}
                    />
                  </Field>
                  <Field label="Bride parents line">
                    <input
                      className={inputCls}
                      value={cfg.couple.brideParents}
                      onChange={(e) => s.patchCouple({ brideParents: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Date display label">
                      <input
                        className={inputCls}
                        value={cfg.couple.dateDisplayLabel}
                        onChange={(e) =>
                          s.patchCouple({ dateDisplayLabel: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Muhurat / ceremony time">
                      <input
                        className={inputCls}
                        value={cfg.couple.muhuratTime}
                        onChange={(e) => s.patchCouple({ muhuratTime: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Wedding ISO date/time">
                      <input
                        type="datetime-local"
                        className={inputCls}
                        value={cfg.couple.weddingDate.slice(0, 16)}
                        onChange={(e) => s.patchCouple({ weddingDate: e.target.value })}
                      />
                    </Field>
                    <Field label="Hashtag">
                      <input
                        className={inputCls}
                        value={cfg.couple.hashtag}
                        onChange={(e) => s.patchCouple({ hashtag: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Language preset">
                    <select
                      className={inputCls}
                      value={cfg.language}
                      onChange={(e) => s.setLanguage(e.target.value as InviteLanguage)}
                    >
                      <option value="english">English</option>
                      <option value="hinglish">Hinglish</option>
                      <option value="hindi">Hindi (हिन्दी)</option>
                      <option value="arabic-english">Arabic + English</option>
                      <option value="french">Français</option>
                      <option value="spanish">Español</option>
                    </select>
                  </Field>
                  <Field label="Closing family signature">
                    <input
                      className={inputCls}
                      value={cfg.couple.closingFamilyLine}
                      onChange={(e) =>
                        s.patchCouple({ closingFamilyLine: e.target.value })
                      }
                    />
                  </Field>
                </div>
              )}

              {tab === "entry" && (
                <div className="space-y-4">
                  <Field label="Entry experience">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["velvet-book", "Swipe · 3D Book"],
                          ["biometric-bloom", "Hold · Heartbeat"],
                          ["constellation-trace", "Draw · Connect Stars"],
                          ["mandala-dial", "Spin · Mandala Dial"],
                          ["tear-perforation", "Rip · Foil Strip"],
                          ["frost-wipe", "Wipe · Lake Mist"],
                          ["diya-lamp", "Spark · Diya Lamp"],
                          ["ring-box", "Slide · Ring Box"],
                          ["wax-envelope", "Peel · Wax Envelope"],
                          ["palace-doors", "Unbolt · Palace Doors"],
                          ["curtain-reveal", "Pull · Velvet Curtains"],
                          ["boarding-pass", "Runway · Boarding Pass"],
                        ] as [EntryType, string][]
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => s.patchMechanics({ entryType: val })}
                          className={`rounded-xl border px-3 py-2 font-ui text-xs font-semibold transition ${
                            cfg.mechanics.entryType === val
                              ? "border-[#6E1F2F] bg-[#6E1F2F]/10 text-[#6E1F2F]"
                              : "hairline"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Date reveal mechanic">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["pull-tassel-scroll", "Pull Tassel Scroll"],
                          ["scratch-3-circles", "3-Circle Scratch"],
                          ["scratch-heart", "Scratch Heart"],
                          ["brush-petals", "Brush Petals"],
                          ["polaroid-develop", "Polaroid Develop"],
                        ] as [DateRevealType, string][]
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => s.patchMechanics({ dateRevealType: val })}
                          className={`rounded-xl border px-3 py-2 font-ui text-xs font-semibold transition ${
                            cfg.mechanics.dateRevealType === val
                              ? "border-[#6E1F2F] bg-[#6E1F2F]/10 text-[#6E1F2F]"
                              : "hairline"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Sacred / Header Emblem">
                    <select
                      className={inputCls}
                      value={cfg.blessing.symbol}
                      onChange={(e) =>
                        s.patchBlessing({ symbol: e.target.value as SacredSymbol })
                      }
                    >
                      <option value="ganesh">Ganesh Ji Medallion</option>
                      <option value="om">Sacred Om</option>
                      <option value="ik-onkar">Ik Onkar</option>
                      <option value="bismillah">Bismillah / Botanical Crest</option>
                      <option value="cross">Minimalist Cross</option>
                      <option value="floral-crest">Couture Floral Crest</option>
                      <option value="passport">Passport Stamp</option>
                      <option value="crown">Royal Crown</option>
                      <option value="none">None</option>
                    </select>
                  </Field>

                  <Field label="Blessing quote on cover">
                    <input
                      className={inputCls}
                      value={cfg.blessing.sacredQuote}
                      onChange={(e) => s.patchBlessing({ sacredQuote: e.target.value })}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2 rounded-xl border hairline p-2.5 font-ui text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={cfg.mechanics.marigoldToranEnabled}
                        onChange={(e) =>
                          s.patchMechanics({ marigoldToranEnabled: e.target.checked })
                        }
                      />
                      Swinging Toran
                    </label>
                    <label className="flex items-center gap-2 rounded-xl border hairline p-2.5 font-ui text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={cfg.mechanics.cornerParallaxRoses}
                        onChange={(e) =>
                          s.patchMechanics({ cornerParallaxRoses: e.target.checked })
                        }
                      />
                      Corner Roses
                    </label>
                  </div>

                  <Field label="Preview guest name (?guest= link)">
                    <input
                      className={inputCls}
                      value={s.guestName}
                      onChange={(e) => s.setGuestName(e.target.value)}
                    />
                  </Field>
                </div>
              )}

              {tab === "functions" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-xs font-semibold text-[#6E655F]">
                      {cfg.functions.length} events in 3D carousel
                    </p>
                    <button
                      type="button"
                      onClick={addFunction}
                      className="inline-flex items-center gap-1 rounded-full bg-[#161412] px-3 py-1.5 font-ui text-[11px] font-bold text-white hover:bg-[#6E1F2F]"
                    >
                      <Plus size={12} /> Add event
                    </button>
                  </div>
                  {cfg.functions.map((f, i) => (
                    <div key={f.id} className="rounded-2xl border hairline bg-[#FAF7F2]/60 p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full"
                          style={{ background: f.cardThemeColor }}
                        />
                        <input
                          aria-label="Event name"
                          className="font-display min-w-0 flex-1 bg-transparent text-lg font-bold outline-none"
                          value={f.name}
                          onChange={(e) => {
                            const next = [...cfg.functions];
                            next[i] = { ...f, name: e.target.value };
                            s.setFunctions(next);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => moveFunction(i, -1)}
                          aria-label={`Move ${f.name} up`}
                          className="rounded-full p-1 hover:bg-black/5"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFunction(i, 1)}
                          aria-label={`Move ${f.name} down`}
                          className="rounded-full p-1 hover:bg-black/5"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFunction(i)}
                          aria-label={`Delete ${f.name}`}
                          className="rounded-full p-1 text-[#6E1F2F] hover:bg-black/5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          className={inputCls}
                          value={f.dayAndDate}
                          onChange={(e) => {
                            const next = [...cfg.functions];
                            next[i] = { ...f, dayAndDate: e.target.value };
                            s.setFunctions(next);
                          }}
                        />
                        <input
                          className={inputCls}
                          value={f.time}
                          onChange={(e) => {
                            const next = [...cfg.functions];
                            next[i] = { ...f, time: e.target.value };
                            s.setFunctions(next);
                          }}
                        />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          className={inputCls}
                          value={f.venueName}
                          onChange={(e) => {
                            const next = [...cfg.functions];
                            next[i] = { ...f, venueName: e.target.value };
                            s.setFunctions(next);
                          }}
                        />
                        <select
                          aria-label="Scene illustration"
                          className={inputCls}
                          value={f.scene}
                          onChange={(e) => {
                            const next = [...cfg.functions];
                            next[i] = {
                              ...f,
                              scene: e.target.value as SceneIllustrationId,
                            };
                            s.setFunctions(next);
                          }}
                        >
                          {SCENES.map((sc) => (
                            <option key={sc} value={sc}>
                              Scene: {sc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        className={`${inputCls} mt-2`}
                        value={f.dressCodeLabel}
                        onChange={(e) => {
                          const next = [...cfg.functions];
                          next[i] = { ...f, dressCodeLabel: e.target.value };
                          s.setFunctions(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {tab === "etiquette" && (
                <div className="space-y-3.5">
                  <Field label="Ladies dress guidance">
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={cfg.etiquetteAndDetails.ladiesDressNote}
                      onChange={(e) =>
                        s.patchEtiquette({ ladiesDressNote: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Gentlemen dress guidance">
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={cfg.etiquetteAndDetails.gentlemenDressNote}
                      onChange={(e) =>
                        s.patchEtiquette({ gentlemenDressNote: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Reserved colors to avoid">
                    <input
                      className={inputCls}
                      value={cfg.etiquetteAndDetails.reservedColorsNote}
                      onChange={(e) =>
                        s.patchEtiquette({ reservedColorsNote: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Gift preference note">
                    <input
                      className={inputCls}
                      value={cfg.etiquetteAndDetails.giftPreferenceNote}
                      onChange={(e) =>
                        s.patchEtiquette({ giftPreferenceNote: e.target.value })
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Organizer name">
                      <input
                        className={inputCls}
                        value={cfg.etiquetteAndDetails.organizerName}
                        onChange={(e) =>
                          s.patchEtiquette({ organizerName: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Organizer phone">
                      <input
                        className={inputCls}
                        value={cfg.etiquetteAndDetails.organizerPhone}
                        onChange={(e) =>
                          s.patchEtiquette({ organizerPhone: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>
              )}

              {tab === "story" && (
                <div className="space-y-3.5">
                  <Field label="Atmosphere particles">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          "marigold-petals",
                          "rose-petals",
                          "gold-dust",
                          "stars",
                          "snow-blossom",
                          "none",
                        ] as ParticleType[]
                      ).map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => s.patchMechanics({ particleType: o })}
                          className={`rounded-xl border px-3 py-2 font-ui text-xs font-semibold capitalize transition ${
                            cfg.mechanics.particleType === o
                              ? "border-[#6E1F2F] bg-[#6E1F2F]/10 text-[#6E1F2F]"
                              : "hairline"
                          }`}
                        >
                          {o.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Built-in ceremonial audio">
                    <div className="flex items-center gap-2">
                      <Music size={15} className="shrink-0 text-[#6E1F2F]" />
                      <select
                        className={inputCls}
                        value={cfg.mechanics.musicTrackId}
                        onChange={(e) =>
                          s.patchMechanics({
                            audioMode: "synth",
                            musicTrackId: e.target.value,
                          })
                        }
                      >
                        {SYNTH_TRACKS.map((tr) => (
                          <option key={tr.id} value={tr.id}>
                            {tr.label} ({tr.mood})
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>

                  <Field label="YouTube 'Our Song' URL (optional)">
                    <input
                      className={inputCls}
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={cfg.mechanics.youtubeSongUrl}
                      onChange={(e) =>
                        s.patchMechanics({
                          youtubeSongUrl: e.target.value,
                          audioMode: e.target.value ? "youtube" : "synth",
                        })
                      }
                    />
                  </Field>

                  <Field label="Hero portrait URL (optional)">
                    <input
                      className={inputCls}
                      placeholder="https://... (uses romantic arch silhouette if empty)"
                      value={cfg.couple.heroPhotoUrl}
                      onChange={(e) =>
                        s.patchCouple({ heroPhotoUrl: e.target.value })
                      }
                    />
                  </Field>

                  <div className="space-y-2">
                    <p className="font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E655F]">
                      Our Story Slides
                    </p>
                    {cfg.storyCarousel.map((sl, i) => (
                      <div key={sl.id} className="rounded-xl border hairline p-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className={inputCls}
                            value={sl.title}
                            onChange={(e) => {
                              const next = [...cfg.storyCarousel];
                              next[i] = { ...sl, title: e.target.value };
                              s.setStoryCarousel(next);
                            }}
                          />
                          <input
                            className={inputCls}
                            value={sl.dateLabel}
                            onChange={(e) => {
                              const next = [...cfg.storyCarousel];
                              next[i] = { ...sl, dateLabel: e.target.value };
                              s.setStoryCarousel(next);
                            }}
                          />
                        </div>
                        <input
                          className={`${inputCls} mt-2`}
                          value={sl.caption}
                          onChange={(e) => {
                            const next = [...cfg.storyCarousel];
                            next[i] = { ...sl, caption: e.target.value };
                            s.setStoryCarousel(next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "location" && (
                <div className="space-y-3.5">
                  <Field label="Primary venue title">
                    <input
                      className={inputCls}
                      value={cfg.location.venueTitle}
                      onChange={(e) =>
                        s.patchLocation({ venueTitle: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="City / region">
                    <input
                      className={inputCls}
                      value={cfg.location.city}
                      onChange={(e) => s.patchLocation({ city: e.target.value })}
                    />
                  </Field>
                  <Field label="Full street address">
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={cfg.location.fullAddress}
                      onChange={(e) =>
                        s.patchLocation({ fullAddress: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Google Maps URL">
                    <input
                      className={inputCls}
                      value={cfg.location.googleMapsUrl}
                      onChange={(e) =>
                        s.patchLocation({ googleMapsUrl: e.target.value })
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Flight Origin Code">
                      <input
                        className={inputCls}
                        value={cfg.location.departureCode ?? "DEL"}
                        onChange={(e) =>
                          s.patchLocation({ departureCode: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Flight Arrival Code">
                      <input
                        className={inputCls}
                        value={cfg.location.arrivalCode ?? "UDR"}
                        onChange={(e) =>
                          s.patchLocation({ arrivalCode: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>
              )}

              {tab === "share" && (
                <div className="space-y-3.5">
                  <Field label="Custom invite URL slug">
                    <input
                      className={inputCls}
                      value={cfg.slug}
                      onChange={(e) => s.setSlug(e.target.value)}
                    />
                  </Field>
                  <Field label="RSVP deadline line">
                    <input
                      className={inputCls}
                      value={cfg.rsvpConfig.deadlineText}
                      onChange={(e) =>
                        s.patchRsvpConfig({ deadlineText: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="WhatsApp RSVP number (with country code)">
                    <input
                      className={inputCls}
                      value={cfg.rsvpConfig.whatsappHostNumber}
                      onChange={(e) =>
                        s.patchRsvpConfig({ whatsappHostNumber: e.target.value })
                      }
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(
                      [
                        ["allowTellLater", "'Tell later' option"],
                        ["collectDrinkPreference", "Drink selector"],
                        ["collectChildrenDetails", "Children ages"],
                        ["collectDanceSong", "DJ song field"],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 rounded-xl border hairline p-2.5 font-ui text-xs font-semibold"
                      >
                        <input
                          type="checkbox"
                          checked={cfg.rsvpConfig[key]}
                          onChange={(e) =>
                            s.patchRsvpConfig({ [key]: e.target.checked })
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  <Field label="Shareable link">
                    <div className="flex items-center gap-2 rounded-xl border hairline bg-[#FAF7F2] p-2 pl-3">
                      <Link2 size={14} className="shrink-0 text-[#6E655F]" />
                      <span className="flex-1 truncate font-mono text-[11px]">
                        {shareLink}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(shareLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1600);
                        }}
                        className="rounded-full bg-[#161412] px-3 py-1 font-ui text-[11px] font-bold text-white"
                      >
                        {copied ? <Check size={13} /> : "Copy"}
                      </button>
                    </div>
                  </Field>

                  <button
                    type="button"
                    disabled={publishing}
                    onClick={handlePublish}
                    className="font-ui flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6E1F2F] py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#161412] disabled:opacity-50"
                  >
                    <Rocket size={15} />{" "}
                    {publishing ? "Publishing…" : "Publish Live Invite + QR"}
                  </button>

                  <button
                    type="button"
                    disabled={exporting}
                    onClick={handleDownloadZip}
                    className="font-ui flex w-full items-center justify-center gap-2 rounded-2xl bg-[#161412] py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#6E1F2F] disabled:opacity-50"
                  >
                    <Download size={15} />{" "}
                    {exporting ? "Packaging ZIP…" : "Download Netlify ZIP"}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `You're invited! ${cfg.couple.groomName} weds ${cfg.couple.brideName} — ${shareLink}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-ui block rounded-2xl bg-[#25D366] py-3 text-center text-xs font-bold uppercase tracking-widest text-white"
                  >
                    Send via WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* CENTER: Live Phone/Desktop Stage + State Jumpers */}
      <div className={`${mobilePane === "preview" ? "flex" : "hidden"} md:flex flex-1 flex-col bg-[#E9E2D6] paper-grain`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline bg-white/80 px-4 py-2.5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-ui mr-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E655F]">
              <Palette size={13} /> {active.name} <ChevronRight size={12} />
            </span>
            {STAGE_JUMPS.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => jumpToSection(j.id)}
                className="rounded-full border hairline bg-white px-2.5 py-1 font-ui text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-[#161412] hover:text-white"
              >
                {j.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={publishing}
              onClick={handlePublish}
              className="hidden rounded-full bg-[#6E1F2F] px-3.5 py-1.5 font-ui text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#161412] disabled:opacity-50 sm:inline-flex items-center gap-1"
            >
              <QrCode size={12} /> {publishing ? "Publishing…" : "Publish"}
            </button>
            <div className="flex gap-1 rounded-full border hairline bg-white p-1">
              <button
                type="button"
                onClick={() => setViewOverride("mobile")}
                className={`flex items-center gap-1 rounded-full px-3 py-1 font-ui text-[11px] font-bold transition-colors ${
                  view === "mobile" ? "bg-[#161412] text-white" : ""
                }`}
              >
                <Smartphone size={13} /> Mobile
              </button>
              <button
                type="button"
                onClick={() => setViewOverride("desktop")}
                className={`flex items-center gap-1 rounded-full px-3 py-1 font-ui text-[11px] font-bold transition-colors ${
                  view === "desktop" ? "bg-[#161412] text-white" : ""
                }`}
              >
                <Monitor size={13} /> Desktop
              </button>
            </div>
          </div>
        </div>

        <div ref={stageScrollRef} className="scrollbar-thin flex-1 overflow-y-auto p-3 sm:p-5">
          <div
            className={`mx-auto overflow-hidden bg-white shadow-[0_40px_80px_-30px_rgba(22,20,18,0.45)] transition-all duration-300 ${
              view === "mobile"
                ? "max-w-[390px] rounded-[2.2rem] border-4 sm:border-[8px] border-[#161412]"
                : "max-w-5xl rounded-3xl border hairline"
            }`}
          >
            <InviteRenderer
              template={active}
              customConfig={cfg}
              guest={s.guestName}
              embedded
            />
          </div>
          <p className="font-ui mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-[#6E655F]">
            Every keystroke updates live · Use jumpers above to inspect each section
          </p>
        </div>
      </div>

      {/* Published Confirmation + QR Dialog */}
      <AccessibleDialog
        open={publishedOpen}
        onClose={() => setPublishedOpen(false)}
        title="Your Invite is Live!"
        subtitle={
          cloudSaved
            ? "Saved to Wedslash Cloud. Share this personalized link or scan the QR code on any mobile device."
            : "Saved in your browser storage. Configure Supabase env vars to share across devices."
        }
      >
        <div className="text-center">
          <div className="mx-auto inline-block rounded-2xl border hairline bg-white p-4 shadow-sm">
            <QrSvg
              value={`${origin}/invite/${publishedSlug || cfg.slug}`}
              size={170}
              fg={cfg.theme.primaryColor}
            />
          </div>
          <p className="mt-3 break-all rounded-xl border hairline bg-white px-4 py-2.5 font-mono text-xs">
            {origin}/invite/{publishedSlug || cfg.slug}?guest=
            {encodeURIComponent(s.guestName || "Guest")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={`/invite/${publishedSlug || cfg.slug}?guest=${encodeURIComponent(
                s.guestName || "Guest"
              )}`}
              className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6E1F2F] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#161412]"
            >
              Open Live Invite <ExternalLink size={13} />
            </Link>
            <Link
              href="/dashboard"
              className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full border hairline bg-white py-3 text-xs font-bold uppercase tracking-wider hover:border-[#161412]"
            >
              <Users size={13} /> Open Guest CRM
            </Link>
          </div>
        </div>
      </AccessibleDialog>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-ui text-sm">Loading studio…</div>
      }
    >
      <StudioInner />
    </Suspense>
  );
}
