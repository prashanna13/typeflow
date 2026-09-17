import { mountChrome } from "./app.js";
import { LEVELS, LESSONS } from "./lessons.js";
import { load } from "./storage.js";

mountChrome("learn");
const s = load();

document.getElementById("roadmap").innerHTML = LEVELS.map((lv) => {
  const items = LESSONS.filter((l) => l.level === lv.id);
  const all = items.every((l) => s.completed[l.id]);
  const some = items.some((l) => s.completed[l.id]);
  const rows = items.map((l) => {
    const sc = s.scores[l.id];
    return `<a class="lesson-row" href="trainer.html?lesson=${l.id}">
      <span class="bullet ${s.completed[l.id] ? "done" : ""}">${s.completed[l.id] ? "✓" : l.id}</span>
      <span><strong>${l.title}</strong><small>${l.kind} · about ${l.minutes} min</small></span>
      <span class="score-ok">${sc ? `${sc.wpm} WPM · ${sc.accuracy}%` : "Open"}</span>
    </a>`;
  }).join("");
  return `<section class="section" style="padding:28px 0">
    <h2 class="section-h" style="font-size:28px">${lv.title}</h2>
    <p class="section-p">${lv.blurb} ${all ? "Complete." : some ? "In progress." : "Open whenever you like — nothing is locked."}</p>
    <div class="lesson-list">${rows}</div>
  </section>`;
}).join("");
