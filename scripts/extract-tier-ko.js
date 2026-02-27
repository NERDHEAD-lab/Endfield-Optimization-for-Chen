const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourcePath = path.join(__dirname, 'temp_source', 'namu_ko.html');
const mappingPath = path.join(__dirname, 'temp_source', 'mapping.json');
const outputPath = path.join(__dirname, 'temp_source', 'extracted_tier_ko.json');

function extractTierData() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return;
  }

  const html = fs.readFileSync(sourcePath, 'utf-8');
  const cleanHtml = html.replace(/\s+/g, ' ');
  
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const tierResults = {};
  const koToId = {};
  for (const id in mapping) { koToId[mapping[id].ko_name] = id; }
  const validKoNames = Object.keys(koToId);

  // 섹션 정의 (나무위키 본문 내 등장하는 레벨 헤더)
  const sections = [
    { key: 'Lv. 70', tier: 5 },
    { key: 'Lv. 50', tier: 4 },
    { key: 'Lv. 36', tier: 3 },
    { key: 'Lv. 28', tier: 2 },
    { key: 'Lv. 20', tier: 2 },
    { key: 'Lv. 10', tier: 1 }
  ];

  // 전체 텍스트에서 섹션 키워드 인덱스 찾기
  let snapshots = [];
  sections.forEach(sec => {
    let pos = cleanHtml.indexOf(sec.key);
    while (pos !== -1) {
      snapshots.push({ pos, tier: sec.tier });
      pos = cleanHtml.indexOf(sec.key, pos + 1);
    }
  });
  snapshots.sort((a, b) => a.pos - b.pos);

  // 모든 매핑 대상에 대해 전수 조사
  for (const id in mapping) {
    const koName = mapping[id].ko_name;
    const cleanName = koName.replace(/\s+/g, ''); // 공백 제거 이름

    // 1. 공백 무시 정규표현식으로 위치 찾기
    const pattern = koName.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
    const regex = new RegExp(pattern, 'g');
    
    let tiersFound = [];
    let match;
    while ((match = regex.exec(cleanHtml)) !== null) {
      const pos = match.index;
      let assignedTier = 0;
      for (let i = 0; i < snapshots.length; i++) {
        if (snapshots[i].pos < pos) {
          assignedTier = snapshots[i].tier;
        } else {
          break;
        }
      }
      if (assignedTier > 0) tiersFound.push(assignedTier);
    }

    // 2. 별(★) 갯수 직접 매칭 확인
    const starPattern = pattern + "[^<]*?(★+)";
    const starRegex = new RegExp(starPattern, 'g');
    while ((match = starRegex.exec(cleanHtml)) !== null) {
      tiersFound.push(match[1].length);
    }

    // 3. 결과 확정
    if (tiersFound.length > 0) {
      tierResults[id] = Math.max(...tiersFound);
    } else {
      // 나무위키에 없는 경우 (undefined 처리 - rebuild script에서 기본값 처리 예정)
      tierResults[id] = undefined; 
    }
  }

  // 최종 저장
  fs.writeFileSync(outputPath, JSON.stringify(tierResults, null, 2));
  
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 'undefined': 0 };
  Object.keys(tierResults).forEach(id => {
    const t = tierResults[id];
    if (t === undefined) counts['undefined']++;
    else counts[t] = (counts[t] || 0) + 1;
  });
  
  console.log('--- Final Tier Restoration Result (with Unmapped Handling) ---');
  console.log(`Total Handled: ${Object.keys(tierResults).length}`);
  [5,4,3,2,1].forEach(t => console.log(`Tier ${t}: ${counts[t] || 0}`));
  console.log(`Unmapped (undefined): ${counts['undefined']}`);
}

extractTierData();
