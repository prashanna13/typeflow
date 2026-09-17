# TypeFlow — Complete Touch-Typing Training Website

**TypeFlow** is a modern, free, and comprehensive touch-typing training platform built with vanilla HTML, CSS, and JavaScript. It teaches users from absolute zero (sitting position, hand placement, finding F and J) through every letter, number, symbol, and real-world typing scenarios.

## Features

### Complete Beginner-Friendly Curriculum

- **Level 0 — Getting Started:** Posture, hand placement, finding F and J bumps
- **Level 1 — Home Row:** ASDF JKL; drills
- **Level 2 — Home Row Center:** G and H reaches
- **Level 3 — Top Row:** QWERTY introduced gradually
- **Level 4 — Bottom Row:** ZXCVBNM and punctuation
- **Level 5 — All Letters:** Full alphabet practice
- **Level 6 — Capital Letters:** Shift key training
- **Level 7 — Punctuation:** Quotes, brackets, symbols
- **Level 8 — Numbers:** Number row training
- **Level 9 — Symbols:** Programming and special characters
- **Level 10 — Words:** From clusters to vocabulary
- **Level 11 — Sentences:** Full lines with flow
- **Level 12 — Real World:** School, office, email, programming, tech

**Total:** 100+ lessons, all free, no accounts required.

### Interactive Features

- **Live Keyboard Visualization:** On-screen keyboard with finger assignments
- **Animated Hands:** Visual finger guidance
- **Real-time WPM & Accuracy:** Calculated as you type
- **Weak Key Detection:** Auto-generates drills for your trouble spots
- **Progress Tracking:** Lessons, streaks, stats, achievements
- **Typing Tests:** 15s to 10min, multiple categories
- **Five Games:** Falling Keys, Word Sprint, Accuracy Challenge, Key Hunter, Keyboard Defender
- **Heatmap:** Visual weak-key map
- **Daily Practice Routine:** Structured 10-minute sessions

### No Backend Required

- **Static Site:** Deploy to GitHub Pages, Netlify, Vercel, or any static host
- **localStorage:** Progress saved in browser
- **Export/Import:** Download JSON backup, import on another device
- **No Accounts:** Zero sign-up friction
- **No Tracking:** No analytics, no cookies, no data collection
- **PWA-Ready:** Optional offline support via service worker

## Tech Stack

- **HTML5:** Semantic markup
- **CSS3:** Custom properties, Grid, Flexbox
- **Vanilla JavaScript:** ES modules, no frameworks
- **Fonts:** Manrope (UI), IBM Plex Mono (code/typing)
- **Icons:** Text-based (no icon library)

## Project Structure

```
typing/
├── index.html            # Landing page
├── trainer.html          # Lesson interface
├── lessons.html          # Curriculum roadmap
├── tests.html            # Typing tests
├── games.html            # Five typing games
├── progress.html         # Stats dashboard
├── guide.html            # Finger guide
├── daily.html            # Daily practice
├── weak.html             # Weak key trainer
├── about.html            # About page
├── contact.html          # Contact info
├── privacy.html          # Privacy policy
├── terms.html            # Terms of use
├── css/
│   ├── style.css         # Design tokens, base
│   ├── components.css    # UI components
│   └── responsive.css    # Media queries
├── js/
│   ├── app.js            # Shared nav/footer/theme
│   ├── keyboard.js       # Keyboard data & rendering
│   ├── engine.js         # Typing engine
│   ├── lessons.js        # Full curriculum
│   ├── storage.js        # localStorage CRUD
│   ├── trainer.js        # Lesson runner
│   ├── tests.js          # Test logic
│   ├── games.js          # Games
│   ├── progress.js       # Progress dashboard
│   ├── home.js           # Landing page
│   ├── curriculum.js     # Curriculum page
│   ├── guide.js          # Finger guide
│   ├── daily.js          # Daily practice
│   ├── weak.js           # Weak keys
│   └── page.js           # Generic page
├── assets/
│   └── favicon.svg       # Site icon
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker
├── robots.txt            # SEO
├── sitemap.xml           # Sitemap
├── brain.md              # Architecture doc
└── README.md             # This file
```

## Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in a browser — or serve via local server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. **Start learning** — no build step, no npm install

## Deployment

### GitHub Pages

1. Push to a repo
2. Settings → Pages → Deploy from branch `main`
3. Site live at `https://username.github.io/repo/`

### Netlify / Vercel / Cloudflare Pages

1. Connect repo
2. Build command: (none)
3. Publish directory: `/`
4. Deploy

### Custom Domain

Update these files with your domain:

- `robots.txt` → replace `typeflow.example`
- `sitemap.xml` → replace `typeflow.example`
- `manifest.json` → update `start_url` and `scope`
- `contact.html` → replace `hello@typeflow.example`

## Customization

### Change Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --bg: #0b0d10;
  --accent: #7c5cff;
  --success: #35d07f;
  /* ... */
}
```

### Add Lessons

Edit `js/lessons.js`:

```javascript
export const LESSONS = [
  {
    id: "13.1",
    level: "13",
    title: "Custom Lesson",
    kind: "drill",
    minutes: 5,
    keys: ["a", "b"],
    intro: "Your intro text",
    build: () => "your exercise text here"
  },
  // ...
];
```

### Change Fonts

Replace Google Fonts links in HTML `<head>` and update CSS:

```css
--font: "YourFont", system-ui, sans-serif;
--mono: "YourMono", ui-monospace, monospace;
```

## Browser Support

- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES Modules:** Required
- **localStorage:** Required
- **Service Worker:** Optional (PWA)

## Accessibility

- Semantic HTML5
- Keyboard navigation
- ARIA labels
- `prefers-reduced-motion` respected
- Focus indicators
- Color + shape for feedback (not color alone)

## Performance

- No frameworks, no bundler
- ~50KB CSS + JS combined (uncompressed)
- Fonts loaded async with `display=swap`
- Service worker caches static assets

## License

This project is open for educational and personal use. You may:

- Use it to learn touch typing
- Fork and modify for your own site
- Study the code

You may **not**:

- Sell the curriculum or site as a product
- Redistribute commercially without attribution

If you build something cool with this, a link back is appreciated but not required.

## Roadmap

Potential future additions:

- [ ] Multi-language keyboard layouts (AZERTY, QWERTZ, Dvorak, Colemak)
- [ ] Custom lesson uploads (user-provided text files)
- [ ] Bigram analysis (which key pairs cause trouble)
- [ ] Rolling WPM graph over time
- [ ] Shareable progress cards (static image export)

## Contributing

This is a reference implementation, not an active open-source project. If you find a bug or have a suggestion, feel free to fork and improve it for your own use.

## Contact

For questions or feedback: `hello@typeflow.example` (replace with actual email if deployed)

---

**TypeFlow** — Learn to type. Build muscle memory. Type with confidence.
