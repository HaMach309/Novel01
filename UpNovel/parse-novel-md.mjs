/**
 * Parse định dạng MD kiểu:
 * - Dòng # → tiêu đề truyện
 * - Khối "## Nội dung giới thiệu" → lấy phần sau "### Nội dung giới thiệu" đến dòng --- ngay trước chương 1
 * - Mỗi "## Chương N ..." → một chương
 */

export function parseNovelMarkdown(raw) {
  const text = raw.replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);

  let title = "";
  // Luôn ưu tiên "dòng đầu tiên" (bỏ qua dòng trống/BOM) là tên truyện.
  // Với format bạn dùng: dòng đầu tiên thường có dạng "# Tên truyện".
  const firstNonEmptyIdx = lines.findIndex((l) => l.trim().length > 0);
  if (firstNonEmptyIdx >= 0) {
    const firstNonEmpty = lines[firstNonEmptyIdx].trim();
    if (/^#\s*/.test(firstNonEmpty)) title = firstNonEmpty.replace(/^#\s*/, "").trim();
  }
  // Fallback: nếu file không đúng quy ước trên thì tìm heading đầu tiên.
  if (!title) {
    const headingIdx = lines.findIndex((l) => /^#\s+/.test(l.trim()));
    if (headingIdx >= 0) {
      title = lines[headingIdx].replace(/^#\s+/, "").trim();
    }
  }

  const introStart = lines.findIndex((l) => l.trim() === "### Nội dung giới thiệu");
  const firstChapterIdx = lines.findIndex((l) => /^##\s+Chương\s+\d+/i.test(l.trim()));

  let description = "";
  if (introStart >= 0 && firstChapterIdx > introStart) {
    const slice = lines.slice(introStart + 1, firstChapterIdx);
    const dashSep = (() => {
      let lastDash = -1;
      for (let i = slice.length - 1; i >= 0; i--) {
        if (slice[i].trim() === "---") {
          lastDash = i;
          break;
        }
      }
      return lastDash;
    })();
    const bodyLines = dashSep >= 0 ? slice.slice(0, dashSep) : slice;
    description = bodyLines.join("\n").trim();
  }

  // Một số file MD bị lặp lại "tên truyện" ở đầu phần giới thiệu.
  // Khi đó script sẽ điền sai nội dung ô "Mô tả" (Wattpad nhìn như bị copy tên truyện).
  if (title && description) {
    const norm = (s) =>
      String(s || "")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[–—]/g, "-")
        .trim();

    const titleN = norm(title);
    const descLines = description.split(/\r?\n/);
    const firstLineN = norm(descLines[0] ?? "");

    if (firstLineN && firstLineN === titleN) {
      description = descLines.slice(1).join("\n").trim();
      if (!description) description = "";
    } else if (norm(description) === titleN) {
      // Trường hợp hiếm: toàn bộ description chỉ là tên truyện.
      description = "";
    }
  }

  const chapters = [];
  const chapterHeader = /^##\s+(Chương\s+\d+.*)$/i;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(chapterHeader);
    if (!m) continue;
    const chapTitle = m[1].trim();
    const bodyLines = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (/^##\s+Chương\s+\d+/i.test(lines[j].trim())) break;
      bodyLines.push(lines[j]);
    }
    const shortTitle = chapTitle.replace(/^Chương\s+\d+\s*/i, "").trim();
    while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift();
    if (bodyLines.length && shortTitle && bodyLines[0].trim() === shortTitle) {
      bodyLines.shift();
    }
    while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift();
    const body = bodyLines.join("\n").trim();
    chapters.push({ title: chapTitle, body });
    i = j - 1;
  }

  if (!title && chapters.length) {
    title = "Untitled";
  }

  return { title, description, chapters };
}
