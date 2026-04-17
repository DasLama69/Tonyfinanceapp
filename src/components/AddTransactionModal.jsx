import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

const expenseCategories = CATEGORIES.filter((c) => c.id !== 'income');

export default function AddTransactionModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'income' ? { category: 'income' } : {}),
      ...(name === 'type' && value === 'expense' ? { category: 'food' } : {}),
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
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: t, category: t === 'income' ? 'income' : 'food' }))}
                className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Groceries, Salary…"
              className={inputCls}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Amount ($)</label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={inputCls}
            />
          </div>

          {/* Category */}
          {form.type === 'expense' && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className={inputCls} />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
