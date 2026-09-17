import { mountChrome, maybeOnboard } from "./app.js";
import { renderKeyboard, renderHands, highlightChar, lookupChar, FINGERS, KEYS } from "./keyboard.js";
import { LEVELS, LESSONS } from "./lessons.js";
import { load } from "./storage.js";

mountChrome("home");
maybeOnboard();

const kb = document.getElementById("hero-kb");
const hands = document.getElementById("hero-hands");
renderKeyboard(kb, {
  interactive: true,
  onKey: (id, meta) => showGuide(id, meta)
});
renderHands(hands);
["a","s","d","f","j","k","l",";"].forEach((id) => {
  kb.querySelector(`[data-key="${CSS.escape(id)}"]`)?.classList.add("hint");
});
document.querySelectorAll('.finger[data-id="lp"], .finger[data-id="lr"], .finger[data-id="lm"], .finger[data-id="li"], .finger[data-id="ri"], .finger[data-id="rm"], .finger[data-id="rr"], .finger[data-id="rp"]').forEach((f) => f.classList.add("on"));

const s = load();
document.getElementById("levels").innerHTML = LEVELS.map((lv) => {
  const items = LESSONS.filter((l) => l.level === lv.id);
  const done = items.filter((l) => s.completed[l.id]).length;
  const first = items[0];
  return `<a class="card card-hover level-card" href="trainer.html?lesson=${first.id}">
    <span class="tag">Level ${lv.id}</span>
    <h3>${lv.title}</h3>
    <p>${lv.blurb}</p>
    <span class="keys-used">${lv.keys} · ${done}/${items.length} lessons</span>
  </a>`;
}).join("");

const panel = document.getElementById("guide-panel");
function showGuide(id, meta) {
  const m = meta || KEYS[id];
  if (!m || !FINGERS[m.finger]) return;
  const f = FINGERS[m.finger];
  highlightChar(kb, id.length === 1 ? id : " ");
  panel.innerHTML = `
    <div class="tiny muted">Key</div>
    <div class="big">${m.label}</div>
    <div>Finger: <strong>${f.label}</strong></div>
    <div class="muted">Movement: ${m.row} row · ${m.hand} hand${m.bump ? " · tactile bump" : ""}</div>
  `;
}

kb.addEventListener("mouseover", (e) => {
  const btn = e.target.closest("[data-key]");
  if (!btn) return;
  showGuide(btn.dataset.key, KEYS[btn.dataset.key]);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
