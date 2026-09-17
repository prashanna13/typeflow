import { mountChrome, toast } from "./app.js";
import { generateTest } from "./lessons.js";
import { createEngine, renderPrompt, fmtTime, calcWpm, calcAccuracy } from "./engine.js";
import { renderKeyboard, highlightChar, flashKey } from "./keyboard.js";
import { update, recordSession } from "./storage.js";

mountChrome("test");

const kb = document.getElementById("kb");
renderKeyboard(kb);

let duration = 60;
let kind = "words";
let engine = null;
let tick = null;
let started = false;

function select(group, value) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach((b) => {
    b.classList.toggle("on", b.dataset.value === String(value));
    b.setAttribute("aria-selected", b.dataset.value === String(value));
  });
}

document.querySelectorAll("[data-group='time']").forEach((b) => {
  b.addEventListener("click", () => { duration = Number(b.dataset.value); select("time", duration); });
});
document.querySelectorAll("[data-group='kind']").forEach((b) => {
  b.addEventListener("click", () => { kind = b.dataset.value; select("kind", kind); });
});

function stop() {
  engine?.destroy();
  clearInterval(tick);
  started = false;
}

function finish(s, timedOut) {
  stop();
  const minutes = (s.elapsed || duration * 1000) / 60000;
  const wpm = calcWpm(s.correct, minutes);
  const acc = calcAccuracy(s.correct, s.typed);
  recordSession({ wpm, accuracy: acc, errors: s.errors, correct: s.correct, chars: s.typed, timeMs: s.elapsed, keys: s.keys });
  update((st) => {
    st.tests.push({ at: Date.now(), wpm: Math.round(wpm), accuracy: Math.round(acc), errors: s.errors, kind, duration, timedOut: !!timedOut });
    if (st.tests.length > 40) st.tests = st.tests.slice(-40);
  });
  document.getElementById("live").hidden = true;
  document.getElementById("result").hidden = false;
  document.getElementById("r-wpm").textContent = Math.round(wpm);
  document.getElementById("r-acc").textContent = `${Math.round(acc)}%`;
  document.getElementById("r-err").textContent = s.errors;
  document.getElementById("r-ok").textContent = s.correct;
  document.getElementById("r-bad").textContent = Math.max(0, s.typed - s.correct);
  const consist = acc >= 95 ? "Very steady" : acc >= 85 ? "Solid" : "Uneven — slow down";
  document.getElementById("r-con").textContent = consist;
  toast(timedOut ? "Time. Here's how that run went." : "Finished the passage.");
}

document.getElementById("start").addEventListener("click", () => {
  stop();
  const text = generateTest(kind, duration / 60);
  document.getElementById("setup").hidden = true;
  document.getElementById("result").hidden = true;
  document.getElementById("live").hidden = false;
  const promptEl = document.getElementById("prompt");
  const endsAt = Date.now() + duration * 1000;
  started = true;

  engine = createEngine({
    text,
    onUpdate: (s) => {
      renderPrompt(promptEl, text, s.marks, s.index);
      highlightChar(kb, s.current);
      document.getElementById("t-wpm").textContent = Math.round(s.wpm);
      document.getElementById("t-acc").textContent = `${Math.round(s.accuracy)}%`;
      const left = Math.max(0, endsAt - Date.now());
      document.getElementById("t-time").textContent = fmtTime(left);
    },
    onComplete: (s) => finish(s, false)
  });

  tick = setInterval(() => {
    if (Date.now() >= endsAt && started) finish(engine.snapshot(), true);
  }, 200);
});

document.getElementById("again").addEventListener("click", () => {
  document.getElementById("result").hidden = true;
  document.getElementById("setup").hidden = false;
});

window.addEventListener("keydown", (e) => {
  if (!started) return;
  if (e.key.length === 1 || e.key === " ") flashKey(kb, e.key, true);
});
