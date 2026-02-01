
import React from 'react';
import { Bill, Roommate, BillCategory } from '../types';

interface HistoryProps {
  bills: Bill[];
  roommates: Roommate[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ bills, roommates, onBack, onDelete }) => {
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
    <div className="flex-1 flex flex-col p-8 pt-16 bg-[#121212]">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-2xl hover:scale-110 active:scale-90 transition-all">←</button>
        <div>
          <h2 className="text-2xl font-black">Bill History</h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{bills.length} total entries</p>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
          <span className="text-5xl">🏜️</span>
          <p className="font-bold">No bills recorded yet.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
          {bills.map((bill) => {
            const payer = getRmate(bill.paidById);
            return (
              <div 
                key={bill.id} 
                className={`relative group bg-zinc-900 rounded-[2rem] p-6 border border-white/5 transition-all ${
                  bill.isSettled ? 'opacity-40 grayscale blur-[0.5px]' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-black p-1 rounded-md">{categoryIcons[bill.category || 'Other']}</span>
                      <h4 className="text-lg font-black tracking-tight">{bill.title}</h4>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(bill.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">₹{bill.amount.toFixed(0)}</p>
                    {bill.isSettled && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Settled</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-zinc-500">Paid by</span>
                  <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1 rounded-full">
                    <span className="text-xs">{payer?.emoji}</span>
                    <span className="text-[11px] font-bold text-zinc-300">{payer?.name}</span>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {bill.splits.map(s => {
                    const r = getRmate(s.roommateId);
                    return (
                      <div key={s.roommateId} className="shrink-0 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
                        <span className="text-[10px]">{r?.emoji}</span>
                        <span className="text-[10px] font-bold text-zinc-500">₹{s.amount.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => confirm("Delete this bill?") && onDelete(bill.id)}
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
