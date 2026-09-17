import { load, save, update, exportProgress, importProgress, resetProgress, completionPercent } from "./storage.js";
import { LESSONS } from "./lessons.js";

const THEME_KEY_MEDIA = window.matchMedia("(prefers-color-scheme: light)");

export function applyTheme(theme) {
  const mode = theme || load().theme || "system";
  const resolved = mode === "system" ? (THEME_KEY_MEDIA.matches ? "light" : "dark") : mode;
  document.documentElement.dataset.theme = resolved;
  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) btn.setAttribute("aria-label", `Theme: ${mode}. Click to change.`);
}

export function cycleTheme() {
  const order = ["dark", "light", "system"];
  const cur = load().theme || "system";
  const next = order[(order.indexOf(cur) + 1) % order.length];
  update((s) => { s.theme = next; });
  applyTheme(next);
  toast(`Theme: ${next}`);
}

export function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2400);
}

function nav(active) {
  const s = load();
  const pct = completionPercent(LESSONS.map((l) => l.id));
  return `
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    <div class="nav-inner">
      <a class="logo" href="index.html"><span class="logo-mark">tf</span> TYPEFLOW</a>
      <nav>
        <ul class="nav-links" id="nav-links">
          <li><a href="lessons.html" ${active==="learn"?"aria-current='page'":""}>Learn</a></li>
          <li><a href="trainer.html" ${active==="practice"?"aria-current='page'":""}>Practice</a></li>
          <li><a href="tests.html" ${active==="test"?"aria-current='page'":""}>Typing Test</a></li>
          <li><a href="games.html" ${active==="games"?"aria-current='page'":""}>Games</a></li>
          <li><a href="progress.html" ${active==="progress"?"aria-current='page'":""}>Progress</a></li>
        </ul>
      </nav>
      <div class="nav-right">
        <span class="pill" title="Course completion">${pct}% complete</span>
        <span class="pill" title="Streak">${s.streak?.count ? `🔥 ${s.streak.count} day${s.streak.count===1?"":"s"}` : "Start a streak"}</span>
        <button class="icon-btn" data-theme-toggle type="button" aria-label="Toggle theme">◐</button>
        <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-controls="nav-links">☰</button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="footer">
    <div class="wrap footer-grid">
      <div>
        <div class="logo"><span class="logo-mark">tf</span> TYPEFLOW</div>
        <p class="muted">Learn to type. Build muscle memory. Type with confidence.</p>
        <p class="tiny faint">Free typing education for everyone.</p>
      </div>
      <div>
        <h4>Learn</h4>
        <a href="lessons.html">Curriculum</a>
        <a href="trainer.html">Practice</a>
        <a href="daily.html">Today's practice</a>
        <a href="guide.html">Finger guide</a>
      </div>
      <div>
        <h4>Measure</h4>
        <a href="tests.html">Typing test</a>
        <a href="games.html">Games</a>
        <a href="progress.html">Progress</a>
        <a href="weak.html">Weak keys</a>
      </div>
      <div>
        <h4>Site</h4>
        <a href="about.html">About</a>
        <a href="index.html#faq">FAQ</a>
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
    <div class="wrap legal">TypeFlow is a free static website. Progress stays in your browser unless you export it.</div>
  </footer>`;
}

export function mountChrome(active) {
  document.body.insertAdjacentHTML("afterbegin", nav(active));
  document.body.insertAdjacentHTML("beforeend", footer());
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", cycleTheme);
  document.querySelector(".menu-btn")?.addEventListener("click", () => {
    document.getElementById("nav-links")?.classList.toggle("open");
  });
  applyTheme();
}

export function onboardingHtml() {
  return `
  <div class="overlay" id="welcome" role="dialog" aria-labelledby="welcome-title">
    <div class="modal">
      <p class="kicker">Welcome to TypeFlow</p>
      <h2 id="welcome-title">Have you used touch typing before?</h2>
      <p class="muted">You can change course anytime. Nothing is locked.</p>
      <div class="choice-grid">
        <button class="choice" data-path="new"><strong>I'm completely new</strong><br><span class="tiny muted">Start with sitting, hands, and F/J.</span></button>
        <button class="choice" data-path="basics"><strong>I know the basics</strong><br><span class="tiny muted">Jump to a short home-row check.</span></button>
        <button class="choice" data-path="speed"><strong>I want to improve my speed</strong><br><span class="tiny muted">Open a one-minute test.</span></button>
        <button class="choice" data-path="test"><strong>I want to take a test</strong><br><span class="tiny muted">Go straight to the typing test.</span></button>
      </div>
    </div>
  </div>`;
}

export function maybeOnboard() {
  const s = load();
  if (s.onboardingDone) return;
  document.body.insertAdjacentHTML("beforeend", onboardingHtml());
  const overlay = document.getElementById("welcome");
  overlay.classList.add("open");
  overlay.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-path]");
    if (!btn) return;
    const path = btn.dataset.path;
    update((st) => { st.onboardingDone = true; st.path = path; });
    overlay.classList.remove("open");
    if (path === "new") location.href = "trainer.html?lesson=0.1";
    else if (path === "basics") location.href = "trainer.html?lesson=1.10";
    else location.href = "tests.html";
  });
}

export function bindProgressTools() {
  document.querySelector("[data-export]")?.addEventListener("click", () => {
    exportProgress();
    toast("Progress file downloaded.");
  });
  document.querySelector("[data-import]")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importProgress(file);
      toast("Progress imported successfully.");
      setTimeout(() => location.reload(), 700);
    } catch (err) {
      toast(err.message);
    }
  });
  document.querySelector("[data-reset]")?.addEventListener("click", () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      resetProgress();
      toast("Progress reset.");
      setTimeout(() => location.reload(), 600);
    }
  });
}

export function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

THEME_KEY_MEDIA.addEventListener("change", () => {
  if (load().theme === "system") applyTheme("system");
});
