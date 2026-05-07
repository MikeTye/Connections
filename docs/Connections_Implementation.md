# Connections Implementation Plan (AI-Execution Ready)

Last updated: May 7, 2026

## 1) Purpose
This document converts `docs/Connections_PRD.md` into an execution plan that AI agents can implement **feature-by-feature** and **page-by-page**, while preserving the existing visual system in the current `styles/` folder.

It also incorporates beneficial product ideas from `docs/Signal_PRD_v1.1.md` where they fit Connections goals.

---

## 2) What to borrow from Signal PRD (and how to adapt)

### Keep / Add to Connections MVP+
1. **Intent-first connection flow (Capsule-like states)**
   - Add user-selectable "Intent States" (e.g., Friendship, Dating, Networking, Collaboration) with optional prompts.
   - Use these states to structure intros and reduce low-quality requests.

2. **Deliberate friction before contact**
   - Require structured intro answers before a connection request is submitted (instead of swipe/like patterns).

3. **Expiring, revocable share links with constrained access**
   - Preserve existing share-link feature but add stricter defaults: expiry, revocation, max-views, optional auth-gated view.

4. **No addictive engagement loops**
   - Explicitly avoid infinite scroll, streak mechanics, and algorithmic ranking in UX implementation.

5. **Private analytics focused on conversion funnel**
   - Track flow: link opened -> profile partial/full view -> intro submitted -> accepted/declined.
   - Keep analytics aggregated/privacy-safe.

6. **Off-platform continuation by design (optional policy toggle)**
   - After acceptance, support controlled reveal of chosen contact method.

### Do NOT add in this phase
- Vendor marketplace monetization flow.
- Public discovery feed or engagement optimization.
- In-platform real-time chat unless approved as a later phase.

---

## 3) Guardrails for all agents

1. **Design system guardrail**
   - Reuse existing tokens/components from `styles/` first.
   - Only add new UI primitives when there is no equivalent.
   - New components must map to existing spacing, typography, color, radius, motion, and breakpoint conventions.

2. **Architecture guardrail**
   - Keep JWT auth, PostgreSQL, React/Node assumptions from PRD.
   - Favor additive schema changes with backward compatibility.

3. **Safety/privacy guardrail**
   - Private-by-default profile visibility.
   - No public directory without explicit discoverability enablement.
   - Blocking/reporting enforcement at API and UI layers.

4. **Execution guardrail**
   - Implement in vertical slices: data model -> API -> page UI -> validation -> telemetry.

---

## 4) Delivery sequence (feature-by-feature)

## Feature 1 — Foundation hardening
**Goal:** Stabilize baseline for all later work.

### Scope
- Validate auth/session paths.
- Confirm profile creation/edit/view lifecycle.
- Confirm current style primitives and document gaps.

### Implementation tasks
- Audit existing endpoints and page routes against `Connections_PRD.md` MVP list.
- Add missing shared validators for profile payloads and visibility settings.
- Add style inventory in docs (which primitives exist and which are missing).

### Acceptance criteria
- Core profile flow works end-to-end in local app.
- Validation errors are consistent and structured.
- No new style divergence introduced.

---

## Feature 2 — Intent States (Capsules-lite)
**Goal:** Let users declare what they are open to right now.

### Data model
- Add `intent_states` table (or profile-scoped JSON model if project prefers) with:
  - `id`, `profile_id`, `intent_type`, `title`, `description`, `is_active`, `created_at`, `updated_at`
- Add `intent_prompts` child records (1-3 prompts per intent state).

### API
- `POST /profile/intents`
- `PATCH /profile/intents/:id`
- `GET /profile/:slug/intents` (respect visibility/auth)
- `POST /profile/intents/:id/prompts`

### UI pages/components
- **Page:** Profile Edit -> Intent States section
- **Page:** Public/Shared Profile View -> Active Intent cards
- **Component additions (if missing in styles):** IntentCard, PromptList, StatusPill

### Acceptance criteria
- User can create/edit/deactivate intents.
- Viewer sees only active, permitted intents.
- Prompt constraints enforced (count + length).

---

## Feature 3 — Structured Intro (Invite-Purgatory equivalent)
**Goal:** Raise interaction quality via deliberate pre-request flow.

### Flow
1. Viewer opens share/discovery profile.
2. Viewer sees partial profile + active intent prompts.
3. Viewer submits structured intro answers.
4. Owner receives request with context and can accept/decline/ignore/block/report.

### Data model
- Extend `interactions` payload schema with:
  - `intent_state_id`, `prompt_answers[]`, `request_context`

### API
- `POST /interactions/structured-intro`
- `GET /interactions/inbox`
- `PATCH /interactions/:id/status`

### UI pages/components
- **Page:** Structured Intro form
- **Page:** Inbox/Requests queue
- **Component additions:** PromptAnswerField, RequestReviewCard, ModerationActions

### Acceptance criteria
- No swipe-like action exists.
- Intro cannot be submitted without required answers.
- Owner actions update state and permissions immediately.

---

## Feature 4 — Share Link controls v2
**Goal:** Improve portable sharing with tighter control.

### Data model/API
- Ensure share links support:
  - Expiration datetime
  - Max views
  - Revocation
  - Access scope (full/limited/custom)
  - Optional auth-required viewer gate

### UI pages/components
- **Page:** Share Link manager
- **Component additions:** ExpiryPicker, AccessScopeSelector, LinkHealthBadge

### Acceptance criteria
- Revoked/expired links are blocked by backend.
- View count and usage metadata update correctly.
- User can regenerate links safely.

---

## Feature 5 — Discovery and visibility controls
**Goal:** Keep discovery controlled and privacy-safe.

### Scope
- Authenticated, filter-based discovery only.
- Respect visibility flags at query and response layers.

### API/UI
- Discovery endpoint only returns minimal cards.
- Search filters: city/region (coarse), interests, intent type.
- Profile cards exclude hidden fields by default.

### Acceptance criteria
- Undiscoverable profiles never appear in search.
- Block relationships are enforced in discovery and profile access.

---

## Feature 6 — Safety layer completion
**Goal:** Fully operational block/report/moderation basics.

### Scope
- Harden existing `user_blocks` and `reports` workflows.
- Add moderation queue UX if absent.

### UI pages/components
- **Page:** Report submission modal/page
- **Page:** Basic admin moderation queue
- **Components:** ReportReasonSelector, SafetyBanner, BlockStateNotice

### Acceptance criteria
- Blocked users cannot search/view/interact.
- Reports are persisted with auditable status transitions.

---

## Feature 7 — Privacy-safe analytics
**Goal:** Provide user-facing conversion insights without invasive tracking.

### Metrics
- Link opens
- Partial/full profile views
- Structured intro submitted
- Accept/decline rates by intent state

### UI
- **Page:** Profile analytics dashboard
- **Components:** FunnelChart, IntentPerformanceTable

### Acceptance criteria
- Aggregated analytics only.
- No exact viewer identity leakage by default.

---

## 5) Page-by-page implementation map

## Page A — Auth (Sign up / Sign in)
- Validate email/password, verification state, status checks.
- Route to onboarding if profile missing.

## Page B — Onboarding / Profile Setup
- Collect headline, bio, intent baseline, core interests.
- Enforce minimum completion threshold.

## Page C — Profile Editor
- Sections: Bio, Interests, Values, Media, Intent States, Visibility.
- Per-section visibility controls.
- Save as draft/published.

## Page D — Profile View (Owner)
- Full preview with visibility annotations.
- Quick actions: generate share link, edit visibility, pause profile.

## Page E — Profile View (Viewer via share/discovery)
- Render only permitted fields.
- Entry point to Structured Intro.

## Page F — Structured Intro
- Prompt response form tied to active intent state.
- Submit request with validation and rate-limits.

## Page G — Inbox / Requests
- Triage actions: accept, decline, ignore, block, report.
- Decision history and request context.

## Page H — Share Link Manager
- Create/revoke links, set expiry/max views/scope.
- Show usage status.

## Page I — Discovery
- Auth-only filtered search; minimal result cards.
- Respect block + visibility constraints.

## Page J — Safety / Reports
- Submit report with type + description + evidence references.
- View own report statuses.

## Page K — Admin Moderation (basic)
- Queue with filters, status changes, and reviewer notes.

## Page L — Analytics
- Conversion funnel and intent-state performance.

---

## 6) Component expansion plan (style-system aligned)

Add only if missing from current `styles/` primitives:
- Cards: `IntentCard`, `RequestCard`, `AnalyticsCard`
- Inputs: `PromptAnswerField`, `TagSelector`, `ExpiryPicker`
- Feedback: `SafetyBanner`, `StatusPill`, `InlineValidation`
- Data display: `FunnelChart`, `MetricTile`, `EmptyState`

For each new component:
1. Bind colors/spacing/typography to existing design tokens.
2. Provide light/dark (if theme supports it).
3. Include accessibility states (focus, error, disabled).

---

## 7) Agent execution template (repeat for each feature)

For every feature above, agents should execute in this exact order:
1. **Schema changes** (migration + rollback)
2. **Backend contracts** (request/response schemas)
3. **API handlers/services**
4. **Authorization/privacy checks**
5. **UI components/pages**
6. **Instrumentation/analytics events**
7. **Tests** (unit + integration + critical UI path)
8. **Docs update** (API + user flow)

Definition of done per feature:
- All acceptance criteria met.
- No style token violations.
- No privacy/safety regression.
- Feature flags removed or documented.

---

## 8) Milestones

- **Milestone 1:** Foundation + Intent States
- **Milestone 2:** Structured Intro + Inbox
- **Milestone 3:** Share Links v2 + Discovery hardening
- **Milestone 4:** Safety + Analytics + Admin basics

Each milestone should ship with a short changelog and updated implementation checklist.
