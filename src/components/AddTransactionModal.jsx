import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

export default function AddTransactionModal({ onAdd, onClose, categories }) {
  const expenseCats = categories.filter((c) => c.id !== 'income');

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((p) => ({
      ...p,
      [field]: value,
      ...(field === 'type' ? { category: value === 'income' ? 'income' : 'food' } : {}),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) return setError('Description is required.');
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) return setError('Enter a valid positive amount.');
    setError('');
    onAdd({ ...form, amount });
  }

  const inputCls =
    'w-full bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-slate-800 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md glass-card rounded-2xl shadow-2xl border-slate-700/40 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <div>
            <h2 className="font-bold text-white">New Transaction</h2>
            <p className="text-xs text-slate-500 mt-0.5">Record income or expense</p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-slate-800/60 rounded-xl">
            {['expense', 'income'].map((t) => (
              <button key={t} type="button" onClick={() => set('type', t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  form.type === t
                    ? t === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Salary, Netflix, Groceries…"
              className={inputCls}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0.00"
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>

          {/* Category (expense only) */}
          {form.type === 'expense' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                {expenseCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={inputCls}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 hover:text-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 shadow-lg ${
                form.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
              }`}>
              Add {form.type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
