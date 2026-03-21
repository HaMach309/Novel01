const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');

const content = fs.readFileSync(FILE_PATH, 'utf8');
const lines = content.split('\n');

// Tìm block trùng: "# Chương 57 – Chương 39" xuất hiện 2 lần
const ch39Indices = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Chương 39 Như Mộng Tự Huyễn')) {
    ch39Indices.push(i);
  }
}

if (ch39Indices.length >= 2) {
  // Xóa từ dòng trước lần xuất hiện thứ 2 (---) đến trước *[Hết phần dịch thay thế
  const secondCh39 = ch39Indices[1];
  let startDel = secondCh39 - 1;
  while (startDel > 0 && (lines[startDel].trim() === '' || lines[startDel].trim() === '---')) {
    startDel--;
  }
  startDel++; // Bắt đầu xóa từ dòng --- hoặc blank trước # Chương 57 lần 2

  let endDel = secondCh39;
  while (endDel < lines.length && !(lines[endDel].includes('Hết phần dịch thay thế') && lines[endDel].includes('Chương 57'))) {
    endDel++;
  }
  if (endDel < lines.length) {
    const toRemove = endDel - startDel;
    lines.splice(startDel, toRemove);
    fs.writeFileSync(FILE_PATH, lines.join('\n'), 'utf8');
    console.log('Đã xóa block Ch 57 trùng lặp,', toRemove, 'dòng');
  } else {
    console.log('Không tìm thấy dòng kết thúc');
  }
} else {
  console.log('Không có block trùng');
}
