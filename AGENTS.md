# AGENTS.md - Book of Answers

## Project Overview

A mystical single-page web app — ask a question, watch numbers spin, see a page-flip reveal your fate.

**Live:** https://tbukuai-coder.github.io/book-of-answer/

## Tech Stack

- React + Vite
- `vite-plugin-singlefile` — inlines everything into one `index.html` (~205KB)
- GitHub Actions — auto-deploys to Pages on push to `main`

## Build & Run

```bash
npm install        # install deps
npm run dev        # local dev server
npm run build      # production build → dist/index.html
```

The build outputs a **single `index.html`** with all JS and CSS inlined. No server required — works anywhere (GitHub Pages, Netlify, S3, etc.)

## Deploy

```bash
git add -A
git commit -m "message"
git push
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to Pages automatically.

## Project Structure

```
src/
├── App.jsx        # Main app: spin → stop → page-flip → reveal flow
├── App.css        # All styles, animations, and keyframes
├── answers.js     # 100 original answers (just an array of strings)
└── main.jsx       # React entry point
```

## Animation Flow

1. **Idle** — book shows "?" with pulsing "Open the Book" button
2. **Spinning** — numbers 01-100 cycle rapidly with progressive slowdown
3. **Stopping** — number lands with a pulse glow, brief "Page found" pause
4. **Page Flip** — 3D `rotateY` animation flips from page number to answer (1.2s)
5. **Revealed** — answer text fades in with blur effect

## Editing Answers

All 100 answers live in `src/answers.js`. They're just an array of strings — add, remove, or edit freely.

## Conventions

- Keep it mobile-first (test at 375px width)
- Maintain the dark mystical theme (gold on deep navy)
- Animations should feel smooth — use `requestAnimationFrame` for JS-driven animations, CSS `transition`/`@keyframes` for simpler ones
- All answers must be original (no copyrighted text from the real Book of Answers)
- Casual, no-BS communication style
