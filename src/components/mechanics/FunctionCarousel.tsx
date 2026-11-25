"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, ExternalLink } from "lucide-react";
import { FunctionSceneIllustration } from "../icons/FunctionSceneIllustration";
import type { FunctionEvent } from "@/lib/types";

export interface FunctionCarouselProps {
  functions: FunctionEvent[];
  heading?: string;
}

export default function FunctionCarousel({
  functions,
  heading = "Wedding Festivities",
}: FunctionCarouselProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  if (!functions.length) return null;

  const total = functions.length;
  const safeIndex = ((index % total) + total) % total;
  const go = (delta: number) => setIndex((prev) => (prev + delta + total) % total);

  // Build visible coverflow slots without duplicate item keys
  const visibleSlots: Array<{ item: FunctionEvent; offset: -1 | 0 | 1 }> =
    total === 1
      ? [{ item: functions[0], offset: 0 }]
      : total === 2
      ? [
          { item: functions[safeIndex], offset: 0 },
          { item: functions[(safeIndex + 1) % 2], offset: 1 },
        ]
      : [
          { item: functions[(safeIndex - 1 + total) % total], offset: -1 },
          { item: functions[safeIndex], offset: 0 },
          { item: functions[(safeIndex + 1) % total], offset: 1 },
        ];

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        {heading}
      </p>
      <p className="font-ui mt-1 text-center text-[11px] uppercase tracking-[0.2em] text-[#6E655F]/75">
        Swipe · {safeIndex + 1} of {total}
      </p>

      {/* 3D Coverflow Stage */}
      <div
        className="relative mt-4 flex h-[410px] items-center justify-center overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {visibleSlots.map(({ item: f, offset }) => {
          const isCenter = offset === 0;
          const targetX = offset === 0 ? "0%" : offset < 0 ? "-54%" : "54%";
          const targetRotateY = prefersReduced ? 0 : offset * -20;
          const targetScale = isCenter ? 1 : 0.84;
          const targetBlur = isCenter ? "blur(0px)" : "blur(2.5px)";

          return (
            <motion.article
              key={f.id}
              initial={false}
              animate={{
                x: targetX,
                scale: targetScale,
                rotateY: targetRotateY,
                opacity: isCenter ? 1 : 0.65,
                filter: targetBlur,
                zIndex: isCenter ? 20 : 10,
              }}
              transition={
                prefersReduced
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 230, damping: 26 }
              }
              drag={isCenter && total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.45}
              onDragEnd={(_, info) => {
                if (!isCenter || total <= 1) return;
                if (info.offset.x < -50) go(1);
                else if (info.offset.x > 50) go(-1);
              }}
              onClick={!isCenter ? () => go(offset) : undefined}
              style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
              className={`absolute w-[82%] max-w-[330px] overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-20px_rgba(22,20,18,0.38)] ring-1 ring-black/8 ${
                isCenter
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-pointer select-none"
              }`}
            >
              {/* Custom Illustrated SVG Scene */}
              <div className="relative h-44 w-full overflow-hidden">
                <FunctionSceneIllustration
                  scene={f.scene}
                  primary={f.cardThemeColor || "#6E1F2F"}
                  gold="#D4AF37"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3.5 top-3.5 rounded-full bg-black/45 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {f.name}
                </span>
                <span
                  className="absolute bottom-3 right-3.5 h-3 w-3 rounded-full ring-2 ring-white/80"
                  style={{ background: f.cardThemeColor }}
                  aria-hidden="true"
                />
              </div>

              {/* Event Metadata */}
              <div className="p-5 text-left">
                <h3 className="font-display truncate text-2xl font-bold text-[#161412]">
                  {f.name}
                </h3>
                <p className="font-ui mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#161412]/75">
                  <Clock size={14} className="shrink-0" />
                  <span className="truncate">
                    {f.dayAndDate} · {f.time}
                  </span>
                </p>
                <p className="font-ui mt-1 flex items-center gap-1.5 text-[13px] text-[#161412]/75">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{f.venueName}</span>
                </p>
                {f.venueAddress && (
                  <p className="font-ui mt-0.5 truncate pl-5 text-[11px] text-[#6E655F]">
                    {f.venueAddress}
                  </p>
                )}

                <div className="mt-3.5 flex items-center gap-2 rounded-2xl bg-[#FAF7F2] p-3">
                  <div className="flex shrink-0 -space-x-1.5">
                    {f.dressCodeColors.map((c) => (
                      <span
                        key={c}
                        className="h-6 w-6 rounded-full ring-2 ring-white"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <p className="font-ui line-clamp-1 flex-1 text-xs font-medium text-[#161412]/80">
                    {f.dressCodeLabel}
                  </p>
                  {f.mapUrl && /^https?:\/\//i.test(f.mapUrl) && (
                    <a
                      href={f.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#6E1F2F] hover:opacity-75"
                      aria-label={`Map for ${f.name}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Controls & Dots */}
      {total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white"
            aria-label="Previous function"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {functions.map((fn, i) => (
              <button
                type="button"
                key={fn.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${fn.name}`}
                className={`h-2 rounded-full transition-all ${
                  i === safeIndex ? "w-7 bg-[#6E1F2F]" : "w-2 bg-[#161412]/20"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white"
            aria-label="Next function"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
