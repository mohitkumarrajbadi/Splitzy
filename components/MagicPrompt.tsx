
import React, { useState, useEffect } from 'react';

interface MagicPromptProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const MagicPrompt: React.FC<MagicPromptProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState(0);

  const placeholders = [
    "Find a cofounder for an AI startup...",
    "Looking for a gym partner in OMR...",
    "Sell my camera to a local creative...",
    "Serious marriage-minded AI engineer...",
    "A roommate who likes techno and cooking..."
  ];

  useEffect(() => {
    if (isFocused || query) return;
    const interval = setInterval(() => {
      setActivePlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full transition-all duration-500 ease-out ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}
    >
      <div className={`glass relative overflow-hidden rounded-[2rem] p-1 transition-all duration-500 ${isFocused ? 'prompt-active bg-zinc-900/40' : 'bg-zinc-900/20'}`}>
        <div className="flex items-center px-7 py-5">
          <div className={`mr-4 text-2xl transition-transform duration-500 ${isFocused ? 'rotate-12 scale-110' : 'rotate-0'}`}>
            ✨
          </div>
          <div className="relative flex-1">
            {!query && !isFocused && (
              <div className="pointer-events-none absolute inset-0 flex items-center text-zinc-600 text-lg md:text-xl font-medium animate-pulse">
                {placeholders[activePlaceholder]}
              </div>
            )}
            <input
              type="text"
              className="w-full bg-transparent text-lg md:text-xl font-medium text-white placeholder:text-zinc-700 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <button 
            type="submit"
            className={`ml-4 rounded-2xl bg-white p-3 text-black transition-all hover:scale-105 active:scale-95 ${query ? 'opacity-100' : 'opacity-20'}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default MagicPrompt;
