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

for (const p of projects) {
  const dir = path.join(ROOT, "assets/work", p.slug);
  const files = fs.readdirSync(dir).filter((f) => /^\d+\.(jpe?g|png|webp)$/i.test(f)).sort();
  p.images = files.map((f, i) => {
    const base = f.replace(/\.[^.]+$/, "");
    const ext = path.extname(f);
    const sm = fs.existsSync(path.join(dir, `${base}-sm${ext}`)) ? `${base}-sm${ext}` : f;
    const size = /\.jpe?g$/i.test(f) ? jpegSize(path.join(dir, f)) : { w: 1200, h: 1200 };
    return { src: `assets/work/${p.slug}/${f}`, sm: `assets/work/${p.slug}/${sm}`, ...size, alt: files.length > 1 ? `${p.alt}, ${i + 1} of ${files.length}` : p.alt };
  });
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

// Software tiles: simple app-style badges in each tool's colours (drawn here, not official artwork).
const TOOLS = {
  Photoshop: { abbr: "Ps", cls: "t-ps" },
  Illustrator: { abbr: "Ai", cls: "t-ai" },
  InDesign: { abbr: "Id", cls: "t-id" },
  Canva: { abbr: "Canva", cls: "t-canva" },
};
const toolTile = (name, size = "") => `<span class="tool-tile ${TOOLS[name].cls} ${size}" data-abbr="${TOOLS[name].abbr}" aria-hidden="true"></span>`;

// A loose hand-drawn loop, echoing the doodle lines in the reference portfolios.
const doodle = (cls) => `<svg class="doodle ${cls}" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 360 C 140 120, 300 80, 380 220 S 300 440, 220 330 S 420 60, 640 170 S 880 420, 960 260 S 900 40, 1040 110 S 1180 300, 1230 200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

function head({ title, description, ogDescription = description, root, ogImage, pagePath, intro = false }) {
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap">
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
    <div class="footer-mark" aria-hidden="true"></div>
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

const ctaBand = (contactHref) => `<section class="wrap section-tight" aria-labelledby="cta-title">
  <div class="cta-band" data-reveal>
    ${doodle("doodle-cta")}
    <h2 id="cta-title">Already have an idea and <span class="light">want it designed?</span></h2>
    <a class="btn btn-dark" href="${contactHref}">Let's talk ${icon.arrow}</a>
  </div>
</section>`;

// Badge colour per project type, so paid, internship, concept, service and sample work read differently.
function badgeKind(p) {
  if (p.label === "Paid client work") return "paid";
  if (p.label === "Internship") return "intern";
  if (p.label === "Sample work") return "sample";
  if (/service/i.test(p.label)) return "service";
  return "concept"; // Brand identity / Logo concept projects
}
const firstSentence = (t) => (t ? t.split(/(?<=[.!?])\s+/)[0].trim() : "");

function card(p, root, v2root, i) {
  const img = p.images[0];
  return `<article class="card" data-tags="${p.tags.join(" ")}">
  <span class="card-n">${num(i)}</span>
  <div class="card-media"><img src="${root}${img.sm}" alt="${esc(img.alt)}" width="${img.w}" height="${img.h}" loading="lazy" decoding="async"></div>
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
    .map((name, i) => `<span class="float tool f${i + 1}" aria-hidden="true">${toolTile(name)}</span>`)
    .join("");
  const toolStrip = `<section class="wrap tools-strip" aria-labelledby="tools-title">
    <h2 class="dash-pill" id="tools-title">Software</h2>
    <ul class="tools-list">
${site.software.map((name) => `      <li>${TOOLS[name] ? toolTile(name, "sm") : ""}<span>${esc(name)}</span></li>`).join("\n")}
    </ul>
  </section>`;
  const email = isPlaceholder(site.email)
    ? `<button class="tile" type="button" data-open-chat><span class="tile-k">Chat</span><h3>Chat with my assistant</h3><p>Ask a quick question</p></button>`
    : `<a class="tile" href="mailto:${esc(site.email)}"><span class="tile-k">Email</span><h3>Email me</h3><p>${esc(site.email)}</p></a>`;
  const portrait = site.portrait
    ? `<img class="portrait" src="${root}${esc(site.portrait)}" alt="Portrait of Insha" width="680" height="820" loading="lazy">`
    : `<img class="portrait portrait-brand" src="${root}${esc(site.brandCard)}" alt="Inshify, graphic designer: the Inshify Studio logo" width="1080" height="1080" loading="lazy">`;
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
          <p class="paren hero-paren">( Brand identity · Social media design · Logos )</p>
          <p class="lede">Logos, posts and identities that make your brand impossible to ignore.</p>
          <div class="actions">
            <a class="btn btn-primary" href="#contact">Work with me ${icon.arrow}</a>
            <a class="btn btn-ghost" href="#work">See my work</a>
          </div>
        </div>
      </div>
    </div>
  </section>

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
    const img = p.slug === "e-rising-trainers" ? p.images[1] : p.images[0];
    return `      <article class="feat-row${i % 2 ? " flip" : ""}" data-reveal>
        <div class="feat-copy">
          <span class="feat-n">${num(i)}</span>
          <h3>${mixTitle(p.title)}</h3>
          <p class="paren">( ${esc(fullLabel(p))} )</p>
          <dl class="feat-notes">
            <div><dt>The brief</dt><dd>${esc(p.brief)}</dd></div>
            ${p.idea ? `<div><dt>The idea</dt><dd>${esc(p.idea)}</dd></div>` : ""}
          </dl>
          <a class="btn btn-ghost" href="work/${p.slug}.html">View project ${icon.arrow}</a>
        </div>
        <a class="feat-media" href="work/${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="${root}${img.sm}" alt="" width="${img.w}" height="${img.h}" loading="lazy" decoding="async"></a>
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
        <h2 id="services-title">I bring brands <span class="light">to life</span></h2>
      </div>
    </div>
    <div class="grid services">
      <article class="service" data-reveal><span class="dash-pill">01 · Logo design</span><h3>A distinctive mark <span class="light">that works everywhere.</span></h3></article>
      <article class="service" data-reveal><span class="dash-pill">02 · Brand identity</span><h3>Colour, type and a look <span class="light">that is yours.</span></h3></article>
      <article class="service" data-reveal><span class="dash-pill">03 · Social media design</span><h3>Scroll-stopping posts <span class="light">that stay on-brand.</span></h3></article>
    </div>
  </section>

  <section class="wrap section" id="process" aria-labelledby="process-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Process</p>
        <h2 id="process-title">You are 5 steps away from a brand <span class="light">that stands out</span></h2>
      </div>
    </div>
    <ol class="steps">
      <li class="step" data-reveal><span class="step-n">01</span><h3>Request</h3><p>Send your idea by DM, email or chat.</p></li>
      <li class="step" data-reveal><span class="step-n">02</span><h3>Quote</h3><p>Get a clear price and timeline.</p></li>
      <li class="step" data-reveal><span class="step-n">03</span><h3>Approve</h3><p>Confirm and lock in your start date.</p></li>
      <li class="step" data-reveal><span class="step-n">04</span><h3>Design</h3><p>Concepts crafted and refined with you.</p></li>
      <li class="step" data-reveal><span class="step-n">05</span><h3>Deliver</h3><p>Final files, ready for print and social.</p></li>
    </ol>
  </section>

  <section class="wrap section" id="about" aria-labelledby="about-title">
    <div class="about">
      <div class="about-media" data-reveal>${portrait}</div>
      <div class="about-copy" data-reveal>
        <p class="eyebrow">About</p>
        <h2 id="about-title">Your friendly neighbourhood <span class="light">graphic designer</span></h2>
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
${site.experience.map((e) => `          <li><strong>${esc(e.name)}</strong><span>${esc(e.note)}</span></li>`).join("\n")}
          <li><strong>Inshify Studio</strong><span>Own studio</span></li>
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
  </section>

${ctaBand("#contact")}

  <section class="wrap section-tight" id="contact" aria-labelledby="contact-title">
    <div class="section-head" data-reveal>
      <div>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Got a <span class="light">question?</span></h2>
      </div>
    </div>
    <div class="grid tiles">
      ${email}
      <a class="tile" href="${site.instagram.url}" target="_blank" rel="noopener"><span class="tile-k">Instagram</span><h3>DM on Instagram</h3><p>${esc(site.instagram.handle)}</p></a>
      <a class="tile tile-accent" href="${site.linkedin.url}" target="_blank" rel="noopener"><span class="tile-k">LinkedIn</span><h3>Connect on LinkedIn ${icon.arrow}</h3><p>${esc(site.linkedin.handle)}</p></a>
    </div>
  </section>
</main>
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

// ---------- Project page ----------
function projectPage(p, i) {
  const root = "../";
  const v2root = "../";
  const next = projects[(i + 1) % projects.length];
  const count = p.images.length;
  let seen = 0;
  const gallery = galleryRows(p.images)
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

  return `${head({ title: `${p.title} — ${fullLabel(p)} | ${site.name}`, description: `${p.brief} ${fullLabel(p)} by Insha, graphic designer at Inshify Studio.`, ogDescription: firstSentence(p.idea) || `${p.scope} by Insha at Inshify Studio.`, root, ogImage: p.images[0].src, pagePath: `work/${p.slug}.html` })}
<body>
${header(v2root, false)}
<main id="main" class="project">
  <div class="glow glow-1" aria-hidden="true"></div>
  <header class="wrap case-head">
    <a class="back" href="${v2root}index.html#work">${icon.back} All work</a>
    <div class="case-title">
      <div>
        <h1>${mixTitle(p.title)}</h1>
        <p class="paren">( ${esc(fullLabel(p))} )</p>
      </div>
      <span class="case-n" aria-hidden="true">${num(i)}</span>
    </div>
    <dl class="case-meta">
      <div><dt>Type</dt><dd>${esc(p.label)}</dd></div>
      <div><dt>Scope</dt><dd>${esc(p.scope)}</dd></div>
      <div><dt>Format</dt><dd>${count} ${count === 1 ? "design" : "designs"}</dd></div>
      <div class="case-meta-cta"><a class="btn btn-primary" href="${v2root}index.html#contact">Start a project ${icon.arrow}</a></div>
    </dl>
  </header>

  <section class="wrap case-notes" aria-label="About this project">
    <div class="note" data-reveal><h2 class="dash-pill">The brief</h2><p>${esc(p.brief)}</p></div>
    ${p.idea ? `<div class="note" data-reveal><h2 class="dash-pill">The idea</h2><p>${esc(p.idea)}</p></div>` : ""}
  </section>

  <section class="wrap gallery" aria-label="Project images">
    ${gallery}
  </section>

  <nav class="wrap next-wrap" aria-label="Next project">
    <a class="next-project" href="${next.slug}.html" data-reveal>
      <div class="next-copy">
        <span class="eyebrow">Next project · ${num((i + 1) % projects.length)}</span>
        <span class="next-title">${mixTitle(next.title)}</span>
        <span class="paren">( ${esc(fullLabel(next))} )</span>
      </div>
      <div class="next-media"><img src="${root}${next.images[0].sm}" alt="" width="${next.images[0].w}" height="${next.images[0].h}" loading="lazy" decoding="async"></div>
    </a>
  </nav>
</main>
${ctaBand(`${v2root}index.html#contact`)}
<dialog class="lightbox" aria-label="Image viewer">
  <button class="lb-close" type="button" aria-label="Close">${icon.close}</button>
  <button class="lb-prev" type="button" aria-label="Previous image">‹</button>
  <img alt="">
  <button class="lb-next" type="button" aria-label="Next image">›</button>
</dialog>
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
if (site.url) {
  const urls = ["", ...projects.map((p) => `work/${p.slug}.html`)].map((u) => `  <url><loc>${site.url}/${u}</loc></url>`);
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
}
console.log(`Built index.html, 404.html and ${projects.length} project pages.`);
