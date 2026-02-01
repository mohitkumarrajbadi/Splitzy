
import { Bill, Roommate } from '../types';

/**
 * Note: These calls assume you have Vercel Serverless Functions 
 * in /api/sync that interact with @vercel/postgres.
 */

export const syncToCloud = async (data: { 
  groupName: string; 
  roommates: Roommate[]; 
  bills: Bill[] 
}) => {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Cloud sync failed');
    return await response.json();
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

export const fetchFromCloud = async (groupId: string) => {
  try {
    const response = await fetch(`/api/group/${groupId}`);
    if (!response.ok) throw new Error('Failed to fetch from cloud');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
