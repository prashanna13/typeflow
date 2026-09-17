import { mountChrome, toast } from "./app.js";
import { load, update } from "./storage.js";
import { weakKeyExercise, generateTest } from "./lessons.js";
import { createEngine, renderPrompt, fmtTime } from "./engine.js";
import { renderKeyboard, highlightChar } from "./keyboard.js";
import { recordSession } from "./storage.js";

mountChrome("practice");

const today = new Date().toISOString().slice(0, 10);
const s = load();
if (s.daily.date !== today) {
  update((st) => { st.daily = { date: today, steps: {} }; });
}

const STEPS = [
  { id: "warm", title: "Home-row warm-up", minutes: 2, text: () => "asdf jkl; asdf jkl; fj fj as df jk l; salad flask fall glad" },
  { id: "weak", title: "Weak keys", minutes: 3, text: () => weakKeyExercise(load().keys) },
  { id: "words", title: "Words", minutes: 3, text: () => generateTest("words", 3) },
  { id: "test", title: "Short test", minutes: 2, text: () => generateTest("sentences", 2) }
];

const list = document.getElementById("steps");
const state = load();
list.innerHTML = STEPS.map((st, i) => {
  const done = state.daily.steps[st.id];
  return `<button class="lesson-row" data-step="${st.id}"><span class="bullet ${done ? "done" : ""}">${i + 1}</span><span><strong>${st.title}</strong><small>${st.minutes} minutes</small></span><span>${done ? "Done" : "Start"}</span></button>`;
}).join("");

const kb = document.getElementById("kb");
renderKeyboard(kb);
let engine;

function run(step) {
  engine?.destroy();
  const text = step.text();
  document.getElementById("live").hidden = false;
  document.getElementById("step-title").textContent = step.title;
  const promptEl = document.getElementById("prompt");
  engine = createEngine({
    text,
    onUpdate: (snap) => {
      renderPrompt(promptEl, text, snap.marks, snap.index);
      highlightChar(kb, snap.current);
      document.getElementById("d-time").textContent = fmtTime(snap.elapsed);
    },
    onComplete: (snap) => {
      recordSession({ wpm: snap.wpm, accuracy: snap.accuracy, errors: snap.errors, correct: snap.correct, chars: snap.typed, timeMs: snap.elapsed, keys: snap.keys });
      update((st) => { st.daily.steps[step.id] = true; });
      toast("Step complete.");
      location.reload();
    }
  });
}

list.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-step]");
  if (!btn) return;
  const step = STEPS.find((x) => x.id === btn.dataset.step);
  run(step);
});
