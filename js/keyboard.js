export const FINGERS = {
  lp: { hand: "left", finger: "pinky", label: "Left pinky", color: "var(--finger-lp)" },
  lr: { hand: "left", finger: "ring", label: "Left ring", color: "var(--finger-lr)" },
  lm: { hand: "left", finger: "middle", label: "Left middle", color: "var(--finger-lm)" },
  li: { hand: "left", finger: "index", label: "Left index", color: "var(--finger-li)" },
  lt: { hand: "left", finger: "thumb", label: "Left thumb", color: "var(--finger-th)" },
  rt: { hand: "right", finger: "thumb", label: "Right thumb", color: "var(--finger-th)" },
  ri: { hand: "right", finger: "index", label: "Right index", color: "var(--finger-ri)" },
  rm: { hand: "right", finger: "middle", label: "Right middle", color: "var(--finger-rm)" },
  rr: { hand: "right", finger: "ring", label: "Right ring", color: "var(--finger-rr)" },
  rp: { hand: "right", finger: "pinky", label: "Right pinky", color: "var(--finger-rp)" }
};

const k = (id, label, finger, row, extra = {}) => ({
  id, label, finger, row, hand: FINGERS[finger].hand, ...extra
});

export const KEYS = {
  "`": k("`", "`", "lp", "number", { shift: "~" }),
  "1": k("1", "1", "lp", "number", { shift: "!" }),
  "2": k("2", "2", "lr", "number", { shift: "@" }),
  "3": k("3", "3", "lm", "number", { shift: "#" }),
  "4": k("4", "4", "li", "number", { shift: "$" }),
  "5": k("5", "5", "li", "number", { shift: "%" }),
  "6": k("6", "6", "ri", "number", { shift: "^" }),
  "7": k("7", "7", "ri", "number", { shift: "&" }),
  "8": k("8", "8", "rm", "number", { shift: "*" }),
  "9": k("9", "9", "rr", "number", { shift: "(" }),
  "0": k("0", "0", "rp", "number", { shift: ")" }),
  "-": k("-", "-", "rp", "number", { shift: "_" }),
  "=": k("=", "=", "rp", "number", { shift: "+" }),
  Backspace: k("Backspace", "⌫", "rp", "number", { wide: "wider" }),
  Tab: k("Tab", "tab", "lp", "top", { wide: "wide" }),
  q: k("q", "Q", "lp", "top"),
  w: k("w", "W", "lr", "top"),
  e: k("e", "E", "lm", "top"),
  r: k("r", "R", "li", "top"),
  t: k("t", "T", "li", "top"),
  y: k("y", "Y", "ri", "top"),
  u: k("u", "U", "ri", "top"),
  i: k("i", "I", "rm", "top"),
  o: k("o", "O", "rr", "top"),
  p: k("p", "P", "rp", "top"),
  "[": k("[", "[", "rp", "top", { shift: "{" }),
  "]": k("]", "]", "rp", "top", { shift: "}" }),
  "\\": k("\\", "\\", "rp", "top", { shift: "|", wide: "wide" }),
  CapsLock: k("CapsLock", "caps", "lp", "home", { wide: "wider" }),
  a: k("a", "A", "lp", "home"),
  s: k("s", "S", "lr", "home"),
  d: k("d", "D", "lm", "home"),
  f: k("f", "F", "li", "home", { bump: true }),
  g: k("g", "G", "li", "home"),
  h: k("h", "H", "ri", "home"),
  j: k("j", "J", "ri", "home", { bump: true }),
  k: k("k", "K", "rm", "home"),
  l: k("l", "L", "rr", "home"),
  ";": k(";", ";", "rp", "home", { shift: ":" }),
  "'": k("'", "'", "rp", "home", { shift: '"' }),
  Enter: k("Enter", "enter", "rp", "home", { wide: "wider" }),
  ShiftLeft: k("ShiftLeft", "shift", "lp", "bottom", { wide: "wider" }),
  z: k("z", "Z", "lp", "bottom"),
  x: k("x", "X", "lr", "bottom"),
  c: k("c", "C", "lm", "bottom"),
  v: k("v", "V", "li", "bottom"),
  b: k("b", "B", "li", "bottom"),
  n: k("n", "N", "ri", "bottom"),
  m: k("m", "M", "ri", "bottom"),
  ",": k(",", ",", "rm", "bottom", { shift: "<" }),
  ".": k(".", ".", "rr", "bottom", { shift: ">" }),
  "/": k("/", "/", "rp", "bottom", { shift: "?" }),
  ShiftRight: k("ShiftRight", "shift", "rp", "bottom", { wide: "wider" }),
  ControlLeft: k("ControlLeft", "ctrl", "lp", "mod", { wide: "wide" }),
  AltLeft: k("AltLeft", "alt", "lp", "mod", { wide: "wide" }),
  " ": k(" ", "space", "rt", "mod", { wide: "space" }),
  AltRight: k("AltRight", "alt", "rp", "mod", { wide: "wide" }),
  ControlRight: k("ControlRight", "ctrl", "rp", "mod", { wide: "wide" })
};

export const ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["ShiftLeft", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "ShiftRight"],
  ["ControlLeft", "AltLeft", " ", "AltRight", "ControlRight"]
];

const SHIFT_MAP = {};
for (const key of Object.values(KEYS)) {
  if (key.shift) SHIFT_MAP[key.shift] = key.id;
}

export function lookupChar(ch) {
  if (ch === "\n") return KEYS.Enter;
  const lower = ch.toLowerCase();
  if (KEYS[ch]) return { ...KEYS[ch], needsShift: false, display: ch };
  if (KEYS[lower] && ch !== lower) {
    return { ...KEYS[lower], needsShift: true, display: ch, shiftSide: KEYS[lower].hand === "left" ? "ShiftRight" : "ShiftLeft" };
  }
  if (SHIFT_MAP[ch]) {
    const base = KEYS[SHIFT_MAP[ch]];
    return { ...base, needsShift: true, display: ch, shiftSide: base.hand === "left" ? "ShiftRight" : "ShiftLeft" };
  }
  return null;
}

export function fingerForChar(ch) {
  const info = lookupChar(ch);
  return info ? FINGERS[info.finger] : null;
}

export function renderKeyboard(el, { interactive = false, onKey } = {}) {
  el.classList.add("kb");
  el.innerHTML = ROWS.map((row) => {
    const keys = row.map((id) => {
      const meta = KEYS[id];
      const cls = ["key", meta.wide || "", meta.bump ? "bump" : ""].filter(Boolean).join(" ");
      return `<button type="button" class="${cls}" data-key="${escapeAttr(id)}" data-finger="${meta.finger}" aria-label="${meta.label}"><span class="cap">${meta.label}</span></button>`;
    }).join("");
    return `<div class="kb-row">${keys}</div>`;
  }).join("");

  if (interactive) {
    el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-key]");
      if (!btn) return;
      onKey?.(btn.dataset.key, KEYS[btn.dataset.key]);
    });
  }
  return el;
}

export function renderHands(el) {
  el.classList.add("hands");
  el.innerHTML = `
    <div class="hand left" aria-hidden="true">
      ${finger("lp","pinky")}${finger("lr","ring")}${finger("lm","mid")}${finger("li","index")}${finger("lt","thumb")}
    </div>
    <div class="hand right" aria-hidden="true">
      ${finger("rt","thumb")}${finger("ri","index")}${finger("rm","mid")}${finger("rr","ring")}${finger("rp","pinky")}
    </div>`;
}

function finger(id, label) {
  return `<div class="finger ${id.endsWith("t") ? "thumb" : ""}" data-id="${id}">${label}</div>`;
}

export function highlightChar(root, ch) {
  clearHighlights(root);
  const info = lookupChar(ch);
  if (!info) return;
  const keyEl = root.querySelector(`[data-key="${cssEscape(info.id)}"]`);
  keyEl?.classList.add("hint");
  if (info.needsShift) root.querySelector(`[data-key="${info.shiftSide}"]`)?.classList.add("hint");
  document.querySelectorAll(`.finger[data-id="${info.finger}"]`).forEach((f) => f.classList.add("on"));
  if (info.needsShift) {
    const shiftFinger = info.shiftSide === "ShiftLeft" ? "lp" : "rp";
    document.querySelectorAll(`.finger[data-id="${shiftFinger}"]`).forEach((f) => f.classList.add("on"));
  }
}

export function flashKey(root, ch, ok) {
  const info = lookupChar(ch) || KEYS[ch];
  if (!info) return;
  const el = root.querySelector(`[data-key="${cssEscape(info.id)}"]`);
  if (!el) return;
  el.classList.add(ok ? "correct" : "wrong", "pressed");
  setTimeout(() => el.classList.remove("correct", "wrong", "pressed"), 160);
}

export function clearHighlights(root) {
  root.querySelectorAll(".key").forEach((el) => el.classList.remove("hint", "active", "correct", "wrong"));
  document.querySelectorAll(".finger").forEach((f) => f.classList.remove("on"));
}

function escapeAttr(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
function cssEscape(s) {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(s);
  return String(s).replace(/"/g, '\\"');
}
