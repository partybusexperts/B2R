"""
Scans a given Next.js page file for /images/... references, reports file size and image dimensions.
Run: C:/dev/b2r/venv/Scripts/python.exe tools\image_audit.py
"""
import re
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE_FILE = os.path.join(ROOT, "src", "app", "locations", "anchorage-alaska", "page.tsx")
# match image files with common extensions, allow percent-encoding and spaces
IMAGE_RE = re.compile(r"(/images/[\w\- %\(\)\.%20]+?\.(?:png|jpg|jpeg|svg))", re.IGNORECASE)


def find_images():
    with open(PAGE_FILE, 'r', encoding='utf-8') as f:
        src = f.read()
    # find image file paths
    found = []
    for m in IMAGE_RE.finditer(src):
        path = m.group(1)
        # normalize percent-encoding for filesystem lookup
        path_fs = path.replace('%20', ' ')
        # capture nearby className if present (within 200 chars ahead)
        start = m.start()
        ctx = src[start:start+200]
        class_match = re.search(r'className=\"([^\"]+)\"', ctx)
        class_name = class_match.group(1) if class_match else ''
        found.append((path_fs, class_name))
    # dedupe preserving order
    seen = set()
    dedup = []
    for p,c in found:
        if p not in seen:
            dedup.append((p,c))
            seen.add(p)
    return dedup


def report():
    imgs = find_images()
    rows = []
    for img, class_name in imgs:
        # normalize path
        rel = img.lstrip('/')
        path = os.path.join(ROOT, 'public', *rel.split('/'))
        if not os.path.exists(path):
            rows.append((img, class_name, None, None, 'MISSING'))
            continue
        try:
            if path.lower().endswith('.svg'):
                size = os.path.getsize(path)
                rows.append((img, class_name, 'SVG', size, 'VECTOR'))
                continue
            with Image.open(path) as im:
                w, h = im.size
            size = os.path.getsize(path)
            rows.append((img, class_name, (w,h), size, 'OK'))
        except Exception as e:
            rows.append((img, class_name, None, None, f'ERROR:{e}'))
    # print report
    print('\nImage audit for page:', PAGE_FILE)
    print('Found', len(rows), 'unique image references')
    print('{:<80} {:<30} {:<12} {:<10} {}'.format('path','className','dims','bytes','note'))
    for img, cls, dims, size, note in rows:
        print('{:<80} {:<30} {:<12} {:<10} {}'.format(img, cls or '-', str(dims), str(size), note))


if __name__ == '__main__':
    report()
