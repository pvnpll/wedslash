"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { StorySlide } from "@/lib/types";

export interface StoryCarouselProps {
  slides: StorySlide[];
  heading?: string;
  primary?: string;
  gold?: string;
}

export default function StoryCarousel({
  slides,
  heading = "Our Story",
  primary = "#6E1F2F",
  gold = "#D4AF37",
}: StoryCarouselProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  if (!slides.length) return null;

  const total = slides.length;
  const safeIndex = ((index % total) + total) % total;
  const go = (delta: number) => setIndex((prev) => (prev + delta + total) % total);

  // Order slides back-to-front so active slide sits on top of the 3D stack
  const stackCount = Math.min(3, total);
  const stackItems = Array.from({ length: stackCount }, (_, i) => {
    const depth = stackCount - 1 - i; // 2, 1, 0
    const slide = slides[(safeIndex + depth) % total];
    return { slide, depth };
  });

  return (
    <div className="mx-auto w-full max-w-md @2xl:max-w-xl px-4 sm:px-5">
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        {heading}
      </p>
      <p className="font-ui mt-1 text-center text-[11px] uppercase tracking-[0.2em] text-[#6E655F]/70">
        Swipe · {safeIndex + 1} of {total}
      </p>

      {/* 3D Photo Story Stack */}
      <div
        className="relative mt-4 flex h-[390px] @2xl:h-[430px] items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {stackItems.map(({ slide, depth }) => {
          const isFront = depth === 0;
          const rotateZ = prefersReduced ? 0 : depth === 0 ? 0 : depth === 1 ? 3.5 : -3.5;
          const offsetX = depth === 0 ? 0 : depth === 1 ? 10 : -10;
          const offsetY = depth * 10;
          const scale = 1 - depth * 0.05;

          return (
            <motion.article
              key={slide.id}
              initial={false}
              animate={{
                x: offsetX,
                y: offsetY,
                scale,
                rotate: rotateZ,
                opacity: isFront ? 1 : 0.85 - depth * 0.18,
                zIndex: 30 - depth * 10,
              }}
              transition={
                prefersReduced
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 250, damping: 26 }
              }
              drag={isFront && total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.42}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (!isFront || total <= 1) return;
                if (info.offset.x < -50 || info.velocity.x < -300) go(1);
                else if (info.offset.x > 50 || info.velocity.x > 300) go(-1);
              }}
              style={{ touchAction: "pan-y", willChange: "transform, opacity" }}
              className={`absolute inset-x-1 sm:inset-x-2 @2xl:inset-x-4 top-0 flex h-[360px] @2xl:h-[396px] flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_24px_50px_-20px_rgba(22,20,18,0.36)] ${
                isFront
                  ? "cursor-grab active:cursor-grabbing"
                  : "pointer-events-none select-none"
              }`}
            >
              {/* Photo or rich editorial gradient artwork */}
              <div className="relative h-52 w-full overflow-hidden">
                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="relative flex h-full w-full items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 25% 25%, ${slide.palette[1]}55, transparent 58%), linear-gradient(145deg, ${slide.palette[0]}, ${slide.palette[1]})`,
                    }}
                  >
                    <svg viewBox="0 0 120 120" className="h-24 w-24 opacity-30" fill="none" aria-hidden="true">
                      <circle cx="48" cy="60" r="24" stroke="#FFFDF6" strokeWidth="2.5" />
                      <circle cx="72" cy="60" r="24" stroke="#FFFDF6" strokeWidth="2.5" />
                    </svg>
                    <Heart
                      size={28}
                      className="absolute text-white/85"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <span
                  className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
                >
                  {slide.dateLabel}
                </span>
              </div>

              {/* Caption & Title */}
              <div className="flex flex-1 flex-col justify-center px-6 py-4 text-center">
                <div
                  className="mx-auto mb-2 h-0.5 w-10 rounded-full"
                  style={{ background: gold }}
                />
                <h3
                  className="font-display text-2xl font-bold leading-snug"
                  style={{ color: primary }}
                >
                  {slide.title}
                </h3>
                <p className="font-editorial mt-1.5 line-clamp-3 text-base italic leading-relaxed text-[#161412]/80">
                  {slide.caption}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Pagination Dots & Buttons */}
      {total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white"
            aria-label="Previous story"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${slide.title}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === safeIndex ? 28 : 8,
                  background: i === safeIndex ? primary : "rgba(22, 20, 18, 0.2)",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid h-10 w-10 place-items-center rounded-full border hairline bg-white shadow-sm transition hover:bg-[#161412] hover:text-white"
            aria-label="Next story"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
