# -*- coding: utf-8 -*-
"""Trích chương 1-52 từ nguồn TQ, lưu ra file để dịch. Chạy độc lập, không cần deep-translator."""

import re
import os

BASE = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
TQ_PATH = os.path.join(BASE, "Truyện chưa dịch", "QuanLyDiaNguc（nph）TQ.md")
OUT_CN = os.path.join(BASE, "quanlydianguc_ch1_52_cn_extract.md")

NAV_PATTERN = re.compile(r'上一章\s*返回目录\s*加入书签\s*下一章')

def main():
    with open(TQ_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'## 第(\d+)章\s+([^\n]+)\n(.*?)(?=\n---\n|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)

    with open(OUT_CN, 'w', encoding='utf-8') as f:
        for num_str, title, body in matches:
            n = int(num_str)
            if 1 <= n <= 52:
                body = NAV_PATTERN.sub('', body.strip())
                f.write(f"## 第{n}章 {title}\n\n{body}\n\n---\n\n")

    print(f"Đã trích chương 1-52 → {OUT_CN}")
    print("Dịch file này sang tiếng Việt (Google Translate, ChatGPT, v.v.), lưu thành quanlydianguc_ch1_52_vn_translated.md")
    print("Sau đó chạy: python merge_quanlydianguc_translation.py")

if __name__ == '__main__':
    main()
