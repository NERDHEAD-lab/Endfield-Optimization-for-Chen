const fs = require('fs');
const path = require('path');
const https = require('https');

const mappingPath = path.join(__dirname, '..', 'temp_source', 'mapping.json');
const skportPath = path.join(__dirname, '..', 'temp_source', 'skport_dom.json');
const outputDir = path.join(__dirname, '..', '..', 'public', 'assets', 'equipment');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    // If it's a relative URL, prepend domain
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (url.startsWith('/')) {
      url = 'https://assets.skport.com' + url;
    }
    
    // Remove query params like ?x-oss-process
    url = url.split('?')[0];

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://wiki.skport.com/',
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const skport = JSON.parse(fs.readFileSync(skportPath, 'utf-8'));
  
  // Create a normalized lookup map for SKport english names
  const skportNormalized = {};
  for (const [name, url] of Object.entries(skport)) {
     skportNormalized[normalize(name)] = url;
  }

  const results = { success: 0, fail: 0, skip: 0 };

  for (const id in mapping) {
    const enName = mapping[id].en_name;
    const normEnName = normalize(enName);
    
    // Convert WebP URL to original PNG/JPG by removing format conversion if any
    let dest = path.join(outputDir, `${id}.webp`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      results.skip++;
      continue;
    }

    const imgUrl = skportNormalized[normEnName];

    if (imgUrl) {
      try {
        await download(imgUrl, dest);
        results.success++;
        process.stdout.write('+');
      } catch (err) {
        // console.error(`Failed ${id}: ${err.message}`);
        results.fail++;
      }
    } else {
      // console.log(`Not found in SKport: ${enName}`);
      results.fail++;
    }
  }

  console.log(`\nDownload Sync: Success ${results.success}, Failed ${results.fail}, Skipped ${results.skip}`);
}

run();
