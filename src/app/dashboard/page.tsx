"use client";
import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Check,
  X,
  Clock,
  Plus,
  Copy,
  CheckCheck,
  MessageCircle,
  Download,
  Music,
  UtensilsCrossed,
  QrCode,
  Trash2,
  Wine,
  Baby,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useGuestCrm } from "@/store/useGuestCrm";
import { useInvite } from "@/store/useInvite";
import type { GuestRsvp } from "@/lib/types";
import AccessibleDialog from "@/components/AccessibleDialog";
import QrSvg from "@/components/QrSvg";
import { qrToSvgMarkup } from "@/lib/qr";
import { useClientOrigin } from "@/lib/useClientOrigin";

function csvCell(val: string | number): string {
  const s = String(val ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export default function DashboardPage() {
  const { guests, hydrate, addGuest, updateStatus, removeGuest, resetDemo } =
    useGuestCrm();
  const { config, hydrateFromStorage } = useInvite();

  const [name, setName] = useState("");
  const [group, setGroup] = useState("Groom's Friends");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "yes" | "later" | "no">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const origin = useClientOrigin();

  const tableCaptionId = useId();
  const addInputId = useId();
  const groupSelectId = useId();

  useEffect(() => {
    hydrate();
    hydrateFromStorage();
  }, [hydrate, hydrateFromStorage]);

  const metrics = useMemo(() => {
    const yes = guests.filter((g) => g.status === "yes");
    const no = guests.filter((g) => g.status === "no");
    const later = guests.filter((g) => g.status === "later");
    const headcount = yes.reduce((a, g) => a + g.count, 0);

    const dietMap = new Map<string, number>();
    const drinkMap = new Map<string, number>();
    const songs: string[] = [];
    const kids: string[] = [];

    for (const g of yes) {
      if (g.diet && g.diet !== "—") {
        const key = g.diet.trim();
        dietMap.set(key, (dietMap.get(key) ?? 0) + Math.max(1, g.count));
      }
      for (const d of g.drinks) {
        drinkMap.set(d, (drinkMap.get(d) ?? 0) + 1);
      }
      if (g.song && g.song !== "—") songs.push(`${g.song} (${g.name})`);
      if (g.children) kids.push(`${g.children} — ${g.name}`);
    }

    return {
      yes,
      no,
      later,
      headcount,
      diets: Array.from(dietMap.entries()),
      drinks: Array.from(drinkMap.entries()).sort((a, b) => b[1] - a[1]),
      songs,
      kids,
    };
  }, [guests]);

  const shown = guests.filter((g) => {
    const matchesStatus = filter === "all" || g.status === filter;
    const matchesText = (g.name + g.group + g.diet + g.song)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesText;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addGuest(name.trim(), group, config.slug);
    setName("");
  };

  const guestInviteLink = (g: GuestRsvp) =>
    `${origin}/invite/${config.slug}?guest=${encodeURIComponent(g.name)}`;

  const copyLink = (g: GuestRsvp) => {
    navigator.clipboard?.writeText(guestInviteLink(g));
    setCopiedId(g.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const exportCSV = () => {
    const header = [
      "Name",
      "Group",
      "Status",
      "Headcount",
      "Children",
      "Drinks",
      "Dietary",
      "Song",
      "Note",
      "Personalized Link",
    ].join(",");
    const rows = guests.map((g) =>
      [
        csvCell(g.name),
        csvCell(g.group),
        csvCell(g.status),
        csvCell(g.count),
        csvCell(g.children),
        csvCell(g.drinks.join("; ")),
        csvCell(g.diet),
        csvCell(g.song),
        csvCell(g.note),
        csvCell(guestInviteLink(g)),
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedslash-${config.slug}-guests.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const publicUrl = `${origin}/invite/${config.slug}`;

  const downloadQrSvg = () => {
    const svg = qrToSvgMarkup(publicUrl, config.theme.primaryColor, "#FFFFFF");
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedslash-${config.slug}-qr.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const stats = [
    {
      icon: Users,
      v: guests.length,
      l: "Total invited",
      c: "bg-[#161412] text-white",
    },
    {
      icon: Check,
      v: metrics.yes.length,
      l: "Attending",
      c: "bg-[#2E7D32] text-white",
    },
    {
      icon: Clock,
      v: metrics.later.length,
      l: "Yet to reply",
      c: "bg-[#C59B27] text-white",
    },
    {
      icon: X,
      v: metrics.no.length,
      l: "Regrets",
      c: "bg-[#6E1F2F] text-white",
    },
  ];

  const maxDrink = Math.max(1, ...metrics.drinks.map((d) => d[1]));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">
          Couple dashboard · {config.couple.groomName} weds {config.couple.brideName}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Guest CRM &amp; Live RSVPs
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="font-ui inline-flex items-center gap-2 rounded-full border hairline bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition hover:border-[#161412]"
            >
              <QrCode size={14} /> QR Code Studio
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="font-ui inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#6E1F2F]"
            >
              <Download size={14} /> Export CSV / Sheets
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((st) => (
          <div key={st.l} className={`rounded-3xl p-5 ${st.c}`}>
            <st.icon size={20} opacity={0.85} />
            <p className="font-display mt-2 text-4xl font-bold tabular-nums">{st.v}</p>
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-80">
              {st.l}
            </p>
          </div>
        ))}
      </div>

      {/* Live Analytics Cards */}
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]">
            Expected headcount
          </p>
          <p className="font-display mt-1 text-5xl font-bold tabular-nums">
            {metrics.headcount}{" "}
            <span className="text-lg font-normal text-[#6E655F]">guests</span>
          </p>
          {metrics.kids.length > 0 && (
            <p className="mt-2 flex items-start gap-1.5 font-ui text-xs text-[#6E655F]">
              <Baby size={14} className="mt-0.5 shrink-0 text-[#6E1F2F]" />
              <span>{metrics.kids.join(" · ")}</span>
            </p>
          )}
        </div>

        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]">
            <Wine size={13} /> Drink preferences
          </p>
          <div className="mt-3 space-y-2">
            {metrics.drinks.length > 0 ? (
              metrics.drinks.slice(0, 4).map(([drink, cnt]) => (
                <div key={drink} className="font-ui text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{drink}</span>
                    <span>{cnt}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F0EAE1]">
                    <div
                      className="h-full rounded-full bg-[#6E1F2F]"
                      style={{ width: `${(cnt / maxDrink) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="font-ui text-xs text-[#6E655F]">No drink picks yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]">
            <UtensilsCrossed size={13} /> Dietary board
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metrics.diets.length > 0 ? (
              metrics.diets.map(([diet, cnt]) => (
                <span
                  key={diet}
                  className="rounded-full bg-[#F0EAE1] px-3 py-1 font-ui text-xs font-semibold"
                >
                  {diet} ×{cnt}
                </span>
              ))
            ) : (
              <span className="font-ui text-xs text-[#6E655F]">
                No dietary tags recorded yet.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]">
            <Music size={13} /> DJ song queue ({metrics.songs.length})
          </p>
          <ul className="mt-2.5 space-y-1 font-editorial text-[15px] italic leading-snug">
            {metrics.songs.length > 0 ? (
              metrics.songs.slice(0, 4).map((song) => <li key={song}>• {song}</li>)
            ) : (
              <li className="text-[#6E655F]">Waiting for song requests…</li>
            )}
          </ul>
        </div>
      </div>

      {/* Add Guest Form */}
      <form
        onSubmit={handleAdd}
        className="mt-6 flex flex-wrap items-center gap-2 rounded-3xl border hairline bg-white p-4"
      >
        <label htmlFor={addInputId} className="visually-hidden">
          Guest or family name
        </label>
        <input
          id={addInputId}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add guest — e.g. The Verma Family"
          className="font-ui min-w-[220px] flex-1 rounded-full border hairline bg-[#FAF7F2] px-5 py-2.5 text-sm outline-none focus:border-[#6E1F2F]"
        />
        <label htmlFor={groupSelectId} className="visually-hidden">
          Guest group
        </label>
        <select
          id={groupSelectId}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="font-ui rounded-full border hairline bg-[#FAF7F2] px-4 py-2.5 text-sm outline-none"
        >
          {[
            "Groom's Family",
            "Bride's Family",
            "Groom's Friends",
            "Bride's Friends",
            "Family Friends",
            "VIPs",
          ].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button
          type="submit"
          className="font-ui inline-flex items-center gap-1.5 rounded-full bg-[#6E1F2F] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#161412]"
        >
          <Plus size={15} /> Add guest
        </button>
      </form>

      {/* Filters & Search */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["yes", "Attending"],
              ["later", "Pending"],
              ["no", "Regrets"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilter(v)}
              className={`rounded-full px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] transition ${
                filter === v ? "bg-[#161412] text-white" : "border hairline bg-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <search>
            <input
              type="search"
              aria-label="Filter guests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, diet, song…"
              className="font-ui rounded-full border hairline bg-white px-4 py-2 text-xs outline-none focus:border-[#6E1F2F]"
            />
          </search>
          <button
            type="button"
            onClick={resetDemo}
            title="Restore sample guest list"
            className="inline-flex items-center gap-1 rounded-full border hairline bg-white px-3.5 py-2 font-ui text-[11px] font-semibold text-[#6E655F] hover:text-[#161412]"
          >
            <RotateCcw size={12} /> Reset demo
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="mt-4 overflow-hidden rounded-3xl border hairline bg-white">
        <div
          tabIndex={0}
          role="region"
          aria-labelledby={tableCaptionId}
          className="table-wrapper scrollbar-thin max-h-[540px]"
        >
          <table className="crm-table w-full border-separate border-spacing-0 text-left">
            <caption id={tableCaptionId} className="visually-hidden">
              Guest CRM and live RSVP responses
            </caption>
            <thead className="sticky top-0 z-10 bg-[#FAF7F2]">
              <tr className="border-b hairline font-ui text-[10px] uppercase tracking-[0.16em] text-[#6E655F]">
                <th scope="col" className="border-b hairline px-4 py-3.5">
                  Guest
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Group
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Status
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Count
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Drinks
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Dietary
                </th>
                <th scope="col" className="border-b hairline px-3 py-3.5">
                  Song &amp; Kids
                </th>
                <th scope="col" className="border-b hairline px-4 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((g) => (
                <tr
                  key={g.id}
                  className="border-b hairline last:border-0 hover:bg-[#FAF7F2]/60"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-[1] border-b hairline bg-white px-4 py-3 font-semibold"
                  >
                    <div>{g.name}</div>
                    {g.note && (
                      <p className="font-ui text-[11px] font-normal text-[#6E655F]">
                        “{g.note}”
                      </p>
                    )}
                  </th>
                  <td data-label="Group" className="border-b hairline px-3 py-3 text-sm text-[#6E655F]">
                    {g.group}
                  </td>
                  <td data-label="Status" className="border-b hairline px-3 py-3">
                    <select
                      aria-label={`RSVP status for ${g.name}`}
                      value={g.status}
                      onChange={(e) =>
                        updateStatus(g.id, e.target.value as GuestRsvp["status"])
                      }
                      className={`rounded-full px-2.5 py-1 font-ui text-[11px] font-bold outline-none ${
                        g.status === "yes"
                          ? "bg-[#2E7D32]/12 text-[#2E7D32]"
                          : g.status === "no"
                          ? "bg-[#6E1F2F]/12 text-[#6E1F2F]"
                          : "bg-[#C59B27]/18 text-[#8a6d1c]"
                      }`}
                    >
                      <option value="yes">Attending</option>
                      <option value="later">Pending</option>
                      <option value="no">Regrets</option>
                    </select>
                  </td>
                  <td data-label="Count" className="border-b hairline px-3 py-3 font-display text-lg font-bold tabular-nums">
                    {g.count}
                  </td>
                  <td data-label="Drinks" className="border-b hairline px-3 py-3 text-sm">
                    {g.drinks.length ? g.drinks.join(", ") : "—"}
                  </td>
                  <td data-label="Dietary" className="border-b hairline px-3 py-3 text-sm">
                    {g.diet || "—"}
                  </td>
                  <td data-label="Song & Kids" className="border-b hairline max-w-[160px] px-3 py-3 text-sm">
                    <span className="block truncate italic">{g.song || "—"}</span>
                    {g.children && (
                      <span className="font-ui block text-[11px] text-[#6E655F]">
                        Kids: {g.children}
                      </span>
                    )}
                  </td>
                  <td data-label="Actions" className="border-b hairline px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyLink(g)}
                        aria-label={`Copy personalized invite link for ${g.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full border hairline transition hover:bg-[#161412] hover:text-white"
                      >
                        {copiedId === g.id ? <CheckCheck size={15} /> : <Copy size={15} />}
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `You're invited to ${config.couple.groomName} & ${config.couple.brideName}'s celebration! Open your personal invite: ${guestInviteLink(g)}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Send WhatsApp invite to ${g.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white"
                      >
                        <MessageCircle size={15} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeGuest(g.id)}
                        aria-label={`Remove ${g.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full border hairline text-[#6E655F] transition hover:border-[#6E1F2F] hover:text-[#6E1F2F]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-ui mt-3 text-xs text-[#6E655F]">
        Tip — Any RSVP submitted on <span className="font-mono">/invite/{config.slug}</span> syncs live into this dashboard. Copy buttons include a personalized{" "}
        <span className="font-mono">?guest=Name</span> greeting.
      </p>

      {/* Printable QR Code Studio Modal */}
      <AccessibleDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Printable QR Code Studio"
        subtitle="Ready for physical invitation inserts & welcome easels"
      >
        <div className="rounded-3xl border-2 bg-white p-8 text-center" style={{ borderColor: config.theme.accentGold }}>
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: config.theme.primaryColor }}>
            {config.blessing.sacredQuote}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold" style={{ color: config.theme.primaryColor }}>
            {config.couple.groomName} &amp; {config.couple.brideName}
          </h2>
          <p className="font-editorial mt-1 text-lg italic text-[#6E655F]">
            {config.couple.dateDisplayLabel} · {config.location.city}
          </p>
          <div className="mx-auto my-5 inline-block rounded-2xl border hairline bg-white p-4 shadow-sm">
            <QrSvg
              value={publicUrl}
              size={180}
              fg={config.theme.primaryColor}
              label={`Wedding invitation QR code for ${config.couple.groomName} and ${config.couple.brideName}`}
            />
          </div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#161412]">
            Scan to open &amp; RSVP
          </p>
          <p className="mt-1 break-all font-mono text-[11px] text-[#6E655F]">{publicUrl}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={downloadQrSvg}
            className="font-ui inline-flex items-center justify-center gap-2 rounded-full bg-[#161412] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#6E1F2F]"
          >
            <Download size={14} /> Download SVG
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="font-ui inline-flex items-center justify-center gap-2 rounded-full border hairline bg-white py-3 text-xs font-bold uppercase tracking-[0.12em] hover:border-[#161412]"
          >
            <Printer size={14} /> Print Card
          </button>
        </div>
      </AccessibleDialog>
    </div>
  );
}
