# Screen Alignment Review (Stitch vs Current App)

Date: Feb 11, 2026

## Scope Reviewed
- `screens/BadgeDetailModalScreen.tsx`
- `screens/SettingsScreen.tsx`
- `screens/WorkoutPlanPreviewScreen.tsx`
- `screens/TeamRootingCelebrationScreen.tsx`
- `screens/ShareProgressCardScreen.tsx`
- onboarding/auth:
- `screens/WelcomeScreen.tsx`
- `screens/LoggingOnboardingScreen.tsx`
- `screens/CommunityOnboardingScreen.tsx`
- `screens/LoginScreen.tsx`
- `screens/SignupScreen.tsx`

Playwright runs used for validation:
- `reports/playwright-audit/20260211-204806`
- `reports/playwright-audit/20260211-205515`
- `reports/playwright-audit/20260211-205551`
- `reports/playwright-audit/20260211-205618`
- `reports/playwright-audit/20260211-205638`
- `reports/playwright-audit/20260211-205701`

## Findings

1. Onboarding/auth duplication still existed in flow entry
- Problem: onboarding step routed directly to signup, creating a repeated “auth detail” feeling across onboarding.
- Fix applied:
- `screens/LoggingOnboardingScreen.tsx`: CTA now routes to `AppView.LOGIN`.
- `screens/CommunityOnboardingScreen.tsx`: CTA now routes to `AppView.LOGIN`.

2. Typography and emphasis drift vs minimalist Stitch direction
- Problem: several screens used heavy all-caps, italic, and very bold hierarchy, making UI feel loud/basic instead of classic/minimal.
- Fix applied:
- `screens/BadgeDetailModalScreen.tsx`: reduced uppercase/italic usage, lighter heading/button hierarchy.
- `screens/TeamRootingCelebrationScreen.tsx`: reduced aggressive caps/italics, normalized weights and tracking.
- `screens/ShareProgressCardScreen.tsx`: normalized label/title weights and casing, reduced visual noise.
- `screens/LoginScreen.tsx` + `screens/SignupScreen.tsx`: cleaner auth card treatment and lighter typography.

3. Interaction alignment defects found by Playwright
- Problem: close controls in some modal-like screens had clickability issues under automation due layering/viewport placement.
- Evidence:
- `team_rooting_celebration`: dead action on close in run `20260211-205618`.
- `badge_detail_modal`: dead action on close in run `20260211-205701`.
- Fix applied:
- `screens/TeamRootingCelebrationScreen.tsx`: close control moved to higher z-index layer.
- `screens/BadgeDetailModalScreen.tsx`: modal gets bounded scroll (`max-h` + `overflow-y-auto`), close button changed to sticky in-viewport placement.

4. Design consistency status (post-fix)
- `SettingsScreen` and `WorkoutPlanPreviewScreen`: largely aligned with minimal structure and readable hierarchy.
- `ShareProgressCard` and celebration/badge overlays: now closer to the expected visual language and less “template-heavy”.

## Playwright Result Snapshot

- Focus onboarding/auth (`20260211-204806`):
- Routes: 8
- Dead links: 0
- Route nav errors: 0
- Remaining dead actions mostly from pointer interception in dense list/feed contexts.

- Focus target screens:
- `settings` + `group_privacy_settings` (`20260211-205515`): clean run
- `workout_plan_preview` (`20260211-205551`): clean run
- `share_progress_card` (`20260211-205638`): clean run
- `team_rooting_celebration` (`20260211-205618`): close-action defect fixed in code
- `badge_detail_modal` (`20260211-205701`): close-action defect fixed in code

## Proposed Next Fix Wave

1. Improve feed/list click reliability in audit
- Add toast/overlay auto-dismiss in Playwright audit to reduce pointer interception false positives.

2. Normalize bottom-nav and chip controls
- Standardize selected/unselected states and spacing on `groups_list`, `group_home`, `challenges_list`, `group_feed`.

3. Complete full-route visual parity pass
- Run full route crawl with updated interaction handling, then patch remaining outlier screens.
