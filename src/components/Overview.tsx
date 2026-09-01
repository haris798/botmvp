import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Account } from '../types';
import { DollarSign, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { ManualTradeEntryModal } from './ManualTradeEntryModal';
import { StrategyToggle } from './StrategyToggle';

export function Overview() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      const { data, error } = await supabase.from('accounts').select('*').single();
      if (data) setAccount(data);
      setLoading(false);
    }
    fetchAccount();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'accounts' },
        (payload) => {
          setAccount(payload.new as Account);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!account) return <div>No account data found.</div>;

  const cards = [
    { title: 'Balance', value: account.balance.toFixed(2), icon: DollarSign, color: 'text-blue-600' },
    { title: 'Equity', value: account.equity.toFixed(2), icon: TrendingUp, color: 'text-green-600' },
    { title: 'Floating P/L', value: account.floating_pl.toFixed(2), icon: AlertCircle, color: account.floating_pl >= 0 ? 'text-green-600' : 'text-red-600' },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      <ManualTradeEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} accountBalance={account.balance} />
    </div>
  );
}
