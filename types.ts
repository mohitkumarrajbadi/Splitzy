
export enum AppView {
  SETUP = 'SETUP',
  HOME = 'HOME',
  ADD_BILL = 'ADD_BILL',
  HISTORY = 'HISTORY',
  DASHBOARD = 'DASHBOARD',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}

export type BillCategory = 'Groceries' | 'Rent' | 'Utilities' | 'Dining' | 'Fun' | 'Other';

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
  category: BillCategory;
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

export interface SpendingStats {
  totalSpent: number;
  categoryTotals: Record<BillCategory, number>;
  monthlyTotal: number;
}

export interface UserBalance {
  roommateId: string;
  net: number; // Positive = owed, Negative = owes
}

// VYBE Social App Types
export type IntentType = 'BUILD' | 'DATE' | 'EXPLORE' | 'TRADE' | 'STAY' | 'UNKNOWN';

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

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}
