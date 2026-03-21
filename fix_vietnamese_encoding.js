/**
 * Sửa lỗi encoding tiếng Việt:
 * 1. Double-encoding (mojibake): LÃ½->Lý, khÃ´ng->không, etc.
 * 2. Các pattern ? bị lỗi
 */
const fs = require('fs');
const path = require('path');

const MAIN = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');
const BACKUP = MAIN + '.encoding_backup_' + Date.now();

let content = fs.readFileSync(MAIN, 'utf8');
fs.writeFileSync(BACKUP, content, 'utf8');
console.log('Đã backup:', BACKUP);

// 1. Sửa double-encoding (UTF-8 bị đọc nhầm thành Latin-1)
// Cần thứ tự: cụm dài trước, ký tự đơn sau
const mojibake = [
  ['khÃ´ng', 'không'], ['HoÃ n', 'Hoàn'], ['thÃ nh', 'thành'], ['thÃ¡i', 'thái'],
  ['LÃ¢m', 'Lâm'], ['VÃ£n', 'Vãn'], ['tÃªn', 'tên'], ['lÃ ', 'là'],
  ['trÃªn', 'trên'], ['bÃªn', 'bên'], ['ngoÃ i', 'ngoài'], ['phÃ²ng', 'phòng'],
  ['thuÃª', 'thuê'], ['thÃ¡ng', 'tháng'], ['chÃºt', 'chút'], ['cÃ´ng', 'công'],
  ['viÃªn', 'viên'], ['cÃ³', 'có'], ['nÃ o', 'nào'], ['mÃ£i', 'mãi'],
  ['gÃ¡i', 'gái'], ['cÃ nh', 'cạnh'], ['sÃ¡ng', 'sáng'], ['lÃªn', 'lên'],
  ['nhÃ¢n', 'nhân'], ['sÃ´ng', 'sống'], ['trÃ²', 'trò'], ['chuyÃªn', 'chuyên'],
  ['quyÃªn', 'quyền'], ['quÃ¡', 'quá'], ['chÃ­nh', 'chính'], ['phÃ¢n', 'phân'],
  ['tÃ­ch', 'tích'], ['chiÃªu', 'chiếu'], ['sÃ¢u', 'sâu'], ['tÃ¡c', 'tác'],
  ['hÃ ng', 'hàng'], ['triÃªu', 'triệu'], ['nhÃ£', 'nhã'], ['nghiÃªm', 'nghiêm'],
  ['mÃ¡y', 'máy'], ['rÃª', 'rê'], ['thiÃªn', 'thiên'], ['khÃ­', 'khí'],
  ['trÃºng', 'trùng'], ['khÃ³', 'khó'], ['mÃ¬nh', 'mình'], ['hÃ¬nh', 'hình'],
  ['kiÃªm', 'kiếm'], ['giÃ¡', 'giá'], ['trÃ­', 'trí'], ['thÃº', 'thú'],
  ['bÃ¬nh', 'bình'], ['phÃ©p', 'phép'], ['quÃ³c', 'quốc'], ['nghÃ¬a', 'nghĩa'],
  ['vÃ¬', 'vì'], ['vÃµ', 'võ'], ['nhÃ ', 'nhà'], ['sÃ­nh', 'sính'],
  ['Ã­t', 'ít'], ['lÃ½', 'lý'],
  // Ký tự đơn
  ['Ã¡', 'á'], ['Ã¢', 'â'], ['Ã£', 'ã'], ['Ã©', 'é'], ['Ã¨', 'è'],
  ['Ãª', 'ê'], ['Ã­', 'í'], ['Ã¬', 'ì'], ['Ã³', 'ó'], ['Ã²', 'ò'],
  ['Ã´', 'ô'], ['Ãµ', 'õ'], ['Ãº', 'ú'], ['Ã¹', 'ù'], ['Ã»', 'û'],
  ['Ã½', 'ý'], ['Ã ', 'à'],
];

for (const [from, to] of mojibake) {
  content = content.split(from).join(to);
}

// 2. Sửa các pattern ? còn lại
const questionFixes = [
  ['# Qu?n Lý ??a Ng?c (NPH)', '# Quản Lý Địa Ngục (NPH)'],
  ['Qu?n Lý ??a Ng?c (NPH)', 'Quản Lý Địa Ngục (NPH)'],
  ['Tr?ng thái:', 'Trạng thái:'],
  ['HoÃ n thÃ nh', 'Hoàn thành'],
  ['HoÃ n toÃ n', 'Hoàn toàn'],
  ['mđội', 'mươi'],
  ['hoang động', 'hoang đường'],
  ['hoang ???ng', 'hoang đường'],
  ['cung c?p', 'cung cấp'],
  ['## Ch??ng ', '## Chương '],
  ['Ch??ng ', 'Chương '],
  ['??a ngục', 'địa ngục'],
  ['??a Ngục', 'Địa Ngục'],
  ['qu?n', 'quản'],
  ['Ng?c', 'Ngục'],
  ['c?a ', 'của '],
  ['?Ã£ ', 'đã '],
  ['?ã ', 'đã '],
  ['??i ', 'đội '],
  ['??t ', 'đặt '],
  ['??c ', 'được '],
  ['??n ', 'đến '],
  ['??ng ', 'động '],
  ['??a ', 'địa '],
  ['??o', 'đạo'],
  ['??u', 'đầu'],
  ['L?i m?i', 'Lời mời'],
  ['lđi', 'lời'],
  ['mđi', 'mời'],
  ['lừa ??a', 'lừa đạo'],
  ['đội lý', 'đại lý'],
  ['lđộng', 'lượng'],
  ['vđội', 'với'],
  ['vđặt', 'với'],
  ['vđi', 'với'],
  ['phđi', 'phải'],
  ['gđi', 'gửi'],
  ['ngđội', 'người'],
  ['rđi', 'rồi'],
  ['tđi', 'tại'],
  ['thđộng', 'thường'],
  ['hđội', 'hội'],
  ['hđi', 'hội'],
  ['nđi', 'nội'],
  ['dđội', 'dưới'],
  ['gđộng', 'gương'],
  ['trđi', 'trải'],
  ['?được', 'được'],
  ['?động', 'động'],
  ['?ang ', 'đang '],
  ['?úng', 'đúng'],
];

for (const [from, to] of questionFixes) {
  content = content.split(from).join(to);
}

fs.writeFileSync(MAIN, content, 'utf8');
console.log('Đã sửa. Ghi UTF-8.');
console.log('Xong.');
