const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3002');
  console.log('Navigated to localhost:3002');
  
  // Wait for the UI
  await page.waitForTimeout(2000);
  
  // Find all PDF assets
  const pdfAssets = await page.$$eval('div', els => {
    return els.filter(el => el.textContent.includes('PDF')).length;
  });
  console.log('Found PDF occurrences:', pdfAssets);
  
  // Click on the first asset card
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.cursor-pointer');
    if (cards.length > 0) {
      cards[0].click();
    }
  });
  
  await page.waitForTimeout(2000);
  console.log('Done waiting after click.');
  
  await browser.close();
})();
