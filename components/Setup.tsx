
import React, { useState } from 'react';
import { Roommate, ChronoTheme } from '../types';

interface SetupProps {
  onComplete: (name: string, roommates: Roommate[]) => void;
  theme: ChronoTheme;
}

const Setup: React.FC<SetupProps> = ({ onComplete, theme }) => {
  const [groupName, setGroupName] = useState("");
  const [rms, setRms] = useState<Roommate[]>([
    { id: '1', name: '', emoji: '👤' },
    { id: '2', name: '', emoji: '👤' }
  ]);

  const addRoommate = () => {
    setRms([...rms, { id: Date.now().toString(), name: '', emoji: '👤' }]);
  };

  const updateRmate = (id: string, name: string) => {
    setRms(prev => prev.map(r => r.id === id ? { ...r, name } : r));
  };

  const canFinish = groupName.trim() && rms.filter(r => r.name.trim()).length >= 2;

  const isDark = theme === 'MIDNIGHT' || theme === 'SUNSET';

  return (
    <div className="flex-1 flex flex-col p-10 pt-32 animate-reveal">
      <div className="mb-20">
        <div className="h-16 w-16 mb-8 rounded-3xl surface flex items-center justify-center text-3xl shadow-sm">
          🏢
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">Splitzy</h1>
        <p className="text-lg font-medium opacity-40 leading-snug">Distilling roommate finances <br/>into pure clarity.</p>
      </div>

      <div className="space-y-16 flex-1">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Workspace Name</span>
          </div>
          <input 
            className="w-full bg-transparent text-4xl font-black border-none outline-none placeholder:opacity-5 pb-4 border-b border-zinc-500/10 focus:border-zinc-500/40 transition-all"
            placeholder="e.g. OMR Residence"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-1">Participant Roster</label>
          <div className="space-y-3">
            {rms.map((r, idx) => (
              <div key={r.id} className="surface flex items-center gap-5 p-5 rounded-[2.5rem] group hover:border-zinc-500/30 transition-all">
                <span className="text-2xl h-14 w-14 flex items-center justify-center bg-zinc-500/5 rounded-3xl transition-transform group-focus-within:scale-110">
                  👤
                </span>
                <input 
                  className="flex-1 bg-transparent text-xl font-bold border-none outline-none placeholder:opacity-10"
                  placeholder={`Occupant ${idx + 1}`}
                  value={r.name}
                  onChange={e => updateRmate(r.id, e.target.value)}
                />
              </div>
            ))}
            {rms.length < 6 && (
              <button 
                onClick={addRoommate}
                className="w-full py-6 rounded-[2.5rem] border-2 border-dashed border-zinc-500/10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:border-zinc-500/30 transition-all hardware-btn"
              >
                + Append New Occupant
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <button 
          disabled={!canFinish}
          onClick={() => onComplete(groupName, rms.filter(r => r.name.trim()))}
          className={`w-full py-6 rounded-full font-black text-lg transition-all hardware-btn shadow-2xl ${
            canFinish 
              ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
              : 'surface opacity-20 cursor-not-allowed'
          }`}
        >
          Initialize Engine
        </button>
      </div>
    </div>
  );
};

export default Setup;
