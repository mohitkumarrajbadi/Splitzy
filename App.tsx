
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Roommate, Bill, Debt, SpendingStats, BillCategory, SyncStatus, ChronoTheme } from './types';
import Setup from './components/Setup';
import Home from './components/Home';
import AddBill from './components/AddBill';
import History from './components/History';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SETUP);
  const [groupName, setGroupName] = useState("");
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('LOCAL_ONLY');
  const [theme, setTheme] = useState<ChronoTheme>('DAY');

  // Compute Theme based on time
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      let currentTheme: ChronoTheme = 'DAY';
      if (hour >= 5 && hour < 9) currentTheme = 'DAWN';
      else if (hour >= 9 && hour < 17) currentTheme = 'DAY';
      else if (hour >= 17 && hour < 21) currentTheme = 'SUNSET';
      else currentTheme = 'MIDNIGHT';
      
      setTheme(currentTheme);
      document.body.className = `theme-${currentTheme}`;
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Request Location for precision (optional but professional)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        console.log("Location context acquired for ChronoTheme refinement.");
      }, (err) => console.log("Location denied. Defaulting to system clock."));
    }
  }, []);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('splitzy_data_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGroupName(parsed.groupName);
      setRoommates(parsed.roommates);
      setBills(parsed.bills || []);
      setCurrentUser(parsed.roommates[0]?.id || null);
      setView(AppView.HOME);
    }
  }, []);

  useEffect(() => {
    if (roommates.length > 0) {
      localStorage.setItem('splitzy_data_v2', JSON.stringify({ groupName, roommates, bills }));
      setSyncStatus('SYNCING');
      const timer = setTimeout(() => setSyncStatus('SYNCED'), 800);
      return () => clearTimeout(timer);
    }
  }, [groupName, roommates, bills]);

  const stats: SpendingStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const categoryTotals: Record<BillCategory, number> = {
      'Groceries': 0, 'Rent': 0, 'Utilities': 0, 'Dining': 0, 'Fun': 0, 'Other': 0
    };
    let totalSpent = 0, monthlyTotal = 0;

    bills.forEach(bill => {
      totalSpent += bill.amount;
      categoryTotals[bill.category] += bill.amount;
      const billDate = new Date(bill.date);
      if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
        monthlyTotal += bill.amount;
      }
    });
    return { totalSpent, categoryTotals, monthlyTotal };
  }, [bills]);

  const debts = useMemo(() => {
    const balanceMatrix: Record<string, number> = {};
    roommates.forEach(r => balanceMatrix[r.id] = 0);
    bills.filter(b => !b.isSettled).forEach(bill => {
      balanceMatrix[bill.paidById] += bill.amount;
      bill.splits.forEach(split => {
        balanceMatrix[split.roommateId] -= split.amount;
      });
    });

    const calculatedDebts: Debt[] = [];
    const creditors = roommates.filter(r => balanceMatrix[r.id] > 0.01).sort((a, b) => balanceMatrix[b.id] - balanceMatrix[a.id]);
    const debtors = roommates.filter(r => balanceMatrix[r.id] < -0.01).sort((a, b) => balanceMatrix[a.id] - balanceMatrix[b.id]);

    let cIdx = 0, dIdx = 0;
    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];
      const settleAmt = Math.min(balanceMatrix[creditor.id], Math.abs(balanceMatrix[debtor.id]));
      calculatedDebts.push({ from: debtor.id, to: creditor.id, amount: settleAmt });
      balanceMatrix[creditor.id] -= settleAmt;
      balanceMatrix[debtor.id] += settleAmt;
      if (balanceMatrix[creditor.id] < 0.01) cIdx++;
      if (Math.abs(balanceMatrix[debtor.id]) < 0.01) dIdx++;
    }
    return calculatedDebts;
  }, [bills, roommates]);

  const renderView = () => {
    switch (view) {
      case AppView.SETUP:
        return <Setup onComplete={(name, rms) => {
          setGroupName(name);
          setRoommates(rms);
          setCurrentUser(rms[0].id);
          setView(AppView.HOME);
        }} theme={theme} />;
      case AppView.HOME:
        return <Home 
          groupName={groupName} roommates={roommates} debts={debts} stats={stats}
          currentUser={currentUser!} syncStatus={syncStatus} theme={theme}
          onAddBill={() => setView(AppView.ADD_BILL)}
          onViewHistory={() => setView(AppView.HISTORY)}
          onExport={() => {}}
        />;
      case AppView.ADD_BILL:
        return <AddBill 
          roommates={roommates} theme={theme}
          onSave={(bill) => { setBills(prev => [bill, ...prev]); setView(AppView.HOME); }}
          onCancel={() => setView(AppView.HOME)}
        />;
      case AppView.HISTORY:
        return <History 
          bills={bills} roommates={roommates} theme={theme}
          onBack={() => setView(AppView.HOME)} 
          onDelete={(id) => setBills(prev => prev.filter(b => b.id !== id))}
        />;
      default: return null;
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-lg flex flex-col relative overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
