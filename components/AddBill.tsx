
import React, { useState } from 'react';
import { Roommate, Bill, BillCategory, ChronoTheme } from '../types';

interface AddBillProps {
  roommates: Roommate[];
  theme: ChronoTheme;
  onSave: (bill: Bill) => void;
  onCancel: () => void;
}

const AddBill: React.FC<AddBillProps> = ({ roommates, theme, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<BillCategory>("Other");
  const [paidBy, setPaidBy] = useState(roommates[0].id);
  const [isCustom, setIsCustom] = useState(false);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>(
    Object.fromEntries(roommates.map(r => [r.id, ""]))
  );

  const categories: { label: BillCategory; icon: string }[] = [
    { label: 'Groceries', icon: '🛒' }, { label: 'Rent', icon: '🏠' },
    { label: 'Utilities', icon: '🔌' }, { label: 'Dining', icon: '🍕' },
    { label: 'Fun', icon: '🎉' }, { label: 'Other', icon: '📦' }
  ];

  const handleSave = () => {
    const total = parseFloat(amount);
    if (!title || !total) return;

    let splits;
    if (!isCustom) {
      const perPerson = total / roommates.length;
      splits = roommates.map(r => ({ roommateId: r.id, amount: perPerson }));
    } else {
      splits = roommates.map(r => ({ 
        roommateId: r.id, 
        amount: parseFloat(customSplits[r.id]) || 0 
      }));
    }

    onSave({
      id: Date.now().toString(),
      title, amount: total, category,
      paidById: paidBy, date: new Date().toISOString(),
      splits, isSettled: false
    });
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-20 pb-40 animate-reveal">
      <header className="flex justify-between items-center mb-16">
        <h2 className="text-2xl font-black tracking-tighter opacity-90">New Entry</h2>
        <button onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest opacity-30">Discard</button>
      </header>

      <div className="space-y-12 flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-1">Descriptor</p>
          <input 
            className="w-full bg-transparent text-4xl font-black border-none outline-none placeholder:opacity-10"
            placeholder="e.g. WiFi"
            value={title}
            autoFocus
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-1">Value</p>
          <div className="flex items-center">
            <span className="text-4xl font-black opacity-10 mr-3">₹</span>
            <input 
              type="number"
              className="w-full bg-transparent text-8xl font-black border-none outline-none placeholder:opacity-5"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-1">Category</p>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => (
              <button 
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                className={`h-24 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all hardware-btn ${
                  category === cat.label 
                    ? (theme === 'MIDNIGHT' ? 'bg-white text-black' : 'bg-black text-white') 
                    : 'surface opacity-40'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-1">Payor</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {roommates.map(r => (
              <button 
                key={r.id}
                onClick={() => setPaidBy(r.id)}
                className={`shrink-0 flex items-center gap-4 px-8 py-5 rounded-full transition-all hardware-btn ${
                  paidBy === r.id ? (theme === 'MIDNIGHT' ? 'bg-white text-black' : 'bg-black text-white') : 'surface opacity-40'
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-xs font-black uppercase tracking-widest">{r.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-10 flex justify-center pointer-events-none">
        <div className="max-w-sm w-full pointer-events-auto">
          <button 
            onClick={handleSave}
            disabled={!title || !amount}
            className={`w-full h-18 rounded-full font-black uppercase tracking-[0.2em] text-[13px] transition-all hardware-btn ${
              (!title || !amount) ? 'surface opacity-20' : (theme === 'MIDNIGHT' ? 'bg-white text-black' : 'bg-black text-white')
            }`}
          >
            Create Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBill;
