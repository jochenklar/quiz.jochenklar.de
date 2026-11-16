// The 10 largest moons of each giant planet, ordered by mean diameter (km).
//
// Sizes, discovery data and facts come from public sources (NASA Science,
// JPL Solar System Dynamics, Wikipedia). Diameters are rounded; the sizes of
// small irregular moons are uncertain.
//
// `look` describes the comic illustration drawn by art.js. It is a stylized
// impression based on spacecraft images and published descriptions. Many of
// the small moons have never been photographed up close, so for those the
// drawing is a generic grey or reddish lumpy rock.
//
//   base      main surface color
//   shape     "round" (default) or "irregular"
//   irr       how lumpy an irregular shape is (0–0.35)
//   stretch   how elongated an irregular shape is (1 = not at all)
//   f         surface features, see art.js for the available types

const MOONS = {
  Jupiter: [
    {
      name: "Ganymede", km: 5268, year: 1610, by: "Galileo Galilei",
      fact: "The largest moon in the Solar System, and the only one with its own magnetic field.",
      look: { base: "#a49685", f: [
        ["patches", { n: 5, size: 0.42, color: "#6f6152" }],
        ["lines", { n: 6, w: 3, color: "#d3c9b9" }],
        ["craters", { n: 5 }],
        ["bright", { n: 5, color: "#f1ebe1" }],
      ] },
    },
    {
      name: "Callisto", km: 4821, year: 1610, by: "Galileo Galilei",
      fact: "Its ancient surface is one of the most heavily cratered in the Solar System.",
      look: { base: "#5e5246", f: [
        ["ring", { x: -0.2, y: 0.15, size: 0.45, color: "#857766" }],
        ["craters", { n: 16, color: "#40372e" }],
        ["bright", { n: 16, color: "#e3dccf" }],
      ] },
    },
    {
      name: "Io", km: 3643, year: 1610, by: "Galileo Galilei",
      fact: "The most volcanically active body in the Solar System.",
      look: { base: "#e6cf55", f: [
        ["patches", { n: 4, size: 0.35, color: "#cba63a" }],
        ["patches", { n: 2, size: 0.25, color: "#f5efcf" }],
        ["spots", { n: 14, colors: ["#d9792e", "#b8452a", "#3b2a1c", "#f4efd2"] }],
      ] },
    },
    {
      name: "Europa", km: 3122, year: 1610, by: "Galileo Galilei",
      fact: "Its icy crust most likely hides a global ocean of liquid water.",
      look: { base: "#e8dcc4", f: [
        ["patches", { n: 4, size: 0.4, color: "#c9a98a", opacity: 0.7 }],
        ["lines", { n: 11, w: 2.5, color: "#94523a" }],
        ["craters", { n: 1, min: 0.08, max: 0.1 }],
      ] },
    },
    {
      name: "Amalthea", km: 167, year: 1892, by: "Edward Emerson Barnard",
      fact: "One of the reddest objects in the Solar System.",
      look: { base: "#b54a33", shape: "irregular", irr: 0.25, stretch: 1.35, f: [
        ["patches", { n: 2, size: 0.25, color: "#d9824f" }],
        ["craters", { n: 5, color: "#8a3524" }],
      ] },
    },
    {
      name: "Himalia", km: 140, year: 1904, by: "Charles Dillon Perrine",
      fact: "The largest of Jupiter's irregular moons, about 11 million km from the planet.",
      look: { base: "#8d8881", shape: "irregular", irr: 0.18, stretch: 1.15, f: [["craters", { n: 6 }]] },
    },
    {
      name: "Thebe", km: 99, year: 1979, by: "the Voyager 1 team",
      fact: "Dust knocked off its surface feeds Jupiter's faint Thebe gossamer ring.",
      look: { base: "#7a4a3a", shape: "irregular", irr: 0.22, stretch: 1.25, f: [
        ["bigCrater", { x: 0.25, y: -0.1, size: 0.4 }],
        ["craters", { n: 4 }],
      ] },
    },
    {
      name: "Elara", km: 80, year: 1905, by: "Charles Dillon Perrine",
      fact: "It takes about 259 days to travel once around Jupiter.",
      look: { base: "#938b83", shape: "irregular", irr: 0.2, stretch: 1.1, f: [["craters", { n: 5 }]] },
    },
    {
      name: "Pasiphae", km: 58, year: 1908, by: "Philibert Jacques Melotte",
      fact: "It orbits Jupiter backwards (retrograde), more than 23 million km out.",
      look: { base: "#7f7870", shape: "irregular", irr: 0.22, stretch: 1.2, f: [["craters", { n: 5 }]] },
    },
    {
      name: "Carme", km: 46, year: 1938, by: "Seth Barnes Nicholson",
      fact: "It orbits backwards and gives its name to a whole family of moons, the Carme group.",
      look: { base: "#8a6b5e", shape: "irregular", irr: 0.2, stretch: 1.15, f: [["craters", { n: 5 }]] },
    },
  ],

  Saturn: [
    {
      name: "Titan", km: 5150, year: 1655, by: "Christiaan Huygens",
      fact: "Bigger than Mercury, with a thick atmosphere and lakes of liquid methane.",
      look: { base: "#d8973a", f: [
        ["haze", { color: "#f0c36a" }],
        ["bands", { colors: ["#e3a84a", "#c9842d", "#e8b459"] }],
        ["patches", { n: 3, size: 0.35, color: "#a8692a", opacity: 0.6 }],
      ] },
    },
    {
      name: "Rhea", km: 1527, year: 1672, by: "Giovanni Domenico Cassini",
      fact: "Saturn's second-largest moon, a heavily cratered ball of ice and rock.",
      look: { base: "#cdc8bf", f: [
        ["lines", { n: 3, w: 2, color: "#eeebe5" }],
        ["craters", { n: 16, color: "#9e978c" }],
        ["bright", { n: 3, color: "#ffffff" }],
      ] },
    },
    {
      name: "Iapetus", km: 1469, year: 1671, by: "Giovanni Domenico Cassini",
      fact: "Two-toned: one side is as dark as coal, the other as bright as snow.",
      look: { base: "#e4ddcf", f: [
        ["half", { color: "#3a2a1f" }],
        ["craters", { n: 8, color: "#a59d8f" }],
      ] },
    },
    {
      name: "Dione", km: 1123, year: 1684, by: "Giovanni Domenico Cassini",
      fact: "Bright ice cliffs on its trailing side look like wispy streaks from afar.",
      look: { base: "#c6c1b8", f: [
        ["craters", { n: 10, color: "#9a948a" }],
        ["lines", { n: 7, w: 3, color: "#f8f6f1" }],
      ] },
    },
    {
      name: "Tethys", km: 1062, year: 1684, by: "Giovanni Domenico Cassini",
      fact: "Home to Odysseus, a crater about 450 km wide, and the huge Ithaca Chasma canyon.",
      look: { base: "#e2dfd8", f: [
        ["lines", { n: 1, w: 6, color: "#aaa499" }],
        ["bigCrater", { x: 0.28, y: -0.25, size: 0.45, color: "#bdb8ae" }],
        ["craters", { n: 8 }],
      ] },
    },
    {
      name: "Enceladus", km: 504, year: 1789, by: "William Herschel",
      fact: "It shoots geysers of water ice into space from cracks called tiger stripes.",
      look: { base: "#f4f6f9", f: [
        ["plume", { color: "#cfe6f7" }],
        ["craters", { n: 3, color: "#d3d9e1", max: 0.08 }],
        ["stripes", { n: 4, color: "#6fa9d3" }],
      ] },
    },
    {
      name: "Mimas", km: 396, year: 1789, by: "William Herschel",
      fact: "Its giant crater Herschel makes it look like the Death Star from Star Wars.",
      look: { base: "#bfbbb3", f: [
        ["craters", { n: 12 }],
        ["bigCrater", { x: -0.3, y: 0, size: 0.55, color: "#8e8a82" }],
      ] },
    },
    {
      name: "Hyperion", km: 270, year: 1848, by: "W. C. Bond, G. P. Bond and W. Lassell",
      fact: "A sponge-like moon that tumbles chaotically as it orbits Saturn.",
      look: { base: "#b39c78", shape: "irregular", irr: 0.3, stretch: 1.25, f: [
        ["craters", { n: 22, color: "#5e4a33", min: 0.08, max: 0.2 }],
      ] },
    },
    {
      name: "Phoebe", km: 213, year: 1899, by: "William Henry Pickering",
      fact: "It orbits backwards and is probably a captured object from the outer Solar System.",
      look: { base: "#4a433d", shape: "irregular", irr: 0.12, stretch: 1.05, f: [
        ["craters", { n: 10, color: "#2c2723" }],
        ["bright", { n: 5, color: "#8f877e" }],
      ] },
    },
    {
      name: "Janus", km: 179, year: 1966, by: "Audouin Dollfus",
      fact: "It shares an orbit with Epimetheus, and the two swap places about every four years.",
      look: { base: "#b9b3a9", shape: "irregular", irr: 0.2, stretch: 1.2, f: [["craters", { n: 6 }]] },
    },
  ],

  Uranus: [
    {
      name: "Titania", km: 1577, year: 1787, by: "William Herschel",
      fact: "Uranus's largest moon, scarred by enormous canyons.",
      look: { base: "#a59c93", f: [
        ["craters", { n: 10, color: "#7d756c" }],
        ["lines", { n: 3, w: 4, color: "#6b625a", ink: true }],
        ["bright", { n: 4, color: "#ddd6cd" }],
      ] },
    },
    {
      name: "Oberon", km: 1523, year: 1787, by: "William Herschel",
      fact: "The outermost of Uranus's five major moons, with dark-floored craters.",
      look: { base: "#978a80", f: [
        ["craters", { n: 12, color: "#4e443d" }],
        ["bright", { n: 4, color: "#d9d0c6" }],
      ] },
    },
    {
      name: "Umbriel", km: 1169, year: 1851, by: "William Lassell",
      fact: "The darkest of Uranus's large moons, with a mysterious bright ring called Wunda.",
      look: { base: "#5c5855", f: [
        ["craters", { n: 10, color: "#45413e" }],
        ["ring", { x: 0.05, y: -0.62, size: 0.22, color: "#e4ded3" }],
      ] },
    },
    {
      name: "Ariel", km: 1158, year: 1851, by: "William Lassell",
      fact: "The brightest of Uranus's large moons, crisscrossed by long rift valleys.",
      look: { base: "#cdc8c2", f: [
        ["lines", { n: 5, w: 4, color: "#8e8780", ink: true }],
        ["craters", { n: 6 }],
      ] },
    },
    {
      name: "Miranda", km: 472, year: 1948, by: "Gerard Kuiper",
      fact: "Home to Verona Rupes, possibly the tallest cliff in the Solar System (about 20 km).",
      look: { base: "#b7b1aa", f: [
        ["patches", { n: 3, size: 0.45, color: "#8e877f" }],
        ["lines", { n: 9, w: 2, color: "#e4e0da" }],
        ["craters", { n: 4 }],
      ] },
    },
    {
      name: "Puck", km: 162, year: 1985, by: "the Voyager 2 team",
      fact: "Spotted in December 1985, just weeks before Voyager 2 flew past Uranus.",
      look: { base: "#55504c", shape: "irregular", irr: 0.07, stretch: 1.03, f: [
        ["craters", { n: 6, color: "#3d3936" }],
      ] },
    },
    {
      name: "Sycorax", km: 157, year: 1997, by: "Brett Gladman et al.",
      fact: "Uranus's largest irregular moon, orbiting backwards about 12 million km away.",
      look: { base: "#9c6a5a", shape: "irregular", irr: 0.15, stretch: 1.1, f: [["craters", { n: 4 }]] },
    },
    {
      name: "Portia", km: 135, year: 1986, by: "the Voyager 2 team",
      fact: "Named after the heroine of Shakespeare's The Merchant of Venice.",
      look: { base: "#5f5955", shape: "irregular", irr: 0.15, stretch: 1.25, f: [["craters", { n: 3 }]] },
    },
    {
      name: "Juliet", km: 94, year: 1986, by: "the Voyager 2 team",
      fact: "Named after the heroine of Shakespeare's Romeo and Juliet.",
      look: { base: "#5c5652", shape: "irregular", irr: 0.18, stretch: 1.4, f: [["craters", { n: 3 }]] },
    },
    {
      name: "Belinda", km: 90, year: 1986, by: "the Voyager 2 team",
      fact: "Named after a character in Alexander Pope's poem The Rape of the Lock.",
      look: { base: "#615b57", shape: "irregular", irr: 0.18, stretch: 1.45, f: [["craters", { n: 3 }]] },
    },
  ],

  Neptune: [
    {
      name: "Triton", km: 2707, year: 1846, by: "William Lassell",
      fact: "It orbits backwards and erupts nitrogen geysers; it is likely a captured Kuiper Belt object.",
      look: { base: "#d7c0b2", f: [
        ["patches", { n: 5, size: 0.18, color: "#b59b8d", spread: 0.55 }],
        ["cap", { color: "#f2d9cf" }],
        ["streaks", { n: 10, color: "#5b4a44" }],
      ] },
    },
    {
      name: "Proteus", km: 420, year: 1989, by: "the Voyager 2 team",
      fact: "One of the largest known bodies that isn't pulled into a round shape by its own gravity.",
      look: { base: "#58534f", shape: "irregular", irr: 0.2, stretch: 1.12, f: [
        ["bigCrater", { x: -0.15, y: 0.1, size: 0.45, color: "#3f3b38" }],
        ["craters", { n: 5 }],
      ] },
    },
    {
      name: "Nereid", km: 357, year: 1949, by: "Gerard Kuiper",
      fact: "It has one of the most eccentric (stretched-out) orbits of any known moon.",
      look: { base: "#9a958f", shape: "irregular", irr: 0.1, stretch: 1.05, f: [["craters", { n: 5 }]] },
    },
    {
      name: "Larissa", km: 194, year: 1981, by: "Harold Reitsema et al.",
      fact: "First glimpsed in 1981 as it passed in front of a star; Voyager 2 confirmed it in 1989.",
      look: { base: "#5f5a56", shape: "irregular", irr: 0.22, stretch: 1.2, f: [["craters", { n: 6 }]] },
    },
    {
      name: "Galatea", km: 176, year: 1989, by: "the Voyager 2 team",
      fact: "Its gravity helps hold the arcs of Neptune's Adams ring in place.",
      look: { base: "#5d5854", shape: "irregular", irr: 0.2, stretch: 1.25, f: [["craters", { n: 4 }]] },
    },
    {
      name: "Despina", km: 156, year: 1989, by: "the Voyager 2 team",
      fact: "A tiny shepherd moon orbiting just inside Neptune's Le Verrier ring.",
      look: { base: "#5a5551", shape: "irregular", irr: 0.2, stretch: 1.2, f: [["craters", { n: 4 }]] },
    },
    {
      name: "Thalassa", km: 81, year: 1989, by: "the Voyager 2 team",
      fact: "It whips around Neptune in about 7.5 hours.",
      look: { base: "#5c5753", shape: "irregular", irr: 0.2, stretch: 1.5, f: [["craters", { n: 3 }]] },
    },
    {
      name: "Naiad", km: 66, year: 1989, by: "the Voyager 2 team",
      fact: "Neptune's innermost moon, circling the planet in about 7 hours.",
      look: { base: "#5f5a55", shape: "irregular", irr: 0.25, stretch: 1.4, f: [["craters", { n: 3 }]] },
    },
    {
      name: "Halimede", km: 62, year: 2002, by: "Matthew Holman et al.",
      fact: "It orbits Neptune backwards on a distant, steeply tilted path.",
      look: { base: "#7c7570", shape: "irregular", irr: 0.18, stretch: 1.15, f: [["craters", { n: 4 }]] },
    },
    {
      name: "Neso", km: 60, year: 2002, by: "Matthew Holman et al.",
      fact: "One of the most distant moons of any planet: a single orbit takes about 26 years.",
      look: { base: "#77706b", shape: "irregular", irr: 0.18, stretch: 1.15, f: [["craters", { n: 4 }]] },
    },
  ],
};
