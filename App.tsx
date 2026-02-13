import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AppView } from './types';
import { TiiziProvider, useTiizi, ToastMessage } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoginScreen from './screens/LoginScreen';
import GroupsListScreen from './screens/GroupsListScreen';
import GroupHomeScreen from './screens/GroupHomeScreen';
import GroupChatScreen from './screens/GroupChatScreen';
import LogWorkoutScreen from './screens/LogWorkoutScreen';
import SupportFundScreen from './screens/SupportFundScreen';
import ChallengeCompleteScreen from './screens/ChallengeCompleteScreen';
import ChallengesListScreen from './screens/ChallengesListScreen';
import CreateChallengeTypeScreen from './screens/CreateChallengeTypeScreen';
import CreateChallengeExerciseScreen from './screens/CreateChallengeExerciseScreen';
import CreateChallengeDurationScreen from './screens/CreateChallengeDurationScreen';
import CreateChallengeDetailsScreen from './screens/CreateChallengeDetailsScreen';
import SetupChallengeScreen from './screens/SetupChallengeScreen';
import ExerciseLibraryScreen from './screens/ExerciseLibraryScreen';
import GroupFeedScreen from './screens/GroupFeedScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import PledgeModalScreen from './screens/PledgeModalScreen';
import PledgeRecordedScreen from './screens/PledgeRecordedScreen';
import DonationThankYouScreen from './screens/DonationThankYouScreen';
import SettingsScreen from './screens/SettingsScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PriorityAlertsScreen from './screens/PriorityAlertsScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import GroupAdminDashboardScreen from './screens/GroupAdminDashboardScreen';
import MemberEngagementScreen from './screens/MemberEngagementScreen';
import ModerationDashboardScreen from './screens/ModerationDashboardScreen';
import ReportMemberScreen from './screens/ReportMemberScreen';
import CommunityResourcesScreen from './screens/CommunityResourcesScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import GroupWorkoutPlansScreen from './screens/GroupWorkoutPlansScreen';
import WorkoutPlanPreviewScreen from './screens/WorkoutPlanPreviewScreen';
import SelectGroupForPlanScreen from './screens/SelectGroupForPlanScreen';
import WorkoutPlanRoadmapScreen from './screens/WorkoutPlanRoadmapScreen';
import MonthInReviewScreen from './screens/MonthInReviewScreen';
import ShareableReportScreen from './screens/ShareableReportScreen';
import CelebrationScreen from './screens/CelebrationScreen';
import GroupInviteLandingScreen from './screens/GroupInviteLandingScreen';
import GroupPrivacySettingsScreen from './screens/GroupPrivacySettingsScreen';
import ShareInviteScreen from './screens/ShareInviteScreen';
import ConsistencyWinsScreen from './screens/ConsistencyWinsScreen';
import AdminMemberManagementScreen from './screens/AdminMemberManagementScreen';
import AdminPendingRequestsScreen from './screens/AdminPendingRequestsScreen';
import GroupMemberDirectoryScreen from './screens/GroupMemberDirectoryScreen';
import AdminManageRolesScreen from './screens/AdminManageRolesScreen';
import RequestToJoinPrivateScreen from './screens/RequestToJoinPrivateScreen';
import FindGroupsScreen from './screens/FindGroupsScreen';
import GroupHistoryScreen from './screens/GroupHistoryScreen';
import AdminBroadcastScreen from './screens/AdminBroadcastScreen';
import ChallengeRecapScreen from './screens/ChallengeRecapScreen';
import ChallengeRecapStoryScreen from './screens/ChallengeRecapStoryScreen';
import ShareProgressCardScreen from './screens/ShareProgressCardScreen';
import ChallengeDetailLeaderboardScreen from './screens/ChallengeDetailLeaderboardScreen';
import SupportHistoryScreen from './screens/SupportHistoryScreen';
import ShareMyProfileScreen from './screens/ShareMyProfileScreen';
import GroupJoinSheetScreen from './screens/GroupJoinSheetScreen';
import SupportRequestScreen from './screens/SupportRequestScreen';
import AdminSupportRequestsScreen from './screens/AdminSupportRequestsScreen';
import AdminExerciseEngineScreen from './screens/AdminExerciseEngineScreen';
import SupportRequestDetailScreen from './screens/SupportRequestDetailScreen';
import AchievementHubScreen from './screens/AchievementHubScreen';
import AchievementDetailScreen from './screens/AchievementDetailScreen';
import BadgeUnlockScreen from './screens/BadgeUnlockScreen';
import LevelUpModalScreen from './screens/LevelUpModalScreen';
import ConsistencyDashboardScreen from './screens/ConsistencyDashboardScreen';
import AdminGroupConsistencyScreen from './screens/AdminGroupConsistencyScreen';
import GroupPerformanceReportScreen from './screens/GroupPerformanceReportScreen';
import AdminInactiveMembersScreen from './screens/AdminInactiveMembersScreen';
import GroupRulesScreen from './screens/GroupRulesScreen';
import TeamRootingCelebrationScreen from './screens/TeamRootingCelebrationScreen';
import CelebratoryBadgeDetailScreen from './screens/CelebratoryBadgeDetailScreen';
import ModernAchievementsHubScreen from './screens/ModernAchievementsHubScreen';
import TrophyRoomScreen from './screens/TrophyRoomScreen';
import BadgeDetailModalScreen from './screens/BadgeDetailModalScreen';
import YearInReviewScreen from './screens/YearInReviewScreen';
import NewYearChallengeScreen from './screens/NewYearChallengeScreen';
import MilestonesScreen from './screens/MilestonesScreen';
import CommunityValuesScreen from './screens/CommunityValuesScreen';
import ConnectedAccountsScreen from './screens/ConnectedAccountsScreen';
import { CORE_MVP_ENABLED, isCoreMvpView } from './utils/coreMvp';

const Toast: React.FC<{ toast: ToastMessage, onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const bgColor = toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-primary';
  const icon = toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info';

  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${bgColor} animate-in slide-in-from-top-full duration-300 pointer-events-auto border-2 border-white/20 w-full max-w-[340px]`}>
      <span className="material-icons-round text-xl">{icon}</span>
      <p className="text-[11px] font-black uppercase tracking-widest flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="material-icons-round text-base">close</span>
      </button>
    </div>
  );
};

const ViewContainer: React.FC = () => {
  const { view } = useParams();
  const navigate = useNavigate();
  const { state, toggleDarkMode, removeToast } = useTiizi();
  const resetOnLoad = import.meta.env.VITE_RESET_ON_LOAD === 'true';

  useEffect(() => {
    if (!resetOnLoad) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage errors in locked-down environments.
    }
  }, [resetOnLoad]);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const navigateToView = (nextView: AppView) => {
    navigate(`/${nextView}`);
    window.scrollTo(0, 0);
  };

  const resolvedView = useMemo(() => {
    const allViews = Object.values(AppView) as string[];
    return allViews.includes(view || '') ? (view as AppView) : AppView.LOGIN;
  }, [view]);
  const isCoreRoute = !CORE_MVP_ENABLED || isCoreMvpView(resolvedView);
  const isAuthed = !!state.user.authUid;
  const hasGroup = !!state.activeGroupId;
  const hasActiveChallenge = !!state.activeChallenge?.id;
  const preGroupViews = new Set<AppView>([
    AppView.GROUPS_LIST,
    AppView.FIND_GROUPS,
    AppView.GROUP_JOIN_SHEET,
    AppView.REQUEST_TO_JOIN_PRIVATE,
    AppView.GROUP_INVITE_LANDING,
    AppView.GROUP_PRIVACY_SETTINGS,
    AppView.SHARE_INVITE
  ]);
  const challengeRequiredViews = new Set<AppView>([
    AppView.LOG_WORKOUT,
    AppView.CHALLENGE_COMPLETE,
    AppView.CHALLENGE_RECAP,
    AppView.CHALLENGE_RECAP_STORY,
    AppView.CHALLENGE_DETAIL_LEADERBOARD,
    AppView.SHARE_PROGRESS_CARD
  ]);

  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const superAdminIds = (import.meta.env.VITE_SUPER_ADMIN_UIDS || '')
    .split(',')
    .map((id: string) => id.trim())
    .filter(Boolean);
  const forceAdminInDev = import.meta.env.VITE_DEV_FORCE_ADMIN === 'true';
  const isSuperAdmin = !!state.user.authUid && superAdminIds.includes(state.user.authUid);
  const isAdmin = !!state.user.authUid && (
    forceAdminInDev ||
    isSuperAdmin ||
    activeGroup?.adminIds?.includes(state.user.authUid) ||
    state.user.role === 'admin'
  );
  const adminViews = new Set<AppView>([
    AppView.ADMIN_DASHBOARD,
    AppView.ADMIN_ENGAGEMENT,
    AppView.ADMIN_MODERATION,
    AppView.ADMIN_GROUP_CONSISTENCY,
    AppView.ADMIN_INACTIVE_MEMBERS,
    AppView.ADMIN_PENDING_REQUESTS,
    AppView.ADMIN_MEMBER_MANAGEMENT,
    AppView.ADMIN_MANAGE_ROLES,
    AppView.ADMIN_BROADCAST,
    AppView.ADMIN_SUPPORT_REQUESTS,
    AppView.ADMIN_EXERCISE_ENGINE,
  ]);
  const isAdminView = adminViews.has(resolvedView);

  useEffect(() => {
    if (isAdminView && !isAdmin) {
      navigate(`/${AppView.GROUP_HOME}`, { replace: true });
    }
  }, [isAdminView, isAdmin, navigate]);

  useEffect(() => {
    if (isCoreRoute) return;
    const fallback = state.user.authUid ? AppView.GROUP_HOME : AppView.LOGIN;
    navigate(`/${fallback}`, { replace: true });
  }, [isCoreRoute, navigate, state.user.authUid]);

  useEffect(() => {
    if (!isAuthed && resolvedView !== AppView.LOGIN) {
      navigate(`/${AppView.LOGIN}?next=${encodeURIComponent(resolvedView)}`, { replace: true });
      return;
    }
    if (isAuthed && !hasGroup && !preGroupViews.has(resolvedView) && !(isAdmin && isAdminView)) {
      navigate(`/${AppView.GROUPS_LIST}`, { replace: true });
      return;
    }
    if (isAuthed && hasGroup && !hasActiveChallenge && challengeRequiredViews.has(resolvedView)) {
      navigate(`/${AppView.CHALLENGES_LIST}`, { replace: true });
    }
  }, [isAuthed, hasGroup, hasActiveChallenge, resolvedView, navigate, isAdmin, isAdminView]);

  const views = {
    [AppView.LOGIN]: <LoginScreen onNavigate={navigateToView} />,
    [AppView.GROUPS_LIST]: <GroupsListScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_HOME]: <GroupHomeScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_CHAT]: <GroupChatScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.LOG_WORKOUT]: <LogWorkoutScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.SUPPORT_FUND]: <SupportFundScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_RULES]: <GroupRulesScreen onNavigate={navigateToView} />,
    [AppView.GROUP_MEMBER_DIRECTORY]: <GroupMemberDirectoryScreen onNavigate={navigateToView} />,
    [AppView.PROFILE]: <ProfileScreen onNavigate={navigateToView} user={state.user} />,
    [AppView.MODERN_ACHIEVEMENTS_HUB]: <ModernAchievementsHubScreen onNavigate={navigateToView} />,
    [AppView.CELEBRATORY_BADGE_DETAIL]: <CelebratoryBadgeDetailScreen onNavigate={navigateToView} />,
    [AppView.TROPHY_ROOM]: <TrophyRoomScreen onNavigate={navigateToView} />,
    [AppView.BADGE_DETAIL_MODAL]: <BadgeDetailModalScreen onNavigate={navigateToView} />,
    [AppView.YEAR_IN_REVIEW]: <YearInReviewScreen onNavigate={navigateToView} />,
    [AppView.SHARE_PROGRESS_CARD]: <ShareProgressCardScreen onNavigate={navigateToView} />,
    [AppView.MONTH_IN_REVIEW]: <MonthInReviewScreen onNavigate={navigateToView} />,
    [AppView.CONSISTENCY_DASHBOARD]: <ConsistencyDashboardScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_DASHBOARD]: <GroupAdminDashboardScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_ENGAGEMENT]: <MemberEngagementScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_MODERATION]: <ModerationDashboardScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_GROUP_CONSISTENCY]: <AdminGroupConsistencyScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_INACTIVE_MEMBERS]: <AdminInactiveMembersScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_PENDING_REQUESTS]: <AdminPendingRequestsScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_MEMBER_MANAGEMENT]: <AdminMemberManagementScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_MANAGE_ROLES]: <AdminManageRolesScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_BROADCAST]: <AdminBroadcastScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_EXERCISE_ENGINE]: <AdminExerciseEngineScreen onNavigate={navigateToView} />,
    [AppView.DISCOVER]: <DiscoverScreen onNavigate={navigateToView} />,
    [AppView.NEW_YEAR_CHALLENGE]: <NewYearChallengeScreen onNavigate={navigateToView} />,
    [AppView.SETUP_CHALLENGE]: <SetupChallengeScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CHALLENGES_LIST]: <ChallengesListScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_TYPE]: <CreateChallengeTypeScreen onNavigate={navigateToView} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_EXERCISE]: <CreateChallengeExerciseScreen onNavigate={navigateToView} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_DURATION]: <CreateChallengeDurationScreen onNavigate={navigateToView} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_DETAILS]: <CreateChallengeDetailsScreen onNavigate={navigateToView} isDark={state.isDarkMode} />,
    [AppView.CHALLENGE_RECAP]: <ChallengeRecapScreen onNavigate={navigateToView} />,
    [AppView.CHALLENGE_RECAP_STORY]: <ChallengeRecapStoryScreen onNavigate={navigateToView} />,
    [AppView.CHALLENGE_DETAIL_LEADERBOARD]: <ChallengeDetailLeaderboardScreen onNavigate={navigateToView} />,
    [AppView.SUPPORT_HISTORY]: <SupportHistoryScreen onNavigate={navigateToView} />,
    [AppView.COMMUNITY_RESOURCES]: <CommunityResourcesScreen onNavigate={navigateToView} />,
    [AppView.HELP_CENTER]: <HelpCenterScreen onNavigate={navigateToView} />,
    [AppView.PLEDGE_MODAL]: <PledgeModalScreen onNavigate={navigateToView} />,
    [AppView.PLEDGE_RECORDED]: <PledgeRecordedScreen onNavigate={navigateToView} />,
    [AppView.DONATION_THANK_YOU]: <DonationThankYouScreen onNavigate={navigateToView} />,
    [AppView.SETTINGS]: <SettingsScreen onNavigate={navigateToView} />,
    [AppView.EDIT_PROFILE]: <EditProfileScreen onNavigate={navigateToView} />,
    [AppView.NOTIFICATIONS]: <NotificationsScreen onNavigate={navigateToView} />,
    [AppView.PRIORITY_ALERTS]: <PriorityAlertsScreen onNavigate={navigateToView} />,
    [AppView.GROUP_JOIN_SHEET]: <GroupJoinSheetScreen onNavigate={navigateToView} />,
    [AppView.SUPPORT_REQUEST]: <SupportRequestScreen onNavigate={navigateToView} />,
    [AppView.SUPPORT_REQUEST_DETAIL]: <SupportRequestDetailScreen onNavigate={navigateToView} />,
    [AppView.ADMIN_SUPPORT_REQUESTS]: <AdminSupportRequestsScreen onNavigate={navigateToView} />,
    [AppView.EXERCISE_LIBRARY]: <ExerciseLibraryScreen onNavigate={navigateToView} />,
    [AppView.EXERCISE_DETAIL]: <ExerciseDetailScreen onNavigate={navigateToView} />,
    [AppView.LEADERBOARD]: <LeaderboardScreen onNavigate={navigateToView} />,
    [AppView.GROUP_FEED]: <GroupFeedScreen onNavigate={navigateToView} />,
    [AppView.CELEBRATION]: <CelebrationScreen onNavigate={navigateToView} />,
    [AppView.MILESTONES]: <MilestonesScreen onNavigate={navigateToView} />,
    [AppView.COMMUNITY_VALUES]: <CommunityValuesScreen onNavigate={navigateToView} />,
    [AppView.CONNECTED_ACCOUNTS]: <ConnectedAccountsScreen onNavigate={navigateToView} />,
    [AppView.TEAM_ROOTING_CELEBRATION]: <TeamRootingCelebrationScreen onNavigate={navigateToView} />,
    [AppView.FIND_GROUPS]: <FindGroupsScreen onNavigate={navigateToView} />,
    [AppView.REQUEST_TO_JOIN_PRIVATE]: <RequestToJoinPrivateScreen onNavigate={navigateToView} />,
    [AppView.GROUP_HISTORY]: <GroupHistoryScreen onNavigate={navigateToView} />,
    [AppView.GROUP_INVITE_LANDING]: <GroupInviteLandingScreen onNavigate={navigateToView} />,
    [AppView.GROUP_PRIVACY_SETTINGS]: <GroupPrivacySettingsScreen onNavigate={navigateToView} />,
    [AppView.SHARE_INVITE]: <ShareInviteScreen onNavigate={navigateToView} />,
    [AppView.SHARE_MY_PROFILE]: <ShareMyProfileScreen onNavigate={navigateToView} />,
    [AppView.ACHIEVEMENTS_HUB]: <AchievementHubScreen onNavigate={navigateToView} />,
    [AppView.ACHIEVEMENT_DETAIL]: <AchievementDetailScreen onNavigate={navigateToView} />,
    [AppView.BADGE_UNLOCK]: <BadgeUnlockScreen onNavigate={navigateToView} />,
    [AppView.LEVEL_UP_MODAL]: <LevelUpModalScreen onNavigate={navigateToView} />,
    [AppView.GROUP_PERFORMANCE_REPORT]: <GroupPerformanceReportScreen onNavigate={navigateToView} />,
    [AppView.WORKOUT_PLAN_ROADMAP]: <WorkoutPlanRoadmapScreen onNavigate={navigateToView} />,
    [AppView.WORKOUT_PLAN_PREVIEW]: <WorkoutPlanPreviewScreen onNavigate={navigateToView} />,
    [AppView.GROUP_WORKOUT_PLANS]: <GroupWorkoutPlansScreen onNavigate={navigateToView} />,
    [AppView.SELECT_GROUP_FOR_PLAN]: <SelectGroupForPlanScreen onNavigate={navigateToView} />,
    [AppView.CHALLENGE_COMPLETE]: <ChallengeCompleteScreen onNavigate={navigateToView} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CONSISTENCY_WINS]: <ConsistencyWinsScreen onNavigate={navigateToView} />,
    [AppView.REPORT_MEMBER]: <ReportMemberScreen onNavigate={navigateToView} />,
    [AppView.SHAREABLE_REPORT]: <ShareableReportScreen onNavigate={navigateToView} />,
  };

  if (adminViews.has(resolvedView) && !isAdmin) {
    return (
      <div className="flex justify-center min-h-screen bg-background-light dark:bg-black transition-all">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl relative min-h-screen overflow-x-hidden flex flex-col items-center justify-center px-6 text-center">
          <span className="material-icons-round text-primary text-4xl mb-4">lock</span>
          <h2 className="text-lg font-black mb-2">Admin Access Required</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You don’t have permission to view this page.</p>
          <button
            onClick={() => navigate(`/${AppView.GROUP_HOME}`)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!isCoreRoute) {
    return null;
  }

  return (
    <div className="flex justify-center min-h-screen bg-background-light dark:bg-black transition-all">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl relative min-h-screen overflow-x-hidden flex flex-col">
        {/* Global Toast Overlay - Stacked from top */}
        <div className="fixed top-12 left-0 right-0 z-[100] flex flex-col items-center gap-3 px-6 pointer-events-none max-w-md mx-auto">
          {state.toasts.map(t => (
            <Toast key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {views[resolvedView] || views[AppView.LOGIN]}
        </div>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to={`/${AppView.LOGIN}`} replace />} />
    <Route path="/:view" element={<ViewContainer />} />
    <Route path="*" element={<Navigate to={`/${AppView.LOGIN}`} replace />} />
  </Routes>
);

const App: React.FC = () => (
  <ErrorBoundary>
    <TiiziProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TiiziProvider>
  </ErrorBoundary>
);

export default App;
