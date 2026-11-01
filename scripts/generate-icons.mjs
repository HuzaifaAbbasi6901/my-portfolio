/**
 * Rasterizes app/icon.svg into the PWA / favicon PNG set via sharp.
 *
 *   node scripts/generate-icons.mjs
 */
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconsDir = join(root, "public", "icons");
mkdirSync(iconsDir, { recursive: true });

const iconSvg = readFileSync(join(root, "app", "icon.svg"));

/** Maskable variant: full-bleed gradient with the monogram in the safe zone. */
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8B6DFF"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <path d="M176 136v240M336 136v240M176 256h160" stroke="#FFFFFF" stroke-width="34" stroke-linecap="round" fill="none"/>
</svg>`;

async function main() {
  // Standard icons from the rounded-square source.
  await sharp(iconSvg, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, "icon-512.png"));

  await sharp(iconSvg, { density: 300 })
    .resize(192, 192)
    .png()
    .toFile(join(iconsDir, "icon-192.png"));

  // Maskable: full-bleed with safe-zone padding.
  await sharp(Buffer.from(maskableSvg), { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, "icon-maskable-512.png"));

  // Apple touch icon (opaque, square — iOS applies its own mask).
  await sharp(Buffer.from(maskableSvg), { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(join(iconsDir, "apple-touch-icon.png"));

  console.log("✓ PWA icons written to /public/icons");
}

main().catch((error) => {
  console.error("Icon generation failed:", error);
  process.exit(1);
});
