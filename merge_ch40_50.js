const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const APPEND_FILE = path.join(ROOT, 'translation_ch38_50_append.md');
const MAIN_FILE = path.join(ROOT, 'ch38_50_vietnamese_translation.md');

const CHAPTERS = [
  [41, '## Chương 41 – Massage của Karl (h)'],
  [42, '## Chương 42 – Toàn thân lui'],
  [43, '## Chương 43 – Giải cứu nhân viên'],
  [44, '## Chương 44 – Ảo ảnh Lily Tư Á'],
  [45, '## Chương 45 – Ảo cảnh Vi O Lai Khả (h)'],
  [46, '## Chương 46 – Mê cung trầm luân'],
  [47, '## Chương 47 – Bẫy của Vi O Lai Khả'],
  [48, '## Chương 48 – Vạn sự đã sẵn sàng'],
  [49, '## Chương 49 – Lời mời Mị Sắc Yêu Ảnh'],
  [50, '## Chương 50 – Vẫn chưa kết thúc (h)'],
];

function extractChapter(content, startMarker) {
  const start = content.indexOf(startMarker);
  if (start === -1) return null;
  // Find next ## Chương that appears AFTER our start (to handle out-of-order chapters)
  const nextChMatch = content.substring(start + startMarker.length).match(/\n## Chương \d+ –/);
  const end = nextChMatch
    ? start + startMarker.length + nextChMatch.index
    : content.length;
  return content.substring(start, end).trim();
}

function applyFixes(text) {
  return text
    .replace(/ngươi/g, 'bạn')
    .replace(/Ngươi/g, 'Bạn')
    .replace(/Tinh Hồng Thánh Bôi/g, 'Chén Thánh Đỏ Tươi')
    .replace(/【Tinh Hồng Thánh Bôi】/g, '【Chén Thánh Đỏ Tươi】')
    .replace(/Chén Thánh Chu Sa/g, 'Chén Thánh Đỏ Tươi')
    .replace(/【Chén Thánh Chu Sa】/g, '【Chén Thánh Đỏ Tươi】')
    .replace(/【Phi Sắc Mị Ảnh】/g, '【Mị Sắc Yêu Ảnh】')
    .replace(/Phi Sắc Mị Ảnh/g, 'Mị Sắc Yêu Ảnh')
    .replace(/上一章[\s\S]*?下一章/g, '')
    .replace(/返回目录|加入书签/g, '');
}

function main() {
  const appendContent = fs.readFileSync(APPEND_FILE, 'utf8');
  const mainContent = fs.readFileSync(MAIN_FILE, 'utf8');

  const extracted = [];
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [num, marker] = CHAPTERS[i];
    const ch = extractChapter(appendContent, marker);
    if (ch) {
      extracted.push(applyFixes(ch));
    }
  }

  let result = mainContent.trimEnd();
  if (result.endsWith('---')) {
    result = result.replace(/\s*---\s*$/, '');
  }
  result += '\n\n---\n\n' + extracted.join('\n\n') + '\n';

  fs.writeFileSync(MAIN_FILE, result, 'utf8');
  console.log('Merged chapters 41-50. Total chapters added:', extracted.length);
}

main();
