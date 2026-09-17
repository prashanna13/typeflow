const KEY = "typeflow.v1";

const defaultState = () => ({
  version: 1,
  createdAt: Date.now(),
  theme: "system",
  onboardingDone: false,
  path: "new",
  currentLesson: "0.1",
  completed: {},
  scores: {},
  streak: { count: 0, lastDay: null },
  totals: {
    timeMs: 0,
    chars: 0,
    correct: 0,
    errors: 0,
    sessions: 0
  },
  bestWpm: 0,
  tests: [],
  games: {},
  keys: {},
  achievements: {},
  daily: { date: null, steps: {} }
});

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    return { ...defaultState(), ...data, totals: { ...defaultState().totals, ...(data.totals || {}) }, streak: { ...defaultState().streak, ...(data.streak || {}) } };
  } catch {
    return defaultState();
  }
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

export function update(mutator) {
  const state = load();
  mutator(state);
  return save(state);
}

export function recordSession({ wpm, accuracy, errors, correct, chars, timeMs, lessonId, keys }) {
  return update((s) => {
    s.totals.timeMs += timeMs || 0;
    s.totals.chars += chars || 0;
    s.totals.correct += correct || 0;
    s.totals.errors += errors || 0;
    s.totals.sessions += 1;
    if (wpm > (s.bestWpm || 0) && accuracy >= 80) s.bestWpm = Math.round(wpm);
    if (lessonId) {
      const prev = s.scores[lessonId] || { wpm: 0, accuracy: 0 };
      s.scores[lessonId] = {
        wpm: Math.max(prev.wpm, Math.round(wpm)),
        accuracy: Math.max(prev.accuracy, Math.round(accuracy)),
        errors,
        timeMs,
        at: Date.now()
      };
      if (accuracy >= 85) s.completed[lessonId] = true;
    }
    if (keys) {
      for (const [k, v] of Object.entries(keys)) {
        const cur = s.keys[k] || { hits: 0, misses: 0 };
        cur.hits += v.hits || 0;
        cur.misses += v.misses || 0;
        s.keys[k] = cur;
      }
    }
    bumpStreak(s);
    unlockAchievements(s, { wpm, accuracy });
  });
}

function dayStamp(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function bumpStreak(s) {
  const today = dayStamp();
  if (s.streak.lastDay === today) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = dayStamp(y);
  s.streak.count = s.streak.lastDay === yesterday ? (s.streak.count || 0) + 1 : 1;
  s.streak.lastDay = today;
}

function unlockAchievements(s, { wpm, accuracy }) {
  const set = (id) => { if (!s.achievements[id]) s.achievements[id] = Date.now(); };
  if (Object.keys(s.completed).length >= 1) set("first-lesson");
  if ((s.streak.count || 0) >= 3) set("streak-3");
  if ((s.streak.count || 0) >= 7) set("streak-7");
  if (s.totals.chars >= 1000) set("chars-1k");
  if (s.totals.chars >= 10000) set("chars-10k");
  if (wpm >= 30) set("wpm-30");
  if (wpm >= 50) set("wpm-50");
  if (wpm >= 80) set("wpm-80");
  if (accuracy >= 98) set("acc-98");
  const beginner = ["0.1","0.2","0.3","0.4","0.5","0.6","1.1","1.2","1.3","1.4","1.5","1.6","1.7","1.8","1.9","1.10"];
  if (beginner.every((id) => s.completed[id])) set("beginner-course");
}

export function exportProgress() {
  const blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "typeflow-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importProgress(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== "object" || data.version !== 1) {
          reject(new Error("This file is not a TypeFlow progress export."));
          return;
        }
        save({ ...defaultState(), ...data });
        resolve(load());
      } catch {
        reject(new Error("Invalid JSON file."));
      }
    };
    reader.readAsText(file);
  });
}

export function resetProgress() {
  const theme = load().theme;
  const next = defaultState();
  next.theme = theme;
  next.onboardingDone = true;
  return save(next);
}

export function completionPercent(lessonIds) {
  const s = load();
  if (!lessonIds.length) return 0;
  const n = lessonIds.filter((id) => s.completed[id]).length;
  return Math.round((n / lessonIds.length) * 100);
}
