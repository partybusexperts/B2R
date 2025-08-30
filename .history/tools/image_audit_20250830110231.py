"""
Scans a given Next.js page file for /images/... references, reports file size and image dimensions.
Run: C:/dev/b2r/venv/Scripts/python.exe tools\image_audit.py
"""
import re
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE_FILE = os.path.join(ROOT, "src", "app", "locations", "anchorage-alaska", "page.tsx")
IMAGE_RE = re.compile(r"/images/[\w\-\s%\.\(\)]+")


def find_images():
    with open(PAGE_FILE, 'r', encoding='utf-8') as f:
        src = f.read()
    found = set(m.group(0) for m in IMAGE_RE.finditer(src))
    return sorted(found)


def report():
    imgs = find_images()
    rows = []
    for img in imgs:
        # normalize path
        rel = img.lstrip('/')
        path = os.path.join(ROOT, 'public', *rel.split('/'))
        if not os.path.exists(path):
            rows.append((img, None, None, 'MISSING'))
            continue
        try:
            if path.lower().endswith('.svg'):
                size = os.path.getsize(path)
                rows.append((img, 'SVG', size, 'VECTOR'))
                continue
            with Image.open(path) as im:
                w, h = im.size
            size = os.path.getsize(path)
            rows.append((img, (w,h), size, 'OK'))
        except Exception as e:
            rows.append((img, None, None, f'ERROR:{e}'))
    # print report
    print('\nImage audit for page:', PAGE_FILE)
    print('Found', len(rows), 'unique image references')
    print('{:<80} {:<12} {:<10} {}'.format('path','dims','bytes','note'))
    for r in rows:
        print('{:<80} {:<12} {:<10} {}'.format(r[0], str(r[1]), str(r[2]), r[3]))


if __name__ == '__main__':
    report()
