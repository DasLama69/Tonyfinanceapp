import { useState, useMemo } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { fmt, fmtDate } from '../utils/finance';

const CATEGORY_ICONS = {
  housing: '🏠', food: '🍔', transport: '🚗', entertainment: '🎬',
  health: '❤️', shopping: '🛍️', utilities: '⚡', other: '•', income: '💰',
};

export default function TransactionsPage({ transactions, categories, onDelete }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const expCats = categories.filter((c) => c.id !== 'income');

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  }

  const filtered = useMemo(() => {
    let list = transactions;
    if (search) list = list.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
    if (catFilter !== 'all') list = list.filter((t) => t.category === catFilter);
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [transactions, search, typeFilter, catFilter, sortField, sortDir]);

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  function SortIcon({ field }) {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-blue-400" />
      : <ChevronDown className="h-3.5 w-3.5 text-blue-400" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} of {transactions.length} records</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-emerald-400 font-semibold">{fmt(totalIncome)} in</span>
          <span className="text-red-400 font-semibold">{fmt(totalExpense)} out</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'income', 'expense'].map((t) => (
            <button key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                typeFilter === t
                  ? t === 'all' ? 'bg-blue-600 text-white' : t === 'income' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60'
              }`}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
        >
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5 flex items-center gap-1.5 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('description')}>
            Description <SortIcon field="description" />
          </div>
          <div className="col-span-2 hidden sm:flex items-center gap-1.5">Category</div>
          <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('date')}>
            Date <SortIcon field="date" />
          </div>
          <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5 justify-end cursor-pointer hover:text-slate-300 transition-colors" onClick={() => toggleSort('amount')}>
            Amount <SortIcon field="amount" />
          </div>
          <div className="col-span-1 hidden sm:block" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">No transactions match your filters.</div>
          ) : (
            filtered.map((t) => {
              const cat = categories.find((c) => c.id === t.category);
              return (
                <div key={t.id} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/3 transition-colors group items-center">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
                      style={{ background: `${cat?.color || '#94a3b8'}20` }}>
                      {CATEGORY_ICONS[t.category] || '•'}
                    </div>
                    <span className="text-sm text-slate-100 font-medium truncate">{t.description}</span>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: `${cat?.color || '#94a3b8'}18`, color: cat?.color || '#94a3b8' }}>
                      {cat?.name || t.category}
                    </span>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-xs text-slate-500">{fmtDate(t.date)}</div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                    </span>
                  </div>
                  <div className="col-span-1 hidden sm:flex justify-end">
                    <button onClick={() => onDelete(t.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/80 text-xs text-slate-500">
            <span>{filtered.length} transactions</span>
            <div className="flex items-center gap-4">
              <span>In: <span className="text-emerald-400 font-semibold">{fmt(totalIncome)}</span></span>
              <span>Out: <span className="text-red-400 font-semibold">{fmt(totalExpense)}</span></span>
              <span>Net: <span className={`font-semibold ${totalIncome - totalExpense >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{fmt(totalIncome - totalExpense)}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
