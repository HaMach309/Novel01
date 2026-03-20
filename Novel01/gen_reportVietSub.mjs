import fs from "fs";

const SOURCE = "VietSub.md";
const OUT = "report.md";

const text = fs.readFileSync(SOURCE, "utf8");
const lines = text.split(/\r?\n/);

const chapRe = /^##\s+Chương\s+(\d+)\b\s*(.*)$/;

/** @type {{num:number,title:string,startLine:number,bodyLines:string[]}[]} */
const chapters = [];
let cur = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = chapRe.exec(line);
  if (m) {
    if (cur) chapters.push(cur);
    const num = parseInt(m[1], 10);
    const rest = (m[2] ?? "").trim();
    const display = `Chương ${num}${rest ? ` - ${rest}` : ""}`;
    cur = { num, title: display, startLine: i + 1, bodyLines: [] };
    continue;
  }
  if (cur) cur.bodyLines.push(line);
}
if (cur) chapters.push(cur);

function wordCount(bodyLines) {
  const kept = [];
  for (const l of bodyLines) {
    const t = l.trim();
    if (!t) continue;
    if (t === "---") continue;
    if (l.startsWith("## ")) continue;
    kept.push(l);
  }
  const joined = kept.join("\n");
  const tokens = joined.match(/\S+/g);
  return tokens ? tokens.length : 0;
}

const rows = chapters.map((c) => ({
  num: c.num,
  title: c.title,
  startLine: c.startLine,
  words: wordCount(c.bodyLines),
}));

rows.sort((a, b) => a.words - b.words || a.num - b.num);

const totalWords = rows.reduce((s, r) => s + r.words, 0);

let md = "";
md += "# Report đếm từ theo chương\n\n";
md +=
  "Phương pháp: đếm các token ngăn cách bởi khoảng trắng trong phần nội dung mỗi chương, bỏ dòng tiêu đề `## Chương ...` và các dòng phân cách `---`.\n\n";
md += `Tổng số chương phát hiện: ${rows.length}\n`;
md += `Tổng số từ: ${totalWords}\n\n`;
md += "## Bảng sắp xếp theo số từ tăng dần\n\n";
md += "| STT | Chương | Dòng bắt đầu | Số từ |\n";
md += "| --- | --- | ---: | ---: |\n";
rows.forEach((r, idx) => {
  md += `| ${idx + 1} | ${r.title} | ${r.startLine} | ${r.words} |\n`;
});

fs.writeFileSync(OUT, md, "utf8");
console.log(`${OUT} OK`, rows.length, "chapters");

