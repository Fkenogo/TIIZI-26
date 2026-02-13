# Tiizi UI Accessibility & Contrast Audit

Date: 2026-02-11

## 1) Contrast Issues Found

1. Low-contrast helper/secondary text (`text-slate-300`, `text-slate-400`, `text-gray-400`) on light surfaces.
2. Tiny text classes (`text-[8px]`, `text-[9px]`, `text-[10px]`) reducing readability and hierarchy.
3. White cards/fields blending into near-white page backgrounds without strong borders.
4. Button variants that looked like plain text (especially ghost/unstyled buttons).
5. Form placeholders used as pseudo-labels with weak distinction from entered values.
6. Inconsistent focus states across input/select/textarea and button/link controls.
7. Clickable cards and tappable sections lacking clear affordance (weak border/elevation cues).

## 2) Screens Affected (Audit Sample)

High-frequency issues across:

- `screens/LoginScreen.tsx`
- `screens/SignupScreen.tsx`
- `screens/GroupsListScreen.tsx`
- `screens/GroupHomeScreen.tsx`
- `screens/SupportFundScreen.tsx`
- `screens/NotificationsScreen.tsx`
- `screens/ExerciseLibraryScreen.tsx`
- `screens/GroupWorkoutPlansScreen.tsx`
- plus multiple admin/achievement/support detail screens with tiny uppercase labels.

Shared components affected:

- `components/StatsCard.tsx`
- `components/ChallengeCard.tsx`
- `components/TiiziButton.tsx`
- `components/BottomNav.tsx` (inherits global improvements)

## 3) Global Theme Changes Applied

File: `index.html`

Applied tokenized global system:

- Surface tokens: `--tiizi-bg`, `--tiizi-surface`, `--tiizi-surface-muted`
- Text tokens: `--tiizi-text-strong`, `--tiizi-text`, `--tiizi-text-muted`
- Border/focus/error tokens: `--tiizi-border`, `--tiizi-border-strong`, `--tiizi-focus`, `--tiizi-focus-ring`, `--tiizi-danger`

Global accessibility behavior:

- Stronger default text/readability.
- Form controls always visible (border + background + focus ring).
- Placeholder color tuned for distinction.
- Button focus-visible outlines and disabled-state clarity.
- Clickable rounded elements now receive stronger border/hover cues.
- Tiny text classes normalized to readable minimum.

## 4) Updated Button Style Definitions

File: `components/TiiziButton.tsx`

Changes:

- Stronger primary/secondary button contrast and border anchoring.
- Secondary/outline/ghost now visually distinct from plain text.
- Added consistent focus-visible style and disabled behavior.
- Reduced excessive boldness while preserving action hierarchy.

## 5) Updated Form Field Component

File: `components/TiiziInput.tsx` (new)

Features:

- Explicit label support (not placeholder-only).
- Built-in error state (`aria-invalid`, error text, red border).
- Helper text support.
- Consistent padding/radius/focus style.

Applied to:

- `screens/LoginScreen.tsx`
- `screens/SignupScreen.tsx`

## 6) Updated Card Component

File: `components/TiiziCard.tsx` (new)

Features:

- Consistent card surface/border/shadow.
- Optional interactive mode with hover/press state.
- Used as base in:
  - `components/StatsCard.tsx`
  - `components/ChallengeCard.tsx`

## 7) Before vs After Summary

Before:

- White-on-white blending.
- Weakly separated cards/sections.
- Ambiguous click targets.
- Inconsistent input visibility/focus.
- Tiny label text frequently unreadable.

After:

- Clearer surface separation via stronger borders + muted card backgrounds.
- Inputs are visible by default with explicit focus/error states.
- Primary/secondary actions are visibly differentiated.
- Clickable cards/buttons have stronger affordance and interaction feedback.
- Typography readability floor improved globally.
- Duplicate onboarding auth presentation removed by unifying login + signup into one auth screen (`LoginScreen`), while `/signup` now renders the same unified experience.

## 8) Remaining UX Risks

1. Some legacy screens still include dense inline styling and tiny uppercase metadata labels.
2. Catalog migration to backend requires environment auth (`GCLOUD_PROJECT` + service account path) before full de-hardcoding of all catalog-driven screens.
3. Several long-tail screens still contain hardcoded media/sample UI content and need phased backend binding.
4. Some controls are marked as "potential no-op" by crawler because they update local filter state/modals without URL change; these need semantic audit assertions per control intent.

## Verification

- Build: `npm run build` passes after changes.
- Audit run: `reports/playwright-audit/20260211-235510/report.md` shows:
  - dead actions: `0`
  - dead links: `0`
  - route navigation errors: `0`
