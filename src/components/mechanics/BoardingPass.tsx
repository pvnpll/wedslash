"use client";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { memo, useState } from "react";
import { Plane, RotateCw } from "lucide-react";
import Countdown from "../Countdown";

export interface BoardingPassProps {
  guestName: string;
  groom?: string;
  bride?: string;
  departureCode?: string;
  departureCity?: string;
  arrivalCode?: string;
  arrivalCity?: string;
  dateText?: string;
  targetDate?: string;
  primary?: string;
  gold?: string;
  compact?: boolean;
  onOpen?: () => void;
}

function formatDateBadge(targetDate?: string): string {
  if (!targetDate) return "Save the Date";
  const parsed = new Date(targetDate);
  if (Number.isNaN(parsed.getTime())) return "Save the Date";
  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yy = String(parsed.getFullYear()).slice(-2);
  return `${dd} · ${mm} · ${yy}`;
}

function BoardingPassComponent({
  guestName,
  groom,
  bride,
  departureCode = "DEP",
  departureCity = "Origin",
  arrivalCode = "DST",
  arrivalCity = "Destination",
  dateText,
  targetDate,
  primary = "#0F2440",
  gold = "#F6E27A",
  compact = false,
  onOpen,
}: BoardingPassProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [flipped, setFlipped] = useState(false);
  const runwayX = useMotionValue(0);

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    if (next) onOpen?.();
  };

  const triggerTakeoff = () => {
    if (!flipped) {
      setFlipped(true);
      onOpen?.();
    }
  };

  const resolvedDateText = dateText || formatDateBadge(targetDate);
  const flightTitle =
    groom && bride ? `${groom} & ${bride} Airlines` : "Wedslash Airways";
  const celebrationTitle =
    groom && bride ? `${groom} & ${bride} Celebration` : "Destination Celebration";
  const hasValidTarget = Boolean(targetDate && !Number.isNaN(Date.parse(targetDate)));

  return (
    <div className="mx-auto w-full max-w-md px-4" style={{ perspective: 1400 }}>
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, rotateY: prefersReduced ? 0 : flipped ? 180 : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative grid"
      >
        {/* FRONT: Boarding Pass */}
        <div
          aria-hidden={flipped}
          className={`col-start-1 row-start-1 overflow-hidden rounded-3xl text-white shadow-2xl ring-1 ring-white/15 ${
            flipped ? "pointer-events-none" : ""
          }`}
          style={{
            background: primary,
            backfaceVisibility: "hidden",
            opacity: prefersReduced && flipped ? 0 : 1,
          }}
        >
          <div className="flex items-center justify-between bg-white/5 px-5 py-3">
            <span className="font-ui flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: gold }}>
              <Plane size={15} /> {flightTitle}
            </span>
            <button
              type="button"
              onClick={toggleFlip}
              className="font-ui inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              <RotateCw size={11} /> Passport
            </button>
          </div>

          <div className={`grid grid-cols-3 gap-2 px-5 ${compact ? "py-4" : "py-5"} text-center`}>
            <div>
              <p className="font-display text-3xl font-bold uppercase">{departureCode}</p>
              <p className="font-ui mt-0.5 text-[10px] uppercase tracking-widest text-white/65">
                {departureCity}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div
                className="relative flex h-8 w-full items-center"
                title="Slide plane right for takeoff & passport"
              >
                <div
                  className="h-px w-full"
                  style={{
                    backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.45) 50%, transparent 50%)",
                    backgroundSize: "8px 1px",
                  }}
                />
                <motion.button
                  type="button"
                  drag={prefersReduced || flipped ? false : "x"}
                  dragConstraints={{ left: -24, right: 34 }}
                  dragSnapToOrigin
                  dragElastic={0.18}
                  style={{ x: runwayX, touchAction: "none" }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 18) triggerTakeoff();
                  }}
                  onClick={triggerTakeoff}
                  aria-label={`Slide jet from ${departureCode} to ${arrivalCode} to open passport`}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/10 p-1.5 transition hover:bg-white/20"
                >
                  <Plane size={15} className="rotate-90" style={{ color: gold }} />
                </motion.button>
              </div>
              <p className="font-ui text-[9px] uppercase tracking-widest text-white/75">Slide Jet →</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold uppercase">{arrivalCode}</p>
              <p className="font-ui mt-0.5 text-[10px] uppercase tracking-widest text-white/65">
                {arrivalCity}
              </p>
            </div>
          </div>

          {/* Perforated stub divider */}
          <div className="relative flex items-center">
            <span className="-ml-2.5 h-5 w-5 rounded-full bg-black/25" aria-hidden="true" />
            <div className="flex-1 border-t border-dashed border-white/25" />
            <span className="-mr-2.5 h-5 w-5 rounded-full bg-black/25" aria-hidden="true" />
          </div>

          <div className="px-5 py-4">
            <div className="grid grid-cols-3 gap-2 font-ui text-[11px]">
              <div>
                <p className="uppercase tracking-widest text-white/50">Passenger</p>
                <p className="mt-0.5 truncate font-semibold">{guestName}</p>
              </div>
              <div>
                <p className="uppercase tracking-widest text-white/50">Date</p>
                <p className="mt-0.5 font-semibold">{resolvedDateText}</p>
              </div>
              <div>
                <p className="uppercase tracking-widest text-white/50">Seat</p>
                <p className="mt-0.5 font-semibold">LOVE-01A</p>
              </div>
            </div>
            <p className="font-mono mt-3 text-[10px] tracking-[0.2em] text-white/55">
              {"<<<<CELEBRATE<<<<WITH<<<<YOU<<<<"}
            </p>
            <p className="font-ui mt-1 text-[10px] uppercase tracking-[0.22em]" style={{ color: gold }}>
              Boarding · {arrivalCode} · {arrivalCity}
            </p>
          </div>
        </div>

        {/* BACK: Passport Stamp Page + Takeoff Countdown */}
        <div
          aria-hidden={!flipped}
          className={`col-start-1 row-start-1 flex flex-col justify-between overflow-hidden rounded-3xl border p-5 text-white shadow-2xl ${
            !flipped ? "pointer-events-none" : ""
          }`}
          style={{
            background: `linear-gradient(155deg, ${primary} 0%, #091526 100%)`,
            borderColor: `${gold}55`,
            backfaceVisibility: "hidden",
            transform: prefersReduced ? undefined : "rotateY(180deg)",
            opacity: prefersReduced && !flipped ? 0 : 1,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Spinning Compass Rose SVG */}
              <motion.svg
                viewBox="0 0 48 48"
                className="h-9 w-9 shrink-0"
                animate={prefersReduced ? undefined : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                aria-hidden="true"
              >
                <circle cx="24" cy="24" r="20" stroke={gold} strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
                <path d="M24 5L27.5 20.5L43 24L27.5 27.5L24 43L20.5 27.5L5 24L20.5 20.5L24 5Z" fill={gold} fillOpacity="0.88" />
                <circle cx="24" cy="24" r="3" fill={primary} stroke={gold} strokeWidth="1.2" />
              </motion.svg>
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: gold }}>
                  Marriage Passport
                </p>
                <p className="font-display text-lg font-bold">{guestName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFlip}
              className="font-ui inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              <RotateCw size={11} /> Ticket
            </button>
          </div>

          {/* Inked Passport Stamp + Countdown */}
          <div className="my-3 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-4 py-2.5">
            <div>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: gold }}>
                Takeoff Countdown
              </p>
              <p className="font-editorial text-sm italic text-white/80">
                Cleared for {arrivalCity} · {resolvedDateText}
              </p>
            </div>
            <div
              className="grid h-14 w-14 shrink-0 -rotate-12 place-items-center rounded-full border-2 border-dashed text-center"
              style={{ borderColor: gold, color: gold }}
              aria-hidden="true"
            >
              <span className="font-ui text-[8px] font-bold uppercase leading-tight tracking-wider">
                STAMP
                <br />
                {arrivalCode}
              </span>
            </div>
          </div>

          {hasValidTarget && targetDate ? (
            <div className="scale-[0.92] origin-center">
              <Countdown
                target={targetDate}
                title={celebrationTitle}
                venue={arrivalCity}
                dark
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3 text-center">
              <p className="font-ui text-[10px] uppercase tracking-[0.24em]" style={{ color: gold }}>
                Gate Open · {resolvedDateText}
              </p>
              <p className="font-editorial mt-1 text-sm italic text-white/75">
                Passport stamped for {celebrationTitle}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const BoardingPass = memo(BoardingPassComponent);
export default BoardingPass;
