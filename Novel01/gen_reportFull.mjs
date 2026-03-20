import fs from "fs";

const text = fs.readFileSync("fullTQ.md", "utf8");
const re = /^## 第(\d+)章[^\n]*\n/gm;
const matches = [...text.matchAll(re)];
const chapters = [];

for (let i = 0; i < matches.length; i++) {
  const start = matches[i].index;
  const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
  const body = text.slice(start, end);
  const title = matches[i][0].replace(/^##\s+/, "").trim();
  chapters.push({
    num: parseInt(matches[i][1], 10),
    title,
    chars: body.length,
  });
}

const total = chapters.reduce((s, c) => s + c.chars, 0);
chapters.sort((a, b) => a.chars - b.chars || a.num - b.num);

const esc = (s) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

let md = "";
md += "# Báo cáo thống kê ký tự theo chương — fullTQ.md\n\n";
md +=
  "Nguồn: `fullTQ.md`. Mỗi chương = khối từ dòng `## 第N章 …` đến ngay trước chương kế tiếp (gồm tiêu đề + nội dung).\n\n";
md +=
  "**Thứ tự bảng:** từ **ít ký tự → nhiều ký tự** (trùng số thì theo số chương).\n\n";
md += "| Chương | Tiêu đề (gốc) | Số ký tự |\n";
md += "|--------|----------------|----------|\n";

for (const c of chapters) {
  const short = c.title.length > 50 ? c.title.slice(0, 47) + "…" : c.title;
  md += `| ${c.num} | ${esc(short)} | ${c.chars} |\n`;
}

const minC = chapters.reduce((a, b) => (a.chars < b.chars ? a : b));
const maxC = chapters.reduce((a, b) => (a.chars > b.chars ? a : b));

md += "\n## Tóm tắt\n\n";
md += `- **Số chương:** ${chapters.length}\n`;
md += `- **Tổng ký tự (toàn bộ các chương):** ${total.toLocaleString("vi-VN")}\n`;
md += `- **Trung bình / chương:** ${Math.round(total / chapters.length).toLocaleString("vi-VN")}\n`;
md += `- **Chương ngắn nhất:** 第${minC.num}章 — ${minC.chars.toLocaleString("vi-VN")} ký tự\n`;
md += `- **Chương dài nhất:** 第${maxC.num}章 — ${maxC.chars.toLocaleString("vi-VN")} ký tự\n`;

fs.writeFileSync("reportFull.md", md, "utf8");
console.log("reportFull.md OK", chapters.length, "chapters");
