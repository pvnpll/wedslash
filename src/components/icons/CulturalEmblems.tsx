"use client";
import type { SacredSymbol } from "@/lib/types";

export interface CulturalEmblemProps {
  symbol?: SacredSymbol;
  color?: string;
  size?: number;
  className?: string;
}

export function CulturalEmblem({
  symbol = "ganesh",
  color = "#D4AF37",
  size = 40,
  className = "",
}: CulturalEmblemProps) {
  if (!symbol || symbol === "none") return null;

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (symbol) {
    case "ganesh":
      return (
        <svg {...common}>
          {/* Crown / Mukut */}
          <path
            d="M24 19L27.5 11L32 8L36.5 11L40 19H24Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="14" r="1.4" fill={color} />
          {/* Tilak */}
          <path d="M32 21V25" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="27" r="1.2" fill={color} />
          {/* Ears */}
          <path
            d="M23 23C15.5 22 12 27.5 14 34C15.5 38.8 20.5 39 23 36"
            stroke={color}
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M41 23C48.5 22 52 27.5 50 34C48.5 38.8 43.5 39 41 36"
            stroke={color}
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          {/* Forehead & Trunk */}
          <path
            d="M23 23C24 19.8 27.5 19 32 19C36.5 19 40 19.8 41 23"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M29 30C29 34 29.5 38.5 31.5 42C33.5 45.5 39 46.5 41.5 43.5C43 41.8 42.2 39 39.8 39"
            stroke={color}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* Eyes */}
          <circle cx="27.5" cy="26.5" r="1.2" fill={color} />
          <circle cx="36.5" cy="26.5" r="1.2" fill={color} />
          {/* Lotus base */}
          <path
            d="M20 50C24 47 28 47 32 51C36 47 40 47 44 50C40 53.5 24 53.5 20 50Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M16 54.5H48" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case "om":
      return (
        <svg {...common}>
          {/* Main Devanagari Om stroke */}
          <path
            d="M17 25C19 20.5 24.5 19 28.5 21.5C32 23.8 31 28.5 26 30.2C31.5 31.2 34 36.5 31 41.5C28 46.5 20 47.5 15.5 43.5C13.5 41.6 13.2 39 14.2 37.5"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right loop */}
          <path
            d="M28 31.5C33.5 29.5 38 30.5 40.5 33C42.5 28 47.5 27.5 50 31.5C52.5 35.8 49.5 43.5 42.5 45C38.5 45.8 35.5 44 35 41.5"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chandrabindu crescent + bindu */}
          <path
            d="M24 15.5C27.5 18.8 34.5 18.8 38 15.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="31" cy="11.5" r="2.1" fill={color} />
        </svg>
      );

    case "ik-onkar":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="25" stroke={color} strokeWidth="1.2" strokeDasharray="2 3" opacity="0.7" />
          {/* Ek (1) */}
          <path
            d="M22.5 23C19.5 23 17.5 25.2 17.5 28C17.5 30.8 19.5 32.8 22.2 32.8C24.5 32.8 25.8 31.5 25.8 29.5V46"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Oankar */}
          <path
            d="M26 27.5C29.5 22.5 36.5 22.5 39.5 27.5C41.8 31.5 38 35.5 33.5 36C39 36.5 42 40.8 39.2 44.5C36.8 47.5 31.5 47 29.5 43.8"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sweeping Kar arc */}
          <path
            d="M36 23.5C41 18.5 49 20.5 49 28.5C49 34 45.5 39 43 43.5"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case "bismillah":
      return (
        <svg {...common}>
          {/* Eight-point Rub el Hizb octagram */}
          <rect
            x="17"
            y="17"
            width="30"
            height="30"
            rx="1.5"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />
          <rect
            x="17"
            y="17"
            width="30"
            height="30"
            rx="1.5"
            transform="rotate(45 32 32)"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />
          {/* Crescent & calligraphic center */}
          <path
            d="M35.5 23.5C30.5 23.8 26.5 27.8 26.5 32.5C26.5 37.5 30.8 41.2 36 41C32.2 39.8 30.2 36.4 30.2 32.5C30.2 28.4 32.2 25 35.5 23.5Z"
            fill={color}
          />
          <circle cx="38.5" cy="31.5" r="2" fill={color} />
          <path
            d="M23 47.5C27.5 44.5 36.5 44.5 41 47.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "cross":
      return (
        <svg {...common}>
          <circle cx="32" cy="27" r="14" stroke={color} strokeWidth="1.1" strokeDasharray="2 3" opacity="0.65" />
          <path
            d="M32 10V54M18 26H46"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Botonnee flared tips */}
          <circle cx="32" cy="10" r="2.2" fill={color} />
          <circle cx="32" cy="54" r="2.2" fill={color} />
          <circle cx="18" cy="26" r="2.2" fill={color} />
          <circle cx="46" cy="26" r="2.2" fill={color} />
          {/* Center diamond */}
          <path d="M32 22L36 26L32 30L28 26L32 22Z" fill={color} />
        </svg>
      );

    case "floral-crest":
      return (
        <svg {...common}>
          {/* Left & right laurel arcs */}
          <path
            d="M26 48C17 44 13 33 17 22C19 16 24 12 28 11"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M38 48C47 44 51 33 47 22C45 16 40 12 36 11"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path d="M16 32C12 30 11 26 14 24C16 26 17 29 16 32Z" fill={color} opacity="0.8" />
          <path d="M18 22C14 19 15 15 18 14C20 16 20 19 18 22Z" fill={color} opacity="0.8" />
          <path d="M48 32C52 30 53 26 50 24C48 26 47 29 48 32Z" fill={color} opacity="0.8" />
          <path d="M46 22C50 19 49 15 46 14C44 16 44 19 46 22Z" fill={color} opacity="0.8" />
          {/* Crown blossom & center star */}
          <path d="M32 22L34.5 29.5L42 32L34.5 34.5L32 42L29.5 34.5L22 32L29.5 29.5L32 22Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="32" cy="50" r="3" stroke={color} strokeWidth="1.6" />
          <circle cx="32" cy="11" r="1.8" fill={color} />
        </svg>
      );

    case "passport":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="1.8" />
          <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="1.2" strokeDasharray="3 2.5" />
          <ellipse cx="32" cy="32" rx="8" ry="16" stroke={color} strokeWidth="1.3" />
          <path d="M16 32H48M19 24H45M19 40H45" stroke={color} strokeWidth="1.2" />
          {/* Airplane motif */}
          <path
            d="M32 20L35 28L42 31L35 33L34 39L32 37L30 39L29 33L22 31L29 28L32 20Z"
            fill={color}
          />
        </svg>
      );

    case "crown":
      return (
        <svg {...common}>
          <path
            d="M12 44L16 22L25 32L32 16L39 32L48 22L52 44H12Z"
            stroke={color}
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path d="M14 49H50" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="20" r="2.1" fill={color} />
          <circle cx="32" cy="14" r="2.5" fill={color} />
          <circle cx="48" cy="20" r="2.1" fill={color} />
          <path d="M32 31L35 36L32 41L29 36L32 31Z" fill={color} />
        </svg>
      );

    default:
      return null;
  }
}

export default CulturalEmblem;
