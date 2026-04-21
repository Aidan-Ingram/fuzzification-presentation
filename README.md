# FUZZIFICATION — Dynamic Presentation

A web-based presentation on the USENIX Security 2019 paper
_FUZZIFICATION: Anti-Fuzzing Techniques_ (Jung et al.), built with
**Reveal.js + TypeScript + Vite**.

This is not a Google Slides clone. It's a small web app: animated SVG
diagrams, code reveals, staggered fragments, and a cohesive aesthetic
(ink / bone / amber — terminal meets research paper).

---

## Quick start

```bash
# 1. install
npm install

# 2. dev server (hot reload)
npm run dev
# → opens http://localhost:3000

# 3. build static bundle
npm run build
# → outputs to dist/
```

Present directly from the dev server or from `dist/index.html` after build.

### Controls
- **Arrow keys** — next / previous slide
- **Space** — advance (including fragments)
- **Esc** — overview of all slides
- **S** — speaker notes window
- **F** — fullscreen
- **B** — black out the screen (for live Q&A pauses)

---

## What's in here

```
fuzzification-deck/
├── index.html              # all slides live here as <section> tags
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts             # Reveal.js init + slide-change hooks
│   ├── components/
│   │   └── loopAnimation.ts  # animated fuzzing-loop SVG
│   └── styles/
│       ├── main.css        # the design system (palette, type, slide styles)
│       └── reveal-override.css
└── public/                 # static assets (add paper PDF, images here)
```

### Slide roster

| #  | Slide                  | Notes                                             |
| -- | ---------------------- | ------------------------------------------------- |
| 1  | Title                  | Big display type, corner brackets, metadata row   |
| 2  | Fuzzing loop           | **Animated SVG** — arcs draw in sequence, loops   |
| 3  | Why anti-fuzzing?      | Three motivation cards with fragments             |
| 4  | Threat model           | Defender vs. attacker split                       |
| 5  | Three techniques       | Overview of SpeedBump / BranchTrap / AntiHybrid   |
| 6  | SpeedBump              | Code snippet + explanation                        |
| 7  | BranchTrap             | Code snippet + explanation                        |
| 8  | AntiHybrid             | Code snippet + explanation                        |
| 9  | Evaluation             | Big-number stats                                  |
| 10 | Take-away              | Pull quote + list                                 |
| 11 | **Unclear Content**    | Required section                                  |
| 12 | **Use of GenAI**       | Required section                                  |
| 13 | Q&A                    | Giant display slide                               |

---

## Editing guide

### Changing text
All slides are plain HTML in `index.html`. Find the section with the matching
`data-slide="..."` attribute and edit in place. Vite hot-reloads instantly.

### Adding a new slide
Duplicate any `<section data-slide="...">` block and give it a new slug.
That's it — Reveal picks it up automatically.

### Fragments (reveal-one-at-a-time)
Add `class="fragment"` to any element. It'll be hidden until you press space.

```html
<li class="fragment">This appears on a click.</li>
```

### Code snippets
Wrap in `<pre class="code"><code>...</code></pre>`. HTML-escape `<` as
`&lt;`, `>` as `&gt;`, and `&&` as `&amp;&amp;`.

### Replacing placeholder numbers
The evaluation slide uses placeholders (`>99%`, `<7%`). Search for
`data-slide="evaluation"` in `index.html` and swap in the exact figures from
the paper before presenting.

### Customizing the aesthetic
Open `src/styles/main.css`. The entire palette and type system is defined
in the `:root` block at the top:

```css
--ink-0: #0b0d0c;      /* deepest background */
--bone:  #e8e1d4;      /* primary text      */
--amber: #e8a93a;      /* accent            */
--display: 'Fraunces', serif;
--mono:    'JetBrains Mono', monospace;
```

Change these three colors and two fonts and the whole deck re-skins.

### Adding new animations
Follow the pattern in `src/components/loopAnimation.ts`: export a function,
call it from the `slidechanged` handler in `main.ts` when the right slide
becomes active.

---

## Exporting to PDF

Reveal.js has a built-in print stylesheet. To export:

```bash
# method 1: print from Chrome
# append ?print-pdf to the URL, then File → Print → Save as PDF
npm run dev
# navigate to http://localhost:3000/?print-pdf
# Cmd+P → Destination: Save as PDF → Layout: Landscape → Background graphics: ON

# method 2: decktape (automated)
npm install -g decktape
npm run build && npm run preview &
npm run pdf
```

---

## Deploying

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages.

### GitHub Pages (one-time setup)
```bash
npm run build
# commit dist/ or use a gh-pages action
```

Add this `.github/workflows/deploy.yml` if you want auto-deploy on push:

```yaml
name: Deploy
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Ideas for further dynamic elements

The scaffold gets you 80% there. Things you could add for extra polish:

- **Stack/memory diagram** for the SpeedBump slide that animates the
  delay loop executing
- **Interactive coverage bitmap** — a 64×64 grid where clicking a
  technique highlights which cells get polluted by BranchTrap
- **SMT solver "thinking" animation** for AntiHybrid — a spinning
  progress bar that stalls out to convey timeout
- **Live `highlight.js` integration** for proper code coloring (the
  package is already installed; import and call `hljs.highlightAll()`
  in `main.ts`)
- **Speaker-notes pane** — Reveal supports `<aside class="notes">` inside
  any slide; press `S` while presenting
