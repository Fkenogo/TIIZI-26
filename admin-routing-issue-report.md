# Tiizi Admin Routing Issue Report (For External AI Coding Consultant)

## 1. Objective
Need help resolving admin route access flow in local/preview:
- Target URLs:
  - `/admin_dashboard`
  - `/admin_exercise_engine`
- Current behavior:
  - URLs route to login page with `?next=admin_dashboard`
  - After login, still not reliably landing in admin dashboard
- App is otherwise running and preview routes return HTTP `200`.

## 2. Environment
- OS: macOS (user machine)
- Repo path: `/Users/theo/TIIZI-26`
- Stack:
  - Vite + React + TypeScript
  - React Router v6
  - Firebase (Auth + Firestore) with local emulators
- Current date context: Feb 2026
- Browser tested: Chrome/Safari (user screenshots show both desktop/mobile layouts)

## 3. Reproduction Steps
1. Run app (dev or preview):
   - Dev: `npm run dev`
   - Preview: `npm run build && npm run preview:app`
2. Open:
   - `http://127.0.0.1:3002/admin_dashboard` (dev)
   - or `http://127.0.0.1:4174/admin_dashboard` (preview)
3. User sees login route:
   - `/login?next=admin_dashboard`
4. After login/signup, user often still does not reach admin dashboard.

## 4. What Has Been Changed Already

### Routing/auth guards
- `App.tsx`:
  - Added `?next=<view>` when redirecting unauthenticated users.
  - Added admin-route allow logic before pre-group redirect.
  - Added dev override flag in admin check:
    - `VITE_DEV_FORCE_ADMIN=true` enables admin state for any authenticated user.
- `screens/LoginScreen.tsx`:
  - Reads `next` query param via `useSearchParams`.
  - On successful login/signup, navigates to `next` if valid AppView; fallback `groups_list`.

### Core-MVP route allowlist
- `utils/coreMvp.ts`:
  - Added:
    - `AppView.ADMIN_DASHBOARD`
    - `AppView.ADMIN_EXERCISE_ENGINE`

### Admin feature wiring
- `types.ts`:
  - Added `ADMIN_EXERCISE_ENGINE` enum value.
- `App.tsx`:
  - Registered `AppView.ADMIN_EXERCISE_ENGINE`.
- `screens/GroupAdminDashboardScreen.tsx`:
  - Added button entry to “Exercise Engine Check”.
- Added `screens/AdminExerciseEngineScreen.tsx` (read-only verification screen).

### Dev/preview stability + ports
- `vite.config.ts`:
  - Dev port moved to `3002` (`VITE_DEV_PORT` fallback 3002)
  - strictPort + HMR pinned to same port
- `.env.local` includes:
  - `VITE_DEV_PORT=3002`
  - `VITE_DEV_FORCE_ADMIN=true`
  - `VITE_RESET_ON_LOAD=false` (important)
- Added scripts:
  - `dev:app` -> runs vite on 3002
  - `preview:app` -> vite preview on 4174

## 5. Current `.env.local` (relevant)
- `VITE_USE_EMULATORS=true`
- `VITE_FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`
- `VITE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
- `VITE_RESET_ON_LOAD=false`
- `VITE_SUPER_ADMIN_UIDS=8vRPKdWNmwV5s8Bsj7ZWNuLNh7b2`
- `VITE_DEV_PORT=3002`
- `VITE_DEV_FORCE_ADMIN=true`

## 6. Verified Server-Level Facts
- Preview verified by curl:
  - `/` -> 200
  - `/admin_dashboard` -> 200
  - `/admin_exercise_engine` -> 200
- So issue is app-side auth/redirect logic/state, not server routing.

## 7. Additional Related Work in Repo
- Exercise engine phase-0 work added:
  - `utils/exerciseEngine.ts`
  - `utils/useExerciseEngineData.ts`
  - `scripts/seed-exercise-engine.mjs`
  - `seed:exercise-engine` npm script
- This is separate from admin route issue but currently blocked by admin access UX.

## 8. Symptoms/Console
User console mainly shows non-blocking warnings:
- Tailwind CDN production warning
- React Router future flags warning
No decisive error tied to admin redirect loop in provided logs.

## 9. Likely Root Cause Hypotheses
1. Post-login navigation race:
   - Login screen navigates to `next`, but guard effects in `App.tsx` may immediately override.
2. Auth state hydration timing:
   - `state.user.authUid` may lag during route guard checks, causing fallback redirect.
3. View parsing mismatch:
   - `next` value may pass string not matching AppView at specific lifecycle moment.
4. Guard effect ordering:
   - Multiple `useEffect` redirects in `ViewContainer` may conflict.

## 10. Requested Consultant Deliverable
Please provide:
1. Precise fix for deterministic admin route entry flow:
   - If user hits `/admin_dashboard` unauthenticated -> login -> return to `/admin_dashboard` exactly once authenticated.
2. Robust guard ordering strategy (single source of truth redirect guard preferred).
3. Minimal patch set with file/line guidance.
4. Optional temporary debug overlay showing:
   - `resolvedView`
   - `authUid`
   - `isAdmin`
   - `isAdminView`
   - `hasGroup`

## 11. Quick Commands to Reproduce
```bash
cd /Users/theo/TIIZI-26
npm run build
npm run preview:app
# open http://127.0.0.1:4174/admin_dashboard
```
or
```bash
cd /Users/theo/TIIZI-26
npm run dev
# open http://127.0.0.1:3002/admin_dashboard
```

## 12. Key Files to Inspect
- `App.tsx`
- `screens/LoginScreen.tsx`
- `types.ts`
- `utils/coreMvp.ts`
- `.env.local`
- `vite.config.ts`
