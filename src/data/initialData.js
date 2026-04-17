export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#6366f1', budget: 1500 },
  { id: 'food', name: 'Food & Dining', color: '#f59e0b', budget: 600 },
  { id: 'transport', name: 'Transport', color: '#10b981', budget: 300 },
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899', budget: 200 },
  { id: 'health', name: 'Health', color: '#14b8a6', budget: 150 },
  { id: 'shopping', name: 'Shopping', color: '#f97316', budget: 400 },
  { id: 'income', name: 'Income', color: '#22c55e', budget: 0 },
  { id: 'other', name: 'Other', color: '#94a3b8', budget: 200 },
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, description: 'Monthly Salary', amount: 4500, type: 'income', category: 'income', date: '2026-04-01' },
  { id: 2, description: 'Rent', amount: 1400, type: 'expense', category: 'housing', date: '2026-04-02' },
  { id: 3, description: 'Groceries – Whole Foods', amount: 120, type: 'expense', category: 'food', date: '2026-04-03' },
  { id: 4, description: 'Netflix', amount: 18, type: 'expense', category: 'entertainment', date: '2026-04-04' },
  { id: 5, description: 'Gym Membership', amount: 45, type: 'expense', category: 'health', date: '2026-04-05' },
  { id: 6, description: 'Uber', amount: 22, type: 'expense', category: 'transport', date: '2026-04-06' },
  { id: 7, description: 'Freelance Project', amount: 800, type: 'income', category: 'income', date: '2026-04-08' },
  { id: 8, description: 'Dinner out', amount: 65, type: 'expense', category: 'food', date: '2026-04-09' },
  { id: 9, description: 'New shoes', amount: 95, type: 'expense', category: 'shopping', date: '2026-04-10' },
  { id: 10, description: 'Electric bill', amount: 85, type: 'expense', category: 'housing', date: '2026-04-11' },
  { id: 11, description: 'Coffee & snacks', amount: 38, type: 'expense', category: 'food', date: '2026-04-12' },
  { id: 12, description: 'Gas', amount: 55, type: 'expense', category: 'transport', date: '2026-04-13' },
  { id: 13, description: 'Spotify', amount: 10, type: 'expense', category: 'entertainment', date: '2026-04-14' },
  { id: 14, description: 'Amazon – books', amount: 34, type: 'expense', category: 'shopping', date: '2026-04-15' },
  { id: 15, description: 'Doctor visit', amount: 40, type: 'expense', category: 'health', date: '2026-04-16' },
];

export const MONTHLY_DATA = [
  { month: 'Nov', income: 4500, expenses: 2800 },
  { month: 'Dec', income: 5200, expenses: 3400 },
  { month: 'Jan', income: 4500, expenses: 2600 },
  { month: 'Feb', income: 4800, expenses: 2900 },
  { month: 'Mar', income: 4500, expenses: 3100 },
  { month: 'Apr', income: 5300, expenses: 2027 },
];
