
import React from 'react';
import MagicPrompt from './MagicPrompt';

interface LandingPageProps {
  onTryVybe: () => void;
  onSearch: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onTryVybe, onSearch }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center px-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[160px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full"></div>
      </div>

      <nav className="fixed top-0 w-full flex items-center justify-between p-8 z-50">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-black text-black">V</div>
          <span className="text-xl font-black tracking-tighter">VYBE</span>
        </div>
        <button 
          onClick={onTryVybe}
          className="px-6 py-2.5 rounded-full glass text-sm font-bold hover:bg-white hover:text-black transition-all duration-300"
        >
          Enter Network
        </button>
      </nav>

      <main className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.9] mb-10">
          Search for <br/> <span className="gradient-text">people.</span>
        </h1>
        
        <p className="text-zinc-500 text-lg md:text-2xl font-medium mb-16 max-w-xl">
          The first intent-driven social graph. <br/> Describe who you need. AI does the rest.
        </p>

        <div className="w-full max-w-2xl">
          <MagicPrompt onSearch={(q) => { onTryVybe(); onSearch(q); }} />
        </div>

        <div className="mt-16 flex gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-700">
          <span>Google Authenticated</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800 self-center"></span>
          <span>End-to-end Private</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800 self-center"></span>
          <span>Intent Verified</span>
        </div>
      </main>

      <footer className="fixed bottom-8 w-full text-center pointer-events-none opacity-20">
        <p className="text-[10px] font-black tracking-widest uppercase">Version 1.0.4 • Alpha Discovery</p>
      </footer>
    </div>
  );
};

export default LandingPage;
