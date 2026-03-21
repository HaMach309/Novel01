const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'temp_ch35_50_source.txt');
const outDir = __dirname;

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split(/\r?\n/);
const fromLine6 = lines.slice(5).join('\n');

const markers = [];
for (let i = 36; i <= 50; i++) {
  markers.push('## 第' + i + '章');
}

const regex = new RegExp('(' + markers.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
const parts = fromLine6.split(regex);

for (let i = 1; i < parts.length; i += 2) {
  const marker = parts[i];
  let chapterContent = (parts[i + 1] || '').trim();
  const match = marker.match(/第(\d+)章/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 36 && num <= 50) {
      if (num === 50) {
        const nextCh51 = chapterContent.indexOf('## 第51章');
        if (nextCh51 !== -1) {
          chapterContent = chapterContent.substring(0, nextCh51).trim();
        }
      }
      const outPath = path.join(outDir, 'ch' + num + '_cn.txt');
      fs.writeFileSync(outPath, marker + '\n\n' + chapterContent, 'utf8');
      console.log('Saved ch' + num + '_cn.txt (' + chapterContent.length + ' chars)');
    }
  }
}

console.log('Done.');
