"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { memo, useState } from "react";
import { ChevronDown, ChevronsRight, MoveHorizontal } from "lucide-react";
import GateRevealedCard from "./GateRevealedCard";

export interface EnvelopeGateProps {
  variant?: "wax-envelope" | "palace-doors" | "curtain-reveal";
  groom?: string;
  bride?: string;
  monogram?: string;
  venueTitle?: string;
  city?: string;
  guestName: string;
  primary?: string;
  gold?: string;
  tapLabel?: string;
  onOpen?: () => void;
}

const SPRING_BOUNCE = { bounceStiffness: 340, bounceDamping: 26 };

/**
 * Three tactile gesture gates with live continuous drag feedback, spring snapback
 * when released early, container-responsive desktop scaling, and smooth GPU transitions:
 * - wax-envelope: swipe-to-unseal satin ribbon -> flap hinges open & envelope recedes.
 * - palace-doors: pull brass bolt down -> doors crack live via outer transform before swinging 3D open.
 * - curtain-reveal: pull braided cord down -> velvet drapes part smoothly over pre-mounted card.
 */
function EnvelopeGateComponent({
  variant = "wax-envelope",
  groom,
  bride,
  monogram,
  venueTitle,
  city,
  guestName,
  primary = "#0E6B5E",
  gold = "#C9A227",
  tapLabel,
  onOpen,
}: EnvelopeGateProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [opened, setOpened] = useState(false);

  const swipeX = useMotionValue(0);
  const boltY = useMotionValue(0);
  const cordY = useMotionValue(0);

  const smoothBoltY = useSpring(boltY, { stiffness: 320, damping: 28 });
  const smoothCordY = useSpring(cordY, { stiffness: 320, damping: 28 });

  const ribbonOpacity = useTransform(swipeX, [0, 130], [1, 0]);
  const leftDoorPeek = useTransform(smoothBoltY, [0, 68], [0, -18]);
  const rightDoorPeek = useTransform(smoothBoltY, [0, 68], [0, 18]);
  const leftCurtainPeek = useTransform(smoothCordY, [0, 80], [0, -24]);
  const rightCurtainPeek = useTransform(smoothCordY, [0, 80], [0, 24]);

  const displayMonogram =
    monogram ||
    (groom && bride
      ? `${groom.trim().charAt(0)} · ${bride.trim().charAt(0)}`
      : "✦");

  const coupleHeadline =
    groom && bride ? `${groom} & ${bride}` : groom || bride || "Together in Celebration";

  const locationLine =
    venueTitle && city
      ? `celebrating at ${venueTitle}, ${city} — and you are on the guest list.`
      : venueTitle
      ? `celebrating at ${venueTitle} — and you are on the guest list.`
      : city
      ? `celebrating in ${city} — and you are on the guest list.`
      : "joyfully invite you to share in our celebration.";

  const defaultGestureLabel =
    variant === "palace-doors"
      ? "Pull brass bolt down to unlatch"
      : variant === "curtain-reveal"
      ? "Pull velvet cord down to part"
      : "Swipe seal or tap to unseal";
  const ctaText = tapLabel ?? defaultGestureLabel;

  const triggerOpen = () => {
    if (opened) return;
    setOpened(true);
    onOpen?.();
  };

  return (
    <div
      className="relative flex h-full min-h-[min(580px,82dvh)] @2xl:min-h-[620px] w-full flex-col items-center justify-center overflow-hidden bg-[#FDF8EF] paper-grain px-4 py-8 @2xl:px-10"
      style={{ perspective: 1400 }}
    >
      {/* Revealed card sits permanently in place behind doors/curtains, or blooms upward out of envelope */}
      <motion.div
        initial={false}
        animate={
          variant === "wax-envelope"
            ? opened
              ? { y: 0, scale: 1, opacity: 1 }
              : { y: 42, scale: 0.92, opacity: 0 }
            : { y: 0, scale: opened ? 1 : 0.97, opacity: 1 }
        }
        transition={{
          type: prefersReduced ? "tween" : "spring",
          stiffness: 170,
          damping: 22,
          duration: prefersReduced ? 0.16 : undefined,
          delay: variant === "wax-envelope" && opened && !prefersReduced ? 0.16 : 0,
        }}
        className="relative z-10 w-full max-w-md @2xl:max-w-2xl @4xl:max-w-3xl"
        style={{ willChange: "transform, opacity" }}
      >
        <GateRevealedCard
          guestName={guestName}
          headline={coupleHeadline}
          subline={locationLine}
          badgeText={[venueTitle, city].filter(Boolean).join(" · ") || undefined}
          primary={primary}
          gold={gold}
          revealed={opened || variant !== "wax-envelope"}
        />
      </motion.div>

      {/* LAYERED ENTRY BARRIER */}
      {variant === "wax-envelope" && (
        <motion.div
          initial={false}
          animate={
            opened
              ? { y: prefersReduced ? 0 : 110, opacity: 0, scale: 0.94 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: prefersReduced ? 0.15 : 0.82, delay: opened ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          style={{
            pointerEvents: opened ? "none" : "auto",
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[330px] @2xl:max-w-[400px]" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
              initial={false}
              animate={opened ? { rotateX: prefersReduced ? 0 : 172 } : { rotateX: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 z-20 h-32 sm:h-36 origin-top shadow-md"
              style={{
                transformStyle: "preserve-3d",
                background: `linear-gradient(180deg, ${primary}, ${primary}DD)`,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />

            <div className="relative z-10 rounded-2xl border border-black/10 bg-[#FFFDF6] px-5 pb-7 pt-36 sm:px-6 sm:pb-8 sm:pt-40 text-center shadow-2xl">
              <div
                className="mx-auto inline-block rounded-full border px-3.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6E655F]"
                style={{ borderColor: `${gold}55` }}
              >
                Invitation For
              </div>
              <p className="font-display mt-2 break-words text-2xl font-bold text-[#161412]">{guestName}</p>

              {/* Draggable Satin Seal Strip Track */}
              <div
                className="relative mx-auto mt-4 flex h-12 w-full max-w-[224px] items-center overflow-hidden rounded-full border bg-[#FAF3E6] p-1"
                style={{ borderColor: `${gold}66` }}
              >
                <motion.span
                  style={{ opacity: ribbonOpacity }}
                  className="pointer-events-none inset-x-0 w-full pl-9 text-center font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E655F]"
                >
                  Slide seal →
                </motion.span>
                <motion.button
                  type="button"
                  drag={prefersReduced || opened ? false : "x"}
                  dragConstraints={{ left: 0, right: 168 }}
                  dragSnapToOrigin
                  dragTransition={SPRING_BOUNCE}
                  dragElastic={0.08}
                  style={{
                    x: swipeX,
                    touchAction: "none",
                    borderColor: `${gold}AA`,
                    background: `radial-gradient(circle at 35% 30%, ${gold}, ${primary})`,
                  }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 85) triggerOpen();
                  }}
                  onClick={triggerOpen}
                  aria-label={ctaText}
                  tabIndex={opened ? -1 : 0}
                  whileHover={!opened && !prefersReduced ? { scale: 1.06 } : undefined}
                  className="absolute left-1 z-30 grid h-10 w-10 place-items-center rounded-full border text-xs font-bold text-white shadow-lg"
                >
                  <ChevronsRight size={16} />
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={
                opened
                  ? { scale: [1, 1.15, 0], opacity: [1, 0.8, 0], rotate: 18 }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ duration: prefersReduced ? 0 : 0.45 }}
              onClick={triggerOpen}
              className="absolute left-1/2 top-24 sm:top-28 z-30 grid h-16 w-16 -translate-x-1/2 cursor-pointer place-items-center rounded-full border-2 text-base font-bold text-white shadow-xl"
              style={{
                borderColor: `${gold}99`,
                background: `radial-gradient(circle at 35% 30%, ${gold}, ${primary})`,
              }}
            >
              <span className="font-display tracking-wider">{displayMonogram}</span>
            </motion.div>
          </div>
          <p className="font-ui mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E655F]">
            <MoveHorizontal size={13} /> {ctaText}
          </p>
        </motion.div>
      )}

      {variant === "palace-doors" && (
        <motion.div
          initial={false}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.45, delay: opened ? 0.55 : 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          style={{
            pointerEvents: opened ? "none" : "auto",
            willChange: "opacity",
            perspective: 1400,
          }}
        >
          <div
            className="arch-frame @2xl:rounded-[2rem] relative h-[380px] sm:h-[440px] w-full max-w-[320px] sm:max-w-sm @2xl:max-w-xl overflow-hidden border-2 bg-transparent shadow-2xl"
            style={{ borderColor: gold }}
          >
            {/* Outer peek wrapper responds 1:1 to brass bolt drag; inner door swings 3D open */}
            <motion.div style={{ x: leftDoorPeek }} className="absolute inset-y-0 left-0 w-1/2">
              <motion.div
                initial={false}
                animate={
                  opened
                    ? { x: "-100%", rotateY: prefersReduced ? 0 : 88 }
                    : { x: 0, rotateY: 0 }
                }
                style={{
                  borderColor: `${gold}AA`,
                  background: `linear-gradient(135deg, ${primary} 0%, #240A10 100%)`,
                  transformOrigin: "left center",
                  willChange: "transform",
                }}
                transition={{ duration: prefersReduced ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full border-r p-3"
              >
                <div className="h-full w-full rounded-tl-full border p-2" style={{ borderColor: `${gold}66` }}>
                  <div className="h-full w-full rounded-tl-full border border-dashed" style={{ borderColor: `${gold}44` }} />
                </div>
              </motion.div>
            </motion.div>

            <motion.div style={{ x: rightDoorPeek }} className="absolute inset-y-0 right-0 w-1/2">
              <motion.div
                initial={false}
                animate={
                  opened
                    ? { x: "100%", rotateY: prefersReduced ? 0 : -88 }
                    : { x: 0, rotateY: 0 }
                }
                style={{
                  borderColor: `${gold}AA`,
                  background: `linear-gradient(225deg, ${primary} 0%, #240A10 100%)`,
                  transformOrigin: "right center",
                  willChange: "transform",
                }}
                transition={{ duration: prefersReduced ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full border-l p-3"
              >
                <div className="h-full w-full rounded-tr-full border p-2" style={{ borderColor: `${gold}66` }}>
                  <div className="h-full w-full rounded-tr-full border border-dashed" style={{ borderColor: `${gold}44` }} />
                </div>
              </motion.div>
            </motion.div>

            {/* Sliding Brass Bolt Handle in the center seam */}
            <motion.div
              animate={opened ? { opacity: 0, scale: 0.75, y: 24 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
            >
              <div
                className="mb-3 rounded-full border bg-black/50 px-4 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFF8E7]"
                style={{ borderColor: `${gold}88` }}
              >
                For · {guestName}
              </div>

              <div className="relative flex h-32 w-16 flex-col items-center rounded-full border bg-black/45 p-1.5" style={{ borderColor: `${gold}77` }}>
                <motion.button
                  type="button"
                  drag={prefersReduced || opened ? false : "y"}
                  dragConstraints={{ top: 0, bottom: 68 }}
                  dragSnapToOrigin
                  dragTransition={SPRING_BOUNCE}
                  dragElastic={0.12}
                  style={{ y: boltY, touchAction: "none", borderColor: gold, color: gold }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 40) triggerOpen();
                  }}
                  onClick={triggerOpen}
                  aria-label={ctaText}
                  tabIndex={opened ? -1 : 0}
                  whileHover={!opened && !prefersReduced ? { scale: 1.07 } : undefined}
                  className="grid h-14 w-12 place-items-center rounded-full border-2 bg-[#161412] shadow-xl"
                >
                  <span className="font-display text-sm font-bold">{displayMonogram}</span>
                </motion.button>
                <ChevronDown size={14} className="mt-auto mb-1 animate-bounce text-white/75" />
              </div>
            </motion.div>
          </div>
          <p className="font-ui mt-4 rounded-full bg-[#161412] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg">
            {ctaText}
          </p>
        </motion.div>
      )}

      {variant === "curtain-reveal" && (
        <motion.div
          initial={false}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.45, delay: opened ? 0.55 : 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          style={{ pointerEvents: opened ? "none" : "auto", willChange: "opacity" }}
        >
          <div
            className="relative h-[380px] sm:h-[440px] w-full max-w-[320px] sm:max-w-sm @2xl:max-w-xl overflow-hidden rounded-[2rem] border bg-transparent shadow-2xl"
            style={{ borderColor: `${gold}88` }}
          >
            {/* Outer peek wrapper responds to drawstring pull in real time */}
            <motion.div style={{ x: leftCurtainPeek }} className="absolute inset-y-0 left-0 w-[52%]">
              <motion.div
                initial={false}
                animate={opened ? { x: "-100%", scaleX: 0.58 } : { x: 0, scaleX: 1 }}
                style={{
                  background: `repeating-linear-gradient(90deg, ${primary} 0px, ${primary} 14px, #1B090D 22px, ${primary} 30px)`,
                  willChange: "transform",
                }}
                transition={{ duration: prefersReduced ? 0.15 : 0.92, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full origin-left"
              />
            </motion.div>

            <motion.div style={{ x: rightCurtainPeek }} className="absolute inset-y-0 right-0 w-[52%]">
              <motion.div
                initial={false}
                animate={opened ? { x: "100%", scaleX: 0.58 } : { x: 0, scaleX: 1 }}
                style={{
                  background: `repeating-linear-gradient(90deg, ${primary} 0px, #1B090D 10px, ${primary} 22px, ${primary} 30px)`,
                  willChange: "transform",
                }}
                transition={{ duration: prefersReduced ? 0.15 : 0.92, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full origin-right"
              />
            </motion.div>

            <div
              className="absolute inset-x-0 top-0 h-4 border-b"
              style={{ background: gold, borderColor: "#FFFDF6" }}
            />

            <motion.div
              animate={opened ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
            >
              <p className="font-ui rounded-full bg-black/55 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                For · {guestName}
              </p>

              <motion.button
                type="button"
                drag={prefersReduced || opened ? false : "y"}
                dragConstraints={{ top: 0, bottom: 80 }}
                dragSnapToOrigin
                dragTransition={SPRING_BOUNCE}
                dragElastic={0.18}
                style={{ y: cordY, touchAction: "none" }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 42) triggerOpen();
                }}
                onClick={triggerOpen}
                aria-label={ctaText}
                tabIndex={opened ? -1 : 0}
                className="mt-4 flex flex-col items-center outline-none"
              >
                <span className="block h-12 w-1 rounded-full" style={{ background: gold }} />
                <span
                  className="grid h-14 w-14 place-items-center rounded-full border-2 bg-black/60 font-display text-lg font-bold shadow-xl"
                  style={{ borderColor: gold, color: gold }}
                >
                  {displayMonogram}
                </span>
                <span className="mt-1 flex gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-4 w-1 rounded-full" style={{ background: gold }} />
                  ))}
                </span>
              </motion.button>
            </motion.div>
          </div>
          <p className="font-ui mt-4 rounded-full bg-[#161412] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg">
            {ctaText}
          </p>
        </motion.div>
      )}
    </div>
  );
}

const EnvelopeGate = memo(EnvelopeGateComponent);
export default EnvelopeGate;
