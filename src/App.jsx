import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import OverviewPage from './components/OverviewPage';
import AnalyticsPage from './components/AnalyticsPage';
import TransactionsPage from './components/TransactionsPage';
import BudgetPage from './components/BudgetPage';
import AddTransactionModal from './components/AddTransactionModal';
import { INITIAL_TRANSACTIONS, CATEGORIES } from './data/initialData';
import { computeMonthlyData, pctChange } from './utils/finance';

const STORAGE_KEY = 'tonyfinance_v2';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TRANSACTIONS;
}

let _nextId = Math.max(...INITIAL_TRANSACTIONS.map((t) => t.id)) + 1;

export default function App() {
  const [transactions, setTransactions] = useState(load);
  const [categories, setCategories] = useState(CATEGORIES);
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAdd = useCallback((data) => {
    setTransactions((prev) => [{ ...data, id: _nextId++ }, ...prev]);
    setShowModal(false);
  }, []);

  const handleDelete = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateBudget = useCallback((categoryId, budget) => {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, budget } : c)));
  }, []);

  // Compute metrics
  const monthlyData = computeMonthlyData(transactions);
  const now = new Date();

  function monthTotals(year, month) {
    const t = transactions.filter((tx) => {
      const [y, m] = tx.date.split('-').map(Number);
      return y === year && m === month;
    });
    const income = t.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const expenses = t.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
    const savingsRate = income > 0 ? (income - expenses) / income * 100 : 0;
    return { income, expenses, savingsRate };
  }

  const curMonth = monthTotals(now.getFullYear(), now.getMonth() + 1);
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = monthTotals(prevDate.getFullYear(), prevDate.getMonth() + 1);

  const allIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const allExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const metrics = {
    netBalance: allIncome - allExpenses,
    monthlyIncome: curMonth.income,
    monthlyExpenses: curMonth.expenses,
    savingsRate: curMonth.savingsRate,
    prevMonthIncome: prevMonth.income,
    prevMonthExpenses: prevMonth.expenses,
    prevSavingsRate: prevMonth.savingsRate,
  };

  return (
    <div className="hero-gradient">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setShowModal(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        {activeTab === 'overview' && (
          <OverviewPage transactions={transactions} categories={categories} metrics={metrics} monthlyData={monthlyData} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsPage transactions={transactions} categories={categories} monthlyData={monthlyData} />
        )}
        {activeTab === 'transactions' && (
          <TransactionsPage transactions={transactions} categories={categories} onDelete={handleDelete} />
        )}
        {activeTab === 'budget' && (
          <BudgetPage transactions={transactions} categories={categories} updateBudget={updateBudget} />
        )}
      </main>
      {showModal && (
        <AddTransactionModal onAdd={handleAdd} onClose={() => setShowModal(false)} categories={categories} />
      )}
    </div>
  );
}
