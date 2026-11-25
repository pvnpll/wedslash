"use client";
import { useEffect, useRef, useState } from "react";
import { Music, VolumeX, Gift, Phone, Shirt, Sparkles, PlayCircle } from "lucide-react";
import ParticleCanvas from "./ParticleCanvas";
import BookGate from "./mechanics/BookGate";
import EnvelopeGate from "./mechanics/EnvelopeGate";
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
import { useInvite } from "@/store/useInvite";
import { getPresetConfig, LANGUAGE_COPY } from "@/lib/templates";
import { InviteAudioController, parseYoutubeId } from "@/lib/audioSynth";
import type { InvitationConfig, Template } from "@/lib/types";

interface Props {
  template: Template;
  guest: string;
  customConfig?: InvitationConfig;
  embedded?: boolean;
}

export default function InviteRenderer({
  template,
  guest,
  customConfig,
  embedded = false,
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

  useEffect(() => {
    audioRef.current = new InviteAudioController();
    return () => {
      audioRef.current?.stop();
    };
  }, []);

  const startPlayback = () => {
    const ctrl = audioRef.current;
    if (!ctrl) return;
    if (cfg.mechanics.audioMode === "mp3" && cfg.mechanics.customMp3Url) {
      ctrl.startMp3(cfg.mechanics.customMp3Url);
    } else {
      ctrl.startSynth(cfg.mechanics.musicTrackId);
    }
    setMuted(false);
    setAudioStarted(true);
  };

  const toggleMusic = () => {
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
  };

  const handleGateOpen = () => {
    if (!audioStarted && cfg.mechanics.audioMode !== "youtube") {
      startPlayback();
    }
  };

  const dt = new Date(cfg.couple.weddingDate);
  const dayStr = isNaN(dt.getTime())
    ? "13"
    : String(dt.getDate()).padStart(2, "0");
  const monthStr = isNaN(dt.getTime())
    ? "FEB"
    : dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const yearStr = isNaN(dt.getTime()) ? "2027" : String(dt.getFullYear());

  const entryType = cfg.mechanics.entryType;
  const revealType = cfg.mechanics.dateRevealType;

  return (
    <div
      className="relative"
      style={{ background: template.bg, color: template.ink }}
    >
      {/* Swinging Marigold Toran & Corner Parallax Roses */}
      <ToranAndRoses
        toranEnabled={cfg.mechanics.marigoldToranEnabled}
        rosesEnabled={cfg.mechanics.cornerParallaxRoses}
        primary={template.primary}
        gold={template.gold}
      />

      {/* Floating Music / Our Song pill */}
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
          embedded ? "absolute right-3 top-3 z-40" : "fixed bottom-5 right-5 z-50"
        } inline-flex items-center gap-2 rounded-full bg-[#161412] px-4 py-2 font-ui text-xs font-semibold text-white shadow-xl transition hover:bg-[#6E1F2F]`}
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

      {/* ENTRY GATE */}
      <section
        id="invite-sec-gate"
        className="relative min-h-[620px] overflow-hidden"
      >
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
              primary={template.primary}
              gold={template.gold}
              onOpen={handleGateOpen}
            />
            <p className="mt-5 font-ui text-[11px] uppercase tracking-[0.3em] text-white/60">
              Scroll to board ↓
            </p>
          </div>
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
            primary={template.primary}
            gold={template.gold}
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
            primary={template.primary}
            gold={template.gold}
            tapLabel={copy.tapSeal}
            onOpen={handleGateOpen}
          />
        )}
      </section>

      {/* COUPLE HERO */}
      <section
        id="invite-sec-hero"
        className="relative overflow-hidden px-6 py-16 text-center paper-grain"
      >
        <ParticleCanvas type={cfg.mechanics.particleType} density={26} />
        <div className="relative mx-auto max-w-md">
          {cfg.blessing.enabled && cfg.blessing.symbol !== "none" && (
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 bg-white shadow"
              style={{ borderColor: template.gold }}
            >
              <CulturalEmblem
                symbol={cfg.blessing.symbol}
                color={template.primary}
                size={30}
              />
            </div>
          )}
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.3em] opacity-70">
            {copy.together}
          </p>
          <h1
            className="font-display mt-2 text-5xl font-bold leading-[1.04] sm:text-6xl"
            style={{ color: template.primary }}
          >
            {cfg.couple.groomName}
          </h1>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
            {cfg.couple.groomParents}
          </p>
          <p className="font-script my-1 text-5xl" style={{ color: template.gold }}>
            &amp;
          </p>
          <h1
            className="font-display text-5xl font-bold leading-[1.04] sm:text-6xl"
            style={{ color: template.primary }}
          >
            {cfg.couple.brideName}
          </h1>
          <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.2em] opacity-70">
            {cfg.couple.brideParents}
          </p>
          <p className="font-editorial mt-4 text-xl italic opacity-80">
            {cfg.couple.heroSubtitle} · {guestName} · {cfg.couple.hashtag}
          </p>
        </div>
      </section>

      {/* DATE REVEAL */}
      <section
        id="invite-sec-date"
        className="relative px-2 py-14"
        style={{ background: `${template.primary}0D` }}
      >
        {revealType === "pull-tassel-scroll" && (
          <TasselScroll
            dateLabel={cfg.couple.dateDisplayLabel}
            muhurat={cfg.couple.muhuratTime}
            target={cfg.couple.weddingDate}
            title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
            venue={cfg.location.venueTitle}
            symbol={cfg.blessing.enabled ? cfg.blessing.symbol : "none"}
            primary={template.primary}
            gold={template.gold}
            label={copy.saveTheDate}
          />
        )}
        {(revealType === "scratch-3-circles" ||
          revealType === "scratch-heart") && (
          <ScratchCard
            variant={revealType === "scratch-heart" ? "heart" : "3-circles"}
            day={dayStr}
            month={monthStr}
            year={yearStr}
            venue={`${cfg.location.venueTitle} · ${cfg.couple.muhuratTime}`}
            target={cfg.couple.weddingDate}
            title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
            foil={template.id === "timeless-grace" ? "silver" : "gold"}
            primary={template.primary}
          />
        )}
        {revealType === "brush-petals" && (
          <BrushPetalsReveal
            dateLabel={cfg.couple.dateDisplayLabel}
            muhurat={cfg.couple.muhuratTime}
            venue={cfg.location.venueTitle}
            target={cfg.couple.weddingDate}
            title={`${cfg.couple.groomName} weds ${cfg.couple.brideName}`}
            primary={template.primary}
            gold={template.gold}
            petalColor={
              cfg.mechanics.particleType === "marigold-petals"
                ? "marigold"
                : "rose"
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
            primary={template.primary}
            gold={template.gold}
            imageUrl={cfg.couple.heroPhotoUrl || undefined}
          />
        )}
      </section>

      {/* FUNCTIONS 3D CAROUSEL */}
      <section id="invite-sec-functions" className="py-14">
        <FunctionCarousel functions={cfg.functions} heading={copy.festivities} />
      </section>

      {/* OUR STORY 3D PHOTO STACK */}
      {cfg.storyCarousel.length > 0 && (
        <section
          className="py-14"
          style={{ background: `${template.primary}08` }}
        >
          <StoryCarousel
            slides={cfg.storyCarousel}
            heading={copy.story}
            primary={template.primary}
            gold={template.gold}
          />
        </section>
      )}

      {/* GRAND RECEPTION FEATURE CARD */}
      <section className="mx-auto max-w-md px-6 py-8">
        <div
          className="relative overflow-hidden rounded-3xl p-7 text-center text-white shadow-xl"
          style={{
            background: `linear-gradient(155deg, ${template.primary}, #161412)`,
            border: `1px solid ${template.gold}66`,
          }}
        >
          <Sparkles
            size={20}
            className="mx-auto"
            style={{ color: template.gold }}
          />
          <p
            className="font-ui mt-2 text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: template.gold }}
          >
            Finale Celebration
          </p>
          <h3 className="font-display mt-1 text-3xl font-bold">
            {cfg.functions[cfg.functions.length - 1]?.name ?? "Grand Reception"}
          </h3>
          <p className="font-editorial mt-1.5 text-lg italic text-white/80">
            {cfg.functions[cfg.functions.length - 1]?.dayAndDate} ·{" "}
            {cfg.functions[cfg.functions.length - 1]?.time}
          </p>
          <p className="font-ui mt-1 text-xs uppercase tracking-[0.2em] text-white/65">
            {cfg.functions[cfg.functions.length - 1]?.venueName ??
              cfg.location.venueTitle}
          </p>
        </div>
      </section>

      {/* DRESS CODE + ETIQUETTE */}
      <section className="mx-auto max-w-md px-6 py-8">
        <div
          className="rounded-3xl border p-6 text-center shadow-sm"
          style={{ borderColor: `${template.gold}55`, background: "#FFFFFF" }}
        >
          <Shirt
            size={22}
            className="mx-auto"
            style={{ color: template.primary }}
          />
          <h3 className="font-display mt-2 text-2xl font-bold text-[#161412]">
            {copy.dressCode}
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl bg-[#FAF7F2] p-3.5 text-[#161412]">
              <p
                className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: template.primary }}
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
                style={{ color: template.primary }}
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
            <Gift
              size={16}
              className="mt-0.5 shrink-0"
              style={{ color: template.primary }}
            />
            <p>
              <strong>Gift note:</strong>{" "}
              {cfg.etiquetteAndDetails.giftPreferenceNote}
            </p>
          </div>
          <a
            href={`tel:${cfg.etiquetteAndDetails.organizerPhone}`}
            className="font-ui mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline"
            style={{ color: template.primary }}
          >
            <Phone size={13} /> Wedding organizer:{" "}
            {cfg.etiquetteAndDetails.organizerName} ·{" "}
            {cfg.etiquetteAndDetails.organizerPhone}
          </a>
        </div>
      </section>

      {/* ILLUSTRATED ROUTE MAP */}
      <section id="invite-sec-map" className="py-10">
        <IllustratedMapCard
          venueTitle={cfg.location.venueTitle}
          fullAddress={cfg.location.fullAddress}
          city={cfg.location.city}
          googleMapsUrl={cfg.location.googleMapsUrl}
          primary={template.primary}
          gold={template.gold}
          heading={copy.venue}
        />
      </section>

      {/* RSVP */}
      <section
        id="invite-sec-rsvp"
        className="py-12"
        style={{ background: `${template.primary}0D` }}
      >
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
          primary={template.primary}
        />
      </section>

      {/* CLOSING */}
      <section
        className="px-6 py-16 text-center text-white"
        style={{
          background: `linear-gradient(170deg, ${template.primary}, #161412)`,
        }}
      >
        {cfg.blessing.enabled && cfg.blessing.symbol !== "none" ? (
          <div className="mb-3 flex justify-center">
            <CulturalEmblem
              symbol={cfg.blessing.symbol}
              color={template.gold}
              size={34}
            />
          </div>
        ) : (
          <p className="font-display text-xl" style={{ color: template.gold }}>
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

      {/* YouTube Song Modal */}
      {ytId && (
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
      )}
    </div>
  );
}
