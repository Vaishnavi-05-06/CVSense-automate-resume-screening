// CVSense demo workspace: three open roles and thirteen hand-written resumes.
// Everything stays in the browser — no uploads, no server.

import { DEFAULT_WEIGHTS } from "./nlp.js";

const w = () => ({ ...DEFAULT_WEIGHTS });

export const DEFAULT_JOB = {
  id: "job-frontend",
  title: "Senior Frontend Engineer",
  company: "Northwind Labs",
  minYears: 5,
  education: "bachelor",
  description: `Northwind Labs is hiring a Senior Frontend Engineer to lead the interface layer of our analytics platform. You will own complex, data-dense screens used by thousands of analysts every day, and you will raise the bar for performance, accessibility and code quality across the frontend guild.

What you'll do
- Build and maintain product surfaces in React and TypeScript, from Figma handoff through production.
- Evolve our design system and component library so teams ship consistent UI quickly.
- Improve Core Web Vitals and page performance on our heaviest dashboards.
- Write reliable tests with Playwright and React Testing Library, and review pull requests carefully.
- Partner with product and design on discovery, prototyping and usability testing.
- Mentor two to three engineers and help run our frontend hiring loop.

Requirements
- 5+ years of professional frontend experience, with at least 2 years on React.
- Deep TypeScript and modern JavaScript knowledge.
- Strong CSS fundamentals: layout, responsive design and cross-browser debugging.
- Experience consuming REST APIs and debugging network behaviour.
- Working knowledge of WCAG accessibility standards.
- Comfortable collaborating in an Agile, cross-functional team.

Nice to have
- Next.js or another server-rendered framework.
- GraphQL and schema design.
- Experience maintaining a design system at scale.
- Vite, Storybook or similar build and documentation tooling.
- A public portfolio of shipped work.`,
  mustHave: ["React", "TypeScript", "JavaScript", "CSS", "REST APIs"],
  niceHave: ["Next.js", "GraphQL", "Design systems", "Accessibility", "Playwright", "Vite"],
  weights: w(),
  keywordOverrides: {},
  archived: false,
  createdAt: "2026-10-28T09:00:00.000Z",
};

export const SEED_JOBS = [
  DEFAULT_JOB,
  {
    id: "job-data",
    title: "Data Scientist",
    company: "Meridian Health",
    minYears: 4,
    education: "master",
    description: `Meridian Health is looking for a Data Scientist to turn messy clinical and claims data into models our care teams actually use. You will work across product and clinical operations, from framing the question to shipping a model and watching its behaviour in production.

What you'll do
- Build predictive models with Python, pandas and scikit-learn, and evaluate them honestly.
- Write production-grade SQL against our warehouse and design experiments with clear success metrics.
- Partner with clinicians and product managers to translate vague questions into measurable outcomes.
- Own dashboards and communicate findings to non-technical stakeholders.
- Document methodology so results can be audited and reproduced.

Requirements
- 4+ years of applied data science or analytics experience.
- Strong Python and SQL; comfortable with pandas and NumPy.
- Solid grounding in statistics, including A/B testing and experiment design.
- Experience with machine learning in a production setting.
- Clear written communication and stakeholder management.

Nice to have
- scikit-learn, TensorFlow or PyTorch.
- Airflow, dbt or Snowflake.
- Healthcare or regulated-industry experience.
- Data visualisation with Tableau or Power BI.`,
    mustHave: ["Python", "SQL", "Machine learning", "Statistics"],
    niceHave: ["scikit-learn", "Airflow", "Snowflake", "A/B testing", "Data visualization"],
    weights: w(),
    keywordOverrides: {},
    archived: false,
    createdAt: "2026-10-30T10:00:00.000Z",
  },
  {
    id: "job-design",
    title: "Product Designer",
    company: "Fieldnote",
    minYears: 4,
    education: "bachelor",
    description: `Fieldnote is hiring a Product Designer to shape how small teams plan their field operations. You will work end to end: framing the problem with research, prototyping quickly, and shipping polished UI with our engineering team.

What you'll do
- Lead discovery with user research, interviews and usability testing.
- Turn insight into flows, wireframes and high-fidelity prototypes in Figma.
- Maintain and extend our design system so the product feels coherent.
- Pair with engineers daily and review implementation quality.
- Present work clearly and defend decisions with evidence, not taste alone.

Requirements
- 4+ years designing shipped digital products.
- Expert Figma skills and a strong portfolio of end-to-end work.
- Experience running user research and usability testing.
- Comfortable designing responsive interfaces for web and mobile.
- Strong collaboration with product and engineering.

Nice to have
- Experience with design systems and component documentation.
- Basic HTML and CSS literacy.
- Prototyping with motion or interactive tools.
- B2B or SaaS product experience.`,
    mustHave: ["Figma", "User research", "Prototyping", "Usability testing"],
    niceHave: ["Design systems", "Wireframing", "HTML", "CSS", "Product management"],
    weights: w(),
    keywordOverrides: {},
    archived: false,
    createdAt: "2026-11-01T08:30:00.000Z",
  },
];

export const JOB_PRESETS = [
  { id: "fe", label: "Senior Frontend Engineer", meta: "5+ yrs · React · full copy", job: DEFAULT_JOB },
  { id: "ds", label: "Data Scientist", meta: "4+ yrs · Python · ML", job: SEED_JOBS[1] },
  { id: "pd", label: "Product Designer", meta: "4+ yrs · Figma · research", job: SEED_JOBS[2] },
  {
    id: "devops",
    label: "Platform / DevOps Engineer",
    meta: "5+ yrs · AWS · Kubernetes",
    job: {
      id: "job-devops",
      title: "Platform Engineer",
      company: "Rowan Cloud",
      minYears: 5,
      education: "bachelor",
      description: `Rowan Cloud is looking for a Platform Engineer to own the infrastructure that runs our multi-tenant product. You will make deploys boring, keep the on-call rotation calm, and give product teams safe, fast paths to production.

What you'll do
- Operate and harden our AWS estate with Terraform and Kubernetes.
- Build CI/CD pipelines and reduce lead time from merge to production.
- Improve observability: metrics, tracing, alerting and useful runbooks.
- Automate the repetitive work with Python and shell tooling.
- Share on-call and lead incident reviews without blame.

Requirements
- 5+ years in DevOps, SRE or platform engineering.
- Strong AWS and Kubernetes experience in production.
- Infrastructure as code with Terraform.
- Docker, Linux administration and CI/CD pipelines.
- Scripting in Python or Go.

Nice to have
- Observability tooling such as Prometheus or Grafana.
- PostgreSQL operations and query performance tuning.
- Security hardening and compliance work.
- Experience with serverless platforms.`,
      mustHave: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
      niceHave: ["Python", "Prometheus", "Linux", "PostgreSQL", "Observability"],
      weights: w(),
      keywordOverrides: {},
      archived: false,
      createdAt: "2026-11-01T09:00:00.000Z",
    },
  },
  {
    id: "growth",
    label: "Growth Marketing Manager",
    meta: "5+ yrs · SEO · paid",
    job: {
      id: "job-growth",
      title: "Growth Marketing Manager",
      company: "Parcel & Pine",
      minYears: 5,
      education: "bachelor",
      description: `Parcel & Pine is hiring a Growth Marketing Manager to own acquisition and lifecycle for our D2C subscription brand. You will run experiments end to end and be judged on payback, not impressions.

What you'll do
- Own paid acquisition across search and social, with a clear budget and CAC target.
- Run SEO and content programmes that compound over time.
- Design and analyse A/B tests with our data team.
- Build lifecycle campaigns — onboarding, activation, winback — in our CRM.
- Report performance weekly to the leadership team.

Requirements
- 5+ years in growth, performance or lifecycle marketing.
- Hands-on paid acquisition experience and budget ownership.
- Strong analytical skills and comfort with analytics tools.
- Experience with SEO and content marketing.
- Excellent copywriting and communication.

Nice to have
- CRM automation with HubSpot or Braze.
- Conversion rate optimisation experience.
- SQL for self-serve analysis.
- Subscription or ecommerce background.`,
      mustHave: ["Paid acquisition", "SEO", "Analytics", "A/B testing"],
      niceHave: ["Content marketing", "CRM", "Copywriting", "Conversion rate optimisation"],
      weights: w(),
      keywordOverrides: {},
      archived: false,
      createdAt: "2026-11-01T09:15:00.000Z",
    },
  },
];

const frontendResumes = [
  {
    id: "c-priya",
    jobId: "job-frontend",
    source: "LinkedIn",
    addedAt: "2026-11-04T09:12:00.000Z",
    stage: "shortlist",
    starred: true,
    notes: "Strong systems thinker. Asked good questions about our design tokens.",
    headline: "Senior Frontend Engineer",
    location: "Bengaluru, India",
    resumeText: `Priya Raman
Senior Frontend Engineer · Bengaluru, India
priya.raman@example.com · +91 98450 11223 · linkedin.com/in/priyaraman

SUMMARY
Senior frontend engineer with 8 years of experience building accessible, high-performance web products. I lead design-system work, mentor engineers and care about measurable outcomes rather than shipping volume.

CORE SKILLS
React, TypeScript, JavaScript (ES2022), Next.js, Redux Toolkit, CSS, Tailwind CSS, HTML5, GraphQL, REST APIs, Jest, React Testing Library, Vite, Webpack, WCAG 2.2 accessibility, Figma handoff

EXPERIENCE
Northwind Labs — Senior Frontend Engineer
Mar 2021 - Present
Led the rebuild of the customer dashboard in React and TypeScript, cutting interaction latency by 38% and raising Lighthouse performance from 61 to 94.
Built and documented a 42-component design system adopted by four product teams, reducing UI defects by 27%.
Introduced React Testing Library and Playwright coverage, taking critical-path test coverage from 12% to 78%.
Drove WCAG 2.2 AA accessibility remediation across checkout, closing 63 audit findings.

Lumen Health — Frontend Engineer
Jun 2019 - Feb 2021
Shipped a GraphQL-backed scheduling flow used by 120k patients each month.
Migrated a legacy jQuery interface to React 16 and TypeScript, deleting 14k lines of code.
Partnered with design on a Figma token pipeline that cut handoff time from 9 days to 3.

Trellis Studio — Junior Developer
Jul 2018 - May 2019
Built responsive marketing sites with HTML, CSS and vanilla JavaScript.
Automated image optimisation in the build pipeline with Node.js and Webpack.

EDUCATION
B.Tech, Computer Science — Vellore Institute of Technology, 2018

PROJECTS
Contrast Buddy — an open-source accessibility checker with 1.2k GitHub stars.`,
  },
  {
    id: "c-sofia",
    jobId: "job-frontend",
    source: "Referral",
    addedAt: "2026-11-05T14:40:00.000Z",
    stage: "shortlist",
    starred: false,
    notes: "Referral from Dana on the platform team. Available in 6 weeks.",
    headline: "Staff Frontend Engineer",
    location: "Austin, USA",
    resumeText: `Sofia Alvarez
Staff Frontend Engineer · Austin, Texas
sofia.alvarez@example.com · +1 512 555 0188 · sofia.dev

SUMMARY
Staff frontend engineer with 11 years of experience across design systems, accessibility and application performance. I work at the seam between design and engineering and like problems with a measurable user impact.

EXPERIENCE
Cobalt Analytics — Staff Frontend Engineer
Jan 2020 - Present
Own the frontend architecture for a dashboarding product used by 40,000 analysts; drove Core Web Vitals from "needs improvement" to "good" on all templates.
Designed and maintained a cross-brand design system in React and TypeScript with 60+ components, documented in Storybook and consumed by five teams.
Built the reporting API client in TypeScript against REST APIs and GraphQL, with caching that cut dashboard load time by 35%.
Led WCAG 2.2 accessibility strategy: trained 20 engineers, reduced blocking issues from 88 to 6.
Introduced Playwright end-to-end tests and visual regression checks in CI, cutting release regressions by half.
Mentor four engineers; run the frontend interview loop and hiring bar.

Harbor Metrics — Senior Frontend Engineer
Aug 2016 - Dec 2019
Rebuilt the reporting suite in React, TypeScript and GraphQL, improving time-to-first-insight by 41%.
Migrated styling to CSS modules and later Tailwind CSS; reduced CSS payload by 62%.
Partnered with product on discovery and usability testing for three major releases.

Quill Interactive — Frontend Developer
Sep 2015 - Jul 2016
Built responsive interfaces with JavaScript, HTML and CSS for client campaigns.

EDUCATION
B.Sc. Computer Science — University of Texas at Austin, 2015

WRITING
"Design tokens that survive a redesign" — 2024, 18k reads.`,
  },
  {
    id: "c-marcus",
    jobId: "job-frontend",
    source: "Careers page",
    addedAt: "2026-11-06T10:05:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Full-Stack Engineer",
    location: "Manchester, UK",
    resumeText: `Marcus Webb
Full-Stack Engineer · Manchester, United Kingdom
marcus.webb@example.com · +44 7700 900431 · github.com/marcuswebb

SUMMARY
Full-stack engineer with 7 years of experience shipping React front ends and Node.js services. Comfortable owning a feature from database schema to polished UI.

SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, Express, REST APIs, PostgreSQL, Redis, AWS, Docker, Jest, CSS, Tailwind CSS, GitHub Actions

EXPERIENCE
Bramble Logistics — Full-Stack Engineer
Apr 2021 - Present
Built a React and TypeScript dispatch console used by 900 operators daily.
Designed REST APIs in Node.js and Express backed by PostgreSQL and Redis.
Moved deployments to GitHub Actions and Docker, reducing release time from 45 to 8 minutes.
Improved dashboard render time by 30% through code splitting and memoisation.

Pinegrove Digital — Web Developer
Sep 2019 - Mar 2021
Delivered React storefronts with Next.js and a shared component library.
Wrote Jest unit tests and set up ESLint and Prettier across three repositories.
Worked directly with clients to scope and estimate work.

Freelance — Developer
Jun 2018 - Aug 2019
Built small business websites with JavaScript, HTML and CSS.

EDUCATION
BSc Software Engineering — University of Salford, 2018`,
  },
  {
    id: "c-aisha",
    jobId: "job-frontend",
    source: "LinkedIn",
    addedAt: "2026-11-07T08:30:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Frontend Developer",
    location: "Toronto, Canada",
    resumeText: `Aisha Khan
Frontend Developer · Toronto, Canada
aisha.khan@example.com · +1 416 555 0142

SUMMARY
Frontend developer with 5 years of experience building design-led interfaces in Vue and TypeScript. Strong CSS foundations, design systems and component APIs. Currently learning React on a side project.

SKILLS
Vue.js, TypeScript, JavaScript, CSS, SCSS, Tailwind CSS, Vite, Storybook, Figma, REST APIs, Vitest, design systems, responsive design, HTML5, accessibility basics

EXPERIENCE
Lumen Studio — Frontend Developer
Feb 2021 - Present
Built a 30-component Vue 3 and TypeScript design system documented in Storybook, adopted by three product teams.
Rebuilt the marketing site in Vite, cutting build time from 4 minutes to 25 seconds.
Improved Lighthouse accessibility score from 71 to 96 across core templates.
Worked from Figma specs with designers and reviewed pull requests.

Northline Media — Junior Frontend Developer
Mar 2019 - Jan 2021
Developed responsive layouts in SCSS and Vue for editorial products.
Fixed cross-browser issues across Safari, Chrome and Firefox.
Added unit tests with Vitest for shared utilities.

PROJECTS
Recipe box — a small React and TypeScript app for meal planning (side project, 2025).

EDUCATION
Diploma in Web Development — George Brown College, 2018`,
  },
  {
    id: "c-tom",
    jobId: "job-frontend",
    source: "Careers page",
    addedAt: "2026-11-08T16:22:00.000Z",
    stage: "hold",
    starred: false,
    notes: "Career changer, strong motivation. Revisit for the mid-level opening.",
    headline: "Junior Web Developer",
    location: "Leeds, UK",
    resumeText: `Tom Becker
Junior Web Developer · Leeds, United Kingdom
tom.becker@example.com · +44 7700 900782

SUMMARY
Career changer moving from operations management into web development. Two years of hands-on experience building React interfaces, with a focus on clean components and steady improvement.

SKILLS
JavaScript, React, HTML, CSS, Git, REST APIs, Jest basics, Figma basics

EXPERIENCE
Harbor & Co — Web Developer (part-time)
Mar 2025 - Present
Build and maintain React components for an internal booking tool.
Fixed responsive layout bugs reported by the operations team.
Wrote documentation for the component library.

Self-employed — Operations Consultant
Jan 2017 - Feb 2025
Ran process improvement projects for small logistics firms.
Managed a team of six and owned supplier relationships.

EDUCATION
Full-Stack Web Development Bootcamp — Northcoders, 2024
BSc Business Management — University of Leeds, 2016`,
  },
  {
    id: "c-daniel",
    jobId: "job-frontend",
    source: "Job board",
    addedAt: "2026-11-09T11:15:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Data Scientist",
    location: "Berlin, Germany",
    resumeText: `Daniel Osei
Data Scientist · Berlin, Germany
daniel.osei@example.com · +49 151 2345 6789

SUMMARY
Data scientist with 6 years of experience building predictive models and analytics products in Python. Comfortable owning a model from exploration through production monitoring.

SKILLS
Python, SQL, pandas, NumPy, scikit-learn, TensorFlow, statistics, A/B testing, Airflow, Snowflake, dbt, Tableau, Git, Docker

EXPERIENCE
Helio Energy — Data Scientist
May 2021 - Present
Built a churn model in scikit-learn that lifted retention campaign precision by 23%.
Designed and analysed 14 A/B tests on pricing and onboarding.
Owned Airflow pipelines loading 40M rows per day into Snowflake.
Presented monthly findings to the commercial leadership team.

Kestrel Analytics — Junior Data Analyst
Aug 2019 - Apr 2021
Built Tableau dashboards for retail clients.
Wrote SQL transformations with dbt and improved data freshness from 24h to 2h.

EDUCATION
M.Sc. Data Science — Technical University of Berlin, 2019
BSc Mathematics — University of Ghana, 2017`,
  },
  {
    id: "c-elena",
    jobId: "job-frontend",
    source: "Dribbble",
    addedAt: "2026-11-10T13:48:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Senior Product Designer",
    location: "Lisbon, Portugal",
    resumeText: `Elena Petrova
Senior Product Designer · Lisbon, Portugal
elena.petrova@example.com · elenapetrova.design

SUMMARY
Product designer with 8 years of experience designing B2B SaaS products end to end. I run research, prototype quickly in Figma and care about the details of the shipped interface.

EXPERIENCE
Vantage Software — Senior Product Designer
Feb 2020 - Present
Led design for a reporting suite used by 12,000 customers, from research through launch.
Ran 60+ usability testing sessions and built a research repository the whole team uses.
Maintained a Figma design system with 80 components and tokens shared with engineering.
Partnered with frontend engineers on implementation reviews and accessibility checks.

Pinewood Labs — Product Designer
Jun 2016 - Jan 2020
Designed onboarding and billing flows for a subscription platform.
Created wireframes and interactive prototypes for stakeholder reviews.
Introduced a lightweight design critique ritual across two product teams.

EDUCATION
BA Interaction Design — Universidade de Lisboa, 2016

TOOLS
Figma, FigJam, Maze, Notion, basic HTML and CSS`,
  },
  {
    id: "c-rajesh",
    jobId: "job-frontend",
    source: "Referral",
    addedAt: "2026-11-11T07:55:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "DevOps Engineer",
    location: "Pune, India",
    resumeText: `Rajesh Nair
DevOps Engineer · Pune, India
rajesh.nair@example.com · +91 98200 44551

SUMMARY
DevOps engineer with 9 years of experience running production infrastructure on AWS. I focus on reliable deploys, observability and making on-call humane.

SKILLS
AWS, Kubernetes, Terraform, Docker, CI/CD, Linux, Python, Prometheus, Grafana, PostgreSQL, Nginx, GitHub Actions, Bash

EXPERIENCE
Blue Harbour Systems — Senior DevOps Engineer
Jan 2019 - Present
Migrated 40 services to Kubernetes on AWS with Terraform-managed infrastructure.
Cut deployment frequency from weekly to 30+ per day with GitHub Actions pipelines.
Built Prometheus and Grafana monitoring, reducing mean time to detect from 22 to 4 minutes.
Led incident reviews and wrote runbooks for the top 15 failure modes.

Cirrus Retail — Systems Administrator
Jul 2016 - Dec 2018
Managed Linux servers and Nginx load balancers for a retail platform.
Automated backups and patching with Bash and Python.

EDUCATION
B.E. Information Technology — Savitribai Phule Pune University, 2016`,
  },
  {
    id: "c-nadia",
    jobId: "job-frontend",
    source: "LinkedIn",
    addedAt: "2026-11-09T09:05:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Growth Marketing Manager",
    location: "London, UK",
    resumeText: `Nadia Rahman
Growth Marketing Manager · London, United Kingdom
nadia.rahman@example.com · +44 7700 900318

SUMMARY
Growth marketing manager with 7 years of experience in D2C subscription businesses. I own paid acquisition and lifecycle programmes end to end and report on payback, not impressions.

SKILLS
Paid acquisition, SEO, content marketing, lifecycle marketing, CRM, Google Analytics, A/B testing, conversion rate optimisation, copywriting, SQL, HubSpot, Google Ads

EXPERIENCE
Fern & Field — Growth Marketing Manager
Mar 2022 - Present
Own a £1.4M annual paid acquisition budget across search and paid social, holding CAC flat while tripling new subscribers.
Grew organic traffic 180% in 18 months through an SEO and content programme.
Ran 40+ A/B tests on landing pages and onboarding, lifting trial-to-paid conversion from 22% to 31%.
Built lifecycle campaigns in HubSpot for activation and winback, recovering 9% of churned subscribers.
Report weekly on channel performance and payback to the leadership team.

Bloomkit — Performance Marketing Specialist
Jun 2019 - Feb 2022
Managed Google Ads and Meta campaigns for eight ecommerce clients.
Wrote ad copy and landing page copy, improving click-through rate by 24%.
Built reporting dashboards in Google Analytics and Looker Studio.

EDUCATION
BA Marketing — University of Manchester, 2019`,
  },
];

const dataResumes = [
  {
    id: "c-mei",
    jobId: "job-data",
    source: "Referral",
    addedAt: "2026-11-06T11:20:00.000Z",
    stage: "shortlist",
    starred: true,
    notes: "Strong production ML experience. Spoke clearly about model monitoring.",
    headline: "Senior Machine Learning Engineer",
    location: "Berlin, Germany",
    resumeText: `Mei Chen
Senior Machine Learning Engineer · Berlin, Germany
mei.chen@example.com · linkedin.com/in/meichen

SUMMARY
Machine learning engineer with 8 years of experience taking models from notebook to production. I care about honest evaluation, monitoring and the unglamorous work that keeps predictions useful.

SKILLS
Python, SQL, pandas, NumPy, scikit-learn, PyTorch, machine learning, deep learning, statistics, A/B testing, Airflow, Snowflake, Docker, AWS, LLMs

EXPERIENCE
Kestrel Health — Senior Machine Learning Engineer
Feb 2021 - Present
Built a patient readmission classifier in Python and scikit-learn that flagged 31% of high-risk cases at 0.82 recall.
Owned model training and monitoring pipelines in Airflow, retraining weekly on Snowflake.
Designed 20+ offline and online experiments, including A/B tests of risk thresholds.
Shipped an LLM-assisted triage summary using retrieval, cutting clinician reading time by 18%.

Lumen Analytics — Data Scientist
Jul 2018 - Jan 2021
Built churn and propensity models with PyTorch and scikit-learn for subscription clients.
Wrote production SQL and pandas pipelines over 30M rows.
Presented findings to non-technical stakeholders and documented methodology for audit.
Mentored two analysts.

EDUCATION
M.Sc. Machine Learning — Technical University of Munich, 2018
BSc Mathematics — National University of Singapore, 2016`,
  },
  {
    id: "c-tomas",
    jobId: "job-data",
    source: "Careers page",
    addedAt: "2026-11-08T09:10:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Data Analyst",
    location: "Prague, Czechia",
    resumeText: `Tomas Novak
Data Analyst · Prague, Czechia
tomas.novak@example.com · +420 601 234 567

SUMMARY
Data analyst with 3 years of experience in ecommerce analytics. Comfortable with SQL, Python and dashboards, and keen to move into applied machine learning.

SKILLS
SQL, Python, pandas, Tableau, statistics, Excel, dbt, A/B testing, data visualization

EXPERIENCE
Ridge Commerce — Data Analyst
Apr 2023 - Present
Built SQL models in dbt for a 12M row warehouse.
Created Tableau dashboards used weekly by the merchandising team.
Analysed 30 A/B tests on pricing and promotion, flagging two results that did not replicate.
Automated a weekly reporting pack in Python and pandas, saving six hours a week.

Brightline Retail — Junior Analyst
Sep 2021 - Mar 2023
Wrote SQL queries for stock and margin reporting.
Maintained Excel models used in buying decisions.

EDUCATION
MSc Data Analytics — Charles University, 2021
BSc Economics — Charles University, 2019`,
  },
];

const designResumes = [
  {
    id: "c-luca",
    jobId: "job-design",
    source: "Portfolio",
    addedAt: "2026-11-07T15:05:00.000Z",
    stage: "shortlist",
    starred: false,
    notes: "",
    headline: "Senior Product Designer",
    location: "Milan, Italy",
    resumeText: `Luca Moretti
Senior Product Designer · Milan, Italy
luca.moretti@example.com · lucamoretti.design

SUMMARY
Senior product designer with 9 years of experience shipping B2B SaaS products end to end. I run research, prototype fast in Figma and work closely with engineers on the details that survive implementation.

EXPERIENCE
Northstar Ops — Senior Product Designer
Mar 2020 - Present
Led end-to-end design for a field scheduling product used by 8,000 operators.
Ran 40+ user research interviews and 25 moderated usability testing sessions; findings reshaped the onboarding flow and lifted activation 22%.
Built and maintained a Figma design system with 70 components and tokens, documented for engineering.
Created interactive prototypes for stakeholder reviews and developer handoff.
Reviewed implemented UI with frontend engineers and owned accessibility checks.

Craftline — Product Designer
Sep 2016 - Feb 2020
Designed responsive web and mobile interfaces for logistics clients.
Produced wireframes, user flows and high-fidelity mockups in Figma.
Introduced a weekly design critique and a shared component library.

EDUCATION
BA Communication Design — Politecnico di Milano, 2016

TOOLS
Figma, FigJam, Maze, Notion, HTML and CSS basics`,
  },
  {
    id: "c-hannah",
    jobId: "job-design",
    source: "LinkedIn",
    addedAt: "2026-11-09T12:30:00.000Z",
    stage: "new",
    starred: false,
    notes: "",
    headline: "Product Designer",
    location: "Bristol, UK",
    resumeText: `Hannah Cole
Product Designer · Bristol, United Kingdom
hannah.cole@example.com · hannahcole.design

SUMMARY
Product designer with 5 years of experience in SaaS. I like messy discovery problems, clear prototypes and design systems that engineers actually use.

SKILLS
Figma, user research, usability testing, prototyping, design systems, wireframing, accessibility, HTML, CSS

EXPERIENCE
Tidepool Software — Product Designer
Jun 2022 - Present
Designed a reporting and permissions area used by 6,000 customers.
Ran user research interviews and usability testing for three major releases.
Maintained a Figma component library shared with two engineering squads.
Improved keyboard accessibility across the admin console with the frontend team.

Beacon Studio — UX Designer
Aug 2020 - May 2022
Created wireframes and clickable prototypes for client projects.
Built research scripts and synthesised findings into journey maps.
Worked with developers through implementation review.

EDUCATION
BA Graphic Design — University of the West of England, 2020`,
  },
];

export const SAMPLE_CANDIDATES = [...frontendResumes, ...dataResumes, ...designResumes];
