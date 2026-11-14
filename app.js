// ============================================================================
// CVSense v2 — multi-role workspace, local persistence, PDF/DOCX intake,
// transparent keyword + semantic screening. All state lives in the browser.
// ============================================================================

import { SEED_JOBS, DEFAULT_JOB, JOB_PRESETS, SAMPLE_CANDIDATES } from "./data.js";
import {
  buildProfile,
  parseResume,
  scoreCandidate,
  weightPercents,
  EDUCATION_LEVELS,
  levelLabel,
  TIER_COLORS,
  DEFAULT_WEIGHTS,
} from "./nlp.js";
import { extractResume } from "./extract.js";

/* ---------------------------------- icons --------------------------------- */

const P = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  layers: '<path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  briefcase:
    '<rect x="2.5" y="7" width="19" height="13" rx="2.5"/><path d="M8.5 7V5.5A2 2 0 0 1 10.5 3.5h3a2 2 0 0 1 2 2V7"/><path d="M2.5 12.5h19"/>',
  users:
    '<path d="M16 20v-1.6a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4V20"/><circle cx="9.2" cy="7.5" r="3.3"/><path d="M21.5 20v-1.6a4 4 0 0 0-3-3.85"/><path d="M16.2 4.4a3.3 3.3 0 0 1 0 6.2"/>',
  columns:
    '<rect x="3" y="4" width="7.2" height="16" rx="2"/><rect x="13.8" y="4" width="7.2" height="16" rx="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z"/>',
  trash:
    '<path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M6.5 7l.8 12.1A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.9L17.5 7"/><path d="M10.5 11v6M13.5 11v6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  alert: '<path d="M12 3.5 21 19H3z"/><path d="M12 9.5v4M12 16.6v.4"/>',
  upload: '<path d="M12 16V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  spark: '<path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.9 5.9l2.4 2.4M15.7 15.7l2.4 2.4M18.1 5.9l-2.4 2.4M8.3 15.7l-2.4 2.4"/>',
  arrow: '<path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
  file: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M13.5 3v5H19"/><path d="M9 13h6M9 16.5h4"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
  cap: '<path d="M2.5 9.2 12 4.5l9.5 4.7L12 14z"/><path d="M6.5 11.4V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.7v.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  download: '<path d="M12 4v12M7.5 11.5 12 16l4.5-4.5"/><path d="M4 19.5h16"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V9"/><path d="M10 13h4"/>',
  restore: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4.5V11h6.5"/>',
  save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><path d="M8 20v-6h8v6"/>',
};

function icon(name, cls = "") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;
}

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 10.5h13M9 16h8.5M9 21.5h5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><circle cx="23.5" cy="21.5" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m22.2 21.5 1 1 1.9-2.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* --------------------------------- helpers -------------------------------- */

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const app = document.getElementById("app");
const sidebar = document.getElementById("sidebar");
const tabbar = document.getElementById("tabbar");
const topbar = document.getElementById("topbar");
const drawerEl = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const modalRoot = document.getElementById("modalRoot");
const toastRoot = document.getElementById("toastRoot");
const dropOverlay = document.getElementById("dropOverlay");
const dropIcon = document.getElementById("dropIcon");

const STORE = "cvsense.v2.workspace";
const STAGES = [
  { id: "new", label: "New" },
  { id: "shortlist", label: "Shortlist" },
  { id: "hold", label: "On hold" },
  { id: "reject", label: "Rejected" },
];
const NAV = [
  { id: "dashboard", label: "Overview", icon: "grid" },
  { id: "roles", label: "Roles", icon: "layers" },
  { id: "job", label: "Criteria", icon: "briefcase" },
  { id: "candidates", label: "Candidates", icon: "users" },
  { id: "compare", label: "Compare", icon: "columns" },
];

const clone = (v) => JSON.parse(JSON.stringify(v));

function initials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function avatarClass(id) {
  let n = 0;
  for (let i = 0; i < String(id).length; i++) n += String(id).charCodeAt(i);
  return "c" + (1 + (n % 5));
}

function tierColor(tier) {
  return TIER_COLORS[tier] || TIER_COLORS.good;
}

function ring(score, tier, sizeClass = "") {
  return `<div class="ring ${sizeClass}" style="--pct:${score};--ring:${tierColor(
    tier
  )}" role="img" aria-label="Match score ${score} out of 100"><span>${score}</span></div>`;
}

function badge(tier, label) {
  return `<span class="badge badge-${tier}">${icon(
    tier === "strong" ? "check" : tier === "weak" ? "alert" : "target"
  )}${esc(label)}</span>`;
}

function barClass(v) {
  return v >= 70 ? "" : v >= 45 ? "is-amber" : "is-rose";
}

function timeAgo(ts) {
  const ms = typeof ts === "number" ? ts : new Date(ts).getTime();
  const s = Math.max(1, (Date.now() - ms) / 1000);
  if (s < 90) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fmtYears(y) {
  if (!y) return "0 yrs";
  return `${y % 1 === 0 ? y : y.toFixed(1)} yrs`;
}

function jobById(id) {
  return state.jobs.find((j) => j.id === id);
}

function activeJob() {
  return jobById(state.activeJobId) || state.jobs.find((j) => !j.archived) || state.jobs[0] || null;
}

function getCandidate(id) {
  return state.candidates.find((c) => c.id === id);
}

function getResult(id) {
  return state.results.find((r) => r.candidateId === id);
}

function stageLabel(id) {
  return (STAGES.find((s) => s.id === id) || STAGES[0]).label;
}

/* ---------------------------------- state --------------------------------- */

const state = {
  screen: "dashboard",
  jobs: [],
  candidates: [],
  activeJobId: null,
  results: [],
  profile: null,
  filters: { q: "", stage: "all", sort: "score" },
  compare: [],
  selectedId: null,
  modal: null,
  addError: "",
  activePreset: null,
  newRolePreset: null,
  log: [],
  savedAt: null,
  storageError: false,
  lastError: "",
};

let toastTimer = null;
let saveTimer = null;

function hydrateCandidate(raw) {
  return {
    ...raw,
    stage: raw.stage || "new",
    starred: !!raw.starred,
    notes: raw.notes || "",
    parsed: parseResume(raw.resumeText || ""),
  };
}

function normalizeJob(job) {
  return {
    ...job,
    mustHave: Array.isArray(job.mustHave) ? job.mustHave : [],
    niceHave: Array.isArray(job.niceHave) ? job.niceHave : [],
    weights: { ...DEFAULT_WEIGHTS, ...(job.weights || {}) },
    keywordOverrides: job.keywordOverrides || {},
    archived: !!job.archived,
  };
}

function seedWorkspace() {
  state.jobs = SEED_JOBS.map((j) => normalizeJob(clone(j)));
  state.candidates = SAMPLE_CANDIDATES.map((c) => hydrateCandidate(clone(c)));
  state.activeJobId = state.jobs[0].id;
  state.log = [
    { ts: Date.now() - 1000 * 60 * 42, text: "Sofia Alvarez moved to Shortlist", kind: "green" },
    { ts: Date.now() - 1000 * 60 * 60 * 4, text: "Workspace created with 3 open roles", kind: "" },
    { ts: Date.now() - 1000 * 60 * 60 * 26, text: "13 resumes imported from the sample pool", kind: "amber" },
  ];
  state.savedAt = Date.now();
}

function loadWorkspace() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORE);
  } catch {
    return false;
  }
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.jobs) || !data.jobs.length) return false;
    state.jobs = data.jobs.map(normalizeJob);
    state.candidates = (data.candidates || [])
      .filter((c) => c && c.resumeText)
      .map(hydrateCandidate);
    const savedActive = data.activeJobId;
    const chosen = state.jobs.find((j) => j.id === savedActive && !j.archived) || state.jobs.find((j) => !j.archived);
    state.activeJobId = (chosen || state.jobs[0]).id;
    state.log = Array.isArray(data.log) ? data.log.slice(0, 20) : [];
    state.savedAt = Date.now();
    return true;
  } catch {
    return false;
  }
}

function serialize() {
  return {
    v: 2,
    activeJobId: state.activeJobId,
    jobs: state.jobs,
    candidates: state.candidates.map(({ parsed, ...rest }) => rest),
    log: state.log.slice(0, 20),
  };
}

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(serialize()));
      state.savedAt = Date.now();
      state.storageError = false;
    } catch (err) {
      state.storageError = true;
      state.lastError = err && err.name === "QuotaExceededError" ? "Browser storage is full." : "Saving is blocked in this browser.";
    }
  }, 250);
}

function recompute() {
  const job = activeJob();
  if (!job) {
    state.profile = null;
    state.results = [];
    return;
  }
  state.profile = buildProfile(job);
  const pool = state.candidates.filter((c) => c.jobId === job.id);
  state.results = pool.map((c) => scoreCandidate(c, state.profile, job.weights));
}

function log(text, kind = "") {
  state.log.unshift({ ts: Date.now(), text, kind });
  state.log = state.log.slice(0, 20);
}

function toast(message, type = "ok") {
  const iconName = type === "err" ? "alert" : type === "info" ? "info" : "check";
  toastRoot.innerHTML = `<div class="toast ${type}" role="status">${icon(iconName)}<span>${esc(
    message
  )}</span></div>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastRoot.innerHTML = "";
  }, 4200);
}

function sortedResults() {
  return state.results.slice().sort((a, b) => b.score - a.score);
}

function visibleResults() {
  const q = state.filters.q.trim().toLowerCase();
  let rows = state.results.filter((r) => {
    const c = getCandidate(r.candidateId);
    if (!c) return false;
    const hay = `${r.parsed.name} ${c.headline || ""} ${c.location || ""} ${r.matched
      .map((m) => m.term)
      .concat(r.adjacent.map((a) => a.term))
      .join(" ")} ${c.resumeText}`.toLowerCase();
    return (!q || hay.includes(q)) && (state.filters.stage === "all" || c.stage === state.filters.stage);
  });
  if (state.filters.sort === "score") rows.sort((a, b) => b.score - a.score);
  else if (state.filters.sort === "name") rows.sort((a, b) => a.parsed.name.localeCompare(b.parsed.name));
  else
    rows.sort(
      (a, b) => new Date(getCandidate(b.candidateId).addedAt) - new Date(getCandidate(a.candidateId).addedAt)
    );
  return rows;
}

function jobSnapshot(job) {
  const profile = buildProfile(job);
  const pool = state.candidates.filter((c) => c.jobId === job.id);
  const scores = pool.map((c) => scoreCandidate(c, profile, job.weights));
  const avg = scores.length ? Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length) : 0;
  return {
    pool: pool.length,
    avg,
    strong: scores.filter((r) => r.score >= 80).length,
    shortlist: pool.filter((c) => c.stage === "shortlist").length,
    semanticLift: scores.filter((r) => r.adjacent.length > 0).length,
  };
}

/* ---------------------------------- shell --------------------------------- */

function renderNav() {
  const pool = state.candidates.filter((c) => c.jobId === state.activeJobId).length;
  const counts = { candidates: pool, compare: state.compare.length };
  sidebar.innerHTML = `
    <div class="sidebar-inner">
      <div class="brand">
        <span class="brand-mark">${LOGO}</span>
        <div>
          <div class="brand-name">CV<span>Sense</span></div>
          <div class="brand-sub">Resume screening</div>
        </div>
      </div>
      <nav class="side-nav" aria-label="Sections">
        <div class="side-label">Workspace</div>
        ${NAV.map(
          (item) => `
          <button class="nav-item" data-action="nav" data-screen="${item.id}" ${
            state.screen === item.id ? 'aria-current="page"' : ""
          }>
            ${icon(item.icon)}<span>${item.label}</span>
            ${counts[item.id] ? `<span class="nav-badge">${counts[item.id]}</span>` : ""}
          </button>`
        ).join("")}
      </nav>
      <div class="side-foot">
        <div class="job-mini">
          <div class="job-mini-label">Screening for</div>
          <div class="job-mini-title">${esc(activeJob()?.title || "No role")}</div>
          <div class="row" style="margin-top:8px;gap:6px">
            <span class="dot"></span>
            <span class="tiny muted">${pool} resumes · saved locally</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-block" data-action="openAdd">${icon("plus")} Add resume</button>
        <p class="tiny muted" style="padding:0 4px">${esc(activeJob()?.company || "")} · nothing leaves this browser</p>
      </div>
    </div>`;

  tabbar.innerHTML = NAV.map(
    (item) => `
      <button class="tab" data-action="nav" data-screen="${item.id}" ${
        state.screen === item.id ? 'aria-current="page"' : ""
      }>
        ${icon(item.icon)}<span>${item.label}</span>
      </button>`
  ).join("");
}

function renderTopbar() {
  const job = activeJob();
  topbar.innerHTML = `
    <div class="brand">
      <span class="brand-mark">${LOGO}</span>
      <div class="brand-name">CV<span>Sense</span></div>
    </div>
    <button class="topbar-role" data-action="nav" data-screen="roles" aria-label="Switch role">
      <span class="role-pill">${icon("briefcase")} <b>${esc(job?.title || "No role")}</b>
        <span class="muted">· ${esc(job?.company || "")}</span></span>
    </button>
    <div class="spacer"></div>
    <button class="btn btn-soft btn-sm" data-action="openAdd">${icon("plus")} Add</button>
    <span class="avatar" title="Signed in as Aanya Kapoor">AK</span>`;
}

/* -------------------------------- dashboard ------------------------------- */

function screenDashboard() {
  const job = activeJob();
  if (!job) return emptyWorkspace();
  const results = state.results;
  const total = results.length;
  const avg = total ? Math.round(results.reduce((s, r) => s + r.score, 0) / total) : 0;
  const strong = results.filter((r) => r.score >= 80).length;
  const mustScores = results.map((r) => r.coverage.must).filter((v) => v != null);
  const mustAvg = mustScores.length
    ? Math.round(mustScores.reduce((a, b) => a + b, 0) / mustScores.length)
    : 0;
  const stageCounts = Object.fromEntries(
    STAGES.map((s) => [s.id, state.candidates.filter((c) => c.jobId === job.id && c.stage === s.id).length])
  );
  const top = sortedResults().slice(0, 3);
  const semanticLift = results.filter((r) => r.adjacent.length > 0).length;

  const bands = [
    { label: "0–49", min: 0, max: 49, cls: "0" },
    { label: "50–64", min: 50, max: 64, cls: "1" },
    { label: "65–79", min: 65, max: 79, cls: "2" },
    { label: "80–100", min: 80, max: 100, cls: "3" },
  ].map((b) => ({
    ...b,
    count: results.filter((r) => r.score >= b.min && r.score <= b.max).length,
  }));
  const bandMax = Math.max(1, ...bands.map((b) => b.count));

  const kwCoverage = (state.profile?.keywords || [])
    .filter((k) => k.kind !== "ignore")
    .slice(0, 6)
    .map((k) => {
      const hits = results.filter((r) => r.matched.some((m) => m.term === k.display)).length;
      return { term: k.display, kind: k.kind, pct: total ? Math.round((hits / total) * 100) : 0 };
    });

  return `
    <div class="stack stack-lg">
      <div class="greet">
        <div class="eyebrow">Screening overview</div>
        <h1>Good morning, Aanya</h1>
        <p class="greet-sub">${
          total
            ? `<b class="strong">${total} resumes</b> scored against <b class="strong">${esc(
                job.title
              )}</b>. ${strong} look like strong matches.`
            : `No resumes for <b class="strong">${esc(job.title)}</b> yet — add one to start screening.`
        }</p>
      </div>

      <section class="hero-band">
        <div>
          <div class="eyebrow">${icon("target")} Active opening</div>
          <h2>${esc(job.title)} <span class="muted" style="font-weight:500">· ${esc(job.company)}</span></h2>
          <p>${
            state.profile
              ? `${state.profile.keywords.filter((k) => k.kind !== "ignore").length} screening keywords · ${
                  state.profile.mustSkills.length
                } must-haves · ${job.minYears}+ years · ${levelLabel(job.education)}`
              : ""
          }${semanticLift ? ` · semantic layer lifted ${semanticLift}` : ""}</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><b>${total}</b><span>In pool</span></div>
          <div class="hero-stat"><b>${avg}</b><span>Avg. score</span></div>
          <div class="hero-stat"><b>${stageCounts.shortlist}</b><span>Shortlisted</span></div>
        </div>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary" data-action="nav" data-screen="candidates">${icon(
            "users"
          )} Review candidates</button>
          <button class="btn btn-secondary" data-action="nav" data-screen="job">${icon(
            "briefcase"
          )} Edit criteria</button>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat">
          <div class="stat-label">${icon("users")} Resume pool</div>
          <div class="stat-value">${total}</div>
          <div class="stat-delta">For this role</div>
        </div>
        <div class="stat">
          <div class="stat-label">${icon("chart")} Average match</div>
          <div class="stat-value">${avg}<small>/100</small></div>
          <div class="stat-delta">${avg >= 70 ? "Healthy pipeline" : avg >= 50 ? "Mixed quality" : "Thin pipeline"}</div>
        </div>
        <div class="stat">
          <div class="stat-label">${icon("spark")} Strong matches</div>
          <div class="stat-value">${strong}</div>
          <div class="stat-delta">${strong ? "Scoring 80 or above" : "None above 80 yet"}</div>
        </div>
        <div class="stat">
          <div class="stat-label">${icon("check")} Must-have cover</div>
          <div class="stat-value">${mustAvg}<small>%</small></div>
          <div class="stat-delta">Keyword evidence only</div>
        </div>
      </div>

      ${
        total === 0
          ? emptyState(
              "users",
              "This pool is empty",
              `Add resumes for ${job.title}, or load the ${job.id === "job-frontend" ? "sample pool" : "matching samples"} to see scoring in action.`,
              `<button class="btn btn-primary" data-action="openAdd">${icon(
                "plus"
              )} Add a resume</button>
               ${
                 SAMPLE_CANDIDATES.some((c) => c.jobId === job.id)
                   ? `<button class="btn btn-secondary" data-action="loadSamples">${icon(
                       "spark"
                     )} Load samples</button>`
                   : ""
               }`
            )
          : `
      <div class="dashboard-cols">
        <div class="stack">
          <section class="card">
            <div class="card-head">
              <div>
                <h2>Top matches</h2>
                <p class="tiny muted">Ranked by overall score for this role</p>
              </div>
              <button class="btn btn-ghost btn-sm" data-action="nav" data-screen="candidates">View all ${icon(
                "arrow"
              )}</button>
            </div>
            <div class="card-body">
              <div class="match-list">
                ${top
                  .map((r) => {
                    const c = getCandidate(r.candidateId);
                    return `
                    <div class="match-row">
                      ${ring(r.score, r.tier, "ring-sm")}
                      <div class="match-main">
                        <div class="match-name">${esc(r.parsed.name)}${
                      c?.starred ? `<span style="color:#d97706">${icon("star")}</span>` : ""
                    }</div>
                        <div class="match-role">${esc(c?.headline || r.parsed.levelLabel)}</div>
                        <div class="chips" style="margin-top:5px">
                          ${r.matched
                            .slice(0, 3)
                            .map((m) => `<span class="chip is-match">${esc(m.term)}</span>`)
                            .join("")}
                          ${r.adjacent.slice(0, 1).map((a) => `<span class="chip is-sky">≈ ${esc(a.term)}</span>`).join("")}
                          ${r.matched.length > 3 ? `<span class="chip">+${r.matched.length - 3}</span>` : ""}
                        </div>
                      </div>
                      <button class="btn btn-soft btn-sm" data-action="view" data-id="${c.id}">Open</button>
                    </div>`;
                  })
                  .join("")}
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div>
                <h2>Score distribution</h2>
                <p class="tiny muted">How the pool spreads across match bands</p>
              </div>
            </div>
            <div class="card-body">
              <div class="dist">
                ${bands
                  .map(
                    (b) => `
                  <div class="dist-col" data-band="${b.cls}">
                    <span class="dist-count">${b.count}</span>
                    <div class="dist-bar" style="height:${Math.max(
                      4,
                      Math.round((b.count / bandMax) * 74)
                    )}px"></div>
                    <span class="dist-label">${b.label}</span>
                  </div>`
                  )
                  .join("")}
              </div>
              <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap">
                ${badge("weak", "Weak")}${badge("possible", "Possible")}${badge("good", "Good")}${badge("strong", "Strong")}
              </div>
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="card">
            <div class="card-head">
              <div>
                <h2>Keyword coverage</h2>
                <p class="tiny muted">Share of resumes mentioning each term</p>
              </div>
            </div>
            <div class="card-body" style="padding-top:6px">
              ${kwCoverage
                .map(
                  (k) => `
                <div class="kw-row">
                  <div class="row" style="min-width:0;gap:6px">
                    <span class="strong truncate" style="font-size:12.5px">${esc(k.term)}</span>
                    ${k.kind === "must" ? `<span class="chip is-blue" style="font-size:10px;padding:1px 6px">Must</span>` : ""}
                  </div>
                  <span class="tiny muted num">${k.pct}%</span>
                  <div class="bar"><i style="width:${k.pct}%"></i></div>
                </div>`
                )
                .join("")}
              <button class="btn btn-ghost btn-sm btn-block" style="margin-top:8px" data-action="nav" data-screen="job">Tune keywords ${icon(
                "arrow"
              )}</button>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div><h2>Pipeline</h2></div></div>
            <div class="card-body">
              <div class="pipeline">
                ${STAGES.map(
                  (s) => `
                  <div class="pipeline-stat">
                    <span>${s.label}</span>
                    <b>${stageCounts[s.id]}</b>
                  </div>`
                ).join("")}
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div><h2>Recent activity</h2></div></div>
            <div class="card-body">
              <div class="activity">
                ${state.log
                  .slice(0, 5)
                  .map(
                    (l) => `
                  <div class="activity-item">
                    <span class="activity-dot ${l.kind}"></span>
                    <span>${esc(l.text)}</span>
                    <span class="activity-time">${timeAgo(l.ts)}</span>
                  </div>`
                  )
                  .join("")}
              </div>
            </div>
          </section>
        </div>
      </div>`}
    </div>`;
}

/* ---------------------------------- roles --------------------------------- */

function screenRoles() {
  const active = state.jobs.filter((j) => !j.archived);
  const archived = state.jobs.filter((j) => j.archived);

  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">Workspace</div>
        <h1>Open roles</h1>
        <p>Every role keeps its own criteria, keyword overrides, weights and candidate pool. Switch any time — everything is saved in this browser.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-primary" data-action="openNewRole">${icon("plus")} New role</button>
      </div>
    </div>

    <div class="storage-bar ${state.storageError ? "is-error" : ""}">
      ${icon(state.storageError ? "alert" : "save")}
      <span>${
        state.storageError
          ? esc(state.lastError || "Saving is unavailable in this browser.")
          : `Saved in this browser · ${state.savedAt ? timeAgo(state.savedAt) : "just now"}`
      }</span>
      <span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" data-action="resetDemo">${icon("refresh")} Reset demo data</button>
    </div>

    <div class="roles-grid">
      ${active.map((job) => roleCard(job)).join("")}
      <button class="role-card role-new" data-action="openNewRole">
        <span class="role-new-icon">${icon("plus")}</span>
        <b>Create a role</b>
        <span class="tiny muted">Start blank or from a preset</span>
      </button>
    </div>

    ${
      archived.length
        ? `<div class="section-head" style="margin:22px 0 10px">
             <h2>Archived</h2>
             <span class="tiny muted">${archived.length} role${archived.length > 1 ? "s" : ""}</span>
           </div>
           <div class="roles-grid">${archived.map((job) => roleCard(job)).join("")}</div>`
        : ""
    }`;
}

function roleCard(job) {
  const snap = jobSnapshot(job);
  const isActive = job.id === state.activeJobId;
  const criteria = `${job.minYears}+ yrs · ${levelLabel(job.education)} · ${job.mustHave.length} must-haves`;
  return `
    <article class="role-card ${isActive ? "is-active" : ""} ${job.archived ? "is-archived" : ""}">
      <div class="role-top">
        <div class="role-mark">${esc((job.company || job.title || "?").slice(0, 1).toUpperCase())}</div>
        <div class="role-id">
          <h3 class="truncate">${esc(job.title)}</h3>
          <div class="tiny muted truncate">${esc(job.company || "No company")}</div>
        </div>
        ${isActive ? `<span class="chip is-match">${icon("check")} Open</span>` : job.archived ? `<span class="chip">Archived</span>` : ""}
      </div>

      <div class="role-stats">
        <div><b>${snap.pool}</b><span>candidates</span></div>
        <div><b>${snap.avg}<small>/100</small></b><span>avg score</span></div>
        <div><b>${snap.shortlist}</b><span>shortlisted</span></div>
      </div>

      <div class="chips" style="margin-top:2px">
        ${(job.mustHave.length ? job.mustHave : ["No must-haves yet"])
          .slice(0, 4)
          .map((m) => `<span class="chip">${esc(m)}</span>`)
          .join("")}
        ${job.mustHave.length > 4 ? `<span class="chip">+${job.mustHave.length - 4}</span>` : ""}
      </div>
      <div class="tiny muted role-criteria">${esc(criteria)}</div>

      <div class="role-actions">
        <button class="btn ${isActive ? "btn-soft" : "btn-primary"} btn-sm" data-action="switchJob" data-id="${job.id}">
          ${isActive ? icon("check") + " Current" : icon("arrow") + " Open role"}
        </button>
        <span class="spacer"></span>
        <button class="icon-btn" data-action="duplicateJob" data-id="${job.id}" aria-label="Duplicate ${esc(job.title)}" title="Duplicate">${icon("copy")}</button>
        <button class="icon-btn" data-action="archiveJob" data-id="${job.id}" aria-label="${job.archived ? "Restore" : "Archive"} ${esc(job.title)}" title="${job.archived ? "Restore" : "Archive"}">${icon(job.archived ? "restore" : "archive")}</button>
        <button class="icon-btn" data-action="deleteJob" data-id="${job.id}" aria-label="Delete ${esc(job.title)}" title="Delete">${icon("trash")}</button>
      </div>
    </article>`;
}

/* ----------------------------------- job ---------------------------------- */

function screenJob() {
  const job = activeJob();
  if (!job) return emptyWorkspace();
  const profile = state.profile;
  const percents = weightPercents(job.weights);
  const shown = profile ? profile.keywords : [];
  const activeCount = shown.filter((k) => k.kind !== "ignore").length;
  const openJobs = state.jobs.filter((j) => !j.archived);

  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">Screening setup</div>
        <h1>Job criteria</h1>
        <p>Everything on this page changes how this role's resumes are scored. Adjust it and the pool re-ranks instantly.</p>
      </div>
      <div class="page-head-actions">
        <select class="select select-sm" style="max-width:210px" data-change="switchJobSelect" aria-label="Role being edited">
          ${openJobs
            .map(
              (j) =>
                `<option value="${j.id}" ${j.id === job.id ? "selected" : ""}>${esc(j.title)}</option>`
            )
            .join("")}
        </select>
        <button class="btn btn-secondary btn-sm" data-action="resetJob">${icon("refresh")} Reset</button>
        <button class="btn btn-primary btn-sm" data-action="saveJob">${icon("check")} Save &amp; re-score</button>
      </div>
    </div>

    <div class="job-grid">
      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div>
              <h2>Role basics</h2>
              <p class="tiny muted">Hard bars used by the experience and education checks</p>
            </div>
          </div>
          <div class="card-body stack">
            <div class="inline-fields">
              <label class="field">
                <span class="label">Role title</span>
                <input class="input" data-input="jobField" data-field="title" value="${esc(job.title)}" placeholder="e.g. Senior Frontend Engineer" />
              </label>
              <label class="field">
                <span class="label">Company</span>
                <input class="input" data-input="jobField" data-field="company" value="${esc(job.company)}" placeholder="e.g. Northwind Labs" />
              </label>
            </div>
            <div class="inline-fields">
              <label class="field">
                <span class="label">Minimum years</span>
                <input class="input" type="number" min="0" max="40" step="1" data-change="minYears" value="${job.minYears}" />
              </label>
              <label class="field">
                <span class="label">Education</span>
                <select class="select" data-change="education">
                  ${EDUCATION_LEVELS.map(
                    (l) => `<option value="${l.id}" ${job.education === l.id ? "selected" : ""}>${l.label}</option>`
                  ).join("")}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h2>Job description</h2>
              <p class="tiny muted">Skills are detected from the wording, not guessed from a fixed list</p>
            </div>
            <button class="btn btn-soft btn-sm" data-action="analyze">${icon("spark")} Analyse</button>
          </div>
          <div class="card-body stack">
            <textarea class="textarea" rows="14" data-input="jobField" data-field="description" placeholder="Paste the full job description here…">${esc(job.description)}</textarea>
            <div class="row row-wrap tiny muted">
              <span>${job.description.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>·</span>
              <span>${activeCount} keywords in play</span>
              ${profile && !profile.hasRequirementsBlock
                ? `<span class="chip is-amber" style="font-size:10.5px">No “Requirements” heading found — using your must-have list</span>`
                : ""}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <h2>Screening keywords</h2>
              <p class="tiny muted">Promote, demote or ignore any detected skill</p>
            </div>
          </div>
          <div class="card-body stack">
            ${profile?.mustAuto
              ? `<div class="auto-note">${icon("info")}<span>No must-have list yet, so CVSense auto-detected <b>${profile.mustSkills.length}</b> must-haves from the requirements section. Add your own to take control.</span></div>`
              : ""}
            ${shown.length
              ? `<div class="kw-table">
                  <div class="kw-table-head"><span>Keyword</span><span>Role</span><span>Wt</span></div>
                  <div style="max-height:340px;overflow:auto">
                  ${shown
                    .map(
                      (k) => `
                    <div class="kw-item ${k.kind === "ignore" ? "is-ignored" : ""}">
                      <div class="kw-term"><b title="${esc(k.display)}">${esc(k.display)}</b><span class="kw-cat">${esc(k.category)}</span></div>
                      <select class="select select-sm" data-change="kwKind" data-term="${esc(k.display)}" aria-label="Role for ${esc(k.display)}">
                        <option value="must" ${k.kind === "must" ? "selected" : ""}>Must</option>
                        <option value="nice" ${k.kind === "nice" ? "selected" : ""}>Nice</option>
                        <option value="keyword" ${k.kind === "keyword" ? "selected" : ""}>Keyword</option>
                        <option value="ignore" ${k.kind === "ignore" ? "selected" : ""}>Ignore</option>
                      </select>
                      <span class="tiny muted num">${k.weight.toFixed(1)}</span>
                    </div>`
                    )
                    .join("")}
                  </div>
                </div>`
              : `<div class="auto-note">${icon("info")}<span>No skills detected yet. Add keywords on the right, or paste a fuller job description.</span></div>`}
          </div>
        </section>
      </div>

      <div class="stack sticky-col">
        <section class="card">
          <div class="card-head"><div><h2>Start from a preset</h2><p class="tiny muted">Replaces this role's criteria</p></div></div>
          <div class="card-body">
            <div class="preset-grid">
              ${JOB_PRESETS.map(
                (p) => `
                <button class="preset" data-action="usePreset" data-preset="${p.id}" aria-pressed="${p.job.title === job.title}">
                  ${icon("briefcase")}
                  <span style="min-width:0">
                    <span style="display:block;line-height:1.3">${esc(p.label)}</span>
                    <span class="preset-meta">${esc(p.meta)}</span>
                  </span>
                </button>`
              ).join("")}
            </div>
            <p class="hint" style="margin-top:9px">Presets change the description and keyword lists; the candidate pool stays with this role.</p>
          </div>
        </section>

        <section class="card">
          <div class="card-head" style="padding-bottom:8px">
            <div><h2>Must-have skills</h2><p class="tiny muted">Missing one caps the score</p></div>
            <span class="chip is-blue">${job.mustHave.length}</span>
          </div>
          <div class="card-body" style="padding-top:0">
            ${tagEditor("must", job.mustHave)}
            <p class="hint" style="margin-top:6px">Press Enter or comma to add.</p>
          </div>
        </section>

        <section class="card">
          <div class="card-head" style="padding-bottom:8px">
            <div><h2>Nice to have</h2><p class="tiny muted">Breaks ties between qualified people</p></div>
            <span class="chip">${job.niceHave.length}</span>
          </div>
          <div class="card-body" style="padding-top:0">
            ${tagEditor("nice", job.niceHave)}
            <p class="hint" style="margin-top:6px">Press Enter or comma to add.</p>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Scoring weights</h2><p class="tiny muted">Relative importance of each signal</p></div></div>
          <div class="card-body">
            <div class="weights">
              ${weightRow("skills", "Keyword skills", job.weights.skills, percents.skills)}
              ${weightRow("semantic", "Semantic fit", job.weights.semantic, percents.semantic)}
              ${weightRow("experience", "Experience", job.weights.experience, percents.experience)}
              ${weightRow("education", "Education", job.weights.education, percents.education)}
              ${weightRow("relevance", "Description relevance", job.weights.relevance, percents.relevance)}
            </div>
            <div class="weight-foot">
              <span>Always normalised to 100%.</span>
              <div class="row" style="gap:2px">
                <button class="btn btn-ghost btn-sm" data-action="weightPreset" data-key="balanced">Balanced</button>
                <button class="btn btn-ghost btn-sm" data-action="weightPreset" data-key="skills">Keywords</button>
                <button class="btn btn-ghost btn-sm" data-action="weightPreset" data-key="semantic">Semantic</button>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head" style="padding-bottom:10px">
            <div><h2>How semantic fit works</h2></div>
          </div>
          <div class="card-body" style="padding-top:0">
            <div class="auto-note">${icon("info")}<span>An offline concept layer maps adjacent wording to the same skill — “predictive models” counts as machine learning, “component library” as design systems. It is not a neural model, and no resume text leaves this browser. Adjacent evidence is scored at 55% of a direct mention.</span></div>
          </div>
        </section>

        <section class="card">
          <div class="card-body">
            <button class="btn btn-primary btn-block" data-action="saveJob">${icon("check")} Save &amp; re-score ${state.results.length} resumes</button>
            <p class="hint" style="margin-top:8px;text-align:center">Changes apply immediately; saving records them in the activity log.</p>
          </div>
        </section>
      </div>
    </div>`;
}

function tagEditor(kind, list) {
  return `<div class="tag-editor" data-tageditor="${kind}">
    ${list
      .map(
        (term) => `<span class="chip is-blue">${esc(term)}<button class="tag-remove" data-action="removeTag" data-kind="${kind}" data-term="${esc(term)}" aria-label="Remove ${esc(term)}">${icon("x")}</button></span>`
      )
      .join("")}
    <input type="text" placeholder="${kind === "must" ? "Add a must-have…" : "Add a nice-to-have…"}" data-input="tagDraft" data-kind="${kind}" aria-label="Add ${kind}-have skill" />
  </div>`;
}

function weightRow(key, label, raw, pct) {
  return `<div class="weight-row">
    <span class="label">${label}</span>
    <span class="weight-value" id="w-${key}">${pct}%</span>
    <input type="range" min="0" max="100" step="5" value="${raw}" data-input="weight" data-key="${key}" aria-label="${label} weight" />
  </div>`;
}

/* -------------------------------- candidates ------------------------------ */

function candidateCard(r) {
  const c = getCandidate(r.candidateId);
  const selected = state.compare.includes(c.id);
  return `
    <article class="cand ${selected ? "is-selected" : ""}" data-candidate="${c.id}">
      <div class="cand-top">
        <input class="cand-check" type="checkbox" data-change="compare" data-id="${c.id}" ${selected ? "checked" : ""} aria-label="Select ${esc(r.parsed.name)} to compare" />
        <div class="cand-avatar ${avatarClass(c.id)}">${initials(r.parsed.name)}</div>
        <div class="cand-id">
          <div class="cand-name">
            <span class="truncate">${esc(r.parsed.name)}</span>
            ${c.starred ? `<span style="color:#d97706" title="Starred">${icon("star")}</span>` : ""}
          </div>
          <div class="cand-role">${esc(c.headline || r.parsed.headline || "Candidate")} · ${esc(c.location || "Location not listed")}</div>
          <div class="cand-facts">
            <span>${icon("clock")}${fmtYears(r.parsed.years)}</span>
            <span>${icon("cap")}${esc(r.parsed.levelLabel)}</span>
            <span>${icon("check")}${r.matchedMustCount}/${r.mustCount} must-haves</span>
          </div>
        </div>
        <div class="cand-score">
          ${badge(r.tier, r.verdict)}
          ${ring(r.score, r.tier, "ring-sm")}
        </div>
      </div>

      ${r.missingMust.length
        ? `<div class="miss-line">${icon("alert")}<span>Missing must-have: ${esc(r.missingMust.join(", "))}${r.capped ? " · score capped" : ""}</span></div>`
        : ""}

      <div class="cand-evidence">
        ${r.matched.slice(0, 4).map((m) => `<span class="chip is-match">${esc(m.term)}</span>`).join("")}
        ${r.adjacent.slice(0, 2).map((a) => `<span class="chip is-sky" title="Adjacent evidence: ${esc(a.via)}">≈ ${esc(a.term)}</span>`).join("")}
        ${r.matched.length > 4 ? `<span class="chip">+${r.matched.length - 4} more</span>` : ""}
        ${r.matched.length === 0 && r.adjacent.length === 0 ? `<span class="chip is-miss">No keyword overlap</span>` : ""}
      </div>

      <div class="cand-foot">
        <select class="select select-sm" data-change="stage" data-id="${c.id}" aria-label="Stage for ${esc(r.parsed.name)}">
          ${STAGES.map((s) => `<option value="${s.id}" ${c.stage === s.id ? "selected" : ""}>${s.label}</option>`).join("")}
        </select>
        <button class="btn btn-soft btn-sm" data-action="view" data-id="${c.id}">Open profile</button>
        <div class="spacer"></div>
        <button class="icon-btn ${c.starred ? "is-starred" : ""}" data-action="star" data-id="${c.id}" aria-label="${c.starred ? "Unstar" : "Star"} ${esc(r.parsed.name)}" aria-pressed="${c.starred}">${icon("star")}</button>
        <button class="icon-btn" data-action="remove" data-id="${c.id}" aria-label="Remove ${esc(r.parsed.name)}">${icon("trash")}</button>
      </div>
    </article>`;
}

function screenCandidates() {
  const job = activeJob();
  if (!job) return emptyWorkspace();
  const rows = visibleResults();
  const pool = state.candidates.filter((c) => c.jobId === job.id);
  const counts = Object.fromEntries([
    ["all", pool.length],
    ...STAGES.map((s) => [s.id, pool.filter((c) => c.stage === s.id).length]),
  ]);
  const hasPool = pool.length > 0;
  const hasSamples = SAMPLE_CANDIDATES.some((c) => c.jobId === job.id);

  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">${esc(job.company)} · talent pool</div>
        <h1>Candidates</h1>
        <p>${hasPool
          ? `${pool.length} resumes scored against ${esc(job.title)}. Open a profile to see the evidence behind every score.`
          : `Nothing to screen yet for ${esc(job.title)}.`}</p>
      </div>
      <div class="page-head-actions">
        ${hasPool ? `<button class="btn btn-danger btn-sm" data-action="clearPool">${icon("trash")} Clear pool</button>` : ""}
        <button class="btn btn-secondary btn-sm" data-action="exportCsv">${icon("download")} Export CSV</button>
        <button class="btn btn-primary btn-sm" data-action="openAdd">${icon("plus")} Add resume</button>
      </div>
    </div>

    ${!hasPool
      ? emptyState(
          "users",
          "No resumes for this role",
          "Drop PDF, DOCX, TXT or MD files anywhere on this page, or paste resume text.",
          `<button class="btn btn-primary" data-action="openAdd">${icon("plus")} Add a resume</button>
           ${hasSamples ? `<button class="btn btn-secondary" data-action="loadSamples">${icon("spark")} Load sample pool</button>` : ""}`
        )
      : `
      <div class="toolbar">
        <div class="toolbar-row">
          <div class="search-wrap">
            ${icon("search")}
            <input class="input" type="search" placeholder="Search name, role, skill or resume text…" value="${esc(state.filters.q)}" data-input="search" aria-label="Search candidates" />
          </div>
          <select class="select" style="max-width:170px" data-change="sort" aria-label="Sort candidates">
            <option value="score" ${state.filters.sort === "score" ? "selected" : ""}>Highest score</option>
            <option value="name" ${state.filters.sort === "name" ? "selected" : ""}>Name A–Z</option>
            <option value="newest" ${state.filters.sort === "newest" ? "selected" : ""}>Newest first</option>
          </select>
        </div>
        <div class="segmented" role="group" aria-label="Filter by stage">
          <button class="seg" data-action="stageFilter" data-stage="all" aria-pressed="${state.filters.stage === "all"}">All <span class="count">${counts.all}</span></button>
          ${STAGES.map(
            (s) => `<button class="seg" data-action="stageFilter" data-stage="${s.id}" aria-pressed="${state.filters.stage === s.id}">${s.label} <span class="count">${counts[s.id]}</span></button>`
          ).join("")}
        </div>
      </div>

      ${state.compare.length
        ? `<div class="bulkbar">
            <span class="small strong">${state.compare.length} selected</span>
            <div class="spacer"></div>
            <button class="btn btn-soft btn-sm" data-action="goCompare">Compare ${icon("arrow")}</button>
            <button class="icon-btn" data-action="clearCompare" aria-label="Clear selection">${icon("x")}</button>
          </div>`
        : ""}

      <div class="result-meta">
        <span id="resultCount">${rows.length} of ${pool.length} candidates</span>
        <span class="tiny">Drop files anywhere to add · PDF, DOCX, TXT, MD</span>
      </div>

      <div class="cand-list" id="candidateResults">
        ${rows.map(candidateCard).join("")}
        ${rows.length === 0
          ? emptyState(
              "search",
              "No candidates match",
              `Nothing matches “${esc(state.filters.q)}”${state.filters.stage !== "all" ? " in this stage" : ""}.`,
              `<button class="btn btn-secondary" data-action="resetFilters">Clear filters</button>`
            )
          : ""}
      </div>`
    }`;
}

/* --------------------------------- compare -------------------------------- */

function screenCompare() {
  const job = activeJob();
  if (!job) return emptyWorkspace();
  const picked = state.compare.map((id) => getResult(id)).filter(Boolean);
  const slots = [0, 1, 2]
    .map((i) => {
      const r = picked[i];
      if (!r) {
        return `<div class="compare-slot">
          ${icon("plus")}
          <span>${i === 0 ? "Select at least two candidates" : "Add another candidate"}</span>
          <button class="btn btn-secondary btn-sm" data-action="nav" data-screen="candidates">Browse pool</button>
        </div>`;
      }
      const c = getCandidate(r.candidateId);
      return `<div class="compare-slot filled">
        <div class="row" style="gap:9px;align-items:flex-start">
          <div class="cand-avatar ${avatarClass(c.id)}" style="width:34px;height:34px;border-radius:9px;font-size:12px">${initials(r.parsed.name)}</div>
          <div style="min-width:0;flex:1">
            <div class="cand-name"><span class="truncate">${esc(r.parsed.name)}</span></div>
            <div class="cand-role">${esc(c.headline || "")}</div>
          </div>
          <button class="icon-btn" data-action="uncompare" data-id="${c.id}" aria-label="Remove ${esc(r.parsed.name)} from comparison">${icon("x")}</button>
        </div>
        <div class="row" style="gap:8px">
          ${ring(r.score, r.tier, "ring-xs")}
          ${badge(r.tier, r.verdict)}
        </div>
      </div>`;
    })
    .join("");

  if (picked.length < 2) {
    return `
      <div class="page-head">
        <div>
          <div class="eyebrow">Side by side</div>
          <h1>Compare candidates</h1>
          <p>Pick two or three people from ${esc(job.title)} to see exactly where they differ.</p>
        </div>
        ${state.compare.length ? `<div class="page-head-actions"><button class="btn btn-secondary btn-sm" data-action="clearCompare">${icon("x")} Clear selection</button></div>` : ""}
      </div>
      <div class="stack">
        <div class="compare-grid">${slots}</div>
        ${emptyState(
          "columns",
          "Nothing to compare yet",
          "Tick the checkbox on any candidate card, or use a quick pick below.",
          `<button class="btn btn-primary" data-action="nav" data-screen="candidates">${icon("users")} Choose candidates</button>`
        )}
        ${state.results.length
          ? `<section class="card"><div class="card-head"><div><h2>Quick pick</h2><p class="tiny muted">Top three by current score</p></div></div>
            <div class="card-body">
              <div class="match-list">
                ${sortedResults()
                  .slice(0, 3)
                  .map((r) => {
                    const c = getCandidate(r.candidateId);
                    return `<div class="match-row">
                      ${ring(r.score, r.tier, "ring-xs")}
                      <div class="match-main">
                        <div class="match-name">${esc(r.parsed.name)}</div>
                        <div class="match-role">${esc(c.headline || "")}</div>
                      </div>
                      <button class="btn btn-soft btn-sm" data-action="compareAdd" data-id="${c.id}">Add</button>
                    </div>`;
                  })
                  .join("")}
              </div>
            </div></section>`
          : ""}
      </div>`;
  }

  const metrics = [
    { label: "Overall match", get: (r) => r.score },
    { label: "Keyword skills", get: (r) => r.components.skills },
    { label: "Semantic fit", get: (r) => r.components.semantic },
    { label: "Experience", get: (r) => r.components.experience },
    { label: "Education", get: (r) => r.components.education },
    { label: "Description relevance", get: (r) => r.components.relevance },
    { label: "Years detected", get: (r) => r.parsed.years },
  ];

  const winner = picked.slice().sort((a, b) => b.score - a.score)[0];
  const winnerC = getCandidate(winner.candidateId);

  const uniqueSkills = picked.map((r) => {
    const others = new Set(
      picked.filter((o) => o.candidateId !== r.candidateId).flatMap((o) => o.matched.map((m) => m.term))
    );
    return {
      name: r.parsed.name,
      skills: r.matched.filter((m) => !others.has(m.term) && m.kind !== "keyword").map((m) => m.term),
    };
  });

  return `
    <div class="page-head">
      <div>
        <div class="eyebrow">Side by side</div>
        <h1>Compare candidates</h1>
        <p>${picked.length} candidates against ${esc(job.title)} — the leading value in each row is highlighted.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-secondary btn-sm" data-action="clearCompare">${icon("x")} Clear</button>
        <button class="btn btn-soft btn-sm" data-action="nav" data-screen="candidates">${icon("users")} Add more</button>
      </div>
    </div>

    <div class="stack">
      <div class="compare-grid">${slots}</div>

      <div class="winner-strip">
        ${ring(winner.score, winner.tier, "ring-sm")}
        <div style="min-width:0">
          <div class="tiny muted">Current front-runner</div>
          <b class="truncate" style="display:block">${esc(winnerC.parsed.name)}</b>
          <span class="tiny muted">${esc(winner.reasons[0] || "")}${winner.missingMust.length ? ` · missing ${esc(winner.missingMust[0])}` : ""}</span>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary btn-sm" data-action="view" data-id="${winnerC.id}">Open profile</button>
      </div>

      <section class="card">
        <div class="card-head"><div><h2>Score breakdown</h2></div></div>
        <div class="card-body" style="padding-top:0">
          <div class="compare-scroll">
            <table class="compare-table">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  ${picked
                    .map(
                      (r) =>
                        `<th scope="col" class="cand-col"><span class="compare-name">${esc(r.parsed.name)}</span><span class="compare-sub">${esc(r.verdict)}</span></th>`
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${metrics
                  .map((m) => {
                    const values = picked.map(m.get);
                    const best = Math.max(...values);
                    const uniqueBest = values.filter((v) => v === best).length === 1;
                    return `<tr>
                      <td class="metric">${m.label}</td>
                      ${picked
                        .map((r, i) => {
                          const v = values[i];
                          const display = m.label === "Years detected" ? fmtYears(v) : v;
                          return `<td class="${uniqueBest && v === best ? "best" : ""} num">${display}</td>`;
                        })
                        .join("")}
                    </tr>`;
                  })
                  .join("")}
                <tr>
                  <td class="metric">Must-haves met</td>
                  ${picked.map((r) => `<td class="num">${r.matchedMustCount}/${r.mustCount}</td>`).join("")}
                </tr>
                <tr>
                  <td class="metric">Adjacent evidence</td>
                  ${picked
                    .map(
                      (r) =>
                        `<td class="small">${r.adjacent.length ? r.adjacent.map((a) => `<span class="chip is-sky" title="${esc(a.via)}">≈ ${esc(a.term)}</span>`).join(" ") : `<span class="tiny muted">None</span>`}</td>`
                    )
                    .join("")}
                </tr>
                <tr>
                  <td class="metric">Missing must-haves</td>
                  ${picked
                    .map(
                      (r) =>
                        `<td class="small">${r.missingMust.length ? r.missingMust.map((m) => `<span class="chip is-miss">${esc(m)}</span>`).join(" ") : `<span class="chip is-match">None</span>`}</td>`
                    )
                    .join("")}
                </tr>
                <tr>
                  <td class="metric">Education</td>
                  ${picked.map((r) => `<td class="small">${esc(r.parsed.levelLabel)}</td>`).join("")}
                </tr>
                <tr>
                  <td class="metric">Stage</td>
                  ${picked.map((r) => `<td class="small">${esc(stageLabel(getCandidate(r.candidateId).stage))}</td>`).join("")}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>What sets them apart</h2><p class="tiny muted">Skills only this candidate brought to the comparison</p></div></div>
        <div class="card-body">
          <div class="diff-grid">
            ${uniqueSkills
              .map(
                (u) => `<div class="diff-card">
                  <h4>${esc(u.name)}</h4>
                  <div class="chips">${u.skills.length ? u.skills.slice(0, 6).map((s) => `<span class="chip is-sky">${esc(s)}</span>`).join("") : `<span class="tiny muted">No skills unique to this candidate.</span>`}</div>
                </div>`
              )
              .join("")}
          </div>
        </div>
      </section>
    </div>`;
}

/* --------------------------------- drawer --------------------------------- */

function renderDrawer() {
  const r = state.selectedId ? getResult(state.selectedId) : null;
  const c = r ? getCandidate(r.candidateId) : null;

  if (!r || !c) {
    drawerEl.hidden = true;
    drawerEl.innerHTML = "";
    updateOverlay();
    return;
  }

  drawerEl.hidden = false;
  const inCompare = state.compare.includes(c.id);
  const directMust = r.matched.filter((m) => m.kind === "must");
  const adjacentMust = r.adjacent.filter((a) => a.kind === "must");

  drawerEl.innerHTML = `
    <div class="drawer-head">
      <div class="cand-avatar ${avatarClass(c.id)}" style="width:42px;height:42px;border-radius:12px">${initials(r.parsed.name)}</div>
      <div class="drawer-title">
        <h2>${esc(r.parsed.name)}</h2>
        <div class="tiny muted">${esc(c.headline || r.parsed.headline || "Candidate")}</div>
        <div class="drawer-contact">
          ${r.parsed.email ? `<span>${icon("mail")}<a href="mailto:${esc(r.parsed.email)}">${esc(r.parsed.email)}</a></span>` : `<span class="muted">${icon("mail")}No email found</span>`}
          ${r.parsed.phone ? `<span>${icon("user")}${esc(r.parsed.phone)}</span>` : ""}
          ${c.location ? `<span>${icon("pin")}${esc(c.location)}</span>` : ""}
        </div>
      </div>
      <button class="icon-btn" data-action="closeDrawer" aria-label="Close candidate profile">${icon("x")}</button>
    </div>

    <div class="drawer-body">
      <div class="score-hero">
        ${ring(r.score, r.tier, "ring-lg")}
        <div class="score-hero-main">
          <div class="row" style="gap:6px;flex-wrap:wrap">${badge(r.tier, r.verdict)} ${c.starred ? `<span class="chip is-amber">${icon("star")} Starred</span>` : ""}</div>
          <p style="margin-top:6px">${esc(r.reasons.join(" · ") || "Scored on the current criteria.")}</p>
          ${r.capped ? `<p style="color:#b45309;margin-top:4px">Capped because ${r.missingMust.length} must-have${r.missingMust.length > 1 ? "s are" : " is"} missing.</p>` : ""}
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head"><h3>Score breakdown</h3><span class="tiny muted">weighted</span></div>
        <div class="metric-list">
          ${[
            ["Keyword skills", r.components.skills, r.weights.skills],
            ["Semantic fit", r.components.semantic, r.weights.semantic],
            ["Experience", r.components.experience, r.weights.experience],
            ["Education", r.components.education, r.weights.education],
            ["Relevance", r.components.relevance, r.weights.relevance],
          ]
            .map(
              ([label, value, weight]) => `
            <div class="bar-row">
              <span>${label} <span class="tiny muted">${Math.round(weight * 100)}%</span></span>
              <div class="bar ${barClass(value)}"><i style="width:${value}%"></i></div>
              <span class="val">${value}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">
          <h3>Must-have evidence</h3>
          <span class="chip ${r.missingMust.length ? "is-amber" : "is-match"}">${r.matchedMustCount}/${r.mustCount}</span>
        </div>
        <div class="check-list">
          ${state.profile?.mustSkills.length
            ? state.profile.mustSkills
                .map((k) => {
                  const m = directMust.find((x) => x.term === k.display);
                  const a = adjacentMust.find((x) => x.term === k.display);
                  if (m) {
                    return `<div class="check-item hit">
                      <span class="mark">${icon("check")}</span>
                      <div class="term"><b>${esc(k.display)}</b><div class="why">${m.hits} mention${m.hits > 1 ? "s" : ""}${m.snippet ? ` · “${esc(m.snippet)}”` : ""}</div></div>
                    </div>`;
                  }
                  if (a) {
                    return `<div class="check-item hit is-adjacent">
                      <span class="mark">${icon("spark")}</span>
                      <div class="term"><b>${esc(k.display)}</b> <span class="chip is-sky">adjacent</span><div class="why">Found as “${esc(a.via)}” instead of the exact term${a.snippet ? ` · “${esc(a.snippet)}”` : ""}.</div></div>
                    </div>`;
                  }
                  return `<div class="check-item miss"><span class="mark">${icon("x")}</span><div class="term"><b>${esc(k.display)}</b><div class="why">Not found in this resume.</div></div></div>`;
                })
                .join("")
            : `<p class="small muted">No must-have skills set for this role.</p>`}
        </div>
      </div>

      ${r.adjacent.length
        ? `<div class="drawer-section">
            <div class="drawer-section-head"><h3>Adjacent evidence</h3><span class="tiny muted">semantic layer</span></div>
            <div class="check-list">
              ${r.adjacent
                .map(
                  (a) => `<div class="check-item hit is-adjacent">
                    <span class="mark">${icon("spark")}</span>
                    <div class="term"><b>≈ ${esc(a.term)}</b><div class="why">Wording found: “${esc(a.via)}”${a.snippet ? ` — “${esc(a.snippet)}”` : ""}</div></div>
                  </div>`
                )
                .join("")}
            </div>
          </div>`
        : ""}

      ${r.matched.filter((m) => m.kind === "nice").length
        ? `<div class="drawer-section">
            <div class="drawer-section-head"><h3>Nice-to-haves found</h3></div>
            <div class="chips">${r.matched.filter((m) => m.kind === "nice").map((m) => `<span class="chip is-match">${icon("check")} ${esc(m.term)}</span>`).join("")}</div>
          </div>`
        : ""}

      ${r.missingNice.length
        ? `<div class="drawer-section">
            <div class="drawer-section-head"><h3>Nice-to-haves missing</h3></div>
            <div class="chips">${r.missingNice.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div>
          </div>`
        : ""}

      <div class="drawer-section">
        <div class="drawer-section-head"><h3>Signals</h3></div>
        <div class="flag-list">
          ${r.flags.length
            ? r.flags.map((f) => `<div class="flag ${f.type}">${icon(f.type === "good" ? "check" : "alert")}<span>${esc(f.text)}</span></div>`).join("")
            : `<div class="flag good">${icon("check")}<span>No red flags found.</span></div>`}
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head"><h3>Profile facts</h3></div>
        <div class="fact-grid">
          <div class="fact"><div class="fact-label">Experience</div><div class="fact-value">${fmtYears(r.parsed.years)}</div></div>
          <div class="fact"><div class="fact-label">Education</div><div class="fact-value">${esc(r.parsed.levelLabel)}</div></div>
          <div class="fact"><div class="fact-label">Title alignment</div><div class="fact-value">${r.titleAlign}%</div></div>
          <div class="fact"><div class="fact-label">Source</div><div class="fact-value">${esc(c.source || "Manual")}</div></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head"><h3>Recruiter notes</h3><span class="tiny muted">saved in this browser</span></div>
        <textarea class="notes-area" data-input="notes" data-id="${c.id}" placeholder="Interview impressions, availability, salary expectations…">${esc(c.notes)}</textarea>
      </div>

      <details class="resume-details">
        <summary>Original resume text</summary>
        <pre class="resume-text">${esc(c.resumeText)}</pre>
      </details>
    </div>

    <div class="drawer-foot">
      ${STAGES.filter((s) => s.id !== "new")
        .map(
          (s) => `<button class="btn ${c.stage === s.id ? "btn-primary" : "btn-secondary"} btn-sm" data-action="stage" data-id="${c.id}" data-stage="${s.id}" aria-pressed="${c.stage === s.id}">${s.id === "reject" ? icon("x") : s.id === "hold" ? icon("clock") : icon("check")}${s.label}</button>`
        )
        .join("")}
      <button class="btn ${inCompare ? "btn-soft" : "btn-secondary"} btn-sm" data-action="compareAdd" data-id="${c.id}" aria-pressed="${inCompare}">${icon("columns")}${inCompare ? "In compare" : "Compare"}</button>
      <button class="btn btn-secondary btn-sm" data-action="remove" data-id="${c.id}" aria-label="Remove candidate">${icon("trash")}</button>
    </div>`;
  updateOverlay();
}

/* ---------------------------------- modal --------------------------------- */

function renderModal() {
  if (!state.modal) {
    modalRoot.innerHTML = "";
    updateOverlay();
    return;
  }

  if (state.modal.type === "add") {
    const job = activeJob();
    modalRoot.innerHTML = `
      <div class="modal-wrap" data-modal-backdrop>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="addTitle">
          <div class="modal-head">
            <div style="flex:1">
              <h2 id="addTitle">Add resumes</h2>
              <p>Adding to <b>${esc(job?.title || "this role")}</b>. Parsed locally — nothing is uploaded.</p>
            </div>
            <button class="icon-btn" data-action="closeModal" aria-label="Close">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <label class="field">
              <span class="label">Candidate name <span class="muted" style="font-weight:500">(optional)</span></span>
              <input class="input" id="addName" placeholder="Auto-detected from the resume" autocomplete="off" />
            </label>
            <label class="field">
              <span class="label">Resume text</span>
              <textarea class="textarea" id="addText" rows="8" placeholder="Paste the full resume here…"></textarea>
            </label>
            <div class="upload-zone">
              ${icon("upload")}
              <b>or upload files</b>
              <span>PDF, DOCX, TXT or MD · up to 10 files · text-based PDFs only</span>
              <label class="btn btn-secondary btn-sm">
                Choose files
                <input type="file" accept=".pdf,.docx,.txt,.md" multiple hidden data-change="upload" />
              </label>
            </div>
            <div class="form-error" id="addError">${state.addError ? icon("alert") + esc(state.addError) : ""}</div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="submitAdd">${icon("check")} Add &amp; score</button>
          </div>
        </div>
      </div>`;
  } else if (state.modal.type === "confirm") {
    const m = state.modal;
    modalRoot.innerHTML = `
      <div class="modal-wrap" data-modal-backdrop>
        <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle">
          <div class="modal-head">
            <div class="confirm-icon">${icon("alert")}</div>
            <div style="flex:1">
              <h2 id="confirmTitle">${esc(m.title)}</h2>
              <p>${esc(m.body)}</p>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost" data-action="closeModal">Cancel</button>
            <button class="btn btn-danger" data-action="confirmAction">${esc(m.confirmLabel)}</button>
          </div>
        </div>
      </div>`;
  } else if (state.modal.type === "newRole") {
    modalRoot.innerHTML = `
      <div class="modal-wrap" data-modal-backdrop>
        <div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="roleTitle">
          <div class="modal-head">
            <div style="flex:1">
              <h2 id="roleTitle">New role</h2>
              <p>Each role gets its own criteria, weights and candidate pool.</p>
            </div>
            <button class="icon-btn" data-action="closeModal" aria-label="Close">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <label class="field">
              <span class="label">Start from</span>
              <select class="select" id="rolePreset" data-change="rolePreset">
                <option value="">Blank role</option>
                ${JOB_PRESETS.map((p) => `<option value="${p.id}">${esc(p.label)}</option>`).join("")}
              </select>
            </label>
            <div class="inline-fields">
              <label class="field"><span class="label">Role title</span><input class="input" id="roleTitleInput" placeholder="e.g. Backend Engineer" /></label>
              <label class="field"><span class="label">Company</span><input class="input" id="roleCompany" placeholder="e.g. Northwind Labs" /></label>
            </div>
            <div class="inline-fields">
              <label class="field"><span class="label">Minimum years</span><input class="input" id="roleYears" type="number" min="0" max="40" value="3" /></label>
              <label class="field"><span class="label">Education</span><select class="select" id="roleEdu">${EDUCATION_LEVELS.map((l) => `<option value="${l.id}" ${l.id === "bachelor" ? "selected" : ""}>${l.label}</option>`).join("")}</select></label>
            </div>
            <label class="field">
              <span class="label">Job description <span class="muted" style="font-weight:500">(optional — skills are detected from it)</span></span>
              <textarea class="textarea" id="roleDesc" rows="6" placeholder="Paste the job description…"></textarea>
            </label>
            <div class="form-error" id="roleError"></div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost" data-action="closeModal">Cancel</button>
            <button class="btn btn-primary" data-action="createRole">${icon("plus")} Create role</button>
          </div>
        </div>
      </div>`;
  }
  updateOverlay();
}

function updateOverlay() {
  const drawerOpen = !drawerEl.hidden;
  const modalOpen = !!state.modal;
  overlay.hidden = !drawerOpen;
  document.body.style.overflow = drawerOpen || modalOpen ? "hidden" : "";
}

/* --------------------------------- render -------------------------------- */

function emptyState(iconName, title, body, actions = "") {
  return `<div class="empty">
    <div class="empty-icon">${icon(iconName)}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(body)}</p>
    ${actions ? `<div class="row">${actions}</div>` : ""}
  </div>`;
}

function emptyWorkspace() {
  return `<div class="stack stack-lg">
    ${emptyState(
      "layers",
      "No roles yet",
      "Create a role to start screening resumes against it.",
      `<button class="btn btn-primary" data-action="openNewRole">${icon("plus")} New role</button>`
    )}
  </div>`;
}

function renderScreen() {
  if (state.screen === "job") app.innerHTML = screenJob();
  else if (state.screen === "candidates") app.innerHTML = screenCandidates();
  else if (state.screen === "compare") app.innerHTML = screenCompare();
  else if (state.screen === "roles") app.innerHTML = screenRoles();
  else app.innerHTML = screenDashboard();
  app.dataset.screen = state.screen;
}

function renderAll() {
  recompute();
  renderNav();
  renderTopbar();
  renderScreen();
  renderDrawer();
  renderModal();
  persist();
}

/* --------------------------------- actions -------------------------------- */

function go(screen) {
  state.screen = screen;
  renderAll();
  window.scrollTo(0, 0);
}

function switchJob(id) {
  const job = jobById(id);
  if (!job) return;
  if (job.archived) {
    toast("Restore this role before opening it.", "err");
    return;
  }
  if (job.id === state.activeJobId && state.screen !== "roles") return;
  state.activeJobId = job.id;
  state.compare = [];
  state.selectedId = null;
  state.filters = { q: "", stage: "all", sort: "score" };
  recompute();
  renderAll();
  toast(`Switched to ${job.title}.`, "info");
}

function addCandidate(candidate) {
  state.candidates.unshift(candidate);
  recompute();
  log(`${candidate.parsed.name} added to ${activeJob()?.title || "the pool"}`, "green");
}

function submitAdd() {
  const nameInput = document.getElementById("addName");
  const textArea = document.getElementById("addText");
  const text = (textArea?.value || "").trim();
  const typedName = (nameInput?.value || "").trim();
  const job = activeJob();
  if (!job) return;

  if (text.length < 40) {
    state.addError = "Paste at least a few lines of resume text (40+ characters).";
    const el = document.getElementById("addError");
    if (el) el.innerHTML = `${icon("alert")}${esc(state.addError)}`;
    textArea?.classList.add("input-error");
    textArea?.focus();
    return;
  }

  const parsed = parseResume(text);
  if (typedName) parsed.name = typedName;
  if (parsed.email && state.candidates.some((c) => c.jobId === job.id && c.parsed.email === parsed.email)) {
    state.addError = "That email address is already in this role's pool.";
    const el = document.getElementById("addError");
    if (el) el.innerHTML = `${icon("alert")}${esc(state.addError)}`;
    return;
  }

  addCandidate({
    id: "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    jobId: job.id,
    source: "Manual",
    addedAt: new Date().toISOString(),
    stage: "new",
    starred: false,
    notes: "",
    headline: parsed.headline || "Candidate",
    location: "",
    resumeText: text,
    parsed,
  });
  state.modal = null;
  state.addError = "";
  renderAll();
  toast(`${parsed.name} added and scored.`);
}

async function handleFiles(fileList) {
  const files = Array.from(fileList || []).slice(0, 10);
  if (!files.length) return;
  const job = activeJob();
  if (!job) {
    toast("Create a role before adding resumes.", "err");
    return;
  }

  let added = 0;
  let duplicate = 0;
  let short = 0;
  let failed = 0;
  let firstError = "";

  for (const file of files) {
    try {
      const { text } = await extractResume(file);
      if (!text || text.trim().length < 40) {
        short++;
        continue;
      }
      const parsed = parseResume(text);
      if (parsed.email && state.candidates.some((c) => c.jobId === job.id && c.parsed.email === parsed.email)) {
        duplicate++;
        continue;
      }
      addCandidate({
        id: "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        jobId: job.id,
        source: file.name,
        addedAt: new Date().toISOString(),
        stage: "new",
        starred: false,
        notes: "",
        headline: parsed.headline || "Candidate",
        location: "",
        resumeText: text,
        parsed,
      });
      added++;
    } catch (err) {
      failed++;
      if (!firstError) firstError = `${file.name}: ${err.message}`;
    }
  }

  if (added) state.modal = null;
  renderAll();

  const reasons = [];
  if (added) reasons.push(`${added} resume${added > 1 ? "s" : ""} added`);
  if (duplicate) reasons.push(`${duplicate} already in this role's pool`);
  if (short) reasons.push(`${short} had too little text`);
  if (failed) reasons.push(`${failed} could not be read`);

  if (added) {
    toast(`${reasons.join(", ")}.`);
    if (firstError) setTimeout(() => toast(firstError, "err"), 600);
  } else if (failed && firstError) {
    toast(firstError, "err");
  } else if (reasons.length) {
    toast(`Nothing added — ${reasons.join(", ")}.`, "err");
  }
}

function addTag(kind, rawValue) {
  const job = activeJob();
  if (!job) return;
  const value = String(rawValue || "").trim().replace(/,$/, "").trim();
  if (!value) return;
  const list = kind === "must" ? job.mustHave : job.niceHave;
  if (list.length >= 12) {
    toast("That list is full — 12 skills is plenty.", "err");
    return;
  }
  if (list.some((t) => t.toLowerCase() === value.toLowerCase())) {
    toast(`“${value}” is already on that list.`, "info");
    return;
  }
  const other = kind === "must" ? job.niceHave : job.mustHave;
  if (other.some((t) => t.toLowerCase() === value.toLowerCase())) {
    toast(`“${value}” is already a ${kind === "must" ? "nice-to-have" : "must-have"}.`, "info");
    return;
  }
  list.push(value);
  recompute();
  renderAll();
  document.querySelector(`[data-tageditor="${kind}"] input`)?.focus();
}

function removeTag(kind, term) {
  const job = activeJob();
  if (!job) return;
  if (kind === "must") job.mustHave = job.mustHave.filter((t) => t !== term);
  else job.niceHave = job.niceHave.filter((t) => t !== term);
  delete job.keywordOverrides[term];
  recompute();
  renderAll();
}

function setStage(id, stage) {
  const c = getCandidate(id);
  if (!c || !STAGES.some((s) => s.id === stage)) return;
  c.stage = stage;
  log(`${c.parsed.name} moved to ${stageLabel(stage)}`, stage === "reject" ? "rose" : stage === "hold" ? "amber" : "green");
  renderAll();
  toast(`${c.parsed.name} → ${stageLabel(stage)}`);
}

function toggleCompare(id, forceState) {
  const isIn = state.compare.includes(id);
  const shouldAdd = forceState === undefined ? !isIn : forceState;
  if (shouldAdd && !isIn) {
    if (state.compare.length >= 3) {
      toast("You can compare up to three candidates.", "err");
      renderScreen();
      return false;
    }
    state.compare.push(id);
  } else if (!shouldAdd && isIn) {
    state.compare = state.compare.filter((x) => x !== id);
  }
  renderScreen();
  renderNav();
  renderDrawer();
  persist();
  return state.compare.includes(id);
}

function exportCsv() {
  const job = activeJob();
  if (!job || !state.results.length) {
    toast("Nothing to export yet.", "err");
    return;
  }
  const rows = sortedResults();
  const header = [
    "Name", "Email", "Role", "Headline", "Location", "Score", "Verdict", "Stage",
    "Keyword skills", "Semantic fit", "Experience", "Education", "Relevance", "Years",
    "Matched must-haves", "Missing must-haves", "Adjacent evidence",
  ];
  const csvValue = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((r) => {
    const c = getCandidate(r.candidateId);
    return [
      r.parsed.name, r.parsed.email, job.title, c.headline || r.parsed.headline, c.location,
      r.score, r.verdict, stageLabel(c.stage), r.components.skills, r.components.semantic,
      r.components.experience, r.components.education, r.components.relevance, r.parsed.years,
      `${r.matchedMustCount}/${r.mustCount}`, r.missingMust.join("; "),
      r.adjacent.map((a) => `${a.term} (${a.via})`).join("; "),
    ]
      .map(csvValue)
      .join(",");
  });
  const csv = [header.map(csvValue).join(","), ...body].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cvsense-${job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${rows.length} candidates as CSV.`);
}

function saveJob() {
  const job = activeJob();
  if (!job) return;
  const title = job.title.trim();
  if (!title) {
    toast("Give the role a title before saving.", "err");
    const input = document.querySelector('[data-field="title"]');
    input?.focus();
    input?.classList.add("input-error");
    return;
  }
  job.title = title;
  recompute();
  log(`Criteria saved for ${title}`, "");
  renderAll();
  toast(`Criteria saved. ${state.results.length} candidate${state.results.length === 1 ? "" : "s"} re-scored.`);
}

function confirmModal(title, body, confirmLabel, action, payload) {
  state.modal = { type: "confirm", title, body, confirmLabel, action, payload };
  renderModal();
}

function executeConfirm() {
  const m = state.modal;
  if (!m) return;
  if (m.action === "remove") {
    const c = getCandidate(m.payload);
    state.candidates = state.candidates.filter((x) => x.id !== m.payload);
    state.compare = state.compare.filter((x) => x !== m.payload);
    if (state.selectedId === m.payload) state.selectedId = null;
    if (c) log(`${c.parsed.name} removed from the pool`, "rose");
    state.modal = null;
    renderAll();
    toast("Candidate removed.");
  } else if (m.action === "clearPool") {
    const job = activeJob();
    state.candidates = state.candidates.filter((c) => c.jobId !== job.id);
    state.compare = [];
    state.selectedId = null;
    state.modal = null;
    renderAll();
    toast("Pool cleared for this role.");
  } else if (m.action === "deleteJob") {
    const job = jobById(m.payload);
    state.jobs = state.jobs.filter((j) => j.id !== m.payload);
    state.candidates = state.candidates.filter((c) => c.jobId !== m.payload);
    if (state.activeJobId === m.payload) {
      const next = state.jobs.find((j) => !j.archived) || state.jobs[0];
      state.activeJobId = next ? next.id : null;
      state.compare = [];
      state.selectedId = null;
    }
    state.modal = null;
    recompute();
    renderAll();
    toast(`${job ? job.title : "Role"} deleted.`);
  } else if (m.action === "resetDemo") {
    state.modal = null;
    seedWorkspace();
    state.screen = "dashboard";
    state.filters = { q: "", stage: "all", sort: "score" };
    state.compare = [];
    state.selectedId = null;
    renderAll();
    toast("Demo workspace restored.");
  } else if (m.action === "preset") {
    const preset = JOB_PRESETS.find((p) => p.id === m.payload);
    const job = activeJob();
    if (preset && job) {
      job.title = preset.job.title;
      job.company = preset.job.company;
      job.description = preset.job.description;
      job.mustHave = clone(preset.job.mustHave);
      job.niceHave = clone(preset.job.niceHave);
      job.minYears = preset.job.minYears;
      job.education = preset.job.education;
      job.keywordOverrides = {};
      log(`Criteria replaced with the ${preset.label} preset`, "amber");
      state.modal = null;
      renderAll();
      toast(`${preset.label} criteria applied.`);
    }
  }
}

function createRole() {
  const title = (document.getElementById("roleTitleInput")?.value || "").trim();
  const company = (document.getElementById("roleCompany")?.value || "").trim();
  let years = parseInt(document.getElementById("roleYears")?.value, 10);
  if (Number.isNaN(years)) years = 0;
  years = Math.max(0, Math.min(40, years));
  const education = document.getElementById("roleEdu")?.value || "bachelor";
  const description = (document.getElementById("roleDesc")?.value || "").trim();
  const presetId = document.getElementById("rolePreset")?.value || "";

  if (!title) {
    const err = document.getElementById("roleError");
    if (err) err.innerHTML = icon("alert") + "Give the role a title.";
    return;
  }

  const preset = JOB_PRESETS.find((p) => p.id === presetId);
  const job = normalizeJob({
    id: "job-" + Date.now().toString(36),
    title,
    company: company || (preset ? preset.job.company : "Your company"),
    minYears: years,
    education,
    description: description || (preset ? preset.job.description : ""),
    mustHave: preset ? clone(preset.job.mustHave) : [],
    niceHave: preset ? clone(preset.job.niceHave) : [],
    weights: preset ? clone(preset.job.weights) : { ...DEFAULT_WEIGHTS },
    keywordOverrides: {},
    archived: false,
    createdAt: new Date().toISOString(),
  });
  state.jobs.push(job);
  state.activeJobId = job.id;
  state.modal = null;
  state.compare = [];
  state.selectedId = null;
  state.filters = { q: "", stage: "all", sort: "score" };
  state.screen = "job";
  recompute();
  renderAll();
  toast(`${job.title} created. Add resumes or paste a description.`);
}

function archiveJob(id) {
  const job = jobById(id);
  if (!job) return;
  const activeOthers = state.jobs.filter((j) => j.id !== id && !j.archived);
  if (!job.archived && !activeOthers.length) {
    toast("Keep at least one open role. Create another first.", "err");
    return;
  }
  job.archived = !job.archived;
  if (job.archived && state.activeJobId === id) {
    state.activeJobId = activeOthers[0].id;
    state.compare = [];
    state.selectedId = null;
  }
  recompute();
  renderAll();
  toast(job.archived ? `${job.title} archived.` : `${job.title} restored.`);
}

function duplicateJob(id) {
  const job = jobById(id);
  if (!job) return;
  const copy = normalizeJob({
    ...clone(job),
    id: "job-" + Date.now().toString(36),
    title: `${job.title} (copy)`,
    archived: false,
    createdAt: new Date().toISOString(),
  });
  state.jobs.push(copy);
  log(`Duplicated ${job.title}`, "amber");
  renderAll();
  toast(`Created ${copy.title}. Candidates are not copied.`);
}

function loadSamples() {
  const job = activeJob();
  if (!job) return;
  const existing = new Set(
    state.candidates.filter((c) => c.jobId === job.id).map((c) => c.parsed.email).filter(Boolean)
  );
  let added = 0;
  for (const sample of SAMPLE_CANDIDATES.filter((c) => c.jobId === job.id)) {
    const parsed = parseResume(sample.resumeText);
    if (parsed.email && existing.has(parsed.email)) continue;
    state.candidates.push(hydrateCandidate({ ...clone(sample), parsed }));
    added++;
  }
  recompute();
  renderAll();
  toast(added ? `${added} sample resumes loaded.` : "The sample pool is already loaded.", added ? "ok" : "info");
}

/* --------------------------------- handlers -------------------------------- */

document.addEventListener("click", (event) => {
  const backdrop = event.target.closest("[data-modal-backdrop]");
  const actionEl = event.target.closest("[data-action]");

  if (!actionEl) {
    if (backdrop && event.target === backdrop) {
      state.modal = null;
      renderModal();
    }
    return;
  }

  const action = actionEl.dataset.action;
  const ds = { ...actionEl.dataset };
  const job = activeJob();

  switch (action) {
    case "nav":
      go(ds.screen);
      break;
    case "switchJob":
      switchJob(ds.id);
      if (state.screen === "roles") go("dashboard");
      break;
    case "openNewRole":
      state.modal = { type: "newRole" };
      state.newRolePreset = null;
      renderModal();
      setTimeout(() => document.getElementById("roleTitleInput")?.focus(), 60);
      break;
    case "createRole":
      createRole();
      break;
    case "duplicateJob":
      duplicateJob(ds.id);
      break;
    case "archiveJob":
      archiveJob(ds.id);
      break;
    case "deleteJob": {
      const target = jobById(ds.id);
      if (!target) break;
      if (state.jobs.length <= 1) {
        toast("A workspace needs at least one role.", "err");
        break;
      }
      confirmModal(
        `Delete ${target.title}?`,
        `This removes the role, its criteria and its ${state.candidates.filter((c) => c.jobId === target.id).length} candidates. This cannot be undone.`,
        "Delete role",
        "deleteJob",
        target.id
      );
      break;
    }
    case "resetDemo":
      confirmModal(
        "Reset the demo workspace?",
        "This replaces everything with the three sample roles and thirteen resumes.",
        "Reset workspace",
        "resetDemo"
      );
      break;
    case "openAdd":
      state.modal = { type: "add" };
      state.addError = "";
      renderModal();
      setTimeout(() => document.getElementById("addText")?.focus(), 60);
      break;
    case "closeModal":
      state.modal = null;
      state.addError = "";
      renderModal();
      break;
    case "submitAdd":
      submitAdd();
      break;
    case "confirmAction":
      executeConfirm();
      break;
    case "view":
      state.selectedId = ds.id;
      renderDrawer();
      setTimeout(() => drawerEl.querySelector("[data-action='closeDrawer']")?.focus(), 60);
      break;
    case "closeDrawer":
      state.selectedId = null;
      renderDrawer();
      break;
    case "stage":
      setStage(ds.id, ds.stage);
      break;
    case "star": {
      const c = getCandidate(ds.id);
      if (c) {
        c.starred = !c.starred;
        renderAll();
        toast(c.starred ? `${c.parsed.name} starred.` : `Star removed from ${c.parsed.name}.`);
      }
      break;
    }
    case "remove": {
      const c = getCandidate(ds.id);
      if (!c) break;
      confirmModal(
        `Remove ${c.parsed.name}?`,
        "This deletes the resume and its scores for this role.",
        "Remove candidate",
        "remove",
        c.id
      );
      break;
    }
    case "compareAdd": {
      const added = toggleCompare(ds.id, true);
      toast(added ? "Added to comparison." : "Comparison is full (3 max).", added ? "ok" : "err");
      break;
    }
    case "uncompare":
      toggleCompare(ds.id, false);
      break;
    case "clearCompare":
      state.compare = [];
      renderAll();
      break;
    case "goCompare":
      go("compare");
      break;
    case "stageFilter":
      state.filters.stage = ds.stage;
      renderScreen();
      renderNav();
      break;
    case "resetFilters":
      state.filters = { q: "", stage: "all", sort: "score" };
      renderAll();
      break;
    case "usePreset": {
      const preset = JOB_PRESETS.find((p) => p.id === ds.preset);
      if (!preset || !job) break;
      confirmModal(
        `Use the ${preset.label} preset?`,
        `This replaces the description and keyword lists for ${job.title}. The candidate pool stays.`,
        "Apply preset",
        "preset",
        preset.id
      );
      break;
    }
    case "resetJob": {
      if (!job) break;
      const seed = SEED_JOBS.find((j) => j.id === job.id);
      const source = seed || DEFAULT_JOB;
      job.minYears = source.minYears;
      job.education = source.education;
      job.description = source.description;
      job.mustHave = clone(source.mustHave);
      job.niceHave = clone(source.niceHave);
      job.weights = clone(DEFAULT_WEIGHTS);
      job.keywordOverrides = {};
      recompute();
      renderAll();
      toast("Criteria reset for this role.");
      break;
    }
    case "saveJob":
      saveJob();
      break;
    case "analyze": {
      recompute();
      renderAll();
      toast(`${state.profile.keywords.filter((k) => k.kind !== "ignore").length} keywords detected from the description.`);
      break;
    }
    case "removeTag":
      removeTag(ds.kind, ds.term);
      break;
    case "weightPreset": {
      if (!job) break;
      job.weights =
        ds.key === "skills"
          ? { skills: 60, semantic: 10, experience: 15, education: 5, relevance: 10 }
          : ds.key === "semantic"
          ? { skills: 35, semantic: 30, experience: 15, education: 5, relevance: 15 }
          : { ...DEFAULT_WEIGHTS };
      recompute();
      renderAll();
      toast(ds.key === "skills" ? "Keyword-first weighting applied." : ds.key === "semantic" ? "Semantic-first weighting applied." : "Balanced weighting applied.");
      break;
    }
    case "exportCsv":
      exportCsv();
      break;
    case "loadSamples":
      loadSamples();
      break;
    case "clearPool": {
      const pool = state.candidates.filter((c) => c.jobId === job.id).length;
      if (!pool) {
        toast("This pool is already empty.", "info");
        break;
      }
      confirmModal(
        "Clear this pool?",
        `This removes all ${pool} resumes for ${job.title} and their scores. Other roles are untouched.`,
        "Clear pool",
        "clearPool"
      );
      break;
    }
    default:
      break;
  }
});

document.addEventListener("change", (event) => {
  const el = event.target;
  const change = el.dataset.change;
  if (!change) return;
  const job = activeJob();

  if (change === "sort") {
    state.filters.sort = el.value;
    renderScreen();
  } else if (change === "stage") {
    setStage(el.dataset.id, el.value);
  } else if (change === "compare") {
    toggleCompare(el.dataset.id, el.checked);
  } else if (change === "switchJobSelect") {
    switchJob(el.value);
  } else if (change === "kwKind") {
    if (!job) return;
    const term = el.dataset.term;
    const value = el.value;
    if (value === "keyword") {
      delete job.keywordOverrides[term];
      job.mustHave = job.mustHave.filter((t) => t !== term);
      job.niceHave = job.niceHave.filter((t) => t !== term);
    } else {
      job.keywordOverrides[term] = value;
      if (value === "must") job.niceHave = job.niceHave.filter((t) => t !== term);
      if (value === "nice") job.mustHave = job.mustHave.filter((t) => t !== term);
    }
    recompute();
    renderAll();
    toast(`${term} set to ${value === "ignore" ? "ignored" : value}.`, "info");
  } else if (change === "education") {
    if (!job) return;
    job.education = el.value;
    recompute();
    renderAll();
  } else if (change === "minYears") {
    if (!job) return;
    let value = parseInt(el.value, 10);
    if (Number.isNaN(value)) value = 0;
    value = Math.max(0, Math.min(40, value));
    job.minYears = value;
    recompute();
    renderAll();
    toast(value ? `Minimum experience set to ${value} years.` : "Experience bar removed.", "info");
  } else if (change === "upload") {
    handleFiles(el.files);
  } else if (change === "rolePreset") {
    const preset = JOB_PRESETS.find((p) => p.id === el.value);
    state.newRolePreset = preset ? preset.id : null;
    if (preset) {
      document.getElementById("roleTitleInput").value = preset.job.title;
      document.getElementById("roleCompany").value = preset.job.company;
      document.getElementById("roleYears").value = preset.job.minYears;
      document.getElementById("roleEdu").value = preset.job.education;
      document.getElementById("roleDesc").value = preset.job.description;
    }
  }
});

document.addEventListener("input", (event) => {
  const el = event.target;
  const input = el.dataset.input;
  if (!input) return;
  const job = activeJob();

  if (input === "search") {
    state.filters.q = el.value;
    const list = document.getElementById("candidateResults");
    if (list) {
      const rows = visibleResults();
      list.innerHTML =
        rows.map(candidateCard).join("") ||
        emptyState("search", "No candidates match", "Try a different name, role, skill or resume phrase.", `<button class="btn btn-secondary" data-action="resetFilters">Clear filters</button>`);
      const count = document.getElementById("resultCount");
      if (count) count.textContent = `${rows.length} of ${state.candidates.filter((c) => c.jobId === job.id).length} candidates`;
    }
  } else if (input === "notes") {
    const c = getCandidate(el.dataset.id);
    if (c) {
      c.notes = el.value;
      persist();
    }
  } else if (input === "jobField") {
    if (!job) return;
    const field = el.dataset.field;
    if (!field) return;
    job[field] = el.value;
    if (field === "title" || field === "company") {
      renderTopbar();
      const mini = sidebar.querySelector(".job-mini-title");
      if (mini) mini.textContent = job.title || "Untitled role";
    }
    if (field === "description") recompute();
    persist();
  } else if (input === "weight") {
    if (!job) return;
    job.weights[el.dataset.key] = Number(el.value);
    recompute();
    const pct = weightPercents(job.weights);
    for (const k of ["skills", "semantic", "experience", "education", "relevance"]) {
      const node = document.getElementById("w-" + k);
      if (node) node.textContent = pct[k] + "%";
    }
    persist();
  } else if (input === "tagDraft") {
    if (/,$/.test(el.value)) addTag(el.dataset.kind, el.value);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const el = event.target;
    if (el.dataset && el.dataset.input === "tagDraft") {
      event.preventDefault();
      addTag(el.dataset.kind, el.value);
    }
    if (el.id === "roleTitleInput" && state.modal?.type === "newRole") {
      event.preventDefault();
      createRole();
    }
    if (el.id === "addText" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submitAdd();
    }
  }
  if (event.key === "Escape") {
    if (state.modal) {
      state.modal = null;
      renderModal();
    } else if (state.selectedId) {
      state.selectedId = null;
      renderDrawer();
    }
    hideDrop();
  }
});

overlay.addEventListener("click", () => {
  if (state.selectedId) {
    state.selectedId = null;
    renderDrawer();
  }
});

/* -------------------------------- drag & drop ------------------------------ */

let dragDepth = 0;

function showDrop() {
  if (!dropIcon.innerHTML) dropIcon.innerHTML = icon("upload");
  dropOverlay.hidden = false;
}

function hideDrop() {
  dragDepth = 0;
  dropOverlay.hidden = true;
}

function hasFiles(event) {
  return Array.from(event.dataTransfer?.types || []).includes("Files");
}

window.addEventListener("dragenter", (event) => {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth++;
  showDrop();
});

window.addEventListener("dragover", (event) => {
  if (!hasFiles(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

window.addEventListener("dragleave", (event) => {
  if (!hasFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) dropOverlay.hidden = true;
});

window.addEventListener("drop", (event) => {
  if (!event.dataTransfer) return;
  event.preventDefault();
  hideDrop();
  if (event.dataTransfer.files?.length) handleFiles(event.dataTransfer.files);
});

/* ---------------------------------- boot ---------------------------------- */

if (!loadWorkspace()) seedWorkspace();
if (!state.activeJobId && state.jobs.length) state.activeJobId = state.jobs[0].id;
recompute();
renderAll();

