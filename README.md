# CVSense

Resume screening that explains itself. Drop resumes in, paste a job description, and every candidate gets a score you can trace back to actual evidence — with no server, no build step, and no resume text leaving the browser.

Version 2 adds PDF/DOCX ingestion, a semantic matching layer, and a persistent multi-role workspace.

---

## Run it

No dependencies and no build. You need Node 18+ (or Python, if you prefer), run from inside this folder:

```bash
npm start
```

Then open <http://localhost:3000>. Stop it with <kbd>Ctrl</kbd>+<kbd>C</kbd>.

The start script runs `server.mjs`, a 60-line static server bundled here — nothing to install. If the port is taken:

```bash
PORT=3001 npm start
```

On Windows Command Prompt, use `set PORT=3001 && npm start`.

If you would rather use Python:

```bash
python3 -m http.server 3000
# Windows: py -m http.server 3000
```

### Troubleshooting

**Blank page, or the console says a module was blocked.** Do not double-click `index.html`. Browsers refuse ES modules on `file://`, so the app must be served over HTTP — use one of the commands above and open the `http://localhost:...` URL.

**`npm start` says it cannot find package.json.** The command has to run from this folder (the one containing `index.html`), not from your home directory. `cd` into it first.

**`npm: command not found`.** Node isn't installed, or isn't on your PATH. Install Node 18+ from nodejs.org, or use the Python command instead.

**`Port 3000 is already in use`.** Another server is running. Start on a different port with `PORT=3001 npm start` and open that URL.

**It loads but nothing saves.** Private/incognito windows and some strict browser settings block `localStorage`; the app still works for the session, but reloads reseed the demo.

The workspace is preloaded with three roles (Senior Frontend Engineer, Data Scientist, Product Designer), five job presets and thirteen sample resumes, so scoring is visible immediately. Use **Roles → Reset demo data** to return to that state at any time.

---

## What it does

### Screen a role
- Paste a job description; skills are detected from the wording, not matched against a fixed list.
- Mark each detected keyword as **Must**, **Nice**, **Keyword** (relevance only) or **Ignore**.
- Add must-have and nice-to-have skills by hand. Press <kbd>Enter</kbd> or type a comma.
- Set minimum years and an education level.
- Adjust the five scoring weights — they renormalise to 100% live, so the pool re-ranks as you drag.

### Add candidates
- Paste resume text, or drop files anywhere on the page.
- Supported: **PDF** (with a text layer), **DOCX**, **TXT**, **MD** — up to 10 files at a time.
- Parsing happens entirely in the browser using `DecompressionStream`; nothing is uploaded.
- Duplicates are rejected by email address within a role, and the reason is reported.
- Image-only or scanned PDFs are refused with a clear message rather than scored on empty text.

### Review
- Candidate cards show the score ring, must-have coverage, matched skill chips and adjacent-evidence chips.
- The profile drawer shows:
  - the five component scores with their weights,
  - a must-have checklist with mention counts and snippets,
  - the semantic evidence, including the wording that triggered it,
  - nice-to-haves found and missing,
  - flags (short resume, missing dates, employment gaps, unmet bars),
  - profile facts, recruiter notes, and the original resume text.
- Pipeline stages: New, Shortlist, On hold, Rejected.
- Compare up to three candidates side by side, with the best value in each row highlighted.
- Export the current role's ranked pool as CSV, including the role name and semantic evidence.

### Workspace
- Each role owns its criteria, keyword overrides, weights and candidate pool.
- Create a role blank or from a preset; duplicate it (criteria only), archive it, or delete it with its candidates.
- State persists in `localStorage` under `cvsense.v2.workspace`. The Roles screen shows the save status, and surfaces a message if the browser blocks or exhausts storage.
- Hiding or archiving a role never deletes its data; archived roles stay restorable.

---

## How scoring works

Overall score = weighted sum of five components, each 0–100:

| Component | Default weight | What it measures |
| --- | --- | --- |
| Keyword skills | 45 | Must-have and nice-to-have coverage, weighted by evidence depth |
| Experience | 20 | Relevant years against the role's minimum |
| Education | 5 | Highest level found against the requirement |
| Description relevance | 15 | Cosine similarity between the resume and the description |
| Semantic fit | 15 | Concept-level matches for skills phrased differently |

Details that matter:

- **Must-have cap.** If a must-have skill has no direct or adjacent evidence, the final score is capped, so a polished but unqualified resume cannot rank top.
- **Evidence depth.** A skill mentioned once in a list scores 1.0; passing mentions and very short resumes are discounted (0.85 / 0.6).
- **Relevant years.** Date ranges are attributed to the role title above them, so unrelated earlier jobs do not inflate experience.
- **Semantic credit.** An adjacent concept counts at 55% of a direct mention. Each concept is a fixed, readable mapping ("predictive models" → machine learning); this is deliberately not a neural embedding model, so every point is explainable and reproducible.
- **Deterministic.** The same resume and criteria always produce the same score. All parsing and scoring is local; there are no model calls.

---

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell: sidebar, topbar, tabbar, drawer, modal and drop-overlay roots |
| `styles.css` | Design system (palette `#F8F9FA`, `#F3F4F6`, `#1F2937`, `#2563EB`, `#0EA5E9`), responsive layout |
| `app.js` | State, persistence, screens, drawer, modals, uploads, CSV export, role management |
| `nlp.js` | Resume parsing, skill detection, semantic concepts, scoring |
| `data.js` | Seed roles, job presets, sample resumes |
| `extract.js` | PDF / DOCX / TXT / MD text extraction |
| `package.json` | `npm start` static server script |

No third-party runtime dependencies.

---

## Browser support

Needs ES modules, `DecompressionStream` and `crypto`-free modern APIs. Current Chrome, Edge, Firefox and Safari all work. `localStorage` must be available for the workspace to persist; the app remains usable without it, but reloads will reseed the demo.

PDF support covers text-based files using standard Flate compression. Encrypted PDFs, scanned images and unusual encodings are rejected with an error; convert them to DOCX or paste the text.

---

## Privacy

Everything — reading files, parsing resumes, scoring, storing notes — happens in the browser tab. There are no analytics, no fonts or scripts fetched from third parties, and no network requests after the page loads. Clearing site data deletes the workspace.
