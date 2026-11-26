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
 * Morning Lake Mist Wipe Gate: the live invitation sits behind a frosted glass
 * condensation canvas. As the guest rubs away the mist (destination-out strokes),
 * the crystal invitation appears directly in place with zero swap jump.
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

    // Subtle frosted dew droplets across the pane
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

  const wipeStroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const rect = rectRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx || !rect || !rect.width) return;
    const ratio = canvas.width / rect.width;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46 * ratio;
    ctx.beginPath();
    ctx.moveTo(from.x * ratio, from.y * ratio);
    ctx.lineTo(to.x * ratio, to.y * ratio);
    ctx.stroke();
    ctx.restore();

    wipeDistRef.current += Math.hypot(to.x - from.x, to.y - from.y);
    if (wipeDistRef.current >= 160) {
      wipeDistRef.current = 0;
      sampleClearProgress();
    }
  };

  return (
    <div
      className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-[#ECEAE4] px-5 py-8"
    >
      {/* Frosted Glass Showcase Window */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/10"
        style={{ background: "#FAF7F2" }}
      >
        {/* Underlying live invitation sits right behind the condensation pane */}
        <GateRevealedCard
          guestName={guestName}
          headline={headline}
          eyebrow="Crystal Clear · Morning Light"
          primary={primary}
          gold={gold}
          revealed
        />

        {/* Mist Canvas Layer (dissolves cleanly once 34%+ wiped) */}
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
              e.currentTarget.setPointerCapture(e.pointerId);
              wipeStroke(pt, pt);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current || !lastRef.current || cleared) return;
              const rect = rectRef.current;
              if (!rect) return;
              const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
              wipeStroke(lastRef.current, pt);
              lastRef.current = pt;
            }}
            onPointerUp={() => {
              drawingRef.current = false;
              lastRef.current = null;
              sampleClearProgress();
            }}
            onPointerCancel={() => {
              drawingRef.current = false;
              lastRef.current = null;
            }}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          />
        </motion.div>
      </div>

      {/* Fixed-height Prompt / Quick Clear slot so clearing mist causes zero layout shift */}
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
