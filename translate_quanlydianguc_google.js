/**
 * Dịch chương 1-52 từ tiếng Trung sang tiếng Việt bằng translate-google.
 * Chạy: node translate_quanlydianguc_google.js [--test]
 * --test: chỉ dịch 2 chương đầu
 */

const fs = require('fs');
const path = require('path');
const translate = require('translate-google');

const BASE = path.join(__dirname);
const CN_PATH = path.join(BASE, 'quanlydianguc_ch1_52_cn_extract.md');
const OUT_PATH = path.join(BASE, 'quanlydianguc_ch1_52_vn_translated.md');
const VN_PATH = path.join(BASE, 'Truyện đã dịch', 'QuanLyDiaNguc（nph）VietSub.md');

const NAMES = {
  '卡尔': 'Karl',
  '维奥莱卡': 'Vi O Lai Khả',
  '莉莉丝娅': 'Lily Tư Á',
  '西尔凡': 'Tây Nhĩ Phàm',
  '伊利亚': 'Y Lợi Á',
  '格雷戈': 'Cách Lý Cách',
  '锈骨': 'Tú Cốt',
  '晚晚': 'Vãn Vãn',
  '阿萨谢尔': 'A Tát Tạ Nhĩ',
  '艾瑞克': 'Eric',
  '猩红圣杯': 'Chén Thánh Đỏ Thẫm',
  '绯色魅影': 'Ảo Ảnh Màu Đỏ',
};

function applyNames(text) {
  let r = text;
  for (const [cn, vn] of Object.entries(NAMES)) {
    r = r.split(cn).join(vn);
  }
  return r;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateChunk(text) {
  if (!text.trim()) return '';
  const maxLen = 4500;
  if (text.length <= maxLen) {
    try {
      const r = await translate(text, { from: 'zh-cn', to: 'vi' });
      return (r && String(r).trim()) ? String(r) : text;
    } catch (e) {
      console.error('  Lỗi:', e.message);
      return text;
    }
  }
  const parts = [];
  let pos = 0;
  while (pos < text.length) {
    let chunk = text.slice(pos, pos + maxLen);
    const last = chunk.lastIndexOf('。');
    if (last > 2000) {
      chunk = text.slice(pos, pos + last + 1);
      pos += last + 1;
    } else {
      pos += chunk.length;
    }
    try {
      const t = await translate(chunk, { from: 'zh-cn', to: 'vi' });
      parts.push((t && String(t).trim()) ? String(t) : chunk);
    } catch (e) {
      parts.push(chunk);
    }
    await sleep(500);
  }
  return parts.join('');
}

async function main() {
  const testMode = process.argv.includes('--test');
  const limit = testMode ? 2 : 52;

  if (!fs.existsSync(CN_PATH)) {
    console.error('Chạy node extract_quanlydianguc_ch1_52.js trước');
    process.exit(1);
  }

  const content = fs.readFileSync(CN_PATH, 'utf8');
  const chRegex = /## 第(\d+)章\s+([^\n]+)\n\n([\s\S]*?)(?=\n---\n\n|$)/g;
  const chapters = [];
  let m;
  while ((m = chRegex.exec(content)) !== null) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= limit) {
      chapters.push({ num: n, titleCn: m[2], body: m[3] });
    }
  }

  console.log(`Đang dịch ${chapters.length} chương...`);

  const outParts = [];
  for (const ch of chapters) {
    console.log(`Chương ${ch.num}: ${ch.titleCn.substring(0, 40)}...`);

    const titleVn = await translateChunk(ch.titleCn);
    await sleep(300);

    const bodyVn = await translateChunk(ch.body);
    const bodyFinal = applyNames(bodyVn);

    outParts.push(`## Chương ${ch.num} – ${titleVn}\n\n${bodyFinal}\n\n---\n\n`);
    console.log(`  Xong Ch ${ch.num}`);
  }

  fs.writeFileSync(OUT_PATH, outParts.join(''), 'utf8');
  console.log(`\nĐã lưu: ${OUT_PATH}`);

  if (!testMode && fs.existsSync(VN_PATH)) {
    console.log('Đang merge vào VietSub...');
    const newContent = fs.readFileSync(OUT_PATH, 'utf8');
    let full = fs.readFileSync(VN_PATH, 'utf8');

    const idxFirst = full.indexOf('## Ch');
    const header = full.substring(0, idxFirst);

    const ch53Match = full.match(/\n## Chương 53\s*[–\-]/) || full.match(/\n## Ch[^\n]*53[^\n]*\n/);
    const ch53Start = ch53Match ? full.indexOf(ch53Match[0]) + 1 : -1;
    const tail = ch53Start > 0 ? full.substring(ch53Start) : '';

    let result = header + newContent.trim();
    if (tail) result += '\n\n---\n\n' + tail;

    const backup = VN_PATH + '.before_merge';
    fs.writeFileSync(backup, full, 'utf8');
    fs.writeFileSync(VN_PATH, result, 'utf8');
    console.log('Backup:', backup);
    console.log('Đã merge xong!');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
