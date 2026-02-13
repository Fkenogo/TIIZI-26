import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import AppShell from '../components/AppShell';
import ChallengeCard from '../components/ChallengeCard';
import { useFirestoreCollection } from '../utils/useFirestore';
import { orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
  onToggleDark: () => void;
  isDark: boolean;
}

type ChallengeCategory = 'all' | 'solo' | 'group' | 'cause' | 'streak';

const ChallengesListScreen: React.FC<Props> = ({ onNavigate }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('all');
  const { items: challenges } = useFirestoreCollection<{
    id: string;
    title: string;
    subtitle?: string;
    objective?: string;
    timeframe?: string;
    progress?: number;
    participantsCount?: number;
    category?: ChallengeCategory;
    donationLabel?: string;
    primaryLabel?: string;
  }>(['challenges'], [orderBy('startDate', 'desc')]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      const haystack = `${item.title} ${item.subtitle || ''} ${item.objective || ''}`.toLowerCase();
      return haystack.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, selectedCategory]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFilters(false);
  };

  return (
    <AppShell className="font-display relative">
      <Header
        title="Challenge Hub"
        subtitle="Discover, join, and complete"
        leftAction={{ icon: 'arrow_back', onClick: () => onNavigate(AppView.GROUP_HOME) }}
        rightAction={{ icon: 'add_circle_outline', onClick: () => onNavigate(AppView.CREATE_CHALLENGE_TYPE) }}
      />

      <div className="p-5 space-y-5 pb-36 overflow-y-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/30 text-sm font-semibold"
              placeholder="Search by objective, type, or title"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="size-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-primary/5 transition-all active:scale-95"
          >
            <span className="material-icons-round text-primary">tune</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'solo', label: 'Solo' },
            { id: 'group', label: 'Group' },
            { id: 'cause', label: 'Cause' },
            { id: 'streak', label: 'Streak' }
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id as ChallengeCategory)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${selectedCategory === chip.id ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700'}`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <section className="space-y-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              subtitle={challenge.subtitle || ''}
              objective={challenge.objective || ''}
              timeframe={challenge.timeframe || ''}
              progress={challenge.progress || 0}
              participants={challenge.participantsCount || 0}
              category={challenge.category || 'group'}
              donationLabel={challenge.donationLabel}
              primaryLabel={challenge.primaryLabel || 'Join'}
              secondaryLabel={challenge.category === 'group' ? 'Leaderboard' : 'Details'}
              onPrimaryAction={() => {
                if (challenge.category === 'group') {
                  onNavigate((`${AppView.SETUP_CHALLENGE}?challengeId=${encodeURIComponent(challenge.id)}`) as AppView);
                  return;
                }
                if (challenge.category === 'cause') {
                  onNavigate(AppView.SETUP_CHALLENGE);
                  return;
                }
                onNavigate(AppView.NEW_YEAR_CHALLENGE);
              }}
              onSecondaryAction={() => {
                if (challenge.category === 'group') {
                  onNavigate((`${AppView.CHALLENGE_DETAIL_LEADERBOARD}?planId=${challenge.id}&from=challenges_list`) as AppView);
                  return;
                }
                onNavigate(AppView.SETUP_CHALLENGE);
              }}
            />
          ))}
          {filteredChallenges.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500">
              Create or join a group to start a challenge.
            </div>
          )}
        </section>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowFilters(false)}></div>
          <div className="relative bg-background-light dark:bg-slate-900 rounded-t-[40px] p-6 pb-10 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black">Filter Challenges</h3>
              <button onClick={resetFilters} className="text-primary text-xs font-black uppercase tracking-wider">Reset All</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Category</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'solo', label: 'Solo' },
                { id: 'group', label: 'Group' },
                { id: 'cause', label: 'Cause-based' },
                { id: 'streak', label: 'Streak-based' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id as ChallengeCategory)}
                  className={`h-12 rounded-xl border text-xs font-black uppercase tracking-wider ${selectedCategory === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 h-12 rounded-xl bg-primary text-white text-sm font-black uppercase tracking-wider"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <BottomNav activeTab="challenges" onNavigate={onNavigate} />
    </AppShell>
  );
};

export default ChallengesListScreen;
