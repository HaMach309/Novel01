/**
 * Chuẩn hóa VoCuaBanKhongKhachKhi.md theo SKILL beta-truyen
 * Sửa: encoding lỗi, chữ Hán trong metadata, tên nhân vật, typo
 */
const fs = require('fs');
const path = require('path');

const MAIN = path.join(__dirname, 'Truyện đã dịch', 'VoCuaBanKhongKhachKhi.md');
const BACKUP = MAIN + '.backup_' + Date.now();

let content = fs.readFileSync(MAIN, 'utf8');
fs.writeFileSync(BACKUP, content, 'utf8');
console.log('Đã backup:', BACKUP);

// Thứ tự quan trọng: thay thế dài trước, ngắn sau để tránh conflict
const replacements = [
  // Encoding corruption - từ dài trước
  ['tя͢ầи ͙ȶя͢υồиɠ', 'trần trụi'],
  ['c̠ôи ŧɧịt̠', 'côn thịt'],
  ['ρᏂậи 🅢iиɧ ɖụ©', 'phận sinh dục'],
  ['du͙© vọиɠ', 'dục vọng'],
  ['kɧıêυ ҡɧí©ɧ', 'khiêu khích'],
  ['gợϊ ȶìиᏂ', 'gợi tình'],
  ['máʏ яυиɠ', 'máy rung'],
  ['kɧoáı ©ảʍ', 'khoái cảm'],
  ['vụиɠ ŧяộʍ', 'vụng trộm'],
  ['làʍ t̠ìиɦ', 'làm tình'],
  ['dâʍ đãиɠ', 'dâm đãng'],
  ['dâʍ ŧᏂủy̠', 'dâm thủy'],
  ['ɭẳиɠ ɭơ', 'lắng lơ'],
  ['kí©ɧ ŧɧí©ɧ', 'kích thích'],
  ['kí©ɧ ɖụ©', 'kích dục'],
  ['tϊиɧ ɖϊ©h͙', 'tinh dịch'],
  ['tìиɧ ɖu͙©', 'tình dục'],
  ['qυყ đầυ', 'quy đầu'],
  ['qυầи ɭóŧ', 'quần lót'],
  ['qυầи ', 'quần '],
  ['áσ ɭóŧ', 'áo lót'],
  ['cặρ √υ"', 'cặp vú'],
  ['đầṳ ѵú', 'đầu vú'],
  ['bóρ ѵú', 'bóp vú'],
  ['núʍ ѵú', 'núm vú'],
  ['rêи ɾỉ', 'rên rỉ'],
  ['liếʍ ', 'liếm '],
  ['liếʍ', 'liếm'],
  ['mυ"ŧ', 'mút'],
  ['bú ʍúŧ', 'bú mút'],
  ['ŧᏂịŧ', 'thịt'],
  ['cởϊ ', 'cởi '],
  ['đυ.ng', 'đụng'],
  ['đυ.c', 'đục'],
  ['l*иg ngực', 'lồng ngực'],
  ['l*иg ', 'lồng '],
  ['©υиɠ', 'cung'],
  ['xá© ŧᏂịŧ', 'xác thịt'],
  ['da^ʍ', 'dâm'],
  ['gϊếŧ', 'giết'],
  ['cɧó ©áϊ', 'chó cái'],
  ['khϊếp', 'khiếp'],

  // Chữ Hán metadata -> giữ link, chuyển tên tác giả
  ['土豆球球 (Tǔdòu qiúqiú)', 'Đỗ Đậu Cầu Cầu (Tác giả gốc)'],
  ['朋友妻，不客气！', 'Bằng Hữu Thê, Bất Khách Khí'],
  ['晋江文学城', 'Tấn Giang Văn Học Thành'],

  // Tên nhân vật
  ['Kỳ ngọc', 'Kỳ Ngọc'],
  ['NHan Nhan', 'Nhan Nhan'],
  ['Mặc Nhan', 'Mạc Nhan'],

  // Typo - Mạc Nhiên khi đúng ra phải là Mạc Nhan (vợ)
  ['áo sơ mi của Mạc Nhiên bị mở rộng', 'áo sơ mi của Mạc Nhan bị mở rộng'],
  ['Mạc Nhiên hiện tại là vợ của nó', 'Mạc Nhan hiện tại là vợ của nó'],

  // Typo khác
  ['cúc huyệt ủa em', 'cúc huyệt của em'],
  ['củacô ', 'của cô '],
  ['đừng tưởng rẳng', 'đừng tưởng rằng'],
  ['sau khí đút', 'sau khi đút'],
  ['côn thit ', 'côn thịt '],
];

for (const [from, to] of replacements) {
  const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  content = content.split(from).join(to);
  if (count > 0) console.log(`  ${from} → ${to} (${count})`);
}

// Sửa "Thật sự là càng ngày càng tao" -> "thao" (trong ngữ cảnh giường chiếu)
content = content.replace(/Thật sự là càng ngày càng tao\./g, 'Thật sự là càng ngày càng thao.');

// Sửa "Thật tao" thành "Thật thao" khi trong ngữ cảnh tình dục
content = content.replace(/"Thật tao,/g, '"Thật thao,');

fs.writeFileSync(MAIN, content, 'utf8');
console.log('Đã chuẩn hóa xong. File ghi UTF-8.');
