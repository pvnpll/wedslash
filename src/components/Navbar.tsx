"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const prefersReduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/templates", label: "Templates" },
    { href: "/studio", label: "Studio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 transition-colors hover:text-[#6E1F2F]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6E1F2F] text-[#F6E27A]">
            <Heart size={16} fill="currentColor" />
          </span>
          <span className="leading-none">
            <span className="font-display text-xl font-bold tracking-tight">Wedslash</span>
            <span className="font-ui block text-[10px] uppercase tracking-[0.22em] text-[#6E655F]">
              Interactive Invites
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 lg:gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-ui text-[12px] lg:text-[13px] font-medium uppercase tracking-[0.12em] text-[#161412]/70 transition-colors hover:text-[#6E1F2F]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/studio"
            className="font-ui inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#161412] px-4 py-2.5 text-[12px] lg:px-5 lg:text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#6E1F2F]"
          >
            <Sparkles size={14} /> Create Invite
          </Link>
        </nav>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-[#161412] transition-colors hover:bg-[#161412]/5 hover:text-[#6E1F2F] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-drawer"
            initial={prefersReduced ? { opacity: 1, height: "auto" } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? { opacity: 0, height: "auto" } : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0.05 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t hairline bg-[#FAF7F2] md:hidden"
          >
            <div className="px-5 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-ui text-sm font-semibold uppercase tracking-widest text-[#161412] transition-colors hover:text-[#6E1F2F]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-full bg-[#161412] px-5 py-3 text-center font-ui text-sm font-semibold text-white transition-colors hover:bg-[#6E1F2F]"
              >
                Create Invite
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
