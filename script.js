/* ============================================================
   TANZEEL HUSSAIN · PORTFOLIO · script.js
   Section highlighting, the app spotlight, project cards and drawer,
   the skill globe, skill logos and the contact form.
   ============================================================ */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PROJECTS = window.PROJECTS || [];
  const EMAIL = "tanzeelhussain346@gmail.com";
  const RESUME = "assets/Tanzeel_Hussain_Resume.pdf";
  const GITHUB = "https://github.com/f243077-cell";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LABELS = { mobile: "Mobile", ai: "AI", backend: "Backend", systems: "Systems" };
  const icon = (id) => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  // run each feature on its own so one failure can't take the rest of the page down
  const safely = (fn) => { try { fn(); } catch (err) { console.error(err); } };

  /* ---------- small helpers ---------- */
  const toastEl = $("#toast");
  let toastT = 0;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };
  $$("[data-project-count]").forEach((el) => { el.textContent = PROJECTS.length; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- active section in the sidebar and tab bar ---------- */
  safely(() => {
    const links = $$(".topnav a, .tabbar a");
    const ids = ["overview", "about", "experience", "projects", "skills", "contact"];
    // the tab bar has no Experience tab, so it lights About while Experience is on screen
    const tabFor = { experience: "about" };
    const setActive = (id) => links.forEach((a) => {
      const target = a.getAttribute("href").slice(1);
      const inTabbar = !!a.closest(".tabbar");
      a.classList.toggle("active", target === id || (inTabbar && target === tabFor[id]));
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ids.forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    setActive("overview");
  });

  /* ---------- reveal panels as they scroll in ---------- */
  safely(() => {
    const els = $$(".panel, .stats > *, .intro, .spot");
    els.forEach((el) => el.classList.add("rv"));
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .08, rootMargin: "0px 0px -30px 0px" });
    els.forEach((el) => io.observe(el));
  });

  /* ---------- project cards ---------- */
  const shotOf = (p) => p.screens?.[0];
  // console apps and drawn art sit in a small code window
  const winHTML = (p) => {
    const m = p.image || p.art;
    const inner = p.image
      ? `<img src="${p.image.src}" alt="${esc(p.image.alt)}"${p.image.pixel ? ` class="small"` : ""} loading="lazy" decoding="async">`
      : `${p.art.svg}<span class="win-cap">${esc(p.art.caption)}</span>`;
    return `<div class="win"><div class="win-bar"><b>●</b> ${esc(m.window)}</div><div class="win-body">${inner}</div></div>`;
  };
  // every screen of the app stacked in one phone; the card cycles through them
  const phoneHTML = (p) => `<div class="p3d"><div class="phone" data-tilt>${p.screens.map((s, j) => `<img${j ? "" : ` class="on"`} src="${s.src}" alt="${esc(s.alt)}" loading="lazy" decoding="async">`).join("")}</div></div>
    ${p.screens.length > 1 ? `<div class="dots" aria-hidden="true">${p.screens.map((_, j) => `<i${j ? "" : ` class="on"`}></i>`).join("")}</div>` : ""}`;
  const mediaHTML = (p) => p.screens ? phoneHTML(p) : (p.image || p.art) ? winHTML(p) : "";
  safely(() => {
    const grid = $("#apps");
    grid.innerHTML = PROJECTS.map((p, i) => `
      <article class="app" data-tags="${p.categories.join(" ")}" data-i="${i}">
        <div class="app-media${p.screens ? "" : " is-win"}">${mediaHTML(p)}</div>
        <div class="app-body">
          ${p.featured || p.badges ? `<div class="app-badges">${(p.badges || ["Featured"]).map((b) => `<span>${esc(b)}</span>`).join("")}</div>` : ""}
          <h3 class="app-name">${esc(p.name)}</h3>
          <p class="app-tag">${esc(p.tagline)}</p>
          <p class="app-desc">${esc(p.description)}</p>
          ${p.highlights ? `<ul class="app-hl">${p.highlights.map(([b, t]) => `<li><b>${esc(b)}</b>${esc(t)}</li>`).join("")}</ul>` : ""}
          <ul class="app-stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <div class="app-cta">
            <span class="btn btn-primary btn-sm">${p.video ? `${icon("play")}Watch demo` : `View project${icon("arrow")}`}</span>
            ${p.screens && p.screens.length > 1 ? `<span class="app-count">${p.screens.length} screens</span>` : ""}
          </div>
        </div>
        <button class="app-hit" type="button" aria-label="Open ${esc(p.name)}"></button>
      </article>`).join("");

    // each card's phone changes screen on its own while the card is on screen
    const STEP = 2600;
    $$(".app", grid).forEach((card, n) => {
      const imgs = $$(".phone img", card), dots = $$(".dots i", card);
      if (imgs.length < 2) return;
      let k = 0, timer = 0, visible = false;
      const show = (j) => {
        const prev = imgs[k];
        prev.classList.remove("on"); prev.classList.add("was"); dots[k]?.classList.remove("on");
        setTimeout(() => prev.classList.remove("was"), 900);
        k = j % imgs.length;
        imgs[k].classList.add("on"); dots[k]?.classList.add("on");
      };
      const run = () => {
        clearInterval(timer);
        if (visible && !card.hidden && !document.hidden) timer = setInterval(() => show(k + 1), STEP);
      };
      // load every screen once the card comes near, so each change is instant
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) imgs.forEach((im) => { im.loading = "eager"; });
        // stagger the cards so they don't all change at the same moment
        setTimeout(run, visible ? (n % 3) * 700 : 0);
      }, { rootMargin: "120px 0px" }).observe(card);
      document.addEventListener("visibilitychange", run);
    });

    // filters
    const tabs = $$("#filters button");
    tabs.forEach((t) => t.addEventListener("click", () => {
      const f = t.dataset.filter;
      tabs.forEach((b) => b.setAttribute("aria-selected", String(b === t)));
      $$(".app", grid).forEach((card) => { card.hidden = f !== "all" && !card.dataset.tags.split(" ").includes(f); });
    }));

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".app");
      if (card) openProject(+card.dataset.i);
    });
  });

  /* ---------- project drawer ---------- */
  const drawer = $("#drawer"), panel = $(".drawer-panel", drawer), body = $("#d-body");
  let current = -1, returnFocus = null, barRaf = 0, closeT = 0;

  const stageHTML = (p) => {
    const s = shotOf(p);
    // a landscape promo video plays in a wide screen
    if (p.video?.wide) return `<div class="stage stage-wide"><div class="screen player paused">
        <video muted loop playsinline preload="auto" poster="${p.video.poster}" src="${p.video.src}" aria-label="${esc(p.name)} demo video"></video>
        <button class="toggle" type="button" aria-label="Play demo">${icon("play")}</button>
        <span class="bar" aria-hidden="true"><i></i></span>
      </div></div>`;
    if (p.video) return `<div class="stage"><div class="p3d"><div class="phone player paused" data-tilt>
        <video muted loop playsinline preload="auto" poster="${p.video.poster}" src="${p.video.src}" aria-label="${esc(p.name)} demo video"></video>
        <button class="toggle" type="button" aria-label="Play demo">${icon("play")}</button>
        <span class="bar" aria-hidden="true"><i></i></span>
      </div></div></div>`;
    if (s) return `<div class="stage"><div class="p3d"><div class="phone" data-tilt><img src="${s.src}" alt="${esc(s.alt)}" decoding="async"></div></div></div>`;
    if (p.image || p.art) return `<div class="stage">${winHTML(p)}</div>`;
    return "";
  };
  const bodyHTML = (p) => {
    const badges = [...(p.badges || (p.featured ? ["Featured"] : [])).map((b) => `<span class="hot">${esc(b)}</span>`),
      ...p.categories.map((c) => `<span>${esc(LABELS[c] || c)}</span>`)].join("");
    const hl = p.highlights ? `<div><p class="d-h">Highlights</p><ul class="d-hl">${p.highlights.map(([b, t]) => `<li><b>${esc(b)}</b>${esc(t)}</li>`).join("")}</ul></div>` : "";
    const arch = p.architecture.split(" · ").map((a, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${esc(a[0].toUpperCase() + a.slice(1))}</li>`).join("");
    return `${stageHTML(p)}
      <div>
        <div class="d-badges">${badges}</div>
        <h2 class="d-title" id="d-title">${esc(p.name)}</h2>
        <p class="d-tag">${esc(p.tagline)}</p>
      </div>
      <div><p class="d-h">Overview</p><p class="d-desc">${esc(p.description)}</p></div>
      ${p.screens && p.screens.length > 1 ? `<div><p class="d-h">Screens</p><div class="d-screens">${p.screens.map((sc) => `<figure><img src="${sc.src}" alt="${esc(sc.alt)}" loading="lazy" decoding="async"><figcaption>${esc(sc.alt)}</figcaption></figure>`).join("")}</div></div>` : ""}
      ${hl}
      <div><p class="d-h">How it's built</p><ul class="d-arch">${arch}</ul></div>
      <div><p class="d-h">Stack</p><ul class="d-stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div class="d-actions">
        <a class="btn btn-primary" href="mailto:${EMAIL}?subject=${encodeURIComponent("About " + p.name)}">Email me about ${esc(p.name)}${icon("arrow")}</a>
        <a class="btn btn-soft" href="${p.repo || GITHUB}" target="_blank" rel="noopener">${icon("github")}${p.repo ? "Source code" : "More on GitHub"}</a>
        <a class="btn btn-soft" href="${RESUME}" download="Tanzeel_Hussain_Resume.pdf">${icon("download")}Résumé</a>
      </div>`;
  };
  const wirePlayer = () => {
    cancelAnimationFrame(barRaf);
    const player = $(".player", body);
    if (!player) return;
    const v = $("video", player), btn = $(".toggle", player), bar = $(".bar i", player);
    const sync = () => { player.classList.toggle("paused", v.paused); btn.setAttribute("aria-label", v.paused ? "Play demo" : "Pause demo"); };
    const tick = () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; barRaf = requestAnimationFrame(tick); };
    const toggle = () => (v.paused ? v.play().catch(() => {}) : v.pause());
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    player.addEventListener("click", toggle);
    tick();
    if (!reduceMotion) v.play().catch(sync);
  };
  const render = (i, dir = 0) => {
    current = (i + PROJECTS.length) % PROJECTS.length;
    const p = PROJECTS[current];
    $$("video", body).forEach((v) => v.pause());
    body.innerHTML = bodyHTML(p);
    body.scrollTop = 0;
    $("#d-count").textContent = `${current + 1} / ${PROJECTS.length} · ${p.name}`;
    $("#d-prev").setAttribute("aria-label", `Previous project: ${PROJECTS[(current - 1 + PROJECTS.length) % PROJECTS.length].name}`);
    $("#d-next").setAttribute("aria-label", `Next project: ${PROJECTS[(current + 1) % PROJECTS.length].name}`);
    body.classList.remove("swap");
    if (dir && !reduceMotion) { body.style.setProperty("--dir", dir); void body.offsetWidth; body.classList.add("swap"); }
    wirePlayer();
  };
  const openProject = (i) => {
    clearTimeout(closeT);
    if (drawer.hidden) { returnFocus = document.activeElement; drawer.hidden = false; document.body.classList.add("locked"); }
    drawer.classList.remove("closing");
    render(i);
    panel.focus({ preventScroll: true });
  };
  const closeProject = () => {
    if (drawer.hidden || drawer.classList.contains("closing")) return;
    cancelAnimationFrame(barRaf);
    $$("video", body).forEach((v) => v.pause());
    document.body.classList.remove("locked");
    const done = () => { drawer.hidden = true; drawer.classList.remove("closing"); body.innerHTML = ""; returnFocus?.focus?.({ preventScroll: true }); };
    if (reduceMotion) return done();
    drawer.classList.add("closing");
    closeT = setTimeout(done, 240);
  };
  $$("[data-close]", drawer).forEach((b) => b.addEventListener("click", closeProject));
  $("#d-prev").addEventListener("click", () => render(current - 1, -1));
  $("#d-next").addEventListener("click", () => render(current + 1, 1));
  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closeProject();
    if (e.key === "ArrowRight" && !e.target.closest("input, textarea")) { e.preventDefault(); render(current + 1, 1); }
    if (e.key === "ArrowLeft" && !e.target.closest("input, textarea")) { e.preventDefault(); render(current - 1, -1); }
    if (e.key === "Tab") { // keep focus inside the drawer
      const f = $$("a[href], button:not([disabled])", panel).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- app spotlight: each app's screen in turn, every few seconds ---------- */
  safely(() => {
    const spot = $("#spot");
    const apps = PROJECTS.map((p, i) => ({ p, i, s: shotOf(p) })).filter((a) => a.s);
    if (!spot || !apps.length) return;
    const imgs = $$(".spot-screen img", spot), nameEl = $("#spot-name"), tagEl = $("#spot-tag"), bars = $(".spot-bars", spot);
    const MS = 3500;
    spot.style.setProperty("--spot-ms", MS + "ms");
    bars.innerHTML = apps.map(() => "<i></i>").join("");
    const segs = $$("i", bars);
    let k = 0, front = 0, timer = 0, visible = true;
    const show = async (n) => {
      k = (n + apps.length) % apps.length;
      const a = apps[k], back = imgs[1 - front];
      back.src = a.s.src;
      try { await back.decode(); } catch {}
      const prev = imgs[front];
      prev.classList.remove("on"); prev.classList.add("was"); back.classList.remove("was"); back.classList.add("on"); front = 1 - front;
      setTimeout(() => prev.classList.remove("was"), 900);
      nameEl.textContent = a.p.name;
      tagEl.textContent = a.p.tagline;
      [nameEl, tagEl].forEach((el) => { el.classList.remove("in"); void el.offsetWidth; el.classList.add("in"); });
      spot.setAttribute("aria-label", `Open the ${a.p.name} project`);
      segs.forEach((s, j) => { s.classList.toggle("done", j < k); s.classList.remove("on"); });
      void segs[k].offsetWidth; segs[k].classList.add("on");
    };
    const loop = () => { clearTimeout(timer); if (visible && !document.hidden) timer = setTimeout(() => { show(k + 1); loop(); }, MS); };
    show(0); loop();
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); }).observe(spot);
    document.addEventListener("visibilitychange", loop);
    spot.addEventListener("click", () => openProject(apps[k].i));
  });

  /* ---------- 3D: phones and the photo turn toward the pointer, with light moving across the glass ---------- */
  safely(() => {
    if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0, target = null, px = 0, py = 0;
    const apply = () => {
      raf = 0;
      if (!target) return;
      const max = +target.dataset.tilt || 16;
      target.style.transform = `rotateX(${(-py * max * .7).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(10px)`;
      target.style.setProperty("--gx", `${(50 + px * 60).toFixed(1)}%`);
      target.style.setProperty("--gy", `${(50 + py * 60).toFixed(1)}%`);
    };
    document.addEventListener("pointermove", (e) => {
      // the card, panel or profile the pointer is over drives its own phone or photo
      const host = e.target.closest?.(".app, .stage, .spot, .avatar");
      const el = host ? (host.matches("[data-tilt]") ? host : host.querySelector("[data-tilt]")) : null;
      if (el !== target) {
        if (target) { target.style.transform = ""; target.classList.remove("tilting"); }
        target = el;
        target?.classList.add("tilting");
      }
      if (!target) return;
      const r = (host || target).getBoundingClientRect();
      px = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      py = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    document.addEventListener("pointerleave", () => { if (target) { target.style.transform = ""; target.classList.remove("tilting"); target = null; } });
  });

  /* ---------- skill logos ---------- */
  safely(() => {
    const icons = window.SKILL_ICONS || {};
    $$(".toolkit .tag").forEach((t) => { const svg = icons[t.textContent.trim()]; if (svg) t.insertAdjacentHTML("afterbegin", svg); });
  });

  /* ---------- skill globe: drag to spin, eases to a stop ---------- */
  safely(() => {
    const sphere = $("[data-sphere]");
    if (!sphere) return;
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
    const draw = () => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      pts.forEach((p) => {
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
      draw();
      if (dragging || Math.abs(vx) + Math.abs(vy) > .0004) requestAnimationFrame(frame);
      else { spinning = false; last = 0; }
    };
    const kick = () => { if (!spinning) { spinning = true; requestAnimationFrame(frame); } };
    measure(); draw();
    addEventListener("resize", () => { measure(); draw(); }, { passive: true });
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
  });

  /* ---------- contact ---------- */
  safely(() => {
    $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); toast("Email address copied"); }
      catch { toast(b.dataset.copy); }
    }));
    const form = $("#contact-form"), note = $("#form-note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
      if (!name || !msg || !/^\S+@\S+\.\S+$/.test(email)) {
        note.textContent = "Add your name, a valid email address and a message, then send again.";
        note.classList.add("err");
        return;
      }
      note.textContent = "Opening your email app with the message filled in.";
      note.classList.remove("err");
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(`${msg}\n\n${name} <${email}>`)}`;
    });
  });
})();
