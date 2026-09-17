export function calcWpm(correctChars, minutes) {
  if (minutes <= 0) return 0;
  return (correctChars / 5) / minutes;
}

export function calcAccuracy(correct, typed) {
  if (typed <= 0) return 100;
  return Math.max(0, Math.min(100, (correct / typed) * 100));
}

export function createEngine({ text, onUpdate, onComplete, allowBackspace = true }) {
  let index = 0;
  let errors = 0;
  let typed = 0;
  let correct = 0;
  let startedAt = 0;
  let finished = false;
  const marks = Array(text.length).fill("pending");
  const keys = {};
  let timer = null;

  const snapshot = () => {
    const elapsed = startedAt ? Date.now() - startedAt : 0;
    const minutes = elapsed / 60000;
    return {
      index,
      errors,
      typed,
      correct,
      elapsed,
      finished,
      marks: marks.slice(),
      current: text[index] || "",
      wpm: calcWpm(correct, minutes || 1 / 60),
      accuracy: calcAccuracy(correct, typed),
      remaining: text.length - index,
      progress: text.length ? index / text.length : 0,
      keys
    };
  };

  const emit = () => onUpdate?.(snapshot());

  const startClock = () => {
    if (startedAt) return;
    startedAt = Date.now();
    timer = setInterval(emit, 200);
  };

  const bumpKey = (ch, ok) => {
    const k = ch === " " ? "space" : ch.toLowerCase();
    keys[k] = keys[k] || { hits: 0, misses: 0 };
    if (ok) keys[k].hits += 1;
    else keys[k].misses += 1;
  };

  const handle = (e) => {
    if (finished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const ignore = ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (ignore.includes(e.key)) return;
    if (e.key === "Enter" && text[index] !== "\n") return;
    e.preventDefault();

    if (e.key === "Backspace") {
      if (!allowBackspace || index === 0) return;
      startClock();
      index -= 1;
      if (marks[index] === "miss") {
        /* keep error count historically; just unmark current */
      }
      marks[index] = "pending";
      emit();
      return;
    }

    const expected = text[index];
    if (expected == null) return;
    startClock();
    typed += 1;
    const got = e.key === "Enter" ? "\n" : e.key;
    const ok = got === expected;
    bumpKey(expected, ok);
    if (ok) {
      marks[index] = "done";
      correct += 1;
    } else {
      marks[index] = "miss";
      errors += 1;
    }
    index += 1;
    if (index >= text.length) {
      finished = true;
      clearInterval(timer);
      const result = snapshot();
      onComplete?.(result);
    }
    emit();
  };

  const destroy = () => {
    window.removeEventListener("keydown", handle);
    clearInterval(timer);
  };

  window.addEventListener("keydown", handle);
  emit();

  return { handle, destroy, snapshot, getText: () => text };
}

export function renderPrompt(el, text, marks, index) {
  el.innerHTML = [...text].map((ch, i) => {
    const vis = ch === " " ? "&nbsp;" : ch === "\n" ? "<br>" : escapeHtml(ch);
    const cls = ["ch", marks[i] || "", i === index ? "cur" : "", ch === " " ? "space" : ""].filter(Boolean).join(" ");
    return `<span class="${cls}">${vis}</span>`;
  }).join("");
}

function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr, n) {
  const s = shuffle(arr);
  return s.slice(0, Math.min(n, s.length));
}

export function repeatJoin(items, n, sep = " ") {
  const out = [];
  for (let i = 0; i < n; i++) out.push(items[i % items.length]);
  return out.join(sep);
}
