import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Card } from './components/Card';
import { TransactionForm } from './components/TransactionForm';
import { GoalList } from './components/GoalList';
import { Dashboard } from './components/Dashboard';
import { ShinChanAdvisor } from './components/ShinChanAdvisor';
import { Transaction, Goal, FinancialSummary, TransactionType } from './types';
import { getStoredTransactions, saveTransactions, getStoredGoals, saveGoals } from './services/storageService';
import { List, X } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  // Use a timestamp to trigger effect updates for AI
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Initialization
  useEffect(() => {
    const loadedTransactions = getStoredTransactions();
    const loadedGoals = getStoredGoals();
    setTransactions(loadedTransactions);
    setGoals(loadedGoals);
  }, []);

  // Persistence
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const summary: FinancialSummary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    setLastUpdate(Date.now());
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setLastUpdate(Date.now());
  };

  const handleAddGoal = (g: Goal) => {
    setGoals(prev => [...prev, g]);
    setLastUpdate(Date.now());
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setLastUpdate(Date.now());
  };

  const handleUpdateGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
        if (g.id === id) {
            return { ...g, currentAmount: g.currentAmount + amount };
        }
        return g;
    }));
    // Deduct from balance logically? 
    // For simplicity, we just treat goal saving as separate tracking or imply it comes from balance.
    // Let's add an expense transaction for saving to make it realistic
    const goal = goals.find(g => g.id === id);
    if (goal) {
        handleAddTransaction({
            id: crypto.randomUUID(),
            amount: amount,
            type: TransactionType.EXPENSE,
            category: '儲蓄',
            description: `存入: ${goal.name}`,
            date: new Date().toISOString()
        });
    }
  };

  const latestTransaction = transactions.length > 0 ? transactions[0] : null;

  return (
    <Layout>
      <ShinChanAdvisor 
        summary={summary} 
        latestTransaction={latestTransaction}
        goals={goals}
        lastUpdate={lastUpdate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card title="收支概況" color="white">
                <Dashboard summary={summary} transactions={transactions} />
            </Card>

            <Card title="記一筆" color="yellow">
                <TransactionForm onAdd={handleAddTransaction} />
            </Card>
        </div>

        <div className="space-y-6">
            <Card title="願望清單 (目標)" color="blue">
                <GoalList 
                    goals={goals} 
                    onAddGoal={handleAddGoal} 
                    onDeleteGoal={handleDeleteGoal}
                    onUpdateProgress={handleUpdateGoal}
                />
            </Card>

            <Card title="最近紀錄" color="white">
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                    {transactions.length === 0 && <p className="text-gray-400 text-center">還沒有紀錄喔～</p>}
                    {transactions.map(t => (
                        <div key={t.id} className="flex justify-between items-center p-3 border-2 border-black rounded-lg bg-gray-50 hover:bg-white transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold">{t.description}</span>
                                <span className="text-xs text-gray-500 bg-gray-200 px-1 rounded w-fit">{t.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`font-black text-lg ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount}
                                </span>
                                <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-300 hover:text-red-500">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </Layout>
  );
}
