const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');
const BACKUP_PATH = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md.backup');

function fixDoubleEncoding(text) {
  try {
    return Buffer.from(text, 'latin1').toString('utf8');
  } catch (e) {
    return text;
  }
}

function processFile() {
  console.log('Đang đọc file...');
  let content = fs.readFileSync(FILE_PATH, 'utf8');
  const lines = content.split('\n');
  const total = lines.length;
  console.log('Tổng số dòng:', total);

  // Backup
  console.log('Đang tạo backup...');
  fs.writeFileSync(BACKUP_PATH, content, 'utf8');

  // 1. Xóa chương trùng (0-indexed) - chỉ chạy nếu còn chương trùng
  const ranges = [
    [12592, 12717],   // Ch 52 duplicate
    [12310, 12466],   // Ch 51 duplicate
    [2393, 3539],     // Ch 11-14 duplicate
  ].sort((a, b) => b[0] - a[0]);

  for (const [start, end] of ranges) {
    if (start < lines.length) {
      const delCount = Math.min(end - start, lines.length - start);
      if (delCount > 0) {
        lines.splice(start, delCount);
        console.log('Đã xóa dòng', start + 1, '-', start + delCount);
      }
    }
  }

  // 2. Sửa double encoding
  const doubleEncPattern = /[Æ°á»‡Ã¢Ä]/;
  let fixedCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (doubleEncPattern.test(lines[i])) {
      try {
        const fixed = fixDoubleEncoding(lines[i]);
        if (fixed !== lines[i]) {
          lines[i] = fixed;
          fixedCount++;
        }
      } catch (e) {}
    }
  }
  console.log('Đã sửa', fixedCount, 'dòng encoding');

  // 3. Chương 57 - bỏ qua nếu chưa có file hoặc đã thay thế rồi
  const ch57Path = path.join(__dirname, 'ch57_full_translation.md');
  const alreadyHasCh57Full = content.includes('Phần dịch thay thế') && content.includes('Hết phần dịch thay thế');
  if (fs.existsSync(ch57Path) && !alreadyHasCh57Full) {
    let ch57Start = -1, ch57Bracket = -1, ch58Start = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/## Ch.*57/.test(lines[i])) ch57Start = i;
      if (ch57Start >= 0 && lines[i].includes('[...]') && !lines[i].includes('Phần dịch thay thế')) ch57Bracket = i;
      if (ch57Start >= 0 && /## Ch.*58/.test(lines[i])) { ch58Start = i; break; }
    }
    if (ch57Bracket >= 0 && ch58Start >= 0) {
      const ch57Full = fs.readFileSync(ch57Path, 'utf8').trim();
      const parts = lines[ch57Bracket].split('[...]', 1);
      const newLines = [parts[0].trim(), '', ...ch57Full.split('\n')];
      lines.splice(ch57Bracket, ch58Start - ch57Bracket, ...newLines);
      console.log('Đã thay thế Chương 57');
    }
  } else {
    console.log('Chưa có ch57_full_translation.md - bỏ qua Ch 57');
  }

  // 4. Dọn tiêu đề thừa trong Ch 57 (nếu có)
  for (let i = 0; i < lines.length - 6; i++) {
    const hasCh39 = lines[i].includes('Chương 39') || /Ch.*ng 39/.test(lines[i]);
    const hasPhanDich = lines[i + 2] && lines[i + 2].includes('Phần dịch');
    // Sau ## Phần dịch có: blank, ---, blank, rồi "— Tuân mệnh"
    const nextLines = [lines[i+4], lines[i+5], lines[i+6]].join('');
    const hasDash = /^[\s—â€"]*—/.test(nextLines) || nextLines.includes('Tuân mệnh');
    if (hasCh39 && hasPhanDich && hasDash) {
      lines.splice(i, 5); // Xóa: # Chương 39, blank, ## Phần dịch, blank, ---
      console.log('Đã dọn tiêu đề thừa Ch 57');
      break;
    }
  }

  // Ghi file
  console.log('Đang ghi file...');
  fs.writeFileSync(FILE_PATH, lines.join('\n'), 'utf8');
  console.log('Hoàn tất!');
}

processFile();
