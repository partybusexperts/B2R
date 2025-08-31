"""Merge existing votes and ensure every poll from public/polls.json has an entry.

Usage: venv\Scripts\activate && python scripts\ensure_votes.py

This script is safe to run repeatedly. It preserves any non-zero tallies.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLL_FILE = os.path.join(ROOT, "data", "polls.json")
PUBLIC_FILE = os.path.join(ROOT, "public", "polls.json")


def load_json(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return None
    return None


def main():
    public = load_json(PUBLIC_FILE) or []
    pub_ids = [p.get("id") for p in public if isinstance(p, dict) and p.get("id")]

    existing = load_json(POLL_FILE)
    votes = {}
    if isinstance(existing, dict) and "votes" in existing and isinstance(existing.get("votes"), dict):
        votes = existing.get("votes", {})
    elif isinstance(existing, dict):
        votes = existing

    changed = False
    # Ensure each pub id exists in votes
    for pid in pub_ids:
        if pid not in votes:
            votes[pid] = {}
            changed = True

    # Persist canonical wrapper
    out = {"votes": votes}
    if changed or existing is None:
        tmp = POLL_FILE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        os.replace(tmp, POLL_FILE)
        print(f"Wrote canonical votes file with {len(votes)} polls to {POLL_FILE}")
    else:
        print("No changes needed; votes file already canonical and complete.")


if __name__ == "__main__":
    main()
