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

function loadGuests(): GuestRsvp[] {
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

function saveGuests(guests: GuestRsvp[]) {
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
  hydrate: () => void;
  addGuest: (name: string, group: string, inviteSlug?: string) => void;
  upsertRsvp: (payload: Omit<GuestRsvp, "id" | "updatedAt">) => GuestRsvp;
  updateStatus: (id: string, status: GuestRsvp["status"]) => void;
  removeGuest: (id: string) => void;
  resetDemo: () => void;
}

export const useGuestCrm = create<GuestCrmState>((set, get) => ({
  guests: SEED_GUESTS,
  hydrated: false,

  hydrate: () => {
    const guests = loadGuests();
    set({ guests, hydrated: true });
  },

  addGuest: (name, group, inviteSlug = "wine-velvet-book") => {
    const clean = name.trim();
    if (!clean) return;
    const nextGuest: GuestRsvp = {
      id: `g-${Date.now()}`,
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
    const next = [...get().guests, nextGuest];
    saveGuests(next);
    set({ guests: next });
  },

  upsertRsvp: (payload) => {
    const current = get().hydrated ? get().guests : loadGuests();
    const norm = payload.name.trim().toLowerCase();
    const existingIdx = current.findIndex(
      (g) => g.name.trim().toLowerCase() === norm
    );
    const entry: GuestRsvp = {
      ...payload,
      id: existingIdx >= 0 ? current[existingIdx].id : `g-${Date.now()}`,
      group: existingIdx >= 0 ? current[existingIdx].group : payload.group || "Guest RSVP",
      updatedAt: new Date().toISOString(),
    };
    const next =
      existingIdx >= 0
        ? current.map((g, i) => (i === existingIdx ? entry : g))
        : [entry, ...current];
    saveGuests(next);
    set({ guests: next, hydrated: true });
    return entry;
  },

  updateStatus: (id, status) => {
    const next = get().guests.map((g) =>
      g.id === id
        ? {
            ...g,
            status,
            count: status === "no" ? 0 : Math.max(1, g.count),
            updatedAt: new Date().toISOString(),
          }
        : g
    );
    saveGuests(next);
    set({ guests: next });
  },

  removeGuest: (id) => {
    const next = get().guests.filter((g) => g.id !== id);
    saveGuests(next);
    set({ guests: next });
  },

  resetDemo: () => {
    saveGuests(SEED_GUESTS);
    set({ guests: SEED_GUESTS });
  },
}));
