"use client";
import { useEffect, useRef } from "react";

interface Props { type: string; density?: number; className?: string; }

export default function ParticleCanvas({ type, density = 34, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === "none") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);

    const palettes: Record<string, string[]> = {
      "marigold-petals": ["#F5B301", "#E4572E", "#FFD166", "#C1440E"],
      "rose-petals": ["#E56399", "#A63D57", "#F4A7C3", "#7A2E43"],
      "gold-dust": ["#D4AF37", "#F6E27A", "#C9A227", "#FFF3D6"],
      "stars": ["#FFFFFF", "#F6E27A", "#C9E4FF", "#D4AF37"],
      "snow-blossom": ["#F4A7C3", "#FFFFFF", "#F9D5E5", "#E8B4C8"],
    };
    const colors = palettes[type] ?? palettes["gold-dust"];
    const parts = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 5,
      vy: 0.3 + Math.random() * 0.9,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.02,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      c: colors[Math.floor(Math.random() * colors.length)],
      tw: Math.random() * Math.PI * 2,
    }));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += reduced ? 0 : p.vy;
        p.sway += p.swaySpeed;
        p.rot += p.rotSpeed;
        p.tw += 0.03;
        if (p.y > h + 12) { p.y = -12; p.x = Math.random() * w; }
        const x = p.x + Math.sin(p.sway) * 22;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        if (type === "stars" || type === "gold-dust") {
          ctx.globalAlpha = 0.35 + Math.abs(Math.sin(p.tw)) * 0.65;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [type, density]);

  if (type === "none") return null;
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
