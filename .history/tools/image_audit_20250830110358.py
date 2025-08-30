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
IMAGE_RE = re.compile(r"(/images/[^)\'\"]+?\.(?:png|jpg|jpeg|svg))", re.IGNORECASE)


def find_images():
    with open(PAGE_FILE, 'r', encoding='utf-8') as f:
        src = f.read()
    # find image file paths
    found = []
    for m in IMAGE_RE.finditer(src):
        path = m.group(1)
        # normalize percent-encoding for filesystem lookup
        path_fs = path.replace('%20', ' ')
        # capture nearby context (200 chars before and after)
        start = max(0, m.start()-200)
        end = min(len(src), m.end()+200)
        ctx = src[start:end]
        class_match = re.search(r'className=\"([^\"]+)\"', ctx)
        class_name = class_match.group(1) if class_match else ''
        found.append((path_fs, class_name, ctx))
    # dedupe preserving order
    seen = set()
    dedup = []
    for p,c,ctx in found:
        if p not in seen:
            dedup.append((p,c,ctx))
            seen.add(p)
    return dedup


def report():
    imgs = find_images()
    rows = []
    for img, class_name, ctx in imgs:
        # normalize path
        rel = img.lstrip('/')
        path = os.path.join(ROOT, 'public', *rel.split('/'))
        if not os.path.exists(path):
            rows.append((img, class_name, None, None, 'MISSING'))
            continue
        try:
            if path.lower().endswith('.svg'):
                size = os.path.getsize(path)
                rows.append((img, class_name, 'SVG', size, 'VECTOR', ctx))
                continue
            with Image.open(path) as im:
                w, h = im.size
            size = os.path.getsize(path)
            # heuristics: determine usage role
            role = 'thumbnail'
            if 'bg-[url' in ctx or 'background' in ctx or 'bg-' in ctx and 'cover' in ctx:
                role = 'background-hero'
            if 'SmartImage' in ctx:
                role = 'smartimage'
            rows.append((img, class_name, (w,h), size, 'OK', role))
        except Exception as e:
            rows.append((img, class_name, None, None, f'ERROR:{e}', 'unknown'))
    # print report
    print('\nImage audit for page:', PAGE_FILE)
    print('Found', len(rows), 'unique image references')
    print('{:<80} {:<30} {:<12} {:<10} {:<18} {}'.format('path','className','dims','bytes','role','replace?'))
    for img, cls, dims, size, note, role in rows:
        replace = ''
        if note.startswith('OK') or note == 'OK':
            if dims != 'SVG' and dims is not None:
                w,h = dims
                # thresholds
                if role == 'background-hero':
                    if w < 1600 or h < 600:
                        replace = 'YES'
                else:
                    # thumbnails / smartimage
                    if w < 900 or h < 400:
                        replace = 'YES'
        elif note.startswith('ERROR') or note == 'MISSING':
            replace = 'MISSING/ERROR'
        print('{:<80} {:<30} {:<12} {:<10} {:<18} {}'.format(img, cls or '-', str(dims), str(size), role, replace))


if __name__ == '__main__':
    report()
