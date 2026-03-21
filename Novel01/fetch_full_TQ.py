#!/usr/bin/env python3
"""
Tải toàn bộ chương tiếng Trung (theo CHAPTERS trong fetch_novel_chapters.py),
ghi từng chương vào fullTQ.md và flush — không mất dữ liệu nếu giữa chừng lỗi mạng.
Chạy: python3 fetch_full_TQ.py
"""
from __future__ import annotations

import sys

# Cùng thư mục với fetch_novel_chapters.py
from fetch_novel_chapters import BOOK_BASE, CHAPTERS, extract_content, fetch

OUT = "/Users/dolananh/Desktop/Novel/fullTQ.md"
DELAY = 0.5
TIMEOUT = 45


def main() -> None:
    total = len(CHAPTERS)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(
            "# 处女调教部（又名:回春阁）\n\n"
            "> 全书简体原文；来源 https://m.xyushuwu4.com/20/20124/ ；共 **138** 章。\n\n"
            "---\n\n"
        )
        f.flush()
        for i, (cid, title) in enumerate(CHAPTERS, start=1):
            url = f"{BOOK_BASE}/{cid}.html"
            print(f"[{i}/{total}] 第{i}章 {title[:40]}...", flush=True)
            try:
                html = fetch(url, delay=DELAY, timeout=TIMEOUT, retries=3)
                content = extract_content(html)
            except Exception as e:
                content = f"[Lỗi khi lấy: {e}]"
            if not content:
                content = f"[Nội dung chưa lấy được - {url}]"
            f.write(f"## 第{i}章 {title}\n\n{content}\n\n---\n\n")
            f.flush()
    print(f"\nXong. Đã ghi {OUT} ({total} chương).", flush=True)


if __name__ == "__main__":
    main()
