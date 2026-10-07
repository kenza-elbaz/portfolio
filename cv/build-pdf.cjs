// Renders cv-en.html to ../assets/Kenza_El_Baz_CV_EN.pdf with headless Chromium.
// Usage: node cv/build-pdf.cjs   (needs Playwright: npm i -D playwright)
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage();
  await page.goto("file://" + path.join(__dirname, "cv-en.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(__dirname, "..", "assets", "Kenza_El_Baz_CV_EN.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
})();
