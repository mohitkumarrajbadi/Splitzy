
import React from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onChatClick: (user: UserProfile) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onChatClick, onBack }) => {
  return (
    <div className="relative min-h-screen bg-black pb-40">
      <button onClick={onBack} className="fixed top-8 left-8 z-50 h-12 w-12 rounded-full glass flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={user.imageUrl} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
        
        {user.verified && (
          <div className="absolute top-8 right-8 px-4 py-2 glass rounded-full flex items-center gap-2">
            <span className="text-blue-400">🛡️</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Verified Human</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/20">
              ⚡ {user.matchScore}% Resonance
            </div>
            <h1 className="text-6xl font-black tracking-tighter">{user.name}, {user.age}</h1>
            <p className="text-xl font-medium text-zinc-400">{user.role} in {user.location}</p>
          </div>
          
          <button 
            onClick={() => onChatClick(user)}
            className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
          >
            Open Connection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Intent Summary</h3>
              <p className="text-2xl font-medium leading-snug text-zinc-300 italic">
                "{user.summary}"
              </p>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Match Rationale</h3>
              <div className="p-8 rounded-[2rem] glass border-l-2 border-purple-500/50 bg-white/[0.01]">
                <p className="text-lg text-zinc-400 leading-relaxed">
                  {user.whyMatched}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Universal Vibe</h3>
              <div className="flex flex-wrap gap-3">
                {user.tags.map(tag => (
                  <span key={tag} className="px-6 py-2.5 rounded-full bg-zinc-900 border border-white/5 text-sm font-bold text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-[2.5rem] glass space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Trust Factor</h4>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black">{user.trustScore}</div>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${user.trustScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Connections</h4>
                <div className="flex gap-3">
                  {/* Fixed: cast value to string to satisfy title property requirement */}
                  {Object.entries(user.linkedAccounts || {}).map(([key, value]) => (
                    <div key={key} title={value as string} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-help transition-colors">
                      <span className="opacity-50 grayscale">{key === 'github' ? '💻' : key === 'linkedin' ? '🔗' : '📸'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
