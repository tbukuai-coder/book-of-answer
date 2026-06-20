# 📖 The Book of Answers

A mystical single-page web app. Ask a question in your mind, click to reveal your fate.

**[Live Demo →](https://tbukuai-coder.github.io/book-of-answer/)**

## Features

- 🎲 Number cycling animation with progressive slowdown
- 📖 3D page-flip transition that reveals your answer
- ✨ 100 original mystical answers
- 📱 Mobile-first responsive design
- 🌙 Dark theme with gold accents and floating particles

## Tech Stack

- React + Vite
- `vite-plugin-singlefile` — inlines everything into one `index.html`
- GitHub Actions — auto-deploys to GitHub Pages on push to `main`

## Getting Started

```bash
# Clone the repo
git clone https://github.com/tbukuai-coder/book-of-answer.git
cd book-of-answer

# Install dependencies
npm install

# Run dev server
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` — a single `index.html` (~205KB) with all JS and CSS inlined. No server needed.

## Deploy

Push to `main` and the GitHub Actions workflow handles the rest:

```bash
git add -A
git commit -m "your message"
git push
```

The workflow builds the project and deploys `dist/` to GitHub Pages automatically.

To enable GitHub Pages (one-time):

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**

## Project Structure

```
book-of-answer/
├── src/
│   ├── App.jsx        # Main app with spin → stop → flip → reveal flow
│   ├── App.css        # All styles and animations
│   ├── answers.js     # 100 original answers
│   └── main.jsx       # React entry point
├── .github/
│   └── workflows/
│       └── deploy.yml # Auto-deploy to GitHub Pages
├── index.html         # Vite entry
├── vite.config.js     # Vite + singlefile plugin
└── package.json
```

## Answers

All 100 answers in `src/answers.js` are original. Add or edit them freely — they're just strings in an array.
