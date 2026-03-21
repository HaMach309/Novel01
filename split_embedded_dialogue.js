/**
 * Tách thoại dính trong tường thuật (rule 10.1 beta-truyen)
 * Pattern: "[Thoại 1]" [tường thuật]: "[Thoại 2]" → tách thành 3 đoạn riêng
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

function main() {
  let content = fs.readFileSync(filePath, 'utf8');
  
  let count = 0;
  
  // Pattern 1: "d1" narrative: "d2"
  const pattern1 = /"([^"]+)"\s+([^"]{3,120}?)\s*:\s*"([^"]+)"/g;
  content = content.replace(pattern1, (match, d1, narrative, d2) => {
    count++;
    const n = narrative.trim();
    const nEnd = n.endsWith('.') || n.endsWith('?') || n.endsWith('!') ? n : n + '.';
    return `"${d1}"\n\n${nEnd}\n\n"${d2}"`;
  });
  
  // Pattern 2: "d1" Hắn/hắn attribution, "d2" (dấu phẩy trước quote thứ 2)
  const pattern2 = /"([^"]+)"\s+(Hắn|hắn|Karl|Bạn|bạn|Cô|cô)[^"]{2,80}?,\s*"([^"]+)"/g;
  content = content.replace(pattern2, (match, d1, _, d2) => {
    const mid = match.slice(d1.length + 3, match.length - d2.length - 3).trim();
    if (mid.length < 150) {
      count++;
      let nEnd = mid.replace(/,\s*$/, '');
      nEnd = nEnd.endsWith('.') || nEnd.endsWith('?') || nEnd.endsWith('!') ? nEnd : nEnd + '.';
      return `"${d1}"\n\n${nEnd}\n\n"${d2}"`;
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Đã tách', count, 'thoại dính.');
}

main();
