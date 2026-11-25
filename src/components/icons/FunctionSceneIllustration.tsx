"use client";
import { useId } from "react";
import type { SceneIllustrationId } from "@/lib/types";

export interface FunctionSceneIllustrationProps {
  scene: SceneIllustrationId;
  primary?: string;
  gold?: string;
  className?: string;
}

export function FunctionSceneIllustration({
  scene,
  primary = "#6E1F2F",
  gold = "#D4AF37",
  className = "",
}: FunctionSceneIllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `ws-bg-${uid}`;
  const glowId = `ws-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 240 150"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="240" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primary} stopOpacity="0.92" />
          <stop offset="55%" stopColor={primary} stopOpacity="0.72" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.38" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={gold} stopOpacity="0.45" />
          <stop offset="100%" stopColor={gold} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="240" height="150" fill={`url(#${bgId})`} />
      <rect width="240" height="150" fill={`url(#${glowId})`} />

      {/* Subtle architectural arch frame */}
      <path
        d="M36 150V66C36 28 72 14 120 14C168 14 204 28 204 66V150"
        stroke={gold}
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />

      {scene === "pujan" && (
        <g>
          {/* Temple bells */}
          <path d="M62 14V34M178 14V34" stroke={gold} strokeWidth="1.5" />
          <path d="M55 44C55 37 69 37 69 44H55Z" fill={gold} opacity="0.9" />
          <path d="M171 44C171 37 185 37 185 44H171Z" fill={gold} opacity="0.9" />
          {/* Mango leaves & Coconut Kalash */}
          <path d="M105 64C98 52 103 44 111 54M135 64C142 52 137 44 129 54M120 56V42" stroke="#4F9D69" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="120" cy="60" r="11" fill="#8C5A3C" stroke={gold} strokeWidth="1.4" />
          <path d="M102 72H138C144 82 142 106 132 114H108C98 106 96 82 102 72Z" fill={gold} />
          <path d="M104 88H136" stroke={primary} strokeWidth="2" />
          {/* Flanking brass diyas */}
          <path d="M66 112C72 120 88 120 94 112H66Z" fill={gold} />
          <path d="M146 112C152 120 168 120 174 112H146Z" fill={gold} />
          <path d="M80 96C84 102 84 108 80 110C76 108 76 102 80 96Z" fill="#FFF3B0" />
          <path d="M160 96C164 102 164 108 160 110C156 108 156 102 160 96Z" fill="#FFF3B0" />
        </g>
      )}

      {scene === "haldi" && (
        <g>
          {/* Draped marigold garlands */}
          <path d="M24 14Q72 58 120 26Q168 58 216 14" stroke="#F59E0B" strokeWidth="4" strokeDasharray="1 10" strokeLinecap="round" />
          {[36, 56, 78, 102, 138, 162, 184, 204].map((x, idx) => (
            <circle key={x} cx={x} cy={idx % 2 === 0 ? 30 : 38} r="6.5" fill={idx % 2 === 0 ? "#FBBF24" : "#EA580C"} />
          ))}
          {/* Brass Urli bowl */}
          <ellipse cx="120" cy="84" rx="44" ry="12" fill="#FDE047" stroke={gold} strokeWidth="2" />
          <path d="M76 84C78 112 96 122 120 122C144 122 162 112 164 84" fill={gold} />
          <ellipse cx="120" cy="84" rx="35" ry="7" fill="#F59E0B" />
          {/* Marigold blooms & spoon */}
          <path d="M132 78L154 58" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="126" r="8" fill="#FBBF24" />
          <circle cx="154" cy="126" r="7" fill="#FB923C" />
        </g>
      )}

      {scene === "mehendi" && (
        <g>
          {/* Henna lotus mandala */}
          <circle cx="120" cy="78" r="34" stroke="#E7F6E7" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="120" cy="78" r="22" stroke={gold} strokeWidth="1.6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <path
              key={deg}
              d="M120 50C125 60 125 68 120 72C115 68 115 60 120 50Z"
              fill="#D1FAE5"
              fillOpacity="0.85"
              transform={`rotate(${deg} 120 78)`}
            />
          ))}
          <circle cx="120" cy="78" r="7" fill={gold} />
          {/* Paisley vines & henna cone */}
          <path d="M52 114C52 94 72 86 78 98C82 106 72 118 52 114Z" stroke="#A7F3D0" strokeWidth="2" />
          <path d="M170 112L192 64L199 68L174 115Z" fill={gold} />
          <circle cx="168" cy="119" r="2.2" fill="#ECFDF5" />
        </g>
      )}

      {scene === "sangeet" && (
        <g>
          {/* Spotlight beams */}
          <path d="M50 10L106 132H74L38 10Z" fill="#FDF4FF" fillOpacity="0.14" />
          <path d="M190 10L134 132H166L202 10Z" fill="#FDF4FF" fillOpacity="0.14" />
          {/* Festive string bulbs */}
          <path d="M24 22Q120 48 216 22" stroke={gold} strokeWidth="1.4" />
          {[48, 84, 120, 156, 192].map((x) => (
            <circle key={x} cx={x} cy={x === 120 ? 35 : 30} r="3.2" fill="#FEF08A" />
          ))}
          {/* Dancing couple silhouettes */}
          <circle cx="102" cy="56" r="7" fill="#FFF8E7" />
          <path d="M102 64L92 94L78 122M102 64L114 94L118 122M88 74L118 68" stroke="#FFF8E7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="140" cy="60" r="6.5" fill={gold} />
          <path d="M140 68L125 112H158L140 68Z" fill={gold} opacity="0.92" />
          <path d="M126 74L118 68M144 74L162 62" stroke={gold} strokeWidth="3" strokeLinecap="round" />
          {/* Musical notes */}
          <path d="M62 72V54L72 51V69" stroke="#FDE68A" strokeWidth="2" />
          <circle cx="59.5" cy="72" r="3" fill="#FDE68A" />
          <circle cx="69.5" cy="69" r="3" fill="#FDE68A" />
        </g>
      )}

      {scene === "pheras" && (
        <g>
          {/* Mandap canopy & pillars */}
          <path d="M52 38H188L174 26H66L52 38Z" fill={gold} opacity="0.9" />
          <rect x="58" y="38" width="7" height="90" fill={gold} opacity="0.82" />
          <rect x="175" y="38" width="7" height="90" fill={gold} opacity="0.82" />
          <path d="M65 40Q120 66 175 40" stroke="#FDE68A" strokeWidth="2.5" strokeDasharray="3 5" strokeLinecap="round" />
          {/* Sacred Havan Kund */}
          <path d="M92 108H148L140 124H100L92 108Z" fill="#92400E" stroke={gold} strokeWidth="1.5" />
          {/* Layered sacred flames */}
          <path d="M120 64C132 78 134 96 120 106C106 96 108 78 120 64Z" fill="#F97316" />
          <path d="M120 76C127 86 127 98 120 105C113 98 113 86 120 76Z" fill="#FDE047" />
        </g>
      )}

      {scene === "reception" && (
        <g>
          {/* Chandelier */}
          <path d="M120 10V26M96 34C108 26 132 26 144 34" stroke={gold} strokeWidth="1.8" />
          <circle cx="102" cy="37" r="2" fill="#FFFBEB" />
          <circle cx="120" cy="39" r="2.5" fill="#FFFBEB" />
          <circle cx="138" cy="37" r="2" fill="#FFFBEB" />
          {/* Clinking champagne flutes */}
          <g transform="rotate(-12 102 88)">
            <path d="M94 56H110L106 82C105 87 99 87 98 82L94 56Z" fill="#FEF3C7" fillOpacity="0.85" stroke={gold} strokeWidth="1.5" />
            <path d="M102 86V116M94 116H110" stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g transform="rotate(12 138 88)">
            <path d="M130 56H146L142 82C141 87 135 87 134 82L130 56Z" fill="#FEF3C7" fillOpacity="0.85" stroke={gold} strokeWidth="1.5" />
            <path d="M138 86V116M130 116H146" stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Sparkle stars */}
          <path d="M120 44L122 50L128 52L122 54L120 60L118 54L112 52L118 50L120 44Z" fill="#FFFBEB" />
          <circle cx="80" cy="64" r="1.8" fill="#FEF08A" />
          <circle cx="160" cy="64" r="1.8" fill="#FEF08A" />
        </g>
      )}

      {scene === "nikah" && (
        <g>
          {/* Mughal scalloped Jharokha arch */}
          <path
            d="M66 130V78C66 58 84 44 102 42C108 32 114 26 120 22C126 26 132 32 138 42C156 44 174 58 174 78V130"
            stroke={gold}
            strokeWidth="2.2"
          />
          {/* Hanging Moroccan lanterns */}
          <path d="M88 45V66M152 45V66" stroke={gold} strokeWidth="1.3" />
          <path d="M82 68L88 62L94 68L92 80H84L82 68Z" fill="#FEF08A" stroke={gold} strokeWidth="1.2" />
          <path d="M146 68L152 62L158 68L156 80H148L146 68Z" fill="#FEF08A" stroke={gold} strokeWidth="1.2" />
          {/* Crescent moon & star */}
          <path
            d="M127 56C119 57 113 64 114 72C115 80 122 86 130 85C124 83 120 77 120 71C120 64 123 59 127 56Z"
            fill={gold}
          />
          <circle cx="132" cy="68" r="2.3" fill="#FFFBEB" />
          {/* Botanical jali flourish */}
          <path d="M84 116C102 104 138 104 156 116" stroke={gold} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {scene === "cocktail" && (
        <g>
          {/* Sunset horizon & palm/botanical silhouettes */}
          <circle cx="120" cy="76" r="28" fill="#FDE68A" fillOpacity="0.32" />
          <path d="M40 122C80 112 160 112 200 122" stroke={gold} strokeWidth="1.4" strokeOpacity="0.65" />
          {/* Coupe & Martini glasses */}
          <path d="M84 62H118L101 86L84 62Z" fill="#FEF3C7" fillOpacity="0.82" stroke={gold} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M101 86V114M91 114H111" stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="115" cy="61" r="4.5" fill="#F59E0B" />
          <path d="M126 70C126 83 158 83 158 70H126Z" fill="#FDE68A" fillOpacity="0.85" stroke={gold} strokeWidth="1.6" />
          <path d="M142 80V114M133 114H151" stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M144 69L154 55" stroke="#FFFBEB" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default FunctionSceneIllustration;
