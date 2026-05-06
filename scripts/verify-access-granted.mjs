// Trigger the vault unlock sequence and capture frames during the
// ACCESS GRANTED scramble so we can verify all letters scramble in
// parallel (not left-to-right) and lock in random order.

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:3000/work";
const OUT = path.resolve("scripts/out/ag");
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
// Make sure the gate is closed (no prior unlock).
await ctx.addInitScript(() => {
  try { sessionStorage.removeItem("vault:work"); } catch {}
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

// Type passphrase + submit. handleSubmit transitions: melting → granted
// at +3200ms → dismiss at +6260ms.
await page.fill('input[aria-label="Vault passphrase"]', "please");
const submitTime = Date.now();
await page.keyboard.press("Enter");

// Granted phase begins at +3200ms; scrambles run delay 0.35–0.95 (status)
// and 0.45–1.71 (Access Granted). Capture every 100ms from t+3200 to
// t+5000 so we cover the whole scramble.
const captureStart = 3200;
const captureEnd = 5000;
const stepMs = 100;

for (let t = captureStart; t <= captureEnd; t += stepMs) {
  const targetWall = submitTime + t;
  const wait = targetWall - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);
  // Read the rendered text of the AG paragraph at this moment.
  const snapshot = await page.evaluate(() => {
    const p = [...document.querySelectorAll("p")].find((el) =>
      el.className.includes("font-black"),
    );
    const eyebrow = [...document.querySelectorAll("span")].find((el) =>
      el.getAttribute("aria-label") === "(Status)",
    );
    const visibleChars = (root) =>
      [...(root?.children || [])].map((c) => ({
        text: c.textContent,
        opacity: getComputedStyle(c).opacity,
      }));
    return {
      ag: p ? p.textContent : null,
      agChars: p ? visibleChars(p.querySelector("span")) : [],
      statusChars: eyebrow ? visibleChars(eyebrow) : [],
    };
  });
  const filename = path.join(OUT, `t${String(t).padStart(4, "0")}.png`);
  await page.screenshot({ path: filename });
  console.log(`t=${t}ms  AG="${snapshot.ag}"  visibleAG=${snapshot.agChars.filter(c=>c.opacity!=="0").length}/${snapshot.agChars.length}`);
}

await browser.close();
console.log("\nFrames written to:", OUT);
