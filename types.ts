
export enum AppView {
  SETUP = 'SETUP',
  HOME = 'HOME',
  ADD_BILL = 'ADD_BILL',
  HISTORY = 'HISTORY',
  // Added views for VYBE integration
  DASHBOARD = 'DASHBOARD',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}

export interface Roommate {
  id: string;
  name: string;
  emoji: string;
}

export interface BillSplit {
  roommateId: string;
  amount: number;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  paidById: string;
  date: string;
  splits: BillSplit[];
  isSettled: boolean;
}

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

export interface UserBalance {
  roommateId: string;
  net: number; // Positive = owed, Negative = owes
}

// VYBE Social App Types
// Defines the possible search intents for the matching engine
export type IntentType = 'BUILD' | 'DATE' | 'EXPLORE' | 'TRADE' | 'STAY' | 'UNKNOWN';

// Represents a user profile within the VYBE social graph
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  role: string;
  matchScore: number;
  summary: string;
  tags: string[];
  vibe: string;
  imageUrl: string;
  whyMatched: string;
  skills?: string[];
  interests?: string[];
  availability?: IntentType[];
  trustScore: number;
  verified: boolean;
  linkedAccounts?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

// Represents a message in the chat interface
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}
