import { pick, repeatJoin, shuffle } from "./engine.js";

const home = ["a", "s", "d", "f", "j", "k", "l", ";"];
const leftHome = ["a", "s", "d", "f"];
const rightHome = ["j", "k", "l", ";"];

function drill(chars, n = 12) {
  return Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join(" ");
}
function clusters(sets, n = 10) {
  return Array.from({ length: n }, () => sets[Math.floor(Math.random() * sets.length)]).join(" ");
}
function words(list, n = 18) {
  return pick(list, n).join(" ");
}
function sentences(list, n = 4) {
  return pick(list, n).join(" ");
}

const homeWords = ["as", "ad", "add", "ask", "all", "fad", "sad", "lad", "fall", "lass", "flask", "salad", "alaska", "falls", "dad", "fads", "jak", "lass", "flak", "salsa"];
const ghWords = ["had", "has", "flag", "glad", "half", "gall", "dash", "flash", "shall", "gash", "hall", "glass", "slash", "gala"];
const topEarly = ["the", "are", "you", "for", "her", "our", "try", "yet", "rate", "true", "your", "four", "here", "there", "after", "year"];
const topFull = ["the", "and", "you", "for", "with", "that", "this", "have", "from", "were", "they", "what", "when", "your", "word", "type", "power", "quiet", "write", "people"];
const bottomWords = ["can", "man", "ban", "van", "mix", "zip", "come", "back", "name", "zinc", "cabin", "comic", "next", "move", "begin"];
const commonWords = ["the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"];
const punctSentences = [
  "Please pause, then continue.",
  "Is this ready?",
  "Yes: we can start now.",
  "Don't stop yet!",
  "It's a quiet morning.",
  "Wait — then try again.",
  "Hello, world.",
  "Type slowly; accuracy first."
];
const realSentences = [
  "I am learning to type without looking at the keyboard.",
  "Practice makes typing easier.",
  "Accuracy is more important than speed.",
  "Keep your fingers on the home row between reaches.",
  "Look at the screen, not at your hands.",
  "A short session every day beats a long session once a week.",
  "Return to F and J after every stretch.",
  "Relax your shoulders and keep your wrists light.",
  "Muscle memory grows from calm, repeated motion.",
  "You do not need to be fast yet. You need to be steady."
];
const school = [
  "The homework is due on Friday morning.",
  "Please write a paragraph about your favorite book.",
  "Science class starts after lunch today.",
  "Remember to bring a pencil and a notebook."
];
const office = [
  "Please find the attached report for review.",
  "Let us schedule a meeting for Thursday afternoon.",
  "I will send the updated draft before noon.",
  "Thanks for your help with this request."
];
const programming = [
  "const total = items.reduce((sum, n) => sum + n, 0);",
  "if (user && user.active) { startLesson(); }",
  "function add(a, b) { return a + b; }",
  "const path = './data/lessons.json';",
  "for (const key of Object.keys(map)) { train(key); }"
];
const email = [
  "Hi Sam, just checking in on the timeline.",
  "Thanks for the note. I will reply in the morning.",
  "Could you send the files when you have a moment?",
  "Looking forward to working together on this."
];
const tech = [
  "A cache stores copies of files so pages load faster.",
  "Local storage keeps progress inside this browser.",
  "A service worker can make a site work offline.",
  "Keyboard events report which physical key was pressed."
];

export const LEVELS = [
  { id: "0", title: "Getting started", blurb: "Sit, place your hands, and find F and J.", keys: "posture" },
  { id: "1", title: "Home row", blurb: "A S D F and J K L ; become home.", keys: "A S D F J K L ;" },
  { id: "2", title: "Home row center", blurb: "Reach inward for G and H.", keys: "G H" },
  { id: "3", title: "Top row", blurb: "Add Q W E R T Y U I O P, a few keys at a time.", keys: "Q–P" },
  { id: "4", title: "Bottom row", blurb: "Z X C V B N M and light punctuation.", keys: "Z–/" },
  { id: "5", title: "All letters", blurb: "Whole alphabet, still lowercase.", keys: "a–z" },
  { id: "6", title: "Capital letters", blurb: "Opposite-hand Shift.", keys: "Shift" },
  { id: "7", title: "Punctuation", blurb: "Stops, quotes, and brackets.", keys: ".,;:'\"?!" },
  { id: "8", title: "Numbers", blurb: "The number row, finger by finger.", keys: "0–9" },
  { id: "9", title: "Symbols", blurb: "Developer and everyday symbols.", keys: "@#$%^&*" },
  { id: "10", title: "Words", blurb: "From clusters to real vocabulary.", keys: "words" },
  { id: "11", title: "Sentences", blurb: "Full lines with spaces and flow.", keys: "sentences" },
  { id: "12", title: "Real world", blurb: "School, office, email, and code.", keys: "life" }
];

export const LESSONS = [
  { id: "0.1", level: "0", title: "Meet the keyboard", kind: "guide", minutes: 3,
    body: "A keyboard is a map, not a puzzle. You will always return to the same eight home keys. The rest of the board is a short reach away. You do not need to memorize the picture. You need a starting place.",
    steps: ["Look at the board once.", "Find the two raised bumps on F and J.", "Those bumps are how you find home without looking."] },
  { id: "0.2", level: "0", title: "Sitting position", kind: "guide", minutes: 3,
    body: "Comfort beats stiffness. Sit far enough that your elbows rest near your sides. Keep your back reasonably straight, feet on the floor, and the screen at eye height if you can.",
    steps: ["Sit back in the chair.", "Relax your shoulders down.", "Keep wrists floating, not planted hard on the desk."] },
  { id: "0.3", level: "0", title: "Hand position", kind: "guide", minutes: 3,
    body: "Left hand covers A S D F. Right hand covers J K L and semicolon. Thumbs rest near the space bar. Fingers stay curved, as if holding a small fruit.",
    steps: ["Curve the fingers.", "Light contact, not a press.", "Thumbs hover over space."] },
  { id: "0.4", level: "0", title: "Finding F and J", kind: "drill", minutes: 4, keys: ["f", "j"],
    intro: "Index fingers live on F and J. Feel the tiny ridges. Those ridges are the whole orientation system.",
    build: () => repeatJoin(["f", "j", "fj", "jf", "f j", "j f"], 16) },
  { id: "0.5", level: "0", title: "Finger zones", kind: "guide", minutes: 4,
    body: "Each finger owns a vertical strip of the keyboard. Your left pinky owns Q A Z and a few neighbors. Your right index owns Y H N plus U J M. You never hunt with the nearest finger. You send the owner.",
    steps: ["Pinkies own the edges.", "Index fingers own two columns each.", "Thumbs own only space."] },
  { id: "0.6", level: "0", title: "Space bar", kind: "drill", minutes: 3, keys: [" ", "f", "j"],
    intro: "Use a thumb for space. Either thumb is fine; pick one and keep it consistent while you learn.",
    build: () => "f j f j fj jf f j f j" },

  { id: "1.1", level: "1", title: "ASDF", kind: "drill", minutes: 6, keys: leftHome,
    intro: "Left hand only. Return to F after every letter.",
    build: () => clusters(["a", "s", "d", "f", "as", "df", "fd", "sa", "asdf", "fdsa"], 18) },
  { id: "1.2", level: "1", title: "JKL;", kind: "drill", minutes: 6, keys: rightHome,
    intro: "Right hand only. The semicolon is a home key, same as A.",
    build: () => clusters(["j", "k", "l", ";", "jk", "l;", "jk l;", "jkl;", ";lkj"], 18) },
  { id: "1.3", level: "1", title: "ASDF JKL;", kind: "drill", minutes: 7, keys: home,
    intro: "Both hands, still on home. No reaching yet.",
    build: () => clusters(["asdf", "jkl;", "asdf jkl;", "fj", "as df jk l;"], 16) },
  { id: "1.4", level: "1", title: "F and J repeats", kind: "drill", minutes: 5, keys: ["f", "j"],
    intro: "Reset drill. If you get lost, find the bumps.",
    build: () => repeatJoin(["f", "j", "ff", "jj", "fj", "jf"], 20) },
  { id: "1.5", level: "1", title: "Left-hand drills", kind: "drill", minutes: 6, keys: leftHome,
    build: () => clusters(["fads", "adds", "as", "sad", "dad", "fall", "salad"], 16) },
  { id: "1.6", level: "1", title: "Right-hand drills", kind: "drill", minutes: 6, keys: rightHome,
    build: () => clusters(["jk", "kl", "ll", "kk", "jkl", ";lk", "l;"], 16) },
  { id: "1.7", level: "1", title: "Home-row alternating", kind: "drill", minutes: 7, keys: home,
    build: () => "f j d k s l a ; f j d k s l a ; fj dk sl a;" },
  { id: "1.8", level: "1", title: "Home-row combinations", kind: "drill", minutes: 7, keys: home,
    build: () => clusters(["ask", "lad", "fall", "flask", "all", "adds", "lass"], 16) },
  { id: "1.9", level: "1", title: "Home-row words", kind: "drill", minutes: 8, keys: home,
    build: () => words(homeWords, 22) },
  { id: "1.10", level: "1", title: "Home-row checkpoint", kind: "checkpoint", minutes: 8, keys: home,
    intro: "Finish this without looking down. Slow is allowed.",
    build: () => words(homeWords, 24) },

  { id: "2.1", level: "2", title: "F G H", kind: "drill", minutes: 6, keys: ["f", "g", "h", "j"],
    intro: "G is a left-index reach. H is a right-index reach. Both return to F and J.",
    build: () => clusters(["fg", "gf", "hj", "jh", "fgh", "hjg", "f g h j"], 18) },
  { id: "2.2", level: "2", title: "J H G", kind: "drill", minutes: 6, keys: ["g", "h", "j"],
    build: () => clusters(["jh", "hg", "gh", "jhg", "ghj"], 16) },
  { id: "2.3", level: "2", title: "G H transitions", kind: "drill", minutes: 6, keys: ["g", "h", ...home],
    build: () => clusters(["gh", "hg", "gag", "had", "flag", "glad", "half"], 16) },
  { id: "2.4", level: "2", title: "Index movement", kind: "drill", minutes: 6, keys: ["f", "g", "h", "j"],
    build: () => "fg hj gf jh f g h j fgf hjh" },
  { id: "2.5", level: "2", title: "Home-row words with G H", kind: "drill", minutes: 8, keys: [...home, "g", "h"],
    build: () => words(ghWords, 22) },

  { id: "3.1", level: "3", title: "R and U", kind: "drill", minutes: 6, keys: ["r", "u", "f", "j"],
    intro: "Left index reaches up to R. Right index reaches up to U.",
    build: () => clusters(["fr", "ju", "ru", "ur", "fur", "jar"], 16) },
  { id: "3.2", level: "3", title: "T and Y", kind: "drill", minutes: 6, keys: ["t", "y", "r", "u"],
    intro: "T is still left index. Y is still right index. Slightly farther than R and U.",
    build: () => clusters(["ft", "jy", "ty", "try", "your", "true"], 16) },
  { id: "3.3", level: "3", title: "E and I", kind: "drill", minutes: 6, keys: ["e", "i", "d", "k"],
    intro: "Middle fingers: E above D, I above K.",
    build: () => clusters(["de", "ki", "ed", "if", "did", "kid"], 16) },
  { id: "3.4", level: "3", title: "W and O", kind: "drill", minutes: 6, keys: ["w", "o", "s", "l"],
    intro: "Ring fingers: W above S, O above L.",
    build: () => clusters(["sw", "lo", "ow", "wow", "low", "slow"], 16) },
  { id: "3.5", level: "3", title: "Q and P", kind: "drill", minutes: 6, keys: ["q", "p", "a", ";"],
    intro: "Pinkies stretch to the corners. Return home every time.",
    build: () => clusters(["aq", "p;", "qp", "pa", "aqua", "pup"], 14) },
  { id: "3.6", level: "3", title: "Top row with home row", kind: "drill", minutes: 8, keys: [...home, "q","w","e","r","t","y","u","i","o","p"],
    build: () => words(topEarly, 22) },
  { id: "3.7", level: "3", title: "Top-row words", kind: "drill", minutes: 8,
    build: () => words(topFull, 24) },

  { id: "4.1", level: "4", title: "V B N M", kind: "drill", minutes: 6, keys: ["v","b","n","m"],
    intro: "Index fingers again: V and B left, N and M right.",
    build: () => clusters(["fv", "fb", "jn", "jm", "vm", "bn", "man", "ban"], 16) },
  { id: "4.2", level: "4", title: "C X Z", kind: "drill", minutes: 6, keys: ["c","x","z"],
    intro: "C middle, X ring, Z pinky — all left hand, all below home.",
    build: () => clusters(["dc", "sx", "az", "cz", "wax", "czar"], 14) },
  { id: "4.3", level: "4", title: "Comma, period, slash", kind: "drill", minutes: 6, keys: [",", ".", "/"],
    intro: "Right hand: comma under K, period under L, slash under semicolon.",
    build: () => "k, l. ;/ , . / , . / k, l." },
  { id: "4.4", level: "4", title: "Bottom-row words", kind: "drill", minutes: 8,
    build: () => words(bottomWords, 22) },

  { id: "5.1", level: "5", title: "Mixed letters", kind: "drill", minutes: 8,
    build: () => words(commonWords, 28) },
  { id: "5.2", level: "5", title: "Common English", kind: "drill", minutes: 8,
    build: () => words(commonWords, 32) },
  { id: "5.3", level: "5", title: "Letter checkpoint", kind: "checkpoint", minutes: 8,
    intro: "All letters. Keep eyes up.",
    build: () => words(commonWords, 30) },

  { id: "6.1", level: "6", title: "Left-hand capitals", kind: "drill", minutes: 6, keys: ["A","S","D","F"],
    intro: "Hold Right Shift with the right pinky, then type a left-hand letter.",
    build: () => "A S D F As Ad Ask All" },
  { id: "6.2", level: "6", title: "Right-hand capitals", kind: "drill", minutes: 6,
    intro: "Hold Left Shift with the left pinky for J K L and the rest of the right side.",
    build: () => "J K L Hello World July" },
  { id: "6.3", level: "6", title: "Names and titles", kind: "drill", minutes: 7,
    build: () => "Hello World Typing Practice TypeFlow Home Row" },

  { id: "7.1", level: "7", title: "Period and comma", kind: "drill", minutes: 6,
    build: () => "Yes, I can. No, not yet. Slow, then sure." },
  { id: "7.2", level: "7", title: "Question and exclaim", kind: "drill", minutes: 6,
    build: () => "Ready? Yes! Now? Wait! Type this?" },
  { id: "7.3", level: "7", title: "Quotes and apostrophes", kind: "drill", minutes: 6,
    build: () => "It's fine. Don't rush. \"Keep going.\" I'm here." },
  { id: "7.4", level: "7", title: "Colons and semicolons", kind: "drill", minutes: 5,
    build: () => "Wait; then go. Note: accuracy first; speed later." },
  { id: "7.5", level: "7", title: "Brackets", kind: "drill", minutes: 6,
    build: () => "(home) [row] {set} (a) [b] {c}" },
  { id: "7.6", level: "7", title: "Punctuation lines", kind: "drill", minutes: 8,
    build: () => sentences(punctSentences, 6) },

  { id: "8.1", level: "8", title: "Left numbers 1–5", kind: "drill", minutes: 6, keys: ["1","2","3","4","5"],
    intro: "Pinky 1, ring 2, middle 3, index 4 and 5.",
    build: () => drill(["1","2","3","4","5","12","34","45"], 16) },
  { id: "8.2", level: "8", title: "Right numbers 6–0", kind: "drill", minutes: 6, keys: ["6","7","8","9","0"],
    intro: "Index 6 and 7, middle 8, ring 9, pinky 0.",
    build: () => drill(["6","7","8","9","0","67","89","70"], 16) },
  { id: "8.3", level: "8", title: "Number mix", kind: "drill", minutes: 7,
    build: () => "10 23 45 67 89 2026 404 1024 17 90" },
  { id: "8.4", level: "8", title: "Dates and counts", kind: "drill", minutes: 7,
    build: () => "On 12 May 2026 we typed 1800 characters in 15 minutes." },

  { id: "9.1", level: "9", title: "Email and money", kind: "drill", minutes: 6,
    intro: "Shift combinations: @ is Shift+2, $ is Shift+4, % is Shift+5.",
    build: () => "sam@site.com $12 50% 100% user@mail.org" },
  { id: "9.2", level: "9", title: "Math symbols", kind: "drill", minutes: 6,
    build: () => "1+2=3 8*8=64 10-3=7 a_b n^2 x=y" },
  { id: "9.3", level: "9", title: "Programming symbols", kind: "drill", minutes: 8,
    build: () => "const x = (a && b) || c; arr[0] = { ok: true }; path = `./src`;" },
  { id: "9.4", level: "9", title: "Paths and pipes", kind: "drill", minutes: 6,
    build: () => "C:\\\\Users\\\\Sam /usr/bin foo | bar ~./cache `" },

  { id: "10.1", level: "10", title: "Short words", kind: "drill", minutes: 8,
    build: () => words(commonWords.filter((w) => w.length <= 4), 30) },
  { id: "10.2", level: "10", title: "Medium words", kind: "drill", minutes: 8,
    build: () => words(commonWords.filter((w) => w.length >= 5), 26) },
  { id: "10.3", level: "10", title: "Mixed vocabulary", kind: "drill", minutes: 8,
    build: () => words(commonWords, 32) },

  { id: "11.1", level: "11", title: "Easy sentences", kind: "drill", minutes: 8,
    build: () => sentences(realSentences, 5) },
  { id: "11.2", level: "11", title: "Steady sentences", kind: "drill", minutes: 8,
    build: () => sentences(realSentences, 6) },
  { id: "11.3", level: "11", title: "Paragraph flow", kind: "drill", minutes: 10,
    build: () => realSentences.slice(0, 6).join(" ") },

  { id: "12.1", level: "12", title: "School", kind: "drill", minutes: 8, category: "school",
    build: () => sentences(school, 4) },
  { id: "12.2", level: "12", title: "Office", kind: "drill", minutes: 8, category: "office",
    build: () => sentences(office, 4) },
  { id: "12.3", level: "12", title: "Email", kind: "drill", minutes: 8, category: "email",
    build: () => sentences(email, 4) },
  { id: "12.4", level: "12", title: "Programming", kind: "drill", minutes: 8, category: "programming",
    build: () => programming.join(" ") },
  { id: "12.5", level: "12", title: "Technology", kind: "drill", minutes: 8, category: "technology",
    build: () => sentences(tech, 4) },
  { id: "12.6", level: "12", title: "Everyday conversation", kind: "drill", minutes: 8,
    build: () => "How was your day? I am heading out soon. See you after lunch. That sounds good to me." }
];

export const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First lesson", hint: "Finish any lesson." },
  { id: "streak-3", title: "3-day streak", hint: "Practice on three different days." },
  { id: "streak-7", title: "7-day streak", hint: "A full week of showing up." },
  { id: "chars-1k", title: "1,000 characters", hint: "Type a thousand characters in total." },
  { id: "chars-10k", title: "10,000 characters", hint: "Keep going." },
  { id: "wpm-30", title: "30 WPM", hint: "Hit 30 words per minute." },
  { id: "wpm-50", title: "50 WPM", hint: "A solid everyday pace." },
  { id: "wpm-80", title: "80 WPM", hint: "Fast and still in control." },
  { id: "acc-98", title: "98% accuracy", hint: "Almost no misses in a session." },
  { id: "beginner-course", title: "Beginner course", hint: "Complete getting started and the home row." }
];

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id);
}

export function lessonsForLevel(levelId) {
  return LESSONS.filter((l) => l.level === levelId);
}

export function nextLesson(id) {
  const i = LESSONS.findIndex((l) => l.id === id);
  return LESSONS[i + 1] || null;
}

export function prevLesson(id) {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i > 0 ? LESSONS[i - 1] : null;
}

export function exerciseFor(lesson) {
  if (lesson.build) return lesson.build();
  return lesson.intro || "";
}

export function weakKeyExercise(stats, n = 40) {
  const ranked = Object.entries(stats || {})
    .map(([k, v]) => {
      const total = (v.hits || 0) + (v.misses || 0);
      const acc = total ? v.hits / total : 1;
      return { k, acc, total };
    })
    .filter((x) => x.total >= 6 && x.k.length === 1)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 5)
    .map((x) => x.k);
  const keys = ranked.length ? ranked : ["q", "p", "z", "x", ";"];
  const pool = [];
  for (let i = 0; i < n; i++) {
    const a = keys[i % keys.length];
    const b = keys[(i + 1) % keys.length];
    pool.push(i % 3 === 0 ? a + b : a);
  }
  return pool.join(" ");
}

export const TEST_BANKS = {
  words: commonWords,
  sentences: realSentences,
  paragraph: [realSentences.join(" ")],
  programming,
  numbers: ["1024", "2048", "3.14", "17", "90", "2026", "404", "503", "8080", "443"],
  punctuation: punctSentences,
  school,
  office,
  email,
  technology: tech
};

export function generateTest(kind, minutes) {
  const bank = TEST_BANKS[kind] || commonWords;
  if (kind === "paragraph") return realSentences.join(" ");
  if (kind === "programming") return shuffle(programming).join(" ");
  if (kind === "sentences" || TEST_BANKS[kind] && kind !== "words" && kind !== "numbers") {
    return shuffle(bank).join(" ");
  }
  const count = Math.max(40, minutes * 40);
  const out = [];
  for (let i = 0; i < count; i++) out.push(bank[i % bank.length]);
  return shuffle(out).join(" ");
}
