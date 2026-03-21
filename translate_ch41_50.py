# -*- coding: utf-8 -*-
"""Process ch41-50 source: extract, remove nav lines, prepare for append."""
import re
import os

os.chdir(r'C:\Users\KienNT\Desktop\AnhDL\Novel\Novel01')

NAV_PATTERN = re.compile(r'上一章\s*返回目录\s*加入书签\s*下一章')

CHAPTER_MAP = {
    41: ('第五十五章卡尔的按摩(h)', 'Massage của Karl (h)'),
    42: ('第五十四章全身而退', 'Toàn thân lui'),
    43: ('第五十三章解救员工', 'Giải cứu nhân viên'),
    44: ('第五十二章莉莉丝娅的幻影', 'Ảo ảnh Lily Tư Á'),
    45: ('第五十一章维奥莱卡的幻境(h)', 'Ảo cảnh Vi O Lai Khả (h)'),
    46: ('第五十章沉沦迷宫', 'Mê cung trầm luân'),
    47: ('第四十九章维奥莱卡的陷阱', 'Bẫy của Vi O Lai Khả'),
    48: ('第四十八章万事俱备', 'Vạn sự đã sẵn sàng'),
    49: ('第四十七章绯色魅影的邀请', 'Lời mời Mị Sắc Yêu Ảnh'),
    50: ('第四十六章还没结束呢(h)', 'Vẫn chưa kết thúc (h)'),
}

def main():
    with open('ch41_50_source_extract.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extract only ch41-50: from line 1 to before ## 第51章
    out_lines = []
    for i, line in enumerate(lines):
        if re.match(r'^## 第51章', line):
            break
        if NAV_PATTERN.search(line):
            continue
        out_lines.append(line)
    
    # Write extracted content (for reference / manual translation)
    with open('ch41_50_for_translation.txt', 'w', encoding='utf-8') as f:
        f.writelines(out_lines)
    
    print(f'Extracted {len(out_lines)} lines (ch41-50), nav lines removed.')
    print('Saved to ch41_50_for_translation.txt')

if __name__ == '__main__':
    main()
