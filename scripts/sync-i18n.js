const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, 'temp_source', 'mapping.json');

function syncI18n() {
  if (!fs.existsSync(mappingPath)) {
    console.error('mapping.json not found');
    return;
  }

  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  
  const koTranslations = {};
  const enTranslations = {};

  for (const [id, info] of Object.entries(mapping)) {
    koTranslations[`equip.${id}`] = info.ko_name;
    enTranslations[`equip.${id}`] = info.en_name;
  }

  const result = {
    ko: koTranslations,
    en: enTranslations
  };

  fs.writeFileSync(path.join(__dirname, 'temp_source', 'i18n_snippet.json'), JSON.stringify(result, null, 2));
  console.log('Generated i18n_snippet.json with 149 items.');
}

syncI18n();
