"use client";
import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Droplets, Sparkles } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface FrostWipeGateProps {
  groom?: string;
  bride?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

/**
 * Morning Lake Mist Wipe Gate: smooth quadratic-midpoint condensation brush
 * reveals the live couture card right behind the pane with 0px layout shift
 * and automatic desktop widescreen expansion.
 */
function FrostWipeGateComponent({
  groom,
  bride,
  guestName,
  primary = "#3A3A38",
  gold = "#B8A05A",
  tapLabel,
  onOpen,
}: FrostWipeGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [cleared, setCleared] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const midRef = useRef<{ x: number; y: number } | null>(null);
  const wipeDistRef = useRef(0);

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const cta = tapLabel ?? "Wipe the mist off the glass";

  const completeClear = () => {
    if (cleared) return;
    setCleared(true);
    onOpen?.();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cleared) return;
    const width = canvas.offsetWidth || 360;
    const height = canvas.offsetHeight || 460;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "rgba(241, 244, 246, 0.96)");
    grad.addColorStop(0.5, "rgba(230, 236, 240, 0.94)");
    grad.addColorStop(1, "rgba(244, 241, 234, 0.96)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 65; i++) {
      const rx = ((i * 97) % 100) * 0.01 * w;
      const ry = ((i * 53) % 100) * 0.01 * h;
      const rr = (2 + (i % 5)) * 2;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.arc(rx, ry, rr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#4A4E54";
    ctx.font = "600 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`FOR · ${guestName.toUpperCase()}`, w / 2, h / 2 - 22);
    ctx.font = "italic 30px Georgia, serif";
    ctx.fillStyle = primary;
    ctx.fillText("Wipe the morning mist", w / 2, h / 2 + 24);
  }, [cleared, guestName, primary]);

  const sampleClearProgress = () => {
    if (cleared) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 64) {
        total++;
        if (data[i] < 40) clearPixels++;
      }
      if (total > 0 && clearPixels / total >= 0.34) {
        completeClear();
      }
    } catch {
      /* ignore security errors */
    }
  };

  const wipeToPoint = (pt: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const rect = rectRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    const prev = lastRef.current;
    const prevMid = midRef.current ?? prev;
    if (!canvas || !ctx || !rect || !rect.width || !prev || !prevMid) return;

    const ratio = canvas.width / rect.width;
    const nextMid = { x: (prev.x + pt.x) / 2, y: (prev.y + pt.y) / 2 };

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 50 * ratio;
    ctx.beginPath();
    ctx.moveTo(prevMid.x * ratio, prevMid.y * ratio);
    ctx.quadraticCurveTo(prev.x * ratio, prev.y * ratio, nextMid.x * ratio, nextMid.y * ratio);
    ctx.stroke();
    ctx.restore();

    wipeDistRef.current += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    lastRef.current = pt;
    midRef.current = nextMid;

    if (wipeDistRef.current >= 160) {
      wipeDistRef.current = 0;
      sampleClearProgress();
    }
  };

  return (
    <div className="relative flex h-full min-h-[min(580px,82dvh)] @2xl:min-h-[620px] w-full flex-col items-center justify-center overflow-hidden bg-[#ECEAE4] px-4 py-8 @2xl:px-10">
      <div
        className="relative w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/10"
        style={{ background: "#FAF7F2" }}
      >
        <GateRevealedCard
          guestName={guestName}
          headline={headline}
          eyebrow="Crystal Clear · Morning Light"
          primary={primary}
          gold={gold}
          revealed
        />

        <motion.div
          initial={false}
          animate={{ opacity: cleared ? 0 : 1, scale: cleared ? 1.03 : 1 }}
          transition={{ duration: prefersReduced ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20"
          style={{ pointerEvents: cleared ? "none" : "auto", willChange: "opacity, transform" }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              const canvas = canvasRef.current;
              if (!canvas || cleared) return;
              const rect = canvas.getBoundingClientRect();
              rectRef.current = rect;
              drawingRef.current = true;
              const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
              lastRef.current = pt;
              midRef.current = pt;
              e.currentTarget.setPointerCapture(e.pointerId);
              wipeToPoint(pt);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current || cleared) return;
              const rect = rectRef.current;
              if (!rect) return;
              wipeToPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onPointerUp={() => {
              drawingRef.current = false;
              lastRef.current = null;
              midRef.current = null;
              sampleClearProgress();
            }}
            onPointerCancel={() => {
              drawingRef.current = false;
              lastRef.current = null;
              midRef.current = null;
            }}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          />
        </motion.div>
      </div>

      {/* Fixed-height slot prevents any layout jump when fading away */}
      <div className="mt-4 flex min-h-[40px] items-center justify-center">
        <motion.button
          type="button"
          onClick={completeClear}
          initial={false}
          animate={{ opacity: cleared ? 0 : 1, y: cleared ? 6 : 0 }}
          transition={{ duration: prefersReduced ? 0.12 : 0.35 }}
          tabIndex={cleared ? -1 : 0}
          aria-hidden={cleared}
          style={{ pointerEvents: cleared ? "none" : "auto" }}
          className="font-ui inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition-colors hover:bg-[#3A3A38]"
        >
          <Droplets size={13} className="text-[#F6E27A]" /> {cta} ·{" "}
          <Sparkles size={12} /> Clear
        </motion.button>
      </div>
    </div>
  );
}

const FrostWipeGate = memo(FrostWipeGateComponent);
export default FrostWipeGate;
