#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Merge Vietnamese translations ch40-50 into ch38_50_vietnamese_translation.md"""

import re

BASE_DIR = r"c:\Users\KienNT\Desktop\AnhDL\Novel\Novel01"
MAIN_FILE = f"{BASE_DIR}/ch38_50_vietnamese_translation.md"
APPEND_FILE = f"{BASE_DIR}/translation_ch38_50_append.md"
OUTPUT_FILE = f"{BASE_DIR}/ch38_50_vietnamese_translation.md"

# Navigation lines to remove
NAV_PATTERN = re.compile(r'^\s*(上一章|返回目录|加入书签|下一章)\s*$')

def extract_chapters(content):
    """Extract chapter boundaries: (chapter_num, start_line, end_line)"""
    lines = content.split('\n')
    pattern = re.compile(r'^## Chương (\d+) – (.+)$')
    chapters = []
    for i, line in enumerate(lines):
        m = pattern.match(line)
        if m:
            chapters.append((int(m.group(1)), i, m.group(2)))
    return lines, chapters

def get_first_occurrence_ranges(lines, chapter_nums):
    """Get line ranges for first occurrence of each chapter."""
    pattern = re.compile(r'^## Chương (\d+) – (.+)$')
    found = {}  # chapter_num -> (start_line, title)
    ranges = {}  # chapter_num -> (start, end)
    
    for i, line in enumerate(lines):
        m = pattern.match(line)
        if m:
            num = int(m.group(1))
            if num not in found:
                found[num] = (i, m.group(2))
    
    # Build ranges: end = start of next chapter (or end of file)
    sorted_nums = sorted(found.keys())
    for idx, num in enumerate(sorted_nums):
        start = found[num][0]
        if idx + 1 < len(sorted_nums):
            next_num = sorted_nums[idx + 1]
            end = found[next_num][0]
        else:
            end = len(lines)
        ranges[num] = (start, end)
    
    return ranges

def clean_line(line):
    """Remove navigation lines."""
    if NAV_PATTERN.match(line.strip()):
        return None
    return line

def apply_replacements(text):
    """Apply style replacements."""
    # ngươi -> bạn (for "you")
    text = text.replace('ngươi', 'bạn')
    # 【猩红圣杯】 or 【Tinh Hồng Thánh Bôi】 -> Chén Thánh Đỏ Tươi
    text = text.replace('【猩红圣杯】', 'Chén Thánh Đỏ Tươi')
    text = text.replace('【Tinh Hồng Thánh Bôi】', 'Chén Thánh Đỏ Tươi')
    return text

def main():
    # Read main file - keep ch38-39 (up to and including ---)
    with open(MAIN_FILE, 'r', encoding='utf-8') as f:
        main_content = f.read()
    
    # Find where to cut - keep everything up to and including "---" before Ch40
    main_lines = main_content.split('\n')
    cut_idx = 0
    for i, line in enumerate(main_lines):
        if line.strip() == '---':
            # Check if next non-empty is Ch40
            for j in range(i+1, min(i+5, len(main_lines))):
                if main_lines[j].strip() and main_lines[j].startswith('## Chương 40'):
                    cut_idx = i + 1  # Keep lines 0..i (inclusive of ---)
                    break
            if cut_idx > 0:
                break
        if re.match(r'^## Chương 40 ', line):
            # Found Ch40, keep everything before it
            cut_idx = i
            break
    
    if cut_idx == 0:
        # Fallback: keep first 454 lines as user said
        cut_idx = 452  # 0-indexed, so line 453 would be Ch40
    
    base_content = '\n'.join(main_lines[:cut_idx])
    
    # Read append file
    with open(APPEND_FILE, 'r', encoding='utf-8') as f:
        append_content = f.read()
    
    append_lines = append_content.split('\n')
    ranges = get_first_occurrence_ranges(append_lines, list(range(40, 51)))
    
    # Extract chapters 40-50 in order
    result_parts = []
    for ch_num in range(40, 51):
        if ch_num not in ranges:
            print(f"Warning: Chapter {ch_num} not found")
            continue
        start, end = ranges[ch_num]
        chapter_lines = append_lines[start:end]
        
        # Get title from first line
        title_match = re.match(r'^## Chương \d+ – (.+)$', chapter_lines[0])
        title = title_match.group(1) if title_match else ""
        
        # Clean and join
        cleaned = []
        for line in chapter_lines:
            cleaned_line = clean_line(line)
            if cleaned_line is not None:
                cleaned.append(cleaned_line)
        
        chapter_text = '\n'.join(cleaned)
        chapter_text = apply_replacements(chapter_text)
        result_parts.append(chapter_text)
    
    # Combine
    ch40_50_content = '\n\n'.join(result_parts)
    
    # Ensure we have --- before appending if not already there
    if not base_content.rstrip().endswith('---'):
        base_content = base_content.rstrip() + '\n\n---\n\n'
    else:
        base_content = base_content.rstrip() + '\n\n'
    
    final_content = base_content + ch40_50_content
    
    # Write output
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"Done. Merged chapters 38-50 into {OUTPUT_FILE}")
    print(f"Base content: {cut_idx} lines")
    print(f"Appended chapters: 40-50")

if __name__ == '__main__':
    main()
