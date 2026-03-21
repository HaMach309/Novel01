const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Truyện chưa dịch', 'QuanLyDiaNguc（nph）TQ.md');
const content = fs.readFileSync(filePath, 'utf8');

// Split by "---" separator (handle \r\n Windows line endings)
const blocks = content.split(/\r?\n---\r?\n\r?\n(?=## 第\d+章 )/);

const headerBlock = blocks[0]; // Full header including first --- before 内容简介
const chapterBlocks = blocks.slice(1);

// Parse each chapter: "## 第X章 Title\n\ncontent"
const parsedChapters = [];
for (const block of chapterBlocks) {
  const firstLineMatch = block.match(/^## (第\d+章) (.+)$/m);
  if (firstLineMatch) {
    const [, numPart, titlePart] = firstLineMatch;
    const restOfContent = block.replace(/^## 第\d+章 .+\r?\n+/, '');
    parsedChapters.push({ titlePart, content: restOfContent });
  }
}

console.log(`Found ${parsedChapters.length} chapters`);

// Reverse the chapters
parsedChapters.reverse();

// Renumber: 第1章, 第2章, ... 第95章
const outputChapters = parsedChapters.map((ch, i) => {
  const newNum = i + 1;
  const newHeader = `## 第${newNum}章 ${ch.titlePart}`;
  return `${newHeader}\r\n\r\n${ch.content}`;
});

// Reconstruct file (preserve Windows line endings)
const output = headerBlock + '\r\n---\r\n\r\n' + outputChapters.join('\r\n---\r\n\r\n') + '\r\n---\r\n\r\n';

fs.writeFileSync(filePath, output, 'utf8');
console.log('Done! Chapters have been reversed.');
