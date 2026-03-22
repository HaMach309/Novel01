/**
 * Đồng bộ số chương (free) từ xyushuwu4 cho DanhSach50Truyen_xyushuwu4_Bang.md
 * Chạy: node sync_xyushuwu4_chapters.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import zlib from "node:zlib";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let iconv;
try {
  iconv = require("iconv-lite");
} catch {
  console.error("Cần cài: npm install iconv-lite");
  process.exit(1);
}

const BASE = "https://m.xyushuwu4.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const TIMEOUT_MS = 22000;
const DELAY_MS = 400;

const cnDigits = { "\u96f6": 0, "\u4e00": 1, "\u4e8c": 2, "\u4e09": 3, "\u56db": 4, "\u4e94": 5, "\u516d": 6, "\u4e03": 7, "\u516b": 8, "\u4e5d": 9, "\u4e24": 2 };
function cnInt(s) {
  if (!s) return 0;
  s = s.replace(/两/g, "二").replace(/○/g, "零").trim();
  let result = 0, tmp = 0;
  for (const c of s) {
    if (c in cnDigits) tmp = cnDigits[c];
    else if (c === "十") { result += (tmp || 1) * 10; tmp = 0; }
    else if (c === "百") { result += (tmp || 1) * 100; tmp = 0; }
    else if (c === "千") { result += (tmp || 1) * 1000; tmp = 0; }
    else if (c === "万") { result += (tmp || 1) * 10000; tmp = 0; }
  }
  return result + tmp;
}

function parseChapterNum(latest) {
  if (!latest) return null;
  const m1 = latest.match(/第(\d+)章/);
  if (m1) return parseInt(m1[1], 10);
  const m2 = latest.match(/第([零一二三四五六七八九十百千万两○]+)章/);
  if (m2) return cnInt(m2[1]);
  // Format: 207：tiêu đề (số + dấu hai chấm fullwidth/ASCII)
  // Format: 207：tiêu đề hoặc 207: tiêu đề
  const m3 = latest.match(/^(\d+)[：:]/);
  if (m3) return parseInt(m3[1], 10);
  return null;
}

function fetchBookPage(bookId) {
  return fetchUrl(`${BASE}/book/${bookId}/`);
}

function parseBookHtml(html, bookId) {
  let title = "", author = "", latest = null, status = null, catalogPath = null;
  const m1 = html.match(/<div class="cataloginfo">\s*<h3>([^<]+)<\/h3>/s);
  if (m1) title = m1[1].trim().replace(/_御宅屋$/, "");
  const m2 = html.match(/<p>作者：<a[^>]*>([^<]+)<\/a><\/p>/);
  if (m2) author = m2[1].trim();
  let m3 = html.match(/最新章节[：:]\s*<a[^>]*>([^<]+)<\/a>/);
  if (!m3) m3 = html.match(/最新章节[：:][^<]*<a[^>]*>([^<]+)<\/a>/);
  if (!m3) m3 = html.match(/<a[^>]*href="[^"]*\/\d+\/\d+\/[^"]+\.html"[^>]*>(\d+[：:][^<]*)<\/a>/);
  if (m3) latest = m3[1].trim();
  const catMatch = html.match(new RegExp(`href="([^"]*\\/${String(bookId)}\\/)"`));
  if (catMatch) {
    const p = catMatch[1];
    catalogPath = p.startsWith("http") ? p : (p.startsWith("/") ? BASE + p : BASE + "/" + p);
  }
  if (/已完结|本书已完结|全文完/.test(html)) status = "Đã hoàn";
  else if (/连载/.test(html) && !/已完结/.test(html)) status = "Đang đăng";
  return { title, author, latest, status, catalogPath };
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: "GET", headers: { "User-Agent": UA }, timeout: TIMEOUT_MS }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        let buf = Buffer.concat(chunks);
        try {
          if ((res.headers["content-encoding"] || "").includes("gzip") || (buf[0] === 0x1f && buf[1] === 0x8b))
            buf = zlib.gunzipSync(buf);
        } catch (_) {}
        try {
          resolve(iconv.decode(buf, "gbk"));
        } catch {
          resolve(buf.toString("utf8"));
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.end();
  });
}

/** Lấy số chương từ catalog, parse link dạng 207：tiêu đề */
async function fetchChapterFromCatalog(bookId, catalogUrl = null) {
  const url = catalogUrl || `${BASE}/${String(bookId).slice(0, 3)}/${bookId}/`;
  try {
    const html = await fetchUrl(url);
    const matches = [...html.matchAll(/>(\d+)[：:][^<]*<\/a>/g)];
    let maxCh = 0;
    for (const m of matches) {
      const n = parseInt(m[1], 10);
      if (n > maxCh) maxCh = n;
    }
    return maxCh > 0 ? maxCh : null;
  } catch {
    return null;
  }
}

function formatChapterCol(n, status, old) {
  if (n == null) return old?.trim() || "—";
  const st = (status || "").trim();
  const oldS = (old || "").trim();
  if (st === "Đã hoàn" || st === "完本") return String(n);
  if (oldS.endsWith("+") || st === "Đang đăng" || st === "Mới đăng" || st === "Không rõ" || st === "连载" || st === "新书") return `${n}+`;
  if (oldS && oldS !== "—" && /^\d/.test(oldS)) return oldS;
  return `${n}+`;
}

const ROW_RE = /^\|\s*(\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*(\[[^\]]+\]\([^)]+\))\s*\|\s*([^|]*)\|\s*$/;

function parseRows(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    const m = ROW_RE.exec(line);
    if (!m) continue;
    const linkMatch = m[8].match(/\/book\/(\d+)\//);
    if (!linkMatch) continue;
    rows.push({
      num: parseInt(m[1], 10),
      title_cn: m[2].trim(),
      title_vi: m[3].trim(),
      h_level: m[4].trim(),
      chapters: m[5].trim(),
      author: m[6].trim(),
      status: m[7].trim(),
      link_md: m[8].trim(),
      note: m[9].trim(),
      book_id: linkMatch[1],
    });
  }
  return rows;
}

function mdCell(s) {
  return (s || "").replace(/\|/g, "\\|");
}

function rowLine(r) {
  return `| ${r.num}   | ${mdCell(r.title_cn).padEnd(22)} | ${mdCell(r.title_vi).padEnd(34)} | ${mdCell(r.h_level).padEnd(5)} | ${mdCell(r.chapters).padEnd(13)} | ${mdCell(r.author).padEnd(12)} | ${mdCell(r.status).padEnd(10)} | ${r.link_md} | ${mdCell(r.note)} |`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const mdPath = path.join(root, "Truyện chưa dịch", "DanhSach50Truyen_xyushuwu4_Bang.md");
  const text = fs.readFileSync(mdPath, "utf8");
  const rows = parseRows(text);
  if (rows.length !== 50) {
    console.error(`Expected 50 rows, got ${rows.length}`);
    process.exit(1);
  }

  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    try {
      const html = await fetchBookPage(r.book_id);
      const { title, author, latest, status, catalogPath } = parseBookHtml(html, r.book_id);
      if (title) r.title_cn = title;
      if (author) r.author = author;
      if (status) r.status = status;
      let chN = parseChapterNum(latest || "");
      if (chN == null) {
        await sleep(200);
        chN = await fetchChapterFromCatalog(r.book_id, catalogPath || undefined);
      }
      r.chapters = formatChapterCol(chN, r.status, r.chapters);
      console.log(`[${i + 1}/50] ${r.book_id}: ${r.chapters} chương`);
    } catch (e) {
      console.error(`[${i + 1}/50] ${r.book_id}: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("**Ngày lấy:**")) {
      out.push(`**Ngày lấy:** ${today} *(đồng bộ lại metadata từ site)*`);
      i++;
      continue;
    }
    if (ROW_RE.test(line)) break;
    out.push(line);
    i++;
  }
  for (const r of rows) out.push(rowLine(r));
  out.push("");
  while (i < lines.length && !lines[i].startsWith("---")) i++;
  while (i < lines.length) out.push(lines[i++]);

  let final = out.join("\n") + "\n";
  const noteLine = `- **Đồng bộ gần nhất:** ${today} — tên gốc / tác giả / chương mới nhất lấy từ trang \`book/id\`; cột tên Việt, mức H, ghi chú giữ từ bản trước.\n`;
  if (!final.includes("Đồng bộ gần nhất")) {
    final = final.replace("### Bước kiểm tra (SKILL mục 6)\n", "### Bước kiểm tra (SKILL mục 6)\n\n" + noteLine);
  }

  fs.writeFileSync(mdPath, final, "utf8");
  console.log(`Đã cập nhật ${mdPath} (${rows.length} truyện)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
