import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import SpendingChart from './components/SpendingChart';
import BudgetTracker from './components/BudgetTracker';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import { INITIAL_TRANSACTIONS, MONTHLY_DATA } from './data/initialData';

let nextId = INITIAL_TRANSACTIONS.length + 1;

export default function App() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showModal, setShowModal] = useState(false);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalBalance = 12840 + totalIncome - totalExpenses; // base balance
  const savings = totalIncome - totalExpenses;

  function handleAdd(data) {
    setTransactions((prev) => [
      { ...data, id: nextId++ },
      ...prev,
    ]);
    setShowModal(false);
  }

  function handleDelete(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-500 p-1.5">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Tony's Finance</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <SummaryCards
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          savings={savings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SpendingChart data={MONTHLY_DATA} />
          </div>
          <div className="lg:col-span-2">
            <BudgetTracker transactions={transactions} />
          </div>
        </div>

        <TransactionList transactions={transactions} onDelete={handleDelete} />
      </main>

      {showModal && <AddTransactionModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}
