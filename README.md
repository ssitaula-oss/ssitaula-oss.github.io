# Siddhartha Sitaula Portfolio

A responsive single-page portfolio website built with HTML, CSS, and JavaScript.

## Files

- `index.html`, `styles.css`, `script.js` — the main site
- `chess.html` — a standalone, playable chess game (see below)
- `resume.pdf` — powers the "Download resume" buttons
- `og-image.png` — social media link preview image

All of these must be deployed together in the same folder.

## Playable chess game

`chess.html` is a browser re-creation of the Java chess project, launched from
the "Play in browser ▶" link on the Chess project card. It includes:

- Full legal chess: castling, en passant, pawn promotion (auto-queen),
  check/checkmate/stalemate detection
- Legal move highlighting (dots for moves, rings for captures)
- A minimax AI opponent with alpha-beta pruning, or a two-player mode
- Undo, new game, last-move and check highlighting

The move generator was validated against standard perft reference counts
(initial position through depth 4, and the "Kiwipete" test position), so the
rules implementation is exact. Note for honesty in interviews: the original
project is Java — this page mirrors its logic in JavaScript so visitors can
play it without installing anything.

## HTTPS ("secure connection")

HTTPS comes from the host, not the code. On GitHub Pages: repo **Settings →
Pages → check "Enforce HTTPS"** (if greyed out, wait a few minutes after the
first deploy and refresh). Opening `index.html` directly from your computer
will always show "not secure" — that's just the `file://` protocol, and it
goes away once the site is hosted.


## How to open it

1. Unzip the folder.
2. Open `index.html` in Chrome, Safari, Firefox, or Edge.

## Important edits

Your email and GitHub profile are already filled in. Still to do — search inside `index.html` for:

- `Add your LinkedIn profile`
- `href="#"`

Replace those placeholders with your real LinkedIn and project repository links.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, and `script.js`.
3. Open the repository's **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose the `main` branch and `/root`.
7. Save.

GitHub will provide a public website link.

## Customize colors

At the top of `styles.css`, edit these values:

```css
--accent: #6ee7d8;
--accent-2: #8b8cff;
```

## Included features

- **Scroll-based single page** — classic smooth-scrolling layout with a fixed
  header, scroll-spy nav highlighting, a mobile drawer menu, and scroll-reveal
  animations. (A tabbed variant existed briefly; it was reverted by request.)
- **Rich hero introduction** — the landing section introduces Siddhartha with
  resume-sourced credentials as highlight chips (3.70 GPA, Dean's List ×2,
  Amigo Scholarship, languages).
- Dark and light theme
- Animated statistics (play once, the first time you open the About tab)
- Project filtering (with screen-reader-friendly result announcements)
- Contact form that opens the visitor's email application
- **Terminal access gate** — a boot-sequence "hacker terminal" intro that greets
  first-time visitors each session. Commands include:
  - Navigation: `home`, `about`, `skills`, `projects`, `experience`,
    `contact`, or `open <section>` — jumps straight into that tab once
    access is granted.
  - Fun/easter eggs: `whoami`, `ls`, `coffee`, `joke`, `date`, `hack`.
  - `help`, `clear`, `sudo`, or just press Enter / type `access` to walk in.
  Navigation commands scroll to that section after the gate closes. Shows
  once per browser session (`sessionStorage`), has a visible "Skip intro"
  button, and instantly reveals the site if reduced-motion is enabled.
  There's also a muted-by-default 🔇 sound toggle in the terminal's title bar
  for a subtle keystroke click.
- **Case study modal** — the Chess project's "Case study →" button opens an
  accessible dialog (Esc to close, click outside to close, focus returns to
  the trigger) with a problem/approach/what-I'd-do-differently write-up.
  The content lives in `caseStudies` inside `initCaseStudyModal()` in
  `script.js` — it's a draft based on a typical minimax chess AI, so double
  check the technical specifics (e.g. whether you actually used alpha-beta
  pruning) match what you really built before publishing.
- **Testimonials placeholder** — a "What people say" block on the Experience
  tab with two dashed placeholder cards, ready for real quotes from a
  supervisor, professor, or teammate.
- Scroll progress bar at the top of the page
- Click-to-copy email button
- Honeypot field on the contact form to cut down on basic bot spam
- SEO: Open Graph / Twitter card tags, canonical link, JSON-LD person schema
  (now including your real LinkedIn and GitHub), favicon, and an included
  `og-image.png` for link previews
- Accessibility: skip-to-content link, visible focus states, `aria-live`
  status updates, reduced-motion support throughout

## A few things to personalize

- **Add `resume.pdf` and `og-image.png` to the same folder as `index.html`.**
  Both are included in this delivery — `resume.pdf` powers the "Download
  resume" buttons, and `og-image.png` is what shows up when the site is
  shared on social media/iMessage. Without them in the repo root, those
  links/previews will 404 or fall back to nothing.
- In `index.html`, update the `canonical` URL and `og:image`/`og:url` domain
  once the site has a real domain (they currently point at a placeholder
  `siddharthasitaula.dev`).
- The terminal gate's boot lines and commands live near the top of
  `script.js` inside `initTerminalGate()` — edit `bootLines`,
  `staticCommands`, and `jokes` to change the wording.
- Project "Source code" links currently point to your GitHub profile as an
  interim destination — swap each for its specific repo URL when the repos
  are up.

