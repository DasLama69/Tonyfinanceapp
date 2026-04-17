import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { fmt, fmtCompact } from '../utils/finance';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-2xl border border-slate-700/50">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-semibold text-white">
            {p.name === 'Savings Rate' ? `${p.value.toFixed(1)}%` : fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

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

const RANGES = ['3M', '6M', 'All'];

export default function AnalyticsPage({ transactions, categories, monthlyData }) {
  const [range, setRange] = useState('6M');

  const displayedMonthly = range === 'All' ? monthlyData : monthlyData.slice(range === '3M' ? -3 : -6);

  // Filter transactions by range
  const cutoffDate = new Date();
  if (range === '3M') cutoffDate.setMonth(cutoffDate.getMonth() - 3);
  else if (range === '6M') cutoffDate.setMonth(cutoffDate.getMonth() - 6);
  else cutoffDate.setFullYear(2000);

  const filteredTxns = transactions.filter((t) => {
    const [y, m, d] = t.date.split('-').map(Number);
    return new Date(y, m - 1, d) >= cutoffDate;
  });

  // Category breakdown
  const catMap = {};
  filteredTxns.filter((t) => t.type === 'expense').forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const categoryData = categories
    .filter((c) => c.id !== 'income' && catMap[c.id])
    .map((c) => ({ name: c.name, value: catMap[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const totalExpenses = categoryData.reduce((s, c) => s + c.value, 0);

  // Summary stats
  const totalIncome = filteredTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const avgMonthlySavings = displayedMonthly.length
    ? displayedMonthly.reduce((s, m) => s + m.savings, 0) / displayedMonthly.length
    : 0;
  const avgSavingsRate = displayedMonthly.length
    ? displayedMonthly.reduce((s, m) => s + m.savingsRate, 0) / displayedMonthly.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header + range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Financial performance overview</p>
        </div>
        <div className="flex items-center gap-1 glass-card rounded-xl p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === r ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Income', value: fmt(totalIncome), color: 'text-emerald-400' },
          { label: 'Total Expenses', value: fmt(totalExpenses), color: 'text-red-400' },
          { label: 'Avg Savings Rate', value: `${avgSavingsRate.toFixed(1)}%`, color: 'text-blue-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white">Monthly Comparison</h2>
            <p className="text-xs text-slate-500 mt-0.5">Income vs expenses by month</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-emerald-500 inline-block" /> Income</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-red-500 inline-block" /> Expenses</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={displayedMonthly} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.8)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={52} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" maxBarSize={44} />
            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category + savings rate row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-white">Expense Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">By category</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <PieChart width={130} height={130}>
                <Pie data={categoryData} cx={60} cy={60} innerRadius={42} outerRadius={60}
                  paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {categoryData.map((e) => <Cell key={e.name} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CatTooltip />} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-white">{fmt(totalExpenses)}</span>
                <span className="text-[9px] text-slate-500">total</span>
              </div>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {categoryData.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-slate-300 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-slate-400 font-medium tabular-nums">{fmt(c.value)}</span>
                      <span className="text-slate-600 w-7 text-right">{((c.value / totalExpenses) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full progress-bar" style={{ width: `${(c.value / totalExpenses) * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings rate trend */}
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="font-semibold text-white">Savings Rate Trend</h2>
            <p className="text-xs text-slate-500 mt-0.5">% of income saved each month</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayedMonthly} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.8)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}%`} width={42} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="savingsRate" stroke="#3b82f6" strokeWidth={2.5} name="Savings Rate"
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: 'rgba(59,130,246,0.3)', strokeWidth: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">Avg savings rate</span>
            <span className="text-blue-400 font-bold text-base">{avgSavingsRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
