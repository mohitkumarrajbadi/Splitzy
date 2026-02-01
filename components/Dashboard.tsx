
import React from 'react';
import MagicPrompt from './MagicPrompt';

interface DashboardProps {
  onSearch: (query: string) => void;
  onProfileClick: (user: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSearch, onProfileClick }) => {
  const categories = [
    { label: 'Build', icon: '🛠️', color: 'from-blue-500/10' },
    { label: 'Date', icon: '❤️', color: 'from-rose-500/10' },
    { label: 'Explore', icon: '🌍', color: 'from-green-500/10' },
    { label: 'Trade', icon: '💎', color: 'from-amber-500/10' }
  ];

  return (
    <div className="flex min-h-screen flex-col px-6 pt-24 pb-32 md:px-12 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4 gradient-text">
            What's your intent?
          </h1>
          <p className="text-zinc-500 text-lg font-medium">Search for people, not apps.</p>
        </header>

        <MagicPrompt onSearch={onSearch} />

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button 
              key={cat.label}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b ${cat.color} to-transparent border border-white/5 hover:border-white/10 transition-all hover:translate-y-[-4px] active:scale-95`}
            >
              <span className="text-3xl mb-3">{cat.icon}</span>
              <span className="text-sm font-bold tracking-wide uppercase opacity-60">{cat.label}</span>
            </button>
          ))}
        </div>

        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Vibing Near You</h2>
            <button className="text-xs font-black uppercase tracking-widest text-zinc-500">View All</button>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="shrink-0 group w-48 aspect-[3/4] rounded-[2rem] overflow-hidden relative cursor-pointer active:scale-95 transition-all"
                onClick={() => onProfileClick({id: String(i), name: "User "+i, imageUrl: `https://picsum.photos/400/600?random=${i}`})}
              >
                <img src={`https://picsum.photos/400/600?random=${i}`} className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="font-bold">User {i}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">92% Match</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
