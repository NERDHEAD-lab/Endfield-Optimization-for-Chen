const fs = require('fs');
const cheerio = require('cheerio');

try {
  const html = fs.readFileSync('scripts/temp_source/skport_gear.html', 'utf-8');
  const $ = cheerio.load(html);

  const el = $('*:contains("Bonekrusha Figurine")').last();
  if (el.length) {
    const parentHtml = el.closest('div[class*="SynthesisCard"]').html() || el.parent().parent().parent().html();
    fs.writeFileSync('scripts/temp_source/bonekrusha.html', parentHtml);
    console.log("Dumped full HTML to scripts/temp_source/bonekrusha.html");
  } else {
    console.log("Bonekrusha Figurine not found");
  }

} catch (e) {
  console.log(e);
}
