"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Copy, CheckCheck } from "lucide-react";

export interface IllustratedMapCardProps {
  venueTitle: string;
  fullAddress: string;
  city: string;
  googleMapsUrl: string;
  primary?: string;
  gold?: string;
  heading?: string;
}

export default function IllustratedMapCard({
  venueTitle,
  fullAddress,
  city,
  googleMapsUrl,
  primary = "#6E1F2F",
  gold = "#D4AF37",
  heading = "Venue & Route",
}: IllustratedMapCardProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const safeMapHref = /^https?:\/\//i.test(googleMapsUrl) ? googleMapsUrl : "#";

  const copyAddress = async () => {
    const textToCopy = [venueTitle, fullAddress, city].filter(Boolean).join(", ");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const el = document.createElement("textarea");
        el.value = textToCopy;
        el.setAttribute("readonly", "true");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore clipboard denial */
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-5">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/8">
        {/* Illustrated Route Map Stage */}
        <div
          className="relative flex h-48 w-full items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(150deg, ${primary} 0%, #1C1417 100%)`,
          }}
        >
          <svg
            viewBox="0 0 340 160"
            className="absolute inset-0 h-full w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Subtle cartographic street grid & river curve */}
            <path d="M0 36H340M0 92H340M0 132H340" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
            <path d="M68 0V160M170 0V160M268 0V160" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
            <path
              d="M-10 144C75 110 120 135 190 95C255 58 295 82 350 45"
              stroke="#FFFFFF"
              strokeOpacity="0.12"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Origin & Destination landmarks */}
            <circle cx="44" cy="122" r="5" fill={gold} fillOpacity="0.85" />
            <circle cx="44" cy="122" r="10" stroke={gold} strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="272" cy="54" r="14" stroke={gold} strokeOpacity="0.4" strokeWidth="1.5" />

            {/* Animated dashed route path */}
            <path
              d="M44 122 C96 42 152 132 204 74 C228 48 250 62 272 54"
              stroke={gold}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 8"
              className="animate-dash-flow"
            />
          </svg>

          {/* Bouncing Location Pin */}
          <motion.div
            animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-full border-2 bg-white shadow-2xl"
              style={{ borderColor: gold, color: primary }}
            >
              <MapPin size={22} />
            </div>
            <span className="mt-1.5 h-1.5 w-6 rounded-full bg-black/35 blur-[1px]" aria-hidden="true" />
          </motion.div>

          <span
            className="absolute left-4 top-3.5 rounded-full bg-black/40 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm"
          >
            {heading}
          </span>
        </div>

        {/* Venue Details & Actions */}
        <div className="p-5 text-center">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-[#6E655F]">
            {city}
          </p>
          <h3 className="font-display mt-1 text-2xl font-bold text-[#161412]">{venueTitle}</h3>
          <p className="font-editorial mt-1.5 text-base italic leading-snug text-[#161412]/75">
            {fullAddress}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <a
              href={safeMapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
              style={{ background: primary }}
            >
              <Navigation size={13} /> Get Directions
            </a>
            <button
              type="button"
              onClick={copyAddress}
              className="font-ui inline-flex items-center justify-center gap-1.5 rounded-full border hairline bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-[#161412] transition hover:bg-[#FAF7F2]"
              aria-live="polite"
            >
              {copied ? (
                <>
                  <CheckCheck size={14} className="text-[#2E7D32]" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy Address
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
