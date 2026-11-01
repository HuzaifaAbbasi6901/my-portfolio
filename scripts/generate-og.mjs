/**
 * Generates static Open Graph images (1200x630 PNG) for the site, every
 * project case study and every blog post, using sharp. Replaces runtime
 * next/og rendering — @vercel/og fails to load when the project path
 * contains spaces (common on Windows), and static PNGs are faster anyway.
 *
 *   node --experimental-strip-types scripts/generate-og.mjs
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const { projects } = await import("../data/projects.ts");
const { siteConfig } = await import("../data/site.ts");

const W = 1200;
const H = 630;
const FONT = "'Space Grotesk','Segoe UI',system-ui,-apple-system,sans-serif";

function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Naive word-wrap by character count. */
function wrap(text, maxChars, maxLines = 3) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (lines.length < maxLines && current) lines.push(current.trim());
  if (lines.length === maxLines) {
    const consumed = lines.join(" ").length;
    if (consumed < text.trim().length - 1) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s,.;:]*$/, "") + "…";
    }
  }
  return lines;
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Shared OG canvas: dark gradient, accent glows, monogram, eyebrow, title
 * lines and optional subtitle.
 */
function ogSvg({ eyebrow, titleLines, subtitle, monogram = "H" }) {
  const titleSize = titleLines.some((l) => l.length > 34) ? 54 : 64;
  const titleTop = subtitle ? 300 : 330;
  const lineHeight = titleSize * 1.18;

  const titleText = titleLines
    .map(
      (line, index) =>
        `<text x="88" y="${titleTop + index * lineHeight}" font-family="${FONT}" font-size="${titleSize}" font-weight="700" fill="#F2F4FA" letter-spacing="-1.5">${escapeXml(line)}</text>`
    )
    .join("\n    ");

  const subtitleText = subtitle
    ? `<text x="90" y="${titleTop + titleLines.length * lineHeight + 44}" font-family="${FONT}" font-size="25" fill="#A7ADC2">${escapeXml(subtitle.slice(0, 90))}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#07080F"/>
      <stop offset="55%" stop-color="#12142A"/>
      <stop offset="100%" stop-color="#07080F"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.15" cy="0" r="0.75">
      <stop offset="0%" stop-color="rgba(139,109,255,0.4)"/>
      <stop offset="70%" stop-color="rgba(139,109,255,0)"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.95" cy="1" r="0.7">
      <stop offset="0%" stop-color="rgba(34,211,238,0.32)"/>
      <stop offset="70%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="28" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="2"/>
  <rect x="88" y="96" width="76" height="76" rx="20" fill="url(#bg)"/>
  <rect x="88" y="96" width="76" height="76" rx="20" fill="rgba(139,109,255,0.25)" stroke="rgba(139,109,255,0.7)" stroke-width="2"/>
  <path d="M110 116 v40 M142 116 v40 M110 136 h32" stroke="#F2F4FA" stroke-width="7" stroke-linecap="round" fill="none"/>
  <text x="188" y="144" font-family="${FONT}" font-size="26" font-weight="600" fill="#E8C898" letter-spacing="7">${escapeXml(eyebrow.toUpperCase())}</text>
  ${titleText}
  ${subtitleText}
  <circle cx="1030" cy="140" r="90" fill="rgba(139,109,255,0.18)"/>
  <circle cx="1030" cy="140" r="130" fill="none" stroke="rgba(139,109,255,0.25)" stroke-width="1.5" stroke-dasharray="4 10"/>
  <text x="90" y="${H - 64}" font-family="${FONT}" font-size="22" font-weight="600" fill="rgba(167,173,194,0.85)" letter-spacing="2">${escapeXml(monogram)} · PORTFOLIO</text>
  <circle cx="1060" cy="${H - 71}" r="6" fill="#8B6DFF"/>
</svg>`;
}

async function render(svg, outPath) {
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log("✓", outPath.replace(root, ""));
}

/* Site OG */
const ogDir = join(root, "public", "og");
const blogOgDir = join(ogDir, "blog");
const projectOgDir = join(ogDir, "projects");
mkdirSync(blogOgDir, { recursive: true });
mkdirSync(projectOgDir, { recursive: true });

await render(
  ogSvg({
    eyebrow: siteConfig.role,
    titleLines: wrap(`Crafting digital experiences that feel alive.`, 26, 2),
    subtitle: siteConfig.tagline,
    monogram: siteConfig.initials,
  }),
  join(ogDir, "site.png")
);

/* Project OGs */
for (const project of projects) {
  await render(
    ogSvg({
      eyebrow: `Case study — ${project.category}`,
      titleLines: wrap(project.title, 24, 2),
      subtitle: project.summary,
      monogram: siteConfig.initials,
    }),
    join(projectOgDir, `${project.slug}.png`)
  );
}

/* Blog OGs (from MDX frontmatter) */
const blogSrc = join(root, "content", "blog");
for (const file of readdirSync(blogSrc).filter((f) => f.endsWith(".mdx"))) {
  const slug = file.replace(/\.mdx$/, "");
  const { data } = matter(readFileSync(join(blogSrc, file), "utf8"));
  const tags = Array.isArray(data.tags) ? data.tags.join(" · ") : "";
  await render(
    ogSvg({
      eyebrow: `Blog — ${data.date ? String(data.date).slice(0, 10) : "Post"}`,
      titleLines: wrap(String(data.title ?? slug), 30, 3),
      subtitle: tags,
      monogram: siteConfig.initials,
    }),
    join(blogOgDir, `${slug}.png`)
  );
}

console.log("\nAll OG images generated to /public/og");
