import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trade } from '../types';
import { Download } from 'lucide-react';

export function History() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      const { data, error } = await supabase
        .from('trades')
        .select('*, orders(symbol)')
        .order('closed_at', { ascending: false });
        
      if (data) {
        // Map data to match Trade interface
        const formattedTrades = data.map((t: any) => ({
            ...t,
            symbol: t.orders?.symbol || 'N/A'
        }));
        setTrades(formattedTrades);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  const handleDownloadCSV = () => {
    const headers = ['Symbol', 'P/L', 'Duration', 'Strategy', 'Closed At'];
    const keys = ['symbol', 'profit_loss', 'duration', 'strategy_version', 'closed_at'];
    const csvRows = [headers.join(',')];
    for (const row of trades) {
      const values = keys.map(key => {
        const val = (row as any)[key] === null || (row as any)[key] === undefined ? '' : (row as any)[key];
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trades_history.csv';
    a.click();
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 flex justify-end">
        <button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
          <Download size={16} />
          Download CSV
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
          <tr>
            <th className="px-6 py-4">Symbol</th>
            <th className="px-6 py-4">P/L</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Strategy</th>
            <th className="px-6 py-4">Closed At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td className="px-6 py-4 font-medium">{trade.symbol}</td>
              <td className={`px-6 py-4 font-bold ${trade.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Number(trade.profit_loss).toFixed(2)}
              </td>
              <td className="px-6 py-4">{trade.duration}</td>
              <td className="px-6 py-4">{trade.strategy_version}</td>
              <td className="px-6 py-4 text-slate-500">{new Date(trade.closed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
