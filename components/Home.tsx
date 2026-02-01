
import React from 'react';
import { Roommate, Debt, SpendingStats, BillCategory } from '../types';

interface HomeProps {
  groupName: string;
  roommates: Roommate[];
  debts: Debt[];
  stats: SpendingStats;
  currentUser: string;
  onAddBill: () => void;
  onViewHistory: () => void;
  onExport: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  groupName, 
  roommates, 
  debts, 
  stats, 
  currentUser, 
  onAddBill, 
  onViewHistory,
  onExport
}) => {
  const myOwed = debts.filter(d => d.to === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const myDebt = debts.filter(d => d.from === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const net = myOwed - myDebt;

  const getRmate = (id: string) => roommates.find(r => r.id === id);

  const categoryIcons: Record<BillCategory, string> = {
    'Groceries': '🛒',
    'Rent': '🏠',
    'Utilities': '🔌',
    'Dining': '🍕',
    'Fun': '🎉',
    'Other': '📦'
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{groupName}</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Spending Hub</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExport}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg active:scale-90 transition-all"
            title="Export JSON"
          >
            💾
          </button>
          <button 
            onClick={onViewHistory}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl active:scale-90 transition-all"
          >
            📜
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className={`p-8 rounded-[2.5rem] card-shadow mb-8 flex flex-col items-center justify-center text-center transition-colors duration-500 ${
        net > 0 ? 'bg-emerald-950/20 border border-emerald-500/20' : 
        net < 0 ? 'bg-rose-950/20 border border-rose-500/20' : 'bg-zinc-900'
      }`}>
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-4">Your Net Balance</p>
        <h2 className={`text-5xl font-black mb-2 tracking-tighter ${net > 0 ? 'text-emerald-400' : net < 0 ? 'text-rose-400' : 'text-white'}`}>
          {net === 0 ? '₹0' : (net > 0 ? `+₹${net.toFixed(0)}` : `-₹${Math.abs(net).toFixed(0)}`)}
        </h2>
        <p className="text-sm font-medium opacity-60">
          {net > 0 ? 'You are owed' : net < 0 ? 'You owe overall' : 'You are all settled up!'}
        </p>
      </div>

      {/* Spending Insights */}
      <div className="mb-8 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2">Spending Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Total Spent</p>
            <p className="text-xl font-black">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">This Month</p>
            <p className="text-xl font-black text-indigo-400">₹{stats.monthlyTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Categories Progress */}
        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">By Category</p>
          <div className="space-y-3">
            {(Object.entries(stats.categoryTotals) as [BillCategory, number][])
              .filter(([_, val]) => val > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, val]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">{categoryIcons[cat]} {cat}</span>
                    <span>₹{val.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(val / stats.totalSpent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Debts List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2">Current Dues</h3>
        
        {debts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-30">
            <span className="text-4xl">🧘</span>
            <p className="font-bold text-sm italic">Clean slate. Nice.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-24">
            {debts.map((debt, idx) => {
              const from = getRmate(debt.from);
              const to = getRmate(debt.to);
              const isRelevant = debt.from === currentUser || debt.to === currentUser;

              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-5 rounded-3xl transition-all ${
                    isRelevant ? 'bg-white/5 border border-white/5' : 'opacity-40 grayscale'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="text-xl bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-2xl">{from?.emoji}</span>
                      <span className="absolute -right-1 -bottom-1 text-[10px] bg-indigo-600 rounded-full w-4 h-4 flex items-center justify-center">→</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {from?.name} <span className="text-zinc-600 text-xs font-normal">to</span> {to?.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Pending</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${debt.from === currentUser ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ₹{debt.amount.toFixed(0)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pt-0 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pointer-events-none">
        <button 
          onClick={onAddBill}
          className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-white/5 transition-all pointer-events-auto"
        >
          <span>+</span> Add Bill
        </button>
      </div>
    </div>
  );
};

export default Home;
