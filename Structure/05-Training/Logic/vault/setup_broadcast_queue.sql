-- ============================================================================
-- Kopano Context — Broadcast Retry Queue (SQLite)
-- ============================================================================
-- Offline-first: queue Whin2 payloads when RapidAPI fails (IdeaPad / local vault).
-- Apply with: sqlite3 "%KC_BROADCAST_DB%" < setup_broadcast_queue.sql
--
-- Env:  KC_BROADCAST_DB  — absolute path to the SQLite file on E:\
--       e.g.  E:\kopano-vault\broadcast_queue.db
-- ============================================================================

-- ── Main table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS broadcast_queue (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Whin2 payload (JSON string ready to POST)
    payload_json    TEXT    NOT NULL,

    -- Destination phone number (E.164, e.g. +27...)
    phone           TEXT    NOT NULL,

    -- Human-readable context tag: 'booking_confirm', 'fixture_reminder', etc.
    event_type      TEXT    NOT NULL DEFAULT 'generic',

    -- Lifecycle
    status          TEXT    NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'SENDING', 'SENT', 'FAILED')),
    retry_count     INTEGER NOT NULL DEFAULT 0,
    max_retries     INTEGER NOT NULL DEFAULT 5,

    -- Error detail from last attempt (nullable)
    last_error      TEXT,

    -- Timestamps (ISO-8601 / SQLite datetime strings)
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    sent_at         TEXT
);

-- ── Index for the worker poll ───────────────────────────────────────────
-- The worker queries:  WHERE status = 'PENDING' ORDER BY created_at ASC
CREATE INDEX IF NOT EXISTS idx_bq_pending
    ON broadcast_queue (status, created_at)
    WHERE status = 'PENDING';

-- ── Optional: index on event_type for analytics / KC dashboards ─────────
CREATE INDEX IF NOT EXISTS idx_bq_event_type
    ON broadcast_queue (event_type);
