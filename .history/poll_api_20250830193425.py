import os
import json
from fastapi import APIRouter, HTTPException, Request
import traceback
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

POLL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "polls.json")

router = APIRouter()

class PollVote(BaseModel):
    poll_id: str
    option: str

@router.post("/api/poll/vote")
async def vote_poll(vote: PollVote):
    print(f"[PollAPI] Vote received: poll_id={vote.poll_id}, option={vote.option}")
    try:
        # Load poll data (accept either the canonical {"votes": {...}} shape or
        # a legacy flat mapping). Normalize to an in-memory `votes` dict and
        # always write back the canonical shape so other parts of the app (Next
        # API routes) see a consistent format.
        votes = {}
        if os.path.exists(POLL_FILE):
            with open(POLL_FILE, "r", encoding="utf-8") as f:
                parsed = json.load(f)
                # canonical shape
                if isinstance(parsed, dict) and "votes" in parsed and isinstance(parsed.get("votes"), dict):
                    votes = parsed.get("votes", {})
                elif isinstance(parsed, dict):
                    # legacy flat mapping: treat top-level keys as poll ids
                    votes = parsed
        # Ensure poll exists
        if vote.poll_id not in votes:
            votes[vote.poll_id] = {}
        # Increment vote
        if vote.option not in votes[vote.poll_id]:
            votes[vote.poll_id][vote.option] = 0
        votes[vote.poll_id][vote.option] += 1
        # Always persist using the canonical wrapper so both backends agree
        out = {"votes": votes}
        # atomic write
        tmp = POLL_FILE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        os.replace(tmp, POLL_FILE)
        print(f"[PollAPI] Vote saved: {POLL_FILE}")
        return {"success": True, "poll_id": vote.poll_id, "option": vote.option}
    except Exception as e:
        print(f"[PollAPI] Error saving vote: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to save vote.")

@router.get("/api/poll/results/{poll_id}")
async def get_poll_results(poll_id: str):
    # Load and normalize votes so both legacy (flat) and canonical ({"votes": {...}})
    if os.path.exists(POLL_FILE):
        with open(POLL_FILE, "r", encoding="utf-8") as f:
            parsed = json.load(f)
    else:
        parsed = {}
    votes = {}
    if isinstance(parsed, dict) and "votes" in parsed and isinstance(parsed.get("votes"), dict):
        votes = parsed.get("votes", {})
    elif isinstance(parsed, dict):
        votes = parsed
    results = votes.get(poll_id, {})
    return {"poll_id": poll_id, "results": results}


@router.get("/api/poll/raw")
async def get_raw_votes():
    """Return the raw polls.json contents. This endpoint is used as a fallback
    by the client when batch API requests fail — it returns whatever is on
    disk (canonical or legacy shape)."""
    if os.path.exists(POLL_FILE):
        with open(POLL_FILE, "r", encoding="utf-8") as f:
            try:
                parsed = json.load(f)
            except Exception:
                # If file is corrupt, return empty mapping
                parsed = {}
    else:
        parsed = {}
    return parsed

@router.get("/api/poll/all")
async def get_all_polls():
    # Return the canonical shape {"votes": {...}} regardless of how the file is stored
    if os.path.exists(POLL_FILE):
        with open(POLL_FILE, "r", encoding="utf-8") as f:
            parsed = json.load(f)
    else:
        parsed = {}
    votes = {}
    if isinstance(parsed, dict) and "votes" in parsed and isinstance(parsed.get("votes"), dict):
        votes = parsed.get("votes", {})
    elif isinstance(parsed, dict):
        votes = parsed
    return {"votes": votes}
