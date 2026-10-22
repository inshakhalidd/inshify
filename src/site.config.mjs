// Inshify Studio — site content.
// Edit this file, then run `node src/build.mjs` to regenerate index.html and work/*.html.
// Anything in [BRACKETS] is a placeholder Insha still needs to fill in.

export const site = {
  name: "Inshify Studio",
  owner: "Insha",
  role: "Graphic Designer",
  // Set to your live URL (no trailing slash), e.g. "https://inshify.netlify.app",
  // so Open Graph images and canonical links become absolute. Leave "" until you know it.
  url: "https://inshakhalidd.github.io/inshify",
  email: "inshifystudio@gmail.com",
  city: "Karachi",
  // Path to your portrait, e.g. "assets/img/portrait.jpg". Until then About shows `brandCard`.
  portrait: "",
  brandCard: "assets/img/inshify-logo.jpg",
  instagram: { handle: "@inshifyy", url: "https://www.instagram.com/inshifyy/" },
  linkedin: { handle: "inshakhalid", url: "https://www.linkedin.com/in/inshakhalid/" },
  description:
    "Inshify Studio is the portfolio of Insha, a graphic designer creating logos, brand identities and scroll-stopping social media design.",
  // Projects shown in "A taste of what I can create for you" (by slug).
  featured: ["e-rising-trainers", "brewkie", "valtora"],
  // Images used in the hero card stack: [slug, image number].
  hero: [["valtora", 1], ["e-rising-trainers", 2], ["e-rising-trainers", 6]],
  // Design software Insha uses (shown in v2).
  software: ["Photoshop", "Illustrator", "InDesign"],
  // Real experience shown under the hero (names only, no logos).
  experience: [
    { name: "E-Rising Trainers", note: "Client work" },
    { name: "Simple Logics", note: "Internship" },
  ],
};

// Filter chips on the work grid. `key` must match a project's `tags`.
export const filters = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid & internship" },
  { key: "brand", label: "Brand identity" },
  { key: "logos", label: "Logos" },
  { key: "carousels", label: "Carousels" },
  { key: "ads", label: "Ads" },
  { key: "samples", label: "Samples" },
];

const SAMPLE = "Sample work";

// Order, titles, labels and descriptions follow Insha-Works.pdf exactly.
// `brief` comes from the works PDF.
// Images live in assets/work/<slug>/01.jpg, 02.jpg … (plus optional 01-sm.jpg thumbnails).
// `scope` is the short deliverables line on project pages. `alt` describes what the images show. Add `idea: "…"` to show "The idea" on a project page.
export const projects = [
  {
    slug: "e-rising-trainers", scope: "Social media campaign · Carousels · Posters",
    title: "E-Rising Trainers",
    label: "Paid client work",
    tags: ["paid"],
    brief: "Social media campaign, carousels and promotional posters for a training institute.",
    alt: "E-Rising Trainers promotional poster",
  },
  {
    slug: "simple-logics", scope: "Social media posts",
    title: "Simple Logics",
    label: "Internship",
    sublabel: "Simple Logics",
    tags: ["paid"],
    brief: "Social media posts designed during my internship at Simple Logics.",
    alt: "Simple Logics social media post",
  },
  {
    slug: "brand-overview-boards", scope: "Brand overview boards",
    title: "Brand overview boards",
    label: "Internship",
    sublabel: "Simple Logics",
    tags: ["paid"],
    brief: "Brand overview boards for Smile Brilliant, Razor and Kinfolk, designed to build their portfolio.",
    alt: "Brand overview board",
  },
  {
    slug: "brewkie", scope: "Brand identity · Guidelines",
    title: "Brewkie",
    label: "Concept project",
    sublabel: "Brand identity",
    tags: ["brand"],
    brief: "Brand identity and guidelines for a coffee brand, from an AI-generated brief.",
    alt: "Brewkie brand guidelines page",
  },
  {
    slug: "orbit-bite", scope: "Logo · Stationery",
    title: "Orbit Bite",
    label: "Concept project",
    sublabel: "Brand identity",
    tags: ["brand"],
    brief: "Logo and stationery mockups for a food brand, from an AI-generated brief.",
    alt: "Orbit Bite logo and stationery",
  },
  {
    slug: "zenfits", scope: "Logo",
    title: "ZenFits",
    label: "Concept project",
    sublabel: "Brand identity",
    tags: ["brand"],
    brief: "Logo for a fitness brand, from an AI-generated brief.",
    alt: "ZenFits logo variations and colour palette",
  },
  {
    slug: "logo-design-service", scope: "Logo concepts",
    title: "Logo Design Service: Concept Options",
    label: "Logo service",
    tags: ["logos"],
    brief: "Three logo directions presented as options. Concept work, not used by any client.",
    alt: "Deep Summit logo concept option",
  },
  {
    slug: "graphicx-hub", scope: "Logo",
    title: "Graphicx Hub",
    label: "Logo",
    tags: ["logos"],
    brief: "Logo design for a graphics community brand, from an AI-generated brief.",
    alt: "Graphicx Hub logo, stacked and horizontal",
  },
  {
    slug: "bean-bliss", scope: "Logo · Stationery",
    title: "Bean Bliss",
    label: "Logo",
    tags: ["logos"],
    brief: 'Logo of a "B" joined with a coffee bean, with stationery mockups.',
    alt: "Bean Bliss logo on stationery mockups",
  },
  {
    slug: "valtora", scope: "Six-slide carousel",
    title: "Carousel Design Service: Valtora",
    label: "Concept project",
    sublabel: "Carousel service",
    tags: ["carousels"],
    brief: "Six-slide carousel built to show the carousel design service. Concept work.",
    alt: "Valtora carousel slide",
  },
  {
    slug: "google-ads-display", scope: "Display ad banners",
    title: "Google Ads Display Design",
    label: "Google Ads service",
    tags: ["ads"],
    brief: "Display ad banners in one set. Sample work.",
    alt: "Google Ads display banner set",
  },
  { slug: "tyr-skincare", scope: "Social media posts", title: "tyr Skincare", label: SAMPLE, tags: ["samples"], brief: "Social media post samples for a skincare brand.", alt: "tyr Skincare social media post sample" },
  { slug: "torpedo-line-consulting", scope: "Social post", title: "Torpedo Line Consulting", label: SAMPLE, tags: ["samples"], brief: "Social post sample.", alt: "Torpedo Line Consulting social post sample" },
];

// Project write-ups: "The idea" on each project page, plus fuller briefs for the samples.
// Written from what each design shows. Edit freely, then rebuild.
const writeups = {
  "e-rising-trainers": {
    idea: "One red-and-white system runs through every post, so the whole campaign reads as one brand in the feed. Course titles lead in bold type, dates and seats sit in clear blocks, and every poster ends with a single call to action.",
  },
  "simple-logics": {
    idea: "Deep navy backgrounds and electric-blue type give a tech company a confident, premium feel. Each post makes one point, from idea to launch or faster results with AI, and backs it with a clean diagram or 3D visual that reads at a glance.",
  },
  "brand-overview-boards": {
    idea: "Each board introduces a brand the way a client would first meet it: logo, a short overview and real product imagery on one page. The layout adapts to each brand's character, from a clean clinical look for Smile Brilliant to bold red for Razor and warm earth tones for Kinfolk.",
  },
  brewkie: {
    idea: "A warm coffee-brown palette and a playful cup-and-cookie mark give Brewkie a cosy, friendly personality. The guidelines cover the logo, colour palette, patterns, stationery and mockups, so the brand stays consistent wherever it appears.",
  },
  "orbit-bite": {
    idea: "The name became the idea: a bitten doughnut circled by a planet-like ring, in rich chocolate and cream. Rounded type and the tagline \"Orbit Your Taste\" keep it fun, and the stationery shows the mark working in print.",
  },
  zenfits: {
    idea: "Calm rather than loud: a refined serif wordmark with a small leaf accent and a soft sage palette position ZenFits as mindful fitness. The set includes horizontal, stacked and monogram versions, so the logo fits any space.",
  },
  "logo-design-service": {
    idea: "Three directions for one name, each built on a mountain peak: a layered purple triangle, a green twin-peak mark and a minimal blue line icon. Every option is shown on light and dark backgrounds, so a client can compare them side by side.",
  },
  "graphicx-hub": {
    idea: "A bold \"G\" made of two overlapping curves suggests creatives coming together in one place. Deep indigo and a pixel-style detail in \"HUB\" nod to digital design, with stacked and horizontal versions for every use.",
  },
  "bean-bliss": {
    idea: "The \"B\" and the coffee bean merge into one simple mark, so the brand and the product are remembered together. Soft browns and creams carry it across letterheads, envelopes and business cards.",
  },
  valtora: {
    idea: "The carousel tells one story across six slides: a hook, a plain explanation, the numbers, a comparison, the common doubt, and a clear call to follow. A violet palette and 3D icons keep a complex topic easy to swipe through.",
  },
  "google-ads-display": {
    idea: "Each set takes one offer and adapts it across standard display sizes, from wide leaderboards to tall skyscrapers. The discount and button stay prominent in every size, so the message lands even in the smallest slot.",
  },
  "tyr-skincare": {
    brief: "Social media posts for tyr, a men's skincare brand: a product launch post, a product range post and a customer review post.",
    idea: "Soft olive and cream tones, natural textures and plenty of space keep the look clean and calm. Real product shots stay the hero, and the review post turns customer feedback into a scroll-stopping visual.",
  },
  "torpedo-line-consulting": {
    brief: "A social media post for a consulting firm focused on security, governance and data-driven modernisation.",
    idea: "A dark, techy background frames a bright white card, so the message reads first. Yellow and navy split the headline \"Protect what matters most\", and one \"Consult now\" button gives a single clear next step.",
  },
};
for (const p of projects) Object.assign(p, writeups[p.slug]);
