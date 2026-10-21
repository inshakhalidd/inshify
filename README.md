# Inshify Studio (v2 design)

Portfolio of Insha, graphic designer ([@inshifyy](https://www.instagram.com/inshifyy/)). It's a light-first, editorial design with dark mode, built with plain HTML, CSS and JavaScript.

**Live:** https://inshakhalidd.github.io/inshify/
**Previous design (v1):** https://github.com/inshakhalidd/Portfolio

## How it works

- All content lives in one file, `src/site.config.mjs`: projects, write-ups, contact details, software and featured picks.
- `node src/build.mjs` generates `index.html`, `work/<slug>.html`, `404.html` and `sitemap.xml`. The generated pages are committed, so hosting needs no build step.
- Styles are in `assets/css/styles.css`. Theme toggle, filters, chat, lightbox and scroll animations are in `assets/js/main.js`.
- Project images live in `assets/work/<slug>/01.jpg` and so on, each with a `-sm.jpg` thumbnail.

## Run locally (optional)

You need Node.js 18 or newer. Nothing else needs installing.

```bash
node src/serve.mjs
```

Then open http://localhost:4173.

## Deploy

GitHub Pages publishes from `main` at the repo root. Push a change, and the site updates within a minute or two.

## Voiceflow chat

Paste the web chat snippet into `src/partials/voiceflow.html`, then run `node src/build.mjs`. The snippet loads `versionID: 'production'`, so publish the agent in Voiceflow first.
