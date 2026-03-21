# -*- coding: utf-8 -*-
import re
import sys

def main():
    with open('temp_source_ch35_50.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by --- followed by ## 第N章
    parts = re.split(r'---\s*\n', content)
    
    chapter_map = {}
    for part in parts:
        match = re.match(r'## 第(\d+)章\s+(.+?)(?=\n|$)', part, re.DOTALL)
        if match:
            num = int(match.group(1))
            chapter_map[num] = part

    # Extract chapters 38-50
    extracted = []
    for n in range(38, 51):
        if n in chapter_map:
            text = chapter_map[n]
            # Remove navigation lines
            text = re.sub(r'上一章 返回目录 加入书签 下一章\s*', '', text)
            extracted.append(text)

    result = '\n\n---\n\n'.join(extracted)
    with open('ch38_50_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(result)

    print('Extracted', len(extracted), 'chapters, total chars:', len(result))

if __name__ == '__main__':
    main()
