const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'temp_source', 'skport_gear.html'), 'utf-8');
const $ = cheerio.load(html);

const items = {};

$('img').each((i, el) => {
  const src = $(el).attr('src') || $(el).attr('data-src');
  if (!src || src.includes('data:image') || !src.includes('http')) return;
  
  // Search for the closest text node in parent, grandparent, etc.
  let text = '';
  
  // Method 1: Check alt
  text = $(el).attr('alt') || '';
  
  // Method 2: Check immediate text siblings
  if (!text || text === 'icon' || text.includes('http')) {
     const parentDiv = $(el).closest('div');
     text = parentDiv.text().trim();
  }
  
  // Method 3: Look at the item card
  if (!text || text.length > 50) {
     const card = $(el).closest('a');
     if (card.length) {
         text = card.text().trim();
     }
  }

  // Method 4: any sibling div with text
  if (!text || text.length > 50) {
    const parentContainer = $(el).parents().filter((i, p) => $(p).text().trim().length > 0).first();
    text = parentContainer.text().trim();
  }

  if (text) {
    const cleaned = text.split('\n')[0].trim();
    if (cleaned.length > 2 && cleaned.length < 50 && cleaned !== 'English' && cleaned !== 'Allow all cookies') {
       items[cleaned] = src;
    }
  }
});

console.log('Extracted items count:', Object.keys(items).length);
console.log(Object.keys(items).slice(0, 20));

// Save it to check mapping
fs.writeFileSync(path.join(__dirname, '..', 'temp_source', 'skport_dom.json'), JSON.stringify(items, null, 2));
