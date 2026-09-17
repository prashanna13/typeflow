import { mountChrome } from "./app.js";
import { renderKeyboard, renderHands, highlightChar, FINGERS, KEYS } from "./keyboard.js";

mountChrome("learn");
const kb = document.getElementById("kb");
const hands = document.getElementById("hands");
const panel = document.getElementById("panel");
renderKeyboard(kb, { interactive: true, onKey: show });
renderHands(hands);

function show(id) {
  const m = KEYS[id];
  if (!m) return;
  highlightChar(kb, id === " " ? " " : (id.length === 1 ? id : id));
  const f = FINGERS[m.finger];
  panel.innerHTML = `
    <div class="tiny muted">Key</div>
    <div class="big">${m.label}</div>
    <p>Finger: <strong>${f.label}</strong></p>
    <p class="muted">Hand: ${m.hand} · Row: ${m.row}${m.bump ? " · This key has a tactile bump so you can find it without looking." : ""}</p>
    ${m.shift ? `<p class="muted">Shift produces <strong>${m.shift}</strong>. Use the opposite-hand Shift.</p>` : ""}
  `;
}

kb.addEventListener("mouseover", (e) => {
  const btn = e.target.closest("[data-key]");
  if (btn) show(btn.dataset.key);
});
show("f");
