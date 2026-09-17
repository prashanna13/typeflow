import { mountChrome, qs, toast } from "./app.js";
import { getLesson, nextLesson, prevLesson, exerciseFor, LESSONS } from "./lessons.js";
import { createEngine, renderPrompt, fmtTime } from "./engine.js";
import { renderKeyboard, renderHands, highlightChar, flashKey, fingerForChar, lookupChar } from "./keyboard.js";
import { recordSession, load } from "./storage.js";

mountChrome("practice");

const lessonId = qs("lesson") || load().currentLesson || "0.1";
const lesson = getLesson(lessonId) || LESSONS[0];
const kbRoot = document.getElementById("kb");
const hands = document.getElementById("hands");
const promptEl = document.getElementById("prompt");
const hintEl = document.getElementById("hint");

renderKeyboard(kbRoot);
renderHands(hands);

function setMeta() {
  document.getElementById("lesson-kicker").textContent = `Lesson ${lesson.id} · Level ${lesson.level}`;
  document.getElementById("lesson-title").textContent = lesson.title;
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  document.getElementById("lesson-pos").textContent = `${idx + 1} of ${LESSONS.length}`;
  const prev = prevLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  if (prev) prevBtn.href = `trainer.html?lesson=${prev.id}`;
  else { prevBtn.href = "lessons.html"; prevBtn.textContent = "Curriculum"; }
  if (next) nextBtn.href = `trainer.html?lesson=${next.id}`;
  else { nextBtn.href = "progress.html"; nextBtn.textContent = "See progress"; }
}

function renderGuide() {
  document.getElementById("drill").hidden = true;
  document.getElementById("guide").hidden = false;
  document.getElementById("guide-body").textContent = lesson.body;
  document.getElementById("guide-steps").innerHTML = (lesson.steps || []).map((s) => `<li>${s}</li>`).join("");
  highlightChar(kbRoot, "f");
  document.getElementById("complete-guide").addEventListener("click", () => {
    recordSession({ wpm: 0, accuracy: 100, errors: 0, correct: 1, chars: 1, timeMs: 0, lessonId: lesson.id, keys: {} });
    const n = nextLesson(lesson.id);
    toast("Marked complete. Accuracy is a habit, not a score.");
    if (n) location.href = `trainer.html?lesson=${n.id}`;
  });
}

let engine = null;
let text = "";

function renderMetrics(s) {
  document.getElementById("m-wpm").textContent = Math.round(s.wpm);
  document.getElementById("m-acc").textContent = `${Math.round(s.accuracy)}%`;
  document.getElementById("m-err").textContent = s.errors;
  document.getElementById("m-ok").textContent = s.correct;
  document.getElementById("m-time").textContent = fmtTime(s.elapsed);
  document.querySelector(".progress-bar > i").style.width = `${Math.round(s.progress * 100)}%`;
}

function coach(ch) {
  const f = fingerForChar(ch);
  const info = lookupChar(ch);
  if (!f || !hintEl) return;
  const label = ch === " " ? "space" : ch;
  hintEl.textContent = `Next: ${label} — ${f.label}${info?.needsShift ? ". Hold the opposite Shift." : "."}`;
}

function startDrill() {
  engine?.destroy();
  text = exerciseFor(lesson);
  document.getElementById("drill").hidden = false;
  document.getElementById("guide").hidden = true;
  document.getElementById("done").hidden = true;
  if (lesson.intro) document.getElementById("intro").textContent = lesson.intro;
  else document.getElementById("intro").textContent = "Type the line. Eyes on the text, not the keys.";

  engine = createEngine({
    text,
    onUpdate: (s) => {
      renderPrompt(promptEl, text, s.marks, s.index);
      renderMetrics(s);
      highlightChar(kbRoot, s.current);
      coach(s.current);
    },
    onComplete: (s) => {
      recordSession({
        wpm: s.wpm,
        accuracy: s.accuracy,
        errors: s.errors,
        correct: s.correct,
        chars: s.typed,
        timeMs: s.elapsed,
        lessonId: lesson.id,
        keys: s.keys
      });
      showComplete(s);
    }
  });
}

function showComplete(s) {
  const box = document.getElementById("done");
  box.hidden = false;
  document.getElementById("drill").hidden = true;
  document.getElementById("d-wpm").textContent = Math.round(s.wpm);
  document.getElementById("d-acc").textContent = `${Math.round(s.accuracy)}%`;
  document.getElementById("d-err").textContent = s.errors;
  document.getElementById("d-time").textContent = fmtTime(s.elapsed);
  const msg = s.accuracy >= 96
    ? "Excellent control. Accuracy is building your muscle memory."
    : s.accuracy >= 85
      ? "Great work. Accuracy is building your muscle memory."
      : "Almost — slow down a little and keep your fingers returning home.";
  document.getElementById("d-msg").textContent = msg;
  const n = nextLesson(lesson.id);
  document.getElementById("done-next").href = n ? `trainer.html?lesson=${n.id}` : "lessons.html";
}

document.getElementById("restart")?.addEventListener("click", startDrill);
document.getElementById("again")?.addEventListener("click", startDrill);

window.addEventListener("keydown", (e) => {
  if (e.key.length === 1 || e.key === " ") {
    const ch = e.key === " " ? " " : e.key;
    const expected = engine?.snapshot().current;
    flashKey(kbRoot, ch, ch === expected);
  }
});

setMeta();
if (lesson.kind === "guide") renderGuide();
else startDrill();
