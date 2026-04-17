import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';

export default function SummaryCards({ totalBalance, totalIncome, totalExpenses, savings }) {
  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: DollarSign,
      bg: 'from-indigo-500 to-purple-600',
      text: 'text-white',
    },
    {
      title: 'Monthly Income',
      value: totalIncome,
      icon: TrendingUp,
      bg: 'from-emerald-400 to-teal-500',
      text: 'text-white',
    },
    {
      title: 'Monthly Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      bg: 'from-rose-400 to-pink-500',
      text: 'text-white',
    },
    {
      title: 'Savings This Month',
      value: savings,
      icon: PiggyBank,
      bg: 'from-amber-400 to-orange-500',
      text: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-br ${card.bg} p-5 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">{card.title}</p>
              <div className="rounded-full bg-white/20 p-2">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className={`mt-3 text-2xl font-bold ${card.text}`}>
              {card.value < 0 ? '-' : ''}${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
