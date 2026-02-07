
export enum AppView {
  WELCOME = 'welcome',
  ONBOARDING_LOGGING = 'onboarding_logging',
  ONBOARDING_COMMUNITY = 'onboarding_community',
  LOGIN = 'login',
  SIGNUP = 'signup',
  VERIFY = 'verify',
  PROFILE_SETUP = 'profile_setup',
  GROUPS_LIST = 'groups_list',
  GROUP_HOME = 'group_home',
  GROUP_CHAT = 'group_chat',
  LOG_WORKOUT = 'log_workout',
  SUPPORT_FUND = 'support_fund',
  CHALLENGE_COMPLETE = 'challenge_complete',
  CHALLENGES_LIST = 'challenges_list',
  CREATE_CHALLENGE_TYPE = 'create_challenge_type',
  CREATE_CHALLENGE_EXERCISE = 'create_challenge_exercise',
  CREATE_CHALLENGE_DURATION = 'create_challenge_duration',
  CREATE_CHALLENGE_DETAILS = 'create_challenge_details',
  SETUP_CHALLENGE = 'setup_challenge',
  EXERCISE_LIBRARY = 'exercise_library',
  GROUP_FEED = 'group_feed',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile',
  PLEDGE_MODAL = 'pledge_modal',
  PLEDGE_RECORDED = 'pledge_recorded',
  DONATION_THANK_YOU = 'donation_thank_you',
  SETTINGS = 'settings',
  EXERCISE_DETAIL = 'exercise_detail',
  NOTIFICATIONS = 'notifications',
  PRIORITY_ALERTS = 'priority_alerts',
  DISCOVER = 'discover',
  ADMIN_DASHBOARD = 'admin_dashboard',
  ADMIN_ENGAGEMENT = 'admin_engagement',
  ADMIN_MODERATION = 'admin_moderation',
  REPORT_MEMBER = 'report_member',
  COMMUNITY_RESOURCES = 'community_resources',
  HELP_CENTER = 'help_center',
  EDIT_PROFILE = 'edit_profile',
  GROUP_WORKOUT_PLANS = 'group_workout_plans',
  WORKOUT_PLAN_PREVIEW = 'workout_plan_preview',
  SELECT_GROUP_FOR_PLAN = 'select_group_for_plan',
  WORKOUT_PLAN_ROADMAP = 'workout_plan_roadmap',
  MONTH_IN_REVIEW = 'month_in_review',
  SHAREABLE_REPORT = 'shareable_report',
  CELEBRATION = 'celebration',
  GROUP_INVITE_LANDING = 'group_invite_landing',
  GROUP_PRIVACY_SETTINGS = 'group_privacy_settings',
  SHARE_INVITE = 'share_invite',
  CONSISTENCY_WINS = 'consistency_wins',
  ADMIN_MEMBER_MANAGEMENT = 'admin_member_management',
  ADMIN_PENDING_REQUESTS = 'admin_pending_requests',
  GROUP_MEMBER_DIRECTORY = 'group_member_directory',
  ADMIN_MANAGE_ROLES = 'admin_manage_roles',
  REQUEST_TO_JOIN_PRIVATE = 'request_to_join_private',
  FIND_GROUPS = 'find_groups',
  GROUP_HISTORY = 'group_history',
  ADMIN_BROADCAST = 'admin_broadcast',
  CHALLENGE_RECAP = 'challenge_recap',
  CHALLENGE_RECAP_STORY = 'challenge_recap_story',
  SHARE_PROGRESS_CARD = 'share_progress_card',
  CHALLENGE_DETAIL_LEADERBOARD = 'challenge_detail_leaderboard',
  SUPPORT_HISTORY = 'support_history',
  SHARE_MY_PROFILE = 'share_my_profile',
  SCAN_QR_CODE = 'scan_qr_code',
  GROUP_JOIN_SHEET = 'group_join_sheet',
  ACHIEVEMENTS_HUB = 'achievements_hub',
  ACHIEVEMENT_DETAIL = 'achievement_detail',
  BADGE_UNLOCK = 'badge_unlock',
  LEVEL_UP_MODAL = 'level_up_modal',
  CONSISTENCY_DASHBOARD = 'consistency_dashboard',
  ADMIN_GROUP_CONSISTENCY = 'admin_group_consistency',
  GROUP_PERFORMANCE_REPORT = 'group_performance_report',
  ADMIN_INACTIVE_MEMBERS = 'admin_inactive_members',
  GROUP_RULES = 'group_rules',
  TEAM_ROOTING_CELEBRATION = 'team_rooting_celebration',
  CELEBRATORY_BADGE_DETAIL = 'celebratory_badge_detail',
  MODERN_ACHIEVEMENTS_HUB = 'modern_achievements_hub',
  TROPHY_ROOM = 'trophy_room',
  BADGE_DETAIL_MODAL = 'badge_detail_modal',
  YEAR_IN_REVIEW = 'year_in_review',
  NEW_YEAR_CHALLENGE = 'new_year_challenge'
}

export type TabType = 'home' | 'feed' | 'groups' | 'challenges';

export type ReactionType = 'like' | 'clap' | 'celebrate';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  time: string;
  content: string;
  type: 'workout' | 'streak' | 'text';
  likes: number;
  comments: number;
  exercise?: string;
  details?: string;
  reactions: Record<ReactionType, number>;
}

export interface Message {
  id: string;
  sender: string;
  avatar?: string;
  time: string;
  text: string;
  isSelf: boolean;
  image?: string;
  log?: {
    user: string;
    action: string;
    amount: string;
  };
}
