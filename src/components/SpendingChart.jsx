import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const fmt = (v) =>
  `$${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function SpendingChart({ data }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Income vs Expenses (6 months)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
          <Tooltip
            formatter={(v, name) => [fmt(v), name]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#colorIncome)" />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#colorExpenses)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
