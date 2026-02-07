
import React, { useEffect } from 'react';
import { AppView } from './types';
import { TiiziProvider, useTiizi, ToastMessage } from './context/AppContext';
import WelcomeScreen from './screens/WelcomeScreen';
import LoggingOnboardingScreen from './screens/LoggingOnboardingScreen';
import CommunityOnboardingScreen from './screens/CommunityOnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import VerifyScreen from './screens/VerifyScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
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
import ScanQRCodeScreen from './screens/ScanQRCodeScreen';
import GroupJoinSheetScreen from './screens/GroupJoinSheetScreen';
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

const Router: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.WELCOME);
  const { state, toggleDarkMode, removeToast } = useTiizi();

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const views = {
    [AppView.WELCOME]: <WelcomeScreen onNavigate={navigate} />,
    [AppView.ONBOARDING_LOGGING]: <LoggingOnboardingScreen onNavigate={navigate} />,
    [AppView.ONBOARDING_COMMUNITY]: <CommunityOnboardingScreen onNavigate={navigate} />,
    [AppView.LOGIN]: <LoginScreen onNavigate={navigate} />,
    [AppView.SIGNUP]: <SignupScreen onNavigate={navigate} />,
    [AppView.VERIFY]: <VerifyScreen onNavigate={navigate} />,
    [AppView.PROFILE_SETUP]: <ProfileSetupScreen onNavigate={navigate} />,
    [AppView.GROUPS_LIST]: <GroupsListScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_HOME]: <GroupHomeScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_CHAT]: <GroupChatScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.LOG_WORKOUT]: <LogWorkoutScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.SUPPORT_FUND]: <SupportFundScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.GROUP_RULES]: <GroupRulesScreen onNavigate={navigate} />,
    [AppView.GROUP_MEMBER_DIRECTORY]: <GroupMemberDirectoryScreen onNavigate={navigate} />,
    [AppView.PROFILE]: <ProfileScreen onNavigate={navigate} user={state.user} />,
    [AppView.MODERN_ACHIEVEMENTS_HUB]: <ModernAchievementsHubScreen onNavigate={navigate} />,
    [AppView.CELEBRATORY_BADGE_DETAIL]: <CelebratoryBadgeDetailScreen onNavigate={navigate} />,
    [AppView.TROPHY_ROOM]: <TrophyRoomScreen onNavigate={navigate} />,
    [AppView.BADGE_DETAIL_MODAL]: <BadgeDetailModalScreen onNavigate={navigate} />,
    [AppView.YEAR_IN_REVIEW]: <YearInReviewScreen onNavigate={navigate} />,
    [AppView.SHARE_PROGRESS_CARD]: <ShareProgressCardScreen onNavigate={navigate} />,
    [AppView.MONTH_IN_REVIEW]: <MonthInReviewScreen onNavigate={navigate} />,
    [AppView.CONSISTENCY_DASHBOARD]: <ConsistencyDashboardScreen onNavigate={navigate} />,
    [AppView.ADMIN_DASHBOARD]: <GroupAdminDashboardScreen onNavigate={navigate} />,
    [AppView.ADMIN_ENGAGEMENT]: <MemberEngagementScreen onNavigate={navigate} />,
    [AppView.ADMIN_MODERATION]: <ModerationDashboardScreen onNavigate={navigate} />,
    [AppView.ADMIN_GROUP_CONSISTENCY]: <AdminGroupConsistencyScreen onNavigate={navigate} />,
    [AppView.ADMIN_INACTIVE_MEMBERS]: <AdminInactiveMembersScreen onNavigate={navigate} />,
    [AppView.ADMIN_PENDING_REQUESTS]: <AdminPendingRequestsScreen onNavigate={navigate} />,
    [AppView.ADMIN_MEMBER_MANAGEMENT]: <AdminMemberManagementScreen onNavigate={navigate} />,
    [AppView.ADMIN_MANAGE_ROLES]: <AdminManageRolesScreen onNavigate={navigate} />,
    [AppView.ADMIN_BROADCAST]: <AdminBroadcastScreen onNavigate={navigate} />,
    [AppView.DISCOVER]: <DiscoverScreen onNavigate={navigate} />,
    [AppView.NEW_YEAR_CHALLENGE]: <NewYearChallengeScreen onNavigate={navigate} />,
    [AppView.SETUP_CHALLENGE]: <SetupChallengeScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CHALLENGES_LIST]: <ChallengesListScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_TYPE]: <CreateChallengeTypeScreen onNavigate={navigate} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_EXERCISE]: <CreateChallengeExerciseScreen onNavigate={navigate} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_DURATION]: <CreateChallengeDurationScreen onNavigate={navigate} isDark={state.isDarkMode} />,
    [AppView.CREATE_CHALLENGE_DETAILS]: <CreateChallengeDetailsScreen onNavigate={navigate} isDark={state.isDarkMode} />,
    [AppView.CHALLENGE_RECAP]: <ChallengeRecapScreen onNavigate={navigate} />,
    [AppView.CHALLENGE_RECAP_STORY]: <ChallengeRecapStoryScreen onNavigate={navigate} />,
    [AppView.CHALLENGE_DETAIL_LEADERBOARD]: <ChallengeDetailLeaderboardScreen onNavigate={navigate} />,
    [AppView.SUPPORT_HISTORY]: <SupportHistoryScreen onNavigate={navigate} />,
    [AppView.COMMUNITY_RESOURCES]: <CommunityResourcesScreen onNavigate={navigate} />,
    [AppView.HELP_CENTER]: <HelpCenterScreen onNavigate={navigate} />,
    [AppView.PLEDGE_MODAL]: <PledgeModalScreen onNavigate={navigate} />,
    [AppView.PLEDGE_RECORDED]: <PledgeRecordedScreen onNavigate={navigate} />,
    [AppView.DONATION_THANK_YOU]: <DonationThankYouScreen onNavigate={navigate} />,
    [AppView.SETTINGS]: <SettingsScreen onNavigate={navigate} />,
    [AppView.EDIT_PROFILE]: <EditProfileScreen onNavigate={navigate} />,
    [AppView.NOTIFICATIONS]: <NotificationsScreen onNavigate={navigate} />,
    [AppView.PRIORITY_ALERTS]: <PriorityAlertsScreen onNavigate={navigate} />,
    [AppView.SCAN_QR_CODE]: <ScanQRCodeScreen onNavigate={navigate} />,
    [AppView.GROUP_JOIN_SHEET]: <GroupJoinSheetScreen onNavigate={navigate} />,
    [AppView.EXERCISE_LIBRARY]: <ExerciseLibraryScreen onNavigate={navigate} />,
    [AppView.EXERCISE_DETAIL]: <ExerciseDetailScreen onNavigate={navigate} />,
    [AppView.LEADERBOARD]: <LeaderboardScreen onNavigate={navigate} />,
    [AppView.GROUP_FEED]: <GroupFeedScreen onNavigate={navigate} />,
    [AppView.CELEBRATION]: <CelebrationScreen onNavigate={navigate} />,
    [AppView.TEAM_ROOTING_CELEBRATION]: <TeamRootingCelebrationScreen onNavigate={navigate} />,
    [AppView.FIND_GROUPS]: <FindGroupsScreen onNavigate={navigate} />,
    [AppView.REQUEST_TO_JOIN_PRIVATE]: <RequestToJoinPrivateScreen onNavigate={navigate} />,
    [AppView.GROUP_HISTORY]: <GroupHistoryScreen onNavigate={navigate} />,
    [AppView.GROUP_INVITE_LANDING]: <GroupInviteLandingScreen onNavigate={navigate} />,
    [AppView.GROUP_PRIVACY_SETTINGS]: <GroupPrivacySettingsScreen onNavigate={navigate} />,
    [AppView.SHARE_INVITE]: <ShareInviteScreen onNavigate={navigate} />,
    [AppView.SHARE_MY_PROFILE]: <ShareMyProfileScreen onNavigate={navigate} />,
    [AppView.ACHIEVEMENTS_HUB]: <AchievementHubScreen onNavigate={navigate} />,
    [AppView.ACHIEVEMENT_DETAIL]: <AchievementDetailScreen onNavigate={navigate} />,
    [AppView.BADGE_UNLOCK]: <BadgeUnlockScreen onNavigate={navigate} />,
    [AppView.LEVEL_UP_MODAL]: <LevelUpModalScreen onNavigate={navigate} />,
    [AppView.GROUP_PERFORMANCE_REPORT]: <GroupPerformanceReportScreen onNavigate={navigate} />,
    [AppView.WORKOUT_PLAN_ROADMAP]: <WorkoutPlanRoadmapScreen onNavigate={navigate} />,
    [AppView.WORKOUT_PLAN_PREVIEW]: <WorkoutPlanPreviewScreen onNavigate={navigate} />,
    [AppView.GROUP_WORKOUT_PLANS]: <GroupWorkoutPlansScreen onNavigate={navigate} />,
    [AppView.SELECT_GROUP_FOR_PLAN]: <SelectGroupForPlanScreen onNavigate={navigate} />,
    [AppView.CHALLENGE_COMPLETE]: <ChallengeCompleteScreen onNavigate={navigate} onToggleDark={toggleDarkMode} isDark={state.isDarkMode} />,
    [AppView.CONSISTENCY_WINS]: <ConsistencyWinsScreen onNavigate={navigate} />,
  };

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
          {views[currentView] || views[AppView.WELCOME]}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <TiiziProvider>
    <Router />
  </TiiziProvider>
);

export default App;
