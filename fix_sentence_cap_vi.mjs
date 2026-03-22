#!/usr/bin/env node
/**
 * Viết hoa chữ đầu câu (tiếng Việt):
 * 1) Sau . ! ? (+ khoảng trắng/xuống dòng, tùy chọn " ') nếu chữ cái đầu đang thường → hoa.
 * 2) Đầu đoạn: sau một hoặc nhiều dòng trống, dòng nội dung đầu tiên (không # --- >) → hoa chữ cái đầu.
 * 3) Đầu sau dấu " mở thoại trên cùng dòng đó.
 * Không tự động sau … (tránh lẫn nửa câu).
 */
import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node fix_sentence_cap_vi.mjs <file.md>');
  process.exit(1);
}

const LOWER = /[a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/u;

function upFirstChar(s) {
  if (!s || !LOWER.test(s[0])) return s;
  return s[0].toLocaleUpperCase('vi-VN') + s.slice(1);
}

const VI_LOWER =
  'a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';

function fixAfterSentencePunct(text) {
  const re = new RegExp(`([.!?])(\\s+)(["']?)([${VI_LOWER}])`, 'gu');
  let s = text;
  let prev;
  do {
    prev = s;
    s = s.replace(re, (_, p1, p2, q, c) => p1 + p2 + q + upFirstChar(c));
  } while (s !== prev);
  return s;
}

function capitalizeLineStart(line) {
  const lead = line.match(/^\s*/)[0];
  let rest = line.slice(lead.length);
  if (!rest) return line;

  const t = rest;
  if (/^#+\s/.test(t) || t === '---' || /^>\s/.test(t)) return line;

  if (t.startsWith('"')) {
    rest = '"' + upFirstChar(t.slice(1));
    return lead + rest;
  }

  if (/^\*+\S/.test(t)) {
    const m = t.match(/^(\*+)(.*)$/s);
    if (m) rest = m[1] + upFirstChar(m[2]);
    return lead + rest;
  }

  return lead + upFirstChar(rest);
}

function fixParagraphStarts(lines) {
  const out = [];
  let afterBreak = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const empty = line.trim() === '';

    if (empty) {
      afterBreak = true;
      out.push(line);
      continue;
    }

    if (afterBreak) {
      out.push(capitalizeLineStart(line));
      afterBreak = false;
    } else {
      out.push(line);
    }
  }

  return out;
}

let content = fs.readFileSync(filePath, 'utf8');
const before = content;

content = fixAfterSentencePunct(content);
content = fixParagraphStarts(content.split('\n')).join('\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log(before !== content ? 'Đã áp dụng viết hoa đầu câu / đầu đoạn.' : 'Không có thay đổi.');
