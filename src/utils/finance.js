export const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const fmtCompact = (n) => {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(Math.abs(n))}`;
};

export const fmtDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function computeMonthlyData(transactions) {
  const map = new Map();
  transactions.forEach((t) => {
    const [y, m] = t.date.split('-').map(Number);
    const key = `${y}-${String(m).padStart(2, '0')}`;
    if (!map.has(key)) {
      const label = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' });
      map.set(key, { key, month: label, year: y, monthNum: m - 1, income: 0, expenses: 0 });
    }
    const e = map.get(key);
    if (t.type === 'income') e.income += t.amount;
    else e.expenses += t.amount;
  });
  return Array.from(map.values())
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthNum - b.monthNum)
    .map(({ key, monthNum, year, ...rest }) => ({
      ...rest,
      savings: rest.income - rest.expenses,
      savingsRate: rest.income > 0 ? +((rest.income - rest.expenses) / rest.income * 100).toFixed(1) : 0,
    }));
}

export function pctChange(current, previous) {
  if (!previous) return 0;
  return +((current - previous) / previous * 100).toFixed(1);
}
