"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/templates", label: "Templates" },
    { href: "/studio", label: "Studio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6E1F2F] text-[#F6E27A]">
            <Heart size={16} fill="currentColor" />
          </span>
          <span className="leading-none">
            <span className="font-display text-xl font-bold tracking-tight">Wedslash</span>
            <span className="font-ui block text-[10px] uppercase tracking-[0.22em] text-[#6E655F]">Interactive Invites</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-ui text-[13px] font-medium uppercase tracking-[0.14em] text-[#161412]/70 hover:text-[#6E1F2F]">
              {l.label}
            </Link>
          ))}
          <Link href="/studio" className="font-ui inline-flex items-center gap-1.5 rounded-full bg-[#161412] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#6E1F2F]">
            <Sparkles size={14} /> Create Invite
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t hairline bg-[#FAF7F2] px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2.5 font-ui text-sm font-semibold uppercase tracking-widest">{l.label}</Link>
          ))}
          <Link href="/studio" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-[#161412] px-5 py-3 text-center font-ui text-sm font-semibold text-white">Create Invite</Link>
        </div>
      )}
    </header>
  );
}
