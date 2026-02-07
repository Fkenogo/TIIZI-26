
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const HelpCenterScreen: React.FC<Props> = ({ onNavigate }) => {
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
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Help & Support Center</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Search */}
        <div className="p-5">
          <div className="flex h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl items-center px-5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-rounded text-slate-400 mr-4">search</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400" 
              placeholder="How can we help?" 
            />
          </div>
        </div>

        {/* Quick Links Grid */}
        <section className="px-5 space-y-4">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'rocket_launch', label: 'Getting Started' },
              { icon: 'groups', label: 'Groups & Challenges' },
              { icon: 'favorite', label: 'Pledges & Support' },
              { icon: 'shield_person', label: 'Account & Privacy' }
            ].map((link, i) => (
              <div key={i} className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 group cursor-pointer active:scale-95 transition-all">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-rounded">{link.icon}</span>
                </div>
                <p className="font-black text-xs uppercase tracking-tight leading-tight">{link.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-10">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-1 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-1">
            {[
              "Is Tiizi really free?",
              "How do I start a group challenge?",
              "What is a Group Wellness Fund?",
              "How can I withdraw my rewards?"
            ].map((faq, i) => (
              <div key={i} className="flex items-center justify-between py-6 border-b border-slate-50 dark:border-slate-800 group cursor-pointer">
                <p className="text-sm font-bold">{faq}</p>
                <span className="material-symbols-rounded text-slate-300 group-hover:text-primary transition-colors">expand_more</span>
              </div>
            ))}
          </div>
        </section>

        {/* Community Guides Horizontal Scroll */}
        <section className="space-y-4 pb-10">
          <h3 className="text-base font-black uppercase tracking-widest text-slate-400 px-6">Community Guides</h3>
          <div className="flex overflow-x-auto gap-4 px-5 no-scrollbar pb-2">
            {[
              { title: 'Building Accountability', sub: '5 min read • Tips', gradient: 'from-primary/30 to-primary/60' },
              { title: 'Maximizing Your Impact', sub: '8 min read • Wellness', gradient: 'from-[#ffd8a8] to-primary/40' },
              { title: 'Social Fitness 101', sub: '4 min read • Beginners', gradient: 'from-primary/20 to-primary/50' }
            ].map((guide, i) => (
              <div key={i} className="flex-none w-64 space-y-3 cursor-pointer group">
                <div className={`w-full h-40 rounded-[32px] bg-primary/10 flex items-center justify-center overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800`}>
                  <div className={`w-full h-full bg-gradient-to-br ${guide.gradient} transition-transform duration-700 group-hover:scale-110`}></div>
                </div>
                <div className="px-2">
                  <p className="font-black text-sm">{guide.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{guide.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50">
        <button className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
          <span className="material-symbols-rounded font-black">chat</span>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpCenterScreen;
