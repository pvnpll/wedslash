import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { InvitationConfig } from "@/lib/types";

const SLUG_RE = /^[a-z0-9-]{2,80}$/;

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  let body: { slug?: string; config?: InvitationConfig };
  try {
    body = (await request.json()) as { slug?: string; config?: InvitationConfig };
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const rawSlug = (body.slug || body.config?.slug || body.config?.templateId || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!SLUG_RE.test(rawSlug) || !body.config || typeof body.config !== "object") {
    return Response.json(
      { error: "Valid slug (2-80 lowercase chars/hyphens) and config are required." },
      { status: 400 }
    );
  }

  const normalizedConfig: InvitationConfig = {
    ...body.config,
    slug: rawSlug,
  };

  const { data, error } = await supabase
    .from("wedslash_invitations")
    .upsert(
      {
        slug: rawSlug,
        template_id: normalizedConfig.templateId || rawSlug,
        config: normalizedConfig,
      },
      { onConflict: "slug" }
    )
    .select("slug, template_id, config, updated_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ invitation: data }, { status: 200 });
}
