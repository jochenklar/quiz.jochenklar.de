quiz
====

A small browser quiz about the moons of the giant planets. Each round shows the
name of one of the 10 largest moons of Jupiter, Saturn, Uranus, or Neptune, and
you guess which planet it orbits.

- A correct answer increases your **streak**, a wrong one resets it to zero.
- Your current streak and your **best** streak are stored in the browser's
  `localStorage` (keys `moonQuiz.streak` and `moonQuiz.best`).
- After each answer, the correct planet is highlighted and a short fact about
  the moon (its size rank and diameter) is shown.
- Moons are drawn from a shuffled deck, so you see all 40 before any repeats.

It is a plain static site (HTML, CSS, and JavaScript) with no dependencies and
no build step.


Setup
-----

Clone the repository:

```bash
git clone https://github.com/<user>/quiz.git
cd quiz
```

You can open `index.html` directly in a browser, or serve the folder locally:

```bash
make serve             # or: python3 -m http.server 4000
```

and go to <http://localhost:4000>. Use `make serve PORT=8080` to pick another
port.

To publish it with GitHub Pages, go to *Settings → Pages* in the repository,
choose *Deploy from a branch*, and select the `main` branch and the `/ (root)`
folder. All paths are relative, so the site works under
`https://<user>.github.io/quiz/`.


Usage
-----

Click the planet you think the moon belongs to. The next round starts
automatically after a short delay.

| Key             | Action                       |
| --------------- | ---------------------------- |
| `1`–`4`         | Jupiter, Saturn, Uranus, Neptune |
| `Enter`/`Space` | Skip to the next moon        |

To reset your scores, clear the site data in your browser or run
`localStorage.clear()` in the developer console.


Files
-----

| File         | Content                                                   |
| ------------ | --------------------------------------------------------- |
| `index.html` | Page markup                                               |
| `style.css`  | Styles (dark theme, responsive layout)                    |
| `moons.js`   | Moon data: 10 largest moons per planet with diameter (km) |
| `app.js`     | Game logic, scoring, and `localStorage` handling          |

The diameters in `moons.js` are rounded mean values. The sizes of the smaller,
irregular moons are uncertain, so different sources may rank the last few places
differently. Edit the list to change or extend the quiz.
