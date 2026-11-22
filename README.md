<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/readme/banner-dark.svg">
  <img alt="Tanzeel Hussain, Full-Stack GenAI Engineer: RAG, AI agents, MCP, QLoRA fine-tuning, FastAPI and Flutter. A four-layer stack shows Flutter apps on top of FastAPI and realtime services, RAG and agents, and QLoRA fine-tuning." src="assets/readme/banner-light.svg" width="100%">
</picture>

<p align="center">
<a href="https://portfolio-tanzeelhussain.vercel.app/"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-d8c6a0?style=for-the-badge&logo=vercel&logoColor=18191b"></a>
<a href="https://portfolio-tanzeelhussain.vercel.app/assets/Tanzeel_Hussain_Resume.pdf"><img alt="Résumé (PDF)" src="https://img.shields.io/badge/R%C3%A9sum%C3%A9_PDF-2a2b2f?style=for-the-badge&logo=adobeacrobatreader&logoColor=d8c6a0"></a>
<a href="https://www.linkedin.com/in/tanzeelhussain-swe"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-2a2b2f?style=for-the-badge"></a>
<a href="https://www.upwork.com/freelancers/~010abcc56cc81a152c"><img alt="Upwork" src="https://img.shields.io/badge/Upwork-2a2b2f?style=for-the-badge&logo=upwork&logoColor=8fb89c"></a>
<a href="mailto:tanzeelhussain346@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-2a2b2f?style=for-the-badge&logo=gmail&logoColor=d39a80"></a>
</p>

<p align="center">
<img alt="Status: open to GenAI and Flutter roles" src="https://img.shields.io/badge/status-open_to_GenAI_%26_Flutter_roles-8fb89c?style=flat-square&labelColor=18191b">
<img alt="Location: Pakistan, open to remote" src="https://img.shields.io/badge/based_in-Pakistan_%C2%B7_open_to_remote-d8c6a0?style=flat-square&labelColor=18191b">
</p>

## About me

I'm a Software Engineering student at FAST-NUCES Faisalabad who builds GenAI systems end to end: the retrieval and agents, the FastAPI service around them, and the Flutter app people actually touch. My RAG chatbot, [CiteRAG](https://github.com/f243077-cell/Cited-RAG-Project), checks every citation in code and reached 92% hit@5 with 681 offline tests. Right now I'm fine-tuning a Qwen2.5 prompt-injection guard for Roman Urdu with QLoRA, and co-building OnCallPilot, an AI incident copilot where a human approves every action.

In August 2026 I finished an eight-week remote Flutter internship at FlutterCraft.app, and I take freelance Flutter work on [Upwork](https://www.upwork.com/freelancers/~010abcc56cc81a152c) alongside my degree. I'm open to GenAI and Flutter roles, remote or on-site, in Pakistan, Dubai and Germany.

| Role                        | Organization                                                     | When                      |
| :-------------------------- | :--------------------------------------------------------------- | :------------------------ |
| Freelance Flutter Developer | [Upwork](https://www.upwork.com/freelancers/~010abcc56cc81a152c) | Ongoing                   |
| Flutter Developer Intern    | FlutterCraft.app (remote)                                        | Jul – Aug 2026, completed |
| BS Software Engineering     | FAST-NUCES Faisalabad                                            | 2024 – 2028               |

## Projects

<sub>Badge key: <img alt="sage" src="https://img.shields.io/badge/-shipped_or_measured-8fb89c?style=flat-square"> <img alt="clay" src="https://img.shields.io/badge/-in_progress-d39a80?style=flat-square"> <img alt="sand" src="https://img.shields.io/badge/-award-d8c6a0?style=flat-square"></sub>

### GenAI engineering

#### [CiteRAG](https://github.com/f243077-cell/Cited-RAG-Project): a RAG chatbot whose citations are checked by code

<img alt="hit@5: 92%" src="https://img.shields.io/badge/hit%405-92%25-8fb89c?style=flat-square&labelColor=2a2b2f"> <img alt="681 offline tests" src="https://img.shields.io/badge/offline_tests-681-8fb89c?style=flat-square&labelColor=2a2b2f"> <img alt="Cached answer in 0.1 s" src="https://img.shields.io/badge/cached_answer-0.1_s-8fb89c?style=flat-square&labelColor=2a2b2f"> <img alt="0 of 5 injection canaries leaked" src="https://img.shields.io/badge/injection_canaries_leaked-0%2F5-8fb89c?style=flat-square&labelColor=2a2b2f">

Ask questions about your own PDFs, Markdown and images, and every quoted passage in the answer is fuzzy-matched against its source page by code, with one corrective retry and a visible warning on any remaining doubt. Retrieval is LlamaIndex hybrid search over Chroma and a BM25 docstore. It answers in three modes: Standard, Deep (a three-agent CrewAI crew) and Agent (a LangGraph agent that plans, searches with tools and reflects). A semantic cache on NumPy and SQLite serves a repeated question in about 0.1 s instead of about 10 s, and a read-only MCP server exposes the same tools to any MCP client. Hit@5 was measured on an AI-reviewed golden set, so treat it as provisional.

<sub>Python · FastAPI · Streamlit · LlamaIndex · Chroma · LangChain · LangGraph · CrewAI · MCP · OpenRouter · Docker Compose</sub>

#### [OnCallPilot](https://github.com/f243077-cell/OneCallPilot): a mobile AI incident copilot with a human in the loop

<img alt="In progress" src="https://img.shields.io/badge/status-in_progress-d39a80?style=flat-square&labelColor=2a2b2f"> <img alt="Team of 2" src="https://img.shields.io/badge/team-2-d8c6a0?style=flat-square&labelColor=2a2b2f"> <img alt="8 fault scenarios" src="https://img.shields.io/badge/fault_scenarios-8-d8c6a0?style=flat-square&labelColor=2a2b2f">

An agent investigates alerts with read-only tools, ranks up to three root causes that cite stored evidence, and proposes one action from a fixed catalogue. Nothing runs until a person approves it. I own the acting and display stream: the Flutter Android app for evidence review and biometric approval, the isolated runner that executes approved actions, and Chaos Shop, a testbed with eight fault scenarios. The safety model is strict: the LLM never touches infrastructure, approvals are signed and single-use, and the runner re-validates every action and can only start, stop or restart allowlisted containers. It will be judged by a 48-run benchmark (manual against copilot) on time to diagnosis, with zero unsafe actions allowed.

<sub>Python · FastAPI · Flutter · Supabase (Postgres, pgvector) · Redis Streams · Docker</sub>

#### [RU-Guard](https://github.com/f243077-cell/Roman-Urdu-Guard-Model): a fine-tuned prompt-injection guard for Roman Urdu

<img alt="In progress" src="https://img.shields.io/badge/status-in_progress-d39a80?style=flat-square&labelColor=2a2b2f"> <img alt="4,004 training rows" src="https://img.shields.io/badge/training_rows-4%2C004-d8c6a0?style=flat-square&labelColor=2a2b2f"> <img alt="300-row locked test set" src="https://img.shields.io/badge/locked_test_set-300_rows-d8c6a0?style=flat-square&labelColor=2a2b2f">

Fine-tuning Qwen2.5-0.5B and 1.5B Instruct with QLoRA to catch prompt injection in Roman Urdu, English and mixed text, then serving it locally as a FastAPI guard service on Ollama (GGUF). The data came from Qwen2.5-14B-Instruct-AWQ on Colab: 4,004 training and 496 validation rows. I threw away the first version after a 200-row review found 24% bad rows, and rebuilt it with stricter prompts and an LLM judge. A 300-row test set sits behind a SHA-256 lock so it's never trained or tuned on, and a reference LangGraph RAG app runs guard checks at input, retrieval, ingest and output.

<sub>Qwen2.5 · QLoRA · Hugging Face · FastAPI · Ollama · LangGraph · Google Colab</sub>

### Full-stack and mobile

#### [PlayGrid](https://github.com/f243077-cell/nasconhackathon): multi-sport league and club platform

<img alt="Top 4 at NaSCon '26" src="https://img.shields.io/badge/NaSCon_%2726-top_4-d8c6a0?style=flat-square&labelColor=2a2b2f"> <img alt="Live score push p95 41 ms" src="https://img.shields.io/badge/live_score_p95-41_ms-8fb89c?style=flat-square&labelColor=2a2b2f"> <img alt="Test coverage 97%+" src="https://img.shields.io/badge/core_coverage-97%25%2B-8fb89c?style=flat-square&labelColor=2a2b2f">

Built by a team of three over the two days of the NaSCon '26 App Dev Competition, where we finished in the top 4. I led the backend, infrastructure and integration. A FastAPI service computes scores from an append-only event stream in PostgreSQL, Redis handles rate limiting, domain events and realtime pub/sub, and MinIO stores PDF receipts and match recordings. Fixtures generate in four formats, and MediaMTX ingests streams over RTMP and WebRTC and serves them as HLS. The Flutter Android app queues changes offline and syncs on reconnect. Score updates reached 25 WebSocket clients at a 41 ms p95.

<sub>Flutter · Riverpod · FastAPI · PostgreSQL · Redis · MinIO · MediaMTX · WebSocket · Docker Compose</sub>

#### [BioGuard](https://github.com/f243077-cell/BioGuard): cold-chain compliance for vaccines, insulin and biologics

Simulated fridge sensors publish temperature and lock readings over MQTT (QoS 1) to a FastAPI backend, which re-checks every reading against that device's own thresholds before opening, escalating or resolving an alert. Alerts reach the Flutter app live over WebSocket and Firebase Cloud Messaging, and the app covers JWT auth, a multi-device dashboard, trend charts and PDF compliance reports.

<sub>FastAPI · Flutter · Riverpod · MQTT (Mosquitto) · WebSocket · Firebase Cloud Messaging · SQLite · Docker Compose</sub>

#### [AcadAI Buddy](https://github.com/f243077-cell/AcadAi_Buddy): AI study companion for university students

Subject-aware AI chat, MCQ quizzes generated and scored on the spot, and summaries from pasted text or a photo of your notes, across 40+ subjects including every FAST-NUCES core course. Four Clean Architecture layers keep Firebase and OpenRouter behind abstract repositories, with failures returned as `dartz` `Either` values, so the UI never knows which model provider it's talking to.

<sub>Flutter · Riverpod · Firebase Auth · Cloud Firestore · OpenRouter · go_router · Clean Architecture</sub>

#### [CreateResume AI](https://github.com/f243077-cell/CreateResume-AI-App): plain-language input to ATS-ready resume

Describe your background in plain language and it drafts an ATS-optimized resume, optionally tailored to a job description, rendered as a PDF in five templates. Generation runs in a Supabase Edge Function that calls OpenRouter, so the API key never ships inside the app, and each generation draws on a per-user credit balance behind free and premium plans.

<sub>Flutter · Riverpod · Supabase (Auth, Postgres, Storage, Edge Functions) · OpenRouter · go_router</sub>

#### [FounderAI](https://github.com/f243077-cell/Founder_AI): AI startup assistant

Built at the Google Developer Groups "Build with AI" hackathon.

<sub>Node.js · Express · Render</sub>

### Computer science fundamentals

- **[Console Social Media Platform](https://github.com/f243077-cell/Mini_Instagram_App)**: built with no STL containers in a team of two. A hash table holds users, a graph with BFS and DFS holds friendships, linked lists hold feeds, and an AVL tree drives top-K analytics. <sub>C++ · data structures</sub>
- **[UniDisc](https://github.com/f243077-cell/Discrete-University-Management-System)**: course scheduling, prerequisites and enrollment modelled with predicate logic, set and relation analysis, and dynamic programming for conflict detection. <sub>C++ · Java · discrete mathematics</sub>
- **[Console Chess Engine](https://github.com/f243077-cell/oop-chess-game)**: two-player chess on an abstract `Piece` class, with layered move validation that also drives checkmate and stalemate detection. <sub>C++ · OOP · factory pattern</sub>

<details>
<summary><b>More projects</b></summary>
<br>

- [FlexPortal](https://github.com/f243077-cell/FlexPortal-Student-Attendance-Result-Management-System): attendance and result management with role-based login
- [Weather App](https://github.com/f243077-cell/Weather_App): real-time weather with location-based lookup
- [Multi-Currency Converter](https://github.com/f243077-cell/flutter-multi-currency-converter): live PKR to 20+ currencies
- [University Management System](https://github.com/f243077-cell/fast-university-management-system)
- [Slot Booking System](https://github.com/f243077-cell/Slot-booking-system)
- [CSV Validator](https://github.com/f243077-cell/CSV-Validator)
- [Resume to JSON Extractor](https://github.com/f243077-cell/Resume-to-JSON-Extractor-)
- [URL Health Checker](https://github.com/f243077-cell/URL-Health-Checker)
- [whispr](https://github.com/f243077-cell/whispr)

</details>

## Tech stack

<p align="center">
<img src="https://skillicons.dev/icons?i=py,fastapi,flutter,dart,postgres,redis,supabase,firebase,docker,githubactions,gcp,cloudflare,nodejs,express,cpp,java,git,github,postman,vscode&perline=10" alt="Python, FastAPI, Flutter, Dart, PostgreSQL, Redis, Supabase, Firebase, Docker, GitHub Actions, Google Cloud, Cloudflare, Node.js, Express, C++, Java, Git, GitHub, Postman, VS Code"/>
</p>

| Area                     | Stack                                                                                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| LLMs and agents          | RAG, LangChain, LangGraph, LlamaIndex, CrewAI, AI agents and tool calling, Model Context Protocol (MCP), prompt and context engineering, structured output (Pydantic), OpenRouter |
| Retrieval and evaluation | Embeddings, vector databases (Chroma, pgvector), hybrid search (BM25 and vector), re-ranking, semantic caching, RAG evaluation (golden sets, hit@k), prompt-injection defense |
| Fine-tuning              | QLoRA, Qwen2.5, Hugging Face, synthetic data generation, LLM-as-judge filtering, GGUF, Ollama, Google Colab                                       |
| Backend and data         | Python, FastAPI, REST APIs, WebSockets, PostgreSQL, Redis, MQTT, Supabase, Firebase, Streamlit, Node.js, Express                                  |
| Mobile                   | Flutter, Dart, Riverpod, go_router, Hive, Drift (SQLite), Firebase Cloud Messaging, offline sync                                                  |
| DevOps and cloud         | Docker, Docker Compose, GitHub Actions, Google Cloud Run, Cloudflare Workers                                                                      |
| Architecture             | Clean Architecture, SOLID, GoF Design Patterns, event-driven design, OOP                                                                          |
| Languages and tools      | Python, Dart, SQL, C++, Java, Git, GitHub, Postman                                                                                                |
| AI coding tools          | Cursor, Claude Code                                                                                                                               |

## Learning roadmap

- [x] Python, NumPy, Pandas
- [x] Docker
- [x] MCP (Model Context Protocol) & prompt engineering
- [x] Software Design & Architecture (SDA)
- [x] LLM orchestration & RAG (LangChain)
- [x] Vector databases
- [x] Agentic AI systems
- [ ] LLM fine-tuning with QLoRA (in progress with RU-Guard)
- [ ] Software Construction & Development (SCD)
- [ ] MLOps

## Achievements

- Top 4 team at the NaSCon '26 App Dev Competition: built [PlayGrid](https://github.com/f243077-cell/nasconhackathon), a multi-sport league and club platform
- Covered every topic of a GenAI engineering roadmap (Python and FastAPI, LLM fundamentals, RAG, agents and MCP, production engineering); first project built from it: [CiteRAG](https://github.com/f243077-cell/Cited-RAG-Project)
- GDG "Build with AI" hackathon participant: built [FounderAI](https://github.com/f243077-cell/Founder_AI), an AI startup assistant

## GitHub stats

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/readme/stats-dark.svg">
  <img alt="GitHub stats for f243077-cell: public repositories, public commits, and top languages by code written" src="assets/readme/stats-light.svg" width="100%">
</picture>

<sub>Drawn daily by a GitHub Action in this repo. Language shares exclude build files and the platform-runner code Flutter generates.</sub>
