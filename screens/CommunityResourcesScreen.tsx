
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { useFirestoreCollection, useFirestoreDoc } from '../utils/useFirestore';
import { limit, orderBy } from 'firebase/firestore';

interface Props {
  onNavigate: (view: AppView) => void;
}

const CommunityResourcesScreen: React.FC<Props> = ({ onNavigate }) => {
  const featuredConstraints = useMemo(() => [orderBy('order', 'asc'), limit(1)], []);
  const guideConstraints = useMemo(() => [orderBy('order', 'asc')], []);
  const principleConstraints = useMemo(() => [orderBy('order', 'asc')], []);
  const supportConstraints = useMemo(() => [orderBy('order', 'asc')], []);
  const { data: config } = useFirestoreDoc<{ tickerMessage?: string }>(['communityResources', 'config']);
  const { items: featured } = useFirestoreCollection<{
    id: string;
    title?: string;
    description?: string;
    image?: string;
    ctaLabel?: string;
    ctaView?: string;
  }>(['communityResourcesFeatured'], featuredConstraints);
  const { items: guides } = useFirestoreCollection<{ id: string; icon?: string; title?: string; sub?: string }>(['communityResourceGuides'], guideConstraints);
  const { items: principles } = useFirestoreCollection<{ id: string; title?: string; description?: string; icon?: string; colorClass?: string }>(['communityResourcePrinciples'], principleConstraints);
  const { items: supportOptions } = useFirestoreCollection<{ id: string; label?: string; sub?: string; icon?: string }>(['communitySupportOptions'], supportConstraints);
  const featuredCard = featured[0];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-rounded">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Community Resources</h2>
      </header>

      {/* Ticker */}
      <div className="bg-primary/10 dark:bg-primary/5 px-5 py-2.5 border-y border-primary/20 flex items-center gap-3">
        <span className="material-symbols-rounded text-primary text-sm font-variation-fill">campaign</span>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary truncate">{config?.tickerMessage || ''}</p>
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Featured Card */}
        {featuredCard && (
          <div className="p-5">
            <div className="flex flex-col bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800">
              {featuredCard.image && (
                <div className="w-full aspect-[16/9] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${featuredCard.image}")` }}></div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-black mb-2">{featuredCard.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {featuredCard.description}
                </p>
                <button
                  onClick={() => onNavigate((featuredCard.ctaView || AppView.HELP_CENTER) as AppView)}
                  className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {featuredCard.ctaLabel || 'Open'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guides */}
        <section className="space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-6">Step-by-Step Guides</h3>
          <div className="bg-white dark:bg-slate-800 mx-5 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
            {guides.length === 0 && (
              <div className="px-5 py-6 text-sm text-slate-400">No guides available yet.</div>
            )}
            {guides.map((guide) => (
              <div key={guide.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-rounded">{guide.icon || 'assignment'}</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm">{guide.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{guide.sub}</p>
                </div>
                <span className="material-symbols-rounded text-slate-300">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="p-5">
          <div className="bg-secondary/10 dark:bg-secondary/5 rounded-[32px] p-8 border-2 border-secondary/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-rounded text-secondary text-3xl">diversity_3</span>
              <h3 className="text-xl font-black text-secondary">Tiizi Principles</h3>
            </div>
            <div className="space-y-8">
              {principles.length === 0 && (
                <div className="text-sm text-secondary/70">No principles set yet.</div>
              )}
              {principles.map((principle, index) => (
                <React.Fragment key={principle.id}>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight mb-2">{principle.title}</p>
                    <p className="text-sm text-secondary/80 dark:text-secondary/60 leading-relaxed italic">
                      {principle.description}
                    </p>
                  </div>
                  {index < principles.length - 1 && <div className="h-px bg-secondary/10"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Support Grid */}
        <section className="p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center">Need more help?</h3>
          <div className="grid grid-cols-2 gap-4">
            {supportOptions.length === 0 && (
              <div className="col-span-2 text-center text-sm text-slate-400">Support options will appear here.</div>
            )}
            {supportOptions.map((option) => (
              <div key={option.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] flex flex-col items-center gap-3 shadow-sm border border-slate-50 dark:border-slate-800 text-center">
                <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-rounded">{option.icon || 'support'}</span>
                </div>
                <div>
                  <p className="font-black text-sm">{option.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{option.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CommunityResourcesScreen;
