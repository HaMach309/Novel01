const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, 'translation_ch36_50_full.md');
const TARGET = path.join(__dirname, 'translation_ch36_50_temp.md');

const NAV_TEXT = "上一章 返回目录 加入书签 下一章";

function processContent(text) {
  let out = text.replace(NAV_TEXT, "");
  out = out.replace(/Tinh Hồng Thánh Bôi/g, "Tử Hồng Thánh Bôi");
  out = out.replace(/【Tinh Hồng Thánh Bôi】/g, "【Tử Hồng Thánh Bôi】");
  return out;
}

const content = fs.readFileSync(SOURCE, 'utf8');
const chapterRegex = /^## Chương (\d+) – .+$/gm;

const chapters = {};
let match;
let lastEnd = 0;

// Find all chapter headers and their positions
const matches = [];
while ((match = chapterRegex.exec(content)) !== null) {
  matches.push({
    num: parseInt(match[1], 10),
    start: match.index,
    header: match[0]
  });
}

// Extract body for each chapter (from header to next header or end)
for (let i = 0; i < matches.length; i++) {
  const { num, start, header } = matches[i];
  const nextStart = i + 1 < matches.length ? matches[i + 1].start : content.length;
  let body = content.substring(start + header.length, nextStart).trim();
  
  // For Ch40, keep the second occurrence (the one with Karl thigh scene)
  if (num === 40 && num in chapters) {
    chapters[num] = { header, body };
  } else if (num >= 36 && num <= 50) {
    chapters[num] = { header, body };
  }
}

// Build output
const lines = [
  "# Dịch Chương 36-50 – Quản Lý Địa Ngục",
  "",
  "---",
  ""
];

for (let ch = 36; ch <= 50; ch++) {
  if (chapters[ch]) {
    const { header, body } = chapters[ch];
    const processed = processContent(body);
    lines.push(header);
    lines.push("");
    lines.push(processed);
    lines.push("");
    lines.push("---");
    lines.push("");
  }
}

const output = lines.join("\n").trimEnd() + "\n";
fs.writeFileSync(TARGET, output, 'utf8');
console.log("Created:", TARGET);
