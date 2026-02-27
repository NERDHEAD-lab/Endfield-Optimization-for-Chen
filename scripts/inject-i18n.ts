import fs from "fs";
import path from "path";

// i18n-append-ko.json 와 i18n-append-en.json 데이터 병합 스크립트
const koPath = path.join(__dirname, "i18n-append-ko.json");
const enPath = path.join(__dirname, "i18n-append-en.json");
const targetTSPath = path.join(__dirname, "../src/renderer/i18n/index.ts");

const koData: Record<string, string> = JSON.parse(
  fs.readFileSync(koPath, "utf-8"),
);
const enData: Record<string, string> = JSON.parse(
  fs.readFileSync(enPath, "utf-8"),
);

const tsContent = fs.readFileSync(targetTSPath, "utf-8");

// 객체 내부에 번역 추가 함수 (기존 "equip." 키워드가 들어간 줄을 먼저 제거 후 덮어쓰기)
function injectTranslations(
  content: string,
  lang: "ko" | "en",
  newData: Record<string, string>,
) {
  // lang: { translation: { 안으로 텍스트 추가 } }
  const regex = new RegExp(
    `(${lang}:\\s*\\{\\s*translation:\\s*\\{)([\\s\\S]*?)(^\\s*\\},?\\s*$)`,
    "m",
  );

  const match = content.match(regex);
  if (!match) return content;

  // 1. 기존의 equip. 프로퍼티를 가진 행들을 모두 지운다 (중복 에러 방지용 클리어)
  const lines = match[2].split("\n");
  const filteredLines = lines.filter((line) => !line.includes('"equip.'));

  // 2. 새로운 프로퍼티 행들을 문자열로 생성
  let stringifiedNewData = "";
  for (const [key, val] of Object.entries(newData)) {
    stringifiedNewData += `      "${key}": "${val}",\n`;
  }

  // 3. clean 된 내부 코드 + 새 코드로 교체
  const newInnerCode = filteredLines.join("\n") + stringifiedNewData;
  return content.replace(regex, `$1${newInnerCode}$3`);
}

let result = injectTranslations(tsContent, "ko", koData);
result = injectTranslations(result, "en", enData);

fs.writeFileSync(targetTSPath, result);
console.log(
  "Successfully injected scraped i18n strings to index.ts without duplicates",
);
