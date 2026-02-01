
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Roommate, Bill, Debt, SpendingStats, BillCategory } from './types';
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

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('splitzy_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGroupName(parsed.groupName);
      setRoommates(parsed.roommates);
      // Migrate old data if categories are missing
      const migratedBills = (parsed.bills || []).map((b: any) => ({
        ...b,
        category: b.category || 'Other'
      }));
      setBills(migratedBills);
      setCurrentUser(parsed.roommates[0]?.id || null);
      setView(AppView.HOME);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (roommates.length > 0) {
      localStorage.setItem('splitzy_data', JSON.stringify({ groupName, roommates, bills }));
    }
  }, [groupName, roommates, bills]);

  const stats: SpendingStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals: Record<BillCategory, number> = {
      'Groceries': 0,
      'Rent': 0,
      'Utilities': 0,
      'Dining': 0,
      'Fun': 0,
      'Other': 0
    };

    let totalSpent = 0;
    let monthlyTotal = 0;

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
    const creditors = roommates.filter(r => balanceMatrix[r.id] > 0.01)
      .sort((a, b) => balanceMatrix[b.id] - balanceMatrix[a.id]);
    const debtors = roommates.filter(r => balanceMatrix[r.id] < -0.01)
      .sort((a, b) => balanceMatrix[a.id] - balanceMatrix[b.id]);

    let cIdx = 0, dIdx = 0;
    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];
      const creditAmt = balanceMatrix[creditor.id];
      const debitAmt = Math.abs(balanceMatrix[debtor.id]);
      
      const settleAmt = Math.min(creditAmt, debitAmt);
      calculatedDebts.push({ from: debtor.id, to: creditor.id, amount: settleAmt });
      
      balanceMatrix[creditor.id] -= settleAmt;
      balanceMatrix[debtor.id] += settleAmt;

      if (balanceMatrix[creditor.id] < 0.01) cIdx++;
      if (Math.abs(balanceMatrix[debtor.id]) < 0.01) dIdx++;
    }

    return calculatedDebts;
  }, [bills, roommates]);

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      groupName,
      roommates,
      bills,
      stats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `splitzy_${groupName.toLowerCase().replace(/\s+/g, '_')}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderView = () => {
    switch (view) {
      case AppView.SETUP:
        return <Setup onComplete={(name, rms) => {
          setGroupName(name);
          setRoommates(rms);
          setCurrentUser(rms[0].id);
          setView(AppView.HOME);
        }} />;
      case AppView.HOME:
        return <Home 
          groupName={groupName} 
          roommates={roommates} 
          debts={debts} 
          stats={stats}
          currentUser={currentUser!}
          onAddBill={() => setView(AppView.ADD_BILL)}
          onViewHistory={() => setView(AppView.HISTORY)}
          onExport={exportData}
        />;
      case AppView.ADD_BILL:
        return <AddBill 
          roommates={roommates} 
          onSave={(bill) => {
            setBills(prev => [bill, ...prev]);
            setView(AppView.HOME);
          }}
          onCancel={() => setView(AppView.HOME)}
        />;
      case AppView.HISTORY:
        return <History 
          bills={bills} 
          roommates={roommates}
          onBack={() => setView(AppView.HOME)} 
          onDelete={(id) => setBills(prev => prev.filter(b => b.id !== id))}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md bg-[#121212] flex flex-col relative overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
