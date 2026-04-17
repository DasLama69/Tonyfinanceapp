import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';
import { fmt } from '../utils/finance';

function CatTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-slate-700/50 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-slate-300">{name}:</span>
        <span className="font-semibold text-white">{fmt(value)}</span>
      </div>
    </div>
  );
}

function BudgetCard({ category, spent, onUpdateBudget }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(category.budget));

  const pct = category.budget > 0 ? Math.min((spent / category.budget) * 100, 100) : 0;
  const overBudget = spent > category.budget && category.budget > 0;
  const nearBudget = !overBudget && pct >= 80;
  const remaining = category.budget - spent;

  function commitEdit() {
    const val = parseFloat(draft);
    if (!isNaN(val) && val >= 0) onUpdateBudget(category.id, val);
    else setDraft(String(category.budget));
    setEditing(false);
  }

  const barColor = overBudget ? '#f87171' : nearBudget ? '#fb923c' : category.color;

  return (
    <div className="glass-card card-hover rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${category.color}20` }}>
            <span className="w-3 h-3 rounded-full" style={{ background: category.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">{category.name}</p>
            <p className="text-xs text-slate-500">{pct.toFixed(0)}% used</p>
          </div>
        </div>
        {overBudget
          ? <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          : nearBudget
          ? <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
          : <CheckCircle className="h-4 w-4 text-emerald-500/50 shrink-0" />}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
        <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%`, background: barColor }} />
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Spent</p>
          <p className={`text-lg font-bold tabular-nums ${overBudget ? 'text-red-400' : 'text-slate-100'}`}>{fmt(spent)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-0.5 flex items-center justify-end gap-1">
            Budget
            <button onClick={() => { setEditing(true); setDraft(String(category.budget)); }}
              className="text-slate-600 hover:text-blue-400 transition-colors">
              <Edit3 className="h-3 w-3" />
            </button>
          </p>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditing(false); setDraft(String(category.budget)); } }}
              className="w-24 bg-slate-800 border border-blue-500/50 rounded-lg px-2 py-1 text-sm font-bold text-right text-blue-300 focus:outline-none tabular-nums"
            />
          ) : (
            <p className="text-lg font-bold tabular-nums text-slate-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => { setEditing(true); setDraft(String(category.budget)); }}>
              {fmt(category.budget)}
            </p>
          )}
        </div>
      </div>

      {/* Remaining */}
      <div className={`mt-3 pt-3 border-t border-slate-800/60 text-xs flex justify-between ${overBudget ? 'text-red-400' : 'text-slate-500'}`}>
        <span>{overBudget ? 'Over budget by' : 'Remaining'}</span>
        <span className="font-semibold">{overBudget ? fmt(Math.abs(remaining)) : fmt(remaining)}</span>
      </div>
    </div>
  );
}

export default function BudgetPage({ transactions, categories, updateBudget }) {
  const now = new Date();
  const expenseCategories = categories.filter((c) => c.id !== 'income');

  // Current month spending per category
  const spendMap = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const [y, m] = t.date.split('-').map(Number);
    if (y === now.getFullYear() && m === now.getMonth() + 1) {
      spendMap[t.category] = (spendMap[t.category] || 0) + t.amount;
    }
  });

  const totalBudget = expenseCategories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = expenseCategories.reduce((s, c) => s + (spendMap[c.id] || 0), 0);
  const overCount = expenseCategories.filter((c) => (spendMap[c.id] || 0) > c.budget && c.budget > 0).length;

  const donutData = expenseCategories
    .filter((c) => spendMap[c.id])
    .map((c) => ({ name: c.name, value: spendMap[c.id] || 0, color: c.color }));

  const budgetHealth = totalBudget > 0 ? Math.max(0, ((totalBudget - totalSpent) / totalBudget) * 100) : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Budget Tracker</h1>
        <p className="text-sm text-slate-500 mt-0.5">April 2026 — click any budget amount to edit</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Budget', value: fmt(totalBudget), color: 'text-slate-100' },
            { label: 'Total Spent', value: fmt(totalSpent), color: totalSpent > totalBudget ? 'text-red-400' : 'text-slate-100' },
            { label: 'Remaining', value: fmt(Math.max(0, totalBudget - totalSpent)), color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
          {/* Budget health bar */}
          <div className="col-span-3 glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Health</span>
              <div className="flex items-center gap-2 text-xs">
                {overCount > 0 && <span className="text-red-400 font-medium">{overCount} category{overCount !== 1 ? 's' : ''} over budget</span>}
                <span className={`font-bold text-sm ${budgetHealth > 20 ? 'text-emerald-400' : 'text-red-400'}`}>{budgetHealth.toFixed(0)}% remaining</span>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full progress-bar"
                style={{ width: `${(totalSpent / (totalBudget || 1)) * 100}%`, background: totalSpent > totalBudget ? '#f87171' : totalSpent / totalBudget > 0.8 ? '#fb923c' : '#10b981' }} />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>$0</span><span>{fmt(totalBudget)}</span>
            </div>
          </div>
        </div>

        {/* Spend donut */}
        <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Spend Distribution</p>
          <div className="relative">
            <PieChart width={140} height={140}>
              <Pie data={donutData} cx={65} cy={65} innerRadius={44} outerRadius={62}
                paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {donutData.map((e) => <Cell key={e.name} fill={e.color} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CatTooltip />} />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-white">{fmt(totalSpent)}</span>
              <span className="text-[9px] text-slate-500">spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {expenseCategories.map((cat) => (
          <BudgetCard key={cat.id} category={cat} spent={spendMap[cat.id] || 0} onUpdateBudget={updateBudget} />
        ))}
      </div>
    </div>
  );
}
