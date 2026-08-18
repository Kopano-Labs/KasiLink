# KasiLink Gig CREATE — KPGS Progressive Update Pilot

**Authority:** `RobynAwesome/Introduction-to-MCP@70f40324978ee8c3c1a8a77a29e6ac84c7f6bf3a`  
**Canonical contract:** `governance/kpgs-vnext/progressive-updates/README.md`  
**Machine schema:** `governance/kpgs-vnext/progressive-updates/progressive-update.schema.json`  
**Runtime reference:** `kopano-core/kopano/swfus_engine.py`

KasiLink adapts its existing Next.js + MongoDB gig creation path. It does not define a second KPGS authority and it does not require legacy clients to migrate immediately.

```text
EVERYDAY USER / PROVIDER
        ↓
existing POST /api/gigs
        ↓
optional progressive_update envelope
        ↓
APU GREEN
        ↓
Progressive Update
        ↓
#NB
        ↓
bounded CRUD: CREATE
        ↓
Gig.create(...)
        ↓
local APPLIED receipt
        ↓
DISTRIBUTION = NOT_REACHED
```

The canonical stage order is preserved:

```text
TELEMETRY
→ CLASSIFICATION
→ ROUTING
→ PROTOCOL_SELECTION
→ INVARIANT_AUDIT
→ POC_FOC_CHECK
→ STATE_UPDATE
→ DISTRIBUTION
```

## Compatibility

A request without `progressive_update` follows the pre-existing authenticated `createGig({ userId, body })` path and receives the legacy `{ gig }` response. KasiLink does not fabricate a KPGS receipt for that path.

A governed request sends the same gig fields plus `progressive_update`. The route removes the governance envelope before calling the existing gig service, so provider/profile validation and the existing `Gig.create()` implementation remain domain-owned.

## Mutation admission

A governed gig CREATE reaches the service only when the envelope proves:

- schema `kpgs.progressive-update.v1`;
- operation `CREATE`;
- APU `GREEN`;
- literal boundary marker `#NB`;
- `authority_effect="none"`;
- admitted non-authoritative state class;
- `invariant_passed=true`;
- `poc_validated=true`;
- `foc_detected=false`;
- at least one evidence reference;
- exact canonical source SHA pinned above.

`YELLOW` is held. `RED` or FOC is rejected. Missing POC evidence is held. Authority widening, constitutional/authoritative state classes, wrong operation, wrong schema, wrong `#NB`, or a stale canonical SHA are rejected before `createGig()` is called.

## Distribution boundary

This pilot has no governed downstream SWFUS distribution sink. Therefore successful MongoDB persistence yields:

```text
STATE_UPDATE = PASS
DISTRIBUTION = NOT_REACHED
synchronized = false
canonical_authority_changed = false
```

This is deliberate. MongoDB persistence is a bounded application consequence; it is not proof that any cross-domain framework, renter, notification system, payment rail, employment authority, or external party received the gig.

## Live / virtual adaptation

KasiLink can progressively add this envelope to live provider flows without a flag-day backend rewrite. The user-facing form remains the domain experience; governance is carried as an opt-in mutation envelope and receipted response. Future realtime transports may improve responsiveness, but transport cannot grant authority or manufacture distribution proof.

## Proof ceiling

The pilot may claim only what the exact-head CI proves: legacy compatibility, governance blocking before mutation, admitted bounded CREATE, canonical stage receipts, and no fabricated distribution. It does not prove estate-wide SWFUS, production traffic, provider employment outcomes, payments, or canonical cross-domain truth.
