"use client";
import { memo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCw, Sparkles } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface MandalaDialGateProps {
  groom?: string;
  bride?: string;
  monogram?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

const TARGET_DEGREES = 165;

/**
 * Cryptex Mandala Aperture Gate: twist the golden outer geometric ring clockwise
 * around the center hub (0° -> 180°) until the temple compass aligns, snapping open
 * a circular aperture iris onto the illuminated invitation.
 */
function MandalaDialGateComponent({
  groom,
  bride,
  monogram,
  guestName,
  primary = "#0B3D2E",
  gold = "#D4AF37",
  tapLabel,
  onOpen,
}: MandalaDialGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastRadRef = useRef(0);
  const angleRef = useRef(0);

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const displayMonogram =
    monogram ||
    [groom?.trim()?.[0], bride?.trim()?.[0]].filter(Boolean).join(" · ") ||
    "✦";
  const cta = tapLabel ?? "Twist golden mandala dial clockwise";

  const snapOpen = () => {
    if (unlocked) return;
    draggingRef.current = false;
    setIsDragging(false);
    angleRef.current = 180;
    setAngle(180);
    setUnlocked(true);
    onOpen?.();
  };

  const pointerAngleRad = (clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || unlocked) return;
    const currentRad = pointerAngleRad(e.clientX, e.clientY);
    let deltaRad = currentRad - lastRadRef.current;
    if (deltaRad > Math.PI) deltaRad -= Math.PI * 2;
    if (deltaRad < -Math.PI) deltaRad += Math.PI * 2;
    lastRadRef.current = currentRad;

    const deltaDeg = (deltaRad * 180) / Math.PI;
    const next = Math.max(0, Math.min(180, angleRef.current + deltaDeg));
    angleRef.current = next;
    setAngle(next);
    if (next >= TARGET_DEGREES) {
      snapOpen();
    }
  };

  const pct = Math.min(100, Math.round((angle / TARGET_DEGREES) * 100));

  return (
    <div
      className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-5 py-8"
      style={{
        background: `radial-gradient(circle at 50% 42%, ${gold}1F 0%, transparent 62%), linear-gradient(180deg, #07261C 0%, ${primary} 100%)`,
      }}
    >
      {/* Revealed Card through Expanding Radial Aperture */}
      <motion.div
        initial={false}
        animate={
          unlocked
            ? { clipPath: "circle(145% at 50% 48%)", opacity: 1 }
            : { clipPath: "circle(0% at 50% 48%)", opacity: 0 }
        }
        transition={{ duration: prefersReduced ? 0.2 : 0.88, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center px-5"
        style={{
          pointerEvents: unlocked ? "auto" : "none",
          background: "#F4EFE3",
        }}
      >
        <div className="w-full max-w-sm">
          <GateRevealedCard
            guestName={guestName}
            headline={headline}
            eyebrow="Aligned In Celebration"
            primary={primary}
            gold={gold}
            keepsake={
              <span
                className="grid h-12 w-12 place-items-center rounded-full border-2 font-display text-sm font-bold shadow-sm"
                style={{ borderColor: gold, background: primary, color: gold }}
              >
                {displayMonogram}
              </span>
            }
            revealed={unlocked}
            delay={0.18}
          />
        </div>
      </motion.div>

      {/* Interactive Mechanical Mandala Wheel */}
      <motion.div
        initial={false}
        animate={{ opacity: unlocked ? 0 : 1, scale: unlocked ? 1.15 : 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-20 flex flex-col items-center text-center"
        style={{ pointerEvents: unlocked ? "none" : "auto" }}
      >
        <div
          className="rounded-full border bg-black/30 px-4 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFF8E7]"
          style={{ borderColor: `${gold}66` }}
        >
          For · {guestName} · Align {pct}%
        </div>

        {/* Target zenith marker */}
        <div className="mt-4 mb-1 h-2.5 w-2.5 rotate-45" style={{ background: gold }} aria-hidden="true" />

        <div
          ref={wheelRef}
          onPointerDown={(e) => {
            if (unlocked || prefersReduced) return;
            draggingRef.current = true;
            setIsDragging(true);
            lastRadRef.current = pointerAngleRad(e.clientX, e.clientY);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            draggingRef.current = false;
            setIsDragging(false);
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
            setIsDragging(false);
          }}
          className="relative grid h-64 w-64 cursor-grab select-none place-items-center active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          {/* Rotating Brass Cryptex Outer Ring */}
          <svg
            viewBox="0 0 220 220"
            className="h-64 w-64"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: isDragging ? "none" : "transform 450ms cubic-bezier(0.22,1,0.36,1)",
              willChange: "transform",
            }}
            aria-hidden="true"
          >
            <circle cx="110" cy="110" r="102" stroke={gold} strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
            <circle cx="110" cy="110" r="88" stroke={`${gold}99`} strokeWidth="1.2" fill="rgba(0,0,0,0.22)" />
            {/* 8 compass petals */}
            {Array.from({ length: 8 }).map((_, i) => {
              const deg = i * 45;
              return (
                <g key={i} transform={`rotate(${deg} 110 110)`}>
                  <polygon points="110,12 116,28 104,28" fill={i === 4 ? "#F6E27A" : gold} fillOpacity={i === 4 ? 1 : 0.45} />
                </g>
              );
            })}
            {/* Grip nub at bottom-start (moves to top zenith when turned 180deg!) */}
            <circle cx="110" cy="206" r="8" fill={gold} stroke="#07261C" strokeWidth="2.5" />
          </svg>

          {/* Center Stationary Monogram Button */}
          <button
            type="button"
            onClick={snapOpen}
            aria-label={cta}
            tabIndex={unlocked ? -1 : 0}
            className="absolute grid h-24 w-24 place-items-center rounded-full border-2 bg-black/55 shadow-2xl transition hover:scale-105"
            style={{ borderColor: gold, color: gold }}
          >
            <span className="font-display text-2xl font-bold">{displayMonogram}</span>
            <span className="font-ui inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#FFF8E7]">
              <RotateCw size={10} /> Twist
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={snapOpen}
          tabIndex={unlocked ? -1 : 0}
          className="font-ui mt-4 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#07261C] shadow-lg"
        >
          <Sparkles size={13} /> {cta}
        </button>
      </motion.div>
    </div>
  );
}

const MandalaDialGate = memo(MandalaDialGateComponent);
export default MandalaDialGate;
