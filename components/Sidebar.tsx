
import React from 'react';
import { AppView, UserProfile } from '../types';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: UserProfile | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, currentUser }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Explore', icon: '✨' },
    { view: AppView.RESULTS, label: 'Search', icon: '🔍' },
    { view: AppView.CHAT, label: 'Messages', icon: '💬' },
    { view: AppView.PROFILE, label: 'My Vibe', icon: '👤' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-white/5 bg-black/80 p-4 backdrop-blur-xl md:top-0 md:bottom-0 md:h-full md:w-20 md:flex-col md:justify-start md:gap-8 md:border-r md:border-t-0 lg:w-64 lg:px-6">
      <div className="hidden items-center gap-3 lg:flex mb-10 mt-4" onClick={() => onNavigate(AppView.DASHBOARD)}>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center font-black text-white shadow-lg shadow-purple-500/20">
          V
        </div>
        <span className="text-2xl font-black tracking-tighter">VYBE</span>
      </div>
      
      <nav className="flex w-full items-center justify-around md:flex-col md:gap-4 lg:items-start">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center gap-1 transition-all md:flex-row md:gap-4 md:w-full md:p-3 md:rounded-xl lg:px-4 ${
              activeView === item.view 
                ? 'text-white bg-white/10' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium md:text-sm lg:text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden mt-auto md:flex items-center gap-3 lg:w-full lg:p-4 lg:rounded-2xl lg:bg-white/5 mb-6">
        <img 
          src={currentUser?.imageUrl || "https://picsum.photos/100/100"} 
          className="h-8 w-8 rounded-full lg:h-10 lg:w-10 ring-2 ring-purple-500/20"
          alt="User"
        />
        <div className="hidden lg:block">
          <p className="text-sm font-bold truncate">{currentUser?.name || "Anonymous"}</p>
          <p className="text-xs text-zinc-500">Premium Member</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
