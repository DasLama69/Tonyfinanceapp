import { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

function fmt(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all');

  const visible = transactions.filter((t) => {
    if (filter === 'income') return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true;
  });

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">Transactions</h2>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 capitalize transition-colors ${
                filter === f
                  ? 'bg-white shadow text-slate-800 font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {visible.length === 0 && (
          <p className="py-8 text-center text-slate-400 text-sm">No transactions found.</p>
        )}
        {visible.map((t) => {
          const cat = catMap[t.category] || catMap['other'];
          return (
            <div key={t.id} className="flex items-center gap-3 py-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                {t.type === 'income' ? (
                  <TrendingUp className="h-4 w-4" style={{ color: cat.color }} />
                ) : (
                  <TrendingDown className="h-4 w-4" style={{ color: cat.color }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                <p className="text-xs text-slate-400">{cat.name} · {t.date}</p>
              </div>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  t.type === 'income' ? 'text-emerald-500' : 'text-slate-700'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                className="ml-1 rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-400 transition-colors"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
