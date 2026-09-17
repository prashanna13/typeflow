import { mountChrome, bindProgressTools } from "./app.js";
const page = document.body.dataset.page || "";
const map = { learn: "learn", practice: "practice", test: "test", games: "games", progress: "progress" };
mountChrome(map[page] || "");
bindProgressTools();
