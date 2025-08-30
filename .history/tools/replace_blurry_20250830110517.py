"""
Replace flagged blurry images with replacements placed in public/images/replacements/.

Behavior:
- For each target image path (anchorage page flagged), the script searches
  for a matching replacement in public/images/replacements/ by exact filename
  or by normalized basename.
- If a replacement is found, the original is moved to public/backups/images/<ts>/
  and the replacement is copied into the original location.
- If no replacement is found for a target, it is reported and left alone.

Run:
  C:/dev/b2r/venv/Scripts/python.exe tools\replace_blurry.py
"""
import os
import shutil
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
REPL_DIR = PUBLIC / 'images' / 'replacements'
BACKUPS_ROOT = PUBLIC / 'backups' / 'images'

# Flagged images from the audit that we want to replace
TARGETS = [
    '/images/party-buses/18 Passenger White Party Bus Exterior.png',
    '/images/coach-buses/50 Passenger Exterior Coach Bus.png',
]


def normalize_name(name: str) -> str:
    # lowercase, remove spaces and punctuation for fuzzy match
    import re
    return re.sub(r"[^a-z0-9]", "", name.lower())


def find_replacement(target_path: Path) -> Path | None:
    # look for exact filename in replacements
    if not REPL_DIR.exists():
        return None
    fname = target_path.name
    cand = REPL_DIR / fname
    if cand.exists():
        return cand
    # fuzzy search: normalized basename match
    target_norm = normalize_name(target_path.stem)
    for p in REPL_DIR.iterdir():
        if p.is_file():
            if normalize_name(p.stem) == target_norm:
                return p
    # try contains
    for p in REPL_DIR.iterdir():
        if p.is_file() and target_norm in normalize_name(p.stem):
            return p
    return None


def ensure_dir(p: Path):
    if not p.exists():
        p.mkdir(parents=True, exist_ok=True)


def main():
    print('Replace blurry images script')
    ensure_dir(REPL_DIR)
    ts = time.strftime('%Y%m%d_%H%M%S')
    backup_dir = BACKUPS_ROOT / ts
    replaced = []
    missing = []
    ensure_dir(backup_dir)

    for t in TARGETS:
        rel = t.lstrip('/')
        orig = PUBLIC / Path(rel)
        print('\nTarget:', orig)
        if not orig.exists():
            print('  ORIGINAL MISSING:', orig)
            missing.append((t, 'original-missing'))
            continue
        repl = find_replacement(orig)
        if not repl:
            print('  No replacement found in', REPL_DIR)
            missing.append((t, 'no-replacement'))
            continue
        # backup original
        dest_backup = backup_dir / orig.name
        try:
            shutil.move(str(orig), str(dest_backup))
            print('  Moved original to backup:', dest_backup)
        except Exception as e:
            print('  Failed to backup original:', e)
            missing.append((t, f'backup-failed:{e}'))
            continue
        # copy replacement into original location (create parent dir)
        ensure_dir(orig.parent)
        try:
            shutil.copy2(str(repl), str(orig))
            print('  Copied replacement', repl.name, '->', orig)
            replaced.append((t, repl.name))
        except Exception as e:
            print('  Failed to copy replacement:', e)
            # attempt to restore backup
            try:
                shutil.move(str(dest_backup), str(orig))
                print('  Restored original from backup due to failure')
            except Exception:
                print('  Failed to restore original; manual intervention required')
            missing.append((t, f'copy-failed:{e}'))

    print('\nSummary:')
    print(' Replaced:', len(replaced))
    for r in replaced:
        print('  -', r[0], 'with', r[1])
    if missing:
        print('\n Not replaced / issues:', len(missing))
        for m in missing:
            print('  -', m[0], m[1])
    else:
        print('\n All targets replaced successfully')


if __name__ == '__main__':
    main()
