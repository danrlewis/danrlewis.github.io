// Capture the seam-line + door phase. Goal: confirm
// (a) the AG blur exit completes around t+550ms after dismiss,
// (b) the seams creep / hesitate / spring overshoot,
// (c) doors begin opening shortly after the seams snap together.
//
// Phase timeline (from handleSubmit):
//   submit → +6260ms = dismiss (seams render, AG starts exiting)
//   submit → +6810ms = exit done, seams ~25% drawn
//   submit → +7100ms = seams nearly stalled (hesitancy)
//   submit → +7440ms = seams overshoot (peak)
//   submit → +7660ms = seams settled (== 6260+0.55+0.85 = 7660ms)
//   submit → +7810ms = doors begin opening

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:3000/work";
const OUT = path.resolve("scripts/out/seam");
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

// Capture key moments around the seam phase.
const samples = [
  { t: 6260, label: "dismiss-start" },     // exit begins
  { t: 6500, label: "exit-mid" },          // mid-blur
  { t: 6810, label: "exit-done" },         // exit complete, seams 0
  { t: 7000, label: "seams-creep" },       // 0→0.15 phase
  { t: 7150, label: "seams-hesitate" },    // 0.15→0.18 stall
  { t: 7400, label: "seams-shoot" },       // 0.18→1.08 spring
  { t: 7550, label: "seams-overshoot" },   // peak ~1.08
  { t: 7700, label: "seams-settled" },     // ~1.0 settled
  { t: 7900, label: "doors-starting" },    // doors begin (started @7810)
  { t: 8200, label: "doors-progress" },
  { t: 9000, label: "doors-mid-struggle" },
];

for (const { t, label } of samples) {
  const targetWall = submitTime + t;
  const wait = targetWall - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);

  const data = await page.evaluate(() => {
    const seamTop = document.querySelector('[class*="origin-top"][class*="bg-fg/10"]');
    const seamBot = document.querySelector('[class*="origin-bottom"][class*="bg-fg/10"]');
    const ag = document.querySelector('[class*="z-\\[80\\]"]');
    const leftDoor = document.querySelector('.fixed.inset-0.z-\\[70\\] > div:nth-child(1)');
    const rightDoor = document.querySelector('.fixed.inset-0.z-\\[70\\] > div:nth-child(2)');
    return {
      seamTopTransform: seamTop ? getComputedStyle(seamTop).transform : null,
      seamBotTransform: seamBot ? getComputedStyle(seamBot).transform : null,
      agOpacity: ag ? getComputedStyle(ag).opacity : null,
      agFilter: ag ? getComputedStyle(ag).filter : null,
      leftDoorTransform: leftDoor ? getComputedStyle(leftDoor).transform : null,
      rightDoorTransform: rightDoor ? getComputedStyle(rightDoor).transform : null,
    };
  });

  await page.screenshot({ path: path.join(OUT, `t${String(t).padStart(5, "0")}-${label}.png`) });
  // Extract scaleY from transform matrix (matrix(a, b, c, d, tx, ty) where d == scaleY)
  const scaleY = (mat) => {
    if (!mat || mat === "none") return null;
    const m = mat.match(/matrix\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(",").map((s) => parseFloat(s));
    return parts[3]; // d
  };
  const tx = (mat) => {
    if (!mat || mat === "none") return null;
    const m = mat.match(/matrix\(([^)]+)\)/);
    if (!m) return null;
    return parseFloat(m[1].split(",")[4]); // tx
  };
  console.log(
    `t=${t}  ${label.padEnd(20)}  ` +
      `seamTop=${scaleY(data.seamTopTransform)?.toFixed(3) ?? "—"}  ` +
      `seamBot=${scaleY(data.seamBotTransform)?.toFixed(3) ?? "—"}  ` +
      `agOpacity=${data.agOpacity ?? "—"}  ` +
      `leftDoorX=${tx(data.leftDoorTransform)?.toFixed(0) ?? "—"}  ` +
      `rightDoorX=${tx(data.rightDoorTransform)?.toFixed(0) ?? "—"}`,
  );
}

await browser.close();
console.log("\nFrames written to:", OUT);
