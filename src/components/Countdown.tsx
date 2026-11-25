"use client";
import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";

export function useCountdown(target: string) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const update = () => {
      const diff = Math.max(0, t - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export function downloadICS(opts: { title: string; date: string; venue: string }) {
  const dt = new Date(opts.date);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(dt.getTime() + 4 * 3600000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${stamp(dt)}`, `DTEND:${stamp(end)}`, `SUMMARY:${opts.title}`, `LOCATION:${opts.venue}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url; a.download = "wedslash-wedding.ics"; a.click();
  URL.revokeObjectURL(url);
}

export default function Countdown({ target, title, venue, dark = false }: { target: string; title: string; venue: string; dark?: boolean }) {
  const { d, h, m, s } = useCountdown(target);
  const cells = [
    { v: d, l: "Days" }, { v: h, l: "Hours" }, { v: m, l: "Minutes" }, { v: s, l: "Seconds" },
  ];
  return (
    <div className="text-center">
      <p className={`font-ui text-[11px] font-semibold uppercase tracking-[0.28em] ${dark ? "text-white/60" : "text-[#6E655F]"}`}>The celebration begins in</p>
      <div className="mt-3 flex items-stretch justify-center gap-2.5">
        {cells.map((c, i) => (
          <div key={c.l} className="flex items-center gap-2.5">
            <div className={`min-w-[68px] rounded-2xl border px-3 py-3 ${dark ? "border-white/15 bg-white/5" : "hairline bg-white/70 shadow-sm"}`}>
              <p className={`font-display text-3xl font-bold tabular-nums ${dark ? "text-[#F6E27A]" : ""}`}>{String(c.v).padStart(2, "0")}</p>
              <p className={`font-ui mt-0.5 text-[10px] uppercase tracking-[0.2em] ${dark ? "text-white/50" : "text-[#6E655F]"}`}>{c.l}</p>
            </div>
            {i < cells.length - 1 && <span className={`font-display text-2xl ${dark ? "text-white/30" : "text-[#161412]/30"}`}>:</span>}
          </div>
        ))}
      </div>
      <button onClick={() => downloadICS({ title, date: target, venue })} className="font-ui mt-4 inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#6E1F2F]">
        <CalendarPlus size={15} /> Add to Calendar
      </button>
    </div>
  );
}
