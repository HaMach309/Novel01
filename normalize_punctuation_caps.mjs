#!/usr/bin/env node
/**
 * Chuẩn hóa dấu câu và viết hoa:
 * - Viết hoa chữ đầu sau . ? !
 * - Sửa "anh bè" → "bạn bè" (từ ghép, không phải xưng hô)
 * - Chuẩn hóa khoảng trắng quanh dấu câu
 * - Gộp nhiều khoảng trắng thành một
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2] || path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');
let content = fs.readFileSync(filePath, 'utf8');

// Chữ cái đầu tiếng Việt (bao gồm dấu)
const VI_LOWER = /[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/;
const VI_UPPER = /[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

function toUpperFirst(c) {
  const map = { 'a':'A','à':'À','á':'Á','ạ':'Ạ','ả':'Ả','ã':'Ã','â':'Â','ầ':'Ầ','ấ':'Ấ','ậ':'Ậ','ẩ':'Ẩ','ẫ':'Ẫ','ă':'Ă','ằ':'Ằ','ắ':'Ắ','ặ':'Ặ','ẳ':'Ẳ','ẵ':'Ẵ','e':'E','è':'È','é':'É','ẹ':'Ẹ','ẻ':'Ẻ','ẽ':'Ẽ','ê':'Ê','ề':'Ề','ế':'Ế','ệ':'Ệ','ể':'Ể','ễ':'Ễ','i':'I','ì':'Ì','í':'Í','ị':'Ị','ỉ':'Ỉ','ĩ':'Ĩ','o':'O','ò':'Ò','ó':'Ó','ọ':'Ọ','ỏ':'Ỏ','õ':'Õ','ô':'Ô','ồ':'Ồ','ố':'Ố','ộ':'Ộ','ổ':'Ổ','ỗ':'Ỗ','ơ':'Ơ','ờ':'Ờ','ớ':'Ớ','ợ':'Ợ','ở':'Ở','ỡ':'Ỡ','u':'U','ù':'Ù','ú':'Ú','ụ':'Ụ','ủ':'Ủ','ũ':'Ũ','ư':'Ư','ừ':'Ừ','ứ':'Ứ','ự':'Ự','ử':'Ử','ữ':'Ữ','y':'Y','ỳ':'Ỳ','ý':'Ý','ỵ':'Ỵ','ỷ':'Ỷ','ỹ':'Ỹ','đ':'Đ' };
  return map[c] || c.toUpperCase();
}

// 1. Sửa "anh bè" → "bạn bè" (từ ghép bạn bè = friends, không phải xưng hô)
content = content.replace(/Anh bè/g, 'Bạn bè');
content = content.replace(/anh bè/g, 'bạn bè');

// 2. Viết hoa sau . ? ! … khi đứng đầu câu (trong dialogue và narrative)
// Tránh: số thập phân 3.14, tên file .md, ...
content = content.replace(/([.!?])\s+([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g,
  (_, punct, letter) => punct + ' ' + toUpperFirst(letter));

content = content.replace(/([…]+)\s+([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g,
  (_, dots, letter) => dots + ' ' + toUpperFirst(letter));

// 3. Viết hoa chữ đầu trong dialogue khi xuống dòng mới ("\n"...)
content = content.replace(/"\s*\n\s*"([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g,
  (m, letter) => '"\n"' + toUpperFirst(letter));

// 4. Gộp nhiều khoảng trắng
content = content.replace(/[ \t]+/g, ' ');
content = content.replace(/\n[ \t]+/g, '\n');
content = content.replace(/[ \t]+\n/g, '\n');

// 5. Đảm bảo khoảng trắng sau , ; : khi theo sau là chữ (tránh số thập phân 1,5)
content = content.replace(/([,;:])([A-Za-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g, '$1 $2');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Đã chuẩn hóa dấu câu và viết hoa.');
