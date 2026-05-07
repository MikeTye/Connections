# SIGNAL | Product Requirements Document | Confidential

# SIGNAL
## Portable Identity Platform for Intentional Human Connection

## Product Requirements Document
**Version 1.1 | Confidential**  
May 2026

For Investors & Co-Founders

---

# 1. Executive Summary

Signal is a privacy-first, portable identity platform that enables intentional, high-signal human connections. It is not a dating app, not a social network, and not a messaging platform. Signal is a controlled identity exchange system — a modern introduction layer built for people who have grown distrustful of algorithmic feeds, infinite scroll, and engagement-optimized social products.

Users build a rich personal microsite, define dynamic intent states called Capsules (e.g. “open to new friendships,” “looking for a running partner,” “happy to meet people who share my interests”), and share access via expiring QR codes or links. Viewers must express intent before gaining access. Owners approve or reject requests. If approved, the viewer receives the owner's chosen contact method — and both parties continue the relationship entirely off-platform.

Signal is deliberately low-frequency, non-addictive, and high-trust. It is designed for the way real relationships actually begin: with context, consent, and intention.

## The Problem Signal Solves

Dating apps are gamified, profile-locked, and algorithmically exhausting. Social networks are discovery-first and privacy-last. Neither is designed for a single, intentional introduction — the moment that actually starts a real relationship. Meanwhile, governments are restricting social media access; loneliness is a declared public health crisis; and dating app fatigue is at an all-time high. There is a gap between “no app” and “always-on social surveillance” — and Signal fills it.

---

# 2. Market Context & Opportunity

## 2.1 Macro Tailwinds

1. Social media bans expanding globally
2. Loneliness epidemic
3. Dating app fatigue
4. Rising demand for privacy-first products
5. Post-pandemic recalibration toward intentional relationships

## 2.2 The Gap in the Market

Existing products fail because they confuse discovery with connection. Dating apps optimize for swipe volume. Social networks optimize for engagement. None are designed to facilitate a single, high-quality introduction with mutual intent.

| Product Type | What Signal Replaces |
|---|---|
| Dating apps | Portable, intent-gated matching |
| Social media | Identity sharing without feeds |
| Event networking apps | Portable identity beyond events |
| Linktree/business cards | Dynamic privacy-aware identity exchange |

## 2.3 Target Users

1. Adults seeking genuine friendships
2. Singles avoiding swipe culture
3. People with niche interests and values
4. Introverts and neurodiverse individuals
5. Users in regions with declining social media trust
6. People exhausted by algorithmic social products

---

# 3. Product Vision & Principles

## Mission

Replace low-trust, high-noise social discovery with a deliberate, consent-driven introduction layer.

## Vision

A world where meaningful relationships begin with mutual intent and context — not algorithms.

## 3.1 Design Principles

1. Intentional over impulsive
2. High-signal over high-volume
3. Privacy-first over visibility-first
4. Off-platform by design
5. Non-addictive by architecture

---

# 4. Core Product Features

## 4.1 Profile (The Microsite)

Each user builds a portable identity microsite including:

- Bio and narrative
- Interests and values
- Media uploads
- Approved endorsements
- Chosen off-platform contact method

### Key Distinction

Profiles are not searchable, indexed, or publicly browsable.

## 4.2 Capsules (Intent States)

Capsules represent what a user is open to right now.

Each Capsule contains:

- Title
- Intent type
- Description
- 1–3 screening prompts

Capabilities:

- Activate/deactivate anytime
- Multiple capsules simultaneously
- Share-link specific

## 4.3 Share Links & QR Codes

- Time-limited links
- Expire 3 hours after first open
- Tied to active Capsules
- Single-use intentional sharing mechanism

## 4.4 Invite-Purgatory Flow

| Step | What Happens | Intent |
|---|---|---|
| Auth | Viewer logs in | Accountability |
| Partial View | Limited profile shown | Curiosity without exposure |
| Answer Prompts | Viewer answers questions | Intentional engagement |
| Review Stage | Viewer reviews answers | Self-selection |
| Submit Request | Request sent to owner | Context-rich approval |

## 4.5 Owner Decision

Owners can:

- Accept
- Reject
- Ignore

No in-platform messaging exists.

## 4.6 Endorsements

- Max 20 words
- Relationship context required
- Private by default
- Owner approval required

## 4.7 Contact Graph

Private log of accepted introductions.

## 4.8 Profile Stats

Private analytics:

- Link → View
- View → Request
- Acceptance rates
- Capsule performance

---

# 5. Vendor Marketplace & Monetization

## 5.1 Model

Signal monetizes through a vendor subscription marketplace.

## 5.2 User Flow

1. User opts into rewards
2. Approved connection triggers offer
3. User continues off-platform

## 5.3 Vendor Flow

- Vendor configures webhook
- Signal POSTs minimal user payload
- Vendor handles automation independently

## 5.4 Shared Data

| Data Field | Notes |
|---|---|
| Display name | User-defined |
| Contact method | Chosen by user |
| Capsule type | Broad intent category |
| Match timestamp | Sequencing support |

No behavioral or profile data shared.

## 5.5 Vendor Matching Phases

| Phase | Logic |
|---|---|
| Phase 1 | Broad matching |
| Phase 2 | Intent-type matching |
| Phase 3 | Geo/category matching |

## 5.6 Vendor Subscription Tiers

| Tier | Monthly Fee | Features |
|---|---|---|
| Starter | $99 | 200 deliveries |
| Growth | $499 | Intent targeting |
| Scale | $1499 | Unlimited + API |

## 5.7 Additional Revenue Streams

- Premium subscriptions
- Verified badges
- API licensing
- White-label licensing

---

# 6. Privacy, Ethics & Trust Architecture

## 6.1 Hard Privacy Constraints

1. No public directory
2. No full public profiles
3. Minimal tracking
4. No data sales
5. Expiring links

## 6.2 Abuse Mitigation

| Risk | Mitigation |
|---|---|
| Spam | Auth requirements |
| Harassment | No messaging |
| Link abuse | Expiry logic |
| Scraping | No public surfaces |

## 6.3 Regulatory Posture

- GDPR/CCPA alignment
- Age verification
- Right to erasure

---

# 7. UX & Design Philosophy

## 7.1 Rejected Patterns

- Infinite scroll
- Streaks
- Engagement addiction
- Algorithmic ranking

## 7.2 Preferred Patterns

- Progressive disclosure
- Deliberate friction
- Calm technology

## 7.3 Onboarding

Onboarding must:

1. Explain what Signal is NOT
2. Walk through Capsule creation
3. Simulate invite-purgatory
4. Require an active Capsule

---

# 8. Technical Architecture

## 8.1 Principles

- Mobile-first PWA
- Stateless links
- Encrypted data
- Minimal collection

## 8.2 Core Components

| Component | Description |
|---|---|
| Identity Service | Auth & profiles |
| Capsule Engine | Capsule management |
| Link Service | Link lifecycle |
| Request Queue | Request handling |
| Notification Service | Alerts |
| Vendor Webhook Service | Vendor integrations |
| Analytics Service | Metrics aggregation |

## 8.3 Vendor Webhooks

- HTTPS endpoints
- Retry logic
- Shared-secret authentication

## 8.4 Key Technical Decisions

1. First-open-triggered expiry
2. Permission-segmented profile data
3. No vendor access to internal IDs

---

# 9. Go-To-Market & Roadmap

## Phase 0 (Months 1–3)

- Core profile system
- Capsules
- Share links
- Invite-purgatory flow

## Phase 1 (Months 4–6)

- Closed beta
- Endorsements
- Vendor onboarding

## Phase 2 (Months 7–12)

- Public launch
- Premium plans
- Mobile apps

## Phase 3 (Months 13–24)

- Advanced targeting
- White-label licensing
- International expansion

---

# 10. Success Metrics

## User Health

| Metric | Target |
|---|---|
| Link → View | >60% |
| View → Request | >25% |
| Request → Acceptance | >40% |
| Successful connections | >50% |
| D30 retention | >35% |

## Vendor Marketplace

| Metric | Target |
|---|---|
| Paying vendors | 50+ |
| Opt-in rate | >65% |
| Delivery success | >98% |
| Vendor MRR | >$25K |

## Anti-Metrics

- Session length
- DAU obsession
- Notification opens
- Feed depth

---

# 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Cold start | Portable sharing model |
| Too much friction | Guided onboarding |
| Marketplace chicken-and-egg | Broad early targeting |
| Mispositioning as dating app | Explicit onboarding |
| Regulatory risk | Privacy-first architecture |

---

# 12. What We Are Looking For

## Co-Founder Needs

- Technical co-founder
- Growth/GTM co-founder

## Investor Fit

- Consumer/privacy-tech investors
- Marketplace/community product angels
- Long-term aligned capital

## Why Now

The mainstream social model is fragmenting. Signal positions itself as the trust-first alternative.

---

# Appendix: Glossary

| Term | Definition |
|---|---|
| Capsule | User-defined intent state |
| Invite-Purgatory | Multi-step request flow |
| Share Link | Expiring Capsule link |
| Connection | Approved introduction |
| Endorsement | Approved testimonial |
| Partial View | Limited profile preview |
| Full View | Approved profile access |
| Contact Graph | Private connection log |
| Vendor Offer | Reward offer |
| Webhook | Vendor HTTPS endpoint |

---

**Signal — Confidential. Not for distribution without permission.**
