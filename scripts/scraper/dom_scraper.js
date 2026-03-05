const puppeteer = require('puppeteer-core');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const chromePath = chromeLauncher.Launcher.getInstallations()[0];
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to base page...');
    await page.goto('https://wiki.skport.com/endfield/catalog', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Switch Language to English
    await page.evaluate(async () => {
      const spans = Array.from(document.querySelectorAll('span, div, p'));
      const langBtn = spans.find(el => el.textContent.trim().includes('한국어') && el.children.length === 0);
      if (langBtn) {
         const btn = langBtn.closest('button') || langBtn.closest('div[class*="lang"]') || langBtn.parentElement;
         if (btn) btn.click();
      }
    });

    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(async () => {
      const spans = Array.from(document.querySelectorAll('span, div, p, li'));
      const engBtn = spans.find(el => el.textContent.trim() === 'English');
      if (engBtn) engBtn.click();
    });

    await new Promise(r => setTimeout(r, 5000));

    // Click on 'Gear' in the sidebar menu
    await page.evaluate(() => {
       const spans = Array.from(document.querySelectorAll('div, span, a'));
       const gearLink = spans.find(el => el.textContent.trim() === 'Gear' && el.children.length === 0);
       if (gearLink) gearLink.click();
    });

    console.log('Clicked Gear menu, scrolling...');
    await new Promise(r => setTimeout(r, 5000));

    let previousHeight = await page.evaluate('document.body.scrollHeight');
    for(let i = 0; i < 40; i++) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await new Promise(resolve => setTimeout(resolve, 600));
        let newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === previousHeight) break;
        previousHeight = newHeight;
    }

    const extracted = await page.evaluate(() => {
      const results = {};
      
      // Get all elements on the page
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
         // Check background image
         const bg = window.getComputedStyle(el).backgroundImage;
         let src = '';
         
         if (bg && bg !== 'none' && bg.includes('url')) {
            // "url("https://...")"
            src = bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
         } else if (el.tagName === 'IMG' && el.src) {
            src = el.src;
         }
         
         if (!src || src.includes('data:image') || !src.includes('http') || src.includes('skport-fe-static') || src.includes('favicon')) return;

         // find text
         let text = '';
         let parent = el;
         for (let i = 0; i < 6; i++) {
            if (!parent) break;
            const t = parent.innerText;
            if (t && t.length > 2 && t.length < 100) {
                // Typical card container will have standard text without full page text
                if (!t.includes('Allow all') && !t.includes('English')) {
                   text = t.split('\n')[0].trim();
                   break;
                }
            }
            parent = parent.parentElement;
         }

         if (text && src && text.length < 50) {
            results[text] = src;
         }
      });
      return results;
    });

    const outputPath = path.join(__dirname, '..', 'temp_source', 'skport_dom.json');
    fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2));
    console.log(`Extraction complete. Saved to ${outputPath}, unique keys: ${Object.keys(extracted).length}`);

    await browser.close();
  } catch (error) {
    console.error('Scraper Error:', error);
  }
})();
