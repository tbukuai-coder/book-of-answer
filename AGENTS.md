# AGENTS.md - Book of Answers

## Project Overview

A mystical single-page web app — ask a question, watch numbers spin, see a shimmer reveal your fate.

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

### Automatic (recommended)

Just push to `main`. The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to Pages automatically.

```bash
git add -A
git commit -m "message"
git push
```

### Manual

```bash
npm run build
# Deploy dist/ to any static host
```

### Enable GitHub Pages (one-time)

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions`

## Project Structure

```
src/
├── App.jsx        # Main app logic and animation flow
├── App.css        # All styles and keyframes
├── answers.js     # 100 original answers (array of strings)
└── main.jsx       # React entry point
```

## Editing Answers

All 100 answers live in `src/answers.js`. They're just an array of strings — add, remove, or edit freely.

## Conventions

- Keep it mobile-first (test at 375px width)
- Maintain the dark mystical theme (gold on deep navy)
- Use `requestAnimationFrame` for JS-driven animations, CSS `transition`/`@keyframes` for simpler ones
- All answers must be original (no copyrighted text from the real Book of Answers)
