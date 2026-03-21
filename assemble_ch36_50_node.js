const fs = require('fs');
const path = require('path');

const BASE = __dirname;

const CHAPTER_TITLES = {
  36: "Tây Nhĩ Phàm đi hẹn (h)",
  37: "Thỏa thuận với A Tát Tạ Nhĩ",
  38: "Ác mộng của Tây Nhĩ Phàm",
  39: "Tin đồn phiền toái",
  40: "Che phủ dấu vết (h)",
  41: "Xoa bóp của Karl (h)",
  42: "Toàn thân mà lui",
  43: "Giải cứu nhân viên",
  44: "Ảo ảnh Lily Tư Á",
  45: "Ảo cảnh Vi O Lai Khả (h)",
  46: "Mê cung chìm đắm",
  47: "Bẫy của Vi O Lai Khả",
  48: "Vạn sự đã sẵn sàng",
  49: "Lời mời Mị Sắc Yêu Ảnh",
  50: "Chưa kết thúc đâu (h)",
};

function applyFixes(text) {
  return text
    .replace(/打响第一枪/g, "nổ phát súng đầu tiên")
    .replace(/不落空/g, "không thất lạc")
    .replace(/vô缝/g, "vô kẽ")
    .replace(/sẽ không rơi vào khoảng không/g, "sẽ không thất lạc")
    .replace(/【Tử Hồng Thánh Bôi】/g, "【Tinh Hồng Thánh Bôi】")
    .replace(/Tử Hồng Thánh Bôi/g, "Tinh Hồng Thánh Bôi")
    .replace(/【Chén Thánh Đỏ Tươi】/g, "【Tinh Hồng Thánh Bôi】")
    .replace(/Chén Thánh Đỏ Tươi/g, "Tinh Hồng Thánh Bôi")
    .replace(/dẫn伸/g, "suy diễn")
    .replace(/\bBạn\b/g, "Ngươi");
}

function updateChapterTitle(text, chNum) {
  const title = CHAPTER_TITLES[chNum];
  if (!title) return text;
  return text.replace(
    new RegExp(`(## Chương ${chNum}\\s*–\\s*)[^\\n]+`),
    `$1${title}`
  );
}

function extractBetween(content, startMarker, endMarker) {
  const start = content.indexOf(startMarker);
  if (start === -1) return "";
  const end = endMarker ? content.indexOf(endMarker, start) : content.length;
  return content.substring(start, end === -1 ? content.length : end).trim();
}

function main() {
  const full = fs.readFileSync(path.join(BASE, "translation_ch36_50_full.md"), "utf8");
  const append37 = fs.readFileSync(path.join(BASE, "translation_ch37_50_append.md"), "utf8");
  const ch40_50 = fs.readFileSync(path.join(BASE, "translation_ch40_50.md"), "utf8");

  const parts = [];

  // Ch36
  let ch36 = extractBetween(full, "## Chương 36", "## Chương 37");
  ch36 = ch36.replace("Tây Nhĩ Phàm đi hẹn hò (h)", "Tây Nhĩ Phàm đi hẹn (h)");
  ch36 = applyFixes(ch36);
  ch36 = updateChapterTitle(ch36, 36);
  parts.push(ch36);

  // Ch37
  let ch37 = extractBetween(append37, "## Chương 37", "## Chương 38");
  ch37 = applyFixes(ch37);
  ch37 = updateChapterTitle(ch37, 37);
  parts.push(ch37);

  // Ch38
  let ch38 = extractBetween(append37, "## Chương 38", "## Chương 39");
  ch38 = applyFixes(ch38);
  ch38 = updateChapterTitle(ch38, 38);
  parts.push(ch38);

  // Ch39 - to end of file
  const ch39Start = append37.indexOf("## Chương 39");
  let ch39 = ch39Start >= 0 ? append37.substring(ch39Start).trim() : "";
  ch39 = applyFixes(ch39);
  ch39 = updateChapterTitle(ch39, 39);
  parts.push(ch39);

  // Ch40-50 from translation_ch40_50 - extract in file order then reorder 42 before 43
  const ch40_50Chapters = {};
  for (let n = 40; n <= 50; n++) {
    const marker = `## Chương ${n} `;
    const idx = ch40_50.indexOf(marker);
    if (idx !== -1) ch40_50Chapters[n] = idx;
  }
  const sorted = Object.entries(ch40_50Chapters).sort((a, b) => a[1] - b[1]);

  for (let i = 0; i < sorted.length; i++) {
    const [n, pos] = sorted[i];
    const end = i + 1 < sorted.length ? sorted[i + 1][1] : ch40_50.length;
    let text = ch40_50.substring(pos, end).trim();
    text = applyFixes(text);
    text = updateChapterTitle(text, parseInt(n));
    parts.push(text);
  }

  // Output in correct order: 40,41,42,43,44,45,46,47,48,49,50
  // The file has Ch43 before Ch42 - we need Ch42 then Ch43
  const ch40_50Parts = parts.splice(4); // Remove Ch40-50 from parts
  const order = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  const byNum = {};
  for (const p of ch40_50Parts) {
    const m = p.match(/^## Chương (\d+)/);
    if (m) byNum[parseInt(m[1])] = p;
  }
  for (const n of order) {
    if (byNum[n]) parts.push(byNum[n]);
  }

  const final = parts.join("\n\n---\n\n");
  fs.writeFileSync(path.join(BASE, "translation_ch36_50_append.md"), final, "utf8");
  console.log("Created translation_ch36_50_append.md successfully");
}

main();
