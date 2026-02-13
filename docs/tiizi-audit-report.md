# Tiizi Audit Report (Feb 11, 2026)

## 1) Full Route Map

### Router paths
- `/` -> redirects to `/welcome`
- `/profile/:userId`
- `/profile/:userId/followers`
- `/profile/:userId/following`
- `/:view` where `:view` is one of:
- `/welcome`
- `/onboarding_logging`
- `/onboarding_community`
- `/login`
- `/signup`
- `/profile_setup`
- `/groups_list`
- `/group_home`
- `/group_chat`
- `/log_workout`
- `/support_fund`
- `/challenge_complete`
- `/challenges_list`
- `/create_challenge_type`
- `/create_challenge_exercise`
- `/create_challenge_duration`
- `/create_challenge_details`
- `/setup_challenge`
- `/exercise_library`
- `/group_feed`
- `/leaderboard`
- `/profile`
- `/pledge_modal`
- `/pledge_recorded`
- `/donation_thank_you`
- `/settings`
- `/exercise_detail`
- `/notifications`
- `/priority_alerts`
- `/discover`
- `/admin_dashboard`
- `/admin_engagement`
- `/admin_moderation`
- `/report_member`
- `/community_resources`
- `/help_center`
- `/edit_profile`
- `/group_workout_plans`
- `/workout_plan_preview`
- `/select_group_for_plan`
- `/workout_plan_roadmap`
- `/month_in_review`
- `/shareable_report`
- `/celebration`
- `/group_invite_landing`
- `/group_privacy_settings`
- `/share_invite`
- `/consistency_wins`
- `/admin_member_management`
- `/admin_pending_requests`
- `/group_member_directory`
- `/admin_manage_roles`
- `/request_to_join_private`
- `/find_groups`
- `/group_history`
- `/admin_broadcast`
- `/challenge_recap`
- `/challenge_recap_story`
- `/share_progress_card`
- `/challenge_detail_leaderboard`
- `/support_history`
- `/share_my_profile`
- `/followers_list`
- `/following_list`
- `/follow_requests`
- `/scan_qr_code`
- `/group_join_sheet`
- `/support_request`
- `/support_request_detail`
- `/admin_support_requests`
- `/achievements_hub`
- `/achievement_detail`
- `/badge_unlock`
- `/level_up_modal`
- `/consistency_dashboard`
- `/admin_group_consistency`
- `/group_performance_report`
- `/admin_inactive_members`
- `/group_rules`
- `/team_rooting_celebration`
- `/celebratory_badge_detail`
- `/modern_achievements_hub`
- `/trophy_room`
- `/badge_detail_modal`
- `/year_in_review`
- `/new_year_challenge`
- `/milestones`
- `/community_values`
- `/connected_accounts`

## 2) Challenge System Audit Summary
- Challenge discovery was fragmented; refactored `ChallengesListScreen` into a clear Challenge Hub with category chips (`solo/group/cause/streak`) and cleaner CTAs (`Join/Continue/Leaderboard`).
- Challenge participation had duplicated progress assumptions after logging; `logWorkout` now returns authoritative next values and performs optimistic local sync for streak/progress.
- Challenge detail leaderboard back navigation now supports challenge-hub entry (`from=challenges_list`) to avoid home-only bounce.
- Group home challenge context was visually and structurally weak; now uses a unified challenge card with objective, timeframe, participants, progress, and direct continuation actions.

## 3) Duplicate or Removed Screens
- Removed orphan screen: `screens/VerifyScreen.tsx` (no route or entry point).
- Consolidated duplicate challenge-entry behavior by routing challenge discovery through one clear hub (`/challenges_list`) and one primary continuation path (`/log_workout` + `/challenge_detail_leaderboard`).

## 4) Refactored Components List
- Added `components/ChallengeCard.tsx` (reusable challenge tile with progress + CTA model).
- Added `components/StatsCard.tsx` (reusable compact analytics tile).
- Added `components/AppShell.tsx` (shared layout wrapper for screen-level consistency).
- Refactored `screens/GroupHomeScreen.tsx` to consume `StatsCard` + `ChallengeCard`.
- Refactored `screens/ChallengesListScreen.tsx` to consume `ChallengeCard` and standard challenge categories.

## 5) UI Standardization Report
- Enforced a consistent challenge card structure (title, objective, timeframe, participant count, progress, CTA row).
- Standardized stats cards in home journey to shared spacing/radius/typography patterns.
- Reduced mixed CTA semantics by making discovery actions explicit (`Join`, `Continue`, `Details`, `Leaderboard`).
- Preserved existing 2-font system (Lexend + Inter) while reducing per-screen style drift in refactored flows.

## 6) Navigation Fixes Applied
- Fixed dead CTA in setup flow: `SetupChallengeScreen` top-right menu now exits to `challenges_list`.
- Fixed dead CTA in setup flow: `Invite` now navigates to `share_invite`.
- Fixed dead CTA in invite flow: “Learn More About ...” now routes to `help_center`.
- Fixed dead CTA in launch flow: New Year challenge share button now triggers native share/copy fallback.
- Added leaderboard back-path support to return to `challenges_list` when entered from hub.
- Group home “History” now routes to `group_history` (removed dead-end button).

## 7) Performance Improvements Applied
- Disabled simulated feed-reaction mutation by default; it now runs only when `VITE_ENABLE_SIMULATED_REACTIONS=true`.
- Added optimistic local state sync after workout logging to avoid extra transitional renders with stale values.
- Reduced repeated in-screen computation in challenge/home views via shared components and memoized home stats.

## 8) Remaining Structural Weaknesses
- Bundle size remains large (`dist/assets` warning > 500kB). Next step: route-level code splitting.
- Several legacy screens still contain one-off visual patterns and unbound buttons outside the refactored challenge paths.
- Challenge creation is still local-UI driven and not yet fully persisted as first-class challenge entities; current flow is improved but still partially mock-driven.
- Donation/impact data display still mixes static + live values in some screens; transparency is improved but not fully normalized end-to-end.

## 9) Feb 11 Follow-up Audit + Fixes
- Removed redundant onboarding step in primary auth path: `welcome -> onboarding_logging -> signup` (community onboarding no longer in normal flow).
- Removed dead phone-auth flow from login/signup screens and standardized to email/password only.
- Fixed inert auth and legal actions:
- Login social buttons now surface clear fallback toast (instead of no-op).
- Signup password visibility works and Terms/Privacy buttons route to help center.
- Fixed dead support/help/share interactions:
- Help center quick links now navigate to relevant routes; “Contact Support” opens support request flow.
- Share Invite now supports copy, WhatsApp, Telegram, SMS, email, and QR-link copy.
- Share Profile now supports native share with clipboard fallback.
- Group feed header icons now route (`notifications`) and member overflow action routes to report flow.
- Group performance report share/export/leaderboard buttons are now actionable.
- Scan QR utility controls now provide feedback instead of silent no-op.
- Migrated canonical mock datasets into backend seeding flow:
- On signed-in startup, app seeds `catalogExercises`, `catalogWorkoutPlans`, and `catalogBadges` if empty.
- Starter feed posts are seeded into an empty active group feed.
- Added catalog security rules for signed-in read/write during migration phase.
- PWA/mobile baseline upgrades:
- Added `manifest.webmanifest`, app icons, iOS/PWA meta tags, and service worker shell caching.
- Standardized typography to Inter and softened heavy all-caps/black/italic usage globally for minimalist mobile UI.

## 10) Remaining Gaps Requiring Browser-Level E2E
- A full “click every button on every screen” verification still requires scripted browser testing (Playwright/Cypress) against a running Firebase-backed environment.
- There are still many legacy non-critical placeholder actions in secondary/admin/decorative controls outside the core user journey; these should be closed in a dedicated interaction-completion pass.
