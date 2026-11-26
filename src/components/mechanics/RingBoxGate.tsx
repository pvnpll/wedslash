"use client";
import { memo, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ChevronUp, Gem } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface RingBoxGateProps {
  groom?: string;
  bride?: string;
  monogram?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

/**
 * Spring-Loaded Jewelry Ring Box Gate: slide the golden clasp UP (or tap)
 * to pop the lid open in 3D while the diamond keepsake rises directly
 * into the revealed invitation crest with zero abrupt unmount pop.
 */
function RingBoxGateComponent({
  groom,
  bride,
  monogram,
  guestName,
  primary = "#3B2F2F",
  gold = "#C9A227",
  tapLabel,
  onOpen,
}: RingBoxGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [opened, setOpened] = useState(false);

  const claspY = useMotionValue(0);
  const lidPeekRotate = useTransform(claspY, [-52, 0], [-28, 0]);

  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const lidMonogram =
    monogram?.trim() ||
    [groom?.trim()?.[0], bride?.trim()?.[0]].filter(Boolean).join(" · ") ||
    "∞";
  const cta = tapLabel ?? "Slide clasp up to open ring box";

  const triggerOpen = () => {
    if (opened) return;
    setOpened(true);
    onOpen?.();
  };

  const ringKeepsake = (
    <motion.div
      initial={false}
      animate={
        opened && !prefersReduced
          ? { scale: [0.7, 1.12, 1], y: [14, -4, 0] }
          : { scale: 1, y: 0 }
      }
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid h-16 w-16 place-items-center rounded-full border-2 shadow-md"
      style={{
        borderColor: `${gold}88`,
        background: `radial-gradient(circle, ${gold}28 0%, ${primary}14 100%)`,
      }}
    >
      <div
        className="absolute inset-x-3.5 bottom-2 h-8 rounded-b-full border-2 border-t-0"
        style={{ borderColor: gold }}
      />
      <Gem size={24} style={{ color: gold }} className="relative -mt-2" />
    </motion.div>
  );

  return (
    <div
      className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-5 py-8"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${primary}22 0%, transparent 60%), linear-gradient(180deg, #FAF3E3 0%, #F3E7CF 100%)`,
        perspective: 1200,
      }}
    >
      {/* Revealed Invitation Card blooming from the ring box cushion */}
      <div className="relative z-10 w-full max-w-sm">
        <GateRevealedCard
          guestName={guestName}
          headline={headline}
          eyebrow="She said yes · He said always"
          subline="are engaged — and you are invited to celebrate with them."
          primary={primary}
          gold={gold}
          keepsake={ringKeepsake}
          revealed={opened}
          delay={0.28}
        />
      </div>

      {/* Ring Box Gate Overlay — Lid opens in 3D, ring rises, then box smoothly recedes down */}
      <motion.div
        initial={false}
        animate={
          opened
            ? { y: prefersReduced ? 0 : 70, scale: 0.92, opacity: 0 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        transition={{
          duration: prefersReduced ? 0.15 : 0.72,
          delay: opened ? 0.42 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5"
        style={{
          pointerEvents: opened ? "none" : "auto",
          willChange: "transform, opacity",
        }}
      >
        <div className="relative flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
          {/* Sunburst glow when lid opens */}
          <motion.div
            initial={false}
            animate={
              opened
                ? { opacity: [0, 0.95, 0], scale: [0.5, 1.8, 2.2] }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{ duration: 0.85 }}
            className="pointer-events-none absolute -top-10 h-44 w-44 rounded-full"
            style={{ background: `radial-gradient(circle, ${gold}AA 0%, transparent 70%)` }}
            aria-hidden="true"
          />

          {/* Hinged Velvet Lid */}
          <motion.div
            initial={false}
            animate={opened ? { rotateX: prefersReduced ? 0 : -115 } : undefined}
            style={{
              rotateX: opened ? undefined : lidPeekRotate,
              transformStyle: "preserve-3d",
              background: `linear-gradient(180deg, ${primary}, #241D1D)`,
              border: `1.5px solid ${gold}77`,
            }}
            transition={{ duration: prefersReduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 mx-auto h-16 w-56 origin-top rounded-t-2xl border-b-0 shadow-xl"
          >
            <div
              className="absolute inset-x-8 top-2.5 h-2 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
            />
            <p className="pt-6 text-center font-ui text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: gold }}>
              {lidMonogram}
            </p>
          </motion.div>

          {/* Clasp Latch — Drag UP to pop open */}
          <motion.button
            type="button"
            drag={prefersReduced || opened ? false : "y"}
            dragConstraints={{ top: -52, bottom: 0 }}
            dragElastic={0.14}
            style={{ y: claspY, touchAction: "none", borderColor: gold }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -28) triggerOpen();
            }}
            onClick={triggerOpen}
            aria-label={cta}
            tabIndex={opened ? -1 : 0}
            whileHover={!opened && !prefersReduced ? { scale: 1.08 } : undefined}
            className="relative z-30 -my-3 grid h-10 w-10 place-items-center rounded-full border-2 bg-[#161412] text-white shadow-xl"
          >
            <ChevronUp size={16} style={{ color: gold }} />
          </motion.button>

          {/* Velvet Box Base */}
          <div
            className="relative z-10 mx-auto w-60 rounded-b-2xl px-5 pb-6 pt-5 text-center shadow-2xl"
            style={{ background: `linear-gradient(180deg, ${primary}EE, #1D1515)`, border: `1.5px solid ${gold}55` }}
          >
            <div
              className="mx-auto inline-block rounded-full border px-3.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FFF6E3]"
              style={{ borderColor: `${gold}55` }}
            >
              For · {guestName}
            </div>
            <p className="font-display mt-2 text-xl font-bold text-white">{headline}</p>
          </div>
        </div>

        <span className="font-ui mt-5 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
          <ChevronUp size={14} style={{ color: gold }} /> {cta}
        </span>
      </motion.div>
    </div>
  );
}

const RingBoxGate = memo(RingBoxGateComponent);
export default RingBoxGate;
