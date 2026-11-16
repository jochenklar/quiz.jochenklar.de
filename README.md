quiz
====

A small comic-style browser quiz about the moons of the giant planets. Each
round shows one of the 10 largest moons of Jupiter, Saturn, Uranus, or Neptune,
with its name and a comic drawing, and you guess which planet it orbits.

- A correct answer increases your **streak**, a wrong one resets it to zero.
- Your current streak and your **best** streak are stored in the browser's
  `localStorage` (keys `moonQuiz.streak` and `moonQuiz.best`).
- After each answer, the correct planet is highlighted and a speech bubble
  shows a fact about the moon, its size rank, diameter, and who discovered it
  and when.
- Moons are drawn from a shuffled deck, so you see all 40 before any repeats.

It is a plain static site (HTML, CSS, and JavaScript) with no dependencies and
no build step. The only external resources are the fonts (Bangers and Comic
Neue), which are loaded from Google Fonts.


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
automatically after a few seconds (the bar in the *Next moon* button shows the
countdown), or click *Next moon* to continue right away.

| Key             | Action                       |
| --------------- | ---------------------------- |
| `1`–`4`         | Jupiter, Saturn, Uranus, Neptune |
| `Enter`/`Space` | Go to the next moon          |

To reset your scores, clear the site data in your browser or run
`localStorage.clear()` in the developer console.


Files
-----

| File         | Content                                                        |
| ------------ | -------------------------------------------------------------- |
| `index.html` | Page markup                                                    |
| `style.css`  | Comic styles (panel, speech bubble, starburst, responsive)     |
| `moons.js`   | Moon data: diameter, discovery, a fact, and the drawing recipe |
| `art.js`     | Generates the comic moon illustrations as inline SVG           |
| `app.js`     | Game logic, scoring, and `localStorage` handling               |


Moon illustrations
------------------

The moon pictures are not image files. `art.js` draws them in the browser as
SVG from the `look` entry of each moon in `moons.js`: a base color, surface
features (craters, cracks, volcanic spots, polar caps, haze, plumes, ...), a
bold ink outline, cel shading with halftone dots, and a highlight. Every moon
always gets the same picture, because the random numbers are seeded with its
name.

The drawings are stylized impressions based on spacecraft images and published
descriptions, e.g. Io's volcanic spots, Europa's cracks, Iapetus' dark and
bright halves, Mimas' giant crater Herschel, Enceladus' tiger stripes and
plumes, or Triton's pinkish polar cap. Most of the small moons have never been
photographed up close, so they are drawn as generic grey or reddish lumpy
rocks.


Data and sources
----------------

Diameters, discovery dates, and facts are taken from publicly available
sources:

- [NASA Science: Solar System moons](https://science.nasa.gov/solar-system/moons/)
- [JPL Solar System Dynamics: planetary satellite physical parameters](https://ssd.jpl.nasa.gov/sats/phys_par/)
- Wikipedia: moons of [Jupiter](https://en.wikipedia.org/wiki/Moons_of_Jupiter),
  [Saturn](https://en.wikipedia.org/wiki/Moons_of_Saturn),
  [Uranus](https://en.wikipedia.org/wiki/Moons_of_Uranus), and
  [Neptune](https://en.wikipedia.org/wiki/Moons_of_Neptune)

The diameters are rounded mean values. The sizes of the smaller, irregular moons
are uncertain, so different sources may rank the last few places differently.
Edit `moons.js` to change or extend the quiz.
