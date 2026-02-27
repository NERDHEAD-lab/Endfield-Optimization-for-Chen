const fs = require('fs');
const path = require('path');

const enSourcePath = path.join(__dirname, 'temp_source', 'extracted_en.json');
const tierKoSourcePath = path.join(__dirname, 'temp_source', 'extracted_tier_ko.json');
const mappingPath = path.join(__dirname, 'temp_source', 'mapping.json');
const outputPath = path.join(__dirname, '..', 'src', 'shared', 'data', 'equipment.json');

/**
 * 나무위키 데이터(우선) + 해외 사이트 등급 데이터를 조합하여 최종 티어 결정
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

  // 해외 사이트 Rarity -> Tier 매핑
  const rarityMap = {
    'Gold': 5,
    'Purple': 4,
    'Blue': 3,
    'Green': 2,
    'White': 1
  };

  const finalEquipment = {};

  enItems.forEach(item => {
    const id = nameToId[item.name];
    if (!id) return;

    // 티어 결정 우선순위:
    // 1. 나무위키 추출 데이터 (별 갯수 기반)
    // 2. 해외 사이트 인게임 컬러 기반 Rarity 
    // 3. 기본값 1
    const tier = tierKo[id] || rarityMap[item.rarity] || 1;

    finalEquipment[id] = {
      id: id,
      tier: tier,
      type: item.type,
      set: item.set,
      stats: item.stats,
      effects: item.effects
    };
  });

  // 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalEquipment, null, 2));
  
  const totalCount = Object.keys(finalEquipment).length;
  const tierCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  Object.values(finalEquipment).forEach(e => tierCounts[e.tier]++);
  
  console.log(`--- Final Rebuild Statistics ---`);
  console.log(`Total Equipment: ${totalCount}`);
  [5,4,3,2,1].forEach(t => console.log(`Tier ${t}: ${tierCounts[t]}`));
}

rebuildEquipment();
