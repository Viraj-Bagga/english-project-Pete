# Cathedral of Learning — Interactive Mini-Site

Mobile-first React + Vite prototype built to spec.

## Quick Start

- Node 18+
- Install deps:

```
npm install
```

- Dev server:

```
npm run dev
```

- Build:

```
npm run build && npm run preview
```

## Structure

- `src/components/` — `Hero`, `AccordionSection`, `ChevronIcon`
- `src/styles/` — theme and global styles with variables and utilities
- `src/assets/placeholders/` — grayscale placeholder images (SVG)
- `src/analytics/` — minimal client-only analytics module

## Analytics Hook

- Generates a session ID (persisted in `localStorage`).
- Tracks:
  - Section open counts
  - Total time on page per session
  - Average time across sessions (client-side, via aggregate in `localStorage`)
  - Most-opened section (derived)
  - Most-read section (time with section expanded)
- Queue with no-op sender. Configure endpoint via `VITE_ANALYTICS_ENDPOINT` (not sent by default in this prototype).
- Exposes `onPageLoad`/`onPageUnload` (wired in `App.jsx`).

## Accessibility

- Accordion headers use button semantics with `aria-expanded`/`aria-controls`.
- Panels use `role="region"` and are labelled via `aria-labelledby`.
- Focus states are visible and high contrast.

## Notes

- Parallax uses a lightweight `scroll` handler and `transform: translateY` for performance.
- Sections fade in when entering the viewport (IntersectionObserver).
- Smooth scrolling is 600ms cubic-bezier approximation.

## Placeholder Asset Attributions

These are generic grayscale SVG placeholders generated for prototyping only.

Hero image: Cathedral of Learning, via Wikimedia Commons
- URL: https://upload.wikimedia.org/wikipedia/commons/1/1c/Cathedral_of_Learning%2C_Pittsburgh%2C_PA.jpg
- License: Refer to the image page for license details (typically CC BY-SA on Wikimedia Commons).
