// Single source of truth for site content.
// Derived from ~/Desktop/ATS_Resume_Tailor_Agent/master.json. Keep the two in sync when the resume changes.

import ledger2 from '../assets/projects/ledger-2.jpg?w=480;758&format=avif;webp;jpg&as=picture';
import ledger4 from '../assets/projects/ledger-4.jpg?w=480;758&format=avif;webp;jpg&as=picture';
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
  location: 'Oswego, New York',
  email: 'patelvandan024@gmail.com',
  github: 'https://github.com/Vandanp14',
  linkedin: 'https://www.linkedin.com/in/vpatel1410',
  site: 'https://vandanpatel.me',
};

export type ProjectShot = {
  /** Responsive AVIF/WebP/JPEG set from vite-imagetools. */
  src: ImagePicture;
  alt: string;
  /** 'phone' is a narrow portrait screenshot; 'wide' is a landscape one. */
  kind: 'phone' | 'wide';
  caption: string;
};

export type Project = {
  id: string;
  title: string;
  tagline: string;
  year: string;
  summary: string;
  build: string[];
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
    title: 'MFP Coach',
    tagline:
      'A fitness app that pulls Apple Watch, nutrition and workout data into one place and gives me a plan for the day.',
    year: '2026',
    summary:
      'Apple Watch, MyFitnessPal and Strong exports flow through iOS Shortcuts into a pipeline I host myself. The app scores readiness, adjusts calorie targets, forecasts weight and asks Gemini for a daily read. It can also log meals straight from Oswego Dining.',
    build: [
      'The front end is React and TypeScript on a FastAPI service with 44 routes. The schema has 20 tables covering nutrition, sleep, activity, body composition and workouts.',
      'Ingest is idempotent. It normalizes 24 metrics, dedupes with SHA-256 and merges timestamps, so re-running an import never double-counts a day.',
      'Readiness, adaptive TDEE, macro targets, the weight forecast, estimated 1RM and progressive-overload detection are all plain code. They run before any model sees the data.',
      'Gemini 2.5 Flash gets domain-scoped prompts, generated in parallel and cached per day, so they run once a day instead of on every view.',
    ],
    stack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Gemini API', 'Docker'],
    shots: [],
  },
  {
    id: 'oswego-dining',
    title: 'Oswego Dining',
    tagline: 'Today’s SUNY Oswego dining hall menus, ranked by protein per calorie.',
    year: '2026',
    summary:
      'A scheduled job scrapes SUNY Oswego’s NetNutrition site for all 3 dining halls and stores the results in Google Sheets. The app shows each menu by station with nutrition labels and allergens, ranks what’s being served, totals a meal and suggests plates using only items on today’s menu. It’s unofficial and not run by the college.',
    build: [
      'Scraping runs as a durable job queue with a lease lock and checkpoints, so it finishes inside Apps Script’s execution limits and picks up where it left off.',
      'A production quota outage led to a 2-day scrape window and a daily fetch budget. The decision is written up in an ADR.',
      'A Vercel function sits in front of Apps Script with a strict input allowlist and stale-while-revalidate caching.',
      'Gemini returns plates against a response schema. Each one is checked against real menu IDs, and nutrition totals are recomputed from stored data rather than taken from the model.',
      'It had 187 node:test tests when I last counted.',
    ],
    stack: ['JavaScript', 'Google Apps Script', 'Google Sheets', 'Gemini API', 'Vercel', 'GitHub Actions'],
    liveUrl: 'https://oswego-dining.vercel.app',
    shots: [
      { src: diningMenu, kind: 'wide', alt: 'Oswego Dining menu for a dining hall, grouped by station with calories and protein for each item', caption: 'Menu by station' },
      { src: diningPicks, kind: 'wide', alt: 'Oswego Dining list of today’s items ranked by protein per calorie, with grams of protein per 100 calories shown on each', caption: 'Items ranked by protein per calorie' },
      { src: diningLabel, kind: 'wide', alt: 'Oswego Dining item detail with a nutrition label, allergens and ingredients', caption: 'Nutrition label, allergens and ingredients' },
      { src: diningPhoneMenu, kind: 'phone', alt: 'Oswego Dining menu on a phone, grouped by station', caption: 'Menu on a phone' },
      { src: diningPhoneItem, kind: 'phone', alt: 'Oswego Dining item details on a phone with nutrition facts and allergens', caption: 'Item details on a phone' },
    ],
  },
  {
    id: 'evenly',
    title: 'Evenly',
    tagline: 'A shared-expense app I built for a Thanksgiving trip to Utah with friends.',
    year: '2026',
    summary:
      'Groups join through revocable invite links, then split costs equally, by exact amount, by percentage or by weight, per expense or per item. Next.js runs the interface, and Google Apps Script with a private Google Sheet acts as the database.',
    build: [
      'Money is stored as integer cents and split by largest remainder with stable tie-breaks, so a group’s shares always add up to the total.',
      'Next.js talks to Apps Script over an HMAC-signed bridge. Apps Script owns authorization, the math and all writes.',
      'Every change goes to an append-only audit log with before and after values. Deletes are soft.',
      'If a save’s response is lost, the app keeps the request and retries it with the same ID, so an entry can’t be duplicated.',
    ],
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
    title: 'Transit Ledger',
    tagline: 'A personal finance app for tracking rent, commute and spending during a summer in New York.',
    year: '2026',
    summary:
      'I tracked a summer in New York against a fixed budget. Eleven data models cover transactions, budgets, recurring bills, group splits and reports, and I can log expenses by speaking them.',
    build: [
      'The ledger uses transactions, so balance reconciliation is atomic. It also has soft deletes, rule-based categories, monthly budget overrides and a safe-to-spend number computed by plain code.',
      'Group expenses split equally, by custom amounts or by percentage. Remainders are handed out a cent at a time, so group settlements add up exactly.',
      'Gemini’s structured output turns a spoken sentence into up to 20 expenses. Each batch has to pass schema validation and a category allowlist, then saves in one atomic write.',
      'Sessions are HMAC-signed HTTP-only cookies. Password checks are timing-safe and logins are rate limited. 102 automated tests cover it.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL', 'Gemini API'],
    shots: [
      { src: ledger2, kind: 'phone', alt: 'Transit Ledger quick log screen with one-tap fare buttons', caption: 'One-tap fares for the commute' },
      { src: ledger4, kind: 'phone', alt: 'Transit Ledger dictation sheet turning a spoken expense into an entry', caption: 'Dictating an expense' },
    ],
  },
  {
    id: 'ats-resume-tailor',
    title: 'ATS Résumé Tailor',
    tagline: 'Tailors my résumé to a job description without letting the model make anything up.',
    year: '2026',
    summary:
      'It takes my master résumé as JSON and a job description, then produces a one-page LaTeX PDF. Gemini plans and writes under Pydantic schemas. Plain code does the keyword matching, checks that every bullet cites a real fact from the master résumé, and fits the page. It’s a personal tool behind a password.',
    build: [
      'Plain code maps each job requirement as direct, proxy or missing, then ranks roles and projects.',
      'Validators reject unknown or duplicate fact sources, changed employers, dates or titles, and any technology the cited facts don’t mention.',
      'Tectonic renders the LaTeX, and a PyPDF loop fits the result to one page.',
      'A persistent single-worker queue, per-stage checkpoints and Server-Sent Events let failed runs resume with visible progress. It has 383 pytest tests.',
    ],
    stack: ['Python', 'FastAPI', 'Pydantic', 'Gemini API', 'Jinja2', 'LaTeX'],
    shots: [],
  },
  {
    id: 'mint-game-hub',
    title: 'MINT Game Hub',
    tagline:
      'Five daily browser games about trading cards, built for an intern team and adopted for the hobby immersion program.',
    year: '2026',
    summary:
      '2048, Hangman, Crossword, Memory Matching and Higher/Lower, each with a daily challenge. The team had no developer, so I built it on my own.',
    build: [
      'The games share reusable algorithms: 2048 tile merging, a greedy crossword generator that places 8 to 12 words, Fisher-Yates shuffling, immutable Hangman scoring and a 12-question tour with no repeats. 122 unit tests check them.',
      'Daily challenges come from a seeded pseudorandom generator, and the 2048 RNG state can resume mid-game. A 96-term vocabulary rotation serves 3 terms a day for 32 days without repeating.',
      'The 3D is added on top of a working page with Three.js and React Three Fiber. WebGL loads lazily, resolution adapts, SVGs stand in when WebGL is missing, it recovers from context loss and it respects reduced motion.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'R3F', 'GSAP'],
    liveUrl: 'https://gamehub-eight-topaz.vercel.app/',
    shots: [
      { src: mintHub, kind: 'wide', alt: 'MINT game hub home page with the headline Play your way into the hobby and 2048: Card Edition featured', caption: 'The game hub' },
      { src: mintGame1, kind: 'wide', alt: '2048: Card Edition page with score counters and a ladder of card rarities', caption: '2048: Card Edition' },
      { src: mintGame2, kind: 'wide', alt: 'MINT crossword with trading-card hobby clues listed across and down', caption: 'Crossword' },
    ],
  },
  {
    id: 'centro',
    title: 'Centro Oswego Live',
    tagline: 'Live bus arrivals and a map for Centro’s Oswego routes.',
    year: '2025–2026',
    summary:
      'I rebuilt this from scratch after an incomplete team prototype from a course. A Flask service proxies Clever Devices BusTime and a React front end shows arrivals, a live Leaflet map, active buses and schedules. It runs on a university server.',
    build: [
      '7 Flask REST blueprints under /api/v1.',
      'An in-memory TTL cache, from 12 seconds for predictions up to 1 hour for stop lists.',
      '103 automated tests: 71 pytest and 32 Jest with React Testing Library.',
    ],
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
    title: 'HigherEdJobs Review',
    tagline: 'Finds higher-ed IT jobs and flags what each posting says about visa sponsorship.',
    year: '2026',
    summary:
      'A Playwright scraper reads 2 job boards into SQLite. A classifier sorts each posting’s sponsorship wording into 5 categories and shows the exact sentence behind the label. A React dashboard ranks jobs against my résumé and tracks my applications.',
    build: [
      'Parsing tries JSON-LD first, then semantic selectors. It fails loudly, so a bot check is never read as “no sponsorship”.',
      'Upserts are idempotent: re-scraping never resets my status or notes, or downgrades a description.',
      'The classifier is versioned, and saved jobs get relabelled when it changes.',
      'Scraping is sequential and polite. When a human check appears, it pauses and waits for me rather than trying to bypass it.',
    ],
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
    url: 'https://github.com/Vandanp14/Joblisting-Aggregator',
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
    period: 'Jun 2026 – Aug 2026',
    location: 'New York, NY',
    summary:
      'Product Builder is the app Fanatics uses to configure trading-card products for manufacturing. I built its first API and an AI assistant that can answer questions about its data.',
    highlights: [
      'Built an AI assistant that lets people ask about trading-card specs in plain English from Slack. Requests go through an internal message router to an Elixir runtime on AWS Bedrock AgentCore and a Phoenix backend.',
      'Built Product Builder’s first API: 5 read-only REST endpoints with generated OpenAPI 3.0 docs, so MCP tools can discover them automatically.',
      'Used a read-only repository so that any write through the API fails at compile time.',
      'Wrote a server-side SQL query that matches legacy ULIDs, newer UUIDs and roster entities, which recovered 36.5% of under-reported card data.',
      'Wrote AWS Signature V4 signing in plain Elixir for IAM calls to Bedrock and CloudWatch over IMDSv2, instead of adding a large SDK.',
      'Set up the API to fail closed, with feature flags, constant-time request verification, default-deny visibility and whitelisted JSON fields.',
      'Tested on staging with 82,000+ records. The slowest query took 37 ms before any tuning. All 86 tool tests passed across two full regression runs of about 2,900 tests.',
      'Shipped 3 features to production in 8 weeks. My first PR merged within 2 weeks, and the work came to about 4,000 lines across two stacked PRs.',
      'Wrote a 13-step MCP migration roadmap and a 4-chapter handoff for moving direct HTTP tool calls to Bedrock Gateway MCP targets.',
    ],
    stack: ['Elixir', 'Phoenix LiveView', 'PostgreSQL', 'RabbitMQ', 'AWS Bedrock', 'MCP'],
  },
  {
    company: 'SUNY Oswego Facilities Services',
    title: 'Software Developer Intern',
    period: 'Apr 2024 – Apr 2026',
    location: 'Oswego, NY',
    summary:
      'I built operational software and dashboards for facilities staff and management.',
    highlights: [
      'Built and maintained React and Tailwind dashboards that show real-time operational KPIs to facilities staff and management.',
      'Replaced a manual reporting process with an interactive dashboard, which cut report-generation time.',
      'Integrated REST APIs to keep data in sync in real time, and designed reusable React components with accessibility in mind.',
      'Asked field staff directly what they needed and turned that into features.',
      'Wrote IEEE-compliant requirements documentation and maintained Drupal 10 pages for the facilities-services system.',
    ],
    stack: ['React', 'Tailwind CSS', 'REST APIs', 'Drupal 10', 'Jira'],
  },
  {
    company: 'SUNY Oswego Institutional Research',
    title: 'Data Analyst Intern',
    period: 'Aug 2025 – Dec 2025',
    location: 'Oswego, NY',
    summary:
      'I built reporting and analysis workflows on student retention, GPA, course performance and student-success outcomes.',
    highlights: [
      'Built Tableau dashboards that helped leadership spot student-performance trends and where students needed intervention.',
      'Wrote Python and SQL pipelines that automated extraction, consolidation, cleaning and validation.',
      'Designed SQL ETL workflows and optimized queries, which cut manual data-processing and reporting time by 40%.',
      'Used SPSS to find predictors of first-year retention, and standardized data definitions across different systems so everyone worked from the same numbers.',
    ],
    stack: ['Python', 'SQL', 'Tableau', 'SPSS', 'ETL'],
  },
  {
    company: 'SUNY Oswego Major Projects Office',
    title: 'Project Analyst',
    period: 'Nov 2023 – Apr 2024',
    location: 'Oswego, NY',
    summary: 'I did planning, reporting and quality assurance for five project teams running at once.',
    highlights: [
      'Set up Jira-based Gantt tracking for 40+ deliverables across five teams.',
      'Improved QA workflows, which reduced data errors by 30%. Simplified reporting, which made decisions about 20% faster.',
    ],
    stack: ['Jira', 'Excel', 'QA'],
  },
  {
    company: 'SUNY Oswego Help Desk',
    title: 'Help Desk Attendant',
    period: 'Feb 2023 – May 2023',
    location: 'Oswego, NY',
    summary: 'I provided Tier-1 and Tier-2 support for university hardware, software, accounts and the network.',
    highlights: [
      'Resolved 100+ support issues and wrote internal troubleshooting guides that cut down repeat questions.',
      'Worked with system administrators to find recurring failures and improve escalation steps.',
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
    'OOP in Java and C++',
    'Functional programming in Clojure and Scala',
  ],
};

export type SkillGroup = { title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['Python', 'TypeScript', 'Elixir', 'Java', 'C++', 'C', 'SQL', 'Go', 'Scala', 'Clojure', 'Bash', 'JavaScript', 'HTML', 'CSS', 'Answer Set Programming'],
  },
  {
    title: 'Backend & distributed systems',
    skills: ['REST APIs', 'Phoenix LiveView', 'FastAPI', 'Flask', 'RabbitMQ', 'PostgreSQL', 'MySQL', 'Prisma', 'Docker', 'AWS', 'CI/CD', 'SQLite', 'Pydantic', 'Server-Sent Events', 'Vercel', 'Railway'],
  },
  {
    title: 'Front end',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Three.js', 'Accessibility', 'PWA', 'Leaflet', 'Google Apps Script'],
  },
  {
    title: 'AI & data',
    skills: ['MCP', 'AWS Bedrock', 'Gemini API', 'OpenAI API', 'Prompt design', 'Tableau', 'SPSS', 'ETL', 'Scikit-learn'],
  },
  {
    title: 'Systems & tooling',
    skills: ['POSIX APIs', 'TCP sockets', 'Multithreading', 'Mutexes', 'RAII', 'Git', 'Linux', 'Pytest', 'Vitest', 'Jest', 'Playwright', 'GitHub Actions'],
  },
];

export const recognition = [
  {
    title: 'Residence Life Staff Member of the Year',
    org: 'SUNY Oswego Residence Life',
    year: '2024',
    note: 'Recognized for student support as a Resident Assistant.',
  },
  {
    title: 'LakerHacks Finalist',
    org: 'LakerHacks',
    year: '2024',
    note: 'Top 10 of 30 teams with a project-planning agent that uses Gemini, built in 24 hours.',
  },
];

export const leadership = [
  {
    role: 'Resident Assistant',
    org: 'SUNY Oswego Residence Life',
    period: 'Jan 2024 – Present',
    note: 'I mentor 32 residents. I ran six community events with average attendance above 70%, and I handle conflict mediation and crisis response.',
  },
  {
    role: 'Member',
    org: 'National Society of Black Engineers',
    period: 'Ongoing',
    note: 'I go to recruiter panels, professional workshops and technical discussions on backend design and applied AI.',
  },
];

export const navSections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = 'top' | (typeof navSections)[number]['id'];

/** Looks up a project by id. Server-side metadata for these lives in PROJECT_PAGES (api/_lib/site.ts); keep the two in sync. */
export function projectById(id: string): Project | undefined {
  return featuredProjects.find((project) => project.id === id);
}
