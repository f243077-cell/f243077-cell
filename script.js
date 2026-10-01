/* ============================================================
   TANZEEL HUSSAIN — PORTFOLIO  ·  script.js
   ============================================================ */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  const root = document.documentElement;
  const body = document.body;

  /* ---------- helpers ---------- */
  const toastEl = $("#toast");
  let toastT;
  const toast = (msg, ms = 2200) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), ms);
  };
  const scrollToId = (id) => {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); toast("copied → " + text); }
    catch { toast("clipboard blocked — " + text, 3500); }
  };

  /* the site has one theme (dark); a choice saved by the old theme toggle no longer applies */
  try { localStorage.removeItem("theme"); } catch {}

  /* ---------- boot screen ---------- */
  const boot = $("#boot");
  const bootLog = $("#boot-log");
  const bootFill = $("#boot-fill");
  let bootDone = false;
  const finishBoot = () => {
    if (bootDone) return;
    bootDone = true;
    boot.classList.add("done");
    body.classList.remove("no-scroll");
    setTimeout(() => { boot.remove(); startHero(); }, 600);
  };
  const bootLines = [
    ["<span class='dim'>[boot]</span> tanzeel.sh v1.0.0", 0],
    ["<span class='dim'>[init]</span> flutter doctor ................... <span class='ok'>ok</span>", 120],
    ["<span class='dim'>[init]</span> mounting /home/tanzeel .......... <span class='ok'>ok</span>", 110],
    ["<span class='dim'>[net ]</span> resolving linkedin.com ........... <span class='ok'>ok</span>", 140],
    ["<span class='dim'>[pkg ]</span> flutter pub get ................... <span class='ok'>ok</span>", 160],
    ["<span class='dim'>[sys ]</span> spinning up the skill globe ....... <span class='ok'>ok</span>", 130],
    ["<span class='dim'>[ui  ]</span> hot reload ......................... <span class='ok'>ok</span>", 150],
    ["<span class='dim'>[done]</span> welcome, visitor.", 220],
  ];
  const runBoot = () => {
    body.classList.add("no-scroll");
    let seen = false;
    try { seen = !!sessionStorage.getItem("booted"); } catch {}
    // deep links (#/bioguard) go straight to the project
    if (seen || reduceMotion || location.hash.startsWith("#/")) { finishBoot(); return; }
    try { sessionStorage.setItem("booted", "1"); } catch {}
    let i = 0;
    const step = () => {
      if (bootDone) return;
      if (i >= bootLines.length) { bootFill.style.width = "100%"; setTimeout(finishBoot, 350); return; }
      bootLog.insertAdjacentHTML("beforeend", bootLines[i][0] + "\n");
      bootFill.style.width = ((i + 1) / bootLines.length * 100) + "%";
      i++;
      setTimeout(step, bootLines[i - 1][1] + 90);
    };
    step();
  };
  $("#boot-skip").addEventListener("click", finishBoot);
  document.addEventListener("keydown", (e) => { if (!bootDone && (e.key === "Enter" || e.key === "Escape")) finishBoot(); });

  /* ---------- background: particle constellation ---------- */
  const canvas = $("#bg");
  const ctx = canvas.getContext("2d");
  let W, H, pts = [], mouse = { x: -9999, y: -9999 }, raf;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2), prevW = W;
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // phones resize every time the address bar slides in or out; keep the particles so the background doesn't jump
    if (pts.length && W === prevW) { pts.forEach(p => { p.y = Math.min(p.y, H); }); return; }
    const n = Math.min(Math.floor((W * H) / 16000), isTouch ? 45 : 110);
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.4 + .6,
    }));
  };
  const accent = () => getComputedStyle(root).getPropertyValue("--accent").trim() || "#ff7f6b";
  const hexToRgb = (h) => {
    const m = h.replace("#", "");
    const v = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
    const n = parseInt(v, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  let rgb = [255, 127, 107];
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const link = isTouch ? 90 : 120;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      // gentle mouse attraction
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 160) { p.x += dx * .003; p.y += dy * .003; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.45)`; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(1 - d / link) * .18})`;
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };
  const startBg = () => {
    resize(); rgb = hexToRgb(accent());
    if (reduceMotion) { draw(); cancelAnimationFrame(raf); return; }
    draw();
  };
  addEventListener("resize", () => { resize(); if (reduceMotion) { draw(); cancelAnimationFrame(raf); } }, { passive: true });
  addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf); else if (!reduceMotion) draw();
  });
  startBg();

  /* ---------- custom cursor ---------- */
  if (!isTouch) {
    const cur = $("#cursor"), ring = $("#cursor-ring");
    let rx = 0, ry = 0, tx = 0, ty = 0;
    body.classList.add("cursor-hidden"); // stay hidden until the mouse actually moves
    addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cur.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
      body.classList.remove("cursor-hidden");
    }, { passive: true });
    const lerp = () => {
      rx += (tx - rx) * .18; ry += (ty - ry) * .18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(lerp);
    };
    lerp();
    document.addEventListener("mouseleave", () => body.classList.add("cursor-hidden"));
    const hoverSel = "a, button, .tag, .chip, input, textarea, .player, .sphere, [role=option]";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverSel)) body.classList.add("cursor-hover"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(hoverSel)) body.classList.remove("cursor-hover"); });
  }

  /* ---------- nav ---------- */
  const nav = $("#nav"), navLinks = $("#nav-links"), burger = $("#burger");
  const progress = $("#progress"), totop = $("#totop");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 10);
    nav.classList.toggle("hide", y > lastY && y > 300 && !navLinks.classList.contains("open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    totop.classList.toggle("show", y > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  totop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  const closeMenu = () => { navLinks.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); body.classList.remove("no-scroll"); };
  burger.addEventListener("click", () => {
    const open = !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    body.classList.toggle("no-scroll", open);
  });
  $$("a", navLinks).forEach(a => a.addEventListener("click", closeMenu));
  addEventListener("resize", () => { if (innerWidth > 760) closeMenu(); }, { passive: true });

  // active section highlight
  const sections = $$("main section[id]");
  const navMap = new Map($$("a", navLinks).map(a => [a.getAttribute("href").slice(1), a]));
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navMap.forEach(a => a.classList.remove("active"));
        navMap.get(en.target.id)?.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => sectionObs.observe(s));

  /* ---------- projects: cards (from projects.js) ---------- */
  const PROJECTS = window.PROJECTS || [];
  const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const langColor = { Dart: "#00B4AB", Python: "#3572A5", "C++": "#f34b7d", Java: "#b07219", JavaScript: "#f1e05a" };
  const ghIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>`;
  const extIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>`;
  const dlIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const gh = "https://github.com/f243077-cell";
  const langDots = (p) => p.languages.map(l => `<span class="lang"><i style="--c:${langColor[l] || "#888"}"></i>${l}</span>`).join("");
  const highlights = (p) => p.highlights ? `<ul class="project-hl">${p.highlights.map(([b, t]) => `<li><b>${escHtml(b)}</b>${escHtml(t)}</li>`).join("")}</ul>` : "";
  // a console app's picture, or drawn art, in a small terminal window
  const miniWin = (p) => {
    const m = p.image || p.art;
    const inner = p.image
      ? `<img src="${p.image.src}" alt="${escHtml(p.image.alt)}"${p.image.pixel ? ` class="pixel"` : ""} loading="lazy" decoding="async">`
      : `${p.art.svg}<span class="mini-cap">${escHtml(p.art.caption)}</span>`;
    return `<div class="mini-win"><div class="mini-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><em>${escHtml(m.window)}</em></div><div class="mini-body">${inner}</div></div>`;
  };
  // featured cards: the app's screen in a phone; on desktop its demo plays while the pointer rests on the card
  const cardShot = (p) => `<div class="project-shot"><div class="phone phone-sm">
        <img class="card-scr on" src="${p.screens[0].src}" alt="" loading="lazy" decoding="async">
        ${p.video ? `<video class="card-vid" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1" aria-hidden="true"></video>` : ""}
      </div>${p.video ? `<span class="shot-hint">hover to preview</span>` : ""}</div>`;
  const cardThumb = (p) => p.screens
    ? `<div class="project-thumb"><div class="phone phone-sm"><img class="card-scr on" src="${p.screens[0].src}" alt="" loading="lazy" decoding="async"></div></div>`
    : (p.image || p.art) ? `<div class="project-thumb">${miniWin(p)}</div>` : "";
  $("#project-grid").innerHTML = PROJECTS.map(p => {
    const thumb = !p.featured ? cardThumb(p) : "";
    return `
    <article class="project reveal${p.featured ? " featured" : ""}${thumb ? " has-thumb" : ""}" data-tags="${p.categories.join(" ")}">
      <div class="project-body">
        <div class="project-head">
          <h3 class="project-title"><button class="project-open" type="button" data-open="${p.slug}">${escHtml(p.name)}</button></h3>
          ${(p.badges || []).map(b => `<span class="project-badge">${escHtml(b)}</span>`).join("")}
        </div>
        <p class="project-sub">${escHtml(p.tagline)}</p>
        <p class="project-desc">${escHtml(p.description)}</p>
        ${p.featured ? highlights(p) : ""}
        <p class="project-arch">${escHtml(p.architecture)}</p>
        <ul class="project-stack">${p.stack.map(s => `<li>${escHtml(s)}</li>`).join("")}</ul>
        <div class="project-meta">${langDots(p)}<span class="project-cta">${p.video ? "watch demo" : "view project"} →</span></div>
      </div>
      ${p.featured ? cardShot(p) : thumb}
    </article>`;
  }).join("");

  /* ---------- skill logos (skill-icons.js, built by tools/build_skill_icons.mjs) ---------- */
  const skillIcons = window.SKILL_ICONS || {};
  $$(".skill-group .tag").forEach(t => { const icon = skillIcons[t.textContent.trim()]; if (icon) t.insertAdjacentHTML("afterbegin", icon); });

  /* ---------- reveal on scroll ---------- */
  // children of these lists cascade in one after another once their card is revealed
  $$(".tags, .project-stack, .about-facts, .contact-links, .project-hl, .roadmap").forEach(list => [...list.children].forEach((c, i) => c.style.setProperty("--i", i)));
  // section titles decode from noise glyphs into their word
  $$(".section-title").forEach(t => {
    const word = [...t.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (!word) return;
    const span = document.createElement("span");
    span.className = "st-word";
    span.textContent = word.textContent.trim();
    word.replaceWith(" ", span);
  });
  const scrambleTitle = (title) => {
    const el = $(".st-word", title);
    if (!el || reduceMotion) return;
    const target = el.textContent, glyphs = "!<>-_\\/[]{}=+*^?#01";
    const t0 = performance.now(), dur = 700;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1), done = Math.floor(p * target.length);
      el.textContent = target.slice(0, done) + [...target.slice(done)].map(() => glyphs[(Math.random() * glyphs.length) | 0]).join("");
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en, idx) => {
      if (en.isIntersecting) {
        en.target.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
        en.target.classList.add("in");
        if (en.target.matches(".section-title")) scrambleTitle(en.target);
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => revealObs.observe(el));

  /* ---------- hero: typing ---------- */
  const typedEl = $("#typed");
  const phrases = [
    "Flutter apps for iOS & Android.", "AI-powered study & resume apps.", "real-time IoT dashboards.",
    "Clean Architecture codebases.", "Firebase & Supabase backends.", "apps on live REST APIs.",
    "your app idea, end to end.",
  ];
  let pi = 0, ci = 0, del = false, typingStarted = false;
  const typeLoop = () => {
    const word = phrases[pi];
    typedEl.textContent = word.slice(0, ci);
    let wait = del ? 38 : 70;
    if (!del && ci === word.length) { wait = 1800; del = true; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
    else ci += del ? -1 : 1;
    setTimeout(typeLoop, wait);
  };

  let showcaseStart = null; // set by the hero showcase further down

  const heroName = $(".hero-name");
  const glitch = () => {
    if (reduceMotion) return;
    heroName.classList.add("glitch");
    setTimeout(() => heroName.classList.remove("glitch"), 520);
  };
  heroName.addEventListener("mouseenter", glitch);

  const startHero = () => {
    if (typingStarted) return;
    typingStarted = true;
    $$(".hero .reveal").forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 90));
    setTimeout(typeLoop, 500);
    setTimeout(() => showcaseStart?.(), 450);
    setTimeout(glitch, 900);
  };

  /* ---------- project spotlight + filters ---------- */
  $$(".project").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    }, { passive: true });
  });
  const chips = $$("#filters .chip"), cards = $$("#project-grid .project");
  const setFilter = (f) => {
    chips.forEach(c => c.classList.toggle("active", c.dataset.filter === f));
    cards.forEach(card => {
      const show = f === "all" || card.dataset.tags.split(" ").includes(f);
      card.classList.toggle("hidden", !show);
      if (show) card.classList.add("in");
    });
  };
  chips.forEach(c => c.addEventListener("click", () => setFilter(c.dataset.filter)));

  /* ---------- footer year / copy buttons ---------- */
  $("#year").textContent = new Date().getFullYear();
  $$(".copy-btn").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); copy(b.dataset.copy); }));

  /* ---------- contact form ---------- */
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const subject = encodeURIComponent(`Portfolio message from ${f.name.value}`);
    const bodyTxt = encodeURIComponent(`${f.message.value}\n\n— ${f.name.value} <${f.email.value}>`);
    location.href = `mailto:tanzeelhussain346@gmail.com?subject=${subject}&body=${bodyTxt}`;
    toast("opening your mail client…");
  });

  /* ---------- skill globe: drag to spin, eases to a stop ---------- */
  const sphere = $("[data-sphere]");
  if (sphere) {
    const tags = $$(".sphere-tag", sphere), n = tags.length, golden = Math.PI * (3 - Math.sqrt(5));
    const pts = tags.map((el, i) => {
      const y = 1 - (2 * (i + .5)) / n, r = Math.sqrt(1 - y * y);
      return { el, x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
    });
    let radius = 150, ax = .3, ay = .4, vx = 0, vy = 0, spinning = false, dragging = false, last = 0;
    const measure = () => {
      // narrow cards pull the ring in so long labels at the edge stay inside
      const k = sphere.clientWidth < 480 ? .34 : .4;
      radius = Math.min(sphere.clientWidth * k, sphere.clientHeight * .44);
      sphere.style.setProperty("--sd", `${radius * 2.3}px`);
    };
    const render = () => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      pts.forEach(p => {
        const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2, scale = .62 + depth * .5;
        p.el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y2 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        p.el.style.opacity = (.22 + depth * .78).toFixed(3);
        p.el.style.zIndex = Math.round(depth * 100);
      });
    };
    const frame = (t) => {
      const dt = last ? Math.min(t - last, 50) / 16.67 : 1;
      last = t;
      if (!dragging) { ax += vx * dt; ay += vy * dt; const decay = Math.pow(.94, dt); vx *= decay; vy *= decay; }
      render();
      if (dragging || Math.abs(vx) + Math.abs(vy) > .0004) requestAnimationFrame(frame);
      else { spinning = false; last = 0; }
    };
    const kick = () => { if (!spinning) { spinning = true; requestAnimationFrame(frame); } };
    measure(); render();
    addEventListener("resize", () => { measure(); render(); }, { passive: true });
    let gx = 0, gy = 0;
    sphere.addEventListener("pointerdown", (e) => {
      dragging = true; gx = e.clientX; gy = e.clientY; vx = vy = 0;
      sphere.classList.add("dragging"); sphere.setPointerCapture(e.pointerId); kick();
    });
    sphere.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - gx, dy = e.clientY - gy;
      gx = e.clientX; gy = e.clientY;
      ay += dx * .008; ax -= dy * .008;
      if (!reduceMotion) { vy = dx * .008; vx = -dy * .008; } // flick speed carries on as inertia
    });
    const release = () => { dragging = false; sphere.classList.remove("dragging"); };
    sphere.addEventListener("pointerup", release);
    sphere.addEventListener("pointercancel", release);
    // a gentle nudge the first time the globe scrolls into view, so it's clear it moves
    if (!reduceMotion) {
      const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); vy = .045; vx = .012; kick(); } }, { threshold: .4 });
      seen.observe(sphere);
    }
  }

  /* ---------- demo videos: each downloads once, in the background, shared by the hero and the case studies ---------- */
  const conn = navigator.connection;
  // Save-Data or a 2G connection: nothing downloads in the background; a video loads when someone asks for it
  const lightData = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || "")));
  const videoReady = new Map(); // src -> object URL (or the plain src when fetching isn't possible, e.g. file://)
  const videoJobs = new Map();  // src -> promise of the above
  const streamed = new Set();   // opened before its turn came: it streams instead, so the queue skips it
  let videoQueue = Promise.resolve(), videoActive = null;
  const loadVideo = (src) => {
    if (!videoJobs.has(src)) {
      const job = videoQueue.then(() => {
        if (streamed.has(src)) return src;
        videoActive = src;
        return fetch(src).then(r => r.ok ? r.blob() : Promise.reject(r.status))
          .then(b => URL.createObjectURL(b.type ? b : new Blob([b], { type: "video/mp4" })))
          .catch(() => src);
      }).then(url => { videoActive = null; videoReady.set(src, url); return url; });
      videoJobs.set(src, job);
      videoQueue = job; // one download at a time, in the order they were asked for
    }
    return videoJobs.get(src);
  };
  const preloadVideos = (projects) => { if (!lightData) projects.forEach(p => p.video && loadVideo(p.video.src)); };

  // featured cards: resting the pointer on one plays its demo in the card's phone
  if (canHover && !reduceMotion) {
    $$(".project.featured").forEach(card => {
      const p = PROJECTS.find(x => x.slug === $("[data-open]", card).dataset.open);
      const v = $(".card-vid", card);
      if (!p?.video || !v) return;
      let hovering = false;
      card.addEventListener("mouseenter", () => {
        hovering = true;
        const play = (url) => {
          if (!hovering) return;
          if (v.getAttribute("src") !== url) v.src = url;
          v.play().then(() => { if (hovering) v.classList.add("on"); }).catch(() => {});
        };
        if (videoReady.has(p.video.src)) play(videoReady.get(p.video.src));
        else if (videoActive === p.video.src) loadVideo(p.video.src).then(play);
        else play(p.video.src);
      });
      card.addEventListener("mouseleave", () => {
        hovering = false;
        v.classList.remove("on");
        setTimeout(() => { if (!hovering) { v.pause(); v.currentTime = 0; } }, 450);
      });
    });
  }

  /* ---------- case study modal (deep-linked: #/slug) ---------- */
  const caseEl = $("#case"), caseBox = $(".case-box", caseEl), caseBody = $("#case-body"), casePath = $("#case-path");
  let caseIdx = -1, caseFocus = null, openedHere = false;

  const fsIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>`;
  const playIcon = `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`;
  // portrait demos play inside a phone; the landscape explainer gets a wide screen
  const stageHTML = (p) => {
    // no video: the app's own screen in a phone, or the console picture / drawn art in a window
    if (!p.video && p.screens) return `<div class="still still-phone"><div class="phone"><img src="${p.screens[0].src}" alt="${escHtml(p.screens[0].alt)}" decoding="async"></div></div>`;
    if (!p.video && (p.image || p.art)) return `<div class="still still-wide">${miniWin(p)}</div>`;
    if (!p.video) return "";
    const v = p.video;
    return `<div class="player ${v.wide ? "player-wide" : "player-phone"} paused">
      <div class="${v.wide ? "screen" : "phone"}">
        <video muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback poster="${v.poster}" data-src="${v.src}" aria-label="${escHtml(p.name)} demo"></video>
        <button class="player-toggle" type="button" aria-label="Play demo">${playIcon}</button>
        ${v.wide ? `<button class="player-fs" type="button" aria-label="Watch full screen">${fsIcon}</button>` : ""}
      </div>
      <div class="player-bar" aria-hidden="true"><i></i></div>
    </div>`;
  };
  const infoHTML = (p) => {
    const chips = [...(p.platforms || []), ...(p.badges || [])].map(c => `<span class="case-chip">${escHtml(c)}</span>`).join("")
      + p.categories.map(c => `<span class="case-chip dim">#${c}</span>`).join("");
    const live = p.live ? `<a class="btn btn-primary" href="${p.live}" target="_blank" rel="noopener"><span>live demo</span><span aria-hidden="true">↗</span></a>` : "";
    const dl = p.download ? `<a class="btn btn-primary" href="${p.download.href}" rel="noopener"><span>${escHtml(p.download.label)}</span><span aria-hidden="true">↓</span></a>` : "";
    const qr = p.download?.qr ? `<figure class="qr"><img src="${p.download.qr}" alt="QR code linking to the APK download" width="120" height="120"><figcaption>scan to install on Android</figcaption></figure>` : "";
    return `<div class="case-info">
      <div class="case-chips">${chips}</div>
      <h2 class="case-title" id="case-title">${escHtml(p.name)}</h2>
      <p class="case-tagline">${escHtml(p.tagline)}</p>
      <h3 class="case-h">overview</h3>
      <p class="case-desc">${escHtml(p.description)}</p>
      ${p.highlights ? `<h3 class="case-h">highlights</h3>${highlights(p)}` : ""}
      <h3 class="case-h">architecture</h3>
      <p class="case-arch">${p.architecture.split(" · ").map(a => `<span>${escHtml(a[0].toUpperCase() + a.slice(1))}</span>`).join("")}</p>
      <h3 class="case-h">stack</h3>
      <ul class="project-stack">${p.stack.map(s => `<li>${escHtml(s)}</li>`).join("")}</ul>
      <div class="case-actions">${live}${dl}<a class="btn btn-primary" href="mailto:tanzeelhussain346@gmail.com?subject=${encodeURIComponent("About " + p.name)}"><span>email me about ${escHtml(p.name)}</span><span aria-hidden="true">→</span></a>${p.repo ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noopener">${ghIcon}<span>source code</span><span aria-hidden="true">↗</span></a>` : `<a class="btn btn-ghost" href="${gh}" target="_blank" rel="noopener">${ghIcon}<span>more on GitHub</span><span aria-hidden="true">↗</span></a>`}</div>
      ${qr}
      <p class="case-more"><a href="assets/Tanzeel_Hussain_Resume.pdf" download="Tanzeel_Hussain_Resume.pdf">resume ↓</a><a href="#contact" data-contact>get in touch</a></p>
    </div>`;
  };
  // player: tap/click or Space toggles, a thin progress line tracks playback
  let barRaf = 0, playerToggle = null;
  const wirePlayer = () => {
    cancelAnimationFrame(barRaf);
    playerToggle = null;
    const player = $(".player", caseBody);
    if (!player) return;
    const v = $("video", player), btn = $(".player-toggle", player), bar = $(".player-bar i", player);
    const sync = () => {
      player.classList.toggle("paused", v.paused);
      btn.setAttribute("aria-label", v.paused ? "Play demo" : "Pause demo");
    };
    const tick = () => {
      if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
      barRaf = requestAnimationFrame(tick);
    };
    playerToggle = () => (v.paused ? v.play().catch(() => {}) : v.pause());
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("playing", () => player.classList.add("ready"));
    v.addEventListener("waiting", () => player.classList.remove("ready"));
    v.addEventListener("click", playerToggle);
    btn.addEventListener("click", playerToggle);
    // the landscape explainer is small on a portrait phone: full screen turns it sideways to fill the display
    $(".player-fs", player)?.addEventListener("click", () => {
      if (v.requestFullscreen) v.requestFullscreen().then(() => screen.orientation?.lock?.("landscape")).catch(() => {});
      else v.webkitEnterFullscreen?.(); // iPhone Safari only lets the video element itself go full screen
      v.play().catch(() => {});
    });
    tick();
    // already downloaded: plays at once; downloading right now: wait for it; queued behind others: stream it instead
    const src = v.dataset.src, autoplay = () => { if (!reduceMotion) v.play().catch(sync); };
    if (videoReady.has(src)) { v.src = videoReady.get(src); autoplay(); }
    else if (videoActive === src) {
      player.classList.add("loading");
      loadVideo(src).then(url => { if (!v.isConnected) return; player.classList.remove("loading"); v.src = url; autoplay(); });
    } else { streamed.add(src); v.src = src; autoplay(); }
  };
  const renderCase = (i, dir = 0) => {
    const p = PROJECTS[i];
    caseIdx = i;
    casePath.textContent = `~/projects/${p.slug}`;
    $$("video", caseBody).forEach(v => v.pause());
    const stage = stageHTML(p);
    caseBody.innerHTML = (stage ? `<div class="case-stage">${stage}</div>` : "") + infoHTML(p);
    caseBody.classList.toggle("no-stage", !stage);
    caseBody.classList.toggle("wide-stage", !!p.video?.wide || (!p.video && !p.screens && !!(p.image || p.art)));
    // slide the new project in from the side it came from
    caseBody.classList.remove("swap");
    if (dir && !reduceMotion) { caseBody.style.setProperty("--dir", dir); void caseBody.offsetWidth; caseBody.classList.add("swap"); }
    caseBox.scrollTop = 0;
    wirePlayer();
    // name the neighbours so ← → say where they lead
    [["#case-prev", -1, "Previous"], ["#case-next", 1, "Next"]].forEach(([id, d, word]) => {
      const n = PROJECTS[(i + d + PROJECTS.length) % PROJECTS.length].name;
      $(id).setAttribute("aria-label", `${word} project: ${n}`);
      $(id).title = n;
    });
  };
  let closeTimer = 0;
  const showCase = (slug, dir = 0) => {
    const i = PROJECTS.findIndex(p => p.slug === slug);
    if (i < 0) return hideCase();
    clearTimeout(closeTimer);
    if (caseEl.hidden) { caseFocus = document.activeElement; caseEl.hidden = false; document.dispatchEvent(new CustomEvent("case:toggle", { detail: true })); }
    caseEl.classList.remove("closing");
    body.classList.add("no-scroll");
    renderCase(i, dir);
    caseBox.focus({ preventScroll: true });
  };
  const hideCase = (instant = false) => {
    if (caseEl.hidden || caseEl.classList.contains("closing")) return;
    document.dispatchEvent(new CustomEvent("case:toggle", { detail: false }));
    cancelAnimationFrame(barRaf);
    $$("video", caseBody).forEach(v => v.pause());
    body.classList.remove("no-scroll");
    caseFocus?.focus?.({ preventScroll: true });
    const done = () => { caseEl.hidden = true; caseEl.classList.remove("closing"); caseBody.innerHTML = ""; }; // drops in-flight media
    if (reduceMotion || instant) return done();
    caseEl.classList.add("closing"); // plays the exit animation, then hides
    closeTimer = setTimeout(done, 240);
  };
  const openCase = (slug) => {
    if (location.hash === "#/" + slug) return showCase(slug);
    openedHere = true;
    location.hash = "/" + slug; // → hashchange → route()
  };
  /* shared-element morph: the phone on a featured card (or in the hero) flies into the case study and back
     (View Transitions API; browsers without it get the regular open/close animation) */
  const canMorph = !!document.startViewTransition && !reduceMotion;
  const cardPhone = (slug) => $(`.project [data-open="${slug}"]`)?.closest(".project")?.querySelector(".phone-sm");
  const onScreen = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
  const leaveCaseHistory = () => {
    if (openedHere) { openedHere = false; history.back(); } // pops #/slug → route() hides
    else history.replaceState(null, "", location.pathname + location.search);
  };
  // where the case study flies back to: the hero phone if it came from there and is still in view, else the card
  let morphHome = null;
  const phoneFor = (slug) => (morphHome?.slug === slug && onScreen(morphHome.el)) ? morphHome.el : cardPhone(slug);
  const closeCase = () => {
    const from = $(".player-phone .phone, .still-phone .phone", caseBody), to = PROJECTS[caseIdx] && phoneFor(PROJECTS[caseIdx].slug);
    morphHome = null;
    if (canMorph && from && onScreen(to)) {
      document.startViewTransition(() => {
        hideCase(true);
        to.style.viewTransitionName = "demo-phone";
        leaveCaseHistory(); // route() then finds the case already hidden
      }).finished.finally(() => { to.style.viewTransitionName = ""; });
      return;
    }
    leaveCaseHistory();
    hideCase();
  };
  const stepCase = (d) => {
    const p = PROJECTS[(caseIdx + d + PROJECTS.length) % PROJECTS.length];
    history.replaceState(null, "", location.href.split("#")[0] + "#/" + p.slug); // swap without stacking history entries
    showCase(p.slug, d);
  };
  const route = () => {
    const m = location.hash.match(/^#\/([\w-]+)$/);
    if (m) showCase(m[1]); else hideCase();
  };
  addEventListener("hashchange", route);
  const morphOpen = (slug, fromEl, fromHero = false) => {
    morphHome = fromHero ? { slug, el: fromEl } : null;
    if (!canMorph || !onScreen(fromEl) || location.hash === "#/" + slug) return openCase(slug);
    fromEl.style.viewTransitionName = "demo-phone"; // the case study's phone carries the same name
    document.startViewTransition(() => {
      fromEl.style.viewTransitionName = "";
      openedHere = true;
      history.pushState(null, "", location.href.split("#")[0] + "#/" + slug);
      showCase(slug);
    });
  };
  $("#project-grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) morphOpen(b.dataset.open, cardPhone(b.dataset.open));
  });
  $$("[data-close]", caseEl).forEach(b => b.addEventListener("click", closeCase));
  // "get in touch" inside a case study: close it, then land on the contact section
  caseBody.addEventListener("click", (e) => {
    if (!e.target.closest("[data-contact]")) return;
    e.preventDefault();
    closeCase();
    setTimeout(() => scrollToId("contact"), reduceMotion ? 0 : 280);
  });
  $("#case-prev").addEventListener("click", () => stepCase(-1));
  $("#case-next").addEventListener("click", () => stepCase(1));
  caseEl.addEventListener("keydown", (e) => {
    e.stopPropagation(); // global shortcuts stay off while the case study is open
    if (e.key === "Escape") { closeCase(); return; }
    if (e.key === " " && playerToggle && !e.target.closest("a, button")) { e.preventDefault(); playerToggle(); return; }
    if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !e.target.closest("input, textarea")) {
      e.preventDefault(); stepCase(e.key === "ArrowRight" ? 1 : -1); return;
    }
    if (e.key === "Tab") { // focus trap
      const f = $$("a[href], button:not([disabled]), [tabindex='0'], video[controls]", caseBox).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === caseBox)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  route(); // honour a deep link on load

  /* ---------- hero showcase: a 3D phone that cycles through the apps ---------- */
  const showcaseEl = $("#showcase");
  if (showcaseEl) {
    const apps = PROJECTS.filter(p => p.showcase && p.screens?.length);
    const device = $("#device"), stage = $(".showcase-stage", showcaseEl), screenEl = $(".device-screen", showcaseEl);
    const layers = $$(".scr", showcaseEl), vid = $(".scr-video", showcaseEl), notes = $$(".showcase-note", showcaseEl);
    const nowEl = $(".showcase-now", showcaseEl), nameEl = $("#showcase-name"), dotsEl = $(".showcase-dots", showcaseEl);
    const pauseBtn = $(".showcase-pause", showcaseEl);
    const STEP = 1800, DWELL = 15000, PICTURE = 3500; // a screen changes every STEP; an app stays DWELL (a screens app: one pass, at least PICTURE)
    const icons = { ...(window.SKILL_ICONS || {}), ...(window.UI_ICONS || {}) };
    // one floating note per thing the app is built with or uses (projects.js "uses")
    const notesFor = (p) => (p.uses || []).slice(0, notes.length);
    const dwellFor = (p) => p.showcase === "screens" ? Math.max(p.screens.length * STEP, PICTURE) : DWELL;
    const wantsVideo = (p) => p.showcase === "video" && !!p.video && !reduceMotion && !lightData;

    let ai = 0, front = 0, shown = 0, started = false, userPaused = false, videoOn = false, chosen = false;
    let appSeq = 0, screenSeq = 0, clock = 0, heldAt = 0, loopT = 0;
    const holds = new Set(); // why the rotation is waiting: "offscreen", "hidden", "case"
    if (!caseEl.hidden) holds.add("case"); // opened on a deep link
    const running = () => started && !userPaused && holds.size === 0;

    dotsEl.innerHTML = apps.map(p => `<button type="button" aria-label="${escHtml(p.name)}"></button>`).join("");
    const dots = $$("button", dotsEl);

    // a screen slides in from the right as the last one leaves to the left, like moving forward in the app
    const showScreen = async (i, instant = false) => {
      const mine = ++screenSeq, cur = layers[front], back = layers[1 - front];
      back.classList.add("reset"); back.classList.remove("on", "off");
      back.src = apps[ai].screens[i].src;
      try { await back.decode(); } catch {}
      if (mine !== screenSeq) return; // a newer screen or app took over
      if (instant) {
        cur.classList.add("reset"); cur.classList.remove("on", "off");
        back.classList.add("on");
        requestAnimationFrame(() => back.classList.remove("reset"));
      } else {
        void back.offsetWidth; back.classList.remove("reset");
        cur.classList.remove("on"); cur.classList.add("off");
        back.classList.add("on");
      }
      front = 1 - front;
    };
    const restartClock = () => {
      clock = performance.now(); heldAt = running() ? 0 : clock;
      const d = dots[ai]; d.removeAttribute("aria-current"); void d.offsetWidth; d.setAttribute("aria-current", "true"); // refill
    };
    const stopVideo = () => {
      videoOn = false; vid.classList.remove("on"); vid.pause();
      if (vid.getAttribute("src")) { vid.removeAttribute("src"); vid.load(); }
    };
    const startVideo = (p, mine) => loadVideo(p.video.src).then(url => {
      if (mine !== appSeq) return;
      vid.addEventListener("playing", () => {
        if (mine !== appSeq) return;
        videoOn = true; vid.classList.add("on"); restartClock(); // the app gets its full time from the moment the video runs
      }, { once: true });
      vid.src = url;
      if (running()) vid.play().catch(() => {});
    });
    const setNotes = (p, animate) => {
      const list = notesFor(p);
      const apply = () => notes.forEach((n, j) => {
        const note = list[j];
        n.style.display = note ? "" : "none";
        if (note) n.innerHTML = (icons[note.icon] || "") + `<span>${escHtml(note.label)}</span>`;
        n.classList.remove("swap");
      });
      if (!animate) return apply();
      notes.forEach(n => n.classList.add("swap"));
      const seqAt = appSeq;
      setTimeout(() => { if (seqAt === appSeq) apply(); }, 320); // a newer switch brings its own notes
    };
    const go = (i, manual = false, initial = false) => {
      const mine = ++appSeq;
      if (manual) chosen = true;
      ai = (i + apps.length) % apps.length;
      const p = apps[ai];
      nowEl.setAttribute("aria-live", manual ? "polite" : "off"); // announce choices, not the automatic rotation
      nameEl.textContent = p.name;
      if (!initial) { nameEl.classList.remove("in"); void nameEl.offsetWidth; nameEl.classList.add("in"); }
      device.setAttribute("aria-label", `Open the ${p.name} case study`);
      dots.forEach((d, j) => { if (j !== ai) d.removeAttribute("aria-current"); d.classList.toggle("done", j < ai); });
      showcaseEl.style.setProperty("--dwell", dwellFor(p) + "ms");
      setNotes(p, !initial);
      stopVideo();
      shown = 0;
      if (initial) layers[front].src = p.screens[0].src;
      else if (reduceMotion) showScreen(0, true);
      else {
        screenEl.classList.add("switching"); device.classList.add("turn");
        setTimeout(() => {
          device.classList.remove("turn");
          if (mine !== appSeq) return;
          showScreen(0, true).then(() => { if (mine === appSeq) screenEl.classList.remove("switching"); });
        }, 280);
      }
      restartClock();
      if (wantsVideo(p)) startVideo(p, mine);
      loop();
    };
    const loop = () => {
      clearTimeout(loopT);
      if (!running()) return;
      const p = apps[ai], t = performance.now() - clock;
      if (t >= dwellFor(p)) return go(ai + 1);
      if (!videoOn) { // screens app, or a video app while its video is still on the way
        const i = Math.floor(t / STEP) % p.screens.length;
        if (i !== shown) { shown = i; showScreen(i); }
      }
      loopT = setTimeout(loop, 200);
    };
    // pausing (by the visitor, or because nobody can see it) freezes the clock, the video and the dot's fill
    const sync = () => {
      const run = running();
      showcaseEl.classList.toggle("is-paused", !run);
      if (run) {
        if (heldAt) { clock += performance.now() - heldAt; heldAt = 0; }
        if (vid.getAttribute("src") && vid.paused && !vid.ended) vid.play().catch(() => {});
        loop();
      } else {
        if (!heldAt) heldAt = performance.now();
        clearTimeout(loopT); vid.pause();
      }
    };
    const hold = (why, on) => { if (on) holds.add(why); else holds.delete(why); sync(); };
    vid.addEventListener("ended", () => { if (videoOn && running()) go(ai + 1); });

    dots.forEach((d, j) => d.addEventListener("click", () => { if (j !== ai) go(j, true); }));
    pauseBtn.addEventListener("click", () => {
      userPaused = !userPaused;
      showcaseEl.classList.toggle("user-paused", userPaused);
      pauseBtn.setAttribute("aria-label", userPaused ? "Play the showcase" : "Pause the showcase");
      sync();
    });
    $$(".showcase-step", showcaseEl).forEach(b => b.addEventListener("click", () => go(ai + +b.dataset.step, true)));
    // ←/→ switch apps whenever the phone is on screen: not while typing, or with a case study or the palette open
    document.addEventListener("keydown", (e) => {
      if ((e.key !== "ArrowLeft" && e.key !== "ArrowRight") || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (holds.has("offscreen") || holds.has("case") || !$("#palette").hidden || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      e.preventDefault(); go(ai + (e.key === "ArrowRight" ? 1 : -1), true);
    });
    // swipe the phone sideways to change app; a tap opens that app's case study (the phone flies into it)
    let downX = 0, downY = 0, swiped = false;
    device.addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; swiped = false; });
    device.addEventListener("pointerup", (e) => {
      const dx = e.clientX - downX, dy = e.clientY - downY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { swiped = true; go(ai + (dx < 0 ? 1 : -1), true); }
    });
    device.addEventListener("click", (e) => {
      if (swiped) { swiped = false; e.preventDefault(); return; }
      morphOpen(apps[ai].slug, screenEl, true);
    });
    // the phone turns toward the pointer anywhere over the hero; the notes drift the other way
    if (canHover && !reduceMotion) {
      const hero = $(".hero");
      let px = 0, py = 0, raf = 0;
      const tilt = () => {
        raf = 0;
        device.style.setProperty("--tx", (px * 14).toFixed(2) + "deg");
        device.style.setProperty("--ty", (-py * 9).toFixed(2) + "deg");
        device.style.setProperty("--gx", (64 - px * 40).toFixed(1) + "%");
        stage.style.setProperty("--px", px.toFixed(3)); stage.style.setProperty("--py", py.toFixed(3));
      };
      hero.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        px = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 1.2)));
        py = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 1.2)));
        if (!raf) raf = requestAnimationFrame(tilt);
      });
      hero.addEventListener("pointerleave", () => { px = py = 0; if (!raf) raf = requestAnimationFrame(tilt); });
    }
    new IntersectionObserver(([e]) => hold("offscreen", !e.isIntersecting), { threshold: .2 }).observe(showcaseEl);
    document.addEventListener("visibilitychange", () => hold("hidden", document.hidden));
    document.addEventListener("case:toggle", (e) => hold("case", e.detail));

    showcaseStart = () => {
      if (started) return;
      started = true;
      if (!chosen) go(0, false, true); // someone who already picked an app before the start keeps it
      sync();
      // the hero's videos first, in lineup order; then the ones only the case studies play:
      // straight away on desktop, and on touch screens once the projects are about a screen away
      preloadVideos(apps.filter(wantsVideo));
      const rest = PROJECTS.filter(p => p.video && !(apps.includes(p) && wantsVideo(p)));
      const later = () => preloadVideos(rest);
      if (!isTouch) "requestIdleCallback" in window ? requestIdleCallback(later, { timeout: 4000 }) : setTimeout(later, 2000);
      else {
        const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); later(); } }, { rootMargin: "100% 0px" });
        near.observe($("#projects"));
      }
    };
  }

  /* ---------- motion: nav indicator, magnetic buttons, hero depth ---------- */
  // one pill glides between nav links: it follows hover and settles on the active section
  const ink = document.createElement("span");
  ink.className = "nav-ink";
  navLinks.prepend(ink);
  const moveInk = (a) => {
    if (!a) { ink.style.opacity = "0"; return; }
    ink.style.opacity = "1";
    ink.style.width = a.offsetWidth + "px";
    ink.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const activeLink = () => $("a.active:not(.nav-cv)", navLinks);
  $$("a:not(.nav-cv)", navLinks).forEach(a => a.addEventListener("mouseenter", () => moveInk(a)));
  navLinks.addEventListener("mouseleave", () => moveInk(activeLink()));
  new MutationObserver(() => moveInk(activeLink())).observe(navLinks, { subtree: true, attributes: true, attributeFilter: ["class"] });
  addEventListener("resize", () => moveInk(activeLink()), { passive: true });

  if (!isTouch && !reduceMotion) {
    // buttons lean toward the cursor, then spring back
    $$(".btn, .hero-socials a, .icon-btn, .nav-cv").forEach(el => {
      el.classList.add("magnetic");
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px, ${(e.clientY - r.top - r.height / 2) * .4}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  if (!reduceMotion) {
    // hero depth: the copy lifts and fades, the phone tips back and sinks as you scroll away
    const heroCopy = $(".hero-copy"), heroVisual = $(".hero-visual"), hint = $(".scroll-hint");
    let depthQueued = false, visualReady = false;
    // the showcase is a reveal element: take over its transform only once its entrance has finished
    heroVisual.addEventListener("transitionend", (e) => {
      if (e.target !== heroVisual || visualReady || !heroVisual.classList.contains("in")) return;
      visualReady = true;
      heroVisual.style.transition = "none";
      depth();
    });
    // the phone only starts to sink once it scrolls past the middle of the screen: on one-column layouts
    // it sits below the copy, and it shouldn't already be fading when someone scrolls down to look at it
    let visualStart = 0;
    const measure = () => {
      let y = 0;
      for (let n = heroVisual; n; n = n.offsetParent) y += n.offsetTop; // offsets ignore the transform applied below
      visualStart = Math.max(0, y + heroVisual.offsetHeight / 2 - innerHeight / 2);
    };
    const depth = () => {
      depthQueued = false;
      const p = Math.min(scrollY / innerHeight, 1), q = Math.min(Math.max((scrollY - visualStart) / innerHeight, 0), 1);
      if (p >= 1 && q >= 1 && heroCopy.dataset.parked) return;
      heroCopy.dataset.parked = p >= 1 && q >= 1 ? "1" : "";
      heroCopy.style.transform = `translateY(${-p * 70}px)`;
      heroCopy.style.opacity = String(1 - p * .85);
      if (visualReady) {
        heroVisual.style.transform = `perspective(1200px) translateY(${q * 90}px) rotateX(${q * 16}deg) scale(${1 - q * .08})`;
        heroVisual.style.opacity = String(1 - q * .7);
      }
      if (hint) hint.style.opacity = String(Math.max(0, .6 - p * 3));
    };
    addEventListener("scroll", () => { if (!depthQueued) { depthQueued = true; requestAnimationFrame(depth); } }, { passive: true });
    addEventListener("resize", () => { measure(); depth(); }, { passive: true });
    addEventListener("load", () => { measure(); depth(); }); // fonts and images settle the layout
    measure();
    depth();
  }

  // expose for part 2
  window.__pf = { $, $$, toast, scrollToId, copy, setFilter, reduceMotion, runBoot, startHero, openCase, PROJECTS };
})();

/* ============================================================
   PART 2 — terminal · command palette · easter eggs
   ============================================================ */
(() => {
  "use strict";
  const { $, $$, toast, scrollToId, copy, setFilter, reduceMotion, runBoot, openCase, PROJECTS } = window.__pf;
  const body = document.body;

  /* ---------- interactive terminal ---------- */
  const termBody = $("#term-body"), termForm = $("#term-form"), termIn = $("#term-in");
  const history = []; let hIdx = -1;
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const print = (html, cls = "term-out") => {
    const d = document.createElement("div");
    d.className = "term-line " + cls; d.innerHTML = html;
    termBody.appendChild(d); termBody.scrollTop = termBody.scrollHeight;
  };
  const echoCmd = (cmd) => print(`<span class="term-ps1">tanzeel@portfolio</span>:<span class="term-path">~</span>$ ${esc(cmd)}`, "term-cmd");

  const files = {
    "about.txt": "Software Engineering student and Flutter developer from Faisalabad, Pakistan.\nBuilds clean, AI-ready mobile apps: Clean Architecture, Riverpod/BLoC, Firebase and Supabase.\nCompleted an 8-week remote Flutter internship at FlutterCraft.app; freelances on Fiverr.\nOpen to Flutter roles and freelance work.",
    "experience.txt":
      "Jul–Aug 2026  Flutter Developer Intern · FlutterCraft.app (remote, 8 weeks, completed)\n" +
      "ongoing       Freelance Flutter Developer · Fiverr (remote, contract)\n" +
      "2024–2028     BS Software Engineering · FAST-NUCES Faisalabad",
    "skills.txt":
      "mobile     Flutter · Dart · Riverpod · Provider · Hive · Drift · Platform Channels · Material Design\n" +
      "arch       Clean Architecture · Layered · MVC · MVP · Repository Pattern · Feature-First · SOLID · GoF · OOP · UML\n" +
      "backend    Firebase Auth · Firestore · Realtime Database · REST APIs · Cloudflare Workers · Cloud Run · PostgreSQL · FastAPI\n" +
      "ai         Antigravity · Cursor · Claude Code · Google Stitch · OpenRouter · Postman · LLMs · Prompt Engineering\n" +
      "languages  SQL · Dart · C++ · Java · Python\n" +
      "tools      Git · GitHub · VS Code · Android Studio · Docker",
    "contact.txt": "email:    tanzeelhussain346@gmail.com\nphone:    +92 370 4905558\nlinkedin: linkedin.com/in/tanzeel-hussain-176a93327\ngithub:   github.com/f243077-cell",
    ".secret": "You found it. Try the Konami code on the page: ↑ ↑ ↓ ↓ ← → ← → B A",
  };
  const slugs = PROJECTS.map(p => p.slug);
  const firstSentence = (s) => { // trimmed at a word boundary, never mid-word
    const t = s.split(/(?<=\.)\s/)[0];
    return t.length > 64 ? t.slice(0, t.lastIndexOf(" ", 63)).replace(/[,;:·\s]+$/, "") + "…" : t;
  };
  const listProjects = () => print(PROJECTS.map(p => `<b>${p.slug.padEnd(20)}</b>${esc(firstSentence(p.description))}`).join("\n") + `\n\nType <b>open &lt;name&gt;</b> for a case study.`);

  const commands = {
    help: () => print(
      `Available commands:\n` +
      `  <b>help</b>            show this list\n` +
      `  <b>ls</b> [projects]   list files, or my projects\n` +
      `  <b>open</b> &lt;project&gt;  open a case study (try <b>open bioguard</b>)\n` +
      `  <b>cat</b> &lt;file&gt;      read a file (try <b>cat about.txt</b>)\n` +
      `  <b>whoami</b>          who am I?\n` +
      `  <b>experience</b>      where I've worked and studied\n` +
      `  <b>skills</b>          what I work with\n` +
      `  <b>contact</b>         how to reach me\n` +
      `  <b>resume</b>          download my CV (PDF)\n` +
      `  <b>goto</b> &lt;section&gt;  scroll to about / experience / skills / projects / contact\n` +
      `  <b>neofetch</b>        system info\n` +
      `  <b>clear</b>           clear the terminal`
    ),
    ls: (args) => {
      if (/^projects\/?$/.test(args[0] || "")) return listProjects();
      print(["<b>projects/</b>", ...Object.keys(files).filter(f => args[0] === "-a" || !f.startsWith(".")).map(f => `<b>${f}</b>`)].join("  "));
    },
    open: (args) => {
      const slug = (args[0] || "").toLowerCase().replace(/^projects\//, "");
      if (!slugs.includes(slug)) return print(`open: ${slug ? `no project "${esc(slug)}"` : "missing project"}. Try: ${slugs.join(", ")}`, "term-err");
      print(`opening ${slug}…`, "term-ok");
      openCase(slug);
    },
    cat: (args) => {
      if (!args[0]) return print("cat: missing file operand", "term-err");
      const f = files[args[0]];
      f ? print(esc(f)) : print(`cat: ${esc(args[0])}: No such file or directory`, "term-err");
    },
    resume: () => { print("downloading Tanzeel_Hussain_Resume.pdf…", "term-ok"); downloadCV(); },
    whoami: () => print("<b>Tanzeel Hussain</b>: Flutter developer and Software Engineering student at FAST-NUCES Faisalabad. Open to Flutter roles and freelance work."),
    experience: () => print(esc(files["experience.txt"])),
    skills: () => print(esc(files["skills.txt"])),
    projects: () => { listProjects(); scrollToId("projects"); },
    contact: () => print(
      `email:    <a href="mailto:tanzeelhussain346@gmail.com">tanzeelhussain346@gmail.com</a>\n` +
      `phone:    <a href="tel:+923704905558">+92 370 4905558</a>\n` +
      `linkedin: <a href="https://linkedin.com/in/tanzeel-hussain-176a93327" target="_blank" rel="noopener">linkedin.com/in/tanzeel-hussain-176a93327</a>\n` +
      `github:   <a href="https://github.com/f243077-cell" target="_blank" rel="noopener">github.com/f243077-cell</a>`
    ),
    goto: (args) => {
      const ok = ["about", "experience", "skills", "projects", "contact", "top"];
      if (!ok.includes(args[0])) return print(`goto: unknown section. Options: ${ok.join(", ")}`, "term-err");
      scrollToId(args[0]); print(`→ ${args[0]}`, "term-ok");
    },
    date: () => print(new Date().toString()),
    echo: (args) => print(esc(args.join(" "))),
    pwd: () => print("/home/tanzeel/portfolio"),
    neofetch: () => print(
      `<span class="term-ok">        ___      </span>  <b>tanzeel</b>@<b>portfolio</b>\n` +
      `<span class="term-ok">       (o o)     </span>  ------------------\n` +
      `<span class="term-ok">      (  V  )    </span>  OS:       tanzeel.sh (web)\n` +
      `<span class="term-ok">     /--m-m--\\   </span>  Stack:    Flutter · Riverpod · Firebase · Supabase\n` +
      `<span class="term-ok">                 </span>  Editor:   VS Code · Android Studio\n` +
      `<span class="term-ok">                 </span>  Projects: ${PROJECTS.length}\n` +
      `<span class="term-ok">                 </span>  Uptime:   ${Math.round(performance.now() / 1000)}s`
    ),
    sudo: () => print("tanzeel is not in the sudoers file. This incident will be reported. 🚨", "term-err"),
    rm: () => print("rm: nice try. 🙂", "term-err"),
    exit: () => print("There is no escape. Scroll instead."),
    clear: () => { termBody.innerHTML = ""; },
    konami: () => print("↑ ↑ ↓ ↓ ← → ← → B A — on the page, not here."),
  };
  commands["?"] = commands.help;
  const run = (raw) => {
    const line = raw.trim(); if (!line) return;
    history.unshift(line); hIdx = -1;
    echoCmd(line);
    const [cmd, ...args] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    fn ? fn(args) : print(`${esc(cmd)}: command not found. Type <b>help</b>.`, "term-err");
  };
  termForm.addEventListener("submit", (e) => { e.preventDefault(); run(termIn.value); termIn.value = ""; });
  termIn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx < history.length - 1) termIn.value = history[++hIdx]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); termIn.value = hIdx > 0 ? history[--hIdx] : (hIdx = -1, ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const v = termIn.value.trim();
      const [c, a] = v.split(/\s+/);
      const args = c === "open" ? slugs : c === "ls" ? ["projects", "-a"] : Object.keys(files);
      const pool = a !== undefined ? args.map(f => `${c} ${f}`) : Object.keys(commands);
      const m = pool.filter(p => p.startsWith(v));
      if (m.length === 1) termIn.value = m[0]; else if (m.length > 1) print(m.join("  "));
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); commands.clear(); }
  });
  $("#terminal").addEventListener("click", (e) => { if (!e.target.closest("a")) termIn.focus({ preventScroll: true }); });
  window.__pf.termRun = run;

  /* ---------- command palette ---------- */
  const palette = $("#palette"), pInput = $("#palette-input"), pList = $("#palette-list");
  const downloadCV = () => { const a = document.createElement("a"); a.href = "assets/Tanzeel_Hussain_Resume.pdf"; a.download = "Tanzeel_Hussain_Resume.pdf"; a.click(); };
  const showFilter = (f) => () => { setFilter(f); scrollToId("projects"); };
  const actions = [
    { g: "Navigate", i: "top", l: "Go to top", s: "Back to the hero", k: "g h", run: () => scrollToId("top") },
    { g: "Navigate", i: "about", l: "About", s: "Who I am", k: "g a", run: () => scrollToId("about") },
    { g: "Navigate", i: "experience", l: "Experience", s: "Internship, freelance and education", k: "g e", run: () => scrollToId("experience") },
    { g: "Navigate", i: "skills", l: "Skills", s: "Skill globe, toolkit + terminal", k: "g s", run: () => scrollToId("skills") },
    { g: "Navigate", i: "projects", l: "Projects", s: "Apps and systems I've built", k: "g p", run: () => scrollToId("projects") },
    { g: "Navigate", i: "contact", l: "Contact", s: "Send me a message", k: "g c", run: () => scrollToId("contact") },
    ...PROJECTS.map(p => ({ g: "Projects", i: "project", l: p.name, s: "Open case study", run: () => openCase(p.slug) })),
    { g: "Actions", i: "resume", l: "Download resume", s: "Tanzeel_Hussain_Resume.pdf", run: downloadCV },
    { g: "Actions", i: "copy", l: "Copy email", s: "tanzeelhussain346@gmail.com", run: () => copy("tanzeelhussain346@gmail.com") },
    { g: "Actions", i: "github", l: "Open GitHub", s: "github.com/f243077-cell", run: () => open("https://github.com/f243077-cell", "_blank", "noopener") },
    { g: "Actions", i: "linkedin", l: "Open LinkedIn", s: "linkedin.com/in/tanzeel-hussain-176a93327", run: () => open("https://linkedin.com/in/tanzeel-hussain-176a93327", "_blank", "noopener") },
    { g: "Actions", i: "terminal", l: "Focus terminal", s: "Type commands in the shell", k: ">", run: () => { scrollToId("skills"); setTimeout(() => $("#term-in").focus({ preventScroll: true }), 600); } },
    { g: "Filter", i: "mobile", l: "Show mobile projects", s: "Filter: mobile", run: showFilter("mobile") },
    { g: "Filter", i: "ai", l: "Show AI projects", s: "Filter: ai", run: showFilter("ai") },
    { g: "Filter", i: "backend", l: "Show backend projects", s: "Filter: backend", run: showFilter("backend") },
    { g: "Filter", i: "systems", l: "Show systems projects", s: "Filter: systems", run: showFilter("systems") },
    { g: "Fun", i: "party", l: "Party mode", s: "You'll see", run: () => party() },
    { g: "Fun", i: "replay", l: "Replay boot sequence", s: "Watch the intro again", run: () => { try { sessionStorage.removeItem("booted"); } catch {} location.reload(); } },
  ];
  const uiIcons = window.UI_ICONS || {};
  let filtered = actions, sel = 0, pOpen = false;
  const fuzzy = (q, s) => {
    q = q.toLowerCase(); s = s.toLowerCase();
    if (!q) return 1;
    let qi = 0, score = 0;
    for (let i = 0; i < s.length && qi < q.length; i++) if (s[i] === q[qi]) { qi++; score += (i > 0 && s[i - 1] === " ") ? 3 : 1; }
    return qi === q.length ? score + (s.startsWith(q) ? 10 : 0) : 0;
  };
  const renderPalette = () => {
    const q = pInput.value.trim();
    filtered = actions.map(a => ({ a, sc: fuzzy(q, a.l + " " + a.s) })).filter(x => x.sc > 0).sort((x, y) => y.sc - x.sc).map(x => x.a);
    sel = Math.min(sel, Math.max(filtered.length - 1, 0));
    pList.innerHTML = "";
    if (!filtered.length) { pList.innerHTML = `<li class="empty">no results for "${esc(q)}"</li>`; return; }
    let lastG = null;
    filtered.forEach((a, i) => {
      if (!q && a.g !== lastG) { lastG = a.g; pList.insertAdjacentHTML("beforeend", `<li class="group" role="presentation">${a.g}</li>`); }
      const li = document.createElement("li");
      li.setAttribute("role", "option"); li.dataset.i = i; li.id = "pal-opt-" + i;
      li.innerHTML = `<span class="pi">${uiIcons[a.i] || ""}</span><span class="pl">${a.l}<small>${a.s}</small></span>${a.k ? `<span class="pk">${a.k}</span>` : ""}`;
      li.addEventListener("click", () => exec(i));
      li.addEventListener("mousemove", () => { if (sel !== i) { sel = i; markSel(); } });
      pList.appendChild(li);
    });
    markSel();
  };
  // the highlighted row is also what a screen reader announces
  const markSel = () => {
    $$("li[role=option]", pList).forEach(el => { const on = +el.dataset.i === sel; el.classList.toggle("sel", on); el.setAttribute("aria-selected", on); });
    pInput.setAttribute("aria-activedescendant", filtered.length ? "pal-opt-" + sel : "");
  };
  const openPalette = () => { pOpen = true; palette.hidden = false; body.classList.add("no-scroll"); pInput.value = ""; sel = 0; renderPalette(); setTimeout(() => pInput.focus(), 30); };
  const closePalette = () => { pOpen = false; palette.hidden = true; body.classList.remove("no-scroll"); };
  const exec = (i) => { const a = filtered[i]; if (!a) return; closePalette(); setTimeout(a.run, 60); };
  $("#open-palette").addEventListener("click", openPalette);
  $("#palette-backdrop").addEventListener("click", closePalette);
  pInput.addEventListener("input", () => { sel = 0; renderPalette(); });
  pInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % filtered.length; renderPalette(); scrollSel(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; renderPalette(); scrollSel(); }
    else if (e.key === "Enter") { e.preventDefault(); exec(sel); }
  });
  const scrollSel = () => pList.querySelector("li.sel")?.scrollIntoView({ block: "nearest" });

  /* ---------- global keyboard shortcuts ---------- */
  let chord = "", chordT;
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "") || document.activeElement?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pOpen ? closePalette() : openPalette(); return; }
    if (e.key === "Escape") { if (pOpen) closePalette(); return; }
    if (typing || pOpen || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "/") { e.preventDefault(); openPalette(); return; }
    if (e.key === ">") { scrollToId("skills"); setTimeout(() => $("#term-in").focus({ preventScroll: true }), 600); return; }
    // g-chords: g h / g a / g e / g s / g p / g c
    if (e.key === "g" && !chord) { chord = "g"; clearTimeout(chordT); chordT = setTimeout(() => chord = "", 900); return; }
    if (chord === "g") {
      const map = { h: "top", a: "about", e: "experience", s: "skills", p: "projects", c: "contact" };
      if (map[e.key]) { scrollToId(map[e.key]); toast("→ " + map[e.key], 900); }
      chord = "";
    }
  });

  /* ---------- konami / party mode ---------- */
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  const party = () => {
    if (reduceMotion) { toast("🎉 party mode (motion reduced)"); return; }
    body.classList.add("party");
    toast("🎉 party mode activated — you found the easter egg", 3000);
    confetti();
    setTimeout(() => body.classList.remove("party"), 6000);
  };
  document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
    if (kpos === konami.length) { kpos = 0; party(); }
  });
  const confetti = () => {
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 800, pointerEvents: "none" });
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const x = c.getContext("2d");
    const cols = ["#ff7f6b", "#67e8f9", "#fcd34d", "#f9a8d4", "#ffffff"];
    const ps = Array.from({ length: 160 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5,
      vx: (Math.random() - .5) * 3, vy: Math.random() * 3 + 2, s: Math.random() * 7 + 4,
      r: Math.random() * Math.PI, vr: (Math.random() - .5) * .2, col: cols[(Math.random() * cols.length) | 0],
    }));
    const t0 = performance.now();
    const step = (t) => {
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .04;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.col; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); x.restore();
      });
      if (t - t0 < 3800) requestAnimationFrame(step); else c.remove();
    };
    requestAnimationFrame(step);
  };

  /* ---------- console greeting ---------- */
  console.log("%c👋 hey, curious one.", "font-size:18px;font-weight:700;color:#ff7f6b");
  console.log("%cIf you're reading this, we'd probably get along. → tanzeelhussain346@gmail.com", "color:#a2bfbd");
  console.log("%cTry: Ctrl+K, the terminal in #skills, or the Konami code.", "color:#67e8f9");

  /* ---------- go ---------- */
  runBoot();
})();
