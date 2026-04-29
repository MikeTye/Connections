# Connections UX + Wireframe Prototype

## Step 1 — User Thinking

### Personas
1. **Intentional Dater (Asha, 30)** — wants deeper compatibility and respectful first contact; fears screenshotting, being found by coworkers, and low-effort messages.
2. **Operator/Builder (Luis, 34)** — wants a single profile for collaborations + friendships; fears context collapse and spam outreach.
3. **Creative Generalist (Nina, 27)** — wants expressive identity beyond resume/social feed; fears judgment and loss of control over personal details.

### Top Flows
- Onboarding → profile creation: guided scaffolding with progressive modules and “visibility by section” defaults.
- Sharing profile: generate scoped link (expiry, max views, audience mode), copy/share with context preview.
- Viewing profile: calm microsite view, no swipe affordance, one intentional interaction CTA.
- Controlling visibility: one visibility matrix in editor and global policy panel for discovery/indexing/link governance.

### Product-specific UX Risks
- Users accidentally over-sharing sensitive context.
- Dating-app visual patterns causing wrong behavioral expectations.
- Forwarded links enabling stalking vectors.
- Discovery cards becoming shallow popularity surfaces.

## Step 2 — UX Structure

### Sitemap
- Home / Dashboard
  - Profile Workspace
    - Profile View Preview
    - Profile Editor
    - Visibility Matrix
  - Share Links
  - Discovery Preferences
  - Safety Center (block/report/audit)

### Navigation Model
**Two-pane workspace + utility side-nav**: keeps creation and privacy controls visible simultaneously, minimizing hidden state and reducing accidental exposure.

### Key Surfaces
- **Profile Builder**: high-intent authoring and section-level controls.
- **Shared Profile View**: polished, readable microsite for recipients.
- **Privacy Panel**: explicit “who can see this” model.
- **Controlled Discovery**: optional, low-fidelity cards with request gating.

## Step 3 — Wireframes

### A) Profile Page (Editorial Stack)
```
+------------------------------------------------+
| Identity Header + Intents + Safe CTA           |
+-------------------------------+----------------+
| About / Values / Prompts      | Interaction    |
| long-form stacked sections    | card           |
+-------------------------------+----------------+
```
Pros: storytelling depth. Cons: longer scroll.

### B) Profile Page (Modular Grid)
```
+------------------------------------------------+
| Header                                          |
+----------------+----------------+---------------+
| Values         | Looking for    | Prompts       |
+----------------+----------------+---------------+
| Notes / Media / Contact scoped blocks           |
+------------------------------------------------+
```
Pros: fast scanning. Cons: weaker narrative flow.

### C) Profile Page (Timeline Narrative)
```
Header
  |
  o Values
  |
  o Relationship to work/people
  |
  o Prompts
```
Pros: distinctive. Cons: denser interaction model.

### Editor Alternatives
1. **Inspector Right Rail** (best): live preview left, controls right.
2. **Full-page Form**: easier implementation, weaker context.
3. **Block Canvas**: powerful but higher complexity for MVP.

**Chosen:** Modular Grid profile + Inspector editor (best balance of scanability, premium feel, and safety clarity).

## Step 4 — Design Direction
- **Spacing:** 4/8pt grid, generous 16/24 section paddings.
- **Typography:** 12/14 metadata, 16 body, 24–32 headings.
- **Color:** slate/graphite base, indigo accents, avoid pink/red romance cues.
- **Motion:** 140–220ms ease-out; only for confirmations, section reveal, and mode switches.

## Step 5 — Component System
- IdentityHeader
- SectionCard / ExpandableSection
- TagIntentChip
- VisibilityControl (public/shared/discovery/private)
- ShareModule (link scope + expiry)
- EmptyState templates (first section, first link, no discovery)

States: default, hover, keyboard focus ring, locked/private mask, disabled (policy conflict).
Permission rendering: hidden sections replaced with explicit “shared selectively” placeholder.

## Step 6 — Safety + Privacy UX
- Private-by-default sections.
- “Who can view this?” matrix with per-section + global overrides.
- Expiring links, revoke link, max-view quota, optional passphrase.
- Anti-scrape: blurred preview for anonymous visitors, copy throttling cues, and authenticated discovery.
Tradeoff: stronger privacy can reduce conversion, but increases trust and long-term retention.

## Step 7 — Final UI Spec
- Mobile-first single column; desktop becomes split view.
- Persistent top trust bar with visibility mode indicator.
- One primary action in profile view: “Send thoughtful intro”.
- Editor uses immediate preview updates and clear chips for access level.
- Safety cues are ambient, not alarmist: lock icons, scoped badges, explicit share metadata.
