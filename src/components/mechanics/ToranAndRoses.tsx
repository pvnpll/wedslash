"use client";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useId } from "react";

export interface ToranAndRosesProps {
  toranEnabled?: boolean;
  rosesEnabled?: boolean;
  primary?: string;
  gold?: string;
}

function CornerRoseSvg({ primary, gold }: { primary: string; gold: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `ws-rose-${uid}`;

  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20 sm:h-24 sm:w-24" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FDF3EC" stopOpacity="0.95" />
          <stop offset="45%" stopColor={primary} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#2A0D14" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      {/* Leaves */}
      <path d="M18 54C8 44 10 30 22 26C28 36 28 46 18 54Z" fill="#2E6F40" opacity="0.82" />
      <path d="M48 80C38 88 24 84 22 72C32 68 42 70 48 80Z" fill="#3B824E" opacity="0.82" />
      <path d="M74 28C82 36 82 48 70 54C64 44 66 34 74 28Z" fill="#2E6F40" opacity="0.78" />
      {/* Layered Rose Petals */}
      <circle cx="48" cy="48" r="24" fill={`url(#${gradId})`} />
      <path
        d="M30 44C30 31 44 24 56 30C66 35 68 50 58 60C48 68 33 63 30 44Z"
        fill={primary}
        fillOpacity="0.85"
        stroke={gold}
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      <path
        d="M39 43C41 34 53 33 57 42C61 50 53 58 44 55C38 53 37 47 39 43Z"
        fill="#E56399"
        fillOpacity="0.45"
        stroke="#FFFDF6"
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <circle cx="48" cy="46" r="4.5" fill={gold} opacity="0.85" />
    </svg>
  );
}

export default function ToranAndRoses({
  toranEnabled = true,
  rosesEnabled = true,
  primary = "#6E1F2F",
  gold = "#D4AF37",
}: ToranAndRosesProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 110, damping: 20 });
  const swingAngle = useTransform(smoothVelocity, [-1400, 0, 1400], [-6, 0, 6]);
  const roseShiftY = useTransform(scrollY, [0, 800], [0, 26]);
  const roseRotate = useTransform(scrollY, [0, 800], [0, 12]);

  if (!toranEnabled && !rosesEnabled) return null;

  const garlandLoops = [0, 1, 2, 3, 4];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Swinging Marigold Toran Garland Header */}
      {toranEnabled && (
        <motion.div
          style={prefersReduced ? undefined : { rotate: swingAngle, transformOrigin: "top center" }}
          className="relative z-20 flex w-full justify-center"
        >
          <svg viewBox="0 0 600 68" className="h-14 w-full max-w-3xl sm:h-16" fill="none">
            {/* Top golden rope */}
            <path d="M0 4H600" stroke={gold} strokeWidth="2.5" />
            {garlandLoops.map((loop) => {
              const x0 = loop * 120;
              const xm = x0 + 60;
              const x1 = x0 + 120;
              return (
                <g key={loop}>
                  {/* Scalloped marigold swag */}
                  <path
                    d={`M${x0} 5 Q${xm} 42 ${x1} 5`}
                    stroke="#2E7D32"
                    strokeWidth="2.2"
                  />
                  {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, idx) => {
                    const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * xm + t * t * x1;
                    const by = (1 - t) * (1 - t) * 5 + 2 * (1 - t) * t * 42 + t * t * 5;
                    return (
                      <circle
                        key={idx}
                        cx={bx}
                        cy={by}
                        r={idx === 2 ? 6.5 : 5}
                        fill={idx % 2 === 0 ? "#F5B301" : "#E4572E"}
                        stroke="#FFF8E7"
                        strokeOpacity="0.4"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                  {/* Swaying hanging jasmine + marigold tassel */}
                  <g className={prefersReduced ? "" : "animate-sway"} style={{ transformOrigin: `${xm}px 23px` }}>
                    <line x1={xm} y1="24" x2={xm} y2="48" stroke="#2E7D32" strokeWidth="1.6" />
                    <circle cx={xm} cy="40" r="3" fill="#FFFDF6" />
                    <circle cx={xm} cy="50" r="5" fill={loop % 2 === 0 ? "#E4572E" : "#F5B301"} />
                    <polygon points={`${xm - 3},55 ${xm + 3},55 ${xm},63`} fill={gold} />
                  </g>
                </g>
              );
            })}
          </svg>
        </motion.div>
      )}

      {/* Subtle Corner Parallax Roses */}
      {rosesEnabled && (
        <>
          <motion.div
            style={prefersReduced ? undefined : { y: roseShiftY, rotate: roseRotate }}
            className="absolute -left-4 top-8 opacity-80"
          >
            <CornerRoseSvg primary={primary} gold={gold} />
          </motion.div>
          <motion.div
            style={prefersReduced ? undefined : { y: roseShiftY, rotate: roseRotate }}
            className="absolute -right-4 top-8 -scale-x-100 opacity-80"
          >
            <CornerRoseSvg primary={primary} gold={gold} />
          </motion.div>
          <motion.div
            style={prefersReduced ? undefined : { rotate: roseRotate }}
            className="absolute -bottom-4 -left-4 -scale-y-100 opacity-65"
          >
            <CornerRoseSvg primary={primary} gold={gold} />
          </motion.div>
          <motion.div
            style={prefersReduced ? undefined : { rotate: roseRotate }}
            className="absolute -bottom-4 -right-4 scale-x-[-1] scale-y-[-1] opacity-65"
          >
            <CornerRoseSvg primary={primary} gold={gold} />
          </motion.div>
        </>
      )}
    </div>
  );
}
