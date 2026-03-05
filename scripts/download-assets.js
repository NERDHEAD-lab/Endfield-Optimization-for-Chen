const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'temp_source', 'namu_ko.html');
const mappingPath = path.join(__dirname, 'temp_source', 'mapping.json');
const outputDir = path.join(__dirname, '..', 'public', 'assets', 'equipment');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    // URL 정규화
    let fullUrl = url;
    if (url.startsWith('//')) {
      fullUrl = 'https:' + url;
    } else if (!url.startsWith('http')) {
      fullUrl = 'https://i.namu.wiki' + url;
    }

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://namu.wiki/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };

    https.get(fullUrl, options, (response) => {
      // 리다이렉트 처리
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${fullUrl}`));
        return;
      }

      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const $ = cheerio.load(html);

  const results = { success: 0, fail: 0, skip: 0 };

  for (const id in mapping) {
    const koName = mapping[id].ko_name;
    const dest = path.join(outputDir, `${id}.webp`);

    // 이미 존재하는 파일은 건너뜀 (이미 확보된 41종 보호)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      results.skip++;
      continue;
    }

    let foundUrl = null;

    // 1. alt 속성 직접 찾기 (가장 정확)
    $(`img`).each((i, el) => {
      const alt = $(el).attr('alt') || '';
      if (alt.includes(koName)) {
        foundUrl = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-srcset');
        return false;
      }
    });

    // 2. 텍스트 근처 이미지 찾기 (카카오/나무위키 특유의 구조)
    if (!foundUrl) {
      $(`*:contains("${koName}")`).each((i, el) => {
        const $parent = $(el).closest('div, td, table, tr');
        const img = $parent.find('img').first();
        if (img.length) {
          foundUrl = img.attr('src') || img.attr('data-src') || img.attr('srcset');
          return false;
        }
      });
    }

    if (foundUrl) {
      try {
        // srcset 처리 (첫 번째 URL 추출)
        if (foundUrl.includes(',')) {
          foundUrl = foundUrl.split(',')[0].trim().split(' ')[0];
        }

        await download(foundUrl, dest);
        results.success++;
        process.stdout.write('+');
      } catch (err) {
        // console.error(`\n[${id}] Fail: ${err.message}`);
        results.fail++;
      }
    } else {
      results.skip++;
    }
  }

  console.log(`\nFinal Sync: Success ${results.success}, Failed ${results.fail}, Skipped ${results.skip}`);
  console.log(`Check directory: ${outputDir}`);
}

run();
