import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InviteClient from "./InviteClient";

export default function InvitePage() {
  return (
    <div>
      <div className="border-b hairline bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-2.5">
          <Link href="/templates" className="font-ui inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6E655F] hover:text-[#6E1F2F]">
            <ArrowLeft size={14} /> All templates
          </Link>
          <Link href="/studio" className="font-ui rounded-full bg-[#161412] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#6E1F2F]">
            Customize this
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-3xl overflow-hidden shadow-2xl">
        <Suspense fallback={<div className="grid h-[80dvh] place-items-center font-ui text-sm text-[#6E655F]">Opening your invitation…</div>}>
          <InviteClient />
        </Suspense>
      </div>
    </div>
  );
}
