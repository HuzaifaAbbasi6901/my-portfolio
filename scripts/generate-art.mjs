/**
 * Generates the site's SVG artwork: project covers, gallery variants and the
 * about portrait. Deterministic (seeded) so re-runs produce identical files.
 *
 *   node scripts/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const projectsDir = join(root, "public", "images", "projects");
const aboutDir = join(root, "public", "images", "about");

mkdirSync(projectsDir, { recursive: true });
mkdirSync(aboutDir, { recursive: true });

/* Deterministic PRNG (mulberry32) */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Convert "#8B6DFF" + alpha to rgba() string */
function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function shiftHue(hex, degrees) {
  const n = parseInt(hex.slice(1), 16);
  let r = ((n >> 16) & 255) / 255;
  let g = ((n >> 8) & 255) / 255;
  let b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  h = (h + degrees / 360 + 1) % 1;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const to255 = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to255(r)}${to255(g)}${to255(b)}`;
}

const FONT =
  "'Space Grotesk', 'Segoe UI', system-ui, -apple-system, sans-serif";

/* Shared background + grain */
function shell(width, height, accent, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B0D17"/>
      <stop offset="100%" stop-color="#111424"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.75" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="${rgba(accent, 0.32)}"/>
      <stop offset="60%" stop-color="${rgba(accent, 0)}"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${shiftHue(accent, 60)}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  ${inner}
  <rect width="${width}" height="${height}" fill="none" stroke="${rgba("#FFFFFF", 0.08)}" stroke-width="2"/>
</svg>`;
}

/* Decorative dotted grid */
function dotGrid(seed, width, height, accent) {
  const random = rng(seed);
  let dots = "";
  for (let x = 40; x < width; x += 56) {
    for (let y = 40; y < height; y += 56) {
      if (random() > 0.82) {
        dots += `<circle cx="${x}" cy="${y}" r="${(1.4 + random() * 1.8).toFixed(1)}" fill="${rgba(accent, 0.35)}"/>`;
      }
    }
  }
  return dots;
}

/* Cover art: bold monogram + orbiting geometry */
function coverSvg(accent, title, initial, seed) {
  const width = 1200;
  const height = 750;
  const random = rng(seed);

  let orbits = "";
  for (let i = 0; i < 3; i++) {
    const r = 150 + i * 105 + random() * 40;
    orbits += `<circle cx="880" cy="${300 + i * 30}" r="${r.toFixed(0)}" fill="none" stroke="${rgba(accent, 0.28 - i * 0.07)}" stroke-width="${1.5 + i * 0.5}" stroke-dasharray="${i % 2 ? "4 10" : "none"}"/>`;
  }

  const blobs = Array.from({ length: 3 }, (_, i) => {
    const bx = 760 + random() * 320;
    const by = 160 + random() * 300;
    const br = 10 + random() * 22;
    return `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${br.toFixed(0)}" fill="${rgba(i === 1 ? shiftHue(accent, 60) : accent, 0.5)}"/>`;
  }).join("");

  return shell(
    width,
    height,
    accent,
    `
  ${dotGrid(seed + 1, width, height, accent)}
  ${orbits}
  ${blobs}
  <circle cx="880" cy="330" r="86" fill="${rgba(accent, 0.16)}"/>
  <circle cx="880" cy="330" r="86" fill="none" stroke="${rgba(accent, 0.55)}" stroke-width="2"/>
  <path d="M880 262 v136 M847 295 h66 M847 365 h66" stroke="url(#accent)" stroke-width="9" stroke-linecap="round"/>
  <text x="72" y="560" font-family=${JSON.stringify(FONT)} font-size="92" font-weight="700" fill="#F2F4FA" letter-spacing="-2">${title}</text>
  <text x="74" y="620" font-family=${JSON.stringify(FONT)} font-size="26" font-weight="500" fill="${rgba("#A7ADC2", 0.9)}" letter-spacing="6">CASE STUDY — ${initial.toUpperCase()}</text>
  <rect x="72" y="472" width="64" height="6" rx="3" fill="url(#accent)"/>
  `
  );
}

/* Gallery variant A: flowing waves */
function galleryWaves(accent, seed) {
  const width = 1200;
  const height = 750;
  const random = rng(seed);
  let waves = "";
  for (let i = 0; i < 5; i++) {
    const y = 180 + i * 110 + random() * 30;
    const amp = 40 + random() * 50;
    const hue = shiftHue(accent, i * 14 - 20);
    waves += `<path d="M0 ${y.toFixed(0)} C 240 ${(y - amp).toFixed(0)}, 480 ${(y + amp).toFixed(0)}, 720 ${y.toFixed(0)} S 1080 ${(y - amp).toFixed(0)}, 1200 ${y.toFixed(0)}" fill="none" stroke="${rgba(hue, 0.5 - i * 0.06)}" stroke-width="${2.5 - i * 0.3}"/>`;
  }
  return shell(width, height, accent, `${dotGrid(seed + 7, width, height, accent)}${waves}`);
}

/* Gallery variant B: concentric arcs + floating bars */
function galleryArcs(accent, seed) {
  const width = 1200;
  const height = 750;
  const random = rng(seed);
  let arcs = "";
  for (let i = 0; i < 6; i++) {
    const r = 90 + i * 72;
    arcs += `<path d="M ${600 - r} 560 A ${r} ${r} 0 0 1 ${600 + r} 560" fill="none" stroke="${rgba(i % 2 ? shiftHue(accent, 40) : accent, 0.55 - i * 0.07)}" stroke-width="${3 - i * 0.25}" stroke-linecap="round"/>`;
  }
  let bars = "";
  for (let i = 0; i < 7; i++) {
    const bx = 140 + i * 130 + random() * 20;
    const bh = 40 + random() * 130;
    bars += `<rect x="${bx.toFixed(0)}" y="${(520 - bh).toFixed(0)}" width="34" height="${bh.toFixed(0)}" rx="10" fill="${rgba(accent, 0.14)}" stroke="${rgba(accent, 0.4)}" stroke-width="1.5"/>`;
  }
  return shell(width, height, accent, `${dotGrid(seed + 13, width, height, accent)}${arcs}${bars}`);
}

/* Abstract portrait for the About section */
function portraitSvg() {
  const width = 640;
  const height = 760;
  const accent = "#8B6DFF";
  const cyan = "#22D3EE";

  let rings = "";
  for (let i = 0; i < 4; i++) {
    const r = 130 + i * 62;
    rings += `<circle cx="320" cy="330" r="${r}" fill="none" stroke="${rgba(i % 2 ? cyan : accent, 0.22 - i * 0.04)}" stroke-width="1.6" stroke-dasharray="${i % 2 ? "5 12" : "none"}"/>`;
  }

  let sparks = "";
  const random = rng(42);
  for (let i = 0; i < 26; i++) {
    sparks += `<circle cx="${(random() * width).toFixed(0)}" cy="${(random() * height).toFixed(0)}" r="${(1 + random() * 2.4).toFixed(1)}" fill="${rgba(random() > 0.5 ? accent : cyan, 0.5)}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0C0E1A"/>
      <stop offset="100%" stop-color="#131628"/>
    </linearGradient>
    <linearGradient id="phead" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${cyan}"/>
    </linearGradient>
    <clipPath id="pclip"><rect width="${width}" height="${height}" rx="28"/></clipPath>
  </defs>
  <g clip-path="url(#pclip)">
    <rect width="${width}" height="${height}" fill="url(#pbg)"/>
    ${rings}
    ${sparks}
    <!-- abstract figure -->
    <circle cx="320" cy="330" r="118" fill="url(#phead)"/>
    <circle cx="320" cy="330" r="118" fill="none" stroke="${rgba("#FFFFFF", 0.25)}" stroke-width="2"/>
    <path d="M150 690 C 170 540, 260 500, 320 500 C 380 500, 470 540, 490 690 Z" fill="${rgba(accent, 0.3)}"/>
    <path d="M150 690 C 170 540, 260 500, 320 500 C 380 500, 470 540, 490 690 Z" fill="none" stroke="${rgba(cyan, 0.5)}" stroke-width="2"/>
    <path d="M282 312 v44 M358 312 v44 M282 334 h76" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="22" fill="none" stroke="${rgba("#FFFFFF", 0.1)}" stroke-width="1.5"/>
    <text x="320" y="732" text-anchor="middle" font-family=${JSON.stringify(FONT)} font-size="22" font-weight="600" fill="${rgba("#A7ADC2", 0.9)}" letter-spacing="10">CREATIVE DEVELOPER</text>
  </g>
</svg>`;
}

/* ── Generate everything ──────────────────────────────────────────────── */
const projects = [
  { slug: "lumina", title: "Lumina", accent: "#8B6DFF" },
  { slug: "aurora-commerce", title: "Aurora", accent: "#22D3EE" },
  { slug: "pulse-analytics", title: "Pulse", accent: "#E8C898" },
  { slug: "wayfare", title: "Wayfare", accent: "#34D399" },
  { slug: "mono-studio", title: "Mono", accent: "#F472B6" },
  { slug: "devmetrics", title: "DevMetrics", accent: "#60A5FA" },
];

let seed = 1000;
for (const project of projects) {
  seed += 17;
  const { slug, title, accent } = project;
  const initial = title.charAt(0);

  writeFileSync(
    join(projectsDir, `${slug}-cover.svg`),
    coverSvg(accent, title, initial, seed)
  );
  writeFileSync(
    join(projectsDir, `${slug}-1.svg`),
    galleryWaves(shiftHue(accent, 25), seed + 3)
  );
  writeFileSync(
    join(projectsDir, `${slug}-2.svg`),
    galleryArcs(shiftHue(accent, -25), seed + 5)
  );
  console.log(`✓ ${slug} (cover + 2 gallery)`);
}

writeFileSync(join(aboutDir, "portrait.svg"), portraitSvg());
console.log("✓ portrait");

console.log("\nAll artwork generated to /public/images");
