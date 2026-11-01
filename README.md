# Elegant 3D Portfolio

A premium, animated personal portfolio built with **Next.js 14 (App Router)**, **Three.js**, **GSAP** and **Tailwind CSS**. Interactive 3D hero, scroll-driven storytelling, case-study pages, MDX blog, validated contact form — production-ready and deployable to Vercel with zero extra config.

> **Start here:** almost all content lives in **`/data/site.ts`** (plus `projects.ts`, `skills.ts`, `experience.ts`, `testimonials.ts`). Search for `TODO:` and replace the placeholders with your details.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Requires Node.js **18.17+** (Node 22 LTS recommended).

## Environment variables

Copy the example and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | in production | Canonical URL used by SEO metadata, sitemap and OG images |
| `RESEND_API_KEY` | optional | Enables real email delivery for the contact form (via [resend.com](https://resend.com)). Without it, submissions are logged to the server console and marked `simulated`. |
| `CONTACT_TO_EMAIL` | recommended | Inbox that receives contact-form emails |
| `GITHUB_USERNAME` | optional | Powers the live GitHub stats section (graceful placeholder fallback if unset/wrong) |

## Editing content

| What | Where |
| --- | --- |
| Name, role, bio, socials, stats, services, availability | `data/site.ts` |
| Projects + full case studies | `data/projects.ts` |
| Skills, levels, marquee icons | `data/skills.ts` |
| Experience, education, certifications | `data/experience.ts` |
| Testimonials | `data/testimonials.ts` |
| Colors, fonts, shadows, radii | `app/globals.css` (CSS variables) + `tailwind.config.ts` |
| Blog posts | `content/blog/*.mdx` |
| Resume | `public/resume.pdf` (a generated placeholder ships with the repo) |

### Adding a blog post

Create `content/blog/my-post.mdx`:

```mdx
---
title: "My Post Title"
description: "One-sentence summary used for SEO and cards."
date: "2026-01-15"
tags: ["Next.js", "CSS"]
---

Your markdown/MDX here — code blocks are syntax-highlighted automatically.
```

Slug = filename. Reading time is computed automatically; the post appears in `/blog`, search, tags, RSS (`/feed.xml`) and sitemap.

### Adding a project

Append an entry to `data/projects.ts` (copy an existing one). Include `slug`, `summary`, `description`, `problem`, `solution`, `role`, `tech`, `results`, and links. Artwork: drop SVG/PNG images in `public/images/projects/` and reference them, or re-run the art generator (below).

### Regenerating placeholder assets

```bash
npm run generate:assets
```

- `scripts/generate-art.mjs` → SVG covers/gallery for every project + the portrait
- `scripts/generate-icons.mjs` → PWA icon set in `public/icons/` (needs `sharp`)
- `scripts/generate-resume.mjs` → placeholder `public/resume.pdf`
- `scripts/generate-og.mjs` → static Open Graph PNGs in `public/og/` (needs `sharp`)

> **Note on OG images:** they are pre-generated with sharp instead of runtime
> `next/og` rendering because `@vercel/og` fails to load when the project path
> contains spaces (e.g. Windows "My portfolio"). After editing
> `data/projects.ts` or blog posts, re-run the generator so share-cards match.

### Visual QA (optional)

`scripts/qa-screens.mjs` captures screenshots of every page/two themes via
system Chrome (`playwright-core`, dev dependency). Start the production server
(`npm run build && npm start`) then:

```bash
node scripts/qa-screens.mjs   # writes to ./qa
```

## Features

- **3D hero** — React Three Fiber + drei: distorted icosahedron, particle field, cursor-follow camera, scroll-linked motion, click shockwave + particle burst, adaptive DPR, render-pause off-screen, graceful fallback for no-WebGL / reduced motion
- **Motion system** — Lenis smooth scroll wired into GSAP ScrollTrigger, pinned horizontal featured-work gallery, self-drawing timeline, split-text headings, magnetic buttons, 3D-tilt + glare + spotlight cards, velocity-reactive marquee, scroll progress bar, circular back-to-top
- **UX** — session preloader with counter + curtain reveal, command palette (⌘K/Ctrl+K), custom cursor with contextual labels, dark/light themes (persisted, system-aware), toasts, Konami-code confetti, optional UI sounds (off by default)
- **Pages** — home, project case studies with lightbox galleries, blog index with live search + tag filters, MDX post pages, offline page, interactive 404
- **Contact** — RHF + Zod validation, honeypot, in-memory rate limiting, Resend delivery, animated success state
- **SEO & PWA** — metadata + OG/Twitter cards with dynamic `next/og` images per page, JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList), `sitemap.xml`, `robots.txt`, RSS feed, installable manifest + service worker with offline fallback, Vercel Analytics + Speed Insights

## Deploying to Vercel

### Via the dashboard

1. Push the repo to GitHub:
   ```bash
   git init && git add -A && git commit -m "Initial commit"
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com): **Add New → Project → Import** the repo. The Next.js preset is detected automatically — no build tweaks needed.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourname.vercel.app`), `CONTACT_TO_EMAIL`, and optionally `RESEND_API_KEY` + `GITHUB_USERNAME`.
4. **Deploy.**
5. Custom domain: **Settings → Domains → Add**, then follow the DNS instructions.

### Via the CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

### Resend setup (real contact emails)

1. Create an API key at resend.com and set `RESEND_API_KEY`.
2. For production, verify a domain in Resend and change the `from` address in `app/api/contact/route.ts` from `onboarding@resend.dev` to something like `portfolio@yourdomain.com`.

## Project structure

```
app/
  layout.tsx  page.tsx  globals.css  not-found.tsx  sitemap.ts  robots.ts
  manifest.ts  opengraph-image.tsx  icon.svg  offline/
  api/contact/route.ts   feed.xml/route.ts
  blog/            index + [slug] (MDX, search, tags, RSS)
  projects/[slug]/ case studies with lightbox galleries
components/
  layout/   navbar, footer, preloader, cursor, palette, providers…
  sections/ hero, about, skills, projects, experience, contact…
  three/    HeroScene (R3F canvas), HeroCanvas wrapper
  ui/       buttons, tilt cards, reveal, counters, toasts…
data/       ← edit your content here
content/blog/ *.mdx posts
lib/        utils, validation, rate-limit, github, blog, gsap
hooks/      media queries, session flags
public/     icons, images, resume.pdf, sw.js
scripts/    asset generators (art, icons, resume)
```

## Customization tips

- **Palette:** edit the CSS variables in `app/globals.css` (`:root` = dark, `.light` = light). Everything — Tailwind tokens, gradients, charts, 3D lighting — flows from them.
- **Fonts:** swap the `next/font/google` imports in `app/layout.tsx` and update `--font-space` / `--font-inter`.
- **3D centerpiece:** tune `distort`, geometry, light intensities in `components/three/HeroScene.tsx`.
- **Motion intensity:** easing curves live in `lib/gsap.ts` defaults and the `[0.22, 1, 0.36, 1]` easings throughout components.

## Roadmap ideas

- i18n language switcher
- AI "Ask about me" chatbot (LLM API route over site data)
- Guestbook / likes via Upstash Redis or Vercel KV
- Comments (Giscus) on blog posts
