#!/usr/bin/env python3
"""
Poll ``broadcast_queue`` and retry Whin2 sends when connectivity returns.

Stdlib-only — no pip dependencies. Designed for the IdeaPad local vault.

Env vars (all required)
-----------------------
KC_BROADCAST_DB   Absolute path to the SQLite file (e.g. E:\\kopano-vault\\broadcast_queue.db)
WHIN2_API_KEY     RapidAPI key for the whin2 endpoint
WHIN2_API_HOST    RapidAPI host header  (default: whin2.p.rapidapi.com)
WHIN2_SEND_URL    Full POST URL          (default: https://whin2.p.rapidapi.com/send)

Usage
-----
    # One-shot poll (cron / Task Scheduler):
    python broadcast_queue_worker.py

    # Continuous loop (foreground, Ctrl-C to stop):
    python broadcast_queue_worker.py --loop --interval 120
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from typing import Tuple

# ── Logging ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
log = logging.getLogger("bq_worker")


# ── Environment helpers ──────────────────────────────────────────────────

def _require_env(name: str, default: str | None = None) -> str:
    val = os.environ.get(name, default)
    if not val:
        log.critical("Missing required env var: %s", name)
        sys.exit(1)
    return val


def _require_whin2_env() -> Tuple[str, str, str]:
    """Return (api_key, api_host, send_url) or exit."""
    key = _require_env("WHIN2_API_KEY")
    host = _require_env("WHIN2_API_HOST", "whin2.p.rapidapi.com")
    url = _require_env("WHIN2_SEND_URL", "https://whin2.p.rapidapi.com/send")
    return key, host, url


# ── Whin2 POST ───────────────────────────────────────────────────────────

def _post_whin2(payload_json: str) -> Tuple[bool, str]:
    """
    POST ``payload_json`` to Whin2.

    Returns (success: bool, detail: str).
    """
    key, host, url = _require_whin2_env()

    # Validate JSON before sending
    try:
        _ = json.loads(payload_json)
    except (json.JSONDecodeError, TypeError) as exc:
        return False, f"Bad JSON in queue row: {exc}"

    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
    }

    req = urllib.request.Request(
        url,
        data=payload_json.encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            code = resp.getcode()
            body = resp.read().decode("utf-8", errors="replace")
        if 200 <= code < 300:
            return True, f"HTTP {code}"
        return False, f"HTTP {code}: {body[:200]}"
    except urllib.error.HTTPError as exc:
        return False, f"HTTPError {exc.code}: {exc.reason}"
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return False, f"Network error: {exc}"


# ── Worker loop ──────────────────────────────────────────────────────────

def _poll_once(db_path: str) -> int:
    """
    Process all PENDING rows once. Returns count of rows attempted.
    """
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    rows = conn.execute(
        """
        SELECT id, payload_json, phone, event_type, retry_count, max_retries
        FROM   broadcast_queue
        WHERE  status = 'PENDING'
        ORDER  BY created_at ASC
        LIMIT  50
        """
    ).fetchall()

    if not rows:
        log.info("Queue empty — nothing to send.")
        conn.close()
        return 0

    log.info("Found %d pending message(s).", len(rows))

    for row in rows:
        row_id = row["id"]
        retries = row["retry_count"]
        max_r = row["max_retries"]

        # Mark as SENDING to prevent double-pick in concurrent runs
        conn.execute(
            "UPDATE broadcast_queue SET status = 'SENDING', updated_at = datetime('now') WHERE id = ?",
            (row_id,),
        )
        conn.commit()

        ok, detail = _post_whin2(row["payload_json"])

        if ok:
            conn.execute(
                """
                UPDATE broadcast_queue
                SET    status      = 'SENT',
                       last_error  = NULL,
                       sent_at     = datetime('now'),
                       updated_at  = datetime('now')
                WHERE  id = ?
                """,
                (row_id,),
            )
            log.info(
                "SENT  id=%d phone=%s event=%s (%s)",
                row_id, row["phone"], row["event_type"], detail,
            )
        else:
            new_count = retries + 1
            new_status = "FAILED" if new_count >= max_r else "PENDING"
            conn.execute(
                """
                UPDATE broadcast_queue
                SET    status      = ?,
                       retry_count = ?,
                       last_error  = ?,
                       updated_at  = datetime('now')
                WHERE  id = ?
                """,
                (new_status, new_count, detail, row_id),
            )
            log.warning(
                "%s id=%d phone=%s retry=%d/%d — %s",
                new_status, row_id, row["phone"], new_count, max_r, detail,
            )

        conn.commit()

    conn.close()
    return len(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Kopano broadcast queue worker")
    parser.add_argument("--loop", action="store_true", help="Run continuously")
    parser.add_argument(
        "--interval", type=int, default=120,
        help="Seconds between polls in loop mode (default: 120)",
    )
    args = parser.parse_args()

    # Validate env early
    db_path = _require_env("KC_BROADCAST_DB")
    _require_whin2_env()

    if not os.path.isfile(db_path):
        log.critical("Database not found: %s — run setup_broadcast_queue.sql first.", db_path)
        sys.exit(1)

    log.info("Worker starting — db=%s loop=%s interval=%ds", db_path, args.loop, args.interval)

    if args.loop:
        try:
            while True:
                _poll_once(db_path)
                time.sleep(args.interval)
        except KeyboardInterrupt:
            log.info("Interrupted — exiting cleanly.")
    else:
        _poll_once(db_path)

    log.info("Worker done.")


if __name__ == "__main__":
    main()
