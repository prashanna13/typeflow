import { mountChrome, bindProgressTools } from "./app.js";
import { load } from "./storage.js";
import { LESSONS, LEVELS, ACHIEVEMENTS } from "./lessons.js";
import { renderKeyboard } from "./keyboard.js";
import { fmtTime } from "./engine.js";

mountChrome("progress");
bindProgressTools();

const s = load();
const done = LESSONS.filter((l) => s.completed[l.id]).length;
const pct = Math.round((done / LESSONS.length) * 100);
const acc = s.totals.chars ? Math.round((s.totals.correct / s.totals.chars) * 100) : 0;
const avgWpm = s.tests.length
  ? Math.round(s.tests.reduce((a, t) => a + t.wpm, 0) / s.tests.length)
  : (s.bestWpm || 0);

document.getElementById("p-complete").textContent = `${pct}%`;
document.getElementById("p-lessons").textContent = `${done} / ${LESSONS.length}`;
document.getElementById("p-level").textContent = currentLevel();
document.getElementById("p-streak").textContent = s.streak.count || 0;
document.getElementById("p-best").textContent = s.bestWpm || 0;
document.getElementById("p-avg").textContent = avgWpm;
document.getElementById("p-acc").textContent = `${acc}%`;
document.getElementById("p-time").textContent = fmtTime(s.totals.timeMs);
document.getElementById("p-chars").textContent = s.totals.chars || 0;
document.querySelector("[data-fill]").style.width = `${pct}%`;

function currentLevel() {
  for (const lv of LEVELS) {
    const items = LESSONS.filter((l) => l.level === lv.id);
    if (items.some((l) => !s.completed[l.id])) return lv.title;
  }
  return "Typing master";
}

const keyStats = Object.entries(s.keys || {}).map(([k, v]) => {
  const total = (v.hits || 0) + (v.misses || 0);
  const accuracy = total ? Math.round((v.hits / total) * 100) : 100;
  return { k, ...v, total, accuracy };
}).filter((x) => x.total >= 4);

const weak = [...keyStats].sort((a, b) => a.accuracy - b.accuracy).slice(0, 8);
const strong = [...keyStats].sort((a, b) => b.accuracy - a.accuracy).slice(0, 8);

document.getElementById("weak-keys").innerHTML = weak.length
  ? weak.map((k) => `<li><code>${k.k}</code> — ${k.accuracy}% accuracy (${k.total} hits)</li>`).join("")
  : "<li>Practice a few lessons and weak keys will appear here.</li>";
document.getElementById("strong-keys").innerHTML = strong.length
  ? strong.map((k) => `<li><code>${k.k}</code> — ${k.accuracy}%</li>`).join("")
  : "<li>No data yet.</li>";

const kb = document.getElementById("heat");
renderKeyboard(kb);
kb.classList.add("heatmap");
if (keyStats.length) {
  const min = Math.min(...keyStats.map((k) => k.accuracy));
  const max = Math.max(...keyStats.map((k) => k.accuracy));
  keyStats.forEach((k) => {
    const el = kb.querySelector(`[data-key="${CSS.escape(k.k === "space" ? " " : k.k)}"]`);
    if (!el) return;
    el.classList.add("hot");
    const t = max === min ? 0.5 : (k.accuracy - min) / (max - min);
    el.style.background = `color-mix(in srgb, var(--error) ${Math.round((1 - t) * 80)}%, var(--success))`;
    el.style.opacity = "1";
  });
}

document.getElementById("achievements").innerHTML = ACHIEVEMENTS.map((a) => {
  const got = s.achievements[a.id];
  return `<div class="ach ${got ? "got" : ""}"><div class="ico">${got ? "✓" : "○"}</div><div><strong>${a.title}</strong><div class="tiny muted">${got ? "Unlocked" : a.hint}</div></div></div>`;
}).join("");

document.getElementById("sessions").innerHTML = (s.tests || []).slice().reverse().slice(0, 8).map((t) => {
  const d = new Date(t.at).toLocaleString();
  return `<tr><td>${d}</td><td>${t.wpm}</td><td>${t.accuracy}%</td><td>${t.kind}</td><td>${t.duration}s</td></tr>`;
}).join("") || `<tr><td colspan="5">No tests yet. <a href="tests.html">Take one</a>.</td></tr>`;
