
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { getIcebreakers } from '../services/geminiService';

interface ChatViewProps {
  targetUser: UserProfile;
  currentUser: UserProfile;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ targetUser, currentUser, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'system',
      text: `You matched because you both have deep interests in ${targetUser.tags.slice(0, 2).join(' and ')}.`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIcebreakers = async () => {
      const ideas = await getIcebreakers(currentUser, targetUser);
      setIcebreakers(ideas);
    };
    fetchIcebreakers();
  }, [currentUser, targetUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputText("");

    // Simple echo bot for demo
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: targetUser.id,
        text: "That sounds awesome! I'd love to chat more about it. What's your current focus?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-white/5 px-6 py-4 bg-black/50 backdrop-blur-xl">
        <button onClick={onBack} className="text-zinc-500 hover:text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <img src={targetUser.imageUrl} className="h-10 w-10 rounded-full object-cover" alt="" />
          <div>
            <h3 className="font-bold">{targetUser.name}</h3>
            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Online</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'} ${msg.senderId === 'system' ? 'justify-center' : ''}`}
          >
            {msg.senderId === 'system' ? (
              <div className="rounded-full bg-zinc-900 px-4 py-1 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {msg.text}
              </div>
            ) : (
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-medium ${
                msg.senderId === currentUser.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-zinc-900 text-zinc-200'
              }`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Footer / Input */}
      <div className="border-t border-white/5 p-6 bg-black/50">
        {icebreakers.length > 0 && messages.length < 3 && (
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase text-zinc-600 mb-2">AI Icebreakers</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {icebreakers.map((ice, i) => (
                <button 
                  key={i} 
                  onClick={() => setInputText(ice)}
                  className="shrink-0 rounded-xl bg-white/5 border border-white/5 px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {ice}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 bg-zinc-900 rounded-2xl px-4 py-2">
          <input 
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent py-2 text-sm text-white focus:outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="rounded-xl bg-white p-2 text-black transition-all hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
