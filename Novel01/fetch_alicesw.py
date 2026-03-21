#!/usr/bin/env python3
"""
Lấy truyện từ 爱丽丝书屋 (alicesw.com).
Dùng: python3 fetch_alicesw.py <novel_url>
VD: python3 fetch_alicesw.py https://www.alicesw.com/novel/35398.html
"""
from __future__ import annotations

import re
import sys
import time
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

# --- Cấu hình ---
DELAY = 0.8
TIMEOUT = 45
RETRIES = 3

# Bảng tên file: tên gốc -> tên file (phần trước TQ)
FILENAME_MAP = {
    "淫束道具专家": "ChuyenGiaDaoCuDucThuc",
}


def fetch(url: str, *, delay: float = DELAY, timeout: int = TIMEOUT, retries: int = RETRIES) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    }
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw_bytes = r.read()
            last_err = None
            break
        except Exception as e:
            last_err = e
            time.sleep(min(2.5, 0.6 * (attempt + 1)))
    if last_err:
        raise last_err
    for enc in ("utf-8", "gbk", "gb18030"):
        try:
            return raw_bytes.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw_bytes.decode("utf-8", errors="replace")


def _clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r" +", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_content_alicesw(html: str) -> str:
    """Trích nội dung chương từ HTML alicesw.com."""
    html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.I)
    html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.I)

    # alicesw: class="read-content j_readContent user_ad_content"
    for pattern in [
        r'class="read-content[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>',
        r'class="read-content[^"]*"[^>]*>(.*?)<div\s+class="[^"]*chapter-nav',
        r'class="j_readContent[^"]*"[^>]*>(.*?)</div>\s*<div[^>]*chapter',
        r'class="read-content[^"]*"[^>]*>(.*?)(?:\[第一章没有了|\[下一章|目录</a>)',
    ]:
        m = re.search(pattern, html, re.DOTALL)
        if m:
            block = m.group(1)
            text = re.sub(r"<p[^>]*>", "\n", block)
            text = re.sub(r"</p>", "\n", text)
            text = re.sub(r"<[^>]+>", "", text)
            text = text.replace("&nbsp;", " ").replace("&hellip;", "…").replace("&mdash;", "—")
            lines = [l.strip() for l in text.split("\n") if l.strip() and len(l.strip()) > 10]
            out = []
            for line in lines:
                if re.search(r"上一章|下一章|第一章没有了|回目录|加入书签|请到|扫码|加载中", line):
                    break
                if re.search(r"[\u4e00-\u9fff]", line):
                    out.append(line)
            if out:
                return _clean_text("\n\n".join(out))

    # Fallback: tìm từ read-content đến nav
    idx = html.find('class="read-content')
    if idx == -1:
        idx = html.find("j_readContent")
    if idx > 0:
        end = html.find("[第一章没有了", idx)
        if end == -1:
            end = html.find("[下一章", idx)
        if end == -1:
            end = html.find('class="chapter-nav"', idx)
        if end > idx:
            block = html[idx:end]
            text = re.sub(r"<p[^>]*>", "\n", block)
            text = re.sub(r"</p>", "\n", text)
            text = re.sub(r"<[^>]+>", "", text)
            lines = [l.strip() for l in text.split("\n") if l.strip() and len(l.strip()) > 15]
            out = [l for l in lines if re.search(r"[\u4e00-\u9fff]", l) and not re.search(r"上一章|下一章|回目录", l)]
            if out:
                return _clean_text("\n\n".join(out))
    return ""


def parse_novel_page(html: str, base_url: str) -> dict:
    """Lấy metadata từ trang truyện."""
    info = {"title": "", "author": "", "category": "", "intro": "", "chapters": 0, "words": "", "status": ""}
    m = re.search(r"<title>([^<]+)</title>", html)
    if m:
        info["title"] = m.group(1).split("-")[0].strip()
    if not info["title"]:
        m = re.search(r"<h1[^>]*>([^<]+)</h1>", html)
        if m:
            info["title"] = m.group(1).strip()
    m = re.search(r"作\s*者[：:]\s*[^<]*>([^<]+)<", html)
    if m:
        info["author"] = m.group(1).strip()
    m = re.search(r"分\s*类[：:]\s*[^<]*>([^<]+)<", html)
    if m:
        info["category"] = m.group(1).strip()
    m = re.search(r"字\s*数[：:]\s*([^<·]+)", html)
    if m:
        info["words"] = m.group(1).strip()
    m = re.search(r"章\s*节[：:]\s*(\d+)", html)
    if m:
        info["chapters"] = int(m.group(1))
    m = re.search(r"状\s*态[：:]\s*([^<]+)", html)
    if m:
        info["status"] = m.group(1).strip()
    m = re.search(r"内容简介[：:]*\s*</h\d>\s*<p>([^<]+)", html)
    if m:
        info["intro"] = _clean_text(m.group(1).replace("&hellip;", "…").replace("&mdash;", "—"))[:2000]
    return info


def parse_chapters_page(html: str, base_url: str) -> list[tuple[str, str, str]]:
    """
    Parse trang danh sách chương.
    Trả về [(title, chapter_url, chapter_id), ...] theo thứ tự đọc (chương 1 -> cuối).
    """
    # Tìm tất cả link dạng /book/36956/xxxxx.html
    pattern = r'href="(/book/\d+/([a-f0-9]+)\.html)"[^>]*>([^<]+(?:-\s*\d+)?)\s*</a>'
    matches = re.findall(pattern, html)
    if not matches:
        pattern = r'href="(https?://[^"]*?/book/\d+/([a-f0-9]+)\.html)"[^>]*>([^<]+)'
        matches = re.findall(pattern, html)

    seen = set()
    result = []
    for m in matches:
        path, cid, title = m[0], m[1], m[2].strip()
        if cid in seen:
            continue
        seen.add(cid)
        full_url = urljoin(base_url, path) if path.startswith("/") else path
        result.append((title, full_url, cid))

    # alicesw: thứ tự trong HTML đã là chương 1 -> cuối
    return result


def get_filename(title: str) -> str:
    return FILENAME_MAP.get(title, title) + "TQ.md"


def main() -> None:
    if len(sys.argv) < 2:
        print("Dùng: python3 fetch_alicesw.py <novel_url> [--limit N]")
        print("VD: python3 fetch_alicesw.py https://www.alicesw.com/novel/35398.html")
        print("    python3 fetch_alicesw.py https://www.alicesw.com/novel/35398.html --limit 5")
        sys.exit(1)

    limit = None
    args = sys.argv[1:]
    if "--limit" in args:
        i = args.index("--limit")
        limit = int(args[i + 1])
        args = args[:i] + args[i + 2:]


    novel_url = args[0].strip()
    parsed = urlparse(novel_url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    novel_id = novel_url.rstrip("/").split("/")[-1].replace(".html", "")

    print(f"Đang lấy: {novel_url}")
    novel_html = fetch(novel_url)
    info = parse_novel_page(novel_html, base)

    catalog_url = f"{base}/other/chapters/id/{novel_id}.html"
    print(f"Đang lấy catalog: {catalog_url}")
    time.sleep(DELAY)
    catalog_html = fetch(catalog_url)
    chapters = parse_chapters_page(catalog_html, base)

    if not chapters:
        print("Không tìm thấy chương nào.")
        sys.exit(1)

    if limit:
        chapters = chapters[:limit]
        print(f"Giới hạn: {limit} chương.")

    total = len(chapters)
    filename = get_filename(info["title"])
    out_path = f"/Users/dolananh/Desktop/Novel/{filename}"

    header = f"""# {info['title']}

> 来源: {novel_url}

---

## 内容简介

{info['title']}

类别：{info['category']}
字数：{info['words']}
章节：{total}
状态：{info['status']}

### 内容简介

{info['intro']}

---

"""

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.flush()

        for i, (title, url, _) in enumerate(chapters, start=1):
            print(f"[{i}/{total}] 第{i}章 {title[:40]}...")
            try:
                time.sleep(DELAY)
                html = fetch(url, delay=0)
                content = extract_content_alicesw(html)
            except Exception as e:
                content = f"[Lỗi khi lấy: {e}]"
            if not content or len(content.strip()) < 50:
                content = content or f"[Nội dung chưa lấy được - {url}]"
            f.write(f"## 第{i}章 {title}\n\n{content}\n\n---\n\n")
            f.flush()

    print(f"\nXong. Đã ghi {out_path} ({total} chương).")


if __name__ == "__main__":
    main()
