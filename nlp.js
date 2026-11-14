// ============================================================================
// CVSense v2 scoring engine — deterministic, browser-native, explainable.
//
//   normalise → tokenise → alias expansion → phrase match
//   → requirement-section weighting → weighted coverage (direct evidence)
//   → semantic concept layer (adjacent wording) → TF cosine relevance
//   → title alignment → must-have caps → evidence snippets
//
// No model downloads, no network calls. The "semantic" component is an
// offline concept-expansion layer, not a neural embedding: it maps related
// wording ("predictive models" → machine learning) to the same concept so
// keyword gaps don't hide a qualified candidate.
// ============================================================================

const SKILL_DEFS = [
  // Frontend
  ["React", ["react", "reactjs", "react js", "react 18"], "Frontend"],
  ["Vue.js", ["vue", "vuejs", "vue js", "vue 3"], "Frontend"],
  ["Angular", ["angular", "angularjs"], "Frontend"],
  ["Svelte", ["svelte", "sveltekit"], "Frontend"],
  ["Next.js", ["next js", "nextjs", "next"], "Frontend"],
  ["TypeScript", ["typescript", "ts"], "Frontend"],
  ["JavaScript", ["javascript", "js", "ecmascript", "es6", "es2022"], "Frontend"],
  ["HTML", ["html", "html5"], "Frontend"],
  ["CSS", ["css", "css3"], "Frontend"],
  ["Sass", ["sass", "scss"], "Frontend"],
  ["Tailwind CSS", ["tailwind", "tailwindcss", "tailwind css"], "Frontend"],
  ["Redux", ["redux", "redux toolkit", "rtk"], "Frontend"],
  ["GraphQL", ["graphql", "apollo"], "Frontend"],
  ["REST APIs", ["rest", "rest api", "rest apis", "restful", "restful api"], "Frontend"],
  ["Webpack", ["webpack"], "Frontend"],
  ["Vite", ["vite"], "Frontend"],
  ["Jest", ["jest"], "Testing"],
  ["React Testing Library", ["react testing library", "rtl"], "Testing"],
  ["Playwright", ["playwright"], "Testing"],
  ["Cypress", ["cypress"], "Testing"],
  ["Storybook", ["storybook"], "Frontend"],
  ["Accessibility", ["accessibility", "a11y", "wcag", "wcag 2 2", "wcag 2 1", "screen reader"], "Frontend"],
  ["Design systems", ["design system", "design systems", "component library", "component libraries"], "Design"],
  ["Responsive design", ["responsive design", "responsive interfaces", "responsive layouts", "responsive layout"], "Frontend"],
  ["Web performance", ["core web vitals", "lighthouse", "web performance", "page performance"], "Frontend"],
  ["WebSockets", ["websocket", "websockets"], "Backend"],
  ["jQuery", ["jquery"], "Frontend"],
  ["Figma", ["figma", "figjam"], "Design"],

  // Backend / platform
  ["Node.js", ["node", "nodejs", "node js"], "Backend"],
  ["Express", ["express", "expressjs"], "Backend"],
  ["NestJS", ["nest", "nestjs"], "Backend"],
  ["Python", ["python"], "Backend"],
  ["Django", ["django"], "Backend"],
  ["Flask", ["flask"], "Backend"],
  ["FastAPI", ["fastapi"], "Backend"],
  ["Java", ["java"], "Backend"],
  ["Spring Boot", ["spring boot", "spring"], "Backend"],
  ["Ruby on Rails", ["ruby on rails", "rails", "ruby"], "Backend"],
  ["PHP", ["php"], "Backend"],
  ["Laravel", ["laravel"], "Backend"],
  ["C#", ["csharp", "c sharp"], "Backend"],
  [".NET", ["dotnet", "dot net", "asp net"], "Backend"],
  ["Go", ["golang", "go lang"], "Backend"],
  ["Rust", ["rust"], "Backend"],
  ["PostgreSQL", ["postgresql", "postgres", "psql"], "Database"],
  ["MySQL", ["mysql"], "Database"],
  ["MongoDB", ["mongodb", "mongo"], "Database"],
  ["Redis", ["redis"], "Database"],
  ["Kafka", ["kafka", "apache kafka"], "Backend"],
  ["RabbitMQ", ["rabbitmq"], "Backend"],
  ["Elasticsearch", ["elasticsearch"], "Backend"],
  ["Microservices", ["microservice", "microservices"], "Backend"],
  ["System design", ["system design", "distributed systems"], "Backend"],
  ["Docker", ["docker"], "Cloud"],
  ["Kubernetes", ["kubernetes", "k8s", "eks", "gke"], "Cloud"],
  ["Terraform", ["terraform"], "Cloud"],
  ["AWS", ["aws", "amazon web services"], "Cloud"],
  ["GCP", ["gcp", "google cloud"], "Cloud"],
  ["Azure", ["azure", "microsoft azure"], "Cloud"],
  ["CI/CD", ["ci cd", "ci/cd", "continuous integration", "github actions", "jenkins", "gitlab ci"], "Cloud"],
  ["Linux", ["linux", "bash", "shell scripting"], "Cloud"],
  ["Nginx", ["nginx"], "Cloud"],
  ["Serverless", ["serverless"], "Cloud"],
  ["Observability", ["observability", "monitoring", "alerting", "tracing"], "Cloud"],
  ["Prometheus", ["prometheus"], "Cloud"],
  ["Grafana", ["grafana"], "Cloud"],

  // Data
  ["SQL", ["sql", "structured query language"], "Data"],
  ["pandas", ["pandas"], "Data"],
  ["NumPy", ["numpy"], "Data"],
  ["scikit-learn", ["scikit learn", "sklearn", "scikit-learn"], "Data"],
  ["TensorFlow", ["tensorflow"], "Data"],
  ["PyTorch", ["pytorch"], "Data"],
  ["Machine learning", ["machine learning", "ml"], "Data"],
  ["Deep learning", ["deep learning"], "Data"],
  ["NLP", ["nlp", "natural language processing"], "Data"],
  ["LLMs", ["llm", "llms", "large language model", "large language models"], "Data"],
  ["Tableau", ["tableau"], "Data"],
  ["Power BI", ["power bi", "powerbi"], "Data"],
  ["Airflow", ["airflow", "apache airflow"], "Data"],
  ["Spark", ["spark", "pyspark", "apache spark"], "Data"],
  ["dbt", ["dbt"], "Data"],
  ["Snowflake", ["snowflake"], "Data"],
  ["BigQuery", ["bigquery"], "Data"],
  ["A/B testing", ["a b testing", "a b tests", "ab testing", "split testing", "experiment design"], "Data"],
  ["Statistics", ["statistics", "statistical"], "Data"],
  ["Data visualization", ["data visualization", "data visualisation", "data viz"], "Data"],
  ["Data pipelines", ["data pipeline", "data pipelines", "etl"], "Data"],
  ["Excel", ["excel"], "Data"],

  // Product / design / marketing
  ["Product management", ["product management", "product manager"], "Product"],
  ["Roadmapping", ["roadmap", "roadmapping"], "Product"],
  ["User research", ["user research", "user interviews", "discovery research"], "Product"],
  ["Usability testing", ["usability testing", "usability tests", "user testing"], "Product"],
  ["Wireframing", ["wireframe", "wireframes", "wireframing"], "Design"],
  ["Prototyping", ["prototype", "prototypes", "prototyping"], "Design"],
  ["UX", ["ux", "user experience"], "Design"],
  ["UI", ["ui", "user interface"], "Design"],
  ["Interaction design", ["interaction design"], "Design"],
  ["Jira", ["jira"], "Product"],
  ["Agile", ["agile", "scrum", "kanban"], "Product"],
  ["OKRs", ["okr", "okrs"], "Product"],
  ["Google Analytics", ["google analytics", "ga4"], "Marketing"],
  ["Mixpanel", ["mixpanel"], "Marketing"],
  ["Amplitude", ["amplitude"], "Marketing"],
  ["Conversion rate optimisation", ["conversion rate optimisation", "conversion rate optimization", "cro"], "Marketing"],
  ["Copywriting", ["copywriting", "copywriter"], "Marketing"],
  ["SEO", ["seo", "search engine optimisation", "search engine optimization"], "Marketing"],
  ["Content marketing", ["content marketing", "content programme", "content program"], "Marketing"],
  ["Paid acquisition", ["paid acquisition", "google ads", "ppc", "paid social", "performance marketing"], "Marketing"],
  ["CRM", ["crm", "hubspot", "salesforce", "braze"], "Marketing"],
  ["Email marketing", ["email marketing", "lifecycle marketing", "marketing automation"], "Marketing"],
  ["Brand strategy", ["brand strategy"], "Marketing"],
  ["Social media", ["social media"], "Marketing"],

  // Ways of working
  ["Mentoring", ["mentor", "mentoring", "mentorship", "mentored"], "Ways of working"],
  ["Leadership", ["leadership", "team lead", "lead engineer", "led a team"], "Ways of working"],
  ["Stakeholder management", ["stakeholder management", "stakeholders"], "Ways of working"],
  ["Cross-functional collaboration", ["cross functional", "cross-functional"], "Ways of working"],
  ["Documentation", ["documentation", "documented", "runbooks"], "Ways of working"],
  ["Code review", ["code review", "code reviews", "pull requests"], "Ways of working"],
  ["Hiring", ["hiring", "interview loop", "interviewing"], "Ways of working"],
  ["Test automation", ["test automation", "automated testing"], "Testing"],
  ["Unit testing", ["unit testing", "unit tests"], "Testing"],
];

const SKILLS = SKILL_DEFS.map(([name, aliases, category]) => ({
  name,
  aliases,
  category,
  aliasTokens: aliases.map((a) => normalize(a).split(" ").filter(Boolean)),
}));

const SKILL_BY_ALIAS = new Map();
for (const skill of SKILLS) {
  SKILL_BY_ALIAS.set(normalize(skill.name), skill);
  for (const alias of skill.aliases) {
    const key = normalize(alias);
    if (key && !SKILL_BY_ALIAS.has(key)) SKILL_BY_ALIAS.set(key, skill);
  }
}

/**
 * Adjacent wording that means the same thing in practice, used only when the
 * literal skill name is absent. This is what lets "predictive models" count as
 * evidence for machine learning, or "component library" for design systems.
 */
const CONCEPT_DEFS = {
  React: ["component", "jsx", "virtual dom", "hooks", "single page application"],
  "Next.js": ["server side rendering", "server rendered", "ssr", "app router", "static site"],
  TypeScript: ["type safety", "typed javascript", "generics"],
  JavaScript: ["vanilla javascript", "ecmascript", "frontend scripting"],
  CSS: ["stylesheet", "styling", "flexbox", "grid layout", "layout"],
  "REST APIs": ["http api", "api integration", "json api", "web service", "endpoint"],
  GraphQL: ["schema design", "query language"],
  Accessibility: ["screen reader", "keyboard navigation", "colour contrast", "audit findings"],
  "Design systems": ["design tokens", "ui kit", "pattern library", "component library"],
  "Web performance": ["latency", "load time", "bundle size", "render time"],
  "Machine learning": [
    "predictive model",
    "predictive models",
    "model training",
    "classifier",
    "classification",
    "churn model",
    "regression",
    "feature engineering",
  ],
  "Deep learning": ["neural network", "neural networks", "transformer", "convolutional"],
  LLMs: ["large language model", "prompt engineering", "fine tuning", "rag"],
  NLP: ["text classification", "named entity", "tokenisation", "tokenization"],
  Kubernetes: ["container orchestration", "helm", "pods", "cluster"],
  Terraform: ["infrastructure as code", "iac", "provisioning"],
  AWS: ["ec2", "s3", "lambda", "cloud infrastructure"],
  "CI/CD": ["deployment pipeline", "release pipeline", "continuous delivery", "merge to production"],
  Docker: ["container", "containerised", "containerized", "container image"],
  SQL: ["joins", "warehouse", "query performance", "data warehouse"],
  Python: ["scripting", "automation scripts"],
  Airflow: ["pipeline orchestration", "dag", "scheduling pipelines"],
  Snowflake: ["warehousing", "warehouse"],
  Statistics: ["hypothesis testing", "confidence interval", "significance", "statistical"],
  "A/B testing": ["experiment", "experimentation", "split test"],
  Figma: ["design file", "design tokens", "handoff"],
  "User research": ["interview", "interviews", "persona", "journey map", "discovery"],
  "Usability testing": ["user testing", "usability session", "moderated test"],
  Prototyping: ["interactive mockup", "clickable prototype", "prototype"],
  SEO: ["organic traffic", "search ranking", "keyword research", "backlink"],
  "Paid acquisition": ["google ads", "meta ads", "campaign budget", "cac", "paid social"],
  Analytics: ["measurement", "reporting", "dashboard", "kpi"],
  Agile: ["sprint", "standup", "backlog", "retrospective"],
  Mentoring: ["coaching", "mentor", "onboarding engineers"],
  "Code review": ["pull request", "peer review", "reviewed code"],
  Playwright: ["e2e", "browser automation", "browser tests"],
  "React Testing Library": ["component test", "unit test"],
  CRM: ["lifecycle campaign", "email automation"],
  Leadership: ["managed a team", "team of", "line manager"],
};

const CONCEPTS = new Map();
for (const [skill, phrases] of Object.entries(CONCEPT_DEFS)) {
  CONCEPTS.set(
    skill,
    phrases.map((p) => normalize(p).split(" ").filter(Boolean))
  );
}

export const SKILL_CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category))).sort();

export const EDUCATION_LEVELS = [
  { id: "none", label: "No requirement", rank: 0 },
  { id: "highschool", label: "High school", rank: 1 },
  { id: "associate", label: "Associate / diploma", rank: 2 },
  { id: "bachelor", label: "Bachelor's degree", rank: 3 },
  { id: "master", label: "Master's degree", rank: 4 },
  { id: "phd", label: "PhD / doctorate", rank: 5 },
];

const LEVEL_RANK = Object.fromEntries(EDUCATION_LEVELS.map((l) => [l.id, l.rank]));

export const DEFAULT_WEIGHTS = { skills: 45, experience: 20, education: 5, relevance: 15, semantic: 15 };

export function levelLabel(id) {
  return (EDUCATION_LEVELS.find((l) => l.id === id) || EDUCATION_LEVELS[0]).label;
}

/* ------------------------------- language -------------------------------- */

const STOPWORDS = new Set(
  `a about above after again against all am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves
  years year experience experiences work working worked team teams role roles job jobs company companies including include includes using used use build built building
  strong excellent good great ability able across also new well within plus etc via per
  candidate candidates applicant applicants apply application hire hiring looking seeking join joining opportunity opportunities
  responsibilities responsibility requirements required require requires preferred nice must have has benefits salary remote hybrid office
  about us our we you your day days week weeks month months
  help helps helping ensure ensuring drive driving support supporting partner partnering lead leading led own owning
  high level deep solid broad proven track record portfolio public shipped shipping scale scaling
  things thing something someone people person
  ll ve re don doesn isn aren wasn weren won
  `.split(/\s+/)
);

const MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8,
  september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/c\+\+/g, " cplusplus ")
    .replace(/c#/g, " csharp ")
    .replace(/\.net\b/g, " dotnet ")
    .replace(/node\.js/g, " nodejs ")
    .replace(/next\.js/g, " nextjs ")
    .replace(/vue\.js/g, " vuejs ")
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(word) {
  let w = word;
  if (w.length < 4) return w;
  if (/ies$/.test(w)) w = w.slice(0, -3) + "y";
  else if (/(sses|ches|shes|xes)$/.test(w)) w = w.slice(0, -2);
  else if (/s$/.test(w) && !/ss$/.test(w)) w = w.slice(0, -1);
  w = w.replace(/(ing|edly|ed|ly)$/, "");
  if (w.length < 3) return word;
  return w;
}

function countPhrase(tokens, phraseTokens) {
  if (!phraseTokens.length || phraseTokens.length > tokens.length) return 0;
  let count = 0;
  for (let i = 0; i < tokens.length; i++) {
    let ok = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      if (tokens[i + j] !== phraseTokens[j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      count++;
      i += phraseTokens.length - 1;
    }
  }
  return count;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titleCase(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => (w.length <= 2 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/* --------------------------------- resume -------------------------------- */

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

function sectionText(text, names) {
  const lines = String(text || "").split(/\r?\n/);
  const startRe = new RegExp(`^\\s*(?:[-•*]\\s*)?(${names.join("|")})\\s*:?\\s*$`, "i");
  const anyHeading = /^\s*(?:[-•*]\s*)?([A-Z][A-Z &/]{2,40})\s*:?\s*$/;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (anyHeading.test(lines[i]) && lines[i].trim().length <= 42) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function parseDateRanges(text) {
  const src = String(text || "")
    .replace(/(\d{4})\s*[–—]\s*(\d{4})/g, "$1 - $2")
    .replace(/\bto\b/gi, "-");
  const re =
    /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})\s*(?:-|–|—)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2}|present|current|now|today)/gi;
  const now = new Date();
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const ranges = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const startMonth = m[1] ? MONTHS[m[1].trim().replace(".", "").toLowerCase()] : null;
    const startYear = parseInt(m[2], 10);
    const endMonth = m[3] ? MONTHS[m[3].trim().replace(".", "").toLowerCase()] : null;
    const endRaw = m[4].toLowerCase();
    const start = startYear * 12 + (startMonth == null ? 0 : startMonth);
    let end;
    if (/present|current|now|today/.test(endRaw)) end = nowIndex;
    else end = parseInt(endRaw, 10) * 12 + (endMonth == null ? 11 : endMonth);
    if (end < start) continue;
    ranges.push([start, end]);
  }
  return ranges;
}

const ROLE_TITLE_RE =
  /\b(engineer|developer|programmer|scientist|analyst|designer|architect|administrator|devops|sre|marketing|marketer|growth|product manager)\b/i;

function parseRoleRanges(text) {
  const lines = String(text || "").split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const found = parseDateRanges(lines[i]);
    if (!found.length) continue;
    const context = [lines[i - 1], lines[i - 2], lines[i]].filter(Boolean).join(" ");
    const relevant = ROLE_TITLE_RE.test(context);
    for (const [start, end] of found) out.push({ start, end, relevant });
  }
  return out;
}

function mergeRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const cur = sorted[i];
    if (cur[0] <= last[1] + 1) last[1] = Math.max(last[1], cur[1]);
    else merged.push(cur.slice());
  }
  return merged;
}

function detectEducation(text) {
  const t = String(text || "").toLowerCase();
  const patterns = [
    ["phd", /ph\.?\s?d\b|doctorate|doctoral/],
    ["master", /master'?s\b|master\s+(?:of|in)\b|\bmba\b|\bm\.?tech\b|\bm\.?sc\b/],
    ["bachelor", /bachelor'?s\b|bachelor\s+(?:of|in)\b|\bb\.?tech\b|\bb\.?sc\b|\bb\.?e\b|\bb\.?a\b|\bba\b/],
    ["associate", /associate'?s?\s+degree|\bdiploma\b/],
    ["highschool", /high school|a levels|higher secondary/],
  ];
  for (const [id, re] of patterns) if (re.test(t)) return id;
  return "none";
}

export function parseResume(text) {
  const raw = String(text || "");
  const cleaned = raw.replace(/\r/g, "");
  const normalized = normalize(cleaned);
  const tokens = normalized.split(" ").filter(Boolean);
  const lines = cleaned.split("\n").map((l) => l.trim());

  let name = "";
  for (const line of lines) {
    if (!line) continue;
    const candidate = line.replace(/[|·•]/g, " ").trim();
    const words = candidate.split(/\s+/);
    const looksLikeHeading = /^(summary|profile|cv|resume|curriculum vitae|experience|education|skills)$/i.test(candidate);
    if (words.length >= 2 && words.length <= 5 && !looksLikeHeading && !/@|\d{4}|https?:/i.test(candidate)) {
      name = words.join(" ");
      break;
    }
  }
  const emailMatch = cleaned.match(EMAIL_RE);
  const email = emailMatch ? emailMatch[0] : "";
  if (!name) name = email ? titleCase(email.split("@")[0].replace(/[._-]+/g, " ")) : "Unnamed candidate";

  const phoneLine = lines.find((l) => /(\+?\d[\d\s().-]{7,}\d)/.test(l) && !/\d{4}\s*-\s*\d{4}/.test(l));
  const phoneMatch = phoneLine ? phoneLine.match(/(\+\d{1,3}[\d\s().-]{6,}\d|\b\d{3}[\d\s().-]{6,}\d)/) : null;
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  const educationSection = sectionText(cleaned, ["education", "academics", "academic background", "qualifications"]);
  const hasDatesSection = /experience|employment|work history/i.test(cleaned);
  const experienceSection =
    sectionText(cleaned, ["experience", "work experience", "employment", "professional experience", "work history"]) ||
    (hasDatesSection ? cleaned : "");

  const dateSource = experienceSection || cleaned.replace(educationSection, " ");
  const roleRanges = parseRoleRanges(dateSource);
  const ranges = mergeRanges(roleRanges.map((r) => [r.start, r.end]));
  const relevantRanges = mergeRanges(roleRanges.filter((r) => r.relevant).map((r) => [r.start, r.end]));
  const totalYears = Math.round((ranges.reduce((s, [a, b]) => s + Math.max(0, b - a + 1), 0) / 12) * 10) / 10;
  const relevantMonths = relevantRanges.reduce((s, [a, b]) => s + Math.max(0, b - a + 1), 0);
  let years = Math.round((relevantMonths / 12) * 10) / 10;
  if (!years) years = totalYears;

  const stated = cleaned.match(/(\d{1,2})\s*\+?\s*years?(?:\s+of)?\s+(?:professional\s+|relevant\s+|hands-on\s+)?experience/i);
  if (stated) years = Math.max(years, parseInt(stated[1], 10));
  years = Math.min(years, 45);

  let gapMonths = 0;
  for (let i = 1; i < ranges.length; i++) {
    const gap = ranges[i][0] - ranges[i - 1][1] - 1;
    if (gap > gapMonths) gapMonths = gap;
  }

  const level = detectEducation(educationSection || cleaned);

  const roleRe =
    /\b(senior|staff|principal|lead|junior|mid-level)?\s?(frontend|front-end|backend|back-end|full-stack|full stack|software|web|platform|devops|data|product|ux|ui|interaction|visual|growth|marketing|qa|test)\b\s*(engineer|developer|designer|scientist|analyst|manager|architect|administrator|specialist)?/i;
  let headline = "";
  for (const line of lines.slice(0, 6)) {
    if (!roleRe.test(line) || /@|\+?\d[\d\s()-]{7,}/.test(line)) continue;
    if (name && line.toLowerCase() === name.toLowerCase()) continue;
    headline = line.split(/[·•|—–]/)[0].replace(/\s+/g, " ").trim().slice(0, 70);
    break;
  }

  const segments = cleaned
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 16);

  const tf = new Map();
  for (const t of tokens) {
    if (STOPWORDS.has(t) || t.length < 3) continue;
    const key = stem(t);
    tf.set(key, (tf.get(key) || 0) + 1);
  }
  let norm = 0;
  const vector = new Map();
  for (const [t, c] of tf) {
    const v = 1 + Math.log(c);
    vector.set(t, v);
    norm += v * v;
  }
  norm = Math.sqrt(norm) || 1;
  for (const [t, v] of vector) vector.set(t, v / norm);

  return {
    text: cleaned,
    normalized,
    tokens,
    segments,
    name,
    email,
    phone,
    years,
    totalYears,
    level,
    levelLabel: levelLabel(level),
    gapMonths,
    headline,
    vector,
    ranges,
    wordCount: tokens.length,
  };
}

/* ---------------------------------- job ---------------------------------- */

function requirementsBlock(text) {
  const lines = String(text || "").split(/\r?\n/);
  const startRe =
    /^\s*(?:[-•*]\s*)?(requirements|must[- ]haves?|qualifications|what you.?ll need|what we.?re looking for|skills)\s*:?\s*$/i;
  const endRe =
    /^\s*(?:[-•*]\s*)?(responsibilities|what you.?ll do|nice to have|nice to haves|benefits|about us|about the team|perks|how to apply|day to day)\s*:?\s*$/i;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return { block: "", rest: lines.join("\n"), hasBlock: false };
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (endRe.test(lines[i])) {
      end = i;
      break;
    }
  }
  return {
    block: lines.slice(start, end).join("\n"),
    rest: lines.slice(0, start).concat(lines.slice(end)).join("\n"),
    hasBlock: true,
  };
}

function resolveTerm(raw) {
  const key = normalize(raw);
  if (!key) return null;
  const exact = SKILL_BY_ALIAS.get(key);
  if (exact) return { term: exact.name, aliases: exact.aliases, category: exact.category };
  const detected = detectSkills(raw);
  if (detected.length) {
    return { term: detected[0].name, aliases: detected[0].aliases, category: detected[0].category };
  }
  return { term: titleCase(raw), aliases: [String(raw).trim()], category: "Custom" };
}

export function detectSkills(text) {
  const tokens = normalize(text).split(" ").filter(Boolean);
  const out = [];
  for (const skill of SKILLS) {
    let hits = 0;
    for (const aliasTokens of skill.aliasTokens) hits += countPhrase(tokens, aliasTokens);
    if (hits > 0) out.push({ ...skill, hits });
  }
  return out;
}

export function buildProfile(job) {
  const description = String(job.description || "");
  const { block, rest, hasBlock } = requirementsBlock(description);
  const blockTokens = normalize(block).split(" ").filter(Boolean);
  const restTokens = normalize(rest).split(" ").filter(Boolean);

  const found = new Map();

  for (const skill of SKILLS) {
    let inBlock = 0;
    let inRest = 0;
    for (const aliasTokens of skill.aliasTokens) {
      inBlock += countPhrase(blockTokens, aliasTokens);
      inRest += countPhrase(restTokens, aliasTokens);
    }
    if (!inBlock && !inRest) continue;
    found.set(skill.name, {
      term: skill.name,
      display: skill.name,
      aliases: skill.aliases,
      aliasTokens: skill.aliasTokens,
      category: skill.category,
      weight: 1 + inBlock * 1.6 + inRest * 0.55,
      kind: "keyword",
      source: "description",
      inRequirements: inBlock > 0,
    });
  }

  const applyExplicit = (list, kind, weight) => {
    for (const raw of list || []) {
      const resolved = resolveTerm(raw);
      if (!resolved) continue;
      const existing = found.get(resolved.term);
      const aliasTokens = resolved.aliases.map((a) => normalize(a).split(" ").filter(Boolean));
      if (existing) {
        existing.kind = kind;
        existing.weight = weight;
        existing.source = "recruiter";
      } else {
        found.set(resolved.term, {
          term: resolved.term,
          display: resolved.term,
          aliases: resolved.aliases,
          aliasTokens,
          category: resolved.category,
          weight,
          kind,
          source: "recruiter",
          inRequirements: false,
        });
      }
    }
  };

  applyExplicit(job.mustHave, "must", 3);
  applyExplicit(job.niceHave, "nice", 1.5);

  const mustAuto = !(job.mustHave || []).length;
  if (mustAuto) {
    const auto = Array.from(found.values())
      .filter((k) => k.inRequirements && k.kind === "keyword")
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
    for (const key of auto) {
      key.kind = "must";
      key.source = "auto";
      key.weight = 3;
    }
  }

  const overrides = job.keywordOverrides || {};
  for (const [term, kind] of Object.entries(overrides)) {
    const key = Array.from(found.values()).find((k) => k.display === term);
    if (!key) continue;
    key.kind = kind === "ignore" ? "ignore" : kind;
  }

  const keywords = Array.from(found.values())
    .sort((a, b) => {
      const order = { must: 0, nice: 1, keyword: 2, ignore: 3 };
      if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
      return b.weight - a.weight;
    })
    .slice(0, 32)
    .map((k) => ({ ...k }));

  const titleTokens = Array.from(
    new Set(
      normalize(job.title || "")
        .split(" ")
        .filter((t) => t.length > 2 && !STOPWORDS.has(t))
        .map(stem)
    )
  );

  return {
    keywords,
    mustSkills: keywords.filter((k) => k.kind === "must"),
    niceSkills: keywords.filter((k) => k.kind === "nice"),
    mustAuto,
    minYears: Number(job.minYears) || 0,
    education: job.education || "none",
    hasRequirementsBlock: hasBlock,
    weights: normalizeWeights(job.weights),
    jdVector: vectorize(description),
    titleKeys: titleTokens,
    title: job.title,
  };
}

function normalizeWeights(weights) {
  const w = weights || {};
  const raw = {
    skills: Math.max(0, Number(w.skills) || 0),
    experience: Math.max(0, Number(w.experience) || 0),
    education: Math.max(0, Number(w.education) || 0),
    relevance: Math.max(0, Number(w.relevance) || 0),
    semantic: Math.max(0, Number(w.semantic) || 0),
  };
  const total = raw.skills + raw.experience + raw.education + raw.relevance + raw.semantic;
  if (!total) {
    const d = DEFAULT_WEIGHTS;
    const dt = d.skills + d.experience + d.education + d.relevance + d.semantic;
    return {
      skills: d.skills / dt,
      experience: d.experience / dt,
      education: d.education / dt,
      relevance: d.relevance / dt,
      semantic: d.semantic / dt,
    };
  }
  return {
    skills: raw.skills / total,
    experience: raw.experience / total,
    education: raw.education / total,
    relevance: raw.relevance / total,
    semantic: raw.semantic / total,
  };
}

export function weightPercents(weights) {
  const n = normalizeWeights(weights);
  return {
    skills: Math.round(n.skills * 100),
    experience: Math.round(n.experience * 100),
    education: Math.round(n.education * 100),
    relevance: Math.round(n.relevance * 100),
    semantic: Math.round(n.semantic * 100),
  };
}

function vectorize(text) {
  const tokens = normalize(text).split(" ").filter(Boolean);
  const tf = new Map();
  for (const t of tokens) {
    if (STOPWORDS.has(t) || t.length < 3) continue;
    const key = stem(t);
    tf.set(key, (tf.get(key) || 0) + 1);
  }
  let norm = 0;
  const vector = new Map();
  for (const [t, c] of tf) {
    const v = 1 + Math.log(c);
    vector.set(t, v);
    norm += v * v;
  }
  norm = Math.sqrt(norm) || 1;
  for (const [t, v] of vector) vector.set(t, v / norm);
  return vector;
}

function cosine(a, b) {
  if (!a || !b) return 0;
  let dot = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const [t, v] of small) {
    const other = big.get(t);
    if (other) dot += v * other;
  }
  return dot;
}

/* -------------------------------- scoring -------------------------------- */

function creditFor(hits) {
  if (!hits) return 0;
  if (hits >= 3) return 1;
  if (hits === 2) return 0.85;
  return 0.6;
}

function countKeyword(parsed, key) {
  let hits = 0;
  for (const aliasTokens of key.aliasTokens) hits += countPhrase(parsed.tokens, aliasTokens);
  return hits;
}

function conceptPhrases(key) {
  return CONCEPTS.get(key.display) || [];
}

function countConcept(parsed, key) {
  let hits = 0;
  for (const phrase of conceptPhrases(key)) hits += countPhrase(parsed.tokens, phrase);
  return hits;
}

function conceptLabel(key, parsed) {
  for (const phrase of conceptPhrases(key)) {
    if (countPhrase(parsed.tokens, phrase)) return phrase.join(" ");
  }
  return "";
}

function snippetFor(parsed, aliases) {
  const needles = aliases
    .map((a) => String(a).toLowerCase().trim())
    .filter((a) => a.length >= 3)
    .map((a) => new RegExp(`\\b${escapeRe(a)}`, "i"));
  for (const segment of parsed.segments) {
    if (needles.some((re) => re.test(segment))) {
      const trimmed = segment.replace(/\s+/g, " ").replace(/^[-•*]\s*/, "");
      return trimmed.length > 165 ? trimmed.slice(0, 162) + "…" : trimmed;
    }
  }
  return "";
}

function verdictFor(score) {
  if (score >= 80) return { label: "Strong match", tier: "strong" };
  if (score >= 65) return { label: "Good match", tier: "good" };
  if (score >= 50) return { label: "Possible", tier: "possible" };
  return { label: "Weak match", tier: "weak" };
}

export function scoreCandidate(candidate, profile, jobWeights) {
  const parsed = candidate.parsed || parseResume(candidate.resumeText || "");
  const weights = normalizeWeights(jobWeights || profile.weights);

  const matched = [];
  const adjacent = [];
  const missingMust = [];
  const missingNice = [];
  let mustTotal = 0;
  let mustHit = 0;
  let niceTotal = 0;
  let niceHit = 0;
  let kwTotal = 0;
  let kwHit = 0;
  let semTotal = 0;
  let semHit = 0;

  for (const key of profile.keywords) {
    if (key.kind === "ignore") continue;
    const hits = countKeyword(parsed, key);
    const concept = hits ? 0 : countConcept(parsed, key);
    const w = key.weight || 1;
    const credit = creditFor(hits) * w;

    const semCredit = hits ? credit : concept ? 0.55 * w : 0;

    if (key.kind === "must") {
      mustTotal += w;
      mustHit += credit;
      semTotal += w;
      semHit += semCredit;
    } else if (key.kind === "nice") {
      niceTotal += w;
      niceHit += credit;
      semTotal += w;
      semHit += semCredit;
    } else {
      kwTotal += w;
      kwHit += credit;
    }

    if (hits > 0) {
      matched.push({
        term: key.display,
        kind: key.kind,
        category: key.category,
        hits,
        via: "direct",
        snippet: snippetFor(parsed, key.aliases),
      });
    } else if (concept > 0) {
      const via = conceptLabel(key, parsed);
      adjacent.push({
        term: key.display,
        kind: key.kind,
        category: key.category,
        via,
        snippet: snippetFor(parsed, [via]),
      });
    } else if (key.kind === "must") {
      missingMust.push(key.display);
    } else if (key.kind === "nice") {
      missingNice.push(key.display);
    }
  }

  const mustCov = mustTotal ? mustHit / mustTotal : null;
  const niceCov = niceTotal ? niceHit / niceTotal : null;
  const kwCov = kwTotal ? kwHit / kwTotal : 0;

  let skillsScore;
  if (mustCov != null) {
    const secondary = niceCov != null ? niceCov : kwCov;
    skillsScore = 100 * (0.7 * mustCov + 0.3 * secondary);
  } else if (niceCov != null) {
    skillsScore = 100 * niceCov;
  } else {
    skillsScore = 100 * kwCov;
  }

  // Semantic fit is scored over the skills that actually define the role.
  if (!semTotal) {
    semTotal = kwTotal;
    semHit = kwHit;
  }
  const semCoverage = semTotal ? semHit / semTotal : 0;
  const titleKeys = profile.titleKeys || [];
  const titleHits = titleKeys.filter((t) => parsed.vector.has(t)).length;
  const titleAlign = titleKeys.length ? titleHits / titleKeys.length : 0.6;
  const semanticScore = Math.max(
    0,
    Math.min(100, Math.round(100 * (0.82 * semCoverage + 0.18 * titleAlign)))
  );

  const minYears = Number(profile.minYears) || 0;
  const years = parsed.years || 0;
  let experienceScore;
  if (minYears <= 0) experienceScore = years > 0 ? 90 : 70;
  else {
    const ratio = years / minYears;
    if (ratio >= 1.4) experienceScore = 100;
    else if (ratio >= 1.05) experienceScore = 94;
    else if (ratio >= 0.95) experienceScore = 88;
    else if (ratio >= 0.8) experienceScore = 76;
    else if (ratio >= 0.6) experienceScore = 60;
    else if (ratio > 0) experienceScore = 44;
    else experienceScore = 25;
  }

  const reqRank = LEVEL_RANK[profile.education] ?? 0;
  const gotRank = LEVEL_RANK[parsed.level] ?? 0;
  let educationScore;
  if (!reqRank) educationScore = 100;
  else if (gotRank >= reqRank) educationScore = 100;
  else if (gotRank === reqRank - 1) educationScore = 62;
  else if (gotRank > 0) educationScore = 38;
  else educationScore = 25;

  const cos = cosine(profile.jdVector, parsed.vector);
  const relevanceScore = Math.max(0, Math.min(100, Math.round(Math.pow(Math.max(cos, 0), 0.62) * 148)));

  let score =
    skillsScore * weights.skills +
    experienceScore * weights.experience +
    educationScore * weights.education +
    relevanceScore * weights.relevance +
    semanticScore * weights.semantic;

  let capped = false;
  if (missingMust.length > 0) {
    const cap = Math.max(38, 84 - 6 * (missingMust.length - 1));
    if (score > cap) {
      score = cap;
      capped = true;
    }
  }
  if (minYears > 0 && years > 0 && years < minYears - 2) score -= 4;
  score = Math.max(1, Math.min(99, Math.round(score)));

  const mustCount = profile.mustSkills.length;
  const matchedMustCount = mustCount - missingMust.length;
  const adjacentMust = profile.mustSkills.filter(
    (k) => !matched.some((m) => m.term === k.display) && adjacent.some((a) => a.term === k.display)
  ).length;
  const verdict = verdictFor(score);

  const reasons = [];
  if (mustCount) {
    reasons.push(
      matchedMustCount === mustCount
        ? `Meets all ${mustCount} must-have skills`
        : `Meets ${matchedMustCount} of ${mustCount} must-have skills`
    );
  }
  if (minYears > 0 && years > 0) {
    reasons.push(`${years % 1 === 0 ? years : years.toFixed(1)} yrs experience vs ${minYears} required`);
  }
  if (reqRank > 0) {
    reasons.push(
      gotRank >= reqRank
        ? `${parsed.levelLabel} matches the education requirement`
        : `${parsed.levelLabel} listed, ${levelLabel(profile.education)} preferred`
    );
  }

  const flags = [];
  if (missingMust.length) {
    flags.push({
      type: "warn",
      text: `Missing must-have${missingMust.length > 1 ? "s" : ""}: ${missingMust.join(", ")}.`,
    });
  }
  if (adjacentMust > 0) {
    flags.push({
      type: "good",
      text: `Semantic layer found adjacent evidence for ${adjacentMust} must-have${
        adjacentMust > 1 ? "s" : ""
      } — check the wording before rejecting.`,
    });
  }
  if (semanticScore - skillsScore >= 15 && adjacent.length > 0) {
    flags.push({
      type: "good",
      text: "Wording differs from the job description but the meaning overlaps — semantic fit is stronger than literal keyword coverage.",
    });
  }
  if (!parsed.email) flags.push({ type: "warn", text: "No email address found in the resume." });
  if (parsed.wordCount < 90) flags.push({ type: "warn", text: "Resume looks unusually short — little evidence to score." });
  if (!parsed.ranges.length) flags.push({ type: "warn", text: "No employment dates found, so experience is an estimate." });
  if (parsed.gapMonths >= 18) {
    flags.push({ type: "warn", text: `About ${Math.round(parsed.gapMonths / 12)} year gap between roles — worth asking about.` });
  }
  if (minYears > 0 && years > 0 && years < minYears) {
    flags.push({ type: "warn", text: `${years} years detected against a ${minYears} year bar.` });
  }
  if (matchedMustCount === mustCount && mustCount > 0) {
    flags.push({ type: "good", text: "Every must-have skill has evidence in the resume." });
  }
  if (reqRank > 0 && gotRank >= reqRank) flags.push({ type: "good", text: "Education requirement satisfied." });

  return {
    candidateId: candidate.id,
    parsed,
    score,
    verdict: verdict.label,
    tier: verdict.tier,
    capped,
    components: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationScore),
      relevance: Math.round(relevanceScore),
      semantic: semanticScore,
    },
    coverage: {
      must: mustCov == null ? null : Math.round(mustCov * 100),
      nice: niceCov == null ? null : Math.round(niceCov * 100),
      keywords: Math.round(kwCov * 100),
    },
    matched,
    adjacent,
    missingMust,
    missingNice,
    matchedMustCount,
    mustCount,
    adjacentMust,
    titleAlign: Math.round(titleAlign * 100),
    reasons,
    flags,
    cosine: Math.round(cos * 100) / 100,
    weights,
  };
}

export function scoreLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Possible";
  return "Weak";
}

export const TIER_COLORS = {
  strong: "#059669",
  good: "#2563EB",
  possible: "#D97706",
  weak: "#DC2626",
};
