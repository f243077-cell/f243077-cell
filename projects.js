/* ============================================================
   PROJECTS: single source for the project cards, the project drawer and the app spotlight.
   Descriptions, highlights and stacks come from Tanzeel's own project write-ups and resume.
   screens   = the app's own screenshot (cards, drawer and the spotlight on the overview).
   video     = a portrait demo that plays inside a phone frame.
   image     = a wide picture (console apps) shown in a code window instead of a phone.
   art       = inline SVG drawn for projects that have no screenshot.
   The first project gets the wide card at the top of the grid.
   No project links to a repository yet; add repo: "https://github.com/..." to show a source link.
   ============================================================ */
const demo = (file, poster) => ({ src: `Apps-Demo-Videos/web/${file}.mp4`, poster });
const shot = (file, alt) => ({ src: `assets/projects/${file}.webp`, alt });

window.PROJECTS = [
  {
    slug: "bioguard",
    name: "BioGuard",
    featured: true,
    tagline: "Real-time cold-chain monitoring, from sensor to alert",
    description: "An IoT-based cold-chain medicine safety and compliance system that monitors temperature-sensitive medical supplies (insulin, vaccines, biologics) in real time. It detects temperature excursions and unauthorized lock events, pushes live alerts over WebSocket and Firebase Cloud Messaging, and generates PDF compliance reports for auditing.",
    architecture: "FastAPI backend · Mosquitto MQTT broker · Flutter frontend with Riverpod · Python sensor simulator standing in for hardware",
    highlights: [["JWT", "Authenticated access"], ["Live", "Dashboard + history & trend charts"], ["Multi-device", "Per-device temperature thresholds"], ["PDF", "Compliance reports for auditing"]],
    stack: ["FastAPI", "Flutter", "Riverpod", "MQTT", "Firebase", "WebSocket"],
    languages: ["Dart", "Python"],
    categories: ["mobile", "backend", "systems"],
    badges: ["Flagship", "IoT"],
    video: demo("bioguard", "assets/projects/bioguard.webp"),
    screens: [shot("bioguard", "BioGuard dashboard listing three monitored fridges with live temperatures, lock status and an anomaly flagged on the insulin fridge")],
  },
  {
    slug: "acadai-buddy",
    name: "AcadAI Buddy",
    featured: true,
    tagline: "An AI tutor that actually knows the FAST-NUCES syllabus",
    description: "Full-stack AI study app for Pakistani university students, with real-time AI chat, auto-generated MCQ quizzes and note summarization. It supports 40+ subjects, including all FAST-NUCES core courses.",
    architecture: "Four-layer Clean Architecture · Riverpod · Firebase Auth + Firestore · OpenRouter API",
    highlights: [["40+", "Subjects supported"], ["3", "AI study tools"], ["4-layer", "Clean Architecture"]],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "OpenRouter"],
    languages: ["Dart"],
    categories: ["mobile", "ai"],
    video: demo("acadai", "assets/projects/acadai-buddy.webp"),
    screens: [shot("acadai-buddy", "AcadAI Buddy home screen with AI tutor, quiz and notes tools")],
  },
  {
    slug: "createresume-ai",
    name: "CreateResume AI",
    featured: true,
    tagline: "Turns a few sentences into an ATS-ready resume",
    description: "Generates complete, ATS-optimized resumes from plain-language input, exportable as polished PDFs across 5 templates, with job-targeted optimization on a credit-based usage system.",
    architecture: "Clean Architecture · Riverpod + go_router · Supabase Auth, Postgres, Storage and Edge Functions · credit-based usage",
    highlights: [["5", "PDF resume templates"], ["ATS", "Optimized output"], ["Credits", "Usage-based system"]],
    stack: ["Flutter", "Supabase", "Riverpod", "go_router", "OpenRouter API"],
    languages: ["Dart"],
    categories: ["mobile", "ai", "backend"],
    video: demo("createresume", "assets/projects/createresume-ai.webp"),
    screens: [shot("createresume-ai", "CreateResume AI home screen for building resumes")],
  },
  {
    slug: "weather-app",
    name: "Flutter Weather App",
    tagline: "Weather forecasting · Flutter + REST API",
    description: "Real-time weather app fetching live temperature, humidity, wind speed and multi-day forecast data, with a responsive Material UI, location-based lookup and graceful error handling.",
    architecture: "Live REST API · location-based lookup · graceful error handling",
    stack: ["Flutter", "Dart", "REST API"],
    languages: ["Dart"],
    categories: ["mobile"],
    screens: [shot("weather-app", "Flutter Weather App showing live conditions for London")],
  },
  {
    slug: "console-chess",
    name: "Console Chess Game",
    tagline: "Terminal chess engine · C++ + OOP",
    description: "Fully functional chess engine with each piece as a separate class carrying its own movement logic. Complete rule enforcement, with check, checkmate and stalemate detection, and ANSI-coloured terminal rendering.",
    architecture: "One class per piece · full rule enforcement · ANSI terminal rendering",
    stack: ["C++", "OOP"],
    languages: ["C++"],
    categories: ["systems"],
    image: { src: "assets/projects/console-chess.webp", alt: "Console Chess Game board rendered in the terminal", window: "console-chess" },
  },
  {
    slug: "social-console",
    name: "Console Social Media Platform",
    tagline: "Data Structures project · C++",
    description: "Integrated console-based social system combining linked lists, stacks, queues, trees and graphs: user connections, post feeds, notifications and search, each mapped to the data structure suited for it.",
    architecture: "Linked lists · stacks · queues · trees · graphs",
    stack: ["C++", "Data Structures"],
    languages: ["C++"],
    categories: ["systems"],
    image: { src: "assets/projects/social-media-console.webp", alt: "Console Social Media Platform splash screen", window: "social-platform", pixel: true },
  },
  {
    slug: "unidisc",
    name: "UniDisc",
    tagline: "Where discrete math meets course scheduling",
    description: "University management system that models course scheduling, prerequisite validation, faculty assignment and enrollment using propositional and predicate logic, set and relation analysis, and dynamic programming for conflict detection.",
    architecture: "Propositional & predicate logic · set and relation analysis · dynamic programming for conflicts",
    stack: ["C++", "Java", "OOP"],
    languages: ["C++", "Java"],
    categories: ["systems"],
    art: { window: "unidisc", caption: "prerequisite graph · conflict detection", svg: `<svg class="graph" viewBox="0 0 320 170" role="img" aria-label="Course prerequisite graph with one scheduling conflict highlighted">
      <g class="edges" fill="none" stroke-width="1.5">
        <path d="M40 45C80 45 80 35 120 35"/><path d="M40 45C80 45 80 90 120 90"/><path d="M40 125C80 125 80 90 120 90"/>
        <path d="M40 125C80 125 80 145 120 145"/><path d="M120 35C160 35 160 60 200 60"/><path d="M120 90C160 90 160 60 200 60"/>
        <path d="M120 90C160 90 160 120 200 120"/><path d="M120 145C160 145 160 120 200 120"/><path d="M200 60C240 60 240 90 280 90"/>
        <path d="M200 120C240 120 240 90 280 90"/>
      </g>
      <g class="nodes">
        <circle cx="40" cy="45" r="7"/><circle cx="40" cy="125" r="7"/><circle class="v" cx="120" cy="35" r="7"/>
        <circle class="v" cx="120" cy="90" r="7"/><circle class="v" cx="120" cy="145" r="7"/><circle cx="200" cy="60" r="7"/>
        <circle class="warn" cx="200" cy="120" r="7"/><circle class="v" cx="280" cy="90" r="8"/>
      </g>
    </svg>` },
  },
];
