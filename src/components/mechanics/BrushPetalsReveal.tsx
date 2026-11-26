"use client";
import { memo, useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Countdown from "../Countdown";

export interface BrushPetalsRevealProps {
  dateLabel: string;
  muhurat: string;
  venue: string;
  target: string;
  title: string;
  primary?: string;
  gold?: string;
  petalColor?: "rose" | "marigold";
  compact?: boolean;
  onReveal?: () => void;
}

interface Petal {
  id: number;
  baseX: number; // percentage 0..100
  baseY: number; // percentage 0..100
  dx: number; // px offset
  dy: number; // px offset
  rot: number;
  scale: number;
  scattered: boolean;
}

const PALETTES: Record<"rose" | "marigold", string[]> = {
  rose: ["#A63D57", "#E56399", "#C95272", "#F4A7C3", "#7A2E43"],
  marigold: ["#F5B301", "#E4572E", "#FFB703", "#FB8500", "#FFD166"],
};

function createInitialPetals(): Petal[] {
  const count = 32;
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const angle = i * 2.3999632297; // golden angle
    const radius = Math.sqrt(t) * 38;
    const baseX = 50 + Math.cos(angle) * radius * 1.1;
    const baseY = 50 + Math.sin(angle) * radius * 0.85;
    return {
      id: i,
      baseX: Math.max(12, Math.min(88, baseX)),
      baseY: Math.max(15, Math.min(85, baseY)),
      dx: 0,
      dy: 0,
      rot: (i * 53) % 360,
      scale: 0.9 + ((i * 7) % 5) * 0.1,
      scattered: false,
    };
  });
}

function BrushPetalsRevealComponent({
  dateLabel,
  muhurat,
  venue,
  target,
  title,
  primary = "#A63D57",
  gold = "#C9A227",
  petalColor = "rose",
  compact = false,
  onReveal,
}: BrushPetalsRevealProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const fieldRef = useRef<HTMLDivElement>(null);
  const burstFired = useRef(false);
  const rafLockRef = useRef(false);
  const [petals, setPetals] = useState<Petal[]>(createInitialPetals);
  const [revealed, setRevealed] = useState(false);

  const fireReveal = useCallback(() => {
    setRevealed(true);
    if (!burstFired.current) {
      burstFired.current = true;
      if (
        typeof window !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        // @ts-expect-error canvas-confetti ships without bundled TypeScript declarations
        void import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 55,
            spread: 70,
            origin: { y: 0.6 },
            colors: [...PALETTES[petalColor], gold, "#FFFDF6"],
          });
        });
      }
      onReveal?.();
    }
  }, [gold, onReveal, petalColor]);

  const brushAll = useCallback(() => {
    setPetals((prev) =>
      prev.map((p) => {
        const angle = (p.id * 37) % 360;
        const rad = (angle * Math.PI) / 180;
        return {
          ...p,
          dx: Math.cos(rad) * 165,
          dy: Math.sin(rad) * 125,
          rot: p.rot + 95,
          scattered: true,
        };
      })
    );
    fireReveal();
  }, [fireReveal]);

  const scatterNearPointer = (clientX: number, clientY: number) => {
    if (revealed || rafLockRef.current) return;
    const field = fieldRef.current;
    if (!field) return;
    rafLockRef.current = true;

    requestAnimationFrame(() => {
      rafLockRef.current = false;
      const rect = field.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const radius = 92;

      setPetals((prev) => {
        let changed = false;
        const next = prev.map((p) => {
          const cx = (p.baseX / 100) * rect.width + p.dx;
          const cy = (p.baseY / 100) * rect.height + p.dy;
          const vx = cx - px;
          const vy = cy - py;
          const dist = Math.hypot(vx, vy);
          if (dist < radius) {
            changed = true;
            const safeDist = Math.max(8, dist);
            const push = ((radius - safeDist) / radius) * 95 + 28;
            const ndx = p.dx + (vx / safeDist) * push;
            const ndy = p.dy + (vy / safeDist) * push;
            const isOut = Math.hypot(ndx, ndy) > 70;
            return {
              ...p,
              dx: Math.max(-185, Math.min(185, ndx)),
              dy: Math.max(-145, Math.min(145, ndy)),
              rot: p.rot + (vx >= 0 ? 28 : -28),
              scattered: p.scattered || isOut,
            };
          }
          return p;
        });
        if (!changed) return prev;
        const scatteredCount = next.reduce((acc, p) => acc + (p.scattered ? 1 : 0), 0);
        if (scatteredCount / next.length >= 0.62) {
          queueMicrotask(brushAll);
        }
        return next;
      });
    });
  };

  const hasValidTarget = Boolean(target && !Number.isNaN(Date.parse(target)));

  return (
    <div className="mx-auto w-full max-w-md px-5 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        ✦ Brush the petals to reveal ✦
      </p>

      <div
        ref={fieldRef}
        onPointerDown={(e) => scatterNearPointer(e.clientX, e.clientY)}
        onPointerMove={(e) => {
          if (e.buttons > 0 || e.pointerType === "mouse" || e.pointerType === "touch") {
            scatterNearPointer(e.clientX, e.clientY);
          }
        }}
        style={{ touchAction: "none" }}
        className={`relative mt-4 flex ${
          compact ? "min-h-[210px]" : "min-h-[240px]"
        } w-full cursor-grab select-none flex-col items-center justify-center overflow-hidden rounded-3xl border bg-[#FFFDF6] px-6 py-7 shadow-xl active:cursor-grabbing`}
      >
        {/* Decorative border frame */}
        <div
          className="pointer-events-none absolute inset-2.5 rounded-2xl border"
          style={{ borderColor: `${gold}55` }}
          aria-hidden="true"
        />

        {/* Hidden Date Box underneath petals */}
        <div className="relative z-0 flex flex-col items-center">
          <p
            className="font-ui text-[10px] font-bold uppercase tracking-[0.26em]"
            style={{ color: primary }}
          >
            Save the Date
          </p>
          <p className="font-display mt-1.5 text-3xl font-bold leading-tight text-[#2A1215]">
            {dateLabel}
          </p>
          <p
            className="font-ui mt-1 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: primary }}
          >
            {muhurat}
          </p>
          <div
            className="mx-auto my-2.5 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
            }}
          />
          <p className="font-editorial text-base italic text-[#161412]/80">{venue}</p>
        </div>

        {/* Interactive 32-Petal Pile Overlay (GPU-composited) */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
          {petals.map((p) => {
            const activePalette = PALETTES[petalColor];
            const fill = activePalette[p.id % activePalette.length];
            return (
              <div
                key={p.id}
                style={{
                  left: `${p.baseX}%`,
                  top: `${p.baseY}%`,
                  transform: `translate(-50%, -50%) translate3d(${p.dx}px, ${p.dy}px, 0) rotate(${p.rot}deg) scale(${p.scale})`,
                  opacity: p.scattered ? 0.12 : 0.94,
                  willChange: "transform, opacity",
                  transition: prefersReduced
                    ? "opacity 150ms ease"
                    : "transform 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease",
                }}
                className="absolute"
              >
                <svg width="38" height="30" viewBox="0 0 36 28" fill="none">
                  <path
                    d="M18 2C27 2 34 9 33 17C32 24 23 27 17 25C9 23 2 17 3 10C4 4 11 2 18 2Z"
                    fill={fill}
                  />
                  <path
                    d="M9 12C14 8 22 8 27 14"
                    stroke="#FFFFFF"
                    strokeOpacity="0.24"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        {!revealed ? (
          <button
            type="button"
            onClick={brushAll}
            className="font-ui inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#161412] shadow-sm transition hover:bg-[#161412] hover:text-white"
          >
            Brush all petals
          </button>
        ) : (
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-ui inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
            style={{ background: primary }}
          >
            <Sparkles size={13} /> Date uncovered
          </motion.p>
        )}
      </div>

      {hasValidTarget && (
        <div className="mt-5">
          <Countdown target={target} title={title} venue={venue} />
        </div>
      )}
    </div>
  );
}

const BrushPetalsReveal = memo(BrushPetalsRevealComponent);
export default BrushPetalsReveal;
