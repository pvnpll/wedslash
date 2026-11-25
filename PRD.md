# WEDSLASH — Product Requirements Document (PRD) & Master Implementation Plan

**Product Name:** Wedslash  
**Tagline:** *Open, Tap, Pull, Scratch & Swipe — Couture Interactive Invitations*  
**Category:** Interactive Digital Wedding & Celebration Invitation Platform (Storefront + Live Studio Builder + Standalone ZIP Export + Guest CRM & Event Suite)  
**Target Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP, HTML5 Canvas, Zustand, JSZip (for standalone Netlify/Vercel ZIP export)  
**Document Version:** 2.0.0 (Updated with Live Reference Teardowns)  
**Last Updated:** November 2026  

---

## 1. Executive Summary & Vision

**Wedslash** is an ultra-crafted interactive digital invitation platform and full-stack celebration suite. Built directly from a deep teardown of **[aikathekedaar's Interactive Wedding Invitation system](https://aikathekedaar.netlify.app/?utm_source=sp_auto_dm#prompt/interactive-wedding-invitation)** (*Open, Tap, Pull & Swipe*) and **[Webgency Invitations](https://webgencyinvitations.com)** (*The Sacred Garden, Blossom & Oud, Dolce Vita, Destination Love, Timeless Grace, Golden Secret, Petal Promise, Captured Love*), Wedslash transforms static digital invites into tactile, cinematic, mobile-first web experiences.

Wedslash operates as a **Unified Hybrid Platform** combining four core product pillars:
1. **Curated Template Showcase & Storefront:** A gallery of **16+ high-craft interactive templates** across Indian/South Asian multi-event weddings, Western/Global luxury editorial & destination weddings, and Save-the-Date / Milestone celebrations (Birthdays, Baby Showers, Quinceañeras, Engagements, Anniversaries, Corporate Galas) with instant live interactive previews.
2. **Self-Serve Live Customizer Studio:** A split-screen, real-time visual editor where couples or event planners customize every detail—couple & parents' names, story timelines, 3D swipeable multi-event itineraries, dress code palettes (with "reserved colors to avoid" rules), venue maps, photo carousels, background music (MP3 fade-in or YouTube "Our Song" button), and interactive entry/date mechanics—with zero code.
3. **Dual Publishing Engine (Hosted Link + Standalone ZIP Export):**
   * **Instant Wedslash Cloud Link:** Publish to `wedslash.com/invite/[slug]` with unlimited guests, live RSVP dashboard, and personalized guest links.
   * **Downloadable Self-Contained ZIP Package:** Inspired by the *AikaTheKedaar* Netlify workflow, users can export their entire customized interactive invitation as a ready-to-deploy `wedding-invite.zip` (`index.html`, `photos/`, `song.mp3`) to drop directly onto Netlify or Vercel for free forever.
4. **Full Guest CRM, Personalized Links & Event Suite:** Guest list management, dynamic personalized URLs (`?guest=The+Sharma+Family`) that greet each guest by name on the 3D book/envelope cover, event-specific visibility controls, WhatsApp/Email share automation, live RSVP tracking (attendance + "tell you a bit later", drink preferences, dietary restrictions, children names/ages, DJ song requests), and printable QR codes.

---

## 2. Live Reference Benchmark & Exact Experience Teardown

### 2.1 Reference 1: AikaTheKedaar — *"Interactive Wedding Invitation (Open, Tap, Pull & Swipe)"*
From inspecting the exact specification in `aikathekedaar.netlify.app/prompts-data.js`, the signature **8-Part Choreography** and technical standards are:

1. **Opening — 3D Wine-Velvet Book with Gold Emblem:**
   * Starts with a 3D wine-velvet book (`#6E1F2F`) with a gold border and a gold **Ganesh Ji emblem** (or configurable cultural emblem) on the cover, resting on a soft blush background with blurred 3D roses in front and behind (parallax).
   * Displays a smooth preload indicator until images, fonts, and music are ready, then reveals *"Tap the book to open"*.
   * **On Tap:** The 3D book cover swings open, the camera zooms into the first page, rose/marigold petals begin falling, and the background MP3 music softly fades in.
2. **First Page — Full-Screen Centred Arch Portrait & Typewriter Reveal:**
   * Exactly one mobile viewport (`100dvh`) high, centered, never clipped.
   * Photo #1 serves as a soft, blurred, slowly zooming Ken Burns background inside a thin gold arch frame behind the typography.
   * Gold Ganesh Ji medallion at the top → *"Together with their families"* → Groom's name typed letter-by-letter with a soft blur-in → *"Son of [Father] & [Mother]"* → *"&"* → Bride's name typed letter-by-letter → *"Daughter of [Father] & [Mother]"* → invite line → animated scroll-down arrow.
3. **Save the Date — Pull-the-Tassel Scroll Unroll:**
   * A golden rod with a rolled parchment scroll and a hanging silk tassel, accompanied by an animated hand/finger hint showing how to pull or drag it downward.
   * **Dragging or tapping the tassel** unrolls the scroll smoothly to reveal the wedding date & Muhurat time with Ganesh Ji, rose corners, and a gold border, triggering a **petal and confetti burst**.
   * Directly below: a one-line live countdown (`days · hrs · min · sec`) and an *"Add to Calendar"* button.
4. **Wedding Festivities — Swipeable 3D Function Card Carousel:**
   * A looping 3D coverflow/card carousel (large active center card, neighboring cards scaled down and softly blurred, advancing one card per swipe).
   * Supports all Indian wedding functions: **Mata Pujan** (beige), **Haldi** (marigolds, wear yellow), **Mehendi** (mehendi hands, wear green), **Sangeet** (dancers, Indo-western, purple & pink), **Baraat & Pheras** (mandap & sacred fire, red & gold), and **Grand Reception**.
   * Each card features a custom illustrated scene for that function, an animated icon, day & date, time, venue, and a **dress-code row with live color swatches**.
5. **Our Story — Swipeable 3D Photo Carousel:**
   * Interactive 3D photo stack/carousel with couple photos, romantic captions, and pagination dots.
6. **Grand Reception Feature Card:**
   * Deep wine (`#6E1F2F`) luxury card with champagne gold typography, floating sparkles, and corner flowers that bloom as the card scrolls into view.
7. **Location — Illustrated Route Map Card:**
   * Illustrated map card with an animated dashed route path and dropping location pin.
   * Includes two one-tap action buttons: **"Get Directions"** (opens Google Maps link) and **"Copy Address"** (with instant clipboard confirmation toast).
8. **Closing & Family Blessing:**
   * Sacred emblem, *"We can't wait to celebrate with you"*, and *"With love, the [Groom] & [Bride] families"*.
   * Fixed parallax 3D roses at screen corners that sway with scroll, plus **hanging marigold strings (Toran)** at the top of the viewport that swing gently on scroll.

---

### 2.2 Reference 2: Webgency Invitations (`webgencyinvitations.com`)
From inspecting the live Webgency storefront and all 11 live invitation routes (`/thesacredgarden`, `/blossomoud`, `/dolcevita`, `/destinationlove`, `/timelessgrace`, `/goldensecret`, `/petalpromise`, `/capturedlove`, `/template5`, `/jathuandthanu`, `template2`, `template3`), key mechanics and product features include:

1. **Four Distinct Interactive Date-Reveal & Entry Mechanics:**
   * **3-Circle Scratch-to-Reveal (`Dolce Vita`, `Timeless Grace`, `Golden Secret`):** Three separate metallic foil circles for **Day**, **Month**, and **Year** labeled *"✦ Scratch to reveal the date ✦"*.
   * **Brush the Petals to Reveal (`Petal Promise`):** A pile of realistic rose/blossom petals covering the date and venue on screen—guests swipe/brush their finger across the screen to scatter the petals away and uncover the date underneath.
   * **Tap the Polaroid to Develop (`Captured Love`):** An instant camera Polaroid frame that starts dark/undeveloped; tapping or shaking it develops the couple's photo and reveals the wedding date (`27 · 07 · 27 · Villa Borghese · Rome`) on the bottom white border.
   * **Boarding Pass & Passport Ticket (`Destination Love`):** Designed like an international airline boarding pass and passport stamp (`PASSPORT: 050527`, `CODE: MEXICO`, `<<<<CELEBRATE<<<<WITH<<<<YOU<<<<`, compass rose, *"Takeoff in Days:Hours:Minutes:Seconds"*, and *"Book Your Seat"* RSVP).
2. **Nuanced Cultural, Dress Code & Etiquette Blocks:**
   * **Ladies vs. Gentlemen Specific Dress Guidance:** Separate tailored notes for women and men (e.g., *"Ladies: Anarkali suit, lehengas/sarees or pastel summer dresses"*, *"Gentlemen: Well-tailored suits or smart casual in beige/blue/grey"*), plus outdoor footwear advisories.
   * **Reserved Colors to Avoid:** Explicit etiquette callouts (e.g., *"Please avoid wearing deep red, maroon, or beige as it is reserved for the bride and groom; sage green is reserved for bridesmaids"*).
   * **Gift Preferences & Organizer Contacts:** Dedicated block for *"Kindly, no boxed gifts please / contribution toward our future"* or a *"View Gift List"* registry button, plus direct clickable WhatsApp/phone contact for the Wedding Organizer (e.g., *"Contact our wedding organizer Maria: +31..."*) and funny story prompts for speeches.
3. **Rich Multi-Question RSVP Modal & Google Sheets / CSV Sync:**
   * 3-option attendance radio: *"Yes, I will (Accepts with pleasure)"*, *"Unfortunately, I can't (Declines with regret)"*, and *"I'll tell you a bit later"*.
   * Detailed guest inputs: Number of family members attending, **Children attending (names and ages)**, **Food intolerances / dietary requirements**, **Drink preference selector** (*Champagne, White wine, Red wine, Whiskey, Cocktail, Non-alcoholic / Mocktail*), and **"A Song That Gets You Dancing"**.
4. **Multilingual & Global Event Support:**
   * Seamless support for English, Hindi/Hinglish, Arabic/Urdu script headers (`الآنسة أميرة والسيد يوسف` / Surah An-Naba 78:8 *"And We created you in pairs"*), French (`Appuyez pour ouvrir`, `Confirmez Votre Présence`), and Spanish (`Quinceañeras`).
5. **Hybrid Service & Pricing Model:**
   * **Unlimited Guests, One Link:** Send to 50 or 50,000 guests with zero per-guest fees.
   * **3 Tiered Offerings on Storefront:** *Save the Date* (€35 / ₹1,499), *Template Invitation* (€75 / ₹2,999), and *100% Bespoke Custom Invitation* (€155 / ₹6,499) with 24h Express option and Free Self-Serve Builder tier.

---

## 3. Design Direction & Aesthetic System (Frontend Design Specification)

### 3.1 Platform Brand Identity (The Wedslash Studio Shell)
The Wedslash marketing storefront and studio builder use an **Atelier Stationery & Editorial Couture** identity—quiet, tactile, and disciplined so the vibrant, ornate invitation templates take center stage.

* **Core Palette:**
  * `Atelier Alabaster` (`#FAF7F2`) — Primary canvas background with a subtle 2% paper grain.
  * `Pressed Linen` (`#F0EAE1`) — Secondary surface for studio panels, cards, and filter trays.
  * `Obsidian Ink` (`#161412`) — Primary typography and `1px` architectural hairline borders.
  * `Muted Umber` (`#6E655F`) — Secondary body copy and metadata.
  * `Champagne Gold` (`#C59B27`) — Foil accents, active states, and tassel highlights.
  * `Wine Velvet` (`#6E1F2F`) — Signature royal brand accent (directly nodding to the wine-velvet book cover).
* **Typography System:**
  * **Display / Editorial Headlines:** *Playfair Display* & *Cormorant Garamond* (weights 400, 600, Italic) — high-contrast editorial serif for couple names and headings.
  * **UI & Clean Small Text:** *Montserrat* & *Plus Jakarta Sans* (weights 400, 500, 600) — clean geometric/humanist sans-serif for timestamps, itineraries, and studio controls.
  * **Monograms & Calligraphic Accents:** *Pinyon Script* / *Great Vibes* for wax seals and monograms.

---

## 4. Expanded 16-Template Catalog (Mapped to Both Reference Sites)

Every template is driven by a unified `InvitationConfig` JSON schema, allowing instant switching between templates without losing user content.

### Category A: Indian & South Asian Multi-Event Weddings (AikaTheKedaar & Royal Heritage Series)
1. **Wine Velvet Royal Book (`wine-velvet-book`) — *Flagship AikaTheKedaar Signature***
   * *Entry:* 3D Wine-Velvet (`#6E1F2F`) hardcover book with gold border, Ganesh Ji emblem, and parallax 3D blush roses.
   * *Mechanics:* Hanging marigold Toran strings at top that swing on scroll, letter-by-letter blur-in names over a slow-zooming gold arch photo, **Pull-the-Tassel Scroll Unroll** for Save the Date, and **3D Swipeable Function Card Carousel** (Mata Pujan, Haldi, Mehendi, Sangeet, Baraat & Pheras, Grand Reception) + Illustrated Route Map card.
2. **Udaipur Royal Durbar (`royal-udaipur`)**
   * *Entry:* Double brass Mewar palace doors opening with shehnai music and falling marigold petals.
   * *Mechanics:* Jharokha arch frames, dynamic background color transitions as the guest scrolls through Haldi (Turmeric), Mehendi (Emerald), Sangeet (Midnight Indigo), and Royal Wedding (Sindoor Crimson).
3. **The Sacred Garden — Nikaah & Walima (`the-sacred-garden`) — *Webgency Inspired***
   * *Entry:* Emerald & ivory botanical arch gate with Bismillah / Surah An-Naba 78:8 (*"And We created you in pairs"*) calligraphy and ambient fountain/oud audio.
   * *Mechanics:* 3-circle gold Scratch-to-Reveal date, Nikaah/Mocktail/Dinner/Walima timeline, reserved dress-code warning (*"Kindly avoid deep red & maroon"*), and no-boxed-gifts etiquette note.
4. **Dakshin Kanjeevaram Silk (`kanjeevaram-gold`)**
   * *Entry:* Tap-to-light traditional brass lamp (*Kuthuvilakku*) entry with Carnatic flute audio.
   * *Mechanics:* Temple gopuram gold borders, Muhurtham time scroll unroll, Sanskrit/Tamil/Telugu/English blessing support, and banana-leaf feast RSVP.
5. **Anand Karaj Phulkari Pastel (`serene-anand-karaj`)**
   * *Entry:* Dusty rose & champagne wax-sealed envelope with Ik Onkar gold medallion.
   * *Mechanics:* Pull-tassel scroll reveal, 3D swipeable cards for Maiyan, Jaggo, Chooda, Anand Karaj, and Reception.

### Category B: Western, Destination & Global Luxury Weddings (Webgency Signature Series)
6. **Dolce Vita — Italian Coastal (`dolce-vita`) — *Webgency Flagship***
   * *Entry:* Linen envelope with wax seal opening to coastal Amalfi/Cancún editorial layout.
   * *Mechanics:* **3-Circle Metallic Foil Scratch-to-Reveal** (Day | Month | Year), timeline icons (Opening of Doors, Ceremony, Cocktail, Dinner, Open Bar), Ladies & Gentlemen pastel dress code with hat/sunglasses tip, and drink-preference RSVP.
7. **Destination Love — Boarding Pass & Passport (`destination-love`) — *Webgency Flagship***
   * *Entry:* Interactive **Airline Boarding Pass & Marriage Passport** cover with machine-readable code (`<<<<CELEBRATE<<<<WITH<<<<YOU<<<<`), passport stamp, and compass rose.
   * *Mechanics:* *"Takeoff Countdown"*, flight-itinerary style wedding schedule, travel & hotel transfer info, and *"Book Your Seat"* boarding-pass RSVP.
8. **Blossom & Oud — Marrakech Franco-Arabic (`blossom-oud`) — *Webgency Inspired***
   * *Entry:* Moorish Zellige tile & terracotta arch reveal with bilingual support (English/French + Arabic calligraphy).
   * *Mechanics:* Color palette swatch circles, Ladies vs. Gentlemen attire cards, and one-tap Google Maps itinerary.
9. **Timeless Grace — Ivory & Champagne Couture (`timeless-grace`) — *Webgency Inspired***
   * *Entry:* Minimalist video/motion curtain reveal with soft piano soundtrack.
   * *Mechanics:* 3-circle silver/champagne scratch date, family parentage columns (*"Son of... & Daughter of..."*), reserved bridesmaid color callout, and gift registry drawer.
10. **Vogue Milan Editorial (`vogue-editorial`)**
    * *Entry:* High-fashion magazine cover peel with oversized Playfair Display typography and B&W-to-color portrait transitions.
    * *Mechanics:* 3D swipeable Polaroid story gallery, vinyl record player, and architectural sharp-edge itinerary.

### Category C: Interactive Save the Dates & Milestone Celebrations
11. **Golden Secret — Scratch Save the Date (`golden-secret`) — *Webgency Inspired***
    * *Mechanics:* Ultra-focused luxury Save the Date card centered around a giant metallic gold **Scratch-to-Reveal** heart/circle with instant confetti burst and `.ics` calendar save.
12. **Petal Promise — Brush Petals to Reveal (`petal-promise`) — *Webgency Inspired***
    * *Mechanics:* Interactive physics canvas covered in rose petals—guests **brush/swipe the petals away with their finger** to uncover the hidden wedding date and venue underneath.
13. **Captured Love — Polaroid Tap-to-Develop (`captured-love`) — *Webgency Inspired***
    * *Mechanics:* Interactive vintage **Polaroid frame** that guests tap to "develop" from dark film into a vibrant couple portrait with handwritten date & Rome/Paris venue caption.
14. **Velvet Gala — Milestone Birthday / VIP Club (`luxe-birthday-gala`)**
    * *Mechanics:* 3D tilting hologram VIP pass, cocktail & drink selector RSVP (*Champagne, Wine, Whiskey, Martini, Mocktail*), and DJ song request queue.
15. **Little Star — Baby Shower & Naming Ceremony (`celestial-baby-shower`)**
    * *Mechanics:* Cloud & hot-air balloon parallax, scratch-to-reveal baby gender/due date, and gift registry link.
16. **La Quinceañera Real / Golden Anniversary (`royal-milestone-gala`)**
    * *Mechanics:* Crown/tiara or 50th Jubilee gold emblem, "Then & Now" photo story carousel, court of honor / family credits, and multi-course RSVP.

---

## 5. Signature Interactive Mechanics Engineering Specification

| Mechanic ID | Name | Inspired By | Technical Implementation |
| :--- | :--- | :--- | :--- |
| **M1** | **3D Wine-Velvet Book Open** | *AikaTheKedaar* | CSS 3D `perspective: 1400px` + Framer Motion `rotateY(-165deg)` cover hinge, Ganesh/Crest gold SVG medallion, camera scale zoom into Page 1, triggers audio fade-in. |
| **M2** | **3D Wax-Seal Envelope Unseal** | *Webgency* | Personalized `?guest=` ribbon tag, tap-to-crack wax seal, top flap `rotateX(180deg)`, inner card rises upward. |
| **M3** | **Pull-the-Tassel Scroll Unroll** | *AikaTheKedaar* | Golden rod header + draggable/tappable silk tassel using Framer Motion `useMotionValue` / spring height expansion (`height: 0 -> auto`), animated finger prompt, triggers petal & confetti burst on full unroll. |
| **M4** | **3-Circle Scratch-to-Reveal** | *Webgency (Dolce Vita / Timeless Grace)* | Three HTML5 `<canvas>` circles (Day, Month, Year) with procedural brushed gold/silver foil texture, `globalCompositeOperation = 'destination-out'`, auto-completes at 60% scratch with sparkle burst. |
| **M5** | **Brush-the-Petals Reveal** | *Webgency (Petal Promise)* | Interactive cluster of 45 layered SVG/Canvas rose petals covering the date box; pointer/touch proximity applies radial velocity vectors to scatter petals off the date. |
| **M6** | **Polaroid Tap-to-Develop** | *Webgency (Captured Love)* | CSS filter choreography (`brightness(0.15) sepia(0.8) blur(12px) contrast(0.6)` → crisp full-color photo over 2.8s on tap) with camera shutter sound/flash effect. |
| **M7** | **Boarding Pass & Passport Flip** | *Webgency (Destination Love)* | Perforated stub tear animation, MRZ passport code generator (`<<<<CELEBRATE<<<<WITH<<<<YOU<<<<`), spinning compass rose. |
| **M8** | **Swipeable 3D Function & Story Carousels** | *AikaTheKedaar* | Framer Motion 3D drag carousel (`rotateY`, `scale`, `filter: blur()` on inactive neighbors, infinite loop, 1 card per swipe) with custom function illustrations (Haldi, Mehendi, Sangeet, Pheras, Reception). |
| **M9** | **Swinging Marigold Toran & Corner Parallax Roses** | *AikaTheKedaar* | Fixed top marigold garland SVG strings that swing via scroll-velocity spring physics + 4 corner 3D roses that bloom and shift on scroll. |
| **M10** | **Illustrated Route Map Card** | *AikaTheKedaar* | Animated SVG dashed route path (`stroke-dashoffset` animation), bouncing pin, **"Get Directions"** button, and **"Copy Address"** clipboard button. |
| **M11** | **MP3 Fade-In + YouTube "Our Song" Fallback** | *AikaTheKedaar & Webgency* | Web Audio / HTML5 Audio controller with smooth volume ramp (`0 -> 0.7` over 2s on invite open) + option to attach a YouTube URL that renders a floating *"🎵 Our Song"* pill. |
| **M12** | **Standalone Netlify/Vercel ZIP Exporter** | *AikaTheKedaar* | Client-side `JSZip` generator in the Studio that packages the user's customized invitation into a self-contained `wedding-invite.zip` (`index.html` + assets) for 1-click free hosting anywhere. |

---

## 6. Product Architecture & Core Modules

### Module 1: Marketing Storefront, Pricing Tiers & Template Explorer (`/`, `/templates`)
* **Interactive Hero Stage:** Live phone mockup where visitors can immediately test **Book Open**, **Pull-the-Tassel**, **Scratch-to-Reveal**, and **Brush Petals** right in the hero.
* **Webgency-Inspired Value Props & Pricing Section:**
  * Highlights: *"Unlimited Guests, One Link"*, *"Works on Any Phone (No App Needed)"*, *"Available in Any Language (English, Hindi, Hinglish, Arabic, French, Spanish)"*, *"Instant Self-Serve Studio OR 24h Designer Concierge"*.
  * Clear 3-tier transparent pricing cards (*Save the Date*, *Template Invitation*, *100% Bespoke Custom*) + **Free Self-Serve Builder & ZIP Export** mode.
* **Filterable 16-Template Showcase Grid:** Filter by Category, Cultural Style, and Interactive Mechanic (Book Open, Tassel Scroll, Scratch Card, Petal Brush, Polaroid, Boarding Pass).

### Module 2: Wedslash Customizer Studio (`/studio`)
* **Left Panel — 7-Tab Structured Editor:**
  1. **Couple & Family:** Groom & Bride names, Father & Mother names for both sides, closing family line, wedding date, Muhurat time, language/script preset (English, Hinglish, Hindi, Arabic/Urdu Bismillah, French).
  2. **Opening & Date Reveal Mechanic:**
     * *Entry Style:* 3D Wine-Velvet Book, Wax-Seal Envelope, Palace Doors, Boarding Pass, or Direct Page.
     * *Date Reveal Style:* Pull-the-Tassel Scroll, 3-Circle Scratch-to-Reveal, Brush-the-Petals, or Polaroid Tap-to-Develop.
     * *Sacred / Header Emblem:* Ganesh Ji, Om, Ik Onkar, Bismillah / Ayah, Cross, Botanical Crest, or None.
  3. **Wedding Festivities (3D Carousel & Timeline):** Add/edit/reorder functions (Mata Pujan, Haldi, Mehendi, Sangeet, Baraat & Pheras, Nikaah, Ceremony, Cocktail, Reception) with custom illustrated scene selector, date/time, venue, and dress code colors.
  4. **Dress Code, Etiquette & Organizer:**
     * Ladies dress code note & Gentlemen dress code note.
     * **Reserved Colors to Avoid** callout (e.g., *"Please avoid beige/red"*).
     * **Gift Preference** note (e.g., *"Kindly no boxed gifts"* / Registry URL).
     * **Wedding Organizer Contact** (Name + clickable phone/WhatsApp) & speech/story prompt.
  5. **Photos, Story & Audio:**
     * Hero Arch Portrait photo (with slow Ken Burns zoom toggle).
     * 3D Swipeable "Our Story" photo carousel items & captions.
     * Music mode: Built-in ceremonial/romantic MP3 tracks, upload custom MP3, or paste a **YouTube "Our Song" link**.
  6. **Location & Illustrated Map:** Primary venue name, full address, Google Maps URL, and animated route map card preview.
  7. **RSVP Customizer:** Toggle 3-option attendance (*Yes / No / Tell you later*), Drink preference selector (*Champagne, Wine, Whiskey, Mocktail, etc.*), Food intolerances, Children names & ages, DJ Song Request, and WhatsApp direct RSVP number.
* **Center Stage — Real-Time Mobile Phone Stage + State Jumpers:**
  * Jump instantly between: `[1. Cover / Book Closed]` → `[2. First Page Arch]` → `[3. Date Reveal (Tassel/Scratch/Petals)]` → `[4. 3D Functions Carousel]` → `[5. RSVP & Map]`.
* **Top Bar — Publish Link & Download ZIP:**
  * **Publish Live Link:** Generates `wedslash.com/invite/[slug]` with QR code.
  * **Download Standalone ZIP (`wedding-invite.zip`):** Generates a complete standalone `index.html` bundle ready to drag-and-drop onto Netlify Drop or share offline.

### Module 3: Couple Dashboard, Guest CRM & Google Sheets / CSV Sync (`/dashboard`)
* **Live Metrics:** Total Invited, Confirmed Attending, Declined, "Will Tell Later", Total Headcount (Adults + Children), Drink Breakdown chart, and Dietary/Intolerance list.
* **Personalized Guest Link & WhatsApp Launcher:**
  * Generate unique guest links (`?guest=Mr.+%26+Mrs.+Kapoor`) that personalize the cover greeting and pre-fill the RSVP form.
  * One-click **Export to CSV / Google Sheets compatible format**.
* **Printable QR Code Studio:** Generate high-res wedding invitation QR cards for physical inserts or venue welcome boards.

---

## 7. Updated Technical Data Schema (`InvitationConfig`)

```typescript
export interface InvitationConfig {
  id: string;
  slug: string;
  templateId: string;
  category:
    | 'indian-wedding'
    | 'western-wedding'
    | 'destination-wedding'
    | 'save-the-date'
    | 'milestone-event';
  language: 'english' | 'hinglish' | 'hindi' | 'arabic-english' | 'french';

  couple: {
    groomName: string;
    groomParents: string; // e.g., "Son of Mr. राजेश & Mrs. सुनीता शर्मा"
    brideName: string;
    brideParents: string; // e.g., "Daughter of Mr. Vikram & Mrs. Meera Kapoor"
    monogram: string;
    hashtag: string;
    weddingDate: string; // ISO date e.g., "2027-02-14"
    muhuratTime: string; // e.g., "Pheras at 7:30 PM"
    closingFamilyLine: string; // e.g., "With love, the Sharma & Kapoor families"
    heroPhotoUrl: string;
  };

  blessing: {
    enabled: boolean;
    symbol: 'ganesh' | 'om' | 'ik-onkar' | 'bismillah' | 'cross' | 'floral-crest' | 'passport' | 'none';
    sacredQuote: string; // e.g., "Shree Ganeshaya Namah" or "And We created you in pairs (Surah An-Naba 78:8)"
    inviteIntroLine: string; // e.g., "Together with their families, joyfully invite you..."
  };

  mechanics: {
    entryType: 'velvet-book' | 'wax-envelope' | 'palace-doors' | 'boarding-pass' | 'curtain-reveal';
    dateRevealType: 'pull-tassel-scroll' | 'scratch-3-circles' | 'brush-petals' | 'polaroid-develop';
    marigoldToranEnabled: boolean;
    cornerParallaxRoses: boolean;
    particleType: 'marigold-petals' | 'rose-petals' | 'gold-dust' | 'stars' | 'none';
    audioMode: 'mp3' | 'youtube';
    musicTrackId: string;
    customMp3Url?: string;
    youtubeSongUrl?: string;
  };

  theme: {
    primaryColor: string;    // e.g., "#6e1f2f" (Wine Velvet)
    secondaryColor: string;  // e.g., "#fdf6f0" (Ivory Blush)
    accentGold: string;      // e.g., "#d4af37" (Champagne Gold)
    textColor: string;
    fontPairing: 'playfair-montserrat' | 'cormorant-jakarta' | 'vogue-editorial' | 'heritage-royal';
    archStyle: 'gold-arch' | 'jharokha' | 'roman-arch' | 'editorial-frame';
  };

  functions: Array<{
    id: string;
    name: string;            // e.g., "Mata Pujan", "Haldi", "Mehendi", "Sangeet", "Baraat & Pheras", "Reception"
    sceneIllustration: 'pujan' | 'haldi-marigold' | 'mehendi-hands' | 'sangeet-dance' | 'mandap-fire' | 'reception-toast' | 'nikah-arch' | 'cocktail';
    dayAndDate: string;
    time: string;
    venueName: string;
    venueAddress: string;
    mapUrl: string;
    dressCodeLabel: string;  // e.g., "Indo-Western · Purple & Pink"
    dressCodeColors: string[]; // hex swatches
    cardThemeColor: string;
  }>;

  etiquetteAndDetails: {
    ladiesDressNote: string;
    gentlemenDressNote: string;
    reservedColorsNote: string; // e.g., "Please avoid wearing beige & deep red, reserved for the couple."
    giftPreferenceNote: string; // e.g., "Kindly, no boxed gifts please."
    giftRegistryUrl?: string;
    organizerName: string;
    organizerPhone: string;
    congratulationsPrompt: string; // e.g., "Share a funny memory of us when you toast!"
  };

  storyCarousel: Array<{
    id: string;
    title: string;
    caption: string;
    imageUrl: string;
  }>;

  location: {
    venueTitle: string;
    fullAddress: string;
    city: string;
    googleMapsUrl: string;
  };

  rsvpConfig: {
    enabled: boolean;
    deadlineText: string;
    allowTellLater: boolean; // 3rd radio option: "I'll tell you a bit later"
    collectChildrenDetails: boolean; // Names & ages of children
    collectDietary: boolean;
    collectDrinkPreference: boolean;
    drinkOptions: string[]; // ["Champagne", "White Wine", "Red Wine", "Whiskey", "Cocktail", "Mocktail / Non-Alcoholic"]
    collectDanceSong: boolean; // "A Song That Gets You Dancing"
    whatsappHostNumber: string;
  };
}
```

---

## 8. Phased Implementation Plan & Roadmap

### Phase 1: Foundation, Design System & 16-Template Data Presets
* Initialize Next.js TypeScript project in `/Users/pavan/Build/Wedslash`.
* Set up fonts (*Playfair Display*, *Cormorant Garamond*, *Montserrat*, *Plus Jakarta Sans*, *Pinyon Script*), Atelier color tokens, and custom SVG illustrations (Ganesh Ji medallion, Bismillah calligraphy, Ik Onkar, hanging Marigold Toran strings, 3D corner roses, function scenes for Haldi/Mehendi/Sangeet/Pheras, and passport stamps).
* Build the Zustand store and rich pre-populated presets for all **16 Signature Templates** (including *Wine Velvet Royal Book*, *The Sacred Garden*, *Dolce Vita*, *Destination Love Boarding Pass*, *Blossom & Oud*, *Timeless Grace*, *Golden Secret*, *Petal Promise*, and *Captured Love*).

### Phase 2: Signature Interactive Mechanics Engine (M1 – M11)
* Build `VelvetBookGate.tsx` (3D wine-velvet book cover with gold border, Ganesh emblem, parallax roses, and camera zoom).
* Build `WaxEnvelopeGate.tsx` & `BoardingPassGate.tsx` (with `?guest=` name personalization).
* Build `TasselScrollReveal.tsx` (golden rod + hanging tassel pull-to-unroll Save the Date with animated finger prompt and petal/confetti burst).
* Build `ScratchThreeCircles.tsx` (3-circle Day | Month | Year HTML5 canvas foil scratch-off).
* Build `BrushPetalsReveal.tsx` (interactive scatterable rose petals covering the date) & `PolaroidDevelop.tsx` (tap-to-develop instant photo).
* Build `Swipeable3DCarousel.tsx` (3D coverflow card carousel with blurred neighbors for Wedding Festivities and Our Story).
* Build `IllustratedMapCard.tsx` (animated dashed route path, dropping pin, Get Directions & Copy Address buttons).
* Build `AudioAndToranLayer.tsx` (swinging top marigold strings, corner parallax roses, MP3 fade-in controller + YouTube "Our Song" button).

### Phase 3: Master Invitation Renderer Engine
* Assemble the continuous, mobile-first invitation experience combining the 8-part *AikaTheKedaar* flow and *Webgency* modular sections (First Page Arch Portrait with letter-by-letter blur-in names, Date Reveal, Countdown + Calendar, 3D Festivities Carousel, Grand Reception Blooming Card, Dress Code Ladies/Gents + Reserved Colors, Organizer & Gift Etiquette, Illustrated Location Map, and Full RSVP Modal).
* Ensure buttery-smooth performance on mobile and desktop with preloaded assets.

### Phase 4: Storefront, Pricing & Interactive Template Showcase (`/`, `/templates`)
* Build the luxury Wedslash storefront featuring an interactive hero stage where visitors can test the 3D Book, Tassel Scroll, Scratch Circles, and Petal Brush live.
* Build the 16-template filterable gallery with instant Mobile/Desktop preview modal, Webgency-style comparison/pricing cards, and FAQ accordion.

### Phase 5: Live Customizer Studio & Standalone ZIP Exporter (`/studio`)
* Build the 7-tab split-screen visual editor with real-time 60fps preview and state jump buttons (`Cover`, `First Page`, `Date Reveal`, `Festivities`, `RSVP`).
* Build the **Standalone HTML/ZIP Exporter** so users can download a ready-to-host `wedding-invite.zip` (`index.html`) for Netlify/Vercel OR publish directly to `wedslash.com/invite/[slug]`.

### Phase 6: Guest CRM, Personalized Link Generator & RSVP Suite (`/dashboard`, `/invite/[slug]`)
* Build the standalone guest route (`/invite/[slug]?guest=...`) with full RSVP form (Yes / No / Tell Later, Children names/ages, Drink selector, Food intolerances, Song request, WhatsApp sync, and QR pass).
* Build the Couple Dashboard with headcount analytics, drink & dietary charts, one-click WhatsApp personalized link sender, CSV/Google Sheets export, and printable QR code generator.

### Phase 7: Verification, Build Check & Visual QA
* Run full build/type verification and test all 16 templates, interactive canvas mechanics, ZIP export, and RSVP flows.
