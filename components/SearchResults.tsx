
import React from 'react';
import { UserProfile } from '../types';

interface SearchResultsProps {
  results: UserProfile[];
  isLoading: boolean;
  query: string;
  onProfileClick: (user: UserProfile) => void;
  onChatClick: (user: UserProfile) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, query, onProfileClick, onChatClick }) => {
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <div className="text-center">
          <p className="text-xl font-bold">Finding your people...</p>
          <p className="text-zinc-500 mt-1 italic">"{query}"</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-6">🕵️‍♂️</span>
        <h2 className="text-3xl font-black mb-2">No direct matches.</h2>
        <p className="text-zinc-500 max-w-sm">Try broadening your prompt or checking your spelling. Our AI is picky about perfection.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 pb-32">
      <div className="mb-10">
        <h2 className="text-sm uppercase tracking-widest font-black text-zinc-600 mb-2">Search Results</h2>
        <h1 className="text-3xl font-black truncate max-w-2xl italic text-white/90">"{query}"</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((user) => (
          <div key={user.id} className="group glass flex flex-col rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all hover:translate-y-[-4px]">
            <div className="relative h-48 w-full">
              <img src={user.imageUrl} className="h-full w-full object-cover" alt={user.name} />
              <div className="absolute top-4 right-4 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-black text-white border border-white/10">
                {user.matchScore}% Match
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {user.name}, {user.age}
                  <span className="text-xs font-normal text-zinc-500">{user.location}</span>
                </h3>
                <p className="text-sm font-medium text-purple-400">{user.role}</p>
              </div>

              <div className="mb-4 rounded-xl bg-white/5 p-4">
                <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Why they fit</p>
                <p className="text-sm text-zinc-300 line-clamp-2">{user.whyMatched}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {user.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onChatClick(user)}
                  className="rounded-xl bg-purple-600 py-3 text-sm font-black text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20"
                >
                  Message
                </button>
                <button 
                  onClick={() => onProfileClick(user)}
                  className="rounded-xl glass py-3 text-sm font-black text-white hover:bg-white/5 transition-all"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
