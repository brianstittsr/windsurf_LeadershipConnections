#!/usr/bin/env python3
"""
Script to remove all dark mode classes from the Leadership Connections project.
This will find and remove all 'dark:' prefixed Tailwind classes from .tsx and .ts files.
"""

import os
import re
from pathlib import Path

# Directories to process
DIRECTORIES = [
    'app',
    'components',
]

# File extensions to process
EXTENSIONS = ['.tsx', '.ts']

# Pattern to match dark mode classes
# Matches: dark:class-name or dark:class-name/value
DARK_MODE_PATTERN = r'\s+dark:[a-zA-Z0-9\-_/\[\]]+(?=\s|"|\'|>|/)'

def remove_dark_mode_from_file(file_path):
    """Remove all dark mode classes from a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove dark mode classes
        content = re.sub(DARK_MODE_PATTERN, '', content)
        
        # Clean up any double spaces that might result
        content = re.sub(r'  +', ' ', content)
        
        # Clean up spaces before closing quotes
        content = re.sub(r' +"', '"', content)
        content = re.sub(r' +\'', '\'', content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all files."""
    base_dir = Path(__file__).parent
    files_modified = 0
    files_processed = 0
    
    print("🚀 Starting dark mode removal...")
    print(f"Base directory: {base_dir}")
    print()
    
    for directory in DIRECTORIES:
        dir_path = base_dir / directory
        if not dir_path.exists():
            print(f"⚠️  Directory not found: {dir_path}")
            continue
        
        print(f"📁 Processing {directory}/...")
        
        for ext in EXTENSIONS:
            for file_path in dir_path.rglob(f'*{ext}'):
                files_processed += 1
                if remove_dark_mode_from_file(file_path):
                    files_modified += 1
                    rel_path = file_path.relative_to(base_dir)
                    print(f"  ✅ {rel_path}")
    
    print()
    print("=" * 60)
    print(f"✨ Dark mode removal complete!")
    print(f"📊 Files processed: {files_processed}")
    print(f"✏️  Files modified: {files_modified}")
    print(f"📝 Files unchanged: {files_processed - files_modified}")
    print("=" * 60)
    print()
    print("🎉 All dark mode classes have been removed!")
    print("💡 Your site now has a consistent light theme.")

if __name__ == '__main__':
    main()
