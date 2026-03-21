const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const MAIN_FILE = path.join(BASE_DIR, 'ch38_50_vietnamese_translation.md');
const APPEND_FILE = path.join(BASE_DIR, 'translation_ch38_50_append.md');
const OUTPUT_FILE = path.join(BASE_DIR, 'ch38_50_vietnamese_translation.md');

function extractChapters(lines) {
  const pattern = /^## Chương (\d+)\s+(.+)$/;
  const allOccurrences = {}; // num -> [line indices]
  const allPositions = []; // [{num, pos}]
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(pattern);
    if (m) {
      const num = parseInt(m[1], 10);
      if (!allOccurrences[num]) allOccurrences[num] = [];
      allOccurrences[num].push(i);
      allPositions.push({ num, pos: i });
    }
  }
  allPositions.sort((a, b) => a.pos - b.pos);
  const ranges = {};
  const order = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  for (const num of order) {
    const occs = allOccurrences[num] || [];
    if (occs.length === 0) continue;
    const start = occs[0];
    let end = lines.length;
    if (occs.length > 1) end = Math.min(end, occs[1]);
    const idx = allPositions.findIndex(p => p.num === num && p.pos === start);
    if (idx >= 0 && idx + 1 < allPositions.length) {
      end = Math.min(end, allPositions[idx + 1].pos);
    }
    ranges[num] = { start, end };
  }
  return ranges;
}

function applyReplacements(text) {
  return text
    .replace(/ngươi/g, 'bạn')
    .replace(/【猩红圣杯】/g, 'Chén Thánh Đỏ Tươi')
    .replace(/【Tinh Hồng Thánh Bôi】/g, 'Chén Thánh Đỏ Tươi')
    .replace(/Tinh Hồng Thánh Bôi/g, 'Chén Thánh Đỏ Tươi');
}

function main() {
  const mainContent = fs.readFileSync(MAIN_FILE, 'utf8');
  const mainLines = mainContent.split('\n');

  // Find cut point: keep up to and including "---" before Ch40
  let cutIdx = mainLines.length;
  for (let i = 0; i < mainLines.length; i++) {
    if (mainLines[i].trim() === '---') {
      for (let j = i + 1; j < Math.min(i + 5, mainLines.length); j++) {
        if (mainLines[j].trim() && mainLines[j].startsWith('## Chương 40')) {
          cutIdx = i + 1;
          break;
        }
      }
      if (cutIdx < mainLines.length) break;
    }
    if (/^## Chương 40 /.test(mainLines[i])) {
      cutIdx = i;
      break;
    }
  }
  if (cutIdx === mainLines.length) cutIdx = 452;

  let baseContent = mainLines.slice(0, cutIdx).join('\n');
  baseContent = applyReplacements(baseContent);

  const appendContent = fs.readFileSync(APPEND_FILE, 'utf8');
  const appendLines = appendContent.split(/\r?\n/);
  const ranges = extractChapters(appendLines);
  const order = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  const parts = [];
  for (const ch of order) {
    if (!ranges[ch]) {
      console.warn('Warning: Chapter', ch, 'not found');
      continue;
    }
    const { start, end } = ranges[ch];
    const chapterLines = appendLines.slice(start, end);
    const chapterText = chapterLines
      .filter(line => !/^\s*(上一章|返回目录|加入书签|下一章)\s*$/.test(line.trim()))
      .join('\n');
    parts.push(applyReplacements(chapterText));
  }

  const ch40_50 = parts.join('\n\n');
  const final = baseContent.trimEnd() + '\n\n' + ch40_50;
  fs.writeFileSync(OUTPUT_FILE, final, 'utf8');
  console.log('Done. Merged chapters 38-50 into', OUTPUT_FILE);
}

main();
