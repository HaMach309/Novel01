# -*- coding: utf-8 -*-
"""Extract ch41-50 from source, output for translation. Run with: py -3 translate_append_ch41_50.py"""
import re

SOURCE = r"C:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\temp_source_ch35_50.txt"
OUT = r"C:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\ch41_50_to_translate.txt"

with open(SOURCE, "r", encoding="utf-8") as f:
    content = f.read()

# Find ## 第41章 through end of ## 第50章 (before ## 第51章)
start_marker = "## 第41章"
end_marker = "## 第51章"
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found")
    exit(1)

extracted = content[start_idx:end_idx]

# Remove navigation lines
lines = extracted.split("\n")
filtered = []
for line in lines:
    if "上一章" in line or "返回目录" in line or "加入书签" in line or "下一章" in line:
        continue
    filtered.append(line)

result = "\n".join(filtered)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(result)

print(f"Extracted {len(result)} chars to {OUT}")
