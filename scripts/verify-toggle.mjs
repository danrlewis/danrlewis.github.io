// Drive Chromium through every "toggle vs. inverted background" state and
// sample the rendered pixels at the toggle's location to confirm the fix.
// Output: ./scripts/out/<state>.png + console summary.

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:3000/work/nectar-pdp-cart-redesign";
const OUT = path.resolve("scripts/out");
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
// Vault gate guards /work/* via sessionStorage["vault:work"] = "1".
// Set it before navigation so the gate lets us through.
await ctx.addInitScript(() => {
  try { sessionStorage.setItem("vault:work", "1"); } catch {}
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

// Helper: position the toggle over a target band of the page.
async function scrollToggleOver(targetY) {
  await page.evaluate((targetY) => {
    const t = document.querySelector("[data-mood-toggle] button");
    const r = t.getBoundingClientRect();
    // toggle viewport-y stays constant. We want toggle CENTER to land at
    // page-y = targetY → scrollY = targetY - viewportY(toggle center)
    const tCenterViewport = r.top + r.height / 2;
    const scrollY = Math.max(0, targetY - tCenterViewport);
    window.scrollTo(0, scrollY);
  }, targetY);
  await page.waitForTimeout(150);
}

async function getToggleCenter() {
  return page.evaluate(() => {
    const t = document.querySelector("[data-mood-toggle] button");
    const r = t.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  });
}

async function pickPixels(name) {
  // Find the toggle handle pixel and the surrounding background pixel,
  // and the "Day"/"Night" label pixel — sample what the eye actually sees.
  const samples = await page.evaluate(() => {
    const btn = document.querySelector("[data-mood-toggle] button");
    const handle = btn.querySelector("span > span"); // inner handle
    const label = btn.querySelector("span:last-child"); // state label
    const pill = btn.querySelector("span:nth-child(1)"); // pill border (when hideLabel)
    // Coordinates relative to viewport
    const handleR = handle.getBoundingClientRect();
    const labelR = label.getBoundingClientRect();
    const pillR = pill.getBoundingClientRect();
    return {
      handle: { x: Math.round(handleR.left + handleR.width / 2), y: Math.round(handleR.top + handleR.height / 2) },
      label: { x: Math.round(labelR.left + 4), y: Math.round(labelR.top + labelR.height / 2) },
      pillEdge: { x: Math.round(pillR.left + 1), y: Math.round(pillR.top + pillR.height / 2) },
      // A point ~30px to the right of the toggle (background only)
      bg: { x: Math.round(labelR.right + 30), y: Math.round(labelR.top + labelR.height / 2) },
    };
  });
  const buf = await page.screenshot({ fullPage: false });
  // Use sharp-free approach: re-take a tiny screenshot at each sample point
  const shots = {};
  for (const [k, p] of Object.entries(samples)) {
    const clip = { x: Math.max(0, p.x - 1), y: Math.max(0, p.y - 1), width: 3, height: 3 };
    const png = await page.screenshot({ clip });
    // PNG bytes — pull the center pixel via the IDAT? Easier: use page.evaluate to read canvas.
    // Better: use a 1x1 clip and parse via Buffer.
    shots[k] = { ...p, png };
  }
  // Save full screenshot
  await fs.writeFile(path.join(OUT, `${name}.png`), buf);
  return { samples, fullScreenshotPath: path.join(OUT, `${name}.png`) };
}

// More direct: render page into canvas via html2canvas? Too heavy.
// Simpler: use page.evaluate to draw screenshot into <canvas> and read pixel.
async function readPixelAt(x, y) {
  const vp = page.viewportSize();
  if (x < 0 || y < 0 || x >= vp.width || y >= vp.height) {
    return { r: -1, g: -1, b: -1, _oob: true, _at: { x, y } };
  }
  const buf = await page.screenshot({ clip: { x: Math.max(0, x), y: Math.max(0, y), width: 1, height: 1 } });
  // PNG header: 8 bytes signature, then IHDR chunk, etc. Pulling the single
  // pixel out of a 1x1 PNG is awkward; spawn through a tiny inline parser:
  // Use the upng-js? Not available. Just decode IDAT via zlib for 1x1.
  const zlib = await import("node:zlib");
  // Find IDAT chunk
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.slice(0, 8).equals(sig)) throw new Error("not png");
  let i = 8;
  let idat = Buffer.alloc(0);
  let bpp = 4;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.slice(i + 4, i + 8).toString("ascii");
    const data = buf.slice(i + 8, i + 8 + len);
    if (type === "IHDR") {
      const colorType = data[9];
      bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
    } else if (type === "IDAT") {
      idat = Buffer.concat([idat, data]);
    } else if (type === "IEND") {
      break;
    }
    i += 12 + len;
  }
  const raw = zlib.inflateSync(idat);
  // Filter byte at start of each scanline; for 1x1 image: [filter, R, G, B, (A)]
  const r = raw[1], g = raw[2], b = raw[3];
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function colorDistance(a, b) {
  return Math.round(Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b));
}

async function captureState(name, { dark, scrollPageY }) {
  if (dark) {
    // Click toggle to switch to night
    const isNight = await page.evaluate(() => document.documentElement.classList.contains("night"));
    if (!isNight) {
      await page.click("[data-mood-toggle] button");
      await page.waitForTimeout(1200); // wait for view transition
    }
  } else {
    const isDay = await page.evaluate(() => document.documentElement.classList.contains("day"));
    if (!isDay) {
      await page.click("[data-mood-toggle] button");
      await page.waitForTimeout(1200);
    }
  }

  // Move cursor far from the toggle so hover:opacity-70 doesn't dilute the
  // sampled colors. Without this, post-click runs report ~70% effective
  // opacity which silently cuts the difference-blend contrast.
  await page.mouse.move(10, 10);
  await page.waitForTimeout(50);

  await scrollToggleOver(scrollPageY);

  const positions = await page.evaluate(() => {
    const btn = document.querySelector("[data-mood-toggle] button");
    const handle = btn.querySelector("span:nth-child(1) span"); // handle inside pill
    const label = btn.querySelector("span:nth-child(2)"); // state label
    const pill = btn.querySelector("span:nth-child(1)");
    const r = (el) => el?.getBoundingClientRect();
    const hR = r(handle), lR = r(label), pR = r(pill);
    return {
      handle: { x: Math.round(hR.left + hR.width / 2), y: Math.round(hR.top + hR.height / 2) },
      // Sample the label glyph itself (use the label's center). Glyph stroke
      // should land here for "Y"/"T" in DAY/NIGHT.
      label: { x: Math.round(lR.left + lR.width / 2), y: Math.round(lR.top + lR.height / 2) },
      pillEdge: { x: Math.round(pR.left), y: Math.round(pR.top + pR.height / 2) },
      // Background: sample 60px ABOVE and 30px LEFT of the pill — clear of
      // any toggle pixel and inside the same backdrop region.
      bg: { x: Math.round(pR.left - 30), y: Math.round(pR.top - 60) },
    };
  });

  // Sample each
  const colors = {};
  for (const [k, p] of Object.entries(positions)) {
    colors[k] = await readPixelAt(p.x, p.y);
  }

  // Save full screenshot for visual inspection
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });

  const dHandle = colorDistance(colors.handle, colors.bg);
  const dLabel = colorDistance(colors.label, colors.bg);
  const dPill = colorDistance(colors.pillEdge, colors.bg);

  return {
    name,
    positions,
    colors: Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, rgbToHex(c)])),
    contrast: { handle: dHandle, label: dLabel, pillEdge: dPill },
  };
}

const results = [];

// Discover where the inverted blocks live so we scroll to them precisely.
const layout = await page.evaluate(() => {
  const cover = document.querySelector(".bg-fg.text-bg");
  const next = document.querySelector("a.bg-accent");
  const colo = document.querySelector("footer");
  const r = (el) => el ? { top: el.offsetTop, h: el.offsetHeight } : null;
  return { cover: r(cover), next: r(next), colo: r(colo), docH: document.documentElement.scrollHeight, vh: window.innerHeight };
});
console.log("layout:", JSON.stringify(layout));

// Pick page-Y targets that put the toggle squarely INSIDE each region.
// Toggle is fixed at viewport-y ≈ 759 (vh=800, bottom-8 + button height).
// scrollY = targetPageY - 759. So we need targetPageY ≥ 759 to scroll at all.
// Regular --bg gap exists BELOW the cover (cover.top + cover.h .. next.top).
const coverEnd = (layout.cover?.top ?? 0) + (layout.cover?.h ?? 0);
const nextStart = layout.next?.top ?? layout.docH;
const regularGapMid = (coverEnd + nextStart) / 2;
const invertedMid = (layout.cover?.top ?? 600) + (layout.cover?.h ?? 400) / 2;

// State 1: light mode, toggle over regular --bg (cream)
results.push(await captureState("01-light-on-cream", { dark: false, scrollPageY: regularGapMid }));
// State 2: light mode, toggle over inverted bg-fg (black) — the original bug
results.push(await captureState("02-light-on-inverted-black", { dark: false, scrollPageY: invertedMid }));
// State 3: night mode, toggle over regular --bg (black)
results.push(await captureState("03-night-on-black", { dark: true, scrollPageY: regularGapMid }));
// State 4: night mode, toggle over inverted bg-fg (cream in night)
results.push(await captureState("04-night-on-inverted-cream", { dark: true, scrollPageY: invertedMid }));

await browser.close();

console.log("\n=== Toggle visibility check ===\n");
for (const r of results) {
  console.log(`${r.name}`);
  console.log(`  bg=${r.colors.bg}  handle=${r.colors.handle}  label=${r.colors.label}  pillEdge=${r.colors.pillEdge}`);
  console.log(`  contrast Δ vs bg → handle=${r.contrast.handle}  label=${r.contrast.label}  pillEdge=${r.contrast.pillEdge}`);
  const verdict = r.contrast.handle >= 80 && r.contrast.label >= 30 && r.contrast.pillEdge >= 30 ? "OK" : "WEAK";
  console.log(`  verdict: ${verdict}\n`);
}

console.log(`Screenshots: ${OUT}`);
