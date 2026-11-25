import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const cleanSlug = slug.toLowerCase().trim();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("wedslash_invitations")
    .select("slug, template_id, config, updated_at")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return Response.json({ invitation: null }, { status: 404 });
  }

  return Response.json({ invitation: data }, { status: 200 });
}
