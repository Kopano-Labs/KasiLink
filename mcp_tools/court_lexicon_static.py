#!/usr/bin/env python3
"""
Static court narration for KC / MCP when Atlas or Next.js is unreachable.

Authoritative prices and names still live in MongoDB (``Court`` model). Use
this only as a fallback for offline KC broadcasts or static MCP context where
the API is unavailable.

Maintained by: Kopano Context Event Broker
Last synced:   2026-05-10
"""

from __future__ import annotations

from typing import Dict, Any

# ── Court Lexicon ────────────────────────────────────────────────────────
# Keys match the ``slug`` field used by GET /api/courts/:id on fivesarena.com.
# Values are narration-safe summaries; NOT billing-authoritative.

COURT_LEXICON: Dict[str, Dict[str, Any]] = {
    "premier": {
        "display_name": "Premier Court",
        "slug": "premier",
        "surface": "FIFA-quality artificial turf",
        "dimensions": "40m × 25m",
        "capacity_players": 10,
        "floodlights": True,
        "features": [
            "Full-size goals with professional nets",
            "Perimeter boarding",
            "LED floodlights (evening bookings)",
            "Spectator seating (covered)",
        ],
        "narration": (
            "Our flagship Premier Court features FIFA-quality artificial turf, "
            "full-size goals, perimeter boarding, and LED floodlights for evening "
            "sessions. Ideal for league matches and corporate events."
        ),
    },
    "secondary": {
        "display_name": "Secondary Court",
        "slug": "secondary",
        "surface": "Artificial turf",
        "dimensions": "35m × 22m",
        "capacity_players": 10,
        "floodlights": True,
        "features": [
            "Standard goals with nets",
            "Perimeter boarding",
            "Floodlights",
            "Adjacent warm-up area",
        ],
        "narration": (
            "The Secondary Court offers high-quality artificial turf with "
            "floodlights and perimeter boarding. A versatile pitch for regular "
            "5-a-side matches and training sessions."
        ),
    },
    "third": {
        "display_name": "Third Court",
        "slug": "third",
        "surface": "Artificial turf",
        "dimensions": "30m × 20m",
        "capacity_players": 10,
        "floodlights": True,
        "features": [
            "Standard goals",
            "Floodlights",
            "Great for casual games",
        ],
        "narration": (
            "Third Court is a compact, floodlit pitch perfect for casual "
            "kick-abouts and smaller group bookings."
        ),
    },
    "fourth": {
        "display_name": "Fourth Court",
        "slug": "fourth",
        "surface": "Artificial turf",
        "dimensions": "30m × 20m",
        "capacity_players": 10,
        "floodlights": False,
        "features": [
            "Standard goals",
            "Daytime-only (no floodlights)",
            "Budget-friendly option",
        ],
        "narration": (
            "Fourth Court is our most accessible pitch — open during daylight "
            "hours with standard goals. A great budget-friendly option for "
            "afternoon games."
        ),
    },
}

# ── Helper functions ─────────────────────────────────────────────────────

def get_narration(slug: str) -> str:
    """Return the offline narration string for a court slug, or a fallback."""
    court = COURT_LEXICON.get(slug)
    if court:
        return court["narration"]
    return f"Court '{slug}' is not in the static lexicon. Query the live API."


def get_all_slugs() -> list[str]:
    """Return all known court slugs."""
    return list(COURT_LEXICON.keys())


def lookup(slug: str) -> Dict[str, Any] | None:
    """Return full lexicon entry or ``None``."""
    return COURT_LEXICON.get(slug)


# ── CLI smoke test ───────────────────────────────────────────────────────

if __name__ == "__main__":
    import json
    print(json.dumps(COURT_LEXICON, indent=2, default=str))
    print(f"\nSlugs: {get_all_slugs()}")
    for s in get_all_slugs():
        print(f"\n[{s}] {get_narration(s)}")
