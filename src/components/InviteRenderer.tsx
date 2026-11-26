"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Music, VolumeX, PlayCircle } from "lucide-react";
import ParticleCanvas from "./ParticleCanvas";
import BookGate from "./mechanics/BookGate";
import EnvelopeGate from "./mechanics/EnvelopeGate";
import RingBoxGate from "./mechanics/RingBoxGate";
import DiyaLampGate from "./mechanics/DiyaLampGate";
import BiometricBloomGate from "./mechanics/BiometricBloomGate";
import ConstellationGate from "./mechanics/ConstellationGate";
import TearPerforationGate from "./mechanics/TearPerforationGate";
import FrostWipeGate from "./mechanics/FrostWipeGate";
import MandalaDialGate from "./mechanics/MandalaDialGate";
import TasselScroll from "./mechanics/TasselScroll";
import ScratchCard from "./mechanics/ScratchCard";
import BrushPetalsReveal from "./mechanics/BrushPetalsReveal";
import PolaroidDevelop from "./mechanics/PolaroidDevelop";
import FunctionCarousel from "./mechanics/FunctionCarousel";
import StoryCarousel from "./mechanics/StoryCarousel";
import BoardingPass from "./mechanics/BoardingPass";
import ToranAndRoses from "./mechanics/ToranAndRoses";
import IllustratedMapCard from "./mechanics/IllustratedMapCard";
import RsvpForm from "./mechanics/RsvpForm";
import { CulturalEmblem } from "./icons/CulturalEmblems";
import AccessibleDialog from "./AccessibleDialog";
import { Gift, Phone, Shirt, Sparkles } from "lucide-react";
import { useInvite } from "@/store/useInvite";
import { getPresetConfig, LANGUAGE_COPY } from "@/lib/templates";
import { InviteAudioController, parseYoutubeId } from "@/lib/audioSynth";
import type { InvitationConfig, Template } from "@/lib/types";
import type { ThemePreset } from "./ThemeSelector";

// Layout variants
import { EditorialLayout } from "./layouts/EditorialLayout";
import { CinematicLayout } from "./layouts/CinematicLayout";
import { DarkCosmosLayout } from "./layouts/DarkCosmosLayout";
import { MinimalZenLayout } from "./layouts/MinimalZenLayout";

interface Props {
  template: Template;
  guest: string;
  customConfig?: InvitationConfig;
  embedded?: boolean;
  /** Active theme preset override — from ThemeSelector */
  themePreset?: ThemePreset | null;
}

function InviteRendererComponent({
  template,
  guest,
  customConfig,
  embedded = false,
  themePreset,
}: Props) {
  const storeCfg = useInvite((st) => st.config);
  const storeGuest = useInvite((st) => st.guestName);
  const cfg =
    customConfig ??
    (storeCfg.templateId === template.id ? storeCfg : getPresetConfig(template.id));

  const [muted, setMuted] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const audioRef = useRef<InviteAudioController | null>(null);

  const guestName = guest || storeGuest || "Honored Guest";
  const copy = LANGUAGE_COPY[cfg.language] ?? LANGUAGE_COPY.english;
  const ytId = parseYoutubeId(cfg.mechanics.youtubeSongUrl);

  // Merge theme preset overrides on top of template colors
  const tpl: Template = themePreset
    ? {
        ...template,
        primary: themePreset.primary,
        gold: themePreset.gold,
        bg: themePreset.bg,
        ink: themePreset.ink,
        secondary: themePreset.bg,
      }
    : template;

  useEffect(() => {
    audioRef.current = new InviteAudioController();
    return () => {
      audioRef.current?.stop();
    };
  }, []);

  const startPlayback = useCallback(() => {
    const ctrl = audioRef.current;
    if (!ctrl) return;
    if (cfg.mechanics.audioMode === "mp3" && cfg.mechanics.customMp3Url) {
      ctrl.startMp3(cfg.mechanics.customMp3Url);
    } else {
      ctrl.startSynth(cfg.mechanics.musicTrackId);
    }
    setMuted(false);
    setAudioStarted(true);
  }, [cfg.mechanics.audioMode, cfg.mechanics.customMp3Url, cfg.mechanics.musicTrackId]);

  const toggleMusic = useCallback(() => {
    if (cfg.mechanics.audioMode === "youtube" && ytId) {
      setYtOpen(true);
      return;
    }
    if (muted) {
      startPlayback();
    } else {
      audioRef.current?.stop();
      setMuted(true);
    }
  }, [cfg.mechanics.audioMode, muted, startPlayback, ytId]);

  const handleGateOpen = useCallback(() => {
    if (!audioStarted && cfg.mechanics.audioMode !== "youtube") {
      startPlayback();
    }
  }, [audioStarted, cfg.mechanics.audioMode, startPlayback]);

  const dt = new Date(cfg.couple.weddingDate);
  const dayStr = isNaN(dt.getTime()) ? "13" : String(dt.getDate()).padStart(2, "0");
  const monthStr = isNaN(dt.getTime())
    ? "FEB"
    : dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const yearStr = isNaN(dt.getTime()) ? "2027" : String(dt.getFullYear());

  const entryType = cfg.mechanics.entryType;
  const revealType = cfg.mechanics.dateRevealType;
  const layoutStyle = tpl.layoutStyle ?? "heritage";

  // ── BUILD THE GATE NODE ──────────────────────────────────────────────────────
  const GateNode = (
    <>
      {entryType === "boarding-pass" ? (
        <div className="flex min-h-[620px] flex-col items-center justify-center bg-[#0F2440] px-4 py-12 text-white">
          <p className="mb-4 font-ui text-[11px] uppercase tracking-[0.3em] text-[#F6E27A]">
            Boarding for {guestName}
          </p>
          <BoardingPass
            guestName={guestName}
            groom={cfg.couple.groomName}
            bride={cfg.couple.brideName}
            departureCode={cfg.location.departureCode}
            departureCity={cfg.location.departureCity}
            arrivalCode={cfg.location.arrivalCode}
            arrivalCity={cfg.location.arrivalCity}
            targetDate={cfg.couple.weddingDate}
            primary={tpl.primary}
            gold={tpl.gold}
            onOpen={handleGateOpen}
          />
          <p className="mt-5 font-ui text-[11px] uppercase tracking-[0.3em] text-white/60">
            Scroll to board ↓
          </p>
        </div>
      ) : entryType === "ring-box" ? (
        <RingBoxGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          tapLabel={cfg.language === "english" ? undefined : copy.tapSeal}
          onOpen={handleGateOpen}
        />
      ) : entryType === "diya-lamp" ? (
        <DiyaLampGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          tapLabel={cfg.language === "english" ? undefined : copy.tapSeal}
          onOpen={handleGateOpen}
        />
      ) : entryType === "palace-doors" ? (
        <EnvelopeGate
          variant="palace-doors"
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          venueTitle={cfg.location.venueTitle}
          city={cfg.location.city}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          tapLabel={copy.tapSeal}
          onOpen={handleGateOpen}
        />
      ) : entryType === "curtain-reveal" ? (
        <EnvelopeGate
          variant="curtain-reveal"
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          venueTitle={cfg.location.venueTitle}
          city={cfg.location.city}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          tapLabel={copy.tapSeal}
          onOpen={handleGateOpen}
        />
      ) : entryType === "biometric-bloom" ? (
        <BiometricBloomGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          onOpen={handleGateOpen}
        />
      ) : entryType === "constellation-trace" ? (
        <ConstellationGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          onOpen={handleGateOpen}
        />
      ) : entryType === "tear-perforation" ? (
        <TearPerforationGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          onOpen={handleGateOpen}
        />
      ) : entryType === "frost-wipe" ? (
        <FrostWipeGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          onOpen={handleGateOpen}
        />
      ) : entryType === "mandala-dial" ? (
        <MandalaDialGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          onOpen={handleGateOpen}
        />
      ) : entryType === "velvet-book" ? (
        <BookGate
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          groomParents={cfg.couple.groomParents}
          brideParents={cfg.couple.brideParents}
          guestName={guestName}
          sacredQuote={cfg.blessing.sacredQuote}
          inviteIntro={cfg.blessing.inviteIntroLine}
          symbol={cfg.blessing.enabled ? cfg.blessing.symbol : "none"}
          primary={tpl.primary}
          gold={tpl.gold}
          heroPhotoUrl={cfg.couple.heroPhotoUrl}
          kenBurnsEnabled={cfg.couple.kenBurnsEnabled}
          tapLabel={copy.tapBook}
          onOpen={handleGateOpen}
        />
      ) : (
        <EnvelopeGate
          variant={entryType}
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          monogram={cfg.couple.monogram}
          venueTitle={cfg.location.venueTitle}
          city={cfg.location.city}
          guestName={guestName}
          primary={tpl.primary}
          gold={tpl.gold}
          tapLabel={copy.tapSeal}
          onOpen={handleGateOpen}
        />
      )}
    </>
  );

  // ── BUILD THE DATE REVEAL NODE ───────────────────────────────────────────────
  const DateRevealNode = (
    <>
      {revealType === "pull-tassel-scroll" && (
        <TasselScroll
          dateLabel={cfg.couple.dateDisplayLabel}
          muhurat={cfg.couple.muhuratTime}
          target={cfg.couple.weddingDate}
          title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
          venue={cfg.location.venueTitle}
          symbol={cfg.blessing.enabled ? cfg.blessing.symbol : "none"}
          primary={tpl.primary}
          gold={tpl.gold}
          label={copy.saveTheDate}
        />
      )}
      {(revealType === "scratch-3-circles" || revealType === "scratch-heart") && (
        <ScratchCard
          variant={revealType === "scratch-heart" ? "heart" : "3-circles"}
          day={dayStr}
          month={monthStr}
          year={yearStr}
          venue={`${cfg.location.venueTitle} · ${cfg.couple.muhuratTime}`}
          target={cfg.couple.weddingDate}
          title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
          foil={tpl.id === "timeless-grace" ? "silver" : "gold"}
          primary={tpl.primary}
        />
      )}
      {revealType === "brush-petals" && (
        <BrushPetalsReveal
          dateLabel={cfg.couple.dateDisplayLabel}
          muhurat={cfg.couple.muhuratTime}
          venue={cfg.location.venueTitle}
          target={cfg.couple.weddingDate}
          title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
          primary={tpl.primary}
          gold={tpl.gold}
          petalColor={
            cfg.mechanics.particleType === "marigold-petals" ? "marigold" : "rose"
          }
        />
      )}
      {revealType === "polaroid-develop" && (
        <PolaroidDevelop
          groom={cfg.couple.groomName}
          bride={cfg.couple.brideName}
          dateLabel={cfg.couple.dateDisplayLabel}
          venue={`${cfg.location.venueTitle} · ${cfg.location.city}`}
          target={cfg.couple.weddingDate}
          title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
          primary={tpl.primary}
          gold={tpl.gold}
          imageUrl={cfg.couple.heroPhotoUrl || undefined}
        />
      )}
    </>
  );

  // ── MUSIC PILL (floating — shared across all layouts) ────────────────────────
  const MusicPill = (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={
        ytId
          ? "Open Our Song on YouTube"
          : muted
          ? "Play soundtrack"
          : "Mute soundtrack"
      }
      className={`${
        embedded
          ? "absolute right-3 bottom-3 @2xl:bottom-auto @2xl:top-3 z-40"
          : "fixed bottom-4 right-4 z-50"
      } inline-flex items-center gap-2 rounded-full bg-[#161412] px-4 py-2 font-ui text-xs font-semibold text-white shadow-xl transition-colors hover:bg-[#6E1F2F]`}
    >
      {ytId ? (
        <>
          <PlayCircle size={15} className="text-[#F6E27A]" /> Our Song ♪
        </>
      ) : muted ? (
        <>
          <VolumeX size={14} /> Sound Off
        </>
      ) : (
        <>
          <Music size={14} className="animate-pulse text-[#F6E27A]" /> Our Song ♪
        </>
      )}
    </button>
  );

  // ── YOUTUBE MODAL ────────────────────────────────────────────────────────────
  const YtModal = ytId ? (
    <AccessibleDialog
      open={ytOpen}
      onClose={() => setYtOpen(false)}
      title="Our Wedding Song"
      subtitle={`${cfg.couple.groomName} & ${cfg.couple.brideName}`}
    >
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          title="Couple's wedding song on YouTube"
          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </AccessibleDialog>
  ) : null;

  // ── DISPATCH TO LAYOUT VARIANT ───────────────────────────────────────────────
  const sharedLayoutProps = {
    cfg,
    template: tpl,
    guestName,
    copy,
    Gate: GateNode,
    DateReveal: DateRevealNode,
  };

  if (layoutStyle === "editorial") {
    return (
      <div className="relative">
        {/* Toran for Indian-category templates */}
        <ToranAndRoses
          toranEnabled={cfg.mechanics.marigoldToranEnabled}
          rosesEnabled={cfg.mechanics.cornerParallaxRoses}
          primary={tpl.primary}
          gold={tpl.gold}
        />
        {MusicPill}
        <EditorialLayout {...sharedLayoutProps} />
        {YtModal}
      </div>
    );
  }

  if (layoutStyle === "cinematic") {
    return (
      <div className="relative">
        {MusicPill}
        <CinematicLayout {...sharedLayoutProps} />
        {YtModal}
      </div>
    );
  }

  if (layoutStyle === "dark-cosmos") {
    return (
      <div className="relative">
        {MusicPill}
        <DarkCosmosLayout {...sharedLayoutProps} />
        {YtModal}
      </div>
    );
  }

  if (layoutStyle === "minimal-zen") {
    return (
      <div className="relative">
        {MusicPill}
        <MinimalZenLayout {...sharedLayoutProps} />
        {YtModal}
      </div>
    );
  }

  // ── HERITAGE LAYOUT (default — original arch card) ───────────────────────────
  return (
    <div
      className="@container relative overflow-x-clip"
      style={{ background: tpl.bg, color: tpl.ink }}
    >
      {/* Swinging Marigold Toran & Corner Roses */}
      <ToranAndRoses
        toranEnabled={cfg.mechanics.marigoldToranEnabled}
        rosesEnabled={cfg.mechanics.cornerParallaxRoses}
        primary={tpl.primary}
        gold={tpl.gold}
      />

      {MusicPill}

      {/* ENTRY GATE */}
      <section
        id="invite-sec-gate"
        className={`relative min-h-[min(580px,82dvh)] @2xl:min-h-[640px] overflow-hidden ${
          cfg.mechanics.marigoldToranEnabled ? "pt-12 @2xl:pt-14" : ""
        }`}
      >
        {GateNode}
      </section>

      {/* COUPLE HERO — Mobile centered vertical editorial; Desktop expansive wide monogram crest + couple spread */}
      <section
        id="invite-sec-hero"
        className="relative overflow-hidden px-5 py-14 @2xl:px-12 @2xl:py-20 text-center paper-grain"
      >
        <ParticleCanvas type={cfg.mechanics.particleType} density={20} />
        <div className="relative mx-auto max-w-md @2xl:max-w-4xl">
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
            <div
              className="mx-auto grid h-14 w-14 @2xl:h-16 @2xl:w-16 place-items-center rounded-full border-2 bg-white shadow"
              style={{ borderColor: tpl.gold }}
            >
              <CulturalEmblem
                symbol={cfg.blessing.symbol}
                color={tpl.primary}
                size={30}
              />
            </div>
          )}
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.3em] opacity-70">
            {copy.together}
          </p>

          <div className="mt-4 flex flex-col items-center @2xl:grid @2xl:grid-cols-[1fr_auto_1fr] @2xl:items-center @2xl:gap-8">
            <div className="@2xl:text-right">
              <h1
                className="font-display break-words text-4xl sm:text-5xl @2xl:text-6xl font-bold leading-[1.04]"
                style={{ color: tpl.primary }}
              >
                {cfg.couple.groomName}
              </h1>
              <p className="font-ui mt-1.5 text-[11px] uppercase tracking-[0.2em] opacity-70">
                {cfg.couple.groomParents}
              </p>
            </div>

            <p className="font-script my-1.5 @2xl:my-0 text-5xl @2xl:text-6xl" style={{ color: tpl.gold }}>
              &amp;
            </p>

            <div className="@2xl:text-left">
              <h1
                className="font-display break-words text-4xl sm:text-5xl @2xl:text-6xl font-bold leading-[1.04]"
                style={{ color: tpl.primary }}
              >
                {cfg.couple.brideName}
              </h1>
              <p className="font-ui mt-1.5 text-[11px] uppercase tracking-[0.2em] opacity-70">
                {cfg.couple.brideParents}
              </p>
            </div>
          </div>

          <p className="font-editorial mx-auto mt-6 max-w-xl text-lg sm:text-xl @2xl:text-2xl italic opacity-80">
            {cfg.couple.heroSubtitle} · {guestName} · {cfg.couple.hashtag}
          </p>
        </div>
      </section>

      {/* DATE REVEAL */}
      <section
        id="invite-sec-date"
        className="relative px-2 py-14"
        style={{ background: `${tpl.primary}0D` }}
      >
        {DateRevealNode}
      </section>

      {/* FUNCTIONS 3D CAROUSEL */}
      <section id="invite-sec-functions" className="py-14">
        <FunctionCarousel functions={cfg.functions} heading={copy.festivities} />
      </section>

      {/* OUR STORY 3D PHOTO STACK */}
      {cfg.storyCarousel.length > 0 && (
        <section
          className="py-14"
          style={{ background: `${tpl.primary}08` }}
        >
          <StoryCarousel
            slides={cfg.storyCarousel}
            heading={copy.story}
            primary={tpl.primary}
            gold={tpl.gold}
          />
        </section>
      )}

      {/* GRAND RECEPTION + DRESS CODE / ETIQUETTE */}
      <div className="mx-auto max-w-md px-4 py-8 @2xl:grid @2xl:max-w-5xl @2xl:grid-cols-2 @2xl:items-stretch @2xl:gap-8 @2xl:px-10 @2xl:py-14">
        <section className="flex">
          <div
            className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl p-7 text-center text-white shadow-xl"
            style={{
              background: `linear-gradient(155deg, ${tpl.primary}, #161412)`,
              border: `1px solid ${tpl.gold}66`,
            }}
          >
            <Sparkles size={22} className="mx-auto" style={{ color: tpl.gold }} />
            <p
              className="font-ui mt-2 text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{ color: tpl.gold }}
            >
              Finale Celebration
            </p>
            <h3 className="font-display mt-1 text-3xl @2xl:text-4xl font-bold">
              {cfg.functions[cfg.functions.length - 1]?.name ?? "Grand Reception"}
            </h3>
            <p className="font-editorial mt-2 text-lg @2xl:text-xl italic text-white/80">
              {cfg.functions[cfg.functions.length - 1]?.dayAndDate} ·{" "}
              {cfg.functions[cfg.functions.length - 1]?.time}
            </p>
            <p className="font-ui mt-1.5 text-xs uppercase tracking-[0.2em] text-white/65">
              {cfg.functions[cfg.functions.length - 1]?.venueName ??
                cfg.location.venueTitle}
            </p>
          </div>
        </section>

        <section className="mt-6 flex @2xl:mt-0">
          <div
            className="w-full rounded-3xl border p-6 text-center shadow-sm"
            style={{ borderColor: `${tpl.gold}55`, background: "#FFFFFF" }}
          >
            <Shirt size={22} className="mx-auto" style={{ color: tpl.primary }} />
            <h3 className="font-display mt-2 text-2xl font-bold text-[#161412]">
              {copy.dressCode}
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FAF7F2] p-3.5 text-[#161412]">
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: tpl.primary }}
                >
                  Ladies
                </p>
                <p className="mt-1 text-[13px] leading-relaxed">
                  {cfg.etiquetteAndDetails.ladiesDressNote}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FAF7F2] p-3.5 text-[#161412]">
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: tpl.primary }}
                >
                  Gentlemen
                </p>
                <p className="mt-1 text-[13px] leading-relaxed">
                  {cfg.etiquetteAndDetails.gentlemenDressNote}
                </p>
              </div>
            </div>
            {cfg.etiquetteAndDetails.reservedColorsNote && (
              <p className="font-ui mt-3 rounded-2xl bg-[#6E1F2F]/8 px-4 py-2.5 text-xs font-medium text-[#6E1F2F]">
                {cfg.etiquetteAndDetails.reservedColorsNote}
              </p>
            )}
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#FAF7F2] p-3.5 text-left text-[13px] text-[#161412]">
              <Gift size={16} className="mt-0.5 shrink-0" style={{ color: tpl.primary }} />
              <p>
                <strong>Gift note:</strong> {cfg.etiquetteAndDetails.giftPreferenceNote}
              </p>
            </div>
            <a
              href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`}
              className="font-ui mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold underline"
              style={{ color: tpl.primary }}
            >
              <Phone size={13} /> Wedding organizer:{" "}
              {cfg.etiquetteAndDetails.organizerName} ·{" "}
              {cfg.etiquetteAndDetails.organizerPhone}
            </a>
          </div>
        </section>
      </div>

      {/* VENUE ROUTE + RSVP LOUNGE */}
      <div
        className="px-4 py-12 @2xl:px-10 @2xl:py-16"
        style={{ background: `${tpl.primary}0D` }}
      >
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 @2xl:max-w-5xl @2xl:grid-cols-[0.95fr_1.05fr] @2xl:items-start">
          <section id="invite-sec-map">
            <IllustratedMapCard
              venueTitle={cfg.location.venueTitle}
              fullAddress={cfg.location.fullAddress}
              city={cfg.location.city}
              googleMapsUrl={cfg.location.googleMapsUrl}
              primary={tpl.primary}
              gold={tpl.gold}
              heading={copy.venue}
            />
          </section>

          <section id="invite-sec-rsvp">
            <RsvpForm
              guestName={guestName}
              inviteSlug={cfg.slug}
              hostPhone={cfg.rsvpConfig.whatsappHostNumber}
              deadlineText={cfg.rsvpConfig.deadlineText}
              allowTellLater={cfg.rsvpConfig.allowTellLater}
              collectChildrenDetails={cfg.rsvpConfig.collectChildrenDetails}
              collectDietary={cfg.rsvpConfig.collectDietary}
              collectDrinkPreference={cfg.rsvpConfig.collectDrinkPreference}
              drinkOptions={cfg.rsvpConfig.drinkOptions}
              collectDanceSong={cfg.rsvpConfig.collectDanceSong}
              congratulationsPrompt={cfg.etiquetteAndDetails.congratulationsPrompt}
              heading={copy.rsvpHeading}
              subHeading={copy.rsvpSub}
              primary={tpl.primary}
            />
          </section>
        </div>
      </div>

      {/* CLOSING */}
      <section
        className="px-6 pt-16 pb-24 @2xl:pb-16 text-center text-white"
        style={{
          background: `linear-gradient(170deg, ${tpl.primary}, #161412)`,
        }}
      >
        {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
          <div className="mb-3 flex justify-center">
            <CulturalEmblem symbol={cfg.blessing.symbol} color={tpl.gold} size={34} />
          </div>
        ) : (
          <p className="font-display text-xl" style={{ color: tpl.gold }}>
            ✦
          </p>
        )}
        <h2 className="font-display mt-2 text-4xl font-bold">{copy.closing}</h2>
        <p className="font-editorial mt-2 text-lg italic text-white/75">
          {cfg.couple.closingFamilyLine}
        </p>
        <p className="font-ui mt-4 text-xs uppercase tracking-[0.3em] text-white/50">
          {cfg.couple.hashtag}
        </p>
        <p className="font-ui mt-6 text-[10px] uppercase tracking-[0.24em] text-white/35">
          Crafted with love on Wedslash
        </p>
      </section>

      {YtModal}
    </div>
  );
}

const InviteRenderer = memo(InviteRendererComponent);
export default InviteRenderer;
