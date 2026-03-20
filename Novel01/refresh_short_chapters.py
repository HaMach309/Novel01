#!/usr/bin/env python3
"""
Tải lại các chương có độ dài < ngưỡng ký tự trong fullTQ.md, thay nội dung từ m.xyushuwu4.com.
Chạy: python refresh_short_chapters.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from fetch_novel_chapters import BOOK_BASE, CHAPTERS, extract_content, fetch

FULL_TQ = ROOT / "fullTQ.md"
# Chương ngắn hơn hẳn đa số (đa số >= ~1100 ký tự)
CHAR_THRESHOLD = 1000
DELAY = 0.8
TIMEOUT = 45
RETRIES = 3


def split_full_tq(text: str) -> tuple[str, list[tuple[int, str, int, int]]]:
    """Trả về (phần đầu trước chương 1, [(num, title_line, start, end), ...])."""
    m0 = re.search(r"^## 第1章", text, re.M)
    if not m0:
        raise SystemExit("Không tìm thấy ## 第1章 trong fullTQ.md")
    head = text[: m0.start()]
    rest = text[m0.start() :]
    pat = re.compile(r"^## 第(\d+)章([^\n]*)\n", re.M)
    matches = list(pat.finditer(rest))
    chapters = []
    for i, m in enumerate(matches):
        num = int(m.group(1))
        title = m.group(2).strip()
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(rest)
        chapters.append((num, title, start, end))
    return head, chapters


def main() -> None:
    text = FULL_TQ.read_text(encoding="utf-8")
    head, ch_meta = split_full_tq(text)
    rest = text[len(head) :]

    short = []
    for num, title, s, e in ch_meta:
        block = rest[s:e]
        if len(block) < CHAR_THRESHOLD:
            short.append(num)

    if not short:
        print("Không có chương nào dưới ngưỡng", CHAR_THRESHOLD)
        return

    print(f"Cần tải lại {len(short)} chương (< {CHAR_THRESHOLD} ký tự): {short}")

    # cid theo số chương 1-based
    updates: dict[int, str] = {}
    for n in short:
        if n < 1 or n > len(CHAPTERS):
            continue
        cid, title = CHAPTERS[n - 1]
        url = f"{BOOK_BASE}/{cid}.html"
        print(f"  [{n}] {url} ...")
        try:
            html = fetch(url, delay=DELAY, timeout=TIMEOUT, retries=RETRIES)
            content = extract_content(html)
        except Exception as ex:
            content = f"[Lỗi khi lấy: {ex}]"
        if not content or len(content.strip()) < 20:
            print(f"    -> Cảnh báo: nội dung rất ngắn hoặc trống, giữ nguyên chương.")
            continue
        # Chuẩn hóa xuống dòng cho MD
        content = content.strip()
        line = f"## 第{n}章 {title}\n\n{content}\n\n---\n\n"
        updates[n] = line
        print(f"    -> {len(content)} ký tự (nội dung)")

    if not updates:
        print("Không cập nhật được chương nào.")
        return

    pieces = []
    for num, _title, s, e in ch_meta:
        if num in updates:
            pieces.append(updates[num])
        else:
            pieces.append(rest[s:e])
    new_text = head + "".join(pieces)
    FULL_TQ.write_text(new_text, encoding="utf-8")
    print(f"Đã ghi {FULL_TQ}")


if __name__ == "__main__":
    main()
