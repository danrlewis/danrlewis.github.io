// Capture the slit-reveal entrance of the AccessGranted overlay.
// granted phase begins at submit + 3200ms.
// Within that phase: bg fade 0–300ms, clip-path opens 100–650ms,
// scramble starts at 100–200ms.

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:3000/work";
const OUT = path.resolve("scripts/out/ag-entrance");
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addInitScript(() => {
  try { sessionStorage.removeItem("vault:work"); } catch {}
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

await page.fill('input[aria-label="Vault passphrase"]', "please");
const submitTime = Date.now();
await page.keyboard.press("Enter");

// Phase begins at +3200ms. Capture every 50ms through the entrance.
const samples = [
  { t: 3200, label: "phase-start" },
  { t: 3250, label: "bg-fading" },
  { t: 3300, label: "clip-opening-just-started" },
  { t: 3350, label: "clip-tiny-band" },
  { t: 3400, label: "clip-band-growing" },
  { t: 3500, label: "clip-half-open" },
  { t: 3600, label: "clip-mostly-open" },
  { t: 3700, label: "clip-fully-open-scramble-flowing" },
  { t: 3900, label: "early-locks" },
  { t: 4400, label: "mid-scramble" },
  { t: 4900, label: "all-locked" },
];

for (const { t, label } of samples) {
  const targetWall = submitTime + t;
  const wait = targetWall - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);

  const data = await page.evaluate(() => {
    const ag = document.querySelector('[class*="z-\\[80\\]"]');
    const slit = ag?.querySelector(".text-center");
    const titleP = ag?.querySelector("p");
    return {
      agOpacity: ag ? getComputedStyle(ag).opacity : null,
      slitClipPath: slit ? getComputedStyle(slit).clipPath : null,
      titleText: titleP ? titleP.textContent : null,
    };
  });

  await page.screenshot({ path: path.join(OUT, `t${String(t).padStart(5, "0")}-${label}.png`) });
  console.log(
    `t=${t}  ${label.padEnd(36)}  ` +
      `bgOpacity=${data.agOpacity}  ` +
      `clipPath=${data.slitClipPath}  ` +
      `text="${data.titleText}"`,
  );
}

await browser.close();
console.log("\nFrames written to:", OUT);
