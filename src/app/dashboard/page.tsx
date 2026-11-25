"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Check, X, Clock, Plus, Copy, CheckCheck, MessageCircle, Download, Music, UtensilsCrossed } from "lucide-react";

interface Guest { id: number; name: string; group: string; status: string; count: number; drink: string; diet: string; song: string; }

const SEED: Guest[] = [
  { id: 1, name: "The Sharma Family", group: "Groom's Family", status: "yes", count: 4, drink: "Mocktail", diet: "Veg", song: "Gallan Goodiyaan" },
  { id: 2, name: "Rahul & Priya Kapoor", group: "Bride's Friends", status: "yes", count: 2, drink: "Champagne", diet: "Jain", song: "Kesariya" },
  { id: 3, name: "Mehta Uncle & Aunty", group: "Family Friends", status: "later", count: 2, drink: "—", diet: "—", song: "—" },
  { id: 4, name: "Sofia Bennett", group: "Groom's Friends", status: "yes", count: 1, drink: "White Wine", diet: "Vegan", song: "Perfect — Ed Sheeran" },
  { id: 5, name: "The Iyer Family", group: "Bride's Family", status: "no", count: 0, drink: "—", diet: "—", song: "—" },
  { id: 6, name: "Kabir Anand +1", group: "VIPs", status: "yes", count: 2, drink: "Whiskey", diet: "Non-Veg", song: "Mundian To Bach Ke" },
];

export default function DashboardPage() {
  const [guests, setGuests] = useState<Guest[]>(SEED);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("Groom's Friends");
  const [copied, setCopied] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const yes = guests.filter((g) => g.status === "yes");
  const no = guests.filter((g) => g.status === "no");
  const later = guests.filter((g) => g.status === "later");
  const headcount = yes.reduce((a, g) => a + g.count, 0);
  const shown = guests.filter((g) => filter === "all" || g.status === filter);

  const add = () => {
    if (!name.trim()) return;
    setGuests([...guests, { id: Date.now(), name: name.trim(), group, status: "later", count: 2, drink: "—", diet: "—", song: "—" }]);
    setName("");
  };
  const link = (g: Guest) => `https://wedslash.com/invite/wine-velvet-book?guest=${encodeURIComponent(g.name)}`;
  const copy = (g: Guest) => { navigator.clipboard?.writeText(link(g)); setCopied(g.id); setTimeout(() => setCopied(null), 1500); };
  const exportCSV = () => {
    const csv = ["Name,Group,Status,Headcount,Drink,Dietary,Song", ...guests.map((g) => `"${g.name}","${g.group}",${g.status},${g.count},"${g.drink}","${g.diet}","${g.song}"`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "wedslash-guests.csv"; a.click();
  };

  const stats = [
    { icon: Users, v: guests.length, l: "Total invited", c: "bg-[#161412] text-white" },
    { icon: Check, v: yes.length, l: "Attending", c: "bg-[#2E7D32] text-white" },
    { icon: Clock, v: later.length, l: "Yet to reply", c: "bg-[#C59B27] text-white" },
    { icon: X, v: no.length, l: "Regrets", c: "bg-[#6E1F2F] text-white" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[#6E1F2F]">Couple dashboard · Arjun weds Priya</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display mt-1 text-4xl font-bold sm:text-5xl">Guest CRM & RSVPs</h1>
          <button onClick={exportCSV} className="font-ui inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#6E1F2F]">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className={`rounded-3xl p-5 ${s.c}`}>
            <s.icon size={20} opacity={0.8} />
            <p className="font-display mt-2 text-4xl font-bold">{s.v}</p>
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-75">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]">Expected headcount</p>
          <p className="font-display mt-1 text-5xl font-bold">{headcount} <span className="text-xl font-normal text-[#6E655F]">guests</span></p>
        </div>
        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]"><UtensilsCrossed size={13} /> Dietary board</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Veg ×5", "Jain ×2", "Vegan ×1", "Non-Veg ×3"].map((d) => <span key={d} className="rounded-full bg-[#F0EAE1] px-3 py-1 font-ui text-xs font-semibold">{d}</span>)}
          </div>
        </div>
        <div className="rounded-3xl border hairline bg-white p-5">
          <p className="font-ui flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E655F]"><Music size={13} /> DJ requests</p>
          <p className="mt-2 font-editorial text-[15px] italic leading-snug">Gallan Goodiyaan · Kesariya · Mundian To Bach Ke · Perfect</p>
        </div>
      </div>

      {/* add guest */}
      <div className="mt-6 flex flex-wrap gap-2 rounded-3xl border hairline bg-white p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add guest — e.g. The Verma Family" className="font-ui min-w-[220px] flex-1 rounded-full border hairline bg-[#FAF7F2] px-5 py-2.5 text-sm outline-none focus:border-[#6E1F2F]" />
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="font-ui rounded-full border hairline bg-[#FAF7F2] px-4 py-2.5 text-sm outline-none">
          {["Groom's Family", "Bride's Family", "Groom's Friends", "Bride's Friends", "Family Friends", "VIPs"].map((g) => <option key={g}>{g}</option>)}
        </select>
        <button onClick={add} className="font-ui inline-flex items-center gap-1.5 rounded-full bg-[#6E1F2F] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white"><Plus size={15} /> Add guest</button>
      </div>

      {/* filters */}
      <div className="mt-4 flex gap-2">
        {[["all", "All"], ["yes", "Attending"], ["later", "Pending"], ["no", "Regrets"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`rounded-full px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] ${filter === v ? "bg-[#161412] text-white" : "border hairline bg-white"}`}>{l}</button>
        ))}
      </div>

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-3xl border hairline bg-white">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b hairline bg-[#FAF7F2] font-ui text-[10px] uppercase tracking-[0.18em] text-[#6E655F]">
                <th className="px-5 py-3.5">Guest</th><th className="px-4 py-3.5">Group</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Count</th><th className="px-4 py-3.5">Drink</th><th className="px-4 py-3.5">Dietary</th><th className="px-4 py-3.5">Song</th><th className="px-5 py-3.5 text-right">Invite</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((g) => (
                <tr key={g.id} className="border-b hairline last:border-0 hover:bg-[#FAF7F2]/60">
                  <td className="px-5 py-3.5 font-semibold">{g.name}</td>
                  <td className="px-4 py-3.5 text-sm text-[#6E655F]">{g.group}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-ui text-[11px] font-bold ${g.status === "yes" ? "bg-[#2E7D32]/10 text-[#2E7D32]" : g.status === "no" ? "bg-[#6E1F2F]/10 text-[#6E1F2F]" : "bg-[#C59B27]/15 text-[#8a6d1c]"}`}>
                      {g.status === "yes" ? <Check size={12} /> : g.status === "no" ? <X size={12} /> : <Clock size={12} />}
                      {g.status === "yes" ? "Attending" : g.status === "no" ? "Regrets" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-display text-lg font-bold">{g.count}</td>
                  <td className="px-4 py-3.5 text-sm">{g.drink}</td>
                  <td className="px-4 py-3.5 text-sm">{g.diet}</td>
                  <td className="max-w-[160px] truncate px-4 py-3.5 text-sm italic">{g.song}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => copy(g)} title="Copy personalized link" className="grid h-9 w-9 place-items-center rounded-full border hairline transition hover:bg-[#161412] hover:text-white">{copied === g.id ? <CheckCheck size={15} /> : <Copy size={15} />}</button>
                      <a href={`https://wa.me/?text=${encodeURIComponent(`You're invited! Arjun weds Priya — ${link(g)}`)}`} target="_blank" rel="noreferrer" title="Send via WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white"><MessageCircle size={15} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="font-ui mt-3 text-xs text-[#6E655F]">Tip — the copy button grabs a personalized <span className="font-mono">?guest=Name</span> link that greets each guest by name on the invite cover.</p>
    </div>
  );
}
