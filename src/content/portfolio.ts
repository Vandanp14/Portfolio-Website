// Single source of truth for site content.
// Derived from master_resume.json — keep the two in sync when the resume changes.

import mfpDesktop from '../assets/projects/mfp-desktop.jpg';
import mfp2 from '../assets/projects/mfp-2.jpg';
import mfp3 from '../assets/projects/mfp-3.jpg';
import mfp4 from '../assets/projects/mfp-4.jpg';
import mfp5 from '../assets/projects/mfp-5.jpg';
import ledger1 from '../assets/projects/ledger-1.jpg';
import ledger2 from '../assets/projects/ledger-2.jpg';
import ledger3 from '../assets/projects/ledger-3.jpg';
import ledger4 from '../assets/projects/ledger-4.jpg';
import ledger5 from '../assets/projects/ledger-5.jpg';

export const RESUME_URL =
  'https://drive.google.com/file/d/1XZIbed6pfAnyLFdAvmiSdF7pIH8kbQ9J/view?usp=sharing';

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
    'CS student at SUNY Oswego. This summer I shipped Product Builder’s first public API at Fanatics and the first AI assistant on their internal developer platform to read non-GitHub data. Outside of work I build production tools for myself — a fitness analytics PWA, a personal finance ledger, a game platform — and ship them end to end.',
};

/** Headline numbers. Every one traces to a line in the resume. */
export const stats = [
  { value: '5', suffix: '', label: 'REST endpoints', note: 'Product Builder’s first-ever API' },
  { value: '82', suffix: 'K+', label: 'Records served', note: '37 ms worst-case on staging' },
  { value: '36.5', suffix: '%', label: 'Card data recovered', note: 'Dual-identifier SQL engine' },
  { value: '390', suffix: '+', label: 'Tests written', note: 'Across four shipped products' },
];

export type ProjectShot = {
  src: string;
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
  shots: ProjectShot[];
};

export const featuredProjects: Project[] = [
  {
    id: 'mfp-coach',
    index: '01',
    title: 'MFP Coach',
    tagline: 'A fitness analytics PWA that replaced a $100/year subscription stack.',
    year: '2026',
    category: 'Full-stack · Applied AI',
    summary:
      'Apple Watch, MyFitnessPal and Strong exports flow through iOS Shortcuts into a self-hosted pipeline. The app scores readiness, adapts TDEE, forecasts weight, and asks Gemini for a daily read — all on data I own.',
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
    liveUrl: 'https://mfp-coach-app-production.up.railway.app/',
    shots: [
      { src: mfpDesktop, kind: 'wide', alt: 'MFP Coach desktop dashboard showing the day’s protein target and metric tiles', caption: 'Today — one directive, then the numbers behind it' },
      { src: mfp2, kind: 'phone', alt: 'MFP Coach mobile home screen with a protein target card', caption: 'One action per day' },
      { src: mfp3, kind: 'phone', alt: 'MFP Coach weight trend chart over ninety days', caption: '90-day trend + forecast' },
      { src: mfp4, kind: 'phone', alt: 'MFP Coach weekly AI review summarizing weight, steps and missing nutrition data', caption: 'Weekly AI read, cached per day' },
      { src: mfp5, kind: 'phone', alt: 'MFP Coach quick log sheet with meal, water, weight and check-in options', caption: 'Quick log sheet' },
    ],
  },
  {
    id: 'transit-ledger',
    index: '02',
    title: 'Transit Ledger',
    tagline: 'A cent-exact personal finance platform, built for one NYC internship summer.',
    year: '2026',
    category: 'Full-stack · Fintech',
    summary:
      'Rent, commute and daily spend for a summer in New York, tracked against a fixed runway. An 11-model schema handles transactions, budgets, recurring bills, group splits and reporting — with dictation as the fast path in.',
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
      { src: ledger3, kind: 'phone', alt: 'Transit Ledger transaction list with categorized entries', caption: 'Categorized ledger, 276 entries' },
      { src: ledger5, kind: 'phone', alt: 'Transit Ledger transaction list annotated with AI-derived labels', caption: 'AI labels shown as provenance, not truth' },
    ],
  },
  {
    id: 'mint-game-hub',
    index: '03',
    title: 'MINT Game Hub',
    tagline: 'Five playable games for an intern team with no engineering support. Demoed to execs.',
    year: '2026',
    category: 'Product · Front end',
    summary:
      'An educational trading-card gaming platform built solo for a team that had no developer. 2048, Hangman, Crossword, Memory Matching and Higher/Lower, each with a deterministic daily challenge — adopted for the hobby immersion program.',
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
    id: 'transit-tracker',
    title: 'Centro Transit Tracker',
    blurb:
      'Live campus transit for SUNY Oswego. Flask APIs with MySQL caching, a modular React front end, and a four-person Agile team I led and code-reviewed. Deployed to a university Raspberry Pi.',
    year: '2025',
    stack: ['React', 'Flask', 'MySQL', 'CI/CD'],
    url: 'http://pi.cs.oswego.edu:5001/',
  },
  {
    id: 'ta-grading',
    title: 'TA Grading Automation',
    blurb:
      'Cut a 3-hour grading pass for 60+ students down to 15 minutes. Object-oriented Python with regex submission parsing, HTML report generation and automated mail-out via Bash and Mutt.',
    year: '2025',
    stack: ['Python', 'Regex', 'Bash'],
    url: 'https://github.com/Vandanp14/05-python-project-Vandanp14',
  },
  {
    id: 'http-server',
    title: 'Multi-Threaded HTTP Server',
    blurb:
      'Written from scratch in C++17 on POSIX sockets. A four-thread worker pool with a thread-safe queue, mutexes and condition variables decouples accept from request handling; RAII keeps the socket lifecycle clean.',
    year: '2025',
    stack: ['C++17', 'POSIX', 'Concurrency'],
  },
  {
    id: 'job-scraper',
    title: 'Job-Listing Aggregator',
    blurb:
      '250+ structured listings a day via headless Selenium and BeautifulSoup. Parallelizing the collection pipeline cut runtime 60%; output lands in a SQL schema ready for Tableau.',
    year: '2024',
    stack: ['Python', 'Selenium', 'SQL'],
    url: 'https://github.com/Vandanp14/Freeport-Job-Scraper',
  },
  {
    id: 'rsvp-tracker',
    title: 'Event RSVP Tracker',
    blurb:
      'A React front end over Google Apps Script and the Sheets API, handling 500+ RSVPs with client-side validation and backend caching. Manual corrections dropped 40%.',
    year: '2025',
    stack: ['React', 'Apps Script', 'Sheets API'],
  },
  {
    id: 'lakerhacks-agent',
    title: 'Generative AI Collaboration Agent',
    blurb:
      'Built in 24 hours at LakerHacks. Gemini reads a team’s raw notes and returns structured project milestones through a copilot interface aimed at non-technical users. Top 10 of 30 teams.',
    year: '2024',
    stack: ['Python', 'React', 'Gemini API'],
  },
  {
    id: 'inference-engine',
    title: 'Propositional Logic Inference Engine',
    blurb:
      'Forward-chaining reasoner in Clojure. Recursive rule evaluation and fact propagation over immutable structures, with optimized lookup and 100+ unit tests covering the edge cases.',
    year: '2025',
    stack: ['Clojure', 'Functional'],
  },
  {
    id: 'pattern-matcher',
    title: 'Pattern Matcher Compiler',
    blurb:
      'A recursive-descent parser in Scala that compiles regex syntax into an AST — grouping, repetition and optionality included. Tuning the backtracking improved runtime stability 25%.',
    year: '2025',
    stack: ['Scala', 'Parsing', 'ASTs'],
  },
  {
    id: 'turing-machine',
    title: 'Turing Machine Simulator',
    blurb:
      'A C emulator with a hand-rolled doubly linked list standing in for an infinite tape, plus a live visualizer of the head and state transitions. Refactoring cut runtime and memory 20%.',
    year: '2025',
    stack: ['C', 'Memory management'],
  },
  {
    id: 'light-up',
    title: 'Light-Up Puzzle Solver',
    blurb:
      'Declarative solver in Clingo. The puzzle’s spatial rules and constraint dependencies are modeled directly in Answer Set Programming; heuristics cut computation time 30%.',
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
      'Product Builder is the distributed product-configuration application behind global trading-card manufacturing. I built its first public API and the first AI assistant on the internal developer platform to read non-GitHub data.',
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
