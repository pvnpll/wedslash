"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  day: string;
  month: string;
  year: string;
  venue?: string;
  foil?: "gold" | "silver" | "rose";
  onReveal?: () => void;
}

const FOILS: Record<string, [string, string]> = {
  gold: ["#8a6d1c", "#F6E27A"],
  silver: ["#6b7280", "#F3F4F6"],
  rose: ["#9d4e5c", "#F9C5D5"],
};

export default function ScratchCard({ day, month, year, venue, foil = "gold", onReveal }: Props) {
  const [done, setDone] = useState(false);
  const fired = useRef(false);
  const cards = [
    { label: "Day", value: day },
    { label: "Month", value: month },
    { label: "Year", value: year },
  ];

  return (
    <div className="mx-auto w-full max-w-md px-6 text-center">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">✦ Scratch to reveal the date ✦</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <FoilCircle key={c.label} label={c.label} value={c.value} foil={foil} delay={i * 0.4} onDone={() => {
            if (!fired.current) { fired.current = true; setDone(true); onReveal?.(); }
          }} />
        ))}
      </div>
      {venue && <p className="font-editorial mt-4 text-lg italic text-[#161412]/75">{venue}</p>}
      {done && (
        <p className="font-ui mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#6E1F2F] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          <Sparkles size={13} /> Date revealed — see you there
        </p>
      )}
    </div>
  );
}

function FoilCircle({ label, value, foil, delay, onDone }: { label: string; value: string; foil: string; delay: number; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cleared, setCleared] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const size = wrap.clientWidth;
    canvas.width = size * 2; canvas.height = size * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    const [dark, light] = FOILS[foil] ?? FOILS.gold;
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, dark); g.addColorStop(0.35, light); g.addColorStop(0.6, dark); g.addColorStop(1, light);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "600 11px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label.toUpperCase(), size / 2, size / 2 - 4);
    ctx.font = "600 9px Montserrat, sans-serif";
    ctx.fillText("SCRATCH", size / 2, size / 2 + 12);
  }, [foil, label]);

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * (scale / 2), y * (scale / 2), 16 * (scale / 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const checkDone = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] === 0) clear++;
      if (clear / (data.length / 16) > 0.45 && !cleared) {
        setCleared(true);
        const c = canvasRef.current;
        if (c) { const cc = c.getContext("2d"); cc?.clearRect(0, 0, c.width, c.height); }
        setTimeout(onDone, delay * 1000);
      }
    } catch { /* cross-origin safe */ }
  };

  return (
    <div>
      <div ref={wrapRef} className="relative aspect-square w-full select-none overflow-hidden rounded-full shadow-lg ring-1 ring-black/10" style={{ touchAction: "none" }}>
        <div className="absolute inset-0 grid place-items-center rounded-full bg-[#FFFDF6]">
          <div>
            <p className="font-ui text-[9px] uppercase tracking-[0.24em] text-[#6E655F]">{label}</p>
            <p className="font-display text-2xl font-bold text-[#2A1215]">{value}</p>
          </div>
        </div>
        {!cleared && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-full"
            onPointerDown={(e) => { drawing.current = true; last.current = pos(e); (e.target as HTMLElement).setPointerCapture(e.pointerId); erase(pos(e).x, pos(e).y); }}
            onPointerMove={(e) => { if (!drawing.current || !last.current) return; const p = pos(e); erase(p.x, p.y); last.current = p; }}
            onPointerUp={() => { drawing.current = false; last.current = null; checkDone(); }}
          />
        )}
      </div>
    </div>
  );
}
