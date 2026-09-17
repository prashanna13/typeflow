# TypeFlow Cognitive Architecture

TypeFlow is a free touch-typing training platform delivered as a static website. This document describes its decision architecture, storage strategy, curriculum design, and interaction model.

## Core Philosophy

TypeFlow teaches touch typing by beginning where absolute beginners actually are: uncertain about which finger to use, whether to look at the keyboard, and why this skill matters. The curriculum progresses from orientation (sitting, hand placement, finding F and J) through every letter, number, symbol, and eventually real-world sentences.

### Design Principles

1. **Accuracy precedes speed.** Rushing early teaches incorrect motor patterns.
2. **Eyes on screen, not keys.** Looking at the board resets muscle-memory formation.
3. **Home row is the anchor.** A S D F J K L ; are not beginner training wheels — they are the permanent orientation system.
4. **Each finger owns a vertical zone.** Users do not "hunt" with whichever finger is closest; they send the owner and return home.
5. **Mistakes are information, not failure.** TypeFlow tracks weak keys and auto-generates targeted practice.
6. **The entire curriculum is free.** No accounts, no paywalls, no trial clocks.

## System Architecture

### Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES modules)
- **Storage:** Browser `localStorage` (no backend, no database)
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages)
- **Offline:** Optional service worker for PWA capability

### File Organization

```
/
├── index.html            # Landing page with hero, curriculum overview, FAQ
├── trainer.html          # Active lesson interface
├── lessons.html          # Full curriculum roadmap
├── tests.html            # Timed typing tests (15s–10min)
├── games.html            # Five browser games
├── progress.html         # Stats, heatmap, achievements, export/import
├── guide.html            # Interactive finger guide
├── daily.html            # Structured daily practice routine
├── weak.html             # Weak-key drill generator
├── about.html            # Site description
├── contact.html          # Contact info
├── privacy.html          # Privacy policy
├── terms.html            # Terms of use
├── css/
│   ├── style.css         # Design tokens, base styles
│   ├── components.css    # UI components
│   └── responsive.css    # Media queries
├── js/
│   ├── app.js            # Shared chrome (nav, footer, theme, onboarding)
│   ├── keyboard.js       # Keyboard data, rendering, finger mapping
│   ├── engine.js         # Typing engine, WPM/accuracy calc
│   ├── lessons.js        # Full curriculum data
│   ├── storage.js        # localStorage CRUD, export/import
│   ├── trainer.js        # Lesson runner
│   ├── tests.js          # Typing test logic
│   ├── games.js          # Five game implementations
│   ├── progress.js       # Progress dashboard
│   ├── curriculum.js     # Curriculum page
│   ├── home.js           # Landing page
│   ├── guide.js          # Finger guide
│   ├── daily.js          # Daily practice
│   ├── weak.js           # Weak-key trainer
│   └── page.js           # Generic page script
├── assets/
│   └── favicon.svg       # Site icon
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker (optional)
├── robots.txt            # Search engine directives
├── sitemap.xml           # URL list for crawlers
└── brain.md              # This file
```

## Cognitive Model

### Data Structures

#### `localStorage` Schema

```json
{
  "version": 1,
  "createdAt": 1726538400000,
  "theme": "dark" | "light" | "system",
  "onboardingDone": true,
  "path": "new" | "basics" | "speed" | "test",
  "currentLesson": "1.3",
  "completed": { "0.1": true, "0.2": true, ... },
  "scores": {
    "1.3": { "wpm": 32, "accuracy": 94, "errors": 4, "timeMs": 84000, "at": 1726540000000 }
  },
  "streak": { "count": 7, "lastDay": "2026-09-17" },
  "totals": { "timeMs": 120000, "chars": 2400, "correct": 2280, "errors": 120, "sessions": 15 },
  "bestWpm": 45,
  "tests": [
    { "at": 1726540000000, "wpm": 38, "accuracy": 96, "errors": 6, "kind": "words", "duration": 60, "timedOut": false }
  ],
  "keys": {
    "q": { "hits": 12, "misses": 4 },
    "p": { "hits": 18, "misses": 9 },
    ...
  },
  "achievements": { "first-lesson": 1726540000000, "wpm-30": 1726541000000, ... },
  "daily": { "date": "2026-09-17", "steps": { "warm": true, "weak": false, ... } },
  "games": { "falling": 45, "sprint": 22, ... }
}
```

#### Keyboard Data Model

Each key is mapped to:

```javascript
{
  id: "a",
  label: "A",
  finger: "lp",  // Left pinky
  hand: "left",
  row: "home",
  shift: null,   // or the shifted character
  bump: false,   // true for F and J
  wide: null     // or "wide" / "wider" / "space"
}
```

Finger IDs: `lp` (left pinky), `lr` (ring), `lm` (middle), `li` (index), `lt` (thumb), `rt`, `ri`, `rm`, `rr`, `rp`.

#### Lesson Structure

```javascript
{
  id: "1.3",
  level: "1",
  title: "ASDF JKL;",
  kind: "drill" | "guide" | "checkpoint",
  minutes: 7,
  keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
  intro: "Both hands, still on home. No reaching yet.",
  build: () => "asdf jkl; fj as df jk l; asdf jkl;",  // Dynamic exercise generator
  body: "...",   // For guide lessons
  steps: ["..."] // For guide lessons
}
```

Levels 0–12 cover: getting started → home row → center → top → bottom → all letters → capitals → punctuation → numbers → symbols → words → sentences → real-world categories.

### Typing Engine

The engine (`js/engine.js`) manages:

- **State:** index, typed count, correct count, errors, marks array (`pending`, `done`, `miss`)
- **WPM calculation:** `(correctChars / 5) / minutes`
- **Accuracy:** `(correct / typed) * 100`
- **Event handling:** `keydown` listener, backspace support, finish detection
- **Timing:** Starts on first keypress, tracks elapsed milliseconds

The engine emits updates on every keystroke and a final snapshot on completion.

### Weak-Key Detection

After each session, TypeFlow:

1. Records hits and misses per key in `keys` object
2. Calculates accuracy: `hits / (hits + misses)`
3. Sorts keys by ascending accuracy
4. Generates drills from the bottom 5 keys with ≥6 total presses
5. Repeats those keys with neighbors in random clusters

### Achievements

Unlocked automatically when conditions are met:

- `first-lesson`: Complete any lesson
- `streak-3`, `streak-7`: Practice on consecutive days
- `chars-1k`, `chars-10k`: Total characters typed
- `wpm-30`, `wpm-50`, `wpm-80`: Hit WPM milestones with ≥80% accuracy
- `acc-98`: Session with ≥98% accuracy
- `beginner-course`: Complete lessons 0.1–1.10

### Onboarding Flow

On first visit, user sees a modal:

- **I'm completely new** → Lesson 0.1 (Meet the keyboard)
- **I know the basics** → Lesson 1.10 (Home-row checkpoint)
- **I want to improve my speed** → Typing test
- **I want to take a test** → Typing test

Modal is dismissed permanently after one choice.

## Interaction Model

### Navigation

Sticky navbar with:

- Logo (→ index.html)
- Learn (→ lessons.html)
- Practice (→ trainer.html or daily.html)
- Typing Test (→ tests.html)
- Games (→ games.html)
- Progress (→ progress.html)
- Theme toggle (◐)
- Progress pill (completion %, streak count)
- Mobile hamburger menu

### Lesson Flow

1. User opens `trainer.html?lesson=X.Y`
2. If lesson kind is `guide`: show text, steps, "Mark complete" button
3. If lesson kind is `drill` or `checkpoint`: render typing prompt, start engine on first keypress
4. On completion:
   - Record session (WPM, accuracy, errors, keys)
   - Mark lesson complete if accuracy ≥85%
   - Show completion card with next-lesson link

### Typing Test Flow

1. Select duration (15s–10min) and category (words, sentences, programming, etc.)
2. Click "Start test"
3. Type until time expires or passage ends
4. View result card (WPM, accuracy, consistency)
5. Save to test history

### Game Mechanics

All five games track score and high score, stored in `localStorage`.

- **Falling Keys:** Letters drop from top; press before they hit bottom
- **Word Sprint:** Type words against a 45s timer
- **Accuracy Challenge:** Type 24 letters without a single miss
- **Key Hunter:** Find random keys without looking
- **Keyboard Defender:** Type incoming words before they reach the bottom

## Progressive Disclosure

TypeFlow reveals complexity gradually:

- **Lesson 0:** Sitting, hands, F and J — no typing yet
- **Level 1:** Home row only
- **Level 2:** Add G and H (index reaches)
- **Level 3:** Top row, a few keys at a time
- **Levels 4–5:** Bottom row and all letters
- **Levels 6–9:** Capitals (Shift), punctuation, numbers, symbols
- **Levels 10–12:** Words, sentences, real-world contexts

## Performance Strategy

- **No frameworks:** Vanilla JS keeps bundle size near zero
- **Lazy font loading:** Manrope and IBM Plex Mono via Google Fonts with `display=swap`
- **Minimal animation:** Respect `prefers-reduced-motion`
- **Static assets:** SVG favicon, inline or local assets where possible
- **Service worker:** Optional caching for offline access

## Accessibility

- Semantic HTML5 (`<main>`, `<nav>`, `<section>`, `<button>`)
- ARIA labels on interactive elements
- Keyboard navigation for all UI
- `role="status"` for live WPM/accuracy updates during typing
- `aria-live="polite"` on typing prompt
- Focus indicators (`outline: 2px solid var(--accent)`)
- Color is not the sole indicator (correct = green + checkmark, error = red + shake animation)
- `prefers-color-scheme` respected (dark/light/system theme)

## Future Extension Points

TypeFlow's architecture supports:

- **Custom lessons:** User-uploaded text files
- **Multi-language keyboards:** AZERTY, QWERTZ, Dvorak, Colemak
- **Advanced stats:** Rolling average WPM, consistency graph, key-pair bigram analysis
- **Social features:** Shareable progress cards (still no accounts)
- **Gamification:** Badges, leaderboards (local-only or opt-in export)

## Deployment Checklist

Before deploying:

1. Replace `typeflow.example` in `robots.txt` and email addresses with actual domain
2. Generate a real `favicon.svg` or multi-size PNG set
3. Write `manifest.json` with correct `start_url` and `scope`
4. Write `sw.js` service worker or remove PWA references
5. Generate `sitemap.xml` with actual URLs
6. Test all links (no 404s)
7. Test localStorage export/import
8. Test theme toggle
9. Test all lessons load and complete
10. Test typing tests record results
11. Test games save high scores
12. Test progress dashboard renders stats
13. Verify responsive layout on mobile/tablet
14. Run Lighthouse audit (aim for 95+ on all axes)
15. Test keyboard navigation
16. Verify ARIA labels and focus indicators

## Known Limitations

- **No server-side sync:** Progress is per-device unless manually exported
- **No multi-user support:** One progress file per browser
- **English QWERTY only:** Other layouts require new key mappings
- **No live multiplayer:** Games are single-player
- **No screenreader audio cues for typing feedback:** Visual only

## Contact and Contributions

TypeFlow is a static educational tool. View source, fork the structure, adapt the curriculum. The goal is a useful, honest typing trainer — not a guarded product.

---

*Last updated: 2026-09-17*
