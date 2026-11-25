import { create } from "zustand";
import type { GuestRsvp } from "@/lib/types";

const CRM_STORAGE_KEY = "wedslash_guest_crm_v1";

export const SEED_GUESTS: GuestRsvp[] = [
  {
    id: "g-1",
    inviteSlug: "wine-velvet-book",
    name: "The Sharma Family",
    group: "Groom's Family",
    status: "yes",
    count: 4,
    children: "Aarav (6), Diya (4)",
    drinks: ["Mocktail"],
    diet: "Veg",
    song: "Gallan Goodiyaan",
    note: "Arriving Thursday morning!",
    updatedAt: "2026-11-20T10:30:00Z",
  },
  {
    id: "g-2",
    inviteSlug: "wine-velvet-book",
    name: "Rahul & Priya Kapoor",
    group: "Bride's Friends",
    status: "yes",
    count: 2,
    children: "",
    drinks: ["Champagne", "Cocktail"],
    diet: "Jain",
    song: "Kesariya",
    note: "Cannot wait for Sangeet!",
    updatedAt: "2026-11-21T14:15:00Z",
  },
  {
    id: "g-3",
    inviteSlug: "wine-velvet-book",
    name: "Mehta Uncle & Aunty",
    group: "Family Friends",
    status: "later",
    count: 2,
    children: "",
    drinks: [],
    diet: "",
    song: "",
    note: "Confirming flight schedule next week",
    updatedAt: "2026-11-22T09:00:00Z",
  },
  {
    id: "g-4",
    inviteSlug: "wine-velvet-book",
    name: "Sofia Bennett",
    group: "Groom's Friends",
    status: "yes",
    count: 1,
    children: "",
    drinks: ["White Wine"],
    diet: "Vegan",
    song: "Perfect — Ed Sheeran",
    note: "Flying in from London",
    updatedAt: "2026-11-22T18:40:00Z",
  },
  {
    id: "g-5",
    inviteSlug: "wine-velvet-book",
    name: "The Iyer Family",
    group: "Bride's Family",
    status: "no",
    count: 0,
    children: "",
    drinks: [],
    diet: "",
    song: "",
    note: "Sending warm blessings from Chennai",
    updatedAt: "2026-11-23T11:20:00Z",
  },
  {
    id: "g-6",
    inviteSlug: "wine-velvet-book",
    name: "Kabir Anand +1",
    group: "VIPs",
    status: "yes",
    count: 2,
    children: "",
    drinks: ["Whiskey"],
    diet: "Non-Veg",
    song: "Mundian To Bach Ke",
    note: "",
    updatedAt: "2026-11-24T20:10:00Z",
  },
];

function loadLocalGuests(): GuestRsvp[] {
  if (typeof window === "undefined") return SEED_GUESTS;
  try {
    const raw = window.localStorage.getItem(CRM_STORAGE_KEY);
    if (!raw) return SEED_GUESTS;
    const parsed = JSON.parse(raw) as GuestRsvp[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_GUESTS;
  } catch {
    return SEED_GUESTS;
  }
}

function saveLocalGuests(guests: GuestRsvp[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(guests));
  } catch {
    /* ignore */
  }
}

interface GuestCrmState {
  guests: GuestRsvp[];
  hydrated: boolean;
  cloudSynced: boolean;
  hydrate: (slug?: string) => Promise<void>;
  addGuest: (name: string, group: string, inviteSlug?: string) => Promise<void>;
  upsertRsvp: (payload: Omit<GuestRsvp, "id" | "updatedAt">) => GuestRsvp;
  updateStatus: (id: string, status: GuestRsvp["status"]) => Promise<void>;
  removeGuest: (id: string) => Promise<void>;
  resetDemo: () => void;
}

export const useGuestCrm = create<GuestCrmState>((set, get) => ({
  guests: SEED_GUESTS,
  hydrated: false,
  cloudSynced: false,

  hydrate: async (slug) => {
    const local = loadLocalGuests();
    set({ guests: local, hydrated: true });
    try {
      const qs = slug ? `?slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/rsvps${qs}`);
      if (!res.ok) return;
      const json = (await res.json()) as { rsvps?: GuestRsvp[] };
      if (Array.isArray(json.rsvps)) {
        if (json.rsvps.length > 0) {
          saveLocalGuests(json.rsvps);
          set({ guests: json.rsvps, cloudSynced: true });
        } else {
          set({ cloudSynced: true });
        }
      }
    } catch {
      /* retain local cache offline */
    }
  },

  addGuest: async (name, group, inviteSlug = "wine-velvet-book") => {
    const clean = name.trim();
    if (!clean) return;
    const tempId = `g-${Date.now()}`;
    const optimistic: GuestRsvp = {
      id: tempId,
      inviteSlug,
      name: clean,
      group,
      status: "later",
      count: 2,
      children: "",
      drinks: [],
      diet: "",
      song: "",
      note: "",
      updatedAt: new Date().toISOString(),
    };
    const nextLocal = [optimistic, ...get().guests];
    saveLocalGuests(nextLocal);
    set({ guests: nextLocal });

    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimistic),
      });
      if (res.ok) {
        const json = (await res.json()) as { rsvp?: GuestRsvp };
        if (json.rsvp) {
          const updated = get().guests.map((g) => (g.id === tempId ? json.rsvp! : g));
          saveLocalGuests(updated);
          set({ guests: updated, cloudSynced: true });
        }
      }
    } catch {
      /* optimistic local cache stays intact */
    }
  },

  upsertRsvp: (payload) => {
    const current = get().hydrated ? get().guests : loadLocalGuests();
    const norm = payload.name.trim().toLowerCase();
    const existingIdx = current.findIndex(
      (g) => g.name.trim().toLowerCase() === norm
    );
    const tempId = existingIdx >= 0 ? current[existingIdx].id : `g-${Date.now()}`;
    const entry: GuestRsvp = {
      ...payload,
      id: tempId,
      group: existingIdx >= 0 ? current[existingIdx].group : payload.group || "Online RSVP",
      updatedAt: new Date().toISOString(),
    };
    const next =
      existingIdx >= 0
        ? current.map((g, i) => (i === existingIdx ? entry : g))
        : [entry, ...current];
    saveLocalGuests(next);
    set({ guests: next, hydrated: true });

    void fetch("/api/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { rsvp?: GuestRsvp };
        if (json.rsvp) {
          const synced = get().guests.map((g) => (g.id === tempId ? json.rsvp! : g));
          saveLocalGuests(synced);
          set({ guests: synced, cloudSynced: true });
        }
      })
      .catch(() => {});

    return entry;
  },

  updateStatus: async (id, status) => {
    const target = get().guests.find((g) => g.id === id);
    const nextCount = status === "no" ? 0 : Math.max(1, target?.count ?? 1);
    const next = get().guests.map((g) =>
      g.id === id
        ? {
            ...g,
            status,
            count: nextCount,
            updatedAt: new Date().toISOString(),
          }
        : g
    );
    saveLocalGuests(next);
    set({ guests: next });

    if (/^\d+$/.test(id)) {
      try {
        await fetch("/api/rsvps", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status, count: nextCount }),
        });
      } catch {
        /* ignore offline */
      }
    }
  },

  removeGuest: async (id) => {
    const next = get().guests.filter((g) => g.id !== id);
    saveLocalGuests(next);
    set({ guests: next });

    if (/^\d+$/.test(id)) {
      try {
        await fetch(`/api/rsvps?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch {
        /* ignore offline */
      }
    }
  },

  resetDemo: () => {
    saveLocalGuests(SEED_GUESTS);
    set({ guests: SEED_GUESTS });
  },
}));
