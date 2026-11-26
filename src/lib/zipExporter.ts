import JSZip from "jszip";
import type { InvitationConfig } from "./types";
import { qrToSvgMarkup } from "./qr";

function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildStandaloneHtml(config: InvitationConfig, guest = "Honored Guest"): string {
  const { couple, blessing, mechanics, theme, functions, etiquetteAndDetails, location, rsvpConfig } =
    config;
  const dt = new Date(couple.weddingDate);
  const day = isNaN(dt.getTime()) ? "13" : String(dt.getDate()).padStart(2, "0");
  const month = isNaN(dt.getTime())
    ? "FEB"
    : dt.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = isNaN(dt.getTime()) ? "2027" : String(dt.getFullYear());
  const inviteUrl = `https://wedslash.com/invite/${encodeURIComponent(config.slug)}`;
  const qrSvg = qrToSvgMarkup(inviteUrl, theme.textColor, "#FFFFFF");

  const functionsHtml = functions
    .map(
      (f) => `
      <article class="fn-card" style="border-top:4px solid ${esc(f.cardThemeColor)}">
        <div class="fn-top" style="background:${esc(f.cardThemeColor)}15">
          <span class="fn-pill" style="background:${esc(f.cardThemeColor)}">${esc(f.name)}</span>
          <span class="fn-time">${esc(f.dayAndDate)} · ${esc(f.time)}</span>
        </div>
        <div class="fn-body">
          <h3>${esc(f.name)}</h3>
          <p class="muted">${esc(f.venueName)}</p>
          <div class="swatches">
            ${f.dressCodeColors
              .map((c) => `<span class="dot" style="background:${esc(c)}"></span>`)
              .join("")}
            <span>${esc(f.dressCodeLabel)}</span>
          </div>
        </div>
      </article>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(couple.groomName)} &amp; ${esc(couple.brideName)} — Interactive Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;600;700&family=Pinyon+Script&display=swap" rel="stylesheet" />
  <style>
    *{box-sizing:border-box;margin:0}
    :root{--primary:${esc(theme.primaryColor)};--secondary:${esc(theme.secondaryColor)};--gold:${esc(theme.accentGold)};--bg:${esc(theme.bgColor)};--ink:${esc(theme.textColor)}}
    body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}
    .wrap{max-width:480px;margin:0 auto;min-height:100dvh;background:var(--bg);box-shadow:0 30px 80px -30px rgba(0,0,0,.35)}
    .gate{min-height:92dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 24px;text-align:center;background:var(--secondary);border-bottom:1px solid rgba(0,0,0,.08)}
    .book{width:230px;aspect-ratio:3/4;background:linear-gradient(150deg,var(--primary),#1c0a0e);color:#FFF8E7;border-radius:6px 16px 16px 6px;border:1.5px solid var(--gold);padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 28px 60px -18px rgba(0,0,0,.55);cursor:pointer;transition:transform .6s ease}
    .book:hover{transform:rotateY(-10deg) scale(1.02)}
    .seal{width:54px;height:54px;border:2px solid var(--gold);border-radius:50%;display:grid;place-items:center;color:var(--gold);font-size:22px;margin-bottom:14px}
    .disp{font-family:'Playfair Display',Georgia,serif}
    .script{font-family:'Pinyon Script',cursive;color:var(--gold)}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:999px;padding:12px 24px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;text-decoration:none}
    .btn-dark{background:#161412;color:#fff}.btn-primary{background:var(--primary);color:#fff}.btn-wa{background:#25D366;color:#fff}
    .sec{padding:44px 24px;text-align:center}
    .alt{background:rgba(0,0,0,.035)}
    .eyebrow{font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;opacity:.65}
    .names{font-size:48px;line-height:1.05;color:var(--primary);margin:10px 0}
    .scroll-box{background:#FFFDF6;border:1px solid rgba(0,0,0,.1);border-radius:18px;padding:24px;margin-top:16px;box-shadow:0 16px 40px -20px rgba(0,0,0,.25)}
    .scratch-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
    .scratch-cell{position:relative;aspect-ratio:1;border-radius:999px;background:#FFFDF6;display:grid;place-items:center;border:1.5px solid var(--gold);overflow:hidden}
    .scratch-cell canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:pointer}
    .cd{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:18px 0}
    .cd div{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:10px 4px}
    .cd b{font-family:'Playfair Display',serif;font-size:24px;display:block}
    .cd span{font-size:9px;letter-spacing:.18em;text-transform:uppercase;opacity:.6}
    .fn-card{background:#fff;border-radius:20px;overflow:hidden;text-align:left;margin-top:14px;box-shadow:0 12px 30px -16px rgba(0,0,0,.2)}
    .fn-top{padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
    .fn-pill{color:#fff;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:4px 10px;border-radius:999px}
    .fn-time{font-size:11px;font-weight:600;opacity:.75}
    .fn-body{padding:16px}.fn-body h3{font-family:'Playfair Display',serif;font-size:22px}
    .muted{font-size:13px;opacity:.75;margin-top:4px}
    .swatches{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;background:#FAF7F2;padding:8px 12px;border-radius:12px}
    .dot{width:14px;height:14px;border-radius:50%;border:1.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.1)}
    .card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:22px;padding:20px;text-align:left;margin-top:14px}
    input,select{width:100%;padding:11px 14px;border-radius:12px;border:1px solid rgba(0,0,0,.15);margin-top:6px;font:inherit;font-size:14px;background:#FAF7F2}
    .hidden{display:none}
  </style>
</head>
<body>
<div class="wrap">
  <section class="gate" id="gate">
    <button class="book" id="openBtn" type="button" aria-label="Open wedding invitation">
      <div class="seal">✦</div>
      <p style="font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold)">${esc(blessing.sacredQuote)}</p>
      <h2 class="disp" style="font-size:28px;margin:14px 0 6px">${esc(couple.groomName)} &amp; ${esc(couple.brideName)}</h2>
      <p style="font-size:11px;opacity:.75;letter-spacing:.18em;text-transform:uppercase">${esc(mechanics.entryType.replace(/-/g, " "))}</p>
      <span style="margin-top:18px;border:1px solid var(--gold);border-radius:99px;padding:5px 14px;font-size:11px">For · <span id="guestLabel">${esc(guest)}</span></span>
    </button>
    <p class="eyebrow" style="margin-top:20px">Tap the cover to open</p>
  </section>

  <main id="content" class="hidden">
    <section class="sec">
      <p class="eyebrow">${esc(blessing.inviteIntroLine)}</p>
      <h1 class="disp names">${esc(couple.groomName)}</h1>
      <p class="eyebrow">${esc(couple.groomParents)}</p>
      <p class="script" style="font-size:44px;margin:4px 0">&amp;</p>
      <h1 class="disp names">${esc(couple.brideName)}</h1>
      <p class="eyebrow">${esc(couple.brideParents)}</p>
      <p style="margin-top:16px;font-style:italic;opacity:.8">${esc(couple.heroSubtitle)} · ${esc(couple.hashtag)}</p>
    </section>

    <section class="sec alt">
      <p class="eyebrow">Save the Date · ${esc(mechanics.dateRevealType.replace(/-/g, " "))}</p>
      <div id="revealWrap">
        <button class="btn btn-primary" style="margin-top:14px" id="revealBtn" type="button">Reveal Wedding Date</button>
      </div>
      <div id="revealedDate" class="scroll-box hidden">
        <p class="disp" style="font-size:28px">${esc(couple.dateDisplayLabel)}</p>
        <p class="eyebrow" style="color:var(--primary);margin-top:4px">${esc(couple.muhuratTime)}</p>
        <p class="muted">${esc(location.venueTitle)} · ${esc(location.city)}</p>
      </div>
      <div class="scratch-grid" id="scratchGrid">
        ${[
          ["DAY", day],
          ["MONTH", month],
          ["YEAR", year],
        ]
          .map(
            ([l, v]) =>
              `<div class="scratch-cell"><div><div style="font-size:9px;letter-spacing:.2em;opacity:.6">${l}</div><b class="disp" style="font-size:22px">${v}</b></div><canvas width="140" height="140"></canvas></div>`
          )
          .join("")}
      </div>
      <div class="cd" id="cd"><div><b id="cdD">00</b><span>Days</span></div><div><b id="cdH">00</b><span>Hours</span></div><div><b id="cdM">00</b><span>Mins</span></div><div><b id="cdS">00</b><span>Secs</span></div></div>
      <button class="btn btn-dark" type="button" id="icsBtn">Add to Calendar (.ics)</button>
    </section>

    <section class="sec">
      <p class="eyebrow">Wedding Festivities</p>
      <h2 class="disp" style="font-size:28px;margin-top:4px">Celebration Itinerary</h2>
      ${functionsHtml}
    </section>

    <section class="sec alt">
      <p class="eyebrow">Dress Code &amp; Etiquette</p>
      <div class="card">
        <p><strong>Ladies:</strong> ${esc(etiquetteAndDetails.ladiesDressNote)}</p>
        <p style="margin-top:8px"><strong>Gentlemen:</strong> ${esc(etiquetteAndDetails.gentlemenDressNote)}</p>
        <p style="margin-top:10px;padding:8px 12px;border-radius:12px;background:#FAF7F2;font-size:13px">${esc(etiquetteAndDetails.reservedColorsNote)}</p>
        <p style="margin-top:8px;font-size:13px"><strong>Gifts:</strong> ${esc(etiquetteAndDetails.giftPreferenceNote)}</p>
        <p style="margin-top:8px;font-size:13px"><strong>Organizer:</strong> ${esc(etiquetteAndDetails.organizerName)} · ${esc(etiquetteAndDetails.organizerPhone)}</p>
      </div>
    </section>

    <section class="sec">
      <p class="eyebrow">Venue &amp; Directions</p>
      <h2 class="disp" style="font-size:26px;margin-top:4px">${esc(location.venueTitle)}</h2>
      <p class="muted">${esc(location.fullAddress)}</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <a class="btn btn-dark" href="${esc(location.googleMapsUrl)}" target="_blank" rel="noreferrer">Get Directions</a>
        <button class="btn" style="background:#fff;border:1px solid rgba(0,0,0,.16)" id="copyAddrBtn" type="button">Copy Address</button>
      </div>
    </section>

    <section class="sec alt">
      <p class="eyebrow">Confirm Your Attendance</p>
      <h2 class="disp" style="font-size:28px;margin-top:4px">RSVP via WhatsApp</h2>
      <p class="muted">${esc(rsvpConfig.deadlineText)}</p>
      <form class="card" id="rsvpForm">
        <label style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Your Name<input id="rName" value="${esc(guest)}" required /></label>
        <label style="display:block;margin-top:12px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Will you join us?
          <select id="rStatus"><option value="Joyfully accepts">Joyfully accepts</option><option value="Tell you later">Tell you a bit later</option><option value="Regretfully declines">Regretfully declines</option></select>
        </label>
        <label style="display:block;margin-top:12px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Guests<input id="rCount" type="number" min="1" max="12" value="2" /></label>
        <label style="display:block;margin-top:12px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Dietary / Song Request<input id="rNote" placeholder="Veg / Jain · Your favorite dance song" /></label>
        <button class="btn btn-wa" style="width:100%;margin-top:16px" type="submit">Send RSVP on WhatsApp</button>
      </form>
      <div style="margin:20px auto 0;width:130px;padding:10px;background:#fff;border-radius:16px">${qrSvg}</div>
    </section>

    <footer class="sec" style="background:linear-gradient(170deg,var(--primary),#161412);color:#fff">
      <h2 class="disp" style="font-size:28px">We can't wait to celebrate with you</h2>
      <p style="margin-top:8px;opacity:.8;font-style:italic">${esc(couple.closingFamilyLine)}</p>
      <p class="eyebrow" style="margin-top:14px;opacity:.55">${esc(couple.hashtag)} · Wedslash</p>
    </footer>
  </main>
</div>
<script>
(function(){
  var q = new URLSearchParams(location.search).get('guest');
  if (q) { document.getElementById('guestLabel').textContent = q; document.getElementById('rName').value = q; }
  document.getElementById('openBtn').onclick = function(){
    document.getElementById('gate').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    window.scrollTo({top:0,behavior:'smooth'});
  };
  document.getElementById('revealBtn').onclick = function(){
    document.getElementById('revealedDate').classList.remove('hidden');
    this.classList.add('hidden');
  };
  document.querySelectorAll('#scratchGrid canvas').forEach(function(cv){
    var ctx = cv.getContext('2d');
    var g = ctx.createLinearGradient(0,0,140,140);
    g.addColorStop(0,'#8a6d1c');g.addColorStop(.5,'#F6E27A');g.addColorStop(1,'#8a6d1c');
    ctx.fillStyle = g; ctx.fillRect(0,0,140,140);
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText('SCRATCH',70,75);
    var down=false;
    function scratch(e){
      var r=cv.getBoundingClientRect();
      var x=((e.touches?e.touches[0].clientX:e.clientX)-r.left)*(140/r.width);
      var y=((e.touches?e.touches[0].clientY:e.clientY)-r.top)*(140/r.height);
      ctx.globalCompositeOperation='destination-out';
      ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();
    }
    cv.addEventListener('pointerdown',function(e){down=true;scratch(e);});
    cv.addEventListener('pointermove',function(e){if(down)scratch(e);});
    window.addEventListener('pointerup',function(){down=false;});
  });
  var target = new Date(${JSON.stringify(couple.weddingDate)}).getTime();
  function tick(){
    var d = Math.max(0, target - Date.now());
    document.getElementById('cdD').textContent = String(Math.floor(d/86400000)).padStart(2,'0');
    document.getElementById('cdH').textContent = String(Math.floor(d/3600000%24)).padStart(2,'0');
    document.getElementById('cdM').textContent = String(Math.floor(d/60000%60)).padStart(2,'0');
    document.getElementById('cdS').textContent = String(Math.floor(d/1000%60)).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);
  document.getElementById('icsBtn').onclick = function(){
    var s = new Date(target).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    var e = new Date(target+14400000).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    var ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','DTSTART:'+s,'DTEND:'+e,'SUMMARY:${esc(couple.groomName)} & ${esc(couple.brideName)}','LOCATION:${esc(location.venueTitle)}','END:VEVENT','END:VCALENDAR'].join('\\r\\n');
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='wedding-invite.ics';a.click();
  };
  document.getElementById('copyAddrBtn').onclick = function(){
    navigator.clipboard && navigator.clipboard.writeText(${JSON.stringify(location.fullAddress)});
    this.textContent = 'Copied!';
  };
  document.getElementById('rsvpForm').onsubmit = function(ev){
    ev.preventDefault();
    var msg = 'Hello! RSVP from ' + document.getElementById('rName').value + '\\nStatus: ' + document.getElementById('rStatus').value + '\\nGuests: ' + document.getElementById('rCount').value + '\\nNotes: ' + (document.getElementById('rNote').value || '—');
    window.open('https://wa.me/${esc(rsvpConfig.whatsappHostNumber)}?text=' + encodeURIComponent(msg), '_blank');
  };
})();
</script>
</body>
</html>`;
}

export async function downloadInviteZip(config: InvitationConfig, guest?: string): Promise<void> {
  const zip = new JSZip();
  const html = buildStandaloneHtml(config, guest || "Honored Guest");
  zip.file("index.html", html);
  zip.file(
    "README-DEPLOY.md",
    `# ${config.couple.groomName} & ${config.couple.brideName} — Standalone Interactive Wedding Invite

Exported from Wedslash Studio (Template: ${config.templateId}).

## Deploy for free in 10 seconds
1. Unzip this folder or drag the extracted folder directly onto https://app.netlify.com/drop (or deploy to Vercel / GitHub Pages).
2. Share personalized links with guests by appending ?guest=The+Sharma+Family to your deployed URL!
`
  );
  zip.file("invite-config.json", JSON.stringify(config, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wedslash-${config.slug || config.templateId}-invite.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
