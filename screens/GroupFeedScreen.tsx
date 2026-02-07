
import React, { useState } from 'react';
import { AppView, Post, ReactionType } from '../types';
import BottomNav from '../components/BottomNav';
import { useTiizi } from '../context/AppContext';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupFeedScreen: React.FC<Props> = ({ onNavigate }) => {
  const { state, reactToPost } = useTiizi();
  const { posts, user } = state;
  const [activeTab, setActiveTab] = useState('All Activities');

  const stories = [
    { label: '30-Day Plank', icon: '🏆', color: 'bg-orange-100 text-orange-600' },
    { label: "Sarah's 7-Day", img: 'https://picsum.photos/id/65/100/100' },
    { label: 'Group Milestone', img: 'https://picsum.photos/id/1/200/200' },
    { label: 'Push-Up Challenge', icon: '🏆', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 pt-12 flex justify-between items-center">
        <h1 className="text-xl font-bold">Group Feed</h1>
        <div className="flex items-center gap-3">
          <button className="p-1 text-slate-800 dark:text-white">
            <span className="material-icons-round text-2xl">search</span>
          </button>
          <button className="p-1 text-slate-800 dark:text-white relative">
            <span className="material-icons-round text-2xl">notifications_none</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
      </header>

      {/* Stories/Circle Highlights */}
      <div className="flex gap-5 overflow-x-auto px-6 py-2 no-scrollbar">
        {stories.map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className={`size-16 rounded-full p-1 border-2 border-primary/30 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm`}>
              {story.img ? (
                <img src={story.img} className="size-full rounded-full object-cover" alt={story.label} />
              ) : (
                <div className={`size-full rounded-full ${story.color} flex items-center justify-center text-2xl`}>
                  {story.icon}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-slate-400 max-w-[64px] text-center truncate">{story.label}</span>
          </div>
        ))}
      </div>

      {/* Pill Tabs */}
      <div className="flex gap-2.5 px-6 py-6 overflow-x-auto no-scrollbar">
        {['All Activities', 'Workouts Only', 'Achievements'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab 
              ? 'bg-primary/10 text-primary border border-primary/20' 
              : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
            }`}
          >
            {activeTab === tab && <span className="material-icons-round text-sm">check</span>}
            {tab}
          </button>
        ))}
      </div>

      <main className="flex-1 flex flex-col gap-6 px-4 pb-40 overflow-y-auto">
        {posts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <img alt={post.userName} className="size-11 rounded-full object-cover border-2 border-slate-50" src={post.avatar} />
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">{post.userName}</h3>
                  <p className="text-[10px] font-medium text-slate-400">{post.time}</p>
                </div>
              </div>
              <button className="text-slate-300"><span className="material-icons-round">more_horiz</span></button>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-5 text-[13px] font-medium leading-relaxed">
              {post.content}
            </p>

            {post.exercise && (
              <div className="bg-orange-50 dark:bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-rounded text-xl font-bold">fitness_center</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-xs uppercase tracking-widest">{post.exercise}</h4>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">{post.details}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
              <div className="flex gap-4 items-center">
                <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">favorite_border</span>
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-400">
                  <span className="material-icons-round text-lg">chat_bubble_outline</span>
                  <span className="text-xs font-bold">{post.comments}</span>
                </button>
              </div>
              
              <div className="flex gap-2">
                {[
                  { type: 'like', icon: '🔥', count: post.reactions.like },
                  { type: 'clap', icon: '💪', count: post.reactions.clap },
                  { type: 'celebrate', icon: '👏', count: post.reactions.celebrate }
                ].map((r) => (
                  <div key={r.type} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">
                    <span className="text-sm">{r.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sample inline comment preview from screenshot */}
            {post.userName === 'James Mwangi' && (
              <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-start gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  <span className="font-bold text-slate-800 dark:text-white">Sarah Kamau</span> Great job! Keep it up! 💪
                </p>
              </div>
            )}
          </article>
        ))}
      </main>

      <BottomNav activeTab="feed" onNavigate={onNavigate} />
    </div>
  );
};

export default GroupFeedScreen;
