
import React, { useState } from 'react';
import { Roommate, Bill } from '../types';

interface AddBillProps {
  roommates: Roommate[];
  onSave: (bill: Bill) => void;
  onCancel: () => void;
}

const AddBill: React.FC<AddBillProps> = ({ roommates, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState(roommates[0].id);
  const [isCustom, setIsCustom] = useState(false);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>(
    Object.fromEntries(roommates.map(r => [r.id, ""]))
  );

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
      // Validate total
      const splitTotal = splits.reduce((s, split) => s + split.amount, 0);
      if (Math.abs(splitTotal - total) > 0.5) {
        alert("Split total doesn't match bill amount!");
        return;
      }
    }

    onSave({
      id: Date.now().toString(),
      title,
      amount: total,
      paidById: paidBy,
      date: new Date().toISOString(),
      splits,
      isSettled: false
    });
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-16 bg-[#161616] animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black">New Bill</h2>
        <button onClick={onCancel} className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
      </div>

      <div className="space-y-10 overflow-y-auto no-scrollbar pb-24">
        {/* Basic Info */}
        <div className="space-y-6">
          <input 
            className="w-full bg-transparent text-3xl font-bold border-none outline-none placeholder:text-zinc-800"
            placeholder="What for? (e.g. Rent)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex items-center border-b-2 border-zinc-800 focus-within:border-indigo-500 transition-colors pb-2">
            <span className="text-3xl font-black text-zinc-600 mr-2">₹</span>
            <input 
              type="number"
              className="w-full bg-transparent text-4xl font-black border-none outline-none placeholder:text-zinc-800"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Paid By */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-4 block">Paid By</label>
          <div className="flex flex-wrap gap-3">
            {roommates.map(r => (
              <button 
                key={r.id}
                onClick={() => setPaidBy(r.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                  paidBy === r.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-900 text-zinc-500'
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                <span className="font-bold text-sm">{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split Logic */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Split</label>
            <button 
              onClick={() => setIsCustom(!isCustom)}
              className="text-[10px] uppercase font-black tracking-widest text-indigo-500"
            >
              {isCustom ? 'Equal Split' : 'Custom Split'}
            </button>
          </div>

          {!isCustom ? (
            <div className="bg-zinc-900/50 rounded-3xl p-6 text-center border border-white/5">
              <p className="text-zinc-500 text-sm">Split equally between {roommates.length} people</p>
              {amount && <p className="text-xl font-black mt-2 text-white">₹{(parseFloat(amount) / roommates.length).toFixed(1)} <span className="text-xs text-zinc-600 font-normal">/ person</span></p>}
            </div>
          ) : (
            <div className="space-y-4">
              {roommates.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-zinc-900 rounded-3xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{r.emoji}</span>
                    <span className="font-bold text-sm">{r.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-zinc-600 font-bold mr-1">₹</span>
                    <input 
                      type="number"
                      placeholder="0"
                      className="bg-transparent w-20 text-right font-black outline-none border-b border-zinc-800 focus:border-indigo-500"
                      value={customSplits[r.id]}
                      onChange={e => setCustomSplits(prev => ({ ...prev, [r.id]: e.target.value }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-[#161616] via-[#161616] to-transparent pointer-events-none">
        <button 
          onClick={handleSave}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl active:scale-95 shadow-2xl shadow-indigo-500/20 transition-all pointer-events-auto"
        >
          Save Bill
        </button>
      </div>
    </div>
  );
};

export default AddBill;
