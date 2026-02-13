# Tiizi - Social Fitness Community

## Overview

Tiizi is a social fitness community web application that transforms individual workouts into group accountability and mutual support. The app combines fitness tracking with social features, group challenges, and community building.

## 🚨 Critical Security & Stability Fixes Applied

### 1. Firebase Security Rules (`firestore.rules`)
- **Issue**: Database was completely exposed with no security rules
- **Fix**: Implemented comprehensive security rules with:
  - Authentication required for all operations
  - User-based access control (users can only access their own data)
  - Group-based permissions (only group members can access group data)
  - Admin-only operations for sensitive actions
  - Helper functions for role checking (isAdmin, isGroupMember, etc.)

### 2. Input Validation System (`utils/validation.ts`)
- **Issue**: No input validation - vulnerable to XSS and data corruption
- **Fix**: Comprehensive validation utility with:
  - XSS prevention through HTML sanitization
  - Field length limits and format validation
  - Safe character filtering for usernames and text fields
  - File upload validation (type, size limits)
  - Numeric input validation with min/max bounds
  - Higher-order functions for wrapping Firebase operations

### 3. Memory Leak Fixes (`context/AppContext.tsx`)
- **Issue**: Firestore listeners not properly cleaned up causing memory leaks
- **Fix**: Added proper error handling and cleanup:
  - Error callbacks for all Firestore listeners
  - Proper unsubscribe calls in useEffect cleanup
  - Type safety improvements for user data

### 4. Error Boundaries (`components/ErrorBoundary.tsx`)
- **Issue**: No error handling - app crashes could break user experience
- **Fix**: Comprehensive error boundary component:
  - Catches component errors and prevents app crashes
  - User-friendly error messages with recovery options
  - Development mode error details for debugging
  - Analytics integration for error tracking
  - Optional custom fallback UI support

### 5. App-Level Error Protection
- **Issue**: No global error handling
- **Fix**: Wrapped main App component with ErrorBoundary
- **Issue**: Incorrect environment variable access
- **Fix**: Standardized client env reads to `import.meta.env` for Vite compatibility

## Tech Stack

- **Frontend**: React 19.2.4 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM 6.30.0
- **State Management**: Custom Context API with localStorage persistence
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions, Analytics)
- **Build Tool**: Vite 6.2.0
- **Database**: Firestore with DataConnect for GraphQL API

## Key Features

### ✅ Core Features (Fully Implemented)
- **User Management**: Registration, profiles, social features (follow/unfollow)
- **Group System**: Create/join groups, admin controls, member management
- **Workout Tracking**: Log workouts, track progress, comprehensive exercise library
- **Social Feed**: Posts, comments, reactions, sharing with real-time updates
- **Challenges**: Create and participate in fitness challenges
- **Achievements**: Badges, levels, consistency tracking
- **Notifications**: Real-time updates and alerts
- **Admin Tools**: Moderation, member management, analytics

### ⚠️ Features Requiring Attention
- **DataConnect GraphQL**: Schema exists but queries incomplete
- **Performance**: No pagination or virtualization for large datasets
- **Testing**: No automated testing infrastructure
- **Documentation**: Missing comprehensive documentation

## Architecture

```
Frontend (React Web App)
├── Context API (AppContext.tsx) - Global state management
├── Router (App.tsx) - Navigation with 100+ screens
├── Components (Header, BottomNav, ErrorBoundary)
├── Screens (100+ feature screens)
├── Data (WorkoutPlans, Exercises, Validation)
└── Firebase Integration (Auth, Firestore, Storage)

Backend (Firebase)
├── Authentication (User management)
├── Firestore (Real-time database)
├── Storage (Media files)
├── Functions (Serverless functions)
├── Analytics (Usage tracking)
└── DataConnect (GraphQL API layer)
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- Firebase project with Firestore, Auth, Storage enabled

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TIIZI-26
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   VITE_SUPER_ADMIN_UIDS=admin-uid-1,admin-uid-2
   ```

4. **Deploy Firebase Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Create Firebase web preview (recommended)**
   ```bash
   npm run firebase:preview
   ```

## Security Features

### 🔒 Data Protection
- **Authentication Required**: All database operations require user authentication
- **User Isolation**: Users can only access their own data and group data
- **Role-Based Access**: Admin-only operations for sensitive actions
- **Input Sanitization**: All user inputs are validated and sanitized

### 🛡️ Input Validation
- **XSS Prevention**: HTML tags and scripts are stripped from user inputs
- **Length Limits**: Field length validation prevents database bloat
- **Format Validation**: Username, email, and text field format validation
- **File Upload Security**: Type and size validation for image uploads

### 📊 Error Handling
- **Graceful Degradation**: App continues functioning even when errors occur
- **User-Friendly Messages**: Clear error messages with recovery options
- **Development Debugging**: Detailed error information in development mode
- **Analytics Integration**: Error tracking for monitoring and debugging

## Performance Considerations

### Current Limitations
- **No Pagination**: Large datasets may cause performance issues
- **No Virtualization**: Long lists not optimized for rendering
- **No Caching**: Repeated database calls without caching strategy
- **No Lazy Loading**: All components loaded at startup

### Recommended Optimizations
1. Implement virtualization for long lists (react-virtualized)
2. Add pagination for large datasets
3. Implement caching strategy for frequently accessed data
4. Add lazy loading for non-critical components
5. Optimize image loading and compression

## Development Guidelines

### Code Organization
- **Screens**: Feature-specific components (100+ screens)
- **Components**: Reusable UI components
- **Context**: Global state management
- **Data**: Static data and configurations
- **Utils**: Utility functions and validation
- **Types**: TypeScript type definitions

### Best Practices Applied
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and validation
- **Security**: Input validation and Firebase security rules
- **Performance**: Memory leak fixes and proper cleanup
- **User Experience**: Loading states and error recovery

## Testing Strategy

### Current Status
- **No Automated Tests**: Zero test files found
- **Manual Testing Required**: All functionality needs manual verification

### Recommended Testing Setup
1. **Unit Tests**: Jest with React Testing Library
2. **Integration Tests**: Firebase emulator suite
3. **E2E Tests**: Playwright or Cypress
4. **Performance Tests**: Lighthouse CI
5. **Security Tests**: OWASP ZAP or similar

## Playwright Audit Suite

This repository includes a Playwright crawler-style audit runner that:
- Crawls all `AppView` routes from `types.ts`
- Attempts to click visible buttons/links per route
- Flags dead actions, dead links, and potential no-op controls
- Writes route screenshots and machine-readable reports

### Install

```bash
npm install
npx playwright install chromium
```

### Run audit (using existing local server at `http://127.0.0.1:4173`)

```bash
npm run audit:playwright
```

### Run audit with auto-started dev server

```bash
npm run audit:playwright:start
```

### Artifacts

Audit artifacts are generated under:

```text
reports/playwright-audit/<timestamp>/
  report.json
  report.md
  screenshots/
```

### Useful environment variables

- `PLAYWRIGHT_BASE_URL` (default: `http://127.0.0.1:4173`)
- `PLAYWRIGHT_PORT` (default: `4173`, used when auto-starting dev server)
- `PLAYWRIGHT_MAX_CONTROLS` (default: `250`)
- `PLAYWRIGHT_WAIT_MS` (default: `600`)
- `PLAYWRIGHT_NAV_TIMEOUT_MS` (default: `12000`)
- `PLAYWRIGHT_START_SERVER` (`true` to auto-start Vite dev server)

Note: auto-start mode uses `--strictPort`. If the port is in use, the audit exits with an explicit error so it does not silently drift to another port.

## Deployment

### Firebase Hosting
```bash
# Generate a temporary preview URL on Firebase Hosting (no localhost preview)
npm run firebase:preview

# Deploy hosting + Firestore rules/indexes to production
npm run firebase:deploy

# Deploy hosting + Firestore + Functions
npm run firebase:deploy:full
```

### Environment Variables
Ensure all environment variables are set in Firebase console:
- `VITE_FIREBASE_*` variables for Firebase configuration
- `VITE_SUPER_ADMIN_UIDS` for admin user IDs

## Contributing

### Before Submitting Changes
1. Run `npm run build` to ensure no build errors
2. Test all major features manually
3. Verify error boundaries work correctly
4. Check input validation prevents XSS
5. Ensure Firebase security rules are deployed

### Code Review Checklist
- [ ] Security: No exposed sensitive data
- [ ] Validation: All user inputs validated
- [ ] Error Handling: Proper error boundaries in place
- [ ] Performance: No obvious performance issues
- [ ] TypeScript: No type errors
- [ ] Testing: New features have tests (when available)

## Known Issues & Technical Debt

### High Priority
1. **DataConnect GraphQL**: Incomplete implementation
2. **Performance**: No optimization for large datasets
3. **Testing**: No automated testing infrastructure

### Medium Priority
1. **Code Organization**: 100+ screens in single directory
2. **Context Bloat**: AppContext handles too many responsibilities
3. **Documentation**: Missing comprehensive documentation

### Low Priority
1. **UI Polish**: Some screens may need design improvements
2. **Feature Completeness**: Some features partially implemented

## Support

For issues related to:
- **Security**: Check Firebase security rules and input validation
- **Performance**: Look for memory leaks and large dataset handling
- **Functionality**: Verify Firebase integration and real-time features
- **Build Issues**: Check environment variables and dependencies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This application has undergone significant security and stability improvements. Always ensure Firebase security rules are deployed and environment variables are properly configured before deployment.
