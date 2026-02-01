
import React from 'react';
import { Roommate, Debt } from '../types';

interface HomeProps {
  groupName: string;
  roommates: Roommate[];
  debts: Debt[];
  currentUser: string;
  onAddBill: () => void;
  onViewHistory: () => void;
}

const Home: React.FC<HomeProps> = ({ groupName, roommates, debts, currentUser, onAddBill, onViewHistory }) => {
  const myOwed = debts.filter(d => d.to === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const myDebt = debts.filter(d => d.from === currentUser).reduce((sum, d) => sum + d.amount, 0);
  const net = myOwed - myDebt;

  const getRmate = (id: string) => roommates.find(r => r.id === id);

  return (
    <div className="flex-1 flex flex-col p-6 pt-16">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{groupName}</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Dashboard</p>
        </div>
        <button 
          onClick={onViewHistory}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl active:scale-90 transition-all"
        >
          📜
        </button>
      </div>

      {/* Summary Card */}
      <div className={`p-8 rounded-[2.5rem] card-shadow mb-12 flex flex-col items-center justify-center text-center transition-colors duration-500 ${
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

      {/* Debts List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2">Current Dues</h3>
        
        {debts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
            <span className="text-4xl">🧘</span>
            <p className="font-bold text-sm italic">Clean slate. Nice.</p>
          </div>
        ) : (
          <div className="space-y-3">
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

      <button 
        onClick={onAddBill}
        className="mt-8 py-5 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-white/5 transition-all"
      >
        <span>+</span> Add Bill
      </button>
    </div>
  );
};

export default Home;
