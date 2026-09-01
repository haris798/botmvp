import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Account, Trade } from '../types';
import { DollarSign, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { ManualTradeEntryModal } from './ManualTradeEntryModal';
import { StrategyToggle } from './StrategyToggle';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Overview() {
  const [account, setAccount] = useState<Account | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: accountData } = await supabase.from('accounts').select('*').single();
      if (accountData) setAccount(accountData);

      const today = new Date().toISOString().split('T')[0];
      const { data: tradesData } = await supabase
        .from('trades')
        .select('*')
        .gte('closed_at', `${today}T00:00:00`);
        
      if (tradesData) setTrades(tradesData);
      setLoading(false);
    }
    fetchData();

    const accountChannel = supabase
      .channel('account-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'accounts' }, (payload) => setAccount(payload.new as Account))
      .subscribe();

    return () => {
      supabase.removeChannel(accountChannel);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!account) return <div>No account data found.</div>;

  const totalTrades = trades.length;
  const profitableTrades = trades.filter(t => t.profit_loss > 0).length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  const totalPL = trades.reduce((sum, t) => sum + t.profit_loss, 0);

  const cards = [
    { title: 'Balance', value: account.balance.toFixed(2), icon: DollarSign, color: 'text-blue-600' },
    { title: 'Equity', value: account.equity.toFixed(2), icon: TrendingUp, color: 'text-green-600' },
    { title: 'Floating P/L', value: account.floating_pl.toFixed(2), icon: AlertCircle, color: account.floating_pl >= 0 ? 'text-green-600' : 'text-red-600' },
  ];

  const layout = {
    lg: [
      { i: 'cards', x: 0, y: 0, w: 12, h: 2 },
      { i: 'summary', x: 0, y: 2, w: 12, h: 2 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Account Overview</h2>
        <div className="flex items-center gap-4">
          <StrategyToggle />
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus size={16} />
            Manual Trade
          </button>
        </div>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
      >
        <div key="cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-full">
          {cards.map((card) => (
            <div key={card.title} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</h3>
                <card.icon className={card.color} size={20} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>${card.value}</p>
            </div>
          ))}
        </div>

        <div key="summary" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Today's Trade Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Today's Trades</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalTrades}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Win Rate Today</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{winRate.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total P/L</p>
                  <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>${totalPL.toFixed(2)}</p>
              </div>
          </div>
        </div>
      </ResponsiveGridLayout>

      <ManualTradeEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} accountBalance={account.balance} />
    </div>
  );
}

