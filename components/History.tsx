
import React from 'react';
import { Bill, Roommate, BillCategory, ChronoTheme } from '../types';

interface HistoryProps {
  bills: Bill[];
  roommates: Roommate[];
  theme: ChronoTheme;
  onBack: () => void;
  onDelete: (id: string) => void;
}

// Fixed HistoryProps to include the 'theme' prop required by the App component
const History: React.FC<HistoryProps> = ({ bills, roommates, theme, onBack, onDelete }) => {
  const getRmate = (id: string) => roommates.find(r => r.id === id);

  const categoryIcons: Record<BillCategory, string> = {
    'Groceries': '🛒', 'Rent': '🏠', 'Utilities': '🔌', 'Dining': '🍕', 'Fun': '🎉', 'Other': '📦'
  };

  return (
    <div className="flex-1 flex flex-col px-7 pt-16 pb-10 animate-soft-fade-up">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="h-10 w-10 flex items-center justify-center rounded-full surface hover:bg-zinc-800 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Timeline</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{bills.length} total events</p>
        </div>
      </header>

      {bills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-20">
          <span className="text-5xl mb-6">🗞️</span>
          <p className="text-sm font-bold uppercase tracking-widest leading-loose">The record is currently empty</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
          {bills.map((bill) => {
            const payer = getRmate(bill.paidById);
            return (
              <div 
                key={bill.id} 
                className={`surface rounded-[2rem] p-6 relative group transition-all duration-500 ${
                  bill.isSettled ? 'opacity-40 grayscale blur-[0.3px]' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center text-xl border border-white/5">
                      {categoryIcons[bill.category || 'Other']}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{bill.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {new Date(bill.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">₹{bill.amount.toFixed(0)}</p>
                    {bill.isSettled && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Settled</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px]">{payer?.emoji}</div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Paid by {payer?.name}</span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {bill.splits.slice(0, 3).map(s => {
                      const r = getRmate(s.roommateId);
                      return (
                        <div key={s.roommateId} className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] border border-black" title={r?.name}>
                          {r?.emoji}
                        </div>
                      );
                    })}
                    {bill.splits.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black border border-black">
                        +{bill.splits.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => confirm("Remove this event?") && onDelete(bill.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-500 hover:scale-110 active:scale-90"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
