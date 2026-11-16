// Draws comic-style moon illustrations as inline SVG.
//
// Each moon gets a deterministic picture (seeded by its name) built from its
// `look` description in moons.js: a flat base color, surface features, bold
// ink outline, cel shading with halftone dots, and a glossy highlight.

const MoonArt = (() => {
  const INK = "#1a1020";
  const C = 100; // center of the 200×200 viewBox
  let uid = 0;

  // --- helpers ---

  // Small seeded PRNG (FNV-1a hash + mulberry32)
  function rngFor(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    let a = h >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Mix a hex color towards black (amt < 0) or white (amt > 0)
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const target = amt < 0 ? 0 : 255;
    const p = Math.abs(amt);
    const mix = (c) => Math.round(c + (target - c) * p);
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  const n1 = (v) => v.toFixed(1);

  // Smooth closed lumpy shape (Catmull-Rom spline through jittered points)
  function blob(cx, cy, r, irr, stretch, rand, count = 9, rot = 0) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.35;
      const rr = r * (1 - irr * rand());
      const x = Math.cos(a) * rr * stretch;
      const y = Math.sin(a) * rr;
      pts.push([
        cx + x * Math.cos(rot) - y * Math.sin(rot),
        cy + x * Math.sin(rot) + y * Math.cos(rot),
      ]);
    }
    let d = `M${n1(pts[0][0])} ${n1(pts[0][1])}`;
    for (let i = 0; i < count; i++) {
      const p0 = pts[(i - 1 + count) % count];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % count];
      const p3 = pts[(i + 2) % count];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C${n1(c1x)} ${n1(c1y)} ${n1(c2x)} ${n1(c2y)} ${n1(p2[0])} ${n1(p2[1])}`;
    }
    return d + "Z";
  }

  // Random point inside the disk
  function pt(rand, R, spread = 0.8) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * R * spread;
    return [C + Math.cos(a) * d, C + Math.sin(a) * d];
  }

  function crater(x, y, s, color, sw) {
    return (
      `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(s)}" fill="${color}" stroke="${INK}" ` +
      `stroke-opacity=".55" stroke-width="${n1(sw ?? Math.max(1.2, s * 0.16))}"/>` +
      `<circle cx="${n1(x + s * 0.22)}" cy="${n1(y + s * 0.22)}" r="${n1(s * 0.68)}" ` +
      `fill="${shade(color, 0.3)}" opacity=".55"/>`
    );
  }

  function sparkle(x, y, s) {
    return (
      `<path d="M${n1(x)} ${n1(y - s)}Q${n1(x)} ${n1(y)} ${n1(x + s)} ${n1(y)}` +
      `Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + s)}Q${n1(x)} ${n1(y)} ${n1(x - s)} ${n1(y)}` +
      `Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y - s)}Z" fill="#fff6c9"/>`
    );
  }

  // --- surface features ---
  // Each returns [svgInsideBody, svgBehindBody]

  const FEATURES = {
    craters(o, R, rand, base) {
      const color = o.color || shade(base, -0.22);
      const min = o.min ?? 0.05, max = o.max ?? 0.16;
      let s = "";
      for (let i = 0; i < (o.n ?? 6); i++) {
        const [x, y] = pt(rand, R, 0.85);
        s += crater(x, y, R * (min + rand() * (max - min)), color);
      }
      return [s];
    },

    bright(o, R, rand) {
      let s = "";
      for (let i = 0; i < (o.n ?? 5); i++) {
        const [x, y] = pt(rand, R, 0.85);
        const r = R * (0.025 + rand() * 0.04);
        s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 2)}" fill="${o.color}" opacity=".3"/>`;
        s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${o.color}"/>`;
      }
      return [s];
    },

    bigCrater(o, R, rand, base) {
      const color = o.color || shade(base, -0.25);
      const x = C + R * (o.x ?? 0), y = C + R * (o.y ?? 0), r = R * (o.size ?? 0.4);
      return [
        crater(x, y, r, color, 3) +
        `<circle cx="${n1(x + r * 0.08)}" cy="${n1(y + r * 0.08)}" r="${n1(r * 0.14)}" ` +
        `fill="${shade(color, 0.35)}" stroke="${INK}" stroke-opacity=".6" stroke-width="1.5"/>`,
      ];
    },

    ring(o, R) {
      const x = C + R * o.x, y = C + R * o.y, r = R * o.size;
      const w = r * 0.35;
      return [
        `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="none" stroke="${INK}" ` +
        `stroke-opacity=".45" stroke-width="${n1(w + 3)}"/>` +
        `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="none" stroke="${o.color}" ` +
        `stroke-width="${n1(w)}"/>`,
      ];
    },

    patches(o, R, rand) {
      let s = "";
      for (let i = 0; i < (o.n ?? 3); i++) {
        const [x, y] = pt(rand, R, o.spread ?? 0.65);
        const r = R * (o.size ?? 0.35) * (0.7 + rand() * 0.5);
        s += `<path d="${blob(x, y, r, 0.35, 1, rand, 7)}" fill="${o.color}" opacity="${o.opacity ?? 0.85}"/>`;
      }
      return [s];
    },

    spots(o, R, rand) {
      let s = "";
      for (let i = 0; i < (o.n ?? 12); i++) {
        const [x, y] = pt(rand, R, 0.9);
        const r = R * (0.04 + rand() * 0.08);
        const color = o.colors[i % o.colors.length];
        s += `<path d="${blob(x, y, r, 0.3, 1, rand, 6)}" fill="${color}" stroke="${INK}" ` +
          `stroke-opacity=".6" stroke-width="1.5"/>`;
      }
      return [s];
    },

    lines(o, R, rand) {
      let s = "";
      const w = o.w ?? 3;
      for (let i = 0; i < (o.n ?? 5); i++) {
        const a = rand() * Math.PI * 2;
        const b = a + Math.PI + (rand() - 0.5) * 1.6;
        const [qx, qy] = pt(rand, R, 0.5);
        const d =
          `M${n1(C + Math.cos(a) * R * 1.05)} ${n1(C + Math.sin(a) * R * 1.05)}` +
          `Q${n1(qx)} ${n1(qy)} ${n1(C + Math.cos(b) * R * 1.05)} ${n1(C + Math.sin(b) * R * 1.05)}`;
        if (o.ink) {
          s += `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity=".5" ` +
            `stroke-width="${n1(w + 2.5)}" stroke-linecap="round"/>`;
        }
        s += `<path d="${d}" fill="none" stroke="${o.color}" stroke-width="${n1(w)}" ` +
          `stroke-linecap="round" opacity=".9"/>`;
      }
      return [s];
    },

    half(o, R, rand) {
      return [`<path d="${blob(C - R * 0.95, C + R * 0.05, R * 1.2, 0.06, 1, rand, 10)}" fill="${o.color}"/>`];
    },

    stripes(o, R) {
      let s = "";
      // parallel, slightly wavy diagonal cracks near the south pole
      for (let i = 0; i < (o.n ?? 4); i++) {
        const cx = C + R * (-0.3 + i * 0.2);
        const cy = C + R * (0.55 + (i % 2) * 0.06);
        const len = R * (0.32 - Math.abs(i - 1.5) * 0.05);
        const dx = Math.cos(-0.55) * len, dy = Math.sin(-0.55) * len;
        const d =
          `M${n1(cx - dx)} ${n1(cy - dy)}` +
          `Q${n1(cx + R * 0.06)} ${n1(cy + R * 0.04)} ${n1(cx + dx)} ${n1(cy + dy)}`;
        s += `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity=".6" stroke-width="6.5" stroke-linecap="round"/>`;
        s += `<path d="${d}" fill="none" stroke="${o.color}" stroke-width="3.5" stroke-linecap="round"/>`;
      }
      return [s];
    },

    bands(o, R) {
      const n = o.colors.length;
      let s = "";
      o.colors.forEach((color, i) => {
        const y = C + R * (-0.55 + (i * 1.1) / Math.max(1, n - 1));
        s += `<ellipse cx="${C}" cy="${n1(y)}" rx="${n1(R * 1.3)}" ry="${n1(R * 0.11)}" fill="${color}" opacity=".5"/>`;
      });
      return [s];
    },

    cap(o, R, rand) {
      return [
        `<path d="${blob(C, C + R * 0.92, R * 0.8, 0.12, 1.3, rand, 10)}" fill="${o.color}" ` +
        `stroke="${INK}" stroke-opacity=".4" stroke-width="2"/>`,
      ];
    },

    streaks(o, R, rand) {
      let s = "";
      for (let i = 0; i < (o.n ?? 10); i++) {
        const x = C + (rand() - 0.5) * 1.2 * R;
        const y = C + R * (0.35 + rand() * 0.45);
        const len = R * (0.08 + rand() * 0.1);
        const a = -0.3 + (rand() - 0.5) * 0.3;
        s += `<path d="M${n1(x)} ${n1(y)}L${n1(x + Math.cos(a) * len)} ${n1(y + Math.sin(a) * len)}" ` +
          `stroke="${o.color}" stroke-width="3" stroke-linecap="round" opacity=".8"/>`;
      }
      return [s];
    },

    haze(o, R) {
      return ["",
        `<circle cx="${C}" cy="${C}" r="${n1(R + 11)}" fill="${o.color}" opacity=".22"/>` +
        `<circle cx="${C}" cy="${C}" r="${n1(R + 5)}" fill="${o.color}" opacity=".5"/>`,
      ];
    },

    plume(o, R) {
      const top = C + R * 0.75;
      return ["",
        `<path d="M${n1(C - 14)} ${n1(top)}L${n1(C - 48)} 200L${n1(C + 48)} 200L${n1(C + 14)} ${n1(top)}Z" ` +
        `fill="${o.color}" opacity=".45"/>` +
        `<path d="M${n1(C - 6)} ${n1(top)}L${n1(C - 22)} 200L${n1(C + 22)} 200L${n1(C + 6)} ${n1(top)}Z" ` +
        `fill="${o.color}" opacity=".6"/>`,
      ];
    },
  };

  // --- main ---

  function svg(moon) {
    const look = moon.look;
    const rand = rngFor(moon.name);
    const id = "moonart" + ++uid;

    let d, R;
    if (look.shape === "irregular") {
      const stretch = look.stretch ?? 1.15;
      R = Math.min(78, 84 / stretch);
      d = blob(C, C, R, look.irr ?? 0.2, stretch, rand, 9, (rand() - 0.5) * 0.9);
    } else {
      R = 80;
      d = `M${C - R} ${C}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`;
    }

    let stars = "";
    for (let i = 0; i < 14; i++) {
      stars += sparkle(6 + rand() * 188, 6 + rand() * 188, 1.5 + rand() * 3);
    }

    let inside = "", behind = "";
    for (const [type, opts = {}] of look.f || []) {
      const [a = "", b = ""] = FEATURES[type](opts, R, rand, look.base);
      inside += a;
      behind += b;
    }

    const full = `x="0" y="0" width="200" height="200"`;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comic drawing of ${moon.name}">
<defs>
  <clipPath id="${id}-clip"><path d="${d}"/></clipPath>
  <mask id="${id}-shadow" maskUnits="userSpaceOnUse" ${full}>
    <rect ${full} fill="#fff"/>
    <circle cx="${n1(C - R * 0.32)}" cy="${n1(C - R * 0.32)}" r="${n1(R * 1.22)}" fill="#000"/>
  </mask>
  <mask id="${id}-tone" maskUnits="userSpaceOnUse" ${full}>
    <rect ${full} fill="#fff"/>
    <circle cx="${n1(C - R * 0.42)}" cy="${n1(C - R * 0.42)}" r="${n1(R * 1.1)}" fill="#000"/>
  </mask>
  <pattern id="${id}-dots" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <circle cx="3.5" cy="3.5" r="1.7" fill="${INK}"/>
  </pattern>
</defs>
${stars}
${behind}
<g clip-path="url(#${id}-clip)">
  <rect ${full} fill="${look.base}"/>
  ${inside}
  <rect ${full} fill="${INK}" opacity=".38" mask="url(#${id}-shadow)"/>
  <rect ${full} fill="url(#${id}-dots)" opacity=".45" mask="url(#${id}-tone)"/>
  <ellipse cx="${n1(C - R * 0.42)}" cy="${n1(C - R * 0.46)}" rx="${n1(R * 0.2)}" ry="${n1(R * 0.09)}"
    transform="rotate(-38 ${n1(C - R * 0.42)} ${n1(C - R * 0.46)})" fill="#fff" opacity=".75"/>
  <circle cx="${n1(C - R * 0.17)}" cy="${n1(C - R * 0.62)}" r="${n1(R * 0.04)}" fill="#fff" opacity=".75"/>
</g>
<path d="${d}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
</svg>`;
  }

  return { svg };
})();
