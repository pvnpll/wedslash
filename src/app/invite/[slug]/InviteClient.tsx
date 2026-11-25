"use client";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import { useInvite } from "@/store/useInvite";
import InviteRenderer from "@/components/InviteRenderer";

export default function InviteClient() {
  const params = useParams();
  const sp = useSearchParams();
  const slug =
    typeof params.slug === "string" ? params.slug : params.slug?.[0] ?? "";
  const { hydrateFromStorage, fetchPublishedFromCloud, getInviteBySlug } =
    useInvite();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!slug) return;
    void fetchPublishedFromCloud(slug);
  }, [slug, fetchPublishedFromCloud]);

  const customConfig = getInviteBySlug(slug);
  const template =
    TEMPLATES.find((t) => t.id === customConfig.templateId) ??
    TEMPLATES.find((t) => t.id === slug) ??
    TEMPLATES[0];

  return (
    <InviteRenderer
      template={template}
      customConfig={customConfig}
      guest={sp.get("guest") ?? ""}
    />
  );
}
