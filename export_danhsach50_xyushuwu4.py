#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Refresh DanhSach50Truyen_xyushuwu4_Bang.md: same 50 book IDs, live title/author/latest chapter from site."""

from __future__ import annotations

import html
import re
import sys
import time
import urllib.request
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

BASE = "https://m.xyushuwu4.com"
UA = "Mozilla/5.0 (compatible; NovelExport/1.0; +https://example.local)"
TIMEOUT = 22
ROW_RE = re.compile(
    r"^\|\s*(\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*(\[[^\]]+\]\([^)]+\))\s*\|\s*([^|]*)\|\s*$"
)


@dataclass
class Row:
    num: int
    title_cn: str
    title_vi: str
    h_level: str
    chapters: str
    author: str
    status: str
    link_md: str
    note: str
    book_id: str


def cn_int(s: str) -> int:
    s = s.replace("两", "二").replace("○", "零").strip()
    digit = {
        "零": 0,
        "一": 1,
        "二": 2,
        "三": 3,
        "四": 4,
        "五": 5,
        "六": 6,
        "七": 7,
        "八": 8,
        "九": 9,
    }
    if s == "十":
        return 10
    result = 0
    tmp = 0
    for c in s:
        if c in digit:
            tmp = digit[c]
        elif c == "十":
            if tmp == 0:
                tmp = 1
            result += tmp * 10
            tmp = 0
        elif c == "百":
            if tmp == 0:
                tmp = 1
            result += tmp * 100
            tmp = 0
        elif c == "千":
            if tmp == 0:
                tmp = 1
            result += tmp * 1000
            tmp = 0
        elif c == "万":
            if tmp == 0:
                tmp = 1
            result += tmp * 10000
            tmp = 0
    return result + tmp


def parse_chapter_num(latest_title: str) -> int | None:
    if not latest_title:
        return None
    m = re.search(r"第(\d+)章", latest_title)
    if m:
        return int(m.group(1))
    m = re.search(r"第([零一二三四五六七八九十百千万两○]+)章", latest_title)
    if m:
        return cn_int(m.group(1))
    return None


def fetch_book_page(book_id: str) -> str:
    url = f"{BASE}/book/{book_id}/"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read().decode("gbk", errors="replace")


def parse_book_html(html: str) -> tuple[str, str, str | None, str | None]:
    title = ""
    m = re.search(r'<div class="cataloginfo">\s*<h3>([^<]+)</h3>', html, re.DOTALL)
    if m:
        title = html.unescape(m.group(1).strip())
        while "&amp;" in title or "&#" in title:
            t2 = html.unescape(title)
            if t2 == title:
                break
            title = t2
        if title.endswith("_御宅屋"):
            title = title[: -len("_御宅屋")].rstrip()
    author = ""
    m = re.search(r'<p>作者：<a[^>]*>([^<]+)</a></p>', html)
    if m:
        author = m.group(1).strip()
    latest = None
    m = re.search(r"最新章节：<a[^>]*>([^<]+)</a>", html)
    if m:
        latest = m.group(1).strip()
    update_time = None
    m = re.search(r"更新时间：([^<]+)</p>", html)
    if m:
        update_time = m.group(1).strip()
    return title, author, latest, update_time


def guess_status(html: str, old: str) -> str:
    if "已完结" in html or "本书已完结" in html or "全文完" in html:
        return "完本"
    if "连载" in html and "已完结" not in html:
        return "连载"
    return old


def format_chapter_col(n: int | None, status: str, old: str) -> str:
    if n is None:
        return old.strip()
    st = status.strip()
    if st == "完本":
        return str(n)
    if old.strip().endswith("+") or st in ("连载", "新书"):
        return f"{n}+"
    if old.strip() and old.strip() != "—" and re.match(r"^\d", old.strip()):
        return old.strip()
    return f"{n}+"


def extract_book_id(link_md: str) -> str | None:
    m = re.search(r"/book/(\d+)/", link_md)
    return m.group(1) if m else None


def parse_rows(md: str) -> list[Row]:
    rows: list[Row] = []
    for line in md.splitlines():
        m = ROW_RE.match(line)
        if not m:
            continue
        link = m.group(8)
        bid = extract_book_id(link)
        if not bid:
            continue
        rows.append(
            Row(
                num=int(m.group(1)),
                title_cn=m.group(2).strip(),
                title_vi=m.group(3).strip(),
                h_level=m.group(4).strip(),
                chapters=m.group(5).strip(),
                author=m.group(6).strip(),
                status=m.group(7).strip(),
                link_md=link.strip(),
                note=m.group(9).strip(),
                book_id=bid,
            )
        )
    return rows


def md_cell(s: str) -> str:
    return s.replace("|", "\\|")


def row_line(r: Row) -> str:
    return (
        f"| {r.num}   | {md_cell(r.title_cn):<22} | {md_cell(r.title_vi):<34} | {md_cell(r.h_level):<5} | "
        f"{md_cell(r.chapters):<13} | {md_cell(r.author):<12} | {md_cell(r.status):<10} | {r.link_md} | {md_cell(r.note)} |"
    )


def main() -> int:
    root = Path(__file__).resolve().parent
    path = root / "Truyện chưa dịch" / "DanhSach50Truyen_xyushuwu4_Bang.md"
    text = path.read_text(encoding="utf-8")
    rows = parse_rows(text)
    if len(rows) != 50:
        print(f"Expected 50 data rows, got {len(rows)}", file=sys.stderr)
        return 1

    today = datetime.now().strftime("%d/%m/%Y")
    for r in rows:
        try:
            html = fetch_book_page(r.book_id)
        except Exception as e:
            print(f"book {r.book_id}: fetch failed: {e}", file=sys.stderr)
            time.sleep(1.2)
            continue
        title, author, latest, _upd = parse_book_html(html)
        if title:
            r.title_cn = title
        if author:
            r.author = author
        new_status = guess_status(html, r.status)
        if new_status != r.status:
            r.status = new_status
        ch_n = parse_chapter_num(latest or "")
        r.chapters = format_chapter_col(ch_n, r.status, r.chapters)
        time.sleep(0.35)

    # Rebuild file: header until table header, then rows, then rest from "## Chú thích"
    lines = text.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("**Ngày lấy:**"):
            out.append(f"**Ngày lấy:** {today} *(đồng bộ lại metadata từ site)*")
            i += 1
            continue
        if ROW_RE.match(line):
            break
        out.append(line)
        i += 1

    for r in rows:
        out.append(row_line(r))
    out.append("")

    while i < len(lines) and not lines[i].startswith("---"):
        i += 1
    while i < len(lines):
        out.append(lines[i])
        i += 1

    # Append sync note in Chú thích block if not already
    final = "\n".join(out) + "\n"
    note_line = f"- **Đồng bộ gần nhất:** {today} — tên gốc / tác giả / chương mới nhất lấy từ trang `book/id`; cột tên Việt, mức H, ghi chú giữ từ bản trước.\n"
    if "Đồng bộ gần nhất" not in final:
        final = final.replace(
            "### Bước kiểm tra (SKILL mục 6)\n",
            "### Bước kiểm tra (SKILL mục 6)\n\n" + note_line,
        )

    path.write_text(final, encoding="utf-8")
    print(f"Wrote {path} ({len(rows)} rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
