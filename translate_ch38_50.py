# -*- coding: utf-8 -*-
"""Append chapters 40-50 Vietnamese translation to existing file."""
import re

# Character name mapping
NAMES = {
    '卡尔': 'Karl',
    '维奥莱卡': 'Vi O Lai Khả',
    '莉莉丝娅': 'Lily Tư Á',
    '西尔凡': 'Tây Nhĩ Phàm',
    '伊利亚': 'Y Lợi Á',
    '格雷戈': 'Cách Lý Cách',
    '锈骨': 'Tú Cốt',
    '晚晚': 'Vãn Vãn',
    '阿萨谢尔': 'A Tát Tạ Nhĩ',
}

CHAPTER_TITLES = {
    40: 'Che phủ dấu vết (h)',
    41: 'Massage của Karl (h)',
    42: 'Toàn thân lui',
    43: 'Giải cứu nhân viên',
    44: 'Ảo ảnh Lily Tư Á',
    45: 'Ảo cảnh Vi O Lai Khả (h)',
    46: 'Mê cung trầm luân',
    47: 'Bẫy của Vi O Lai Khả',
    48: 'Vạn sự đã sẵn sàng',
    49: 'Lời mời Mị Sắc Yêu Ảnh',
    50: 'Vẫn chưa kết thúc (h)',
}

def remove_nav_lines(text):
    """Remove navigation lines like 上一章 返回目录 加入书签 下一章"""
    return re.sub(r'上一章\s*返回目录\s*加入书签\s*下一章', '', text)

def extract_chapters(content):
    """Extract chapters 40-50 from content."""
    pattern = r'(## 第(\d+)章[^\n]*\n.*?)(?=---|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    chapters = {}
    for match, num in matches:
        n = int(num)
        if 40 <= n <= 50:
            chapters[n] = remove_nav_lines(match.strip())
    return chapters

def main():
    with open('ch38_50_extracted.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    chapters = extract_chapters(content)
    
    with open('ch38_50_vietnamese_translation.md', 'r', encoding='utf-8') as f:
        existing = f.read()
    
    # Check what's already there
    for n in range(40, 51):
        if f'## Chương {n}' in existing:
            print(f'Chapter {n} already exists')
        else:
            print(f'Chapter {n} needs to be added, length: {len(chapters.get(n, ""))} chars')

if __name__ == '__main__':
    main()
