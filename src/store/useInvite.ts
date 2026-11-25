import { create } from "zustand";
import { getPresetConfig } from "@/lib/templates";
import type {
  FunctionEvent,
  InvitationConfig,
  InviteLanguage,
  StorySlide,
} from "@/lib/types";

const PUBLISHED_STORAGE_KEY = "wedslash_published_invites_v1";
const DRAFT_STORAGE_KEY = "wedslash_studio_draft_v1";

export type { FunctionEvent, StorySlide };

export interface InviteState {
  config: InvitationConfig;
  guestName: string;
  opened: boolean;
  revealed: boolean;
  publishedSlugs: Record<string, InvitationConfig>;
  setGuestName: (name: string) => void;
  setOpened: (opened: boolean) => void;
  setRevealed: (revealed: boolean) => void;
  selectTemplate: (templateId: string, preserveCouple?: boolean) => void;
  setLanguage: (language: InviteLanguage) => void;
  setSlug: (slug: string) => void;
  patchCouple: (patch: Partial<InvitationConfig["couple"]>) => void;
  patchBlessing: (patch: Partial<InvitationConfig["blessing"]>) => void;
  patchMechanics: (patch: Partial<InvitationConfig["mechanics"]>) => void;
  patchTheme: (patch: Partial<InvitationConfig["theme"]>) => void;
  patchEtiquette: (patch: Partial<InvitationConfig["etiquetteAndDetails"]>) => void;
  patchLocation: (patch: Partial<InvitationConfig["location"]>) => void;
  patchRsvpConfig: (patch: Partial<InvitationConfig["rsvpConfig"]>) => void;
  setFunctions: (functions: FunctionEvent[]) => void;
  setStoryCarousel: (slides: StorySlide[]) => void;
  publishCurrent: (customSlug?: string) => string;
  hydrateFromStorage: () => void;
  getInviteBySlug: (slug: string) => InvitationConfig;
}

function safeReadMap(): Record<string, InvitationConfig> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PUBLISHED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, InvitationConfig>) : {};
  } catch {
    return {};
  }
}

function safeWriteDraft(config: InvitationConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* ignore storage quota errors */
  }
}

function safeReadDraft(): InvitationConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InvitationConfig) : null;
  } catch {
    return null;
  }
}

export const useInvite = create<InviteState>((set, get) => ({
  config: getPresetConfig("wine-velvet-book"),
  guestName: "The Sharma Family",
  opened: false,
  revealed: false,
  publishedSlugs: {},

  setGuestName: (guestName) => set({ guestName }),
  setOpened: (opened) => set({ opened }),
  setRevealed: (revealed) => set({ revealed }),

  selectTemplate: (templateId, preserveCouple = false) => {
    const preset = getPresetConfig(templateId);
    const current = get().config;
    const next: InvitationConfig = preserveCouple
      ? {
          ...preset,
          couple: { ...current.couple },
          location: { ...current.location },
          etiquetteAndDetails: { ...current.etiquetteAndDetails },
          functions: current.functions.length > 0 ? current.functions : preset.functions,
          storyCarousel:
            current.storyCarousel.length > 0 ? current.storyCarousel : preset.storyCarousel,
          rsvpConfig: { ...current.rsvpConfig },
          slug: current.slug === current.templateId ? preset.slug : current.slug,
        }
      : preset;
    safeWriteDraft(next);
    set({ config: next, opened: false, revealed: false });
  },

  setLanguage: (language) =>
    set((st) => {
      const next = { ...st.config, language };
      safeWriteDraft(next);
      return { config: next };
    }),

  setSlug: (slug) =>
    set((st) => {
      const clean = slug
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, "");
      const next = { ...st.config, slug: clean || st.config.templateId };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchCouple: (patch) =>
    set((st) => {
      const next = { ...st.config, couple: { ...st.config.couple, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchBlessing: (patch) =>
    set((st) => {
      const next = { ...st.config, blessing: { ...st.config.blessing, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchMechanics: (patch) =>
    set((st) => {
      const next = { ...st.config, mechanics: { ...st.config.mechanics, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchTheme: (patch) =>
    set((st) => {
      const next = { ...st.config, theme: { ...st.config.theme, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchEtiquette: (patch) =>
    set((st) => {
      const next = {
        ...st.config,
        etiquetteAndDetails: { ...st.config.etiquetteAndDetails, ...patch },
      };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchLocation: (patch) =>
    set((st) => {
      const next = { ...st.config, location: { ...st.config.location, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  patchRsvpConfig: (patch) =>
    set((st) => {
      const next = { ...st.config, rsvpConfig: { ...st.config.rsvpConfig, ...patch } };
      safeWriteDraft(next);
      return { config: next };
    }),

  setFunctions: (functions) =>
    set((st) => {
      const next = { ...st.config, functions };
      safeWriteDraft(next);
      return { config: next };
    }),

  setStoryCarousel: (storyCarousel) =>
    set((st) => {
      const next = { ...st.config, storyCarousel };
      safeWriteDraft(next);
      return { config: next };
    }),

  publishCurrent: (customSlug) => {
    const st = get();
    const rawSlug = customSlug || st.config.slug || st.config.templateId;
    const slug =
      rawSlug
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, "") || st.config.templateId;
    const published: InvitationConfig = { ...st.config, slug };
    const map = { ...safeReadMap(), ...st.publishedSlugs, [slug]: published };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(map));
      } catch {
        /* ignore quota */
      }
    }
    safeWriteDraft(published);
    set({ config: published, publishedSlugs: map });
    return slug;
  },

  hydrateFromStorage: () => {
    const publishedSlugs = safeReadMap();
    const draft = safeReadDraft();
    set((st) => ({
      publishedSlugs,
      config: draft ?? st.config,
    }));
  },

  getInviteBySlug: (slug) => {
    const map = get().publishedSlugs;
    if (map[slug]) return map[slug];
    return getPresetConfig(slug);
  },
}));
