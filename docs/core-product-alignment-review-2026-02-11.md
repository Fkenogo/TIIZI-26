# Tiizi Core Product Alignment Review

Date: 2026-02-11

## Sources Reviewed

- `docs/source-pdfs/tiizi-prd1.txt`
- `docs/source-pdfs/tiizi-ux-flows.txt`
- `docs/source-pdfs/tiizi-ui-challenge.txt`
- `docs/source-pdfs/tiizi-notifications.txt`
- `docs/source-pdfs/tiizi-tc.txt`

## Core Product Understanding (Original Spirit)

Tiizi MVP is a group-first accountability app where workouts are the social glue.

The center of gravity is:

1. Join/create a group quickly.
2. Start/join a challenge inside that group.
3. Log workouts manually every day.
4. See immediate progress in group feed/chat.
5. Reinforce consistency via streaks, milestones, and lightweight notifications.
6. Offer optional, trust-bounded support donations without locking features.

The documents repeatedly constrain scope to keep trust and engagement high:

- Group outcomes over solo optimization.
- Manual logging as a behavior feature.
- Bodyweight-first library and simple challenge structures.
- Community support and mutual aid with clear "no wallet / no payout / no money custody" boundaries.

## What Is Implemented Well

## 1) Strong group/community foundations in data and access rules

- Firestore security and role patterns align with group-centric access controls:
- `firestore.rules`
- Group/member/admin operations are structured and constrained.

## 2) Core objects and writes exist for the main loop

- The app writes/reads groups, posts, comments, workouts, join requests, and pledges:
- `context/AppContext.tsx`
- This provides a valid base for the "group -> challenge -> log -> feed" loop.

## 3) Basic donation trust boundary is represented

- Support screens include disclaimer language that Tiizi does not hold funds:
- `screens/SupportFundScreen.tsx`
- `screens/PledgeModalScreen.tsx`
- This matches the trust intent from `tiizi-tc`.

## 4) Notification substrate exists

- Per-user notifications are read from Firestore and actionable:
- `screens/NotificationsScreen.tsx`
- Mention notifications are generated from post/comment text:
- `context/AppContext.tsx`

## 5) Auth duplication has started being reduced

- Onboarding CTA routes now direct to a single auth entry screen:
- `screens/LoggingOnboardingScreen.tsx`
- `screens/CommunityOnboardingScreen.tsx`

## What Is Misaligned or Missing

## A) Scope drift is large vs MVP

- Current app routes: 89 (`types.ts`), while the documented MVP emphasizes a smaller loop.
- Many advanced/admin/exploratory screens dilute group accountability focus.

Impact:

- Higher UX complexity.
- More broken pathways risk.
- Harder to maintain quality and consistency.

## B) Core loop has weak continuity in current UX

Mismatch against `tiizi-ux-flows`:

1. Onboarding flow in docs is linear:
- welcome -> signup/login -> profile -> create/join group -> group chat -> challenge -> first workout.
2. App currently has multiple alternate jumps and rich detours, reducing "minutes-to-first-log".

## C) Group chat is mostly presentational, not the core accountability channel yet

- `screens/GroupChatScreen.tsx` is largely static/demo content.
- It does not render a live message stream with send/persist flow as the core collaborative loop.

## D) Challenge setup visual/design style diverges from minimalist/classic direction

- Heavy uppercase/italic/hero styling remains in key challenge flow:
- `screens/SetupChallengeScreen.tsx`

This conflicts with your constraints:

- Avoid large bold fonts.
- Minimize all-caps.
- Minimize italics.
- Keep minimalist/classic visual language.

## E) Mock/demo content still drives behavior

- Default seeded profile/posts/group bootstrapping and random image placeholders are still active:
- `context/AppContext.tsx`
- `screens/*` (widespread `picsum.photos`)

This makes behavior look richer than backend truth and masks gaps.

## F) Data model split between Firestore runtime and Data Connect prototype

- Runtime app uses Firestore collections/subcollections.
- `dataconnect/schema/schema.gql` is a different, simpler model and is not wired to current flows.

Impact:

- "Migrate all mock data to backend" is blocked by schema divergence.

## G) Playwright audit reliability issue observed

- Latest run `reports/playwright-audit/20260211-213651/report.md` returned connection-refused on all routes (no server reachable at `127.0.0.1:4173`), so that run is not product-valid.
- This is an environment/run-mode issue, not route-level proof.

## Document-by-Document Alignment Notes

## 1) PRD (`tiizi-prd1`)

Aligned:

- Group entities, challenge objects, logging, feed/comments, support requests/pledges exist.

Missing/weak:

- Clean MVP boundaries are not enforced.
- Relay-style and challenge-type rigor are not consistently modeled in UI states.
- Group analytics/metrics prioritization is mixed with many non-core experiences.

## 2) UX Flows (`tiizi-ux-flows`)

Aligned:

- Screens for welcome/auth/group/challenge/logging exist.

Missing/weak:

- The flow is not opinionated enough toward "first meaningful action in minutes".
- Chat as accountability center is visually present but functionally shallow.

## 3) UI Challenge (`tiizi-ui-challenge`)

Aligned:

- Challenge creation primitives and discovery concepts are present.

Missing/weak:

- Visual system consistency is uneven.
- Core tabs and route priorities are diluted by extra features.

## 4) Notifications (`tiizi-notifications`)

Aligned:

- Notification categories and read state handling exist.

Missing/weak:

- Exact timing/frequency policy from the doc is not fully encoded.
- Conservative prompting and anti-spam guardrails are not explicit in one policy layer.

## 5) Terms/Trust (`tiizi-tc`)

Aligned:

- "Tiizi does not hold funds" messaging appears in support UI.

Missing/weak:

- Trust copy should be consistently embedded in onboarding + settings + relevant transaction moments.

## Non-Breaking Realignment Plan

## Phase 0: Stabilize Audit and Baseline (1 day)

1. Lock Playwright to deterministic startup (`PLAYWRIGHT_START_SERVER=true`, strict port) and fail fast if port busy.
2. Add a "baseline core-flow" suite:
- onboarding
- login/signup
- create/join group
- join/start challenge
- log first workout
- feed + chat check
- optional pledge path
3. Generate a route health matrix from one valid run.

## Phase 1: Product Scope Compression (2-3 days)

1. Define "MVP Core Mode" nav map and route allowlist.
2. Hide non-core routes behind a feature flag (no hard deletion yet).
3. Make one canonical onboarding path:
- keep one auth entry (Login) with explicit CTA to Signup.

Deliverable:

- Core flow becomes shortest path by default without removing existing code.

## Phase 2: UX/Design Realignment (3-4 days)

1. Build a typography token scale and replace hardcoded heavy styles:
- default weight: 400/500
- headings: 600 max
- remove forced all-caps and italic for core screens
2. Refactor high-impact screens first:
- `WelcomeScreen`
- `LoginScreen`
- `SignupScreen`
- `GroupHomeScreen`
- `SetupChallengeScreen`
- `LogWorkoutScreen`
- `GroupChatScreen`
3. Keep existing color palette but simplify contrast and hierarchy to a Strava-like minimal standard.

## Phase 3: Functional Core Completion (4-6 days)

1. Make `GroupChatScreen` data-driven:
- read/write group messages from Firestore.
- system messages for challenge start, workout logs, and milestones.
2. Tighten challenge lifecycle:
- challenge creation writes canonical challenge document.
- group home/feed/chat derive from that challenge.
3. First workout loop:
- log -> progress update -> feed post -> streak update -> notification.

## Phase 4: Data Migration and Schema Alignment (3-5 days)

1. Stop runtime dependency on demo defaults for logged-in users.
2. Move seed logic to explicit one-time admin/dev migration script.
3. Decide one backend source of truth:
- Option A: Firestore-first (recommended now).
- Option B: Migrate runtime to Data Connect model.
4. Backfill mock catalog data into backend collections with idempotent scripts.

## Phase 5: Trust/Notification Policy Hardening (2-3 days)

1. Centralize notification timing/frequency policy from `tiizi-notifications`.
2. Add donation prompt throttling:
- max once per challenge
- positive-event trigger only
- easy opt-out.
3. Ensure trust copy appears at onboarding, support, and settings checkpoints.

## Recommended Immediate Priorities

1. Fix deterministic Playwright baseline run (so audit outputs are trustworthy).
2. Complete single-auth onboarding path and route simplification.
3. De-style and simplify `SetupChallengeScreen` and `GroupChatScreen` to match minimalist/classic target.
4. Convert chat from static to persisted group messages.
5. Replace implicit demo seeding with explicit migration tooling.

## Execution Update (Applied)

Implemented in this pass:

1. Core MVP route guard added:
- `utils/coreMvp.ts`
- `App.tsx`
- Non-core routes now redirect to `group_home` (signed in) or `login`.

2. Onboarding flow shortened:
- `screens/WelcomeScreen.tsx`
- Primary CTA now goes directly to `login` (`Get Started`), reducing auth-flow repetition.

3. Group chat converted from static demo to persisted Firestore messages:
- `screens/GroupChatScreen.tsx`
- Reads `groups/{groupId}/messages` in realtime and supports send/enter-submit.

4. Core group-system events now feed chat:
- `context/AppContext.tsx`
- Group creation and workout logs now post system messages to group chat.

5. Firestore rules extended for group chat:
- `firestore.rules`
- Added `match /messages/{messageId}` with member read/create and sender/admin update/delete.

6. Challenge setup visual hierarchy reduced to minimalist style and wired to group updates:
- `screens/SetupChallengeScreen.tsx`
- Reduced uppercase/italic-heavy typography.
- Challenge start now updates active group challenge metadata and posts a system message.

Validation runs:

- Build: `npm run build` passed.
- Playwright bounded core flow:
- `reports/playwright-audit/20260211-223432/report.md` (12 routes)
- `reports/playwright-audit/20260211-224848/report.md` (10 routes)

Current audit state:

- No dead links found.
- Remaining dead actions are mostly pointer interception/indexed-click audit artifacts in dense list screens (`groups_list`, `group_home`), not route navigation failures.
