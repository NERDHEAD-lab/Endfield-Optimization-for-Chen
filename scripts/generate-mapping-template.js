const fs = require('fs');
const path = require('path');

const enSource = JSON.parse(fs.readFileSync(path.join(__dirname, 'temp_source', 'extracted_en.json'), 'utf-8'));
const mapping = {};

// 1. 영문명을 ID화 (SNAKE_CASE_UPPER)
// 2. 수동 매핑 가이드 생성
enSource.forEach(item => {
  const id = item.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  mapping[id] = {
    en_name: item.name,
    ko_name: "", // 수동 기입 필요
    type: item.type,
    set: item.set
  };
});

fs.writeFileSync(path.join(__dirname, 'temp_source', 'mapping_template.json'), JSON.stringify(mapping, null, 2));
console.log(`Created mapping template with ${enSource.length} placeholders.`);
