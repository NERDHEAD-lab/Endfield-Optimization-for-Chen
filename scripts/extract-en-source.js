const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourcePath = path.join(__dirname, 'temp_source', 'game8_en.html');
const outputPath = path.join(__dirname, 'temp_source', 'extracted_en.json');

function normalizeStatName(name) {
  const mapping = {
    'Defense': 'DEFENSE',
    'Strength': 'STRENGTH',
    'Agility': 'AGILITY',
    'HP': 'HP',
    'Intellect': 'INTELLECT',
    'Will': 'WILL',
    'Critical Rate': 'CRIT_RATE',
    'Attack': 'ATTACK',
    'Movement Speed': 'MOVE_SPEED',
    'Crit Rate': 'CRIT_RATE',
    'Defense Penetration': 'DEF_PEN',
    'Ultimate Gain Efficiency': 'ULTIMATE_GAIN_EFFICIENCY'
  };
  return mapping[name] || name.toUpperCase().replace(/\s+/g, '_');
}

function parseValue(valueStr) {
  const cleaned = valueStr.replace(/%+/g, '%').trim();
  const isPercentage = cleaned.includes('%');
  const numericValue = parseFloat(cleaned.replace(/[^\d.-]/g, ''));
  return { value: numericValue, isPercentage };
}

function extractEnData() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return;
  }

  const html = fs.readFileSync(sourcePath, 'utf-8');
  const $ = cheerio.load(html);
  const items = [];

  $('table.a-table tbody tr').each((i, tr) => {
    const tds = $(tr).find('td');
    if (tds.length >= 7) {
      const name = $(tds[0]).text().trim();
      const type = $(tds[1]).text().trim();
      const rarity = $(tds[3]).text().trim(); // Rarity 컬럼 (4번째 td)
      
      const rawSubstats = [];
      $(tds[4]).find('b.a-bold').each((j, b) => {
        const statName = $(b).text().trim().replace(/:$/, '');
        let statValueText = '';
        const nextNode = b.nextSibling;
        if (nextNode && nextNode.type === 'text') {
          statValueText = nextNode.data.trim().replace(/^:\s*/, '');
        }

        if (statName && statValueText) {
          const normalized = normalizeStatName(statName);
          const parsed = parseValue(statValueText);
          rawSubstats.push({ type: normalized, ...parsed });
        }
      });

      const stats = [];
      const effects = [];
      
      const filtered = rawSubstats.filter(s => s.type !== 'DEFENSE');
      
      filtered.forEach((s) => {
        if (s.isPercentage) {
          effects.push({ type: s.type, value: s.value, isPercentage: true });
        } 
        else if (stats.length < 2) {
          stats.push({ type: s.type, value: s.value });
        } 
        else {
          effects.push({ type: s.type, value: s.value, isPercentage: false });
        }
      });

      const set = $(tds[5]).text().trim();
      
      if (name && name !== 'Gear') {
        items.push({
          name,
          type: type.toUpperCase(),
          rarity: rarity, // 신규 추가
          set: set,
          stats,
          effects
        });
      }
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
  console.log(`Extracted ${items.length} English items with rarity to ${outputPath}`);
}

extractEnData();
