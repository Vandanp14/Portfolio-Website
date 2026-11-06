// Single source of truth for site content.
// Derived from ~/Desktop/ATS_Resume_Tailor_Agent/master.json — keep the two in sync when the resume changes.

import mfpDesktop from '../assets/projects/mfp-desktop.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import mfp2 from '../assets/projects/mfp-2.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import mfp3 from '../assets/projects/mfp-3.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import mfp4 from '../assets/projects/mfp-4.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import mfp5 from '../assets/projects/mfp-5.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger1 from '../assets/projects/ledger-1.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger2 from '../assets/projects/ledger-2.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger3 from '../assets/projects/ledger-3.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger4 from '../assets/projects/ledger-4.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger5 from '../assets/projects/ledger-5.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import diningMenu from '../assets/projects/dining-menu.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import diningPicks from '../assets/projects/dining-picks.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import diningLabel from '../assets/projects/dining-label.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import diningPhoneMenu from '../assets/projects/dining-phone-menu.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import diningPhoneItem from '../assets/projects/dining-phone-item.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import evenlyGroup from '../assets/projects/evenly-group.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import evenlyInsights from '../assets/projects/evenly-insights.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import evenlyOverview from '../assets/projects/evenly-overview.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import evenlyPhone from '../assets/projects/evenly-phone.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import mintHub from '../assets/projects/mint-hub.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import mintGame1 from '../assets/projects/mint-game-1.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import mintGame2 from '../assets/projects/mint-game-2.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import centroMap from '../assets/projects/centro-map.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import centroArrivals from '../assets/projects/centro-arrivals.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import centroHome from '../assets/projects/centro-home.jpg?w=640;1400&format=avif;webp;jpg&as=picture';
import centroPhone from '../assets/projects/centro-phone.jpg?w=480;758&format=avif;webp;jpg&as=picture';

// In-app viewer; the PDF itself is always the newest file in the résumé
// Drive folder (see api/resume.ts), so this never needs updating.
export const RESUME_URL = '/resume';

export const profile = {
  name: 'Vandan Patel',
  role: 'Software Engineer',
  disciplines: ['Distributed systems', 'Backend', 'Applied AI'],
  location: 'Oswego, New York',
  email: 'patelvandan024@gmail.com',
  github: 'https://github.com/Vandanp14',
  linkedin: 'https://www.linkedin.com/in/vpatel1410',
  site: 'https://vandanpatel.me',
  status: 'Software Engineering Intern at Fanatics · graduating Dec 2026',
  headline: 'I build the systems other people build on.',
  intro:
    'CS student at SUNY Oswego. This summer I shipped Product Builder’s first API at Fanatics and the first AI assistant on their internal developer platform to read non-GitHub data. Outside of work I build production tools for myself — a fitness analytics PWA, a personal finance ledger, a game platform — and ship them end to end.',
};

/** Headline numbers. Every one traces to a line in the resume. */
export const stats = [
  { value: '5', suffix: '', label: 'REST endpoints', note: 'Product Builder’s first-ever API' },
  { value: '82', suffix: 'K+', label: 'Records served', note: '37 ms worst-case on staging' },
  { value: '36.5', suffix: '%', label: 'Card data recovered', note: 'Dual-identifier SQL engine' },
  { value: '390', suffix: '+', label: 'Tests written', note: 'Across four shipped products' },
];

/** Full-bleed internship panel under the hero. Every figure traces to the resume. */
export const fanaticsHighlight = {
  eyebrow: 'Summer 2026 · New York',
  role: 'Software Engineering Intern at Fanatics',
  statement: ['Product Builder’s', 'first API'],
  progress: 'Progress: shipped',
  imageAlt:
    'Vandan Patel at the Fanatics office in New York, standing beside the Fanatics logo wall',
  metrics: [
    { value: '5', label: 'REST endpoints shipped', detail: 'Product Builder’s first API' },
    { value: '82K+', label: 'Records served', detail: '37 ms worst case' },
    { value: '36.5%', label: 'Card data recovered', detail: 'Dual-identifier SQL engine' },
    { value: '3', label: 'Features to production', detail: '8 weeks' },
  ],
};

export type ProjectShot = {
  /** Responsive AVIF/WebP/JPEG set from vite-imagetools. */
  src: ImagePicture;
  alt: string;
  /** 'phone' renders in a device frame; 'wide' renders as a flat screen. */
  kind: 'phone' | 'wide';
  caption: string;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  year: string;
  category: string;
  summary: string;
  build: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** Short caveat shown next to the links, e.g. why there is no live demo. */
  liveNote?: string;
  shots: ProjectShot[];
};

export const featuredProjects: Project[] = [
  {
    id: 'mfp-coach',
    index: '01',
    title: 'MFP Coach',
    tagline:
      'A fitness app that pulls Apple Watch, nutrition and workout data into one place and gives me a plan for the day.',
    year: '2026',
    category: 'Full-stack · Applied AI',
    summary:
      'Apple Watch, MyFitnessPal and Strong exports flow through iOS Shortcuts into a pipeline I host myself. The app scores readiness, adjusts calorie targets, forecasts weight and asks Gemini for a daily read. It can also log meals straight from Oswego Dining.',
    build: [
      'React + TypeScript front end on a FastAPI service: 44 routes across a 20-table relational schema covering nutrition, sleep, activity, body composition and workouts.',
      'Idempotent ingest that normalizes 24 metrics with SHA-256 deduplication and timestamp merging, so a re-run never double-counts a day.',
      'Deterministic analytics — readiness, adaptive TDEE, macro targets, weight forecast, estimated 1RM, progressive-overload detection — computed before any model sees the data.',
      'Gemini 2.5 Flash behind domain-scoped prompts with parallel generation and per-day caching, so coaching costs one call a day instead of one per view.',
    ],
    metrics: [
      { value: '44', label: 'API routes' },
      { value: '20', label: 'DB tables' },
      { value: '82', label: 'Passing tests' },
    ],
    stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Gemini API', 'Docker'],
    shots: [
      { src: mfpDesktop, kind: 'wide', alt: 'MFP Coach desktop dashboard showing the day’s protein target and metric tiles', caption: 'Today — one directive, then the numbers behind it' },
      { src: mfp2, kind: 'phone', alt: 'MFP Coach mobile home screen with a protein target card', caption: 'One action per day' },
      { src: mfp3, kind: 'phone', alt: 'MFP Coach weight trend chart over ninety days', caption: '90-day trend + forecast' },
      { src: mfp4, kind: 'phone', alt: 'MFP Coach weekly AI review summarizing weight, steps and missing nutrition data', caption: 'Weekly AI read, cached per day' },
      { src: mfp5, kind: 'phone', alt: 'MFP Coach quick log sheet with meal, water, weight and check-in options', caption: 'Quick log sheet' },
    ],
  },
  {
    id: 'oswego-dining',
    index: '02',
    title: 'Oswego Dining',
    tagline: 'Today’s SUNY Oswego dining hall menus, ranked by protein per calorie.',
    year: '2026',
    category: 'Full-stack · Data',
    summary:
      'A scheduled job scrapes SUNY Oswego’s NetNutrition site for all 3 dining halls and stores the results in Google Sheets. The app shows each menu by station with nutrition labels and allergens, ranks what’s being served, totals a meal and suggests plates using only items on today’s menu. It’s unofficial and not run by the college.',
    build: [
      'Scraping runs as a durable job queue with a lease lock and checkpoints, so it finishes inside Apps Script’s execution limits and picks up where it left off.',
      'A production quota outage led to a 2-day scrape window and a daily fetch budget. The decision is written up in an ADR.',
      'A Vercel function sits in front of Apps Script with a strict input allowlist and stale-while-revalidate caching.',
      'Gemini returns plates against a response schema. Each one is checked against real menu IDs, and nutrition totals are recomputed from stored data rather than taken from the model.',
      'Covered by 187 automated node:test tests when last counted for my résumé.',
    ],
    metrics: [],
    stack: ['JavaScript', 'Google Apps Script', 'Google Sheets', 'Gemini API', 'Vercel', 'GitHub Actions'],
    liveUrl: 'https://oswego-dining.vercel.app',
    shots: [
      { src: diningMenu, kind: 'wide', alt: 'Oswego Dining menu for a dining hall, grouped by station with calories and protein for each item', caption: 'Menu by station' },
      { src: diningPicks, kind: 'wide', alt: 'Oswego Dining list of today’s items ranked by grams of protein per calorie', caption: 'Items ranked by protein per calorie' },
      { src: diningLabel, kind: 'wide', alt: 'Oswego Dining item detail with a nutrition label, allergens and ingredients', caption: 'Nutrition label, allergens and ingredients' },
      { src: diningPhoneMenu, kind: 'phone', alt: 'Oswego Dining menu on a phone, grouped by station', caption: 'Menu on a phone' },
      { src: diningPhoneItem, kind: 'phone', alt: 'Oswego Dining item details on a phone with nutrition facts and allergens', caption: 'Item details on a phone' },
    ],
  },
  {
    id: 'evenly',
    index: '03',
    title: 'Evenly',
    tagline: 'A shared-expense app I built for a Thanksgiving trip to Utah with friends.',
    year: '2026',
    category: 'Full-stack · Fintech',
    summary:
      'Groups join through revocable invite links, then split costs equally, by exact amount, by percentage or by weight, per expense or per item. Next.js runs the interface, and Google Apps Script with a private Google Sheet acts as the database.',
    build: [
      'Money is stored as integer cents and split by largest remainder with stable tie-breaks, so a group’s shares always add up to the total.',
      'Next.js talks to Apps Script over an HMAC-signed bridge. Apps Script owns authorization, the math and all writes.',
      'Every change goes to an append-only audit log with before and after values. Deletes are soft.',
      'If a save’s response is lost, the app keeps the request and retries it with the same ID, so an entry can’t be duplicated.',
    ],
    metrics: [],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Google Apps Script', 'Google Sheets', 'Vitest', 'Playwright'],
    liveUrl: 'https://evenly-sage.vercel.app',
    liveNote: 'Sign-in is limited to people I approve. The screenshots use sample data.',
    shots: [
      { src: evenlyGroup, kind: 'wide', alt: 'Evenly group page for a Utah trip showing the balance owed to you and a Who owes whom list', caption: 'A group’s balance and who owes whom' },
      { src: evenlyInsights, kind: 'wide', alt: 'Evenly insights tab with a donut chart of group spending by category', caption: 'Spending by category' },
      { src: evenlyOverview, kind: 'wide', alt: 'Evenly overview page listing every group with the amount owed in each', caption: 'All groups at a glance' },
      { src: evenlyPhone, kind: 'phone', alt: 'Evenly add-expense form on a phone with split-equally options', caption: 'Adding an expense on a phone' },
    ],
  },
  {
    id: 'transit-ledger',
    index: '04',
    title: 'Transit Ledger',
    tagline: 'A personal finance app for tracking rent, commute and spending during a summer in New York.',
    year: '2026',
    category: 'Full-stack · Fintech',
    summary:
      'I tracked a summer in New York against a fixed budget. Eleven data models cover transactions, budgets, recurring bills, group splits and reports, and I can log expenses by speaking them.',
    build: [
      'Transaction-safe ledger with atomic balance reconciliation, soft deletion, rule-based categorization, monthly budget overrides and deterministic safe-to-spend math.',
      'Exact group-expense engine supporting equal, custom and percentage splits using cent-level remainder allocation, so settlements never drift by a penny.',
      'Gemini structured output turns spoken sentences into batches of up to 20 verified expenses, gated by schema validation, a category allowlist and atomic writes.',
      'HMAC-signed HTTP-only sessions, timing-safe password checks and login rate limiting, covered by 102 automated tests.',
    ],
    metrics: [
      { value: '11', label: 'Data models' },
      { value: '20', label: 'Expenses per dictation' },
      { value: '102', label: 'Passing tests' },
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL', 'Gemini API'],
    shots: [
      { src: ledger1, kind: 'phone', alt: 'Transit Ledger home screen showing net position and summer runway', caption: 'Net position against the runway' },
      { src: ledger2, kind: 'phone', alt: 'Transit Ledger quick log screen with one-tap fare buttons', caption: 'One-tap fares for the daily commute' },
      { src: ledger4, kind: 'phone', alt: 'Transit Ledger dictation sheet parsing a spoken expense', caption: 'Dictate it, Gemini parses it' },
      { src: ledger3, kind: 'phone', alt: 'Transit Ledger transaction list with categorized entries', caption: 'Categorized ledger' },
      { src: ledger5, kind: 'phone', alt: 'Transit Ledger transaction list annotated with AI-derived labels', caption: 'AI labels shown as provenance, not truth' },
    ],
  },
  {
    id: 'ats-resume-tailor',
    index: '05',
    title: 'ATS Résumé Tailor',
    tagline: 'Tailors my résumé to a job description without letting the model make anything up.',
    year: '2026',
    category: 'Backend · Applied AI',
    summary:
      'It takes my master résumé as JSON and a job description, then produces a one-page LaTeX PDF. Gemini plans and writes under Pydantic schemas. Plain code does the keyword matching, checks that every bullet cites a real fact from the master résumé, and fits the page. It’s a personal tool behind a password.',
    build: [
      'Code, not the model, maps each job requirement as direct, proxy or missing, then ranks roles and projects.',
      'Validators reject unknown or duplicate fact sources, changed employers, dates or titles, and any technology the cited facts don’t mention.',
      'Tectonic renders the LaTeX, and a PyPDF loop fits the result to one page.',
      'A persistent single-worker queue, per-stage checkpoints and Server-Sent Events let failed runs resume with visible progress. It has 383 pytest tests.',
    ],
    metrics: [],
    stack: ['Python', 'FastAPI', 'Pydantic', 'Gemini API', 'Jinja2', 'LaTeX'],
    shots: [],
  },
  {
    id: 'mint-game-hub',
    index: '06',
    title: 'MINT Game Hub',
    tagline:
      'Five daily browser games about trading cards, built for an intern team and adopted for its hobby immersion program.',
    year: '2026',
    category: 'Product · Front end',
    summary:
      '2048, Hangman, Crossword, Memory Matching and Higher/Lower, each with a daily challenge. The team had no developer, so I built it on my own.',
    build: [
      'Reusable game algorithms: 2048 tile merging, greedy 8–12 word crossword generation, Fisher–Yates shuffling, immutable Hangman scoring and a no-repeat 12-question tour, verified by 122 unit tests.',
      'Seeded pseudorandom daily challenges with resumable 2048 RNG state and a 96-term vocabulary rotation serving 3 unique terms a day for 32 days without repeating.',
      'Progressively enhanced 3D with Three.js and React Three Fiber — lazy-loaded WebGL islands, adaptive resolution, SVG fallbacks, context-loss recovery and reduced-motion support.',
    ],
    metrics: [
      { value: '5', label: 'Playable games' },
      { value: '122', label: 'Unit tests' },
      { value: '32', label: 'Days, no repeats' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'R3F', 'GSAP'],
    liveUrl: 'https://gamehub-eight-topaz.vercel.app/',
    shots: [
      { src: mintHub, kind: 'wide', alt: 'MINT game hub home page with the headline Play your way into the hobby and the featured 2048: Card Edition game', caption: 'The game hub' },
      { src: mintGame1, kind: 'wide', alt: '2048: Card Edition page with score counters and a ladder of card rarities', caption: '2048: Card Edition' },
      { src: mintGame2, kind: 'wide', alt: 'MINT crossword with trading-card hobby clues listed across and down', caption: 'Crossword' },
    ],
  },
  {
    id: 'centro',
    index: '07',
    title: 'Centro Oswego Live',
    tagline: 'Live bus arrivals and a map for Centro’s Oswego routes.',
    year: '2025–2026',
    category: 'Full-stack · Transit',
    summary:
      'I rebuilt this from scratch after an incomplete team prototype from a course. A Flask service proxies Clever Devices BusTime and a React front end shows arrivals, a live Leaflet map, active buses and schedules. It runs on a university server.',
    build: [
      '7 Flask REST blueprints under /api/v1.',
      'An in-memory TTL cache, from 12 seconds for predictions up to 1 hour for stop lists.',
      '103 automated tests: 71 pytest and 32 Jest with React Testing Library.',
    ],
    metrics: [],
    stack: ['Python', 'Flask', 'React 18', 'Leaflet', 'pytest', 'Jest'],
    liveUrl: 'http://pi.cs.oswego.edu:5001/',
    shots: [
      { src: centroMap, kind: 'wide', alt: 'Centro Oswego Live map showing a bus route and the position of a bus', caption: 'Live map with route and bus position' },
      { src: centroArrivals, kind: 'wide', alt: 'Centro Oswego Live list of upcoming bus arrivals for a stop', caption: 'Arrivals for a stop' },
      { src: centroHome, kind: 'wide', alt: 'Centro Oswego Live home screen for choosing a route', caption: 'Choosing a route' },
      { src: centroPhone, kind: 'phone', alt: 'Centro Oswego Live arrivals for a route on a phone', caption: 'Arrivals on a phone' },
    ],
  },
  {
    id: 'higheredjobs-review',
    index: '08',
    title: 'HigherEdJobs Review',
    tagline: 'Finds higher-ed IT jobs and flags what each posting says about visa sponsorship.',
    year: '2026',
    category: 'Backend · Automation',
    summary:
      'A Playwright scraper reads 2 job boards into SQLite. A classifier sorts each posting’s sponsorship wording into 5 categories and shows the exact sentence behind the label. A React dashboard ranks jobs against my résumé and tracks my applications.',
    build: [
      'Parsing tries JSON-LD first, then semantic selectors. It fails loudly, so a bot check is never read as “no sponsorship”.',
      'Upserts are idempotent: re-scraping never resets my status or notes, or downgrades a description.',
      'The classifier is versioned, and saved jobs get relabelled when it changes.',
      'Scraping is sequential and polite. When a human check appears, it pauses and waits for me rather than trying to bypass it.',
    ],
    metrics: [],
    stack: ['Python', 'Playwright', 'FastAPI', 'SQLite', 'React', 'TypeScript'],
    repoUrl: 'https://github.com/Vandanp14/HigherEdJobs_Scraper',
    liveNote: 'Runs locally, so there’s no live demo.',
    shots: [],
  },
];

export type SmallProject = {
  id: string;
  title: string;
  blurb: string;
  year: string;
  stack: string[];
  url?: string;
};

export const otherProjects: SmallProject[] = [
  {
    id: 'ra-tools',
    title: 'RA Tools',
    blurb: 'Resident email and check-in logging for RAs, with a hand-built MIME layer over the Gmail API.',
    year: '2026',
    stack: ['Google Apps Script', 'Gmail API', 'Playwright'],
  },
  {
    id: 'ta-grading',
    title: 'TA Grading Automation',
    blurb: 'Grades student submissions with regex parsing, builds an HTML report for each and emails them out.',
    year: '2025',
    stack: ['Python', 'Regex', 'Bash'],
    url: 'https://github.com/Vandanp14/05-python-project-Vandanp14',
  },
  {
    id: 'http-server',
    title: 'Multi-Threaded HTTP Server',
    blurb: 'An HTTP server written from scratch in C++17 on POSIX sockets, with a four-thread worker pool.',
    year: '2025',
    stack: ['C++17', 'POSIX', 'Concurrency'],
  },
  {
    id: 'job-scraper',
    title: 'Job-Listing Aggregator',
    blurb: 'Collects job listings with headless Selenium and BeautifulSoup.',
    year: '2024',
    stack: ['Python', 'Selenium', 'SQL'],
    url: 'https://github.com/Vandanp14/Freeport-Job-Scraper',
  },
  {
    id: 'rsvp-tracker',
    title: 'Event RSVP Tracker',
    blurb: 'A React front end over Google Apps Script and the Sheets API for tracking event RSVPs.',
    year: '2025',
    stack: ['React', 'Apps Script', 'Sheets API'],
  },
  {
    id: 'lakerhacks-agent',
    title: 'Generative AI Collaboration Agent',
    blurb:
      'Built in 24 hours at LakerHacks, where we placed in the top 10 of 30 teams. Gemini turns a team’s notes into project milestones.',
    year: '2024',
    stack: ['Python', 'React', 'Gemini API'],
  },
  {
    id: 'inference-engine',
    title: 'Propositional Logic Inference Engine',
    blurb: 'A forward-chaining logic reasoner in Clojure.',
    year: '2025',
    stack: ['Clojure', 'Functional'],
  },
  {
    id: 'pattern-matcher',
    title: 'Pattern Matcher Compiler',
    blurb: 'A recursive-descent parser in Scala that compiles regex syntax into an AST.',
    year: '2025',
    stack: ['Scala', 'Parsing', 'ASTs'],
  },
  {
    id: 'turing-machine',
    title: 'Turing Machine Simulator',
    blurb: 'A Turing machine emulator in C, with a linked list for the tape and a live view of the head.',
    year: '2025',
    stack: ['C', 'Memory management'],
  },
  {
    id: 'light-up',
    title: 'Light-Up Puzzle Solver',
    blurb: 'A Light Up puzzle solver written in Answer Set Programming with Clingo.',
    year: '2025',
    stack: ['ASP', 'Clingo'],
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: 'Fanatics',
    title: 'Software Engineering Intern',
    period: 'Jun 2026 — Present',
    location: 'New York, NY',
    current: true,
    summary:
      'Product Builder is the distributed product-configuration application behind global trading-card manufacturing. I built its first API and the first AI assistant on the internal developer platform to read non-GitHub data.',
    highlights: [
      'Architected an end-to-end AI Copilot connecting Slack through an internal message router to an Elixir runtime on AWS Bedrock AgentCore and a Phoenix backend, letting anyone query trading-card specs in plain English.',
      'Built Product Builder’s first-ever API — 5 read-only REST endpoints with dynamic OpenAPI 3.0 generation, enabling automated MCP tool discovery and establishing the agentic-AI proof of concept for internal systems.',
      'Guaranteed zero mutation risk with a compile-time read-only repository: any write against it fails at compilation, not at runtime.',
      'Recovered 36.5% of historically under-reported card data with a server-side SQL dual-identifier engine unifying legacy ULIDs, modern UUIDs and roster entities — no added client complexity.',
      'Hand-rolled an AWS Signature V4 engine in pure Elixir, signing IAM calls to Bedrock and CloudWatch over IMDSv2 without pulling in a heavy SDK.',
      'Enforced a fail-closed security pipeline: feature flags, constant-time request verification, default-deny visibility and whitelisted JSON serialization.',
      'Validated on staging at 82,000+ records with a 37 ms worst-case query, untuned; 86 tool tests green across two full ~2,900-test regression sweeps.',
      'Shipped 3 features to production in 8 weeks — first PR merged inside 2 weeks, ~4,000 lines across two stacked PRs.',
      'Authored a 13-step enterprise MCP transition roadmap and a 4-chapter handoff package for migrating direct HTTP tool calls to Bedrock Gateway MCP targets.',
    ],
    stack: ['Elixir', 'Phoenix LiveView', 'PostgreSQL', 'RabbitMQ', 'AWS Bedrock', 'MCP'],
  },
  {
    company: 'SUNY Oswego Facilities Services',
    title: 'Software Developer Intern',
    period: 'Apr 2024 — Apr 2026',
    location: 'Oswego, NY',
    summary:
      'Operational software and dashboards for the staff who keep a university campus running.',
    highlights: [
      'Built and maintained React and Tailwind dashboards visualizing real-time operational KPIs for facilities staff and management.',
      'Replaced a manual reporting process with an interactive dashboard, cutting report-generation time.',
      'Integrated REST APIs for real-time data synchronization and designed reusable, accessibility-focused React components.',
      'Gathered requirements directly from field staff and translated them into shipped features.',
      'Produced IEEE-compliant requirements documentation and maintained Drupal 10 pages for a mission-critical system.',
    ],
    stack: ['React', 'Tailwind CSS', 'REST APIs', 'Drupal 10', 'Jira'],
  },
  {
    company: 'SUNY Oswego Institutional Research',
    title: 'Data Analyst Intern',
    period: 'Aug 2025 — Dec 2025',
    location: 'Oswego, NY',
    summary:
      'Reporting and analysis on student retention, GPA, course performance and student-success outcomes.',
    highlights: [
      'Built Tableau dashboards that helped leadership spot student-performance trends and the places needing intervention.',
      'Developed Python and SQL pipelines automating extraction, consolidation, cleaning and validation.',
      'Designed SQL ETL workflows and optimized queries, cutting manual data-processing and reporting time 40%.',
      'Used SPSS to identify predictors of first-year retention, and standardized data definitions across disparate systems to establish a single ground truth.',
    ],
    stack: ['Python', 'SQL', 'Tableau', 'SPSS', 'ETL'],
  },
  {
    company: 'SUNY Oswego Major Projects Office',
    title: 'Project Analyst',
    period: 'Nov 2023 — Apr 2024',
    location: 'Oswego, NY',
    summary: 'Planning, reporting and quality assurance across five concurrent project teams.',
    highlights: [
      'Implemented Jira-based Gantt tracking for 40+ deliverables across five teams.',
      'Improved QA workflows and reduced data errors 30%; streamlined reporting and accelerated decision cycles 20%.',
    ],
    stack: ['Jira', 'Excel', 'QA'],
  },
  {
    company: 'SUNY Oswego Help Desk',
    title: 'Help Desk Attendant',
    period: 'Feb 2023 — May 2023',
    location: 'Oswego, NY',
    summary: 'Tier-1 and Tier-2 support for university hardware, software, accounts and network.',
    highlights: [
      'Resolved 100+ support issues and wrote internal troubleshooting guides that cut repetitive inquiries.',
      'Worked with system administrators to surface recurring failures and improve escalation protocols.',
    ],
    stack: ['Support', 'Networking', 'Documentation'],
  },
];

export const education = {
  institution: 'State University of New York at Oswego',
  degree: 'B.S. Computer Science',
  location: 'Oswego, NY',
  graduation: 'Expected December 2026',
  courses: [
    'Data Structures and Algorithms',
    'Operating Systems',
    'Systems Programming',
    'Software Engineering',
    'Networking',
    'Database Systems',
    'Artificial Intelligence',
    'Programming Languages',
    'OOP — Java and C++',
    'Functional Programming — Clojure and Scala',
  ],
};

export type SkillGroup = { title: string; note: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    note: 'Shipped production code in the first six.',
    skills: ['Python', 'TypeScript', 'Elixir', 'Java', 'C++', 'C', 'SQL', 'Go', 'Scala', 'Clojure', 'Bash'],
  },
  {
    title: 'Backend & distributed systems',
    note: 'Where most of my work lives.',
    skills: ['REST APIs', 'Phoenix LiveView', 'FastAPI', 'Flask', 'RabbitMQ', 'PostgreSQL', 'MySQL', 'Prisma', 'Docker', 'AWS', 'CI/CD'],
  },
  {
    title: 'Front end',
    note: 'Interfaces that survive real data.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Three.js', 'Accessibility', 'PWA'],
  },
  {
    title: 'AI & data',
    note: 'Deterministic first, model second.',
    skills: ['MCP', 'AWS Bedrock', 'Gemini API', 'OpenAI API', 'Prompt design', 'Tableau', 'SPSS', 'ETL', 'Scikit-learn'],
  },
  {
    title: 'Systems & tooling',
    note: 'The low-level half of the degree.',
    skills: ['POSIX APIs', 'TCP sockets', 'Multithreading', 'Mutexes', 'RAII', 'Git', 'Linux', 'Pytest', 'Vitest'],
  },
];

export const recognition = [
  {
    title: 'Residence Life Staff Member of the Year',
    org: 'SUNY Oswego Residence Life',
    year: '2024',
    note: 'Recognized for excellence in student support across a 32-resident community.',
  },
  {
    title: 'LakerHacks Finalist',
    org: 'LakerHacks',
    year: '2024',
    note: 'Top 10 of 30 teams with a Gemini-powered project-planning agent, built in 24 hours.',
  },
];

export const leadership = [
  {
    role: 'Resident Assistant',
    org: 'SUNY Oswego Residence Life',
    period: 'Jan 2024 — Present',
    note: 'Mentor 32 residents; ran six community events averaging 70%+ attendance, plus conflict mediation and crisis response.',
  },
  {
    role: 'Member',
    org: 'National Society of Black Engineers',
    period: 'Ongoing',
    note: 'Recruiter panels, professional workshops and technical discussions on backend architecture and applied AI.',
  },
];

export const navSections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = 'top' | (typeof navSections)[number]['id'];
