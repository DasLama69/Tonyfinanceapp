import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, Trash2, Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { fmt, fmtCompact, fmtDate, pctChange } from '../utils/finance';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-2xl border border-slate-700/50">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-300 capitalize">{p.name}:</span>
          <span className="font-semibold text-white">{fmt(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="flex items-center gap-2 text-sm mt-2 pt-2 border-t border-slate-700/50">
          <span className="w-2 h-2 rounded-full shrink-0 bg-blue-400" />
          <span className="text-slate-300">Saved:</span>
          <span className={`font-semibold ${payload[0].value - payload[1].value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {fmt(payload[0].value - payload[1].value)}
          </span>
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, icon: Icon, iconColor, trend, trendLabel, isPercent, prefix }) {
  const positive = trend >= 0;
  return (
    <div className="glass-card card-hover rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-xl ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold tabular-nums text-white mb-3">
        {isPercent ? `${value.toFixed(1)}%` : (prefix || '') + fmt(value).replace('$', '')}
        {!isPercent && <span className="text-slate-500 text-lg">$</span>}
      </p>
      <div className="flex items-center gap-1.5">
        {positive
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-400 shrink-0" />}
        <span className={`text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? '+' : ''}{trend.toFixed(1)}{isPercent ? 'pp' : '%'}
        </span>
        <span className="text-xs text-slate-500">{trendLabel}</span>
      </div>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div className="glass-card rounded-xl px-3 py-2 shadow-2xl border border-slate-700/50 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-slate-300">{name}:</span>
        <span className="font-semibold text-white">{fmt(value)}</span>
      </div>
    </div>
  );
}

const CATEGORY_ICONS = {
  housing: '🏠', food: '🍔', transport: '🚗', entertainment: '🎬',
  health: '❤️', shopping: '🛍️', utilities: '⚡', other: '•',
};

export default function OverviewPage({ transactions, categories, metrics, monthlyData }) {
  const { netBalance, monthlyIncome, monthlyExpenses, savingsRate,
          prevMonthIncome, prevMonthExpenses, prevSavingsRate } = metrics;

  const incomeTrend = pctChange(monthlyIncome, prevMonthIncome);
  const expenseTrend = pctChange(monthlyExpenses, prevMonthExpenses);
  const savingsTrend = +(savingsRate - prevSavingsRate).toFixed(1);

  // Current month category breakdown for donut
  const now = new Date();
  const currentMonthTxns = transactions.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === now.getFullYear() && m === now.getMonth() + 1;
  });
  const catMap = {};
  currentMonthTxns.filter((t) => t.type === 'expense').forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const categoryData = categories
    .filter((c) => c.id !== 'income' && catMap[c.id])
    .map((c) => ({ name: c.name, value: catMap[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);

  const totalCatExpenses = categoryData.reduce((s, c) => s + c.value, 0);

  const recent = [...transactions].slice(0, 8);

  const kpis = [
    {
      title: 'Net Balance', value: Math.abs(netBalance), icon: Wallet,
      iconColor: 'bg-blue-500/15 text-blue-400', prefix: netBalance < 0 ? '-$' : '$',
      trend: incomeTrend, trendLabel: 'vs last month',
    },
    {
      title: 'Monthly Income', value: monthlyIncome, icon: TrendingUp,
      iconColor: 'bg-emerald-500/15 text-emerald-400', prefix: '$',
      trend: incomeTrend, trendLabel: 'vs last month',
    },
    {
      title: 'Monthly Expenses', value: monthlyExpenses, icon: TrendingDown,
      iconColor: 'bg-red-500/15 text-red-400', prefix: '$',
      trend: -expenseTrend, trendLabel: 'vs last month',
    },
    {
      title: 'Savings Rate', value: savingsRate, icon: Percent,
      iconColor: 'bg-violet-500/15 text-violet-400',
      trend: savingsTrend, trendLabel: 'vs last month', isPercent: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KPICard key={k.title} {...k} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Area chart */}
        <div className="glass-card rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white">Cash Flow</h2>
              <p className="text-xs text-slate-500 mt-0.5">Income vs expenses over 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 rounded-full inline-block" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded-full inline-block" /> Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.8)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtCompact} width={52} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#gIncome)" name="Income" dot={false} />
              <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fill="url(#gExpense)" name="Expenses" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-semibold text-white">Spending Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">This month by category</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <PieChart width={120} height={120}>
                <Pie data={categoryData} cx={55} cy={55} innerRadius={38} outerRadius={55}
                  paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {categoryData.map((e) => <Cell key={e.name} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-white">{fmt(totalCatExpenses)}</span>
                <span className="text-[9px] text-slate-500">spent</span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
              {categoryData.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-slate-300 truncate flex-1">{c.name}</span>
                  <span className="text-slate-400 font-medium tabular-nums shrink-0">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest activity</p>
          </div>
          <span className="text-xs text-slate-500">{transactions.length} total</span>
        </div>
        <div className="space-y-1">
          {recent.map((t) => {
            const cat = categories.find((c) => c.id === t.category);
            return (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: `${cat?.color || '#94a3b8'}20` }}>
                  {CATEGORY_ICONS[t.category] || '•'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{t.description}</p>
                  <p className="text-xs text-slate-500">{fmtDate(t.date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
