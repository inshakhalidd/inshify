// Inshify Studio (v2 design): editorial, light-first portfolio.
// Generates index.html, work/<slug>.html and 404.html from src/site.config.mjs. Run with `node src/build.mjs`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { site, filters, projects } from "./site.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Content hash for ?v= on CSS/JS links, so visitors get changes without waiting out the Pages cache.
const assetVersion = (file) => createHash("sha1").update(fs.readFileSync(path.join(ROOT, file))).digest("hex").slice(0, 8);
const OUT = ROOT;
const YEAR = 2026;

// A plain "&" between words stays a real "&" (valid HTML5); only an "&" that could start an entity is escaped.
const esc = (s) =>
  String(s)
    .replace(/&(?!\s)/g, "&amp;")
    .replace(/[<>"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const isPlaceholder = (s) => !s || /^\[.*\]$/.test(s.trim());
const fullLabel = (p) => (p.sublabel ? `${p.label} · ${p.sublabel}` : p.label);
const num = (i) => String(i + 1).padStart(2, "0");

function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`No size found in ${file}`);
}

function loadImages(folder, alt) {
  const dir = path.join(ROOT, "assets/work", folder);
  const files = fs.readdirSync(dir).filter((f) => /^\d+\.(jpe?g|png|webp)$/i.test(f)).sort();
  return files.map((f, i) => {
    const base = f.replace(/\.[^.]+$/, "");
    const ext = path.extname(f);
    const sm = fs.existsSync(path.join(dir, `${base}-sm${ext}`)) ? `${base}-sm${ext}` : f;
    const size = /\.jpe?g$/i.test(f) ? jpegSize(path.join(dir, f)) : { w: 1200, h: 1200 };
    return { src: `assets/work/${folder}/${f}`, sm: `assets/work/${folder}/${sm}`, ...size, alt: files.length > 1 ? `${alt}, ${i + 1} of ${files.length}` : alt };
  });
}
// A project is one gallery from assets/work/<slug>/, or several titled sets (p.sets) shown in order.
for (const p of projects) {
  p.sets = (p.sets || [{ dir: p.slug, alt: p.alt }]).map((s) => ({ ...s, images: loadImages(s.dir, s.alt) }));
  p.images = p.sets.flatMap((s) => s.images);
}
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const voiceflow = fs.readFileSync(path.join(ROOT, "src/partials/voiceflow.html"), "utf8").trim();
// With a real Voiceflow snippet installed, only its launcher is shown (no fallback chat button).
const hasVoiceflow = /<script/i.test(voiceflow);

const icon = {
  arrow: `<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sun: `<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  moon: `<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5v-8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 9.5h7M8.5 12.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  ig: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  in: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5v5M8.5 8v.01M12 15.5v-5m0 2.2c0-1.3 1-2.2 2.1-2.2s1.9.8 1.9 2.2v2.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  mail: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7 7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
};

// Line icons for the service cards.
const svcIcon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const svc = {
  logo: svcIcon("M12 3l6 6-4.5 9h-3L6 9l6-6Zm0 0v7m0 0a1.6 1.6 0 1 0 0 .1M9 21h6"),
  brand: svcIcon("M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.3-1.7-.4-1.1.3-2.3 1.5-2.3H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10ZM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01"),
  social: svcIcon("M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6.5h.01"),
  print: svcIcon("M12 3 3 7.5l9 4.5 9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5"),
};

// Software tiles: simple app-style badges in each tool's colors (drawn here, not official artwork).
const TOOLS = {
  Photoshop: { abbr: "Ps", cls: "t-ps" },
  Illustrator: { abbr: "Ai", cls: "t-ai" },
  InDesign: { abbr: "Id", cls: "t-id" },
};
// Hero spots for the software tiles: top left, right, lower left, so three tiles balance around the title.
const HERO_SPOTS = ["f1", "f4", "f5"];
const toolTile = (name, size = "") => `<span class="tool-tile ${TOOLS[name].cls} ${size}" data-abbr="${TOOLS[name].abbr}" aria-hidden="true"></span>`;

// Full-size image viewer for galleries and certificates (opened by any [data-lightbox] link).
const lightbox = `<dialog class="lightbox" aria-label="Image viewer">
  <button class="lb-close" type="button" aria-label="Close">${icon.close}</button>
  <button class="lb-prev" type="button"><span aria-hidden="true">‹</span><span class="sr-only">Previous image</span></button>
  <img alt="">
  <button class="lb-next" type="button"><span aria-hidden="true">›</span><span class="sr-only">Next image</span></button>
</dialog>`;

// A loose hand-drawn loop, echoing the doodle lines in the reference portfolios.
const doodle = (cls) => `<svg class="doodle ${cls}" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 360 C 140 120, 300 80, 380 220 S 300 440, 220 330 S 420 60, 640 170 S 880 420, 960 260 S 900 40, 1040 110 S 1180 300, 1230 200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

function head({ title, description, ogDescription = description, root, ogImage, pagePath, intro = false, extraFonts = "" }) {
  return `<!doctype html>
<html lang="en" data-theme="dark" data-theme-key="inshify-theme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ogDescription)}">
<meta property="og:image" content="${esc(site.url ? `${site.url}/${ogImage}` : root + ogImage)}">
${site.url ? `<link rel="canonical" href="${esc(`${site.url}/${pagePath}`)}">` : ""}
${site.url ? `<meta property="og:url" content="${esc(`${site.url}/${pagePath}`)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#141414">
<link rel="icon" type="image/png" sizes="32x32" href="${root}assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="${root}assets/img/favicon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="${root}assets/img/icon-192.png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<script>
  // Dark by default; light only if the visitor chose it.
  (function () {
    var t = null;
    try { t = localStorage.getItem("inshify-theme"); } catch (e) {}
    document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");${intro ? `
    // Opening intro: once per visit, skipped for reduced motion.
    try {
      if (!sessionStorage.getItem("inshify-intro") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("intro");
        sessionStorage.setItem("inshify-intro", "1");
      }
    } catch (e) {}` : ""}
  })();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&family=Kaushan+Script&display=swap">${extraFonts ? `
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${extraFonts}&display=swap">` : ""}
<link rel="stylesheet" href="${root}assets/css/styles.css?v=${assetVersion("assets/css/styles.css")}">
<script src="${root}assets/js/main.js?v=${assetVersion("assets/js/main.js")}" defer></script>
</head>`;
}

const wordmark = (href, cls = "") => `<a class="wordmark ${cls}" href="${href}" aria-label="Inshify Studio, home"><span class="sr-only">Inshify</span></a>`;

function header(v2root, home) {
  const h = (id) => (home ? `#${id}` : `${v2root}index.html#${id}`);
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap nav">
    ${wordmark(home ? "#top" : `${v2root}index.html`)}
    <nav class="nav-links" id="nav-menu" aria-label="Main">
      <a href="${h("work")}">Work</a>
      <a href="${h("services")}">Services</a>
      <a href="${h("process")}">Process</a>
      <a href="${h("about")}">About</a>
      <a class="btn btn-primary" href="${h("contact")}">Hire me</a>
    </nav>
    <div class="nav-tools">
      <button class="theme-toggle" type="button" aria-label="Switch to light mode">${icon.sun}${icon.moon}</button>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function footer(root, v2root) {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-inner">
      <p class="copy">© ${YEAR} Inshify Studio · ${esc(site.role)}${isPlaceholder(site.city) ? "" : ` · ${esc(site.city)}`}</p>
      <nav class="footer-links" aria-label="Social">
        <a href="${site.instagram.url}" target="_blank" rel="noopener">Instagram</a>
        <a href="${site.linkedin.url}" target="_blank" rel="noopener">LinkedIn</a>
      </nav>
      <p class="disclaimer">Concept and sample work is created for portfolio purposes and is not affiliated with the brands shown.</p>
    </div>
  </div>
</footer>
${hasVoiceflow ? "" : `<button class="chat-fab" type="button" data-open-chat aria-label="Chat with my assistant">${icon.chat}</button>
<section class="chat-panel" id="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>
  <div class="chat-head">
    <h2 id="chat-title">Inshify assistant</h2>
    <button class="chat-close" type="button" aria-label="Close chat">${icon.close}</button>
  </div>
  <div class="chat-body">
    <p class="bubble">Hi, thanks for stopping by! For the quickest reply, DM me on Instagram <a href="${site.instagram.url}" target="_blank" rel="noopener">${esc(site.instagram.handle)}</a>${isPlaceholder(site.email) ? "" : ` or email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`}.</p>
  </div>
  <div class="chat-input"><span>Type your message…</span></div>
</section>`}
${voiceflow}
</body>
</html>
`;
}

// A looping ticker: the words are written twice so the track can slide by half its width forever.
const ticker = (words, sep, cls) => {
  const run = words.map((w) => `<span>${w}</span><span class="sep">${sep}</span>`).join("");
  return `<div class="ticker ${cls}" aria-hidden="true"><div class="ticker-track">${run}${run}</div></div>`;
};

// Closing band on every page: big headline, one line, the CTA, then a cream ticker.
const endBand = (contactHref) => `<section class="end-band" aria-labelledby="end-title">
  <div class="end-inner" data-reveal>
    <h2 id="end-title">Great things <span class="end-line">begin <em class="script">together.</em></span></h2>
    <p>Let’s make something meaningful happen.</p>
    <a class="btn btn-cream" href="${contactHref}">Hire me ${icon.arrow}</a>
  </div>
  ${ticker(["Let’s Create", "Let’s Collaborate", "Let’s Talk", "Let’s Connect"], "•", "ticker-cream")}
</section>`;

// Badge color per label: paid and internship work, then the service each project falls under.
const BADGES = { "Paid client work": "paid", Internship: "intern", "Brand identity": "brand", "Logo design": "logo", "Social media design": "social", "Ads & print": "ads" };
const badgeKind = (p) => BADGES[p.label] || "brand";
const firstSentence = (t) => (t ? t.split(/(?<=[.!?])\s+/)[0].trim() : "");

// Cover for cards, featured rows and the next-project link: a glimpse inside the project on its brand gradient
// (p.cover in the config). One pick is shown alone; with more, the first leads and the next two sit beside it.
function cover(p, root) {
  const { bg, pick } = p.cover;
  // A pick is an image number, or the name of a logo cut in assets/img/logos/.
  const art = (n) => {
    if (typeof n === "number") return p.images[n - 1];
    const src = `assets/img/logos/${n}.jpg`;
    const tile = (p.logoSystem || []).find((t) => t.file === n && !t.mask);
    return { src, sm: src, ...jpegSize(path.join(ROOT, src)), fit: tile ? tile.bg : "#fff" };
  };
  const piece = (n, k) => {
    const img = art(n);
    return `<span class="cv cv-${k}${img.fit ? " fit" : ""}" style="--a:${(img.w / img.h).toFixed(4)}${img.fit ? `;background:${img.fit}` : ""}"><img src="${root}${img.sm}" alt="" width="${img.w}" height="${img.h}" loading="lazy" decoding="async"></span>`;
  };
  const lead = art(pick[0]);
  const wide = lead.w / lead.h > 1.2 ? " glimpse-wide" : ""; // landscape leads go across the top
  const inner = pick.length === 1 ? piece(pick[0], "hero") : `<span class="glimpse${wide}">${piece(pick[0], "lead")}${pick.slice(1, 3).map((n) => piece(n, "side")).join("")}</span>`;
  return `<span class="cover" style="--c1:${bg[0]};--c2:${bg[1]}" aria-hidden="true">${inner}</span>`;
}

function card(p, root, v2root, i) {
  return `<article class="card" data-tags="${p.tags.join(" ")}">
  <span class="card-n">${num(i)}</span>
  <div class="card-media">${cover(p, root)}</div>
  <div class="card-body">
    <span class="badge b-${badgeKind(p)}">${esc(fullLabel(p))}</span>
    <h3><a href="${v2root}work/${p.slug}.html">${esc(p.title)}</a></h3>
  </div>
</article>`;
}

// Bold first part, light last word: the mixed-weight headline style from the references.
function mixTitle(t) {
  const i = t.lastIndexOf(" ");
  return i < 0 ? esc(t) : `${esc(t.slice(0, i))} <span class="light">${esc(t.slice(i + 1))}</span>`;
}

// ---------- Home ----------
function home() {
  const root = "";
  const v2root = "";
  // Insha's software floats around the hero title.
  const toolFloats = site.software
    .filter((name) => TOOLS[name])
    .map((name, i) => `<span class="float tool ${HERO_SPOTS[i]}" aria-hidden="true">${toolTile(name)}</span>`)
    .join("");
  const toolStrip = `<section class="wrap tools-strip" aria-labelledby="tools-title" data-reveal>
    <h2 class="dash-pill" id="tools-title">Software</h2>
    <ul class="tools-list">
${site.software.map((name) => `      <li>${TOOLS[name] ? toolTile(name, "sm") : ""}<span>${esc(name)}</span></li>`).join("\n")}
    </ul>
  </section>`;
  const email = isPlaceholder(site.email)
    ? `<button class="tile" type="button" data-open-chat><span class="tile-ic">${icon.chat}</span><h3>Chat with my assistant</h3></button>`
    : `<a class="tile" href="mailto:${esc(site.email)}"><span class="tile-ic">${icon.mail}</span><h3>Email me</h3><p>${esc(site.email)}</p></a>`;
  const portrait = site.portrait
    ? `<img class="portrait" src="${root}${esc(site.portrait)}" alt="Portrait of Insha" width="680" height="820" loading="lazy">`
    : `<img class="portrait portrait-brand" src="${root}${esc(site.brandCard)}" alt="Inshify, Graphic Designer: the Inshify Studio logo" width="1080" height="1080" loading="lazy">`;
  const counts = Object.fromEntries(filters.map((f) => [f.key, f.key === "all" ? projects.length : projects.filter((p) => p.tags.includes(f.key)).length]));
  const featured = site.featured.map((s) => bySlug[s]);

  return `${head({ title: `${site.name} — ${site.owner}, Graphic Designer | Logos, Branding & Social Media`, description: site.description, ogDescription: `Logos, social media posts and brand identities by Insha. ${projects.length} projects from Inshify Studio, ${isPlaceholder(site.city) ? "" : `${site.city}-based `}graphic design.`, root, ogImage: site.brandCard, pagePath: "", intro: true })}
<body id="top">
<div class="intro-screen" aria-hidden="true"><span class="intro-mark"></span><span class="intro-sub">Graphic design studio</span><span class="intro-bar"></span></div>
${header(v2root, true)}
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="glow glow-1" aria-hidden="true"></div>
    <div class="glow glow-2" aria-hidden="true"></div>
    ${doodle("doodle-hero")}
    <div class="wrap hero-inner">
      <div class="hero-top">
        <span>${esc(site.owner)} · Inshify Studio</span>
        <span class="status"><span class="dot" aria-hidden="true"></span>Available for new projects</span>
        <span>Portfolio ${YEAR}</span>
      </div>
      <div class="hero-stage">
        ${toolFloats}
        <div class="hero-copy">
          <h1 id="hero-title"><span class="line"><span>Graphic</span></span> <span class="line light"><span>Designer</span></span></h1>
          <p class="paren hero-paren">(Brand identity · Social media design · Logos)</p>
          <p class="lede">Logos, posts and identities that make your brand <mark class="hl">impossible to ignore.</mark></p>
          <div class="actions">
            <a class="btn btn-primary" href="#contact">Hire me ${icon.arrow}</a>
            <a class="btn btn-ghost" href="#work">See my work</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ticker(["Logo design", "Brand identity", "Social media design", "Carousels", "Display ads", "Stationery"], "✦", "ticker-tilt")}

  <section class="wrap section" id="featured" aria-labelledby="featured-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Featured</p>
        <h2 id="featured-title">A taste of what I can <span class="light">create for you</span></h2>
      </div>
      <a class="text-link" href="${site.instagram.url}" target="_blank" rel="noopener">More on Instagram ${icon.arrow}</a>
    </div>
    <div class="feat-list">
${featured
  .map((p, i) => {
    return `      <article class="feat-row${i % 2 ? " flip" : ""}" data-reveal>
        <div class="feat-copy">
          <span class="feat-n">${num(i)}</span>
          <h3>${mixTitle(p.title)}</h3>
          <p class="paren">(${esc(fullLabel(p))})</p>
          <dl class="feat-notes">
            <div><dt>The brief</dt><dd>${esc(p.brief)}</dd></div>
            ${p.idea ? `<div><dt>The idea</dt><dd>${esc(p.idea)}</dd></div>` : ""}
          </dl>
          <a class="btn btn-ghost" href="work/${p.slug}.html">View project ${icon.arrow}</a>
        </div>
        <a class="feat-media" href="work/${p.slug}.html" tabindex="-1" aria-hidden="true">${cover(p, root)}</a>
      </article>`;
  })
  .join("\n")}
    </div>
  </section>

  ${toolStrip}

  <section class="wrap section" id="work" aria-labelledby="work-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Work</p>
        <h2 id="work-title">Selected <span class="light">work</span></h2>
      </div>
      <p class="section-note">${projects.length} projects · ${new Set(projects.flatMap((p) => p.tags)).size} categories</p>
    </div>
    <div class="chips" role="group" aria-label="Filter work">
${filters.map((f, i) => `      <button class="chip" type="button" data-filter="${f.key}" aria-pressed="${i === 0}">${esc(f.label)} <span class="chip-n">${counts[f.key]}</span></button>`).join("\n")}
    </div>
    <p class="sr-only" id="filter-status" aria-live="polite"></p>
    <div class="grid" id="work-grid">
${projects.map((p, i) => card(p, root, v2root, i)).join("\n")}
    </div>
  </section>

  <section class="wrap section" id="services" aria-labelledby="services-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Services</p>
        <h2 id="services-title">What I can <span class="light">help you with</span></h2>
      </div>
      <p class="section-note services-note">From a first logo sketch to the last post in a campaign, I keep every piece clear, consistent and on-brand.</p>
    </div>
    <div class="grid services">
${[
  ["s-yellow", svc.logo, "Logo design", "A distinctive mark that works everywhere, from a profile picture to a shop sign."],
  ["s-blue", svc.brand, "Brand identity", "Color, type, patterns and guidelines that make your brand easy to spot."],
  ["s-sky", svc.social, "Social media design", "Posts and carousels that stop the scroll and stay on-brand."],
  ["s-ink", svc.print, "Ads & print", "Display ads, stationery and book covers with a clear point of view."],
].map(([cls, ic, title, text]) => `      <article class="service ${cls}" data-reveal><span class="service-ic">${ic}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join("\n")}
    </div>
  </section>

  <section class="wrap section" id="process" aria-labelledby="process-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Process</p>
        <h2 id="process-title">You are 5 steps away from a brand <span class="light">that stands out</span></h2>
      </div>
    </div>
    <div class="steps" role="list">
      <div class="step" role="listitem" data-reveal><span class="step-n">01</span><h3>Request</h3><p>Send your idea by DM, email or chat.</p></div>
      <div class="step" role="listitem" data-reveal><span class="step-n">02</span><h3>Quote</h3><p>Get a clear price and timeline.</p></div>
      <div class="step" role="listitem" data-reveal><span class="step-n">03</span><h3>Approve</h3><p>Confirm and lock in your start date.</p></div>
      <div class="step" role="listitem" data-reveal><span class="step-n">04</span><h3>Design</h3><p>Concepts crafted and refined with you.</p></div>
      <div class="step" role="listitem" data-reveal><span class="step-n">05</span><h3>Deliver</h3><p>Final files, ready for print and social.</p></div>
    </div>
  </section>

  <section class="wrap section" id="about" aria-labelledby="about-title">
    <div class="about">
      <div class="about-media" data-reveal>${portrait}</div>
      <div class="about-copy" data-reveal>
        <p class="eyebrow">About</p>
        <h2 id="about-title">Your friendly neighborhood <span class="light">Graphic Designer</span></h2>
        <p class="lede">Hi, I'm Insha, the designer behind Inshify Studio, turning ideas into logos, posts and identities that feel premium. My core work is social media design, supported by branding, logos, stationery and book covers.</p>
        <div class="actions">
          <a class="btn btn-primary" href="#contact">Free consultation</a>
          <a class="btn btn-ghost" href="${site.instagram.url}" target="_blank" rel="noopener">${esc(site.instagram.handle)}</a>
        </div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-col" data-reveal>
        <h3 class="dash-pill">Experience</h3>
        <ul>
${site.experience.map((e) => `          <li><strong>${esc(e.name)}</strong> <span>${esc(e.note)}</span></li>`).join("\n")}
          <li><strong>Inshify Studio</strong> <span>Own studio</span></li>
        </ul>
      </div>
      <div class="info-col" data-reveal>
        <h3 class="dash-pill">Skills</h3>
        <ul class="plain">
          <li>Social media design</li><li>Brand identity</li><li>Logo design</li><li>Carousels</li><li>Display ads</li><li>Stationery & book covers</li>
        </ul>
      </div>
      <div class="info-col" data-reveal>
        <h3 class="dash-pill">Contact</h3>
        <ul class="plain contact-list">
          <li><a href="${site.instagram.url}" target="_blank" rel="noopener">${icon.ig} ${esc(site.instagram.handle)}</a></li>
          <li><a href="${site.linkedin.url}" target="_blank" rel="noopener">${icon.in} ${esc(site.linkedin.handle)}</a></li>
          ${isPlaceholder(site.email) ? "" : `<li><a href="mailto:${esc(site.email)}">${icon.mail} ${esc(site.email)}</a></li>`}
          ${isPlaceholder(site.city) ? "" : `<li>${icon.pin} Based in ${esc(site.city)}</li>`}
        </ul>
      </div>
    </div>
    <div class="certs" role="group" aria-labelledby="certs-title">
      <h3 class="dash-pill" id="certs-title" data-reveal>Certificates</h3>
      <div class="cert-grid">
${site.certificates.map((c) => `        <a class="cert" href="assets/img/certificates/${c.img}.jpg" data-lightbox data-reveal><span class="cert-media"><img src="assets/img/certificates/${c.img}-sm.jpg" alt="${esc(`${c.kind}: ${c.title}, ${c.issuer}`)}" loading="lazy" decoding="async"></span><span class="cert-kind">${esc(c.kind)}</span><strong>${esc(c.title)}</strong> <span class="cert-issuer">${esc(c.issuer)}</span></a>`).join("\n")}
      </div>
    </div>
  </section>

  <section class="wrap section-tight" id="contact" aria-labelledby="contact-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Got a <span class="light">question?</span></h2>
      </div>
    </div>
    <div class="grid tiles">
      ${email}
      <a class="tile" href="${site.instagram.url}" target="_blank" rel="noopener"><span class="tile-ic">${icon.ig}</span><h3>DM on Instagram</h3><p>${esc(site.instagram.handle)}</p></a>
      <a class="tile tile-accent" href="${site.linkedin.url}" target="_blank" rel="noopener"><span class="tile-ic">${icon.in}</span><h3>Connect on LinkedIn ${icon.arrow}</h3><p>${esc(site.linkedin.handle)}</p></a>
    </div>
  </section>
</main>
${endBand("#contact")}
${lightbox}
${footer(root, v2root)}`;
}

// Same justified-row gallery as v1: equal heights per row, no crops, no orphans.
function galleryRows(images) {
  const aspect = (img) => img.w / img.h;
  const rows = [];
  let rest = images;
  if (images.length > 2 && aspect(images[0]) > 1.2) { rows.push([images[0]]); rest = images.slice(1); }
  const n = rest.length;
  if (!n) return rows;
  const a = rest.map(aspect);
  const total = a.reduce((s, x) => s + x, 0);
  const k = Math.min(n, n === 4 ? 2 : Math.max(1, Math.round(total / 2.9), Math.ceil(n / 4)));
  const pre = [0]; a.forEach((x) => pre.push(pre[pre.length - 1] + x));
  const dp = Array.from({ length: n + 1 }, () => Array(k + 1).fill(Infinity));
  const cut = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= Math.min(i, k); j++) for (let m = j - 1; m < i; m++) {
    const v = Math.max(dp[m][j - 1], pre[i] - pre[m]);
    if (v < dp[i][j]) { dp[i][j] = v; cut[i][j] = m; }
  }
  const out = [];
  for (let i = n, j = k; j > 0; j--) { const m = cut[i][j]; out.unshift(rest.slice(m, i)); i = m; }
  return rows.concat(out);
}

// PNG width and height from the IHDR chunk.
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
// Light or dark caption text for a tile background.
const onColor = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)";
};

// Logo system: the logo cut into primary, stacked and icon versions, in color and one-color on brand backgrounds.
function logoSystem(p, root) {
  if (!p.logoSystem) return "";
  const tiles = p.logoSystem.map((t) => {
    const base = `assets/img/logos/${t.file}`;
    const alt = `${p.title} ${t.label.toLowerCase()}`;
    let art;
    if (t.mask) {
      const { w, h } = pngSize(path.join(ROOT, `${base}-mask.png`));
      art = `<span class="logo-mask" role="img" aria-label="${esc(alt)}" style="-webkit-mask-image:url('${root}${base}-mask.png');mask-image:url('${root}${base}-mask.png');--a:${(w / h).toFixed(4)};background:${t.color}"></span>`;
    } else {
      const { w, h } = jpegSize(path.join(ROOT, `${base}.jpg`));
      art = `<img src="${root}${base}.jpg" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
    }
    return `      <figure class="logo-tile${t.wide ? " wide" : ""}" style="background:${t.bg};color:${onColor(t.bg)}" data-reveal>${art}<figcaption>${esc(t.label)}</figcaption></figure>`;
  });
  return `
  <section class="wrap logo-system" aria-labelledby="logo-system-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Logo system</p>
        <h2 id="logo-system-title">One mark, <span class="light">every format</span></h2>
      </div>
    </div>
    <div class="logo-grid">
${tiles.join("\n")}
    </div>
  </section>`;
}

// Mockups above the gallery: the posts on phones in a feed, or display ads in a browser window.
function mockup(p, root) {
  if (!p.mockup) return "";
  const imgs = p.mockup.pick.map((n) => p.images[n - 1]);
  const im = (img) => `<img src="${root}${img.sm}" alt="" width="${img.w}" height="${img.h}" loading="lazy" decoding="async">`;
  const acts = `<span class="ig-acts" aria-hidden="true">${["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z", "M4 12a8 8 0 1 1 3.4 6.5L4 20l1-3.6A8 8 0 0 1 4 12Z", "M21 4 3 11l7 2 2 7 9-16Z"].map((d) => `<svg viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`).join("")}</span>`;
  const post = (img) => `<span class="ig-bar" aria-hidden="true"><span class="ig-av"></span><span class="ig-name">${esc(p.title.replace(/^.*: /, ""))}</span><span class="ig-more">···</span></span>${im(img)}${acts}<span class="ig-lines" aria-hidden="true"><i></i><i></i></span>`;
  // Each phone scrolls like a feed: its post, then the start of the next one (another image from the project).
  const nextOf = (img) => p.images[(p.images.indexOf(img) + 1) % p.images.length];
  const inner = p.mockup.kind === "browser"
    ? `<div class="browser"><span class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><b></b></span>${im(imgs[0])}</div>`
    : imgs.map((img) => `<div class="phone"><div class="screen">${post(img)}${p.images.length > 1 ? post(nextOf(img)) : ""}</div></div>`).join("");
  const { bg } = p.cover;
  return `
  <section class="wrap mockups" aria-label="${esc(p.title)} ${p.mockup.kind === "browser" ? "in a browser" : "in the feed"}">
    <div class="mockup-stage ${p.mockup.kind}" style="--c1:${bg[0]};--c2:${bg[1]}" data-reveal>${inner}</div>
  </section>`;
}

// ---------- Project page ----------
function projectPage(p, i) {
  const root = "../";
  const v2root = "../";
  const next = projects[(i + 1) % projects.length];
  const count = p.images.length;
  let seen = 0;
  const rowsHtml = (images) => galleryRows(images)
    .map((row) => {
      const sum = row.reduce((s, img) => s + img.w / img.h, 0).toFixed(4);
      return `<div class="g-row" style="--sum:${sum};--n:${row.length}" data-reveal>${row
        .map((img) => {
          const eager = seen++ === 0;
          const srcset = img.sm === img.src ? "" : ` srcset="${root}${img.sm} 720w, ${root}${img.src} ${img.w}w" sizes="(max-width: 640px) 100vw, ${Math.round(Math.min(1120, img.w))}px"`;
          return `<a class="g-item" href="${root}${img.src}" data-lightbox style="--a:${(img.w / img.h).toFixed(4)};background-image:url('${root}${img.sm}')"><img src="${root}${img.sm}"${srcset} alt="${esc(img.alt)}" width="${img.w}" height="${img.h}" loading="${eager ? "eager" : "lazy"}" decoding="async"></a>`;
        })
        .join("")}</div>`;
    })
    .join("\n    ");
  // Several sets get a heading each; a single set is one plain gallery.
  const gallery = p.sets.length === 1
    ? rowsHtml(p.images)
    : p.sets
        .map((s, k) => `<div class="set-head" id="${esc(s.dir)}" data-reveal><h2 class="dash-pill">${num(k)} · ${esc(s.title)}</h2>${s.note ? `<p>${esc(s.note)}</p>` : ""}<span class="set-count">${s.images.length} ${s.images.length === 1 ? "design" : "designs"}</span></div>
    ${rowsHtml(s.images)}`)
        .join("\n    ");
  const brandSystem = p.palette ? `
  <section class="wrap brand-system" aria-labelledby="brand-system-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Brand system</p>
        <h2 id="brand-system-title">${p.typeSample || p.fonts ? `Color <span class="light">& type</span>` : `Color <span class="light">palette</span>`}</h2>
      </div>
      ${p.paletteNote ? `<p class="section-note">${esc(p.paletteNote)}</p>` : ""}
    </div>
    <ul class="swatches" data-reveal>
${p.palette.map((c) => `      <li class="swatch"><span class="chip" style="background:${esc(c.hex)}"></span><span class="sw-name">${esc(c.name)}</span><span class="sw-hex">${esc(c.hex)}</span><span class="sw-use">${esc(c.use)}</span></li>`).join("\n")}
    </ul>
    ${p.typeSample || p.fonts ? `<div class="type-grid${p.fonts ? "" : " solo"}">
${(p.fonts || []).map((f, k) => `      <div class="type-card" data-reveal><span class="dash-pill">${k ? "Body" : "Display"}</span><p class="type-name"${f.css ? ` style="font-family:${esc(f.css)}"` : ""}>${esc(f.name)}</p><p class="type-use">${esc(f.use)}</p>${f.css ? `<p class="type-sample" style="font-family:${esc(f.css)}">Freshly glazed every morning. Pick your orbit.</p>` : ""}</div>`).join("\n")}
      ${p.typeSample ? `<figure class="type-in-use" style="background:${esc(p.typeSample.bg)}" data-reveal><img src="${root}${p.typeSample.src}" alt="${esc(p.typeSample.alt)}" width="${p.typeSample.w}" height="${p.typeSample.h}" loading="lazy" decoding="async"><figcaption>Type in use, from the final designs</figcaption></figure>` : ""}
    </div>` : ""}
  </section>` : "";

  return `${head({ title: `${p.title} — ${fullLabel(p)} | ${site.name}`, description: `${p.brief} ${fullLabel(p)} by Insha, Graphic Designer at Inshify Studio.`, ogDescription: firstSentence(p.idea) || `${p.scope} by Insha at Inshify Studio.`, root, ogImage: p.logoSystem ? `assets/img/logos/${p.logoSystem[0].file}.jpg` : p.images[0].src, pagePath: `work/${p.slug}.html`, extraFonts: (p.fonts || []).some((f) => f.css) ? "family=Source+Sans+3:wght@400;600;700" : "" })}
<body>
${header(v2root, false)}
<main id="main" class="project">
  <div class="glow glow-1" aria-hidden="true"></div>
  <header class="wrap case-head">
    <a class="back" href="${v2root}index.html#work">${icon.back} All work</a>
    <div class="case-title">
      <div>
        <h1>${mixTitle(p.title)}</h1>
        <p class="paren">(${esc(fullLabel(p))})</p>
      </div>
      <span class="case-n" aria-hidden="true">${num(i)}</span>
    </div>
    <dl class="case-meta">
      <div><dt>Type</dt><dd>${esc(p.label)}</dd></div>
      <div><dt>Scope</dt><dd>${esc(p.scope)}</dd></div>
      <div><dt>Format</dt><dd>${count} ${count === 1 ? "design" : "designs"}</dd></div>
      <div class="case-meta-cta"><a class="btn btn-primary" href="${v2root}index.html#contact">Hire me ${icon.arrow}</a></div>
    </dl>
  </header>

  <section class="wrap case-notes" aria-label="About this project">
    <div class="note" data-reveal><h2 class="dash-pill">The brief</h2><p>${esc(p.brief)}</p></div>
    ${p.idea ? `<div class="note" data-reveal><h2 class="dash-pill">The idea</h2><p>${esc(p.idea)}</p></div>` : ""}
  </section>
${brandSystem}
${logoSystem(p, root)}
${mockup(p, root)}
${p.logoSystem ? "" : `  <section class="wrap gallery" aria-label="Project images">
    ${gallery}
  </section>`}

  <nav class="wrap next-wrap" aria-label="Next project">
    <a class="next-project" href="${next.slug}.html" data-reveal>
      <div class="next-copy">
        <span class="eyebrow">Next project · ${num((i + 1) % projects.length)}</span>
        <span class="next-title">${mixTitle(next.title)}</span>
        <span class="paren">(${esc(fullLabel(next))})</span>
      </div>
      <div class="next-media">${cover(next, root)}</div>
    </a>
  </nav>
</main>
${endBand(`${v2root}index.html#contact`)}
${lightbox}
${footer(root, v2root)}`;
}

fs.rmSync(path.join(OUT, "work"), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "work"), { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), home());
projects.forEach((p, i) => fs.writeFileSync(path.join(OUT, "work", `${p.slug}.html`), projectPage(p, i)));
// 404 page and sitemap.
function notFound() {
  const root = site.url ? `${site.url}/` : "/";
  return `${head({ title: `Page not found | ${site.name}`, description: site.description, ogDescription: "This page doesn't exist. Head back to the Inshify Studio portfolio.", root, ogImage: site.brandCard, pagePath: "404.html" })}
<body>
${header(root, false)}
<main id="main" class="wrap section">
  <p class="eyebrow">404</p>
  <h1 class="nf-title">This page wandered <span class="light">off-brand</span></h1>
  <p class="lede">The page you're looking for doesn't exist.</p>
  <div class="actions"><a class="btn btn-primary" href="${root}index.html">Back to home</a></div>
</main>
${footer(root, root)}`;
}
fs.writeFileSync(path.join(OUT, "404.html"), notFound());
// Old project URLs that now live inside another project keep working by forwarding there.
const moved = { "brand-overview-boards": "simple-logics.html#brand-overview-boards" };
for (const [from, to] of Object.entries(moved)) {
  fs.writeFileSync(path.join(OUT, "work", `${from}.html`), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved | ${esc(site.name)}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.url}/work/${to.split("#")[0]}">
<meta http-equiv="refresh" content="0; url=${to}">
</head>
<body><p>This project moved. <a href="${to}">Go to it</a>.</p></body>
</html>
`);
}
if (site.url) {
  const urls = ["", ...projects.map((p) => `work/${p.slug}.html`)].map((u) => `  <url><loc>${site.url}/${u}</loc></url>`);
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
}
console.log(`Built index.html, 404.html and ${projects.length} project pages.`);
