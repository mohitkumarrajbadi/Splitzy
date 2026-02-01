
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Mohit");
  const [vibe, setVibe] = useState("I build hard things and lift heavy.");

  const handleComplete = () => {
    // Fix: Corrected casing for IntentType ('BUILD', 'EXPLORE') and added missing UserProfile properties
    const mockProfile: UserProfile = {
      id: "me",
      name: name,
      age: 25,
      location: "Chennai",
      role: "AI Engineer",
      matchScore: 100,
      summary: "Full-stack engineer passionate about decentralized memory and high-performance systems.",
      tags: ["AI", "Rust", "Gym", "DeepTech"],
      vibe: vibe,
      imageUrl: "https://picsum.photos/400/400?random=self",
      whyMatched: "This is you!",
      skills: ["React", "FastAPI", "Python", "Logic Pro"],
      interests: ["Weightlifting", "Techno", "SaaS Engineering"],
      availability: ["BUILD", "EXPLORE"],
      trustScore: 98,
      verified: true,
      linkedAccounts: {
        github: "mohit-dev",
        linkedin: "mohit-ai"
      }
    };
    onComplete(mockProfile);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="max-w-md w-full">
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black">Welcome to <span className="gradient-text">VYBE</span></h2>
            <p className="text-zinc-400">The first step to discovery is identity. Connect an account to let our AI build your baseline vibe.</p>
            <div className="grid gap-3">
              {['GitHub', 'Google', 'LinkedIn', 'Apple'].map(provider => (
                <button 
                  key={provider}
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-white/5 py-4 font-bold text-white hover:bg-white/10 transition-all border border-white/5"
                >
                  <span className="w-5 h-5 bg-zinc-700 rounded-full"></span>
                  Continue with {provider}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-1">
              <img src="https://picsum.photos/200/200" className="h-full w-full rounded-full object-cover" alt="Me" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Refine your vibe.</h3>
              <p className="text-sm text-zinc-500">AI auto-populated this from your GitHub. Sounds like you?</p>
              
              <div className="glass rounded-2xl p-6 text-left space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Display Name</label>
                  <input 
                    className="w-full bg-transparent text-xl font-bold focus:outline-none" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Your One-liner</label>
                  <textarea 
                    className="w-full bg-transparent text-sm focus:outline-none h-20 resize-none" 
                    value={vibe} 
                    onChange={e => setVibe(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={handleComplete}
              className="w-full rounded-full bg-white py-4 font-black text-black hover:bg-zinc-200 transition-all"
            >
              Enter the Network
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
