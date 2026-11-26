"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";
import { useInvite } from "@/store/useInvite";
import InviteRenderer from "@/components/InviteRenderer";
import { ThemeSelector, THEME_PRESETS } from "@/components/ThemeSelector";
import type { ThemePreset } from "@/components/ThemeSelector";

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

  // Theme preset state — default = "classic-gold" (preserves template's own colors)
  const [activeTheme, setActiveTheme] = useState<ThemePreset | null>(null);

  return (
    <>
      <ThemeSelector
        activeId={activeTheme?.id ?? "classic-gold"}
        onSelect={(preset) => {
          // Toggle off if already active
          setActiveTheme((prev) => (prev?.id === preset.id ? null : preset));
        }}
      />
      <InviteRenderer
        template={template}
        customConfig={customConfig}
        guest={sp.get("guest") ?? ""}
        themePreset={activeTheme}
      />
    </>
  );
}
