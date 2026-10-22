# Still needed from Insha

Unfilled placeholders are hidden on the live site. Each one appears automatically once you fill it in `src/site.config.mjs` and rebuild.

| Item | Where it goes | Until it's filled in |
|---|---|---|
| Portrait photo (optional) | `assets/img/portrait.jpg` + `site.portrait` | About shows your Inshify logo card (`site.brandCard`) |
| Original image files | `assets/work/<slug>/NN.jpg` | Images come from Insha-Works.pdf, resized to 1600px max. Swap in originals for sharper results |
| LinkedIn URL check | `site.linkedin.url` | Assumed `linkedin.com/in/inshakhalid`. Please confirm |

Done: live URL (`https://inshakhalidd.github.io/inshify`) and city (Karachi). The nav and footer use your brush logo, cut from your logo file (`assets/img/inshify-wordmark.png`). Your square logo (`assets/img/inshify-logo.jpg`) is the About image and the link preview when the site is shared.

## Project write-ups

Every project page has "The brief" and "The idea". The ideas, and fuller briefs for tyr Skincare and Torpedo Line Consulting, are draft copy written from what each design shows. Review and edit them in the `writeups` block at the end of `src/site.config.mjs`.

California Pizza, Sveston, Kababjees and foodpanda were removed from the portfolio. The Google Ads Display Design project still includes one California Pizza banner set.

## Choices made for you to review

- **Featured ("A taste of…"):** E-Rising Trainers, Brewkie, and Carousel Design Service: Valtora. Change these in `site.featured`.
- **Hero cards:** Valtora slide 1 and E-Rising Trainers posters 2 and 6.
- **Filter tags:**
  - E-Rising Trainers also appears under *Carousels*.
  - Brand overview boards also appears under *Brand identity*.
  - Orbit Bite and ZenFits also appear under *Logos*.
- **Logo Design Service** uses the works PDF label "Logo service · Concept options" and its description ("Concept work, not used by any client"). It names no client.
