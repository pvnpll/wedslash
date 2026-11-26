"use client";
import { memo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface DiyaLampGateProps {
  groom?: string;
  bride?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

/**
 * Brass Diya Temple Lamp Gate: drag the glowing brass spark wand onto the
 * cotton wick (or tap to auto-strike) to ignite a warm flame, expanding a
 * circular temple-light shockwave into the scroll with the lit Diya keepsake.
 */
function DiyaLampGateComponent({
  groom,
  bride,
  guestName,
  primary = "#9A3412",
  gold = "#B8860B",
  tapLabel,
  onOpen,
}: DiyaLampGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [lit, setLit] = useState(false);
  const wickRef = useRef<HTMLDivElement>(null);
  const wandX = useMotionValue(0);
  const wandY = useMotionValue(0);

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const cta = tapLabel ?? "Drag spark to wick (or tap) to light";

  const ignite = () => {
    if (lit) return;
    setLit(true);
    onOpen?.();
  };

  const checkWickContact = (clientX: number, clientY: number) => {
    if (lit) return;
    const wick = wickRef.current;
    if (!wick) return;
    const rect = wick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (Math.hypot(clientX - cx, clientY - cy) < 58) {
      ignite();
    }
  };

  const litDiyaCrest = (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={lit && !prefersReduced ? { scale: [1, 1.12, 1], y: [0, -1, 0] } : undefined}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Flame size={28} className="text-[#FF9D2E]" fill="#FFC94D" />
      </motion.div>
      <div
        className="mt-0.5 h-3.5 w-14 rounded-b-full border-t-2 shadow"
        style={{ background: "linear-gradient(180deg, #9A3412, #431407)", borderColor: gold }}
      />
    </div>
  );

  return (
    <div
      className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-5 py-8"
      style={{ background: "linear-gradient(180deg, #170806 0%, #2A0E04 70%, #170806 100%)" }}
    >
      {/* Expanding Golden Light Wave Reveal */}
      <motion.div
        initial={false}
        animate={
          lit
            ? { clipPath: "circle(140% at 50% 44%)", opacity: 1 }
            : { clipPath: "circle(0% at 50% 44%)", opacity: 0 }
        }
        transition={{ duration: prefersReduced ? 0.2 : 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center px-5"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(255,204,92,0.38) 0%, rgba(255,245,220,0.96) 52%, #FDF5E4 100%)",
          pointerEvents: lit ? "auto" : "none",
        }}
      >
        <div className="w-full max-w-sm">
          <GateRevealedCard
            guestName={guestName}
            headline={headline}
            eyebrow="Subha Muhurtham · Cordially Welcoming"
            subline="with elders' blessings invite you to share in the Muhurtham."
            primary={primary}
            gold={gold}
            surface="warm-dark"
            keepsake={litDiyaCrest}
            revealed={lit}
            delay={0.22}
          />
        </div>
      </motion.div>

      {/* Dark Sanctum Unlit Brass Diya + Draggable Spark Wand */}
      <motion.div
        initial={false}
        animate={{ opacity: lit ? 0 : 1, scale: lit ? 1.06 : 1 }}
        transition={{ duration: prefersReduced ? 0.15 : 0.45, delay: lit ? 0.15 : 0 }}
        className="relative z-20 flex flex-col items-center text-center"
        style={{ pointerEvents: lit ? "none" : "auto", willChange: "transform, opacity" }}
      >
        {/* Wick & Brass Oil Bowl */}
        <div ref={wickRef} className="relative flex flex-col items-center">
          <div
            className="grid h-16 w-16 place-items-center rounded-full border border-dashed"
            style={{ borderColor: `${gold}77`, background: "rgba(255,190,80,0.08)" }}
          >
            <Flame size={30} className="text-white/30" />
          </div>
          <div className="h-3 w-1.5 rounded-full bg-[#3A1C07]" aria-hidden="true" />
          <div
            className="grid h-20 w-52 place-items-center rounded-b-full border-t-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #7C2D12, #431407)",
              borderColor: gold,
            }}
          >
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: gold, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-3 rounded-full border px-4 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFF3D6]"
          style={{ borderColor: `${gold}88`, background: "rgba(0,0,0,0.35)" }}
        >
          For · {guestName}
        </div>

        {/* Draggable Brass Spark Wand */}
        <motion.button
          type="button"
          drag={prefersReduced || lit ? false : true}
          dragSnapToOrigin
          dragElastic={0.35}
          style={{ x: wandX, y: wandY, touchAction: "none" }}
          onDrag={(_, info) => checkWickContact(info.point.x, info.point.y)}
          onClick={ignite}
          aria-label={cta}
          tabIndex={lit ? -1 : 0}
          whileHover={!lit && !prefersReduced ? { scale: 1.08 } : undefined}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FFC94D] px-5 py-2.5 font-ui text-xs font-bold uppercase tracking-[0.14em] text-[#431407] shadow-[0_0_24px_rgba(255,201,77,0.45)]"
        >
          <Sparkles size={15} /> {cta}
        </motion.button>
      </motion.div>
    </div>
  );
}

const DiyaLampGate = memo(DiyaLampGateComponent);
export default DiyaLampGate;
