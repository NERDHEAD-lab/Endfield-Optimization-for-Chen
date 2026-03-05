const fs = require('fs');
const path = require('path');

const enSourcePath = path.join(__dirname, 'temp_source', 'extracted_en.json');
const tierKoSourcePath = path.join(__dirname, 'temp_source', 'extracted_tier_ko.json');
const mappingPath = path.join(__dirname, 'temp_source', 'mapping.json');
const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'equipment');
const outputPath = path.join(__dirname, '..', 'src', 'shared', 'data', 'equipment.json');

/**
 * 기존 커밋된 JSON 구조를 유지하며 level 및 imgUrl 필드 추가
 */
function rebuildEquipment() {
  if (!fs.existsSync(enSourcePath) || !fs.existsSync(mappingPath)) {
    console.error('Required source files missing.');
    return;
  }

  const enItems = JSON.parse(fs.readFileSync(enSourcePath, 'utf-8'));
  const tierKo = fs.existsSync(tierKoSourcePath) ? JSON.parse(fs.readFileSync(tierKoSourcePath, 'utf-8')) : {};
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  const nameToId = {};
  for (const id in mapping) {
    nameToId[mapping[id].en_name] = id;
  }

  const rarityMap = {
    'Gold': 5,
    'Purple': 4,
    'Blue': 3,
    'Green': 2,
    'White': 1
  };

  const tierToLevel = {
    5: 70,
    4: 50,
    3: 36,
    2: 28,
    1: 10
  };

  const finalEquipment = {};

  enItems.forEach(item => {
    const id = nameToId[item.name];
    if (!id) return;

    const tier = tierKo[id] || rarityMap[item.rarity] || 1;
    const level = tierToLevel[tier] || 10;

    // 이미지 경로 확인
    let imgUrl = "";
    if (fs.existsSync(path.join(assetsDir, `${id}.webp`))) {
      imgUrl = `assets/equipment/${id}.webp`;
    }

    // 1. stats (배열 유지, DEFENSE 제외)
    const stats = [];
    if (item.stats && Array.isArray(item.stats)) {
      item.stats.forEach(s => {
        if (s.type !== 'DEFENSE') {
          stats.push({
            type: s.type,
            value: s.value
          });
        }
      });
    }

    // 2. effects (배열 유지, isPercentage 보존)
    const effects = [];
    if (item.effects && Array.isArray(item.effects)) {
      item.effects.forEach(e => {
        let val = e.value;
        if (typeof val === 'string') {
          val = parseFloat(val.replace(/[^\d.-]/g, ''));
        }
        effects.push({
          type: e.type,
          value: val,
          isPercentage: !!e.isPercentage
        });
      });
    }

    finalEquipment[id] = {
      id: id,
      tier: tier,
      level: level,
      type: item.type,
      set: item.set,
      stats: stats,
      effects: effects,
      imgUrl: imgUrl
    };
  });

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalEquipment, null, 2));
  
  const totalCount = Object.keys(finalEquipment).length;
  console.log(`Rebuilt equipment.json with ${totalCount} items. (Includes local asset paths)`);
}

rebuildEquipment();
