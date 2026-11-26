"use client";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, Copy, CheckCheck, AlertCircle } from "lucide-react";
import QrSvg from "@/components/QrSvg";
import { useGuestCrm } from "@/store/useGuestCrm";

const DEFAULT_DRINKS = [
  "Champagne",
  "White Wine",
  "Red Wine",
  "Whiskey",
  "Cocktail",
  "Mocktail",
];

interface Props {
  guestName: string;
  inviteSlug?: string;
  hostPhone?: string;
  deadlineText?: string;
  allowTellLater?: boolean;
  collectChildrenDetails?: boolean;
  collectDietary?: boolean;
  collectDrinkPreference?: boolean;
  drinkOptions?: string[];
  collectDanceSong?: boolean;
  congratulationsPrompt?: string;
  heading?: string;
  subHeading?: string;
  compact?: boolean;
  primary?: string;
}

export default function RsvpForm({
  guestName,
  inviteSlug = "wine-velvet-book",
  hostPhone = "919876543210",
  deadlineText = "Kindly respond before 20 January 2027",
  allowTellLater = true,
  collectChildrenDetails = true,
  collectDietary = true,
  collectDrinkPreference = true,
  drinkOptions = DEFAULT_DRINKS,
  collectDanceSong = true,
  congratulationsPrompt = "Leave a blessing or funny story for the toast",
  heading = "Will you join us?",
  subHeading = "Confirm Your Attendance",
  compact = false,
  primary = "#6E1F2F",
}: Props) {
  const upsertRsvp = useGuestCrm((st) => st.upsertRsvp);
  const nameId = useId();
  const nameErrorId = useId();
  const dietId = useId();
  const kidsId = useId();
  const songId = useId();
  const noteId = useId();

  const [attendance, setAttendance] = useState<"yes" | "no" | "later" | "">("");
  const [name, setName] = useState(guestName);
  const [count, setCount] = useState(2);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [diet, setDiet] = useState("");
  const [song, setSong] = useState("");
  const [kids, setKids] = useState("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDrink = (d: string) =>
    setDrinks((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  const cleanPhone = hostPhone.replace(/[^\d]/g, "") || "919876543210";

  const waLink = () => {
    const msg = `Hello! This is ${name || guestName}.\nRSVP: ${
      attendance || "Not selected yet"
    }\nGuests: ${attendance === "no" ? 0 : count}\nDrinks: ${
      drinks.join(", ") || "—"
    }\nDietary: ${diet || "—"}\nChildren: ${kids || "—"}\nSong request: ${
      song || "—"
    }\nNote: ${note || "—"}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name so the couple knows who responded.");
      document.getElementById(nameId)?.focus();
      return;
    }
    if (!attendance) {
      setErrorMsg("Please select whether you can join us (or tell us later).");
      return;
    }
    setErrorMsg("");
    upsertRsvp({
      inviteSlug,
      name: name.trim(),
      group: "Online RSVP",
      status: attendance,
      count: attendance === "no" ? 0 : count,
      children: kids.trim(),
      drinks,
      diet: diet.trim(),
      song: song.trim(),
      note: note.trim(),
    });
    setSent(true);
  };

  const passCode = `WS-${Math.abs(
    ((name || guestName).split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) * 7919) %
      8999 +
      1000
  )}`;

  const passPayload = `WEDSLASH|${inviteSlug}|${passCode}|${name || guestName}|${attendance}|${
    attendance === "no" ? 0 : count
  }`;

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        role="status"
        aria-live="polite"
        className={`mx-auto w-full ${compact ? "" : "max-w-md @2xl:max-w-none"} rounded-3xl bg-[#161412] p-6 sm:p-8 text-center text-white`}
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#2E7D32]">
          <Check size={26} />
        </span>
        <h3 className="font-display mt-4 text-3xl font-bold">
          Thank you, {name || guestName}!
        </h3>
        <p className="font-ui mt-2 text-sm text-white/70">
          Your RSVP is saved directly to the Couple Dashboard. Show this pass at the venue.
        </p>
        <div className="mx-auto mt-5 max-w-[230px] rounded-2xl bg-white p-4 text-[#161412]">
          <QrSvg
            value={passPayload}
            size={140}
            className="mx-auto"
            label={`VIP Wedding Pass QR code for ${name || guestName}`}
          />
          <p className="font-ui mt-2 text-[11px] font-bold uppercase tracking-[0.2em]">
            VIP Wedding Pass
          </p>
          <p className="font-display text-lg font-bold">
            {attendance === "later"
              ? "Tentative"
              : attendance === "yes"
              ? "Attending"
              : "Warm Blessings"}
          </p>
          <p className="font-ui text-xs text-[#6E655F]">
            {attendance === "no" ? "0 guests" : `${count} guest${count > 1 ? "s" : ""}`} ·{" "}
            {passCode}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="font-ui inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}{" "}
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-ui rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-white/20"
          >
            Edit RSVP
          </button>
        </div>
      </motion.div>
    );
  }

  const options = [
    { v: "yes" as const, l: "Joyfully accepts" },
    { v: "no" as const, l: "Regretfully declines" },
    ...(allowTellLater ? [{ v: "later" as const, l: "Tell you later" }] : []),
  ];

  return (
    <div className={`mx-auto w-full ${compact ? "" : "max-w-md @2xl:max-w-none @2xl:px-0"} px-4 sm:px-6`}>
      <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6E655F]">
        {subHeading}
      </p>
      <h3 className="font-display mt-1 text-center text-3xl font-bold">{heading}</h3>
      <p className="font-ui mt-1 text-center text-xs text-[#6E655F]">{deadlineText}</p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 space-y-4 rounded-3xl border hairline bg-white p-4 sm:p-5 shadow-sm"
      >
        <div>
          <label
            htmlFor={nameId}
            className="font-ui block text-xs font-bold uppercase tracking-[0.16em]"
          >
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id={nameId}
            name="guestName"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            aria-describedby={!name.trim() && errorMsg ? nameErrorId : undefined}
            aria-invalid={!name.trim() && Boolean(errorMsg)}
            placeholder="Full name or family"
            className="ws-field font-ui mt-1.5 min-h-[44px] w-full rounded-xl border hairline bg-[#FAF7F2] px-4 py-2.5 text-base outline-none focus:border-[#6E1F2F]"
          />
          <p id={nameErrorId} className="ws-error font-ui mt-1 text-xs text-[#b91c1c]">
            Error: Enter your full name or family name.
          </p>
        </div>

        <fieldset>
          <legend className="font-ui text-xs font-bold uppercase tracking-[0.16em]">
            Will you come? <span aria-hidden="true">*</span>
          </legend>
          <div className={`mt-2 grid gap-2 ${options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {options.map((o) => {
              const checked = attendance === o.v;
              return (
                <label
                  key={o.v}
                  className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-center font-ui text-xs font-semibold transition ${
                    checked
                      ? "text-white shadow"
                      : "hairline bg-[#FAF7F2] hover:border-[#6E1F2F]/40"
                  }`}
                  style={
                    checked
                      ? { background: primary, borderColor: primary }
                      : undefined
                  }
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={o.v}
                    checked={checked}
                    onChange={() => {
                      setAttendance(o.v);
                      if (errorMsg) setErrorMsg("");
                    }}
                    className="visually-hidden"
                  />
                  <span>{o.l}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <AnimatePresence>
          {attendance === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-ui text-xs font-bold uppercase tracking-[0.16em]">
                  Guests attending
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease guest count"
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full border hairline text-lg"
                  >
                    −
                  </button>
                  <span className="font-display text-xl font-bold tabular-nums">
                    {count}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase guest count"
                    onClick={() => setCount(Math.min(12, count + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full border hairline text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {collectDrinkPreference && (
                <fieldset>
                  <legend className="font-ui text-xs font-bold uppercase tracking-[0.16em]">
                    Drink preference
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {drinkOptions.map((d) => {
                      const active = drinks.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleDrink(d)}
                          className={`rounded-full border px-3.5 py-1.5 font-ui text-xs font-medium transition ${
                            active
                              ? "border-[#6E1F2F] bg-[#6E1F2F]/10 text-[#6E1F2F]"
                              : "hairline text-[#161412]/70"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {(collectDietary || collectChildrenDetails) && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {collectDietary && (
                    <div>
                      <label
                        htmlFor={dietId}
                        className="font-ui block text-xs font-bold uppercase tracking-[0.16em]"
                      >
                        Dietary needs
                      </label>
                      <input
                        id={dietId}
                        name="dietary"
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        placeholder="Veg / Jain / allergies"
                        className="font-ui mt-1.5 min-h-[44px] w-full rounded-xl border hairline bg-[#FAF7F2] px-3 py-2 text-sm outline-none focus:border-[#6E1F2F]"
                      />
                    </div>
                  )}
                  {collectChildrenDetails && (
                    <div>
                      <label
                        htmlFor={kidsId}
                        className="font-ui block text-xs font-bold uppercase tracking-[0.16em]"
                      >
                        Children (names, ages)
                      </label>
                      <input
                        id={kidsId}
                        name="children"
                        value={kids}
                        onChange={(e) => setKids(e.target.value)}
                        placeholder="e.g. Aarav, 6"
                        className="font-ui mt-1.5 min-h-[44px] w-full rounded-xl border hairline bg-[#FAF7F2] px-3 py-2 text-sm outline-none focus:border-[#6E1F2F]"
                      />
                    </div>
                  )}
                </div>
              )}

              {collectDanceSong && (
                <div>
                  <label
                    htmlFor={songId}
                    className="font-ui block text-xs font-bold uppercase tracking-[0.16em]"
                  >
                    A song that gets you dancing
                  </label>
                  <input
                    id={songId}
                    name="danceSong"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    placeholder="DJ request…"
                    className="font-ui mt-1.5 min-h-[44px] w-full rounded-xl border hairline bg-[#FAF7F2] px-4 py-2 text-sm outline-none focus:border-[#6E1F2F]"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label
            htmlFor={noteId}
            className="font-ui block text-xs font-bold uppercase tracking-[0.16em]"
          >
            Blessing or toast note
          </label>
          <input
            id={noteId}
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={congratulationsPrompt}
            className="font-ui mt-1.5 min-h-[44px] w-full rounded-xl border hairline bg-[#FAF7F2] px-4 py-2 text-sm outline-none focus:border-[#6E1F2F]"
          />
        </div>

        <div aria-live="polite" className="min-h-[20px]">
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                key="rsvp-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 font-ui text-xs font-semibold text-[#b91c1c]"
              >
                <AlertCircle size={14} className="shrink-0" /> {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
          <button
            type="submit"
            className="font-ui min-h-[46px] rounded-full bg-[#161412] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#6E1F2F]"
          >
            Submit RSVP
          </button>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="font-ui inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-95"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
