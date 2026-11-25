export type InviteCategory =
  | "Indian Multi-Event"
  | "Western & Destination"
  | "Save the Date & Milestones";

export type InviteLanguage =
  | "english"
  | "hinglish"
  | "hindi"
  | "arabic-english"
  | "french"
  | "spanish";

export type SacredSymbol =
  | "ganesh"
  | "om"
  | "ik-onkar"
  | "bismillah"
  | "cross"
  | "floral-crest"
  | "passport"
  | "crown"
  | "none";

export type EntryType =
  | "velvet-book"
  | "wax-envelope"
  | "palace-doors"
  | "boarding-pass"
  | "curtain-reveal";

export type DateRevealType =
  | "pull-tassel-scroll"
  | "scratch-3-circles"
  | "scratch-heart"
  | "brush-petals"
  | "polaroid-develop";

export type ParticleType =
  | "marigold-petals"
  | "rose-petals"
  | "gold-dust"
  | "stars"
  | "snow-blossom"
  | "none";

export type SceneIllustrationId =
  | "pujan"
  | "haldi"
  | "mehendi"
  | "sangeet"
  | "pheras"
  | "reception"
  | "nikah"
  | "cocktail";

export interface FunctionEvent {
  id: string;
  name: string;
  scene: SceneIllustrationId;
  dayAndDate: string;
  time: string;
  venueName: string;
  venueAddress?: string;
  mapUrl?: string;
  dressCodeLabel: string;
  dressCodeColors: string[];
  cardThemeColor: string;
}

export interface StorySlide {
  id: string;
  title: string;
  dateLabel: string;
  caption: string;
  palette: [string, string];
  imageUrl?: string;
}

export interface InvitationConfig {
  id: string;
  slug: string;
  templateId: string;
  category: InviteCategory;
  language: InviteLanguage;

  couple: {
    groomName: string;
    groomParents: string;
    brideName: string;
    brideParents: string;
    monogram: string;
    hashtag: string;
    weddingDate: string; // ISO datetime e.g. "2027-02-13T19:30:00"
    dateDisplayLabel: string; // e.g. "Friday, 13 February 2027"
    muhuratTime: string;
    closingFamilyLine: string;
    heroPhotoUrl: string;
    heroSubtitle: string;
    kenBurnsEnabled: boolean;
  };

  blessing: {
    enabled: boolean;
    symbol: SacredSymbol;
    sacredQuote: string;
    inviteIntroLine: string;
  };

  mechanics: {
    entryType: EntryType;
    dateRevealType: DateRevealType;
    marigoldToranEnabled: boolean;
    cornerParallaxRoses: boolean;
    particleType: ParticleType;
    audioMode: "synth" | "mp3" | "youtube";
    musicTrackId: string;
    customMp3Url: string;
    youtubeSongUrl: string;
  };

  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentGold: string;
    bgColor: string;
    textColor: string;
    fontPairing: "royal" | "editorial" | "minimal";
    archStyle: "gold-arch" | "jharokha" | "roman-arch" | "editorial-frame";
  };

  functions: FunctionEvent[];

  etiquetteAndDetails: {
    ladiesDressNote: string;
    gentlemenDressNote: string;
    reservedColorsNote: string;
    giftPreferenceNote: string;
    giftRegistryUrl: string;
    organizerName: string;
    organizerPhone: string;
    congratulationsPrompt: string;
  };

  storyCarousel: StorySlide[];

  location: {
    venueTitle: string;
    fullAddress: string;
    city: string;
    departureCode?: string;
    departureCity?: string;
    arrivalCode?: string;
    arrivalCity?: string;
    googleMapsUrl: string;
  };

  rsvpConfig: {
    enabled: boolean;
    deadlineText: string;
    allowTellLater: boolean;
    collectChildrenDetails: boolean;
    collectDietary: boolean;
    collectDrinkPreference: boolean;
    drinkOptions: string[];
    collectDanceSong: boolean;
    whatsappHostNumber: string;
    defaultPlusOnes: number;
  };
}

export interface Template {
  id: string;
  name: string;
  tagline: string;
  category: InviteCategory;
  style: string;
  badge?: string;
  entry: string;
  reveal: string;
  entryType: EntryType;
  dateRevealType: DateRevealType;
  particleType: ParticleType;
  primary: string;
  secondary: string;
  gold: string;
  bg: string;
  ink: string;
  font: "royal" | "editorial" | "minimal";
  particle: string;
  rating: number;
  uses: string;
  previewType: "book" | "envelope" | "boarding" | "scratch" | "petals" | "polaroid" | "arch" | "vip";
}

export interface GuestRsvp {
  id: string;
  inviteSlug: string;
  name: string;
  group: string;
  status: "yes" | "no" | "later";
  count: number;
  children: string;
  drinks: string[];
  diet: string;
  song: string;
  note: string;
  updatedAt: string;
}
