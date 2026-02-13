import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import { useTiizi } from '../context/AppContext';
import AppShell from '../components/AppShell';
import StatsCard from '../components/StatsCard';
import ChallengeCard from '../components/ChallengeCard';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

const GroupHomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state } = useTiizi();
  const { user } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
  const hasActiveChallenge = !!state.activeChallenge?.id;

  const challengeTitle = activeGroup?.challengeTitle || state.activeChallenge.title || '';
  const challengeProgress = Math.max(0, Math.min(100, activeGroup?.challengeProgress ?? state.activeChallenge.progress ?? 0));
  const challengeDay = activeGroup?.challengeDay ?? 0;
  const challengeTotalDays = activeGroup?.challengeTotalDays ?? 0;
  const participants = activeGroup?.memberCount || 1;
  const hasChallenge = Boolean(challengeTitle);

  const groupRank = participants > 1 ? `Top ${Math.max(5, Math.round(100 / participants))}%` : 'Top 100%';
  const summaryStats = useMemo(() => ([
    { label: 'This Week', value: String(state.workouts.length), icon: 'fitness_center', view: hasActiveChallenge ? AppView.LOG_WORKOUT : undefined },
    { label: 'Group Rank', value: groupRank, icon: 'emoji_events', view: `${AppView.LEADERBOARD}?from=group_home` },
    { label: 'Streak', value: String(state.user.stats?.streak ?? 0), icon: 'local_fire_department', view: AppView.TROPHY_ROOM }
  ]), [groupRank, state.workouts.length, state.user.stats?.streak, hasActiveChallenge]);

  const recentActivities = useMemo(() => {
    const items: Array<{ title: string; desc: string; time: string; icon: string; color: string; view: AppView | string; key: string }> = [];
    state.workouts.slice(0, 2).forEach((workout) => {
      items.push({
        key: `workout-${workout.id}`,
        title: 'Workout Logged',
        desc: `${workout.exerciseName || workout.workoutType || 'Session'} recorded`,
        time: workout.createdAt || 'recent',
        icon: 'fitness_center',
        color: 'bg-blue-50 text-blue-500',
        view: AppView.CONSISTENCY_DASHBOARD
      });
    });
    state.posts.filter((post) => post.userId === state.user.authUid).slice(0, 2).forEach((post) => {
      items.push({
        key: `post-${post.id}`,
        title: post.type === 'workout' ? 'Group Workout Post' : 'Group Update',
        desc: post.content || 'New activity in your group feed',
        time: post.time || 'recent',
        icon: post.type === 'workout' ? 'local_fire_department' : 'dynamic_feed',
        color: 'bg-amber-50 text-amber-500',
        view: AppView.GROUP_FEED
      });
    });
    return items.slice(0, 3);
  }, [state.posts, state.workouts]);

  return (
    <AppShell>
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(AppView.PROFILE)}
            className="size-12 rounded-full border-2 border-primary p-0.5 shadow-sm active:scale-95 transition-transform"
          >
            <img
              src={user.avatar}
              alt="User"
              className="w-full h-full rounded-full object-cover grayscale"
            />
          </button>
          <div>
            <p className="text-xs text-slate-400 font-medium">Good session ahead</p>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none mt-0.5">{user.name}</h1>
          </div>
        </div>
        <button
          onClick={() => onNavigate(AppView.NOTIFICATIONS)}
          className="size-10 flex items-center justify-center text-slate-400 relative"
        >
          <span className="material-icons-round text-2xl">notifications_none</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </header>

      <main className="flex-1 px-5 pb-32 space-y-6 overflow-y-auto hide-scrollbar">
        <section>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = searchTerm.trim();
              const target = query ? `${AppView.FIND_GROUPS}?q=${encodeURIComponent(query)}` : AppView.FIND_GROUPS;
              onNavigate(target as AppView);
            }}
            className="flex h-12 bg-white dark:bg-slate-800 rounded-2xl items-center px-4 shadow-sm border border-slate-50 dark:border-white/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <span className="material-icons-round text-primary mr-3">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400"
              placeholder="Search groups"
            />
          </form>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {summaryStats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              onClick={stat.view ? () => onNavigate(stat.view as AppView) : undefined}
            />
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Challenge</h3>
            <button onClick={() => onNavigate(AppView.CHALLENGES_LIST)} className="text-primary text-xs font-semibold">Challenge Hub</button>
          </div>

          {hasChallenge ? (
            <ChallengeCard
              title={challengeTitle}
              subtitle={activeGroup?.name || 'Your group challenge'}
              objective={`Complete daily workouts for ${challengeTotalDays} days. Current day: ${challengeDay}.`}
              timeframe={`${challengeDay}/${challengeTotalDays} days`}
              progress={challengeProgress}
              participants={participants}
              category="group"
              primaryLabel={hasActiveChallenge ? 'Continue' : 'Join'}
              secondaryLabel="Leaderboard"
              onPrimaryAction={() => {
                if (hasActiveChallenge) {
                  onNavigate(AppView.LOG_WORKOUT);
                  return;
                }
                if (state.activeChallenge?.id) {
                  onNavigate((`${AppView.SETUP_CHALLENGE}?challengeId=${encodeURIComponent(state.activeChallenge.id)}`) as AppView);
                  return;
                }
                onNavigate(AppView.CHALLENGES_LIST);
              }}
              onSecondaryAction={() =>
                state.user.activePlan?.planId &&
                onNavigate((`${AppView.CHALLENGE_DETAIL_LEADERBOARD}?planId=${encodeURIComponent(state.user.activePlan.planId)}&from=group_home`) as AppView)
              }
            />
          ) : (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-4 text-sm text-slate-500">
              No active challenge yet.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <button onClick={() => onNavigate(AppView.GROUP_HISTORY)} className="text-slate-400 text-xs font-medium">History</button>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 && (
              <div className="w-full text-left bg-slate-50 dark:bg-slate-800/90 p-4 rounded-3xl shadow-sm border-2 border-slate-200/80 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">No recent activity yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Log your first workout to start momentum in your group.</p>
              </div>
            )}
            {recentActivities.map((activity) => (
              <button
                key={activity.key}
                onClick={() => onNavigate(activity.view as AppView)}
                className="w-full text-left bg-slate-50 dark:bg-slate-800/90 p-4 rounded-3xl shadow-sm border-2 border-slate-200/80 dark:border-slate-700 flex items-center gap-4 group hover:shadow-md transition-all active:scale-[0.99] hover:border-primary/30"
              >
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${activity.color}`}>
                  <span className="material-icons-round text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{activity.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{activity.desc}</p>
                </div>
                <p className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{activity.time}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab="home" onNavigate={onNavigate} />
    </AppShell>
  );
};

export default GroupHomeScreen;
