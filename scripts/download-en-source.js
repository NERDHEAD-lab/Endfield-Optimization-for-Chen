const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function downloadSource() {
  const url = 'https://game8.co/games/Arknights-Endfield/archives/535550';
  console.log(`Downloading from ${url}...`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const tableSelector = 'body > div.p-archiveBody__container > div.p-archiveBody__main > div.p-archiveContent__container > div.p-archiveContent__main > div.archive-style-wrapper > div.scroll--table.table-header--fixed > table';
    const tableHtml = $(tableSelector).prop('outerHTML');
    
    if (tableHtml) {
      const outputPath = path.join(__dirname, 'temp_source', 'game8_en.html');
      fs.writeFileSync(outputPath, tableHtml);
      console.log(`Saved Game8 table to ${outputPath}`);
    } else {
      console.error('Failed to find the table using the specified selector.');
      // Fallback: save full body if selector fails for manual inspection
      const bodyHtml = $('body').html();
      fs.writeFileSync(path.join(__dirname, 'temp_source', 'game8_body_debug.html'), bodyHtml);
      console.log('Saved body to game8_body_debug.html instead.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

downloadSource();
