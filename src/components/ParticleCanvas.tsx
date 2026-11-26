"use client";
import { memo, useEffect, useRef } from "react";

interface Props {
  type: string;
  density?: number;
  className?: string;
}

const PALETTES: Record<string, string[]> = {
  "marigold-petals": ["#F5B301", "#E4572E", "#FFD166", "#C1440E"],
  "rose-petals": ["#E56399", "#A63D57", "#F4A7C3", "#7A2E43"],
  "gold-dust": ["#D4AF37", "#F6E27A", "#C9A227", "#FFF3D6"],
  "stars": ["#FFFFFF", "#F6E27A", "#C9E4FF", "#D4AF37"],
  "snow-blossom": ["#F4A7C3", "#FFFFFF", "#F9D5E5", "#E8B4C8"],
};

function ParticleCanvasComponent({ type, density = 24, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === "none") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cappedDensity = Math.min(density, 26);

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let running = false;
    let lastTime = 0;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.offsetWidth || 320;
    let h = canvas.offsetHeight || 480;

    const applyCanvasSize = (nw: number, nh: number) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    applyCanvasSize(w, h);

    const colors = PALETTES[type] ?? PALETTES["gold-dust"];
    const isCircleType = type === "stars" || type === "gold-dust";

    const parts = Array.from({ length: cappedDensity }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 4.5,
      vy: 0.35 + Math.random() * 0.75,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.006 + Math.random() * 0.016,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      c: colors[Math.floor(Math.random() * colors.length)],
      tw: Math.random() * Math.PI * 2,
    }));

    const drawFrame = (dt: number) => {
      const step = dt * 60;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reduced) {
          p.y += p.vy * step;
          p.sway += p.swaySpeed * step;
          p.rot += p.rotSpeed * step;
          p.tw += 0.025 * step;
          if (p.y > h + 12) {
            p.y = -12;
            p.x = Math.random() * w;
          }
        }
        const x = p.x + Math.sin(p.sway) * 18;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        if (isCircleType) {
          ctx.globalAlpha = 0.35 + Math.abs(Math.sin(p.tw)) * 0.6;
          ctx.arc(x, p.y, p.r * 0.6, 0, Math.PI * 2);
        } else {
          ctx.globalAlpha = 0.82;
          ctx.ellipse(x, p.y, p.r, p.r * 0.62, p.rot, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!isVisible || !isPageVisible) {
        running = false;
        lastTime = 0;
        return;
      }
      const dt = lastTime ? Math.max(0, Math.min((now - lastTime) / 1000, 0.032)) : 1 / 60;
      lastTime = now;
      drawFrame(dt);
      if (!reduced) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const startLoop = () => {
      if (running || !isVisible || !isPageVisible) return;
      running = true;
      lastTime = 0;
      if (reduced) {
        drawFrame(0);
        running = false;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      running = false;
      lastTime = 0;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nw = Math.round(entry?.contentRect.width || canvas.offsetWidth);
      const nh = Math.round(entry?.contentRect.height || canvas.offsetHeight);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (nw > 0 && nh > 0 && (nw !== w || nh !== h || nextDpr !== dpr)) {
        applyCanvasSize(nw, nh);
        if (reduced) drawFrame(0);
      }
    });
    ro.observe(canvas);

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) startLoop();
      else stopLoop();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [type, density]);

  if (type === "none") return null;
  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}

const ParticleCanvas = memo(ParticleCanvasComponent);
export default ParticleCanvas;
