# -*- coding: utf-8 -*-
"""Merge chapters 40-50 into ch38_50_vietnamese_translation.md"""
import re

def extract_chapter(content, start_marker, next_marker=None):
    """Extract content from start_marker until next chapter or end."""
    start = content.find(start_marker)
    if start == -1:
        return None
    if next_marker:
        end = content.find(next_marker, start + len(start_marker))
        if end == -1:
            return content[start:]
        return content[start:end].rstrip()
    return content[start:].rstrip()

def apply_fixes(text):
    """Apply style fixes: ngươi->bạn, Tinh Hồng Thánh Bôi->Chén Thánh Đỏ Tươi"""
    text = text.replace('ngươi', 'bạn')
    text = text.replace('Ngươi', 'Bạn')
    text = text.replace('Tinh Hồng Thánh Bôi', 'Chén Thánh Đỏ Tươi')
    text = text.replace('【Tinh Hồng Thánh Bôi】', '【Chén Thánh Đỏ Tươi】')
    text = text.replace('【Phi Sắc Mị Ảnh】', '【Mị Sắc Yêu Ảnh】')
    text = text.replace('Phi Sắc Mị Ảnh', 'Mị Sắc Yêu Ảnh')
    # Remove navigation lines if any
    text = re.sub(r'上一章.*?下一章', '', text, flags=re.DOTALL)
    text = re.sub(r'返回目录|加入书签', '', text)
    return text

def main():
    # Read append file
    with open('translation_ch38_50_append.md', 'r', encoding='utf-8') as f:
        append_content = f.read()
    
    # Chapter markers - use first occurrence of each
    chapters = []
    chapter_patterns = [
        (40, '## Chương 40 – Che phủ dấu vết (h)'),
        (41, '## Chương 41 – Massage của Karl (h)'),
        (42, '## Chương 42 – Toàn thân lui'),
        (43, '## Chương 43 – Giải cứu nhân viên'),
        (44, '## Chương 44 – Ảo ảnh Lily Tư Á'),
        (45, '## Chương 45 – Ảo cảnh Vi O Lai Khả (h)'),
        (46, '## Chương 46 – Mê cung trầm luân'),
        (47, '## Chương 47 – Bẫy của Vi O Lai Khả'),
        (48, '## Chương 48 – Vạn sự đã sẵn sàng'),
        (49, '## Chương 49 – Lời mời Mị Sắc Yêu Ảnh'),
        (50, '## Chương 50 – Vẫn chưa kết thúc (h)'),
    ]
    
    for i, (num, marker) in enumerate(chapter_patterns):
        next_marker = chapter_patterns[i+1][1] if i+1 < len(chapter_patterns) else None
        # Find first occurrence
        content = extract_chapter(append_content, marker, next_marker)
        if content:
            content = apply_fixes(content)
            chapters.append((num, content))
    
    # Read main file
    with open('ch38_50_vietnamese_translation.md', 'r', encoding='utf-8') as f:
        main_content = f.read()
    
    # Ensure format: ## Chương N – [title]
    for num, content in chapters:
        if not content.strip().startswith('## Chương'):
            content = f'## Chương {num} – ' + content
        # Fix format if needed
        if '## Chương' in content and ' – ' not in content.split('\n')[0]:
            first_line = content.split('\n')[0]
            if '–' not in first_line and ' - ' in first_line:
                content = content.replace(' - ', ' – ', 1)
    
    # Build append text
    append_text = '\n\n'.join(content.strip() for _, content in chapters)
    
    # Remove trailing --- from main if present, then append
    main_content = main_content.rstrip()
    if main_content.endswith('---'):
        main_content = main_content.rstrip('-').rstrip()
    
    # Append
    result = main_content + '\n\n---\n\n' + append_text + '\n'
    
    with open('ch38_50_vietnamese_translation.md', 'w', encoding='utf-8') as f:
        f.write(result)
    
    print(f"Merged chapters 40-50. Total chapters added: {len(chapters)}")

if __name__ == '__main__':
    main()
