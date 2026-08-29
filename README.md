# Portfolio v2

Current personal portfolio — editorial, brutalist-leaning design. Supersedes [portfolio-v1](https://github.com/harsh4k/portfolio-v1).

**Live:** https://harshh.pages.dev/

## Pages

- **Intro** (`/`) — animated entry screen
- **Overview** (`/overview`) — about, journey, skills, projects, GitHub activity calendar, contact
- **Websites** (`/websites`) — project case studies (NexCart, Osynk, Synapical, Shipd, Rudo, EDITH, Velsaro)
- **Fun Code** (`/fun-code`) — playground / experiments
- **Posters** (`/posters`) — visual/graphic design pieces

## Features

- WebGL background effects (OGL)
- Scroll-driven animations (Motion) with smooth scrolling (Lenis)
- GitHub contribution calendar section
- PWA-enabled (installable, offline-capable via `vite-plugin-pwa`)
- Android build scaffold (`android/`)
- SEO basics: sitemap, robots.txt, well-known files

## Tech Stack

- React 19 + Vite 6
- Tailwind CSS 4
- Motion (animations) + Lenis (smooth scroll)
- OGL (WebGL rendering) + `@paper-design/shaders-react`
- GSAP
- React Router
- Lucide React (icons)

## Run Locally

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```
