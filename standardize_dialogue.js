/**
 * Chuẩn hóa định dạng lời thoại theo skill beta-truyen:
 * 1. Chuyển "— nội dung" sang "nội dung" (thêm dấu "")
 * 2. Tách thoại + tường thuật + thoại trên cùng dòng (rule 10.1)
 * 3. Thêm dòng trống trước và sau mỗi đoạn thoại
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）TQ-VietSub.md');

function processDialogueLine(line) {
  if (!line.startsWith('— ')) return null;
  
  const content = line.slice(2);
  const segments = content.split(/\s—\s/).map(s => s.trim()).filter(Boolean);
  
  if (segments.length === 1) {
    return ['"' + content + '"'];
  }
  
  // Quy tắc: Thoại — Tường thuật — Thoại (luân phiên)
  const result = [];
  for (let k = 0; k < segments.length; k++) {
    const seg = segments[k];
    if (k % 2 === 1) {
      result.push(seg);
    } else {
      result.push('"' + seg + '"');
    }
  }
  return result;
}

function main() {
  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.split('\n');
  const output = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const processed = processDialogueLine(line);
    
    if (processed === null) {
      output.push(line);
    } else {
      for (let j = 0; j < processed.length; j++) {
        if (j > 0) output.push('');
        output.push(processed[j]);
      }
    }
  }
  
  // Thêm dòng trống quanh đoạn thoại
  const final = [];
  for (let i = 0; i < output.length; i++) {
    const line = output[i];
    const isDialogue = line.startsWith('"') && line.endsWith('"') && line.length > 2;
    const prev = output[i - 1];
    const next = output[i + 1];
    
    if (isDialogue) {
      const prevEmpty = !prev || prev === '';
      const nextEmpty = !next || next === '';
      const prevIsDialogue = prev && prev.startsWith('"') && prev.endsWith('"');
      const nextIsDialogue = next && next.startsWith('"') && next.endsWith('"');
      
      if (!prevEmpty && !prevIsDialogue && !prev.startsWith('#')) {
        final.push('');
      }
      final.push(line);
      if (!nextEmpty && !nextIsDialogue && !next.startsWith('#') && !next.startsWith('---')) {
        final.push('');
      }
    } else {
      final.push(line);
    }
  }
  
  fs.writeFileSync(inputPath, final.join('\n'), 'utf8');
  console.log('Chuẩn hóa xong. Tổng dòng:', final.length);
}

main();
