#!/usr/bin/env python3
"""
MCP tool: get_court_details

Calls ``GET /api/courts/:id`` on fivesarena.com (grounded, API-based).
Falls back to ``court_lexicon_static`` when the API is unreachable so KC
can still narrate court info offline.

Env
---
FIVESARENA_BASE_URL  (default: https://fivesarena.com)

Usage (standalone)::

    python get_court_details.py premier
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any, Dict, Optional

# ── Local fallback ───────────────────────────────────────────────────────
try:
    from court_lexicon_static import lookup as _lexicon_lookup
except ImportError:
    # Running outside package root — try relative
    try:
        from .court_lexicon_static import lookup as _lexicon_lookup
    except ImportError:
        _lexicon_lookup = None  # type: ignore[assignment]


# ── Config ───────────────────────────────────────────────────────────────
_BASE_URL = os.environ.get("FIVESARENA_BASE_URL", "https://fivesarena.com")
_TIMEOUT_S = 15


# ── Core ─────────────────────────────────────────────────────────────────

def get_court_details(court_id: str) -> Dict[str, Any]:
    """
    Fetch court details from the live Bookit API.

    Parameters
    ----------
    court_id : str
        The court slug or MongoDB ObjectId, e.g. ``"premier"``.

    Returns
    -------
    dict
        ``{"source": "api"|"lexicon"|"error", "data": {...}}``
    """
    url = f"{_BASE_URL}/api/courts/{court_id}"

    try:
        req = urllib.request.Request(
            url,
            headers={"Accept": "application/json", "User-Agent": "KC-MCP/1.0"},
        )
        with urllib.request.urlopen(req, timeout=_TIMEOUT_S) as resp:
            body = resp.read().decode("utf-8")
            data = json.loads(body)
            return {"source": "api", "data": data}

    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
        # ── Fallback to static lexicon ───────────────────────────────
        if _lexicon_lookup is not None:
            entry = _lexicon_lookup(court_id)
            if entry is not None:
                return {"source": "lexicon", "data": entry}

        return {
            "source": "error",
            "data": {
                "court_id": court_id,
                "error": str(exc),
                "hint": "API unreachable and court not in static lexicon.",
            },
        }


# ── MCP-compatible tool descriptor ──────────────────────────────────────

TOOL_DESCRIPTOR = {
    "name": "get_court_details",
    "description": (
        "Retrieve details (name, surface, capacity, features, narration) for a "
        "Bookit 5s Arena court by its slug or ID. Tries the live API first, "
        "then falls back to a static lexicon."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "court_id": {
                "type": "string",
                "description": "Court slug (premier, secondary, third, fourth) or MongoDB ObjectId.",
            }
        },
        "required": ["court_id"],
    },
}


# ── CLI ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    slug = sys.argv[1] if len(sys.argv) > 1 else "premier"
    result = get_court_details(slug)
    print(json.dumps(result, indent=2, default=str))
