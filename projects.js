/* ============================================================
   PROJECTS: single source for the project cards, the project drawer and the app spotlight.
   Descriptions, highlights and stacks come from Tanzeel's own project write-ups and resume.
   screens   = the app's own screens in play order; cards cycle through them, the spotlight uses the first.
   video     = a portrait demo that plays inside a phone frame.
   image     = a wide picture (console apps) shown in a code window instead of a phone.
   art       = inline SVG drawn for projects that have no screenshot.
   group     = which section the project sits in: "flutter", "genai" or "other" (see GROUPS in script.js).
               Keep the list in group order, so the project drawer steps through projects in page order.
   Add repo: "https://github.com/..." to show a source link; projects without one link to the GitHub profile.
   ============================================================ */
// wide = a landscape promo video, shown in a 16:9 player instead of a phone
const demo = (file, poster, wide = false) => ({ src: `Apps-Demo-Videos/web/${file}.mp4`, poster, wide });
const shot = (file, alt) => ({ src: `assets/projects/${file}.webp`, alt });
// more screens of the same app, taken from its own demo video
const frame = (file, n, alt) => ({ src: `assets/projects/screens/${file}-${n}.webp`, alt });

window.PROJECTS = [
  {
    slug: "citerag",
    group: "genai",
    name: "CiteRAG",
    featured: true,
    tagline: "Ask your documents. Code checks every citation.",
    description: "A RAG chatbot over your own PDFs, Markdown and images, where every citation is checked by code instead of trusted from the model. Each quoted passage is fuzzy-matched against its source page, a failed check triggers one corrective retry, and text hidden inside documents is treated as data, never as instructions. It answers in three modes: Standard, Deep (a three-agent CrewAI crew) and Agent (a LangGraph agent that plans, searches with tools and reflects), serves repeat questions from a semantic cache, and exposes the same read-only tools to any MCP client.",
    architecture: "FastAPI backend with a Streamlit UI · LlamaIndex hybrid search over Chroma and a BM25 docstore · citation verifier with a corrective retry · LangChain LLM gateway on OpenRouter free models · semantic cache on NumPy and SQLite · CrewAI Deep mode and LangGraph Agent mode · MCP server over stdio with three read-only tools · evaluation harness with a golden set · Docker Compose",
    highlights: [["92%", "Retrieval hit@5 on an AI-reviewed set"], ["0.1 s", "Repeat question served from the cache"], ["0 of 5", "Injection canary leaks"], ["681", "Tests passing, no network needed"]],
    stack: ["Python", "FastAPI", "LlamaIndex", "Chroma", "LangChain", "LangGraph", "CrewAI", "MCP", "Streamlit", "Docker"],
    languages: ["Python"],
    categories: ["ai", "backend"],
    badges: ["First GenAI project", "RAG"],
    repo: "https://github.com/f243077-cell/Cited-RAG-Project",
    video: demo("citerag", "assets/projects/citerag.webp", true),
    image: { src: "assets/projects/citerag.webp", alt: "CiteRAG title card: a chatbot over your own documents where code checks every citation", window: "citerag" },
  },
  {
    slug: "playgrid",
    group: "flutter",
    name: "PlayGrid",
    featured: true,
    tagline: "Multi-sport league and club platform, top 4 at NaSCon '26",
    description: "A multi-sport league and club operations platform built by a team of three at the NaSCon '26 App Dev Competition, where we finished in the top 4 teams. It covers fixtures, live scores, standings, rosters, a club store with checkout, live streaming and QR links, and the Flutter Android app keeps working offline and syncs on reconnect. I led the backend, infrastructure and integration.",
    architecture: "FastAPI REST and WebSocket API · PostgreSQL append-only event store · Redis for rate limiting, event streams and realtime pub/sub · MinIO for PDF receipts and match recordings · MediaMTX for RTMP, WebRTC and HLS streaming · Flutter app with Riverpod and an offline sync queue",
    highlights: [["Top 4", "NaSCon '26 App Dev Competition"], ["41 ms", "p95 live score push to 25 clients"], ["4", "Tournament formats generated"], ["97%+", "Test coverage across core modules"]],
    stack: ["Flutter", "Riverpod", "FastAPI", "PostgreSQL", "Redis", "MinIO", "MediaMTX", "Docker"],
    languages: ["Dart", "Python"],
    categories: ["mobile", "backend"],
    badges: ["Top 4 · NaSCon '26", "Team project"],
    repo: "https://github.com/f243077-cell/nasconhackathon",
    video: demo("nascon", "assets/projects/playgrid.webp"),
    screens: [shot("playgrid", "PlayGrid fixtures screen showing a live match score and upcoming matches"),
      frame("playgrid", 2, "Match page with a live score, lineups and pinned club merch"), frame("playgrid", 3, "Organizer score entry with a goal recorded"), frame("playgrid", 4, "Club store with jerseys, gear and digital items"), frame("playgrid", 5, "Scanning a match QR code"), frame("playgrid", 6, "Sync queue holding a roster change made offline"), frame("playgrid", 7, "Co-stream with up to 4 hosts and one composite stream")],
  },
  {
    slug: "bioguard",
    group: "flutter",
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
    screens: [shot("bioguard", "BioGuard dashboard listing three monitored fridges with live temperatures, lock status and an anomaly flagged on the insulin fridge"),
      frame("bioguard", 2, "Push alert for a fridge outside its safe range"), frame("bioguard", 3, "Alerts screen with active and resolved alerts"), frame("bioguard", 4, "History screen charting a temperature excursion")],
  },
  {
    slug: "acadai-buddy",
    group: "flutter",
    name: "AcadAI Buddy",
    featured: true,
    tagline: "An AI tutor that actually knows the FAST-NUCES syllabus",
    description: "Full-stack AI study app for Pakistani university students, with real-time AI chat, auto-generated MCQ quizzes and note summarization. It supports 40+ subjects, including all FAST-NUCES core courses.",
    architecture: "Four-layer Clean Architecture · Riverpod · Firebase Auth + Firestore · OpenRouter API",
    highlights: [["40+", "Subjects supported"], ["3", "AI study tools"], ["4-layer", "Clean Architecture"]],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "OpenRouter"],
    languages: ["Dart"],
    categories: ["mobile", "ai"],
    video: demo("acadai", "assets/projects/acadai-cover.webp", true),
    screens: [shot("acadai-buddy", "AcadAI Buddy home screen with Ask Tutor, Practice Quiz and Summarize Notes"),
      frame("acadai", 2, "AI tutor ready for a Data Structures question"), frame("acadai", 3, "Tutor answering step by step with math and code"), frame("acadai", 4, "Practice quiz question with an explanation"), frame("acadai", 5, "Quiz scored 9 of 10 with a review of each answer"), frame("acadai", 6, "Lecture notes summarized into key points")],
  },
  {
    slug: "createresume-ai",
    group: "flutter",
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
    screens: [shot("createresume-ai", "CreateResume AI home screen for building resumes"),
      frame("createresume", 2, "Choosing a career stage"), frame("createresume", 3, "Describing yourself in plain language"), frame("createresume", 4, "Choosing a resume template"), frame("createresume", 5, "Editing the generated resume sections"), frame("createresume", 6, "Finished resume exported as a PDF")],
  },
  {
    slug: "unidisc",
    group: "other",
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
