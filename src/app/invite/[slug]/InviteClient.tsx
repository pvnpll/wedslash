"use client";
import { useParams, useSearchParams } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import InviteRenderer from "@/components/InviteRenderer";

export default function InviteClient() {
  const params = useParams();
  const sp = useSearchParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0] ?? "";
  const template = TEMPLATES.find((t) => t.id === slug) ?? TEMPLATES[0];
  return <InviteRenderer template={template} guest={sp.get("guest") ?? ""} />;
}
