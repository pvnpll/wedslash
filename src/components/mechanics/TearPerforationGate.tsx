"use client";
import { memo, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ChevronsRight, Scissors } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface TearPerforationGateProps {
  groom?: string;
  bride?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

/**
 * Tear-Along-Perforation Editorial Gate with spring-smoothed foil strip fill,
 * snapback when released early, and desktop widescreen reveal expansion.
 */
function TearPerforationGateComponent({
  groom,
  bride,
  guestName,
  primary = "#111111",
  gold = "#B8860B",
  tapLabel,
  onOpen,
}: TearPerforationGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [torn, setTorn] = useState(false);

  const zipX = useMotionValue(0);
  const smoothZipX = useSpring(zipX, { stiffness: 320, damping: 28 });
  const stripCut = useTransform(smoothZipX, [0, 200], ["0%", "100%"]);
  const headline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";
  const cta = tapLabel ?? "Zip across strip (or tap) to tear open";

  const triggerTear = () => {
    if (torn) return;
    setTorn(true);
    onOpen?.();
  };

  return (
    <div
      className="relative flex h-full min-h-[min(580px,82dvh)] @2xl:min-h-[620px] w-full flex-col items-center justify-center overflow-hidden px-4 py-8 @2xl:px-10"
      style={{ background: "#F5F2EB", perspective: 1200 }}
    >
      <motion.div
        initial={false}
        animate={torn ? { y: 0, opacity: 1, scale: 1 } : { y: 38, opacity: 0, scale: 0.94 }}
        transition={{
          type: prefersReduced ? "tween" : "spring",
          stiffness: 170,
          damping: 22,
          duration: prefersReduced ? 0.18 : undefined,
          delay: torn && !prefersReduced ? 0.16 : 0,
        }}
        className="relative z-10 w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl"
        style={{ willChange: "transform, opacity" }}
      >
        <GateRevealedCard
          guestName={guestName}
          headline={headline}
          eyebrow="Exclusive Edition · Unsealed"
          primary={primary}
          gold={gold}
          revealed={torn}
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={
          torn
            ? { y: prefersReduced ? 0 : 120, opacity: 0, scale: 0.95 }
            : { y: 0, opacity: 1, scale: 1 }
        }
        transition={{ duration: prefersReduced ? 0.15 : 0.72, delay: torn ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
        style={{ pointerEvents: torn ? "none" : "auto", willChange: "transform, opacity" }}
      >
        <div
          className="relative w-full max-w-[290px] sm:max-w-xs @2xl:max-w-sm overflow-hidden rounded-3xl border bg-white shadow-2xl"
          style={{ borderColor: `${gold}77` }}
        >
          <motion.div
            animate={
              torn
                ? { y: -76, x: 42, rotate: 9, opacity: 0 }
                : { y: 0, x: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: prefersReduced ? 0.15 : 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="relative border-b-2 border-dashed px-4 py-4 text-center text-white"
            style={{
              background: `linear-gradient(125deg, ${primary} 0%, #2B2B2B 100%)`,
              borderColor: gold,
            }}
          >
            <p className="font-ui text-[9px] font-bold uppercase tracking-[0.32em]" style={{ color: gold }}>
              Couture Edition · Seal Strip
            </p>

            <div className="relative mt-3 flex h-11 items-center overflow-hidden rounded-full bg-white/10 px-1.5">
              <motion.div
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full opacity-35"
                style={{ width: stripCut, background: gold }}
              />
              <span className="pointer-events-none w-full pl-8 text-center font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                Swipe strip →
              </span>
              <motion.button
                type="button"
                drag={prefersReduced || torn ? false : "x"}
                dragConstraints={{ left: 0, right: 196 }}
                dragSnapToOrigin
                dragTransition={{ bounceStiffness: 340, bounceDamping: 26 }}
                dragElastic={0.06}
                style={{ x: zipX, touchAction: "none", background: gold, color: "#111111" }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 115) triggerTear();
                }}
                onClick={triggerTear}
                aria-label={cta}
                tabIndex={torn ? -1 : 0}
                className="absolute left-1.5 z-20 grid h-8 w-8 place-items-center rounded-full shadow-lg"
              >
                <ChevronsRight size={15} />
              </motion.button>
            </div>
          </motion.div>

          <div className="px-6 py-10 text-center">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.28em] text-[#6E655F]">
              Invitation Reserved For
            </p>
            <p className="font-script mt-1 text-4xl" style={{ color: gold }}>
              {guestName}
            </p>
            <h3 className="font-display mt-3 break-words text-3xl font-bold leading-tight" style={{ color: primary }}>
              {headline}
            </h3>
            <p className="font-ui mt-5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6E655F]">
              <Scissors size={12} /> {cta}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const TearPerforationGate = memo(TearPerforationGateComponent);
export default TearPerforationGate;
