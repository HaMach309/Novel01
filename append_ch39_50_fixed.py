# -*- coding: utf-8 -*-
"""Append Ch39-50 from translation_ch36_50_full.md to translation_ch36_50_append.md with fixes."""

import re

# Chapter boundaries (line numbers, 1-based, inclusive)
# Ch39: 705-928, Ch40: 929-1452 (both parts), Ch41: 1453-1685, Ch42: 1686-1805, 
# Ch43: 1806-2061, Ch44: 2062-2371, Ch45: 2372-2669, Ch46: 2670-2749, 
# Ch47: 2750-2841, Ch48: 2842-3222, Ch49: 3223-3364, Ch50: 3365-end
CHAPTERS = [
    (39, 705, 928, "Tin đồn phiền toái"),
    (40, 929, 1452, "Che phủ dấu vết (h)"),
    (41, 1453, 1685, "Xoa bóp của Karl (h)"),
    (42, 1686, 1805, "Toàn thân mà lui"),
    (43, 1806, 2061, "Giải cứu nhân viên"),
    (44, 2062, 2371, "Ảo ảnh Lily Tư Á"),
    (45, 2372, 2669, "Ảo cảnh Vi O Lai Khả (h)"),
    (46, 2670, 2749, "Mê cung chìm đắm"),
    (47, 2750, 2841, "Bẫy của Vi O Lai Khả"),
    (48, 2842, 3222, "Vạn sự đã sẵn sàng"),
    (49, 3223, 3364, "Lời mời Mị Sắc Yêu Ảnh"),
    (50, 3365, 99999, "Chưa kết thúc đâu (h)"),
]

def apply_fixes(text):
    """Apply all replacements."""
    # Replace "Vãn Vãn" with "Lily" (but keep "Lily Tư Á" - that's a different character)
    text = re.sub(r'\bVãn Vãn\b', 'Lily', text)
    
    # Replace "Tử Hồng Thánh Bôi" and "Tinh Hồng Thánh Bôi" with "Chén Thánh Đỏ Tươi"
    text = re.sub(r'【Tử Hồng Thánh Bôi】', '【Chén Thánh Đỏ Tươi】', text)
    text = re.sub(r'【Tinh Hồng Thánh Bôi】', '【Chén Thánh Đỏ Tươi】', text)
    text = re.sub(r'\bTử Hồng Thánh Bôi\b', 'Chén Thánh Đỏ Tươi', text)
    text = re.sub(r'\bTinh Hồng Thánh Bôi\b', 'Chén Thánh Đỏ Tươi', text)
    
    # Replace "Bạn" with "Ngươi" where appropriate (formal tone)
    # Only when "Bạn" appears to address the reader (start of sentence)
    text = re.sub(r'(^|[\.\?\!]\s*)Bạn\b', r'\1Ngươi', text)
    
    # Remove navigation text
    text = re.sub(r'上一章\s*返回目录\s*加入书签\s*下一章', '', text)
    
    # Fix "Tin đồn phiền phức" -> "Tin đồn phiền toái"
    text = text.replace("Tin đồn phiền phức", "Tin đồn phiền toái")
    
    # Fix "Massage" -> "Xoa bóp"
    text = re.sub(r'\bMassage\b', 'Xoa bóp', text, flags=re.IGNORECASE)
    
    # Fix "Vẫn chưa kết thúc" -> "Chưa kết thúc đâu"
    text = text.replace("Vẫn chưa kết thúc", "Chưa kết thúc đâu")
    
    return text

def fix_chapter_title(line, num, title):
    """Replace chapter title with correct format."""
    # Match ## Chương N – anything
    pattern = r'^##\s*Chương\s+\d+\s*[–\-]\s*.*$'
    if re.match(pattern, line.strip()):
        return f"## Chương {num} – {title}"
    return line

def main():
    base = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
    full_path = f"{base}\\translation_ch36_50_full.md"
    append_path = f"{base}\\translation_ch36_50_append.md"
    
    with open(full_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    output_lines = []
    
    for num, start, end, title in CHAPTERS:
        start_idx = start - 1  # 0-based
        end_idx = min(end, len(lines))  # end inclusive
        
        if start_idx >= len(lines):
            break
            
        chunk = lines[start_idx:end_idx]
        chunk_text = ''.join(chunk)
        
        # Apply fixes
        chunk_text = apply_fixes(chunk_text)
        
        # Fix chapter title(s) - keep first, remove duplicates
        chunk_lines = chunk_text.split('\n')
        first_header = True
        for i, line in enumerate(chunk_lines):
            if line.strip().startswith('## Chương'):
                if first_header:
                    chunk_lines[i] = fix_chapter_title(line, num, title)
                    first_header = False
                else:
                    # Remove duplicate chapter header (e.g. in Ch40)
                    chunk_lines[i] = ''
        
        output_lines.append('\n'.join(chunk_lines))
    
    # Join with separator
    content_to_append = '\n\n---\n\n'.join(output_lines)
    
    # Read existing append file
    with open(append_path, 'r', encoding='utf-8') as f:
        existing = f.read()
    
    # Remove trailing whitespace from existing, add newline if needed
    existing = existing.rstrip()
    if not existing.endswith('\n'):
        existing += '\n'
    
    # Append
    existing += '\n\n' + content_to_append + '\n'
    
    with open(append_path, 'w', encoding='utf-8') as f:
        f.write(existing)
    
    print("Done. Appended Ch39-50 to translation_ch36_50_append.md")

if __name__ == '__main__':
    main()
