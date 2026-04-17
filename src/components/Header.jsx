import { BarChart3, LayoutDashboard, List, PieChart, Plus, TrendingUp } from 'lucide-react';

const TABS = [
  { id: 'overview',      label: 'Overview',      Icon: LayoutDashboard },
  { id: 'analytics',     label: 'Analytics',     Icon: TrendingUp      },
  { id: 'transactions',  label: 'Transactions',  Icon: List            },
  { id: 'budget',        label: 'Budget',        Icon: PieChart        },
];

export default function Header({ activeTab, setActiveTab, onAddClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-[#070d1f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base text-white tracking-tight hidden sm:block">FinanceOS</span>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  activeTab === id
                    ? 'bg-blue-500/12 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Add button */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                activeTab === id
                  ? 'bg-blue-500/12 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
