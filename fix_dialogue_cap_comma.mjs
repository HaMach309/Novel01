#!/usr/bin/env node
/**
 * Thoại:
 * - Không kết thúc bằng phẩy ngay trước dấu đóng " (trừ khi sau đó còn mở " lồng: mệnh đề, "tiêu đề")
 * - Dòng chỉ là "…": viết hoa chữ cái đầu (bỏ qua khoảng trắng / — đầu trong ngoặc)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath =
  process.argv[2] ||
  path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

let content = fs.readFileSync(filePath, 'utf8');

const VI_LOWER =
  /[a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/;

function toUpperFirstViet(c) {
  const map = {
    a: 'A',
    à: 'À',
    á: 'Á',
    ả: 'Ả',
    ã: 'Ã',
    ạ: 'Ạ',
    ă: 'Ă',
    ằ: 'Ằ',
    ắ: 'Ắ',
    ẳ: 'Ẳ',
    ẵ: 'Ẵ',
    ặ: 'Ặ',
    â: 'Â',
    ầ: 'Ầ',
    ấ: 'Ấ',
    ẩ: 'Ẩ',
    ẫ: 'Ẫ',
    ậ: 'Ậ',
    e: 'E',
    è: 'È',
    é: 'É',
    ẻ: 'Ẻ',
    ẽ: 'Ẽ',
    ẹ: 'Ẹ',
    ê: 'Ê',
    ề: 'Ề',
    ế: 'Ế',
    ể: 'Ể',
    ễ: 'Ễ',
    ệ: 'Ệ',
    i: 'I',
    ì: 'Ì',
    í: 'Í',
    ỉ: 'Ỉ',
    ĩ: 'Ĩ',
    ị: 'Ị',
    o: 'O',
    ò: 'Ò',
    ó: 'Ó',
    ỏ: 'Ỏ',
    õ: 'Õ',
    ọ: 'Ọ',
    ô: 'Ô',
    ồ: 'Ồ',
    ố: 'Ố',
    ổ: 'Ổ',
    ỗ: 'Ỗ',
    ộ: 'Ộ',
    ơ: 'Ơ',
    ờ: 'Ờ',
    ớ: 'Ớ',
    ở: 'Ở',
    ỡ: 'Ỡ',
    ợ: 'Ợ',
    u: 'U',
    ù: 'Ù',
    ú: 'Ú',
    ủ: 'Ủ',
    ũ: 'Ũ',
    ụ: 'Ụ',
    ư: 'Ư',
    ừ: 'Ừ',
    ứ: 'Ứ',
    ử: 'Ử',
    ữ: 'Ữ',
    ự: 'Ự',
    y: 'Y',
    ỳ: 'Ỳ',
    ý: 'Ý',
    ỷ: 'Ỷ',
    ỹ: 'Ỹ',
    ỵ: 'Ỵ',
    đ: 'Đ',
  };
  return map[c] || c.toLocaleUpperCase('vi-VN');
}

/** Sau đóng ", bỏ qua khoảng trắng; nếu ngay sau là " mở thì đang có trích dẫn/tiêu đề lồng — không đổi phẩy cuối cụm trước. */
function stripTrailingCommaInQuotedSegments(text) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] !== '"') {
      out += text[i];
      i++;
      continue;
    }
    out += '"';
    i++;
    let inner = '';
    while (i < text.length && text[i] !== '"') {
      inner += text[i++];
    }
    if (i >= text.length) {
      out += inner;
      break;
    }
    i++;
    let j = i;
    while (j < text.length && /\s/.test(text[j])) j++;
    const nestedOpening = j < text.length && text[j] === '"';
    let fixed = inner;
    const t = inner.trimEnd();
    if (!nestedOpening && t.endsWith(',')) {
      fixed = inner.replace(/,\s*$/, '.');
    }
    out += fixed + '"';
  }
  return out;
}

function capitalizeDialogueInner(inner) {
  let i = 0;
  while (i < inner.length && /\s/.test(inner[i])) i++;
  while (i < inner.length && (inner[i] === '—' || inner[i] === '–' || inner[i] === '-')) {
    i++;
    while (i < inner.length && /\s/.test(inner[i])) i++;
  }
  if (i >= inner.length) return inner;
  const ch = inner[i];
  if (VI_LOWER.test(ch)) {
    return inner.slice(0, i) + toUpperFirstViet(ch) + inner.slice(i + 1);
  }
  return inner;
}

content = stripTrailingCommaInQuotedSegments(content);

const lines = content.split('\n');
const out = lines.map((line) => {
  const m = line.match(/^(\s*)"([^"]*)"\s*$/);
  if (!m) return line;
  const [, indent, inner] = m;
  return `${indent}"${capitalizeDialogueInner(inner)}"`;
});

content = out.join('\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã xử lý thoại (bộ quét ngoặc + viết hoa dòng thoại đơn).');
