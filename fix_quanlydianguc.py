# -*- coding: utf-8 -*-
"""
Script sửa lỗi file QuanLyDiaNguc（nph）VietSub.md:
1. Xóa các chương trùng lặp (Ch 11-14, Ch 51, Ch 52)
2. Sửa double encoding (UTF-8 bị đọc sai thành Latin-1)
3. Thay thế Chương 57 rút gọn bằng bản dịch đầy đủ (nếu có file)
"""

import re
import os

FILE_PATH = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\Truyện đã dịch\QuanLyDiaNguc（nph）VietSub.md"
BACKUP_PATH = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\Truyện đã dịch\QuanLyDiaNguc（nph）VietSub.md.backup"

def fix_double_encoding(text):
    """Sửa double encoding: UTF-8 bị interpret như Latin-1 rồi save lại UTF-8"""
    try:
        return text.encode('latin-1').decode('utf-8')
    except (UnicodeDecodeError, UnicodeEncodeError):
        return text

def process_file():
    print("Đang đọc file...")
    with open(FILE_PATH, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()
    
    total = len(lines)
    print(f"Tổng số dòng: {total}")
    
    # Backup
    print("Đang tạo backup...")
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    # 1. Xóa chương trùng - xóa từ dưới lên
    ranges_to_remove = [
        (12592, 12717),   # Ch 52 duplicate (0-indexed)
        (12310, 12466),   # Ch 51 duplicate  
        (2393, 3539),     # Ch 11-14 duplicate block
    ]
    
    for start, end in sorted(ranges_to_remove, reverse=True):
        del lines[start:end]
        print(f"Đã xóa dòng {start+1}-{end}")
    
    # 2. Sửa double encoding - tìm và sửa tất cả dòng có pattern
    double_enc_pattern = re.compile(r'[Æ°á»‡Ã¢Ä]')
    fixed_count = 0
    for i in range(len(lines)):
        line = lines[i]
        if double_enc_pattern.search(line):
            try:
                fixed = fix_double_encoding(line)
                if fixed != line:
                    lines[i] = fixed
                    fixed_count += 1
            except:
                pass
    
    print(f"Đã sửa {fixed_count} dòng encoding")
    
    # 3. Chương 57 - thay thế "[...]" và tóm tắt bằng nội dung đầy đủ
    ch57_start = ch57_bracket = ch58_start = None
    for i, line in enumerate(lines):
        if '## Ch' in line and '57' in line:
            ch57_start = i
        if ch57_start is not None and '[...]' in line:
            ch57_bracket = i
        if ch57_start is not None and '## Ch' in line and '58' in line:
            ch58_start = i
            break
    
    if ch57_bracket is not None and ch58_start is not None:
        ch57_full_path = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01\ch57_full_translation.md"
        if os.path.exists(ch57_full_path):
            with open(ch57_full_path, 'r', encoding='utf-8') as f:
                ch57_full = f.read()
            bracket_line = lines[ch57_bracket]
            parts = bracket_line.split('[...]', 1)
            # Giữ phần trước [...], thêm nội dung đầy đủ, bỏ phần tóm tắt
            new_content = parts[0].rstrip() + '\n\n' + ch57_full.rstrip() + '\n'
            # Xóa từ dòng [...] đến trước Ch 58
            del lines[ch57_bracket:ch58_start]
            lines.insert(ch57_bracket, new_content)
            print("Đã thay thế Chương 57 bằng bản dịch đầy đủ")
        else:
            print("Chưa có ch57_full_translation.md - bỏ qua thay Ch 57")
    
    # Ghi file
    print("Đang ghi file...")
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("Hoàn tất!")

if __name__ == '__main__':
    process_file()
