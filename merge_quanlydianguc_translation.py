# -*- coding: utf-8 -*-
"""Merge bản dịch chương 1-52 vào file VietSub. Chạy sau khi đã có file dịch."""

import re
import os

BASE = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
VN_PATH = os.path.join(BASE, "Truyện đã dịch", "QuanLyDiaNguc（nph）VietSub.md")
TRANSLATED_PATH = os.path.join(BASE, "quanlydianguc_ch1_52_vn_translated.md")

def main():
    if not os.path.exists(TRANSLATED_PATH):
        print(f"Không tìm thấy file dịch: {TRANSLATED_PATH}")
        print("Cần file có format: ## Chương N – Tiêu đề\n\nNội dung...\n\n---\n\n")
        return

    with open(TRANSLATED_PATH, 'r', encoding='utf-8') as f:
        new_content = f.read()

    with open(VN_PATH, 'r', encoding='utf-8', errors='replace') as f:
        full_content = f.read()

    # Header = từ đầu đến trước ## Ch (chương đầu)
    idx_first = full_content.find('## Ch')
    if idx_first <= 0:
        print("Không tìm thấy chương đầu trong file VietSub")
        return
    header = full_content[:idx_first]

    # Tìm bắt đầu Chương 53
    ch53_match = re.search(r'\n## Chương 53\s*[–\-]', full_content)
    if not ch53_match:
        ch53_match = re.search(r'\n## Ch[^\n]*53[^\n]*\n', full_content)
    ch53_start = ch53_match.start() + 1 if ch53_match else -1

    if ch53_start > 0:
        tail = full_content[ch53_start:]
    else:
        tail = ""

    result = header + new_content.rstrip()
    if tail:
        result += "\n\n---\n\n" + tail

    backup_path = VN_PATH + ".before_merge"
    with open(backup_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(full_content)
    print(f"Backup: {backup_path}")

    with open(VN_PATH, 'w', encoding='utf-8') as f:
        f.write(result)

    print("Đã merge xong! File VietSub đã được cập nhật.")

if __name__ == '__main__':
    main()
