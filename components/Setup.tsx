
import React, { useState } from 'react';
import { Roommate } from '../types';

interface SetupProps {
  onComplete: (name: string, roommates: Roommate[]) => void;
}

const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  const [groupName, setGroupName] = useState("");
  const [rms, setRms] = useState<Roommate[]>([
    { id: '1', name: '', emoji: '🏠' },
    { id: '2', name: '', emoji: '👋' }
  ]);

  const addRoommate = () => {
    setRms([...rms, { id: Date.now().toString(), name: '', emoji: '👤' }]);
  };

  const updateRmate = (id: string, name: string) => {
    setRms(prev => prev.map(r => r.id === id ? { ...r, name } : r));
  };

  const canFinish = groupName.trim() && rms.filter(r => r.name.trim()).length >= 2;

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black mb-2 tracking-tight">Splitzy</h1>
      <p className="text-zinc-500 mb-12">Set up your flat group.</p>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-2 block">Group Name</label>
          <input 
            className="w-full bg-transparent text-2xl font-bold border-b-2 border-zinc-800 focus:border-indigo-500 outline-none pb-2 transition-colors"
            placeholder="e.g. OMR Flat"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-4 block">Roommates</label>
          <div className="space-y-4">
            {rms.map((r, idx) => (
              <div key={r.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                <span className="text-2xl bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-2xl">{r.emoji}</span>
                <input 
                  className="flex-1 bg-transparent text-lg font-semibold border-b border-zinc-900 focus:border-indigo-500 outline-none pb-1 transition-colors"
                  placeholder="Name"
                  value={r.name}
                  onChange={e => updateRmate(r.id, e.target.value)}
                />
              </div>
            ))}
            {rms.length < 5 && (
              <button 
                onClick={addRoommate}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 font-bold hover:border-zinc-600 transition-all active:scale-95"
              >
                + Add Member
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-12">
        <button 
          disabled={!canFinish}
          onClick={() => onComplete(groupName, rms.filter(r => r.name.trim()))}
          className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-xl ${
            canFinish ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-zinc-900 text-zinc-600'
          }`}
        >
          Let's Go
        </button>
      </div>
    </div>
  );
};

export default Setup;
