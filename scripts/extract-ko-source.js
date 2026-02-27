const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourcePath = path.join(__dirname, 'temp_source', 'namu_ko.html');
const outputPath = path.join(__dirname, 'temp_source', 'extracted_ko.json');

function extractKoData() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return;
  }

  const html = fs.readFileSync(sourcePath, 'utf-8');
  const $ = cheerio.load(html);
  const items = [];

  // 1. 모든 테이블 순회 (나무위키는 거의 모든 데이터를 테이블에 넣음)
  $('table').each((i, table) => {
    const tableText = $(table).text();
    
    // 세트 아이템인 경우 (세트 명칭 추출)
    if (tableText.includes('세트 효과')) {
      const title = $(table).find('tr:first-child').text().trim().split('\n')[0];
      if (title && title.length < 50) {
        items.push({ name: title, type: 'SET', source: 'TableTitle' });
      }
    }

    // 개별 아이템 명칭 후보들 (테이블 내 모든 셀 확인)
    $(table).find('td').each((j, td) => {
      let cellText = $(td).text().trim();
      
      // 줄바꿈 등으로 섞인 텍스트 정제
      cellText = cellText.replace(/\s+/g, ' ');

      // 아이템 명칭 패턴 매칭
      // 명칭이 "아이템명 · I" 또는 "아이템명" 형태인 경우가 많음
      const patterns = [
        /([가-힣\w\s.]+ (?:단검|글러브|장갑|경갑|중갑|흉갑|견갑|보호판|안정판|코어|장치|통신기|칩|반지|슈트|마스크|머플러|골격|부싯돌|조각상|센서|지시기에|램프|도구 세트|조준기|수갑|팔찌|절단기로|공급 장치|분석기|상자|함|측정기|필터|전지|용기|포|배낭|주사기|접속기|망토|코트|재킷|버클|벨트|팬츠|부츠|페달|엔진|기어|모듈|유닛|파츠|컴포넌트)(?: · [IV]+)?)/g
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(cellText)) !== null) {
          const matchedName = match[1].trim();
          if (matchedName.length > 2 && matchedName.length < 60) {
            // "엔드필드/" 같은 접두사 제거 (이미지 alt 텍스트 등에서 올 수 있음)
            const cleanName = matchedName.replace(/^엔드필드\//, '');
            items.push({ name: cleanName, type: 'ITEM', source: 'RegexMatch' });
          }
        }
      });
    });
  });

  // 2. 이미지 alt 텍스트에서도 추출 (나무위키 아이콘 옆에 이름이 있는 경우가 많음)
  $('img').each((i, img) => {
    const alt = $(img).attr('alt') || '';
    if (alt.startsWith('엔드필드/') && !alt.includes('기콘') && !alt.includes('아이콘')) {
      const name = alt.replace('엔드필드/', '').trim();
      if (name.length > 2 && name.length < 50) {
        items.push({ name, type: 'ITEM', source: 'ImgAlt' });
      }
    }
  });

  // 중복 제거 및 정량화
  const uniqueMap = new Map();
  items.forEach(item => {
    if (!uniqueMap.has(item.name)) {
      uniqueMap.set(item.name, item);
    }
  });
  
  const finalItems = Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  
  fs.writeFileSync(outputPath, JSON.stringify(finalItems, null, 2));
  console.log(`Extracted total ${finalItems.length} unique Korean items/sets.`);
}

extractKoData();
