import type { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { GuestRsvp } from "@/lib/types";

interface DbRsvpRow {
  id: number;
  invite_slug: string;
  guest_name: string;
  guest_group: string;
  status: "yes" | "no" | "later";
  guest_count: number;
  children: string;
  drinks: string[];
  diet: string;
  song: string;
  note: string;
  updated_at: string;
}

function toGuestRsvp(row: DbRsvpRow): GuestRsvp {
  return {
    id: String(row.id),
    inviteSlug: row.invite_slug,
    name: row.guest_name,
    group: row.guest_group,
    status: row.status,
    count: row.guest_count,
    children: row.children || "",
    drinks: Array.isArray(row.drinks) ? row.drinks : [],
    diet: row.diet || "",
    song: row.song || "",
    note: row.note || "",
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  const slug = request.nextUrl.searchParams.get("slug");
  let query = supabase
    .from("wedslash_rsvps")
    .select(
      "id, invite_slug, guest_name, guest_group, status, guest_count, children, drinks, diet, song, note, updated_at"
    )
    .order("updated_at", { ascending: false })
    .limit(500);

  if (slug) {
    query = query.eq("invite_slug", slug.trim().toLowerCase());
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(
    { rsvps: ((data ?? []) as DbRsvpRow[]).map(toGuestRsvp) },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  let body: Partial<GuestRsvp>;
  try {
    body = (await request.json()) as Partial<GuestRsvp>;
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const inviteSlug = (body.inviteSlug || "wine-velvet-book").trim().toLowerCase();
  const guestName = (body.name || "").trim();
  const guestKey = guestName.toLowerCase();
  const status = body.status;

  if (
    inviteSlug.length < 2 ||
    !guestName ||
    !status ||
    !["yes", "no", "later"].includes(status)
  ) {
    return Response.json(
      { error: "inviteSlug, guest name, and valid status are required." },
      { status: 400 }
    );
  }

  const count =
    status === "no"
      ? 0
      : Math.max(0, Math.min(50, Number.isFinite(body.count) ? Number(body.count) : 1));

  const { data, error } = await supabase
    .from("wedslash_rsvps")
    .upsert(
      {
        invite_slug: inviteSlug,
        guest_name: guestName,
        guest_key: guestKey,
        guest_group: (body.group || "Online RSVP").trim() || "Online RSVP",
        status,
        guest_count: count,
        children: (body.children || "").trim(),
        drinks: Array.isArray(body.drinks) ? body.drinks : [],
        diet: (body.diet || "").trim(),
        song: (body.song || "").trim(),
        note: (body.note || "").trim(),
      },
      { onConflict: "invite_slug,guest_key" }
    )
    .select(
      "id, invite_slug, guest_name, guest_group, status, guest_count, children, drinks, diet, song, note, updated_at"
    )
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ rsvp: toGuestRsvp(data as DbRsvpRow) }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  let body: { id?: string; status?: GuestRsvp["status"]; count?: number };
  try {
    body = (await request.json()) as {
      id?: string;
      status?: GuestRsvp["status"];
      count?: number;
    };
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const numericId = Number(body.id);
  if (!Number.isInteger(numericId) || !body.status || !["yes", "no", "later"].includes(body.status)) {
    return Response.json(
      { error: "Numeric id and valid status are required." },
      { status: 400 }
    );
  }

  const nextCount =
    body.status === "no"
      ? 0
      : Math.max(1, Math.min(50, Number.isFinite(body.count) ? Number(body.count) : 1));

  const { data, error } = await supabase
    .from("wedslash_rsvps")
    .update({ status: body.status, guest_count: nextCount })
    .eq("id", numericId)
    .select(
      "id, invite_slug, guest_name, guest_group, status, guest_count, children, drinks, diet, song, note, updated_at"
    )
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ rsvp: toGuestRsvp(data as DbRsvpRow) }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "Supabase environment variables are not configured." },
      { status: 503 }
    );
  }

  const id = request.nextUrl.searchParams.get("id");
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return Response.json({ error: "Valid numeric id query param is required." }, { status: 400 });
  }

  const { error } = await supabase.from("wedslash_rsvps").delete().eq("id", numericId);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ deleted: true }, { status: 200 });
}
