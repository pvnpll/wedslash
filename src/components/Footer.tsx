import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-[#161412] text-[#FAF7F2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6E1F2F] text-[#F6E27A]"><Heart size={16} fill="currentColor" /></span>
            <span className="font-display text-xl font-bold">Wedslash</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">Couture interactive invitations — open, tap, pull, scratch & swipe. One link, unlimited guests.</p>
          <p className="font-ui mt-4 text-[11px] uppercase tracking-[0.2em] text-white/40">English · Hindi · Arabic · French · Spanish</p>
        </div>
        <div>
          <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[#C59B27]">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/templates">Template Gallery</Link></li>
            <li><Link href="/studio">Live Studio</Link></li>
            <li><Link href="/pricing">Pricing & Concierge</Link></li>
            <li><Link href="/invite/demo">Live Demo Invite</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[#C59B27]">Collections</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/templates">Indian Multi-Event</Link></li>
            <li><Link href="/templates">Western & Destination</Link></li>
            <li><Link href="/templates">Save the Date</Link></li>
            <li><Link href="/templates">Baby Shower & Birthdays</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[#C59B27]">Studio</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/dashboard">Guest CRM & RSVP</Link></li>
            <li><Link href="/studio">ZIP Export for Netlify</Link></li>
            <li><Link href="/pricing">Designer Concierge 24h</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">© 2026 Wedslash · Crafted with love for unforgettable celebrations</div>
    </footer>
  );
}
