import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("scripts/out/ds-verify");
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem("vault:work", "1"); } catch {} });
const page = await ctx.newPage();

const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => { if (msg.type() === "error") errors.push("console: " + msg.text()); });

for (const route of ["/", "/work", "/contact", "/work/nectar-pdp-cart-redesign"]) {
  await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, route.replace(/\//g, "_") + ".png") });
  console.log("✓", route);
}

await browser.close();
console.log("Errors:", errors.length ? errors : "none");
