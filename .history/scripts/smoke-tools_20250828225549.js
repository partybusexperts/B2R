const { chromium } = require('playwright');

(async () => {
  const url = process.env.URL || 'http://localhost:3003/tools';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for grid buttons
  await page.waitForSelector('.grid button', { timeout: 10000 });
  const buttons = await page.$$('.grid button');
  console.log('Found', buttons.length, 'tool tiles');

  const results = [];

  for (let i = 0; i < buttons.length; i++) {
    try {
      const b = buttons[i];
      const title = (await b.innerText()).split('\n')[0].trim();
      console.log(`Clicking [${i}] ${title}`);
      await b.click({ force: true });

      // wait for modal close button (aria-label="Close")
      await page.waitForSelector('button[aria-label="Close"]', { timeout: 5000 });
      // capture modal content/title
      const modalTitle = await page.$eval('div.z-50 h3, div.z-50 h2, div.z-50 h1', el => el.innerText).catch(() => null);
      const modalText = await page.$eval('div.z-50', el => el.innerText.slice(0, 500)).catch(() => null);

      results.push({ index: i, title, modalTitle, modalTextSnippet: modalText ? modalText.replace(/\n/g, ' ').slice(0, 200) : null, opened: !!modalTitle || !!modalText });

      // close modal
      await page.click('button[aria-label="Close"]');
      await page.waitForSelector('div.z-50', { state: 'detached', timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(150);
    } catch (err) {
      console.error('Error with tile', i, err.message);
      results.push({ index: i, error: err.message });
    }
  }

  console.log('\nSMOKE RESULTS:');
  results.forEach(r => console.log(JSON.stringify(r)));

  await browser.close();
  process.exit(0);
})();
