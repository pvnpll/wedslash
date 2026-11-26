"use client";
/**
 * ThemeSelector — a floating pill strip above the invite view.
 * Shows 6 color preset swatches. Clicking one calls onSelect(preset).
 * Designed to be sticky-positioned inside the invite page wrapper.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, ChevronUp } from "lucide-react";

export interface ThemePreset {
  id: string;
  label: string;
  primary: string;
  gold: string;
  bg: string;
  ink: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "classic-gold",
    label: "Classic Gold",
    primary: "#6E1F2F",
    gold: "#D4AF37",
    bg: "#FBF3EC",
    ink: "#2A1215",
  },
  {
    id: "dark-romance",
    label: "Dark Romance",
    primary: "#1A0A0F",
    gold: "#C9A227",
    bg: "#0F0608",
    ink: "#F5EBE0",
  },
  {
    id: "sage-pearl",
    label: "Sage & Pearl",
    primary: "#3B5E4A",
    gold: "#A8966B",
    bg: "#F4F7F3",
    ink: "#1E2D25",
  },
  {
    id: "midnight-navy",
    label: "Midnight Navy",
    primary: "#0E1E3D",
    gold: "#B8A050",
    bg: "#F2F4F8",
    ink: "#0A1428",
  },
  {
    id: "rose-blush",
    label: "Rose Blush",
    primary: "#A63D57",
    gold: "#C9A227",
    bg: "#FDF0F2",
    ink: "#402027",
  },
  {
    id: "copper-cream",
    label: "Copper & Cream",
    primary: "#7A3B1E",
    gold: "#B87333",
    bg: "#FDF6EE",
    ink: "#2E1810",
  },
];

interface Props {
  activeId: string;
  onSelect: (preset: ThemePreset) => void;
}

export function ThemeSelector({ activeId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const active = THEME_PRESETS.find((p) => p.id === activeId) ?? THEME_PRESETS[0];

  return (
    <div className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm">
      <div className="mx-auto max-w-7xl">
        {/* Collapsed header row */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 @2xl:px-6"
          aria-expanded={expanded}
          aria-label="Toggle theme selector"
        >
          <div className="flex items-center gap-2">
            <Palette size={13} className="text-[#6E655F]" />
            <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#6E655F]">
              Theme
            </span>
            {/* Active swatch preview */}
            <div className="flex items-center gap-1.5 ml-2">
              <div
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ background: active.primary }}
              />
              <div
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ background: active.gold }}
              />
              <span className="font-ui text-[10px] font-medium text-[#161412] ml-1">
                {active.label}
              </span>
            </div>
          </div>
          <span className="text-[#6E655F]">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </button>

        {/* Expanded swatch panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="theme-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 @2xl:px-6 grid grid-cols-3 @2xl:grid-cols-6 gap-2">
                {THEME_PRESETS.map((preset) => {
                  const isActive = preset.id === activeId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSelect(preset);
                        setExpanded(false);
                      }}
                      className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all duration-200 ${
                        isActive
                          ? "border-[#161412] shadow-md"
                          : "border-transparent hover:border-black/15 hover:shadow-sm"
                      }`}
                      style={{
                        background: isActive ? `${preset.bg}` : "transparent",
                      }}
                      aria-pressed={isActive}
                      title={preset.label}
                    >
                      {/* Swatch pair */}
                      <div className="flex gap-1">
                        <div
                          className="h-5 w-5 rounded-full ring-1 ring-black/10 shadow-sm"
                          style={{ background: preset.primary }}
                        />
                        <div
                          className="h-5 w-5 rounded-full ring-1 ring-black/10 shadow-sm"
                          style={{ background: preset.gold }}
                        />
                      </div>
                      <span className="font-ui text-[9px] uppercase tracking-[0.12em] text-[#161412] leading-tight text-center">
                        {preset.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-theme-dot"
                          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#161412]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
