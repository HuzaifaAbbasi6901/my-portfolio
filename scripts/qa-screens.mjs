/**
 * QA screenshot harness (dev-only, not part of the site build).
 * Uses the system Chrome via playwright-core to capture page screenshots.
 *
 *   node scripts/qa-screens.mjs
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";
const OUT = "qa";
mkdirSync(OUT, { recursive: true });

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--disable-gpu-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

async function shot(name, path, { width = 1440, height = 900, fullPage = false, before } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`  [console.error on ${name}]`, msg.text().slice(0, 200));
  });
  page.on("pageerror", (err) => console.log(`  [pageerror on ${name}]`, String(err).slice(0, 300)));

  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => {
    console.log(`  [goto warning on ${name}]`, String(e).slice(0, 150));
  });
  if (before) await before(page);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  console.log(`✓ ${name}.png`);
  await context.close();
}

// 1. Home — dark hero
await shot("home-dark-hero", "/", { before: async (page) => {
  await page.evaluate(() => {
    sessionStorage.setItem("portfolio-preloaded", "1");
  });
  await page.reload({ waitUntil: "networkidle" });
} });

// 1b. Home sections via scroll steps (whileInView reveals need real scrolling)
const sections = ["about", "skills", "work", "experience", "contact"];
for (const id of sections) {
  await shot(`section-${id}`, "/", { before: async (page) => {
    await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
    await page.reload({ waitUntil: "networkidle" });
    // Let hydration (Lenis + ScrollTrigger pin spacers) settle before anchoring.
    await page.waitForTimeout(1500);
    await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "instant",
        });
      }
    }, id);
    await page.waitForTimeout(2500);
  } });
}

// 1c. Footer
await shot("footer", "/", { before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
} });

// 2. Home — light mode hero
await shot("home-light-hero", "/", { before: async (page) => {
  await page.evaluate(() => {
    sessionStorage.setItem("portfolio-preloaded", "1");
    localStorage.setItem("theme", "light");
  });
  await page.reload({ waitUntil: "networkidle" });
} });

// 3. Command palette open
await shot("command-palette", "/", { before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
  await page.reload({ waitUntil: "networkidle" });
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(600);
} });

// 4. Case study + gallery
await shot("case-study", "/projects/lumina", { before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
} });

// 5. Blog index + post
await shot("blog-index", "/blog", { before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
} });
await shot("blog-post", "/blog/building-a-3d-portfolio-with-react-three-fiber", {
  fullPage: true,
  before: async (page) => {
    await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
  },
});

// 6. 404
await shot("404", "/this-page-does-not-exist", { before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
} });

// 7. Mobile home + menu
await shot("mobile-home", "/", { width: 390, height: 844, before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
  await page.reload({ waitUntil: "networkidle" });
} });
await shot("mobile-menu", "/", { width: 390, height: 844, before: async (page) => {
  await page.evaluate(() => sessionStorage.setItem("portfolio-preloaded", "1"));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(700);
} });

await browser.close();
console.log("QA screenshots complete → /" + OUT);
