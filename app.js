(() => {
  const STORAGE_STREAK = "moonQuiz.streak";
  const STORAGE_BEST = "moonQuiz.best";
  const DELAY_CORRECT = 3000;
  const DELAY_WRONG = 5000;
  const WORDS_CORRECT = ["POW!", "BAM!", "ZAP!", "KAPOW!", "BOOM!", "WHAM!"];
  const WORDS_WRONG = ["OOPS!", "WHOOPS!", "NOPE!", "ARGH!", "UH-OH!"];

  // Flatten { planet: [moon, ...] } into [{ ...moon, planet, rank }]
  const allMoons = Object.entries(MOONS).flatMap(([planet, moons]) =>
    moons.map((moon, i) => ({ ...moon, planet, rank: i + 1 }))
  );

  const el = {
    streak: document.getElementById("streak"),
    best: document.getElementById("best"),
    art: document.getElementById("art"),
    moon: document.getElementById("moon"),
    burst: document.getElementById("burst"),
    burstText: document.getElementById("burst-text"),
    bubble: document.getElementById("bubble"),
    fact: document.getElementById("fact"),
    meta: document.getElementById("meta"),
    answers: document.getElementById("answers"),
    buttons: [...document.querySelectorAll("#answers button")],
    next: document.getElementById("next"),
  };

  // --- storage (may be unavailable, e.g. in private mode) ---
  function load(key) {
    try {
      const n = parseInt(localStorage.getItem(key), 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      /* ignore */
    }
  }

  // --- shuffled deck: every moon once before any repeats ---
  let deck = [];
  let current = null;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function nextMoon() {
    if (deck.length === 0) {
      deck = shuffle([...allMoons]);
      // avoid the same moon twice in a row across deck boundaries
      if (current && deck[deck.length - 1] === current) {
        [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
      }
    }
    return deck.pop();
  }

  // --- helpers ---
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function restartAnimation(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function metaFor(moon) {
    const size = moon.km.toLocaleString("en-US");
    const rank = moon.rank === 1 ? "Largest" : `${ordinal(moon.rank)} largest`;
    return `${rank} moon of ${moon.planet} · ${size} km across · found in ${moon.year} by ${moon.by}`;
  }

  // --- state ---
  let streak = load(STORAGE_STREAK);
  let best = Math.max(load(STORAGE_BEST), streak);
  let answered = false;
  let timer = null;

  function render(bumpEl) {
    el.streak.textContent = streak;
    el.best.textContent = best;
    if (bumpEl) restartAnimation(bumpEl, "bump");
  }

  function newRound() {
    clearTimeout(timer);
    timer = null;
    answered = false;
    current = nextMoon();

    el.art.innerHTML = MoonArt.svg(current);
    restartAnimation(el.art, "enter");
    el.moon.textContent = current.name;

    el.burst.hidden = true;
    el.bubble.classList.remove("show");
    el.fact.textContent = "Which planet does this moon orbit?";
    el.meta.textContent = "Pick one below to keep your streak going!";
    el.next.disabled = true;
    el.next.classList.remove("run");
    el.answers.classList.remove("answered");
    for (const b of el.buttons) {
      b.disabled = false;
      b.classList.remove("correct", "wrong");
    }
  }

  function answer(planet) {
    if (answered) return;
    answered = true;

    const correct = planet === current.planet;
    el.answers.classList.add("answered");
    for (const b of el.buttons) {
      b.disabled = true;
      if (b.dataset.planet === current.planet) b.classList.add("correct");
      else if (b.dataset.planet === planet) b.classList.add("wrong");
    }

    if (correct) {
      streak++;
      const newBest = streak > best;
      if (newBest) best = streak;
      render(newBest ? el.best : el.streak);
    } else {
      streak = 0;
      render();
    }
    save(STORAGE_STREAK, streak);
    save(STORAGE_BEST, best);

    // POW! burst
    el.burstText.textContent = pick(correct ? WORDS_CORRECT : WORDS_WRONG);
    el.burst.classList.toggle("wrong", !correct);
    el.burst.hidden = false;

    // speech bubble with the fact
    const verdict = document.createElement("span");
    verdict.className = "verdict " + (correct ? "correct" : "wrong");
    verdict.textContent = correct ? "Correct!" : `It's ${current.planet}!`;
    el.fact.replaceChildren(verdict, document.createTextNode(current.fact));
    el.meta.textContent = metaFor(current);
    el.bubble.classList.add("show");

    // next button with countdown bar
    const delay = correct ? DELAY_CORRECT : DELAY_WRONG;
    el.next.style.setProperty("--delay", `${delay}ms`);
    el.next.disabled = false;
    restartAnimation(el.next, "run");
    timer = setTimeout(newRound, delay);
  }

  // --- input ---
  for (const b of el.buttons) {
    b.addEventListener("click", () => answer(b.dataset.planet));
  }

  el.next.addEventListener("click", newRound);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    const i = ["1", "2", "3", "4"].indexOf(e.key);
    if (i !== -1) {
      e.preventDefault();
      answer(el.buttons[i].dataset.planet);
    } else if (answered && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      newRound();
    }
  });

  render();
  newRound();
})();
