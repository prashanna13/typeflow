import { mountChrome, toast } from "./app.js";
import { update, recordSession } from "./storage.js";
import { TEST_BANKS } from "./lessons.js";

mountChrome("games");

const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const stage = document.getElementById("stage");
const scoreEl = document.getElementById("g-score");
const livesEl = document.getElementById("g-lives");
const statusEl = document.getElementById("g-status");
let running = null;

function hud(score, lives, extra = "") {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  statusEl.textContent = extra;
}

function stopGame() {
  running?.();
  running = null;
  stage.innerHTML = "";
}

function saveGame(name, score) {
  update((s) => {
    s.games[name] = Math.max(s.games[name] || 0, score);
  });
  recordSession({ wpm: 0, accuracy: 100, errors: 0, correct: score, chars: score, timeMs: 0, keys: {} });
}

function fallingKeys() {
  stopGame();
  let score = 0, lives = 5, items = [];
  hud(score, lives, "Press the falling letters.");
  const spawn = () => {
    const ch = letters[Math.floor(Math.random() * letters.length)];
    const el = document.createElement("div");
    el.className = "fall-letter";
    el.textContent = ch;
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.top = "0px";
    stage.appendChild(el);
    items.push({ ch, el, y: 0, v: 0.8 + Math.random() * 0.7 });
  };
  const sp = setInterval(spawn, 900);
  spawn();
  let last = performance.now();
  let raf;
  const step = (t) => {
    const dt = Math.min(32, t - last); last = t;
    items.forEach((it) => {
      it.y += it.v * dt * 0.08;
      it.el.style.top = `${it.y}px`;
    });
    items = items.filter((it) => {
      if (it.y > stage.clientHeight - 20) {
        it.el.remove();
        lives -= 1;
        hud(score, lives, "Missed one — try again.");
        if (lives <= 0) end();
        return false;
      }
      return true;
    });
    if (running) raf = requestAnimationFrame(step);
  };
  const onKey = (e) => {
    const i = items.findIndex((it) => it.ch === e.key.toLowerCase());
    if (i >= 0) {
      items[i].el.remove();
      items.splice(i, 1);
      score += 1;
      hud(score, lives, "Nice.");
    }
  };
  const end = () => {
    stopGame();
    saveGame("falling", score);
    toast(`Falling Keys finished · ${score}`);
    hud(score, lives, "Game over. Press a mode to play again.");
  };
  window.addEventListener("keydown", onKey);
  running = () => {
    clearInterval(sp);
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
  };
  raf = requestAnimationFrame(step);
}

function wordSprint() {
  stopGame();
  let score = 0, lives = 3, left = 45;
  const words = TEST_BANKS.words;
  let current = words[Math.floor(Math.random() * words.length)];
  let buf = "";
  const wordEl = document.createElement("div");
  wordEl.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;font-family:var(--mono);font-size:42px;";
  stage.appendChild(wordEl);
  const draw = () => {
    wordEl.innerHTML = `<span>${current}</span>`;
    hud(score, lives, `${left}s · type the word`);
  };
  draw();
  const clock = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      stopGame();
      saveGame("sprint", score);
      toast(`Word Sprint · ${score} words`);
      hud(score, lives, "Time. Play again when you're ready.");
    } else draw();
  }, 1000);
  const onKey = (e) => {
    if (e.key === "Backspace") { buf = buf.slice(0, -1); return; }
    if (e.key.length !== 1) return;
    buf += e.key.toLowerCase();
    if (buf === current) {
      score += 1;
      buf = "";
      current = words[Math.floor(Math.random() * words.length)];
      draw();
    } else if (!current.startsWith(buf)) {
      lives -= 1;
      buf = "";
      hud(score, lives, "Almost — start the word again.");
      if (lives <= 0) {
        stopGame();
        saveGame("sprint", score);
        toast("Sprint ended.");
      }
    }
  };
  window.addEventListener("keydown", onKey);
  running = () => {
    clearInterval(clock);
    window.removeEventListener("keydown", onKey);
  };
}

function accuracyChallenge() {
  stopGame();
  const seq = Array.from({ length: 24 }, () => letters[Math.floor(Math.random() * 26)]).join(" ");
  let i = 0, score = 0;
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;padding:24px;font-family:var(--mono);font-size:28px;text-align:center;";
  stage.appendChild(el);
  const draw = () => {
    el.innerHTML = seq.split("").map((ch, idx) => `<span style="color:${idx < i ? 'var(--success)' : idx === i ? 'var(--accent-2)' : 'var(--muted)'}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    hud(score, 1, "One miss ends the run.");
  };
  draw();
  const onKey = (e) => {
    if (e.key.length !== 1 && e.key !== " ") return;
    const expect = seq[i];
    if (e.key === expect) {
      i += 1; score += 1; draw();
      if (i >= seq.length) {
        stopGame();
        saveGame("accuracy", score);
        toast("Clean run.");
        hud(score, 1, "Perfect line.");
      }
    } else {
      stopGame();
      saveGame("accuracy", score);
      toast("Miss. That's the whole game — try again.");
      hud(score, 0, "Missed. Accuracy Challenge resets on an error.");
    }
  };
  window.addEventListener("keydown", onKey);
  running = () => window.removeEventListener("keydown", onKey);
}

function keyHunter() {
  stopGame();
  let score = 0, round = 0, target = "a";
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;text-align:center;";
  stage.appendChild(el);
  const next = () => {
    target = letters[Math.floor(Math.random() * 26)];
    el.innerHTML = `<div><p class="muted">Find this key</p><div style="font-size:88px;font-family:var(--mono);font-weight:700">${target.toUpperCase()}</div></div>`;
    hud(score, 5 - round, "Don't look at the keyboard if you can help it.");
  };
  next();
  const onKey = (e) => {
    if (e.key.toLowerCase() === target) {
      score += 1;
      next();
      if (score >= 20) {
        stopGame();
        saveGame("hunter", score);
        toast("Key Hunter complete.");
      }
    } else {
      round += 1;
      hud(score, 5 - round, "Almost — that wasn't the one.");
      if (round >= 5) {
        stopGame();
        saveGame("hunter", score);
        toast("Hunter ended.");
      }
    }
  };
  window.addEventListener("keydown", onKey);
  running = () => window.removeEventListener("keydown", onKey);
}

function defender() {
  stopGame();
  let score = 0, lives = 3, items = [], buf = "";
  const words = TEST_BANKS.words.filter((w) => w.length >= 3 && w.length <= 7);
  const spawn = () => {
    const w = words[Math.floor(Math.random() * words.length)];
    const el = document.createElement("div");
    el.className = "defend-word";
    el.textContent = w;
    el.style.left = `${8 + Math.random() * 70}%`;
    el.style.top = "0px";
    stage.appendChild(el);
    items.push({ w, el, y: 0, v: 0.35 + Math.random() * 0.25 });
  };
  const sp = setInterval(spawn, 1600);
  spawn();
  let raf, last = performance.now();
  const step = (t) => {
    const dt = Math.min(32, t - last); last = t;
    items.forEach((it) => {
      it.y += it.v * dt * 0.08;
      it.el.style.top = `${it.y}px`;
    });
    items = items.filter((it) => {
      if (it.y > stage.clientHeight - 28) {
        it.el.remove();
        lives -= 1;
        hud(score, lives, "A word got through.");
        if (lives <= 0) end();
        return false;
      }
      return true;
    });
    if (running) raf = requestAnimationFrame(step);
  };
  const onKey = (e) => {
    if (e.key === "Backspace") { buf = buf.slice(0, -1); return; }
    if (e.key.length !== 1) return;
    buf += e.key.toLowerCase();
    const hit = items.findIndex((it) => it.w === buf);
    if (hit >= 0) {
      items[hit].el.remove();
      items.splice(hit, 1);
      score += 1;
      buf = "";
      hud(score, lives, "Cleared.");
    } else if (!items.some((it) => it.w.startsWith(buf))) {
      buf = e.key.toLowerCase();
    }
  };
  const end = () => {
    stopGame();
    saveGame("defender", score);
    toast(`Keyboard Defender · ${score}`);
  };
  hud(score, lives, "Type the incoming words.");
  window.addEventListener("keydown", onKey);
  running = () => {
    clearInterval(sp);
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
  };
  raf = requestAnimationFrame(step);
}

const games = { falling: fallingKeys, sprint: wordSprint, accuracy: accuracyChallenge, hunter: keyHunter, defender };
document.querySelectorAll("[data-game]").forEach((b) => {
  b.addEventListener("click", () => games[b.dataset.game]?.());
});
hud(0, 0, "Pick a game. Use a physical keyboard.");
