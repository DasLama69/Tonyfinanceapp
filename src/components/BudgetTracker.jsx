import { CATEGORIES } from '../data/initialData';

function pct(spent, budget) {
  if (!budget) return 0;
  return Math.min(100, Math.round((spent / budget) * 100));
}

export default function BudgetTracker({ transactions }) {
  const expenseCategories = CATEGORIES.filter((c) => c.id !== 'income');

  const spent = expenseCategories.reduce((acc, cat) => {
    acc[cat.id] = transactions
      .filter((t) => t.type === 'expense' && t.category === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {});

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Budget Tracker</h2>
      <div className="space-y-4">
        {expenseCategories.map((cat) => {
          const s = spent[cat.id] || 0;
          const p = pct(s, cat.budget);
          const over = s > cat.budget;
          return (
            <div key={cat.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{cat.name}</span>
                <span className={over ? 'text-rose-500 font-semibold' : 'text-slate-500'}>
                  ${s.toFixed(0)} / ${cat.budget}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${p}%`,
                    backgroundColor: over ? '#f43f5e' : cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
