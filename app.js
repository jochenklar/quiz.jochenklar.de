(() => {
  const STORAGE_STREAK = "moonQuiz.streak";
  const STORAGE_BEST = "moonQuiz.best";
  const DELAY_CORRECT = 1200;
  const DELAY_WRONG = 2500;

  // Flatten { planet: [[name, km], ...] } into [{ name, planet, km, rank }]
  const allMoons = Object.entries(MOONS).flatMap(([planet, moons]) =>
    moons.map(([name, km], i) => ({ name, planet, km, rank: i + 1 }))
  );

  const el = {
    streak: document.getElementById("streak"),
    best: document.getElementById("best"),
    moon: document.getElementById("moon"),
    fact: document.getElementById("fact"),
    buttons: [...document.querySelectorAll("#answers button")],
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

  // --- state ---
  let streak = load(STORAGE_STREAK);
  let best = Math.max(load(STORAGE_BEST), streak);
  let answered = false;
  let timer = null;

  function render(bumpEl) {
    el.streak.textContent = streak;
    el.best.textContent = best;
    if (bumpEl) {
      bumpEl.classList.remove("bump");
      void bumpEl.offsetWidth; // restart animation
      bumpEl.classList.add("bump");
    }
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function factFor(moon) {
    const size = moon.km.toLocaleString("en-US");
    const rank = moon.rank === 1 ? "the largest" : `the ${ordinal(moon.rank)} largest`;
    return `${moon.name} is ${rank} moon of ${moon.planet} (${size} km across).`;
  }

  function newRound() {
    clearTimeout(timer);
    timer = null;
    answered = false;
    current = nextMoon();
    el.moon.textContent = current.name;
    el.fact.textContent = " ";
    el.fact.className = "fact";
    for (const b of el.buttons) {
      b.disabled = false;
      b.classList.remove("correct", "wrong");
    }
  }

  function answer(planet) {
    if (answered) return;
    answered = true;

    const correct = planet === current.planet;
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

    el.fact.textContent = (correct ? "✓ " : "✗ ") + factFor(current);
    el.fact.className = "fact " + (correct ? "correct" : "wrong");

    timer = setTimeout(newRound, correct ? DELAY_CORRECT : DELAY_WRONG);
  }

  // --- input ---
  for (const b of el.buttons) {
    b.addEventListener("click", () => answer(b.dataset.planet));
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
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
