
import React from 'react';
import { Roommate, Debt, SpendingStats, BillCategory, SyncStatus, ChronoTheme } from '../types';

interface HomeProps {
  groupName: string;
  roommates: Roommate[];
  debts: Debt[];
  stats: SpendingStats;
  currentUser: string;
  syncStatus: SyncStatus;
  theme: ChronoTheme;
  onAddBill: () => void;
  onViewHistory: () => void;
  onExport: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  groupName, roommates, debts, stats, currentUser, syncStatus, theme, onAddBill, onViewHistory 
}) => {
  const myOwed = debts.filter(d => d.to === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const myDebt = debts.filter(d => d.from === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const net = myOwed - myDebt;

  const getRmate = (id: string) => roommates.find(r => r.id === id);

  const greetings = {
    'DAWN': 'Good Morning',
    'DAY': 'Hello',
    'SUNSET': 'Good Evening',
    'MIDNIGHT': 'Good Night'
  };

  const isDark = theme === 'MIDNIGHT' || theme === 'SUNSET';

  return (
    <div className="flex-1 flex flex-col px-8 pt-20 pb-40 animate-reveal">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tighter opacity-90">{greetings[theme]},</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs">🏠</span>
            <p className="text-sm font-semibold opacity-40 uppercase tracking-widest">{groupName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onViewHistory} className="h-12 w-12 rounded-full surface flex items-center justify-center hardware-btn shadow-sm">
            <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Status Card */}
      <div className="surface rounded-[3.5rem] p-12 mb-12 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="text-5xl">{theme === 'MIDNIGHT' ? '🌙' : theme === 'SUNSET' ? '🌅' : '☀️'}</span>
        </div>
        
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-6">Aggregate Liquidity</p>
        <div className="flex items-start">
          <span className="text-2xl font-bold opacity-20 mt-2 mr-2">₹</span>
          <h2 className="text-8xl font-black tracking-tighter">
            {Math.abs(net).toLocaleString()}
          </h2>
        </div>
        
        <div className={`mt-8 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
          net > 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 
          net < 0 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/5'
        }`}>
          {net > 0 ? 'Surplus Balance' : net < 0 ? 'Pending Dues' : 'Account Settled'}
        </div>
      </div>

      {/* Insights Section */}
      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center px-1 mb-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Spending Dynamics</h3>
          <span className="text-[10px] font-bold opacity-40">Monthly Cycle</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="surface rounded-[2.5rem] p-8 border border-white/5">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Total</p>
            <p className="text-2xl font-black tracking-tight">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="surface rounded-[2.5rem] p-8 border border-white/5">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Status</p>
            <p className="text-2xl font-black tracking-tight">{stats.monthlyTotal > 0 ? 'Active' : 'Idle'}</p>
          </div>
        </div>
      </div>

      {/* Active Transfers List */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Inter-User Transfers</h3>
          <span className="text-[10px] font-bold opacity-20">{debts.length} PENDING</span>
        </div>
        
        <div className="space-y-3 pb-10">
          {debts.length === 0 ? (
            <div className="surface rounded-[2.5rem] p-16 flex flex-col items-center opacity-10 border-2 border-dashed border-zinc-500/10">
              <span className="text-4xl mb-4">🛡️</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No Active Dues</p>
            </div>
          ) : (
            debts.map((debt, idx) => {
              const from = getRmate(debt.from); const to = getRmate(debt.to);
              const isRelevant = debt.from === currentUser || debt.to === currentUser;
              return (
                <div key={idx} className={`surface rounded-[2.5rem] p-6 flex items-center justify-between hardware-btn border border-white/5 ${isRelevant ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-500/10 flex items-center justify-center text-2xl shadow-inner">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight">{from?.name}</p>
                      <div className="flex items-center gap-1 opacity-30">
                         <span className="text-[8px]">▶</span>
                         <p className="text-[10px] font-bold uppercase tracking-widest">Pay {to?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black tracking-tighter ${debt.from === currentUser ? 'text-rose-500' : 'text-emerald-500'}`}>
                      ₹{debt.amount.toFixed(0)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Primary Call to Action */}
      <div className="fixed bottom-0 left-0 right-0 p-10 pointer-events-none flex justify-center">
        <div className="w-full max-w-sm pointer-events-auto">
          <button 
            onClick={onAddBill}
            className={`w-full h-18 rounded-full font-black text-lg shadow-2xl transition-all hardware-btn flex items-center justify-center gap-4 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-lg ${isDark ? 'bg-black/5 text-black' : 'bg-white/10 text-white'}`}>+</div>
            <span className="uppercase tracking-[0.2em] text-[13px]">Add Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
