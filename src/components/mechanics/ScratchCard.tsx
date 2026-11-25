"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import Countdown from "../Countdown";

export interface ScratchCardProps {
  day: string;
  month: string;
  year: string;
  venue?: string;
  foil?: "gold" | "silver" | "rose";
  variant?: "3-circles" | "heart";
  target?: string;
  title?: string;
  primary?: string;
  onReveal?: () => void;
}

const FOILS: Record<"gold" | "silver" | "rose", [string, string]> = {
  gold: ["#8a6d1c", "#F6E27A"],
  silver: ["#6b7280", "#F3F4F6"],
  rose: ["#9d4e5c", "#F9C5D5"],
};

function drawHeartPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.88);
  ctx.bezierCurveTo(w * 0.14, h * 0.64, w * 0.04, h * 0.34, w * 0.24, h * 0.17);
  ctx.bezierCurveTo(w * 0.38, h * 0.06, w * 0.5, h * 0.17, w * 0.5, h * 0.28);
  ctx.bezierCurveTo(w * 0.5, h * 0.17, w * 0.62, h * 0.06, w * 0.76, h * 0.17);
  ctx.bezierCurveTo(w * 0.96, h * 0.34, w * 0.86, h * 0.64, w * 0.5, h * 0.88);
  ctx.closePath();
}

const CARD_IDS = ["day", "month", "year"] as const;

export default function ScratchCard({
  day,
  month,
  year,
  venue,
  foil = "gold",
  variant = "3-circles",
  target,
  title = "Wedding Celebration",
  primary = "#6E1F2F",
  onReveal,
}: ScratchCardProps) {
  const [clearedMap, setClearedMap] = useState<Record<string, boolean>>({});
  const [forcedReveal, setForcedReveal] = useState(false);
  const firedRef = useRef(false);

  const cards = [
    { id: "day", label: "Day", value: day },
    { id: "month", label: "Month", value: month },
    { id: "year", label: "Year", value: year },
  ];

  const requiredCount = variant === "heart" ? 1 : 3;
  const clearedCount =
    variant === "heart"
      ? clearedMap.heart
        ? 1
        : 0
      : CARD_IDS.filter((id) => clearedMap[id]).length;
  const done = forcedReveal || clearedCount >= requiredCount;

  const fireBurst = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const [dark, light] = FOILS[foil] ?? FOILS.gold;
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // @ts-expect-error canvas-confetti ships without bundled TypeScript declarations
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: [light, dark, primary, "#FFFDF6"],
        });
      });
    }
    onReveal?.();
  }, [foil, onReveal, primary]);

  const handleSurfaceCleared = useCallback(
    (id: string) => {
      setClearedMap((prev) => {
        if (prev[id]) return prev;
        const next = { ...prev, [id]: true };
        const count =
          variant === "heart"
            ? next.heart
              ? 1
              : 0
            : CARD_IDS.filter((cid) => next[cid]).length;
        if (count >= requiredCount) {
          queueMicrotask(fireBurst);
        }
        return next;
      });
    },
    [fireBurst, requiredCount, variant]
  );

  const handleAccessibleReveal = () => {
    setForcedReveal(true);
    setClearedMap(
      variant === "heart"
        ? { heart: true }
        : { day: true, month: true, year: true }
    );
    fireBurst();
  };

  const hasValidTarget = Boolean(target && !Number.isNaN(Date.parse(target)));

  return (
    <div className="mx-auto w-full max-w-md px-6 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        ✦ Scratch to reveal the date ✦
      </p>

      {variant === "heart" ? (
        <div className="mt-4 flex justify-center">
          <FoilScratchSurface
            id="heart"
            shape="heart"
            label={`${day} · ${month} · ${year}`}
            subLabel={venue}
            foil={foil}
            forcedCleared={done}
            onDone={handleSurfaceCleared}
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {cards.map((c) => (
            <FoilScratchSurface
              key={c.id}
              id={c.id}
              shape="circle"
              label={c.label}
              value={c.value}
              foil={foil}
              forcedCleared={done}
              onDone={handleSurfaceCleared}
            />
          ))}
        </div>
      )}

      {venue && variant === "3-circles" && (
        <p className="font-editorial mt-4 text-lg italic text-[#161412]/75">{venue}</p>
      )}

      <div className="mt-4 flex flex-col items-center gap-2.5">
        {!done ? (
          <button
            type="button"
            onClick={handleAccessibleReveal}
            className="font-ui inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#161412] shadow-sm transition hover:bg-[#161412] hover:text-white"
          >
            Reveal Date
          </button>
        ) : (
          <p
            className="font-ui inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
            style={{ background: primary }}
          >
            <Sparkles size={13} /> Date revealed — see you there
          </p>
        )}
      </div>

      {done && hasValidTarget && target && (
        <div className="mt-5">
          <Countdown target={target} title={title} venue={venue ?? ""} />
        </div>
      )}
    </div>
  );
}

function FoilScratchSurface({
  id,
  shape,
  label,
  value,
  subLabel,
  foil,
  forcedCleared,
  onDone,
}: {
  id: string;
  shape: "circle" | "heart";
  label: string;
  value?: string;
  subLabel?: string;
  foil: "gold" | "silver" | "rose";
  forcedCleared: boolean;
  onDone: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const clearedRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [localCleared, setLocalCleared] = useState(false);

  const isCleared = forcedCleared || localCleared;

  useEffect(() => {
    if (isCleared) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const size = Math.max(100, wrap.clientWidth);
    const height = shape === "heart" ? Math.round(size * 0.92) : size;
    canvas.width = size * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(2, 2);

    if (shape === "heart") {
      drawHeartPath(ctx, size, height);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const [dark, light] = FOILS[foil] ?? FOILS.gold;
    const grad = ctx.createLinearGradient(0, 0, size, height);
    grad.addColorStop(0, dark);
    grad.addColorStop(0.32, light);
    grad.addColorStop(0.62, dark);
    grad.addColorStop(1, light);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, height);

    // Subtle brushed foil texture lines
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    for (let i = -height; i < size + height; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height * 0.5, height);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.textAlign = "center";
    if (shape === "heart") {
      ctx.font = "700 13px Montserrat, sans-serif";
      ctx.fillText("SCRATCH HEART", size / 2, height * 0.44);
      ctx.font = "500 10px Montserrat, sans-serif";
      ctx.fillText("TO REVEAL DATE", size / 2, height * 0.56);
    } else {
      ctx.font = "600 11px Montserrat, sans-serif";
      ctx.fillText(label.toUpperCase(), size / 2, size / 2 - 4);
      ctx.font = "600 9px Montserrat, sans-serif";
      ctx.fillText("SCRATCH", size / 2, size / 2 + 12);
    }

    ctx.restore();
  }, [foil, isCleared, label, shape]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const eraseSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = canvas.width / rect.width;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = (shape === "heart" ? 38 : 30) * (ratio / 2);
    ctx.beginPath();
    ctx.moveTo(from.x * ratio, from.y * ratio);
    ctx.lineTo(to.x * ratio, to.y * ratio);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(to.x * ratio, to.y * ratio, (shape === "heart" ? 19 : 15) * (ratio / 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const checkProgress = () => {
    if (clearedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 16) {
        total++;
        if (data[i] === 0) transparent++;
      }
      // Heart canvas has transparent corners around the heart shape (~35% empty)
      const threshold = shape === "heart" ? 0.68 : 0.48;
      if (total > 0 && transparent / total > threshold) {
        clearedRef.current = true;
        setLocalCleared(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone(id);
      }
    } catch {
      /* ignore security errors on tainted canvases */
    }
  };

  if (shape === "heart") {
    return (
      <div
        ref={wrapRef}
        className="relative w-64 select-none overflow-hidden"
        style={{ height: 236, touchAction: "none" }}
      >
        {/* Revealed Heart Content */}
        <svg viewBox="0 0 240 220" className="absolute inset-0 h-full w-full drop-shadow-lg" aria-hidden="true">
          <path
            d="M120 194 C34 140, 10 75, 58 38 C91 13, 120 38, 120 62 C120 38, 149 13, 182 38 C230 75, 206 140, 120 194 Z"
            fill="#FFFDF6"
            stroke="#D4AF37"
            strokeWidth="2.5"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-2 text-center">
          <p className="font-ui text-[9px] font-bold uppercase tracking-[0.24em] text-[#6E655F]">
            Save the Date
          </p>
          <p className="font-display mt-1 text-2xl font-bold text-[#2A1215]">{label}</p>
          {subLabel && (
            <p className="font-editorial mt-1 line-clamp-2 text-sm italic text-[#161412]/75">
              {subLabel}
            </p>
          )}
        </div>
        {!isCleared && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              drawingRef.current = true;
              const p = getPos(e);
              lastRef.current = p;
              e.currentTarget.setPointerCapture(e.pointerId);
              eraseSegment(p, p);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current || !lastRef.current) return;
              const p = getPos(e);
              eraseSegment(lastRef.current, p);
              lastRef.current = p;
            }}
            onPointerUp={() => {
              drawingRef.current = false;
              lastRef.current = null;
              checkProgress();
            }}
            onPointerCancel={() => {
              drawingRef.current = false;
              lastRef.current = null;
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative aspect-square w-full select-none overflow-hidden rounded-full shadow-lg ring-1 ring-black/10"
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-0 grid place-items-center rounded-full bg-[#FFFDF6]">
          <div>
            <p className="font-ui text-[9px] uppercase tracking-[0.24em] text-[#6E655F]">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-[#2A1215]">{value}</p>
          </div>
        </div>
        {!isCleared && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-full"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              drawingRef.current = true;
              const p = getPos(e);
              lastRef.current = p;
              e.currentTarget.setPointerCapture(e.pointerId);
              eraseSegment(p, p);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current || !lastRef.current) return;
              const p = getPos(e);
              eraseSegment(lastRef.current, p);
              lastRef.current = p;
            }}
            onPointerUp={() => {
              drawingRef.current = false;
              lastRef.current = null;
              checkProgress();
            }}
            onPointerCancel={() => {
              drawingRef.current = false;
              lastRef.current = null;
            }}
          />
        )}
      </div>
    </div>
  );
}
