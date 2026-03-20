/** Tách fullTQ.md thành chương/chNNN.txt để dịch từng khối */
import fs from "fs";
const t = fs.readFileSync("fullTQ.md", "utf8").replace(/\r/g, "");
const headEnd = t.indexOf("## 第1章");
const head = t.slice(0, headEnd);
const rest = t.slice(headEnd);
const re = /## 第(\d+)章[^\n]*\n\n([\s\S]*?)(?=\n---\n\n## 第|\n---\n*$)/g;
let m;
const dir = "chapters_zh";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(`${dir}/_head.md`, head, "utf8");
while ((m = re.exec(rest)) !== null) {
  const n = m[1].padStart(3, "0");
  fs.writeFileSync(`${dir}/ch${n}.txt`, `## 第${m[1]}章\n\n${m[2].trim()}`, "utf8");
}
console.log("Done", dir);
