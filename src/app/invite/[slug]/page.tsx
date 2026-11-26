import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InviteClient from "./InviteClient";

export default function InvitePage() {
  return (
    <div className="min-h-dvh bg-[#FAF7F2]">
      <div className="border-b hairline bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link
            href="/templates"
            className="font-ui inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6E655F] transition-colors hover:text-[#6E1F2F]"
          >
            <ArrowLeft size={14} /> All templates
          </Link>
          <Link
            href="/studio"
            className="font-ui rounded-full bg-[#161412] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#6E1F2F]"
          >
            Customize this
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] lg:px-6 lg:py-6">
        <div className="overflow-hidden lg:rounded-[2.25rem] lg:border hairline lg:shadow-[0_32px_90px_-30px_rgba(22,20,18,0.28)]">
          <Suspense
            fallback={
              <div className="grid h-[80dvh] place-items-center font-ui text-sm text-[#6E655F]">
                Opening your invitation…
              </div>
            }
          >
            <InviteClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
