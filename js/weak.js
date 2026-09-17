import { mountChrome } from "./app.js";
import { load } from "./storage.js";
import { weakKeyExercise } from "./lessons.js";
import { createEngine, renderPrompt } from "./engine.js";
import { renderKeyboard, highlightChar } from "./keyboard.js";
import { recordSession } from "./storage.js";

mountChrome("practice");
const s = load();
const stats = Object.entries(s.keys || {}).map(([k, v]) => {
  const total = (v.hits || 0) + (v.misses || 0);
  const accuracy = total ? Math.round((v.hits / total) * 100) : 100;
  return { k, total, accuracy, misses: v.misses || 0 };
}).filter((x) => x.total >= 4).sort((a, b) => a.accuracy - b.accuracy);

document.getElementById("list").innerHTML = stats.length
  ? stats.slice(0, 12).map((k) => `<li><code>${k.k}</code> — ${k.accuracy}% accuracy · ${k.misses} misses</li>`).join("")
  : "<li>Not enough data yet. Complete a few lessons first.</li>";

const kb = document.getElementById("kb");
renderKeyboard(kb);
let engine;

document.getElementById("start").addEventListener("click", () => {
  engine?.destroy();
  const text = weakKeyExercise(s.keys, 50);
  const promptEl = document.getElementById("prompt");
  document.getElementById("live").hidden = false;
  engine = createEngine({
    text,
    onUpdate: (snap) => {
      renderPrompt(promptEl, text, snap.marks, snap.index);
      highlightChar(kb, snap.current);
    },
    onComplete: (snap) => {
      recordSession({ wpm: snap.wpm, accuracy: snap.accuracy, errors: snap.errors, correct: snap.correct, chars: snap.typed, timeMs: snap.elapsed, keys: snap.keys });
      location.reload();
    }
  });
});
