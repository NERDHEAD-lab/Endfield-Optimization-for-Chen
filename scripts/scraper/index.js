const puppeteer = require('puppeteer-core');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const chromePath = chromeLauncher.Launcher.getInstallations()[0];
    if (!chromePath) throw new Error('No Chrome installation found');

    console.log('Using browser:', chromePath);
    
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-US']
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    
    // Set localStorage to force English
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('i18nextLng', 'en');
      localStorage.setItem('lang', 'en');
    });

    // Array to hold all intercepted JSON responses
    const allData = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('web-api.skport.com') || url.includes('json')) {
        try {
          // Check content type
          const requestHeaders = response.headers();
          if (requestHeaders['content-type'] && requestHeaders['content-type'].includes('application/json')) {
            const data = await response.json();
            allData.push({ url, data });
            console.log('Intercepted API json:', url);
          }
        } catch (e) {
          // Ignore parsing errors for opaque responses or non-json
        }
      }
    });

    console.log('Navigating to specific catalog pages to trigger API calls...');
    
    // List of subIds (Armor, Gloves, Kits, etc.)
    const subIds = [1, 2, 3, 4, 5, 6, 7];
    
    for (const subId of subIds) {
      console.log(`Loading typeSubId=${subId}...`);
      await page.goto(`https://wiki.skport.com/endfield/catalog?typeMainId=1&typeSubId=${subId}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
    }

    fs.writeFileSync(path.join(__dirname, '..', 'temp_source', 'skport_intercepted.json'), JSON.stringify(allData, null, 2));
    console.log('Saved intercepted data to: scripts/temp_source/skport_intercepted.json');

    await browser.close();
  } catch (error) {
    console.error('Scraper Error:', error);
  }
})();
