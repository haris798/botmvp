import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface PaperTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  sl: number;
  tp: number;
}

export function PaperTradeSimulator() {
  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [symbol, setSymbol] = useState('EURUSD');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState(1.0500);
  const [sl, setSl] = useState(1.0400);
  const [tp, setTp] = useState(1.0700);

  const addTrade = () => {
    setTrades([...trades, { id: Date.now().toString(), symbol, type, entryPrice, sl, tp }]);
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Paper Trade Simulator</h2>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Create New Scenario</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
          <select value={type} onChange={(e) => setType(e.target.value as 'BUY' | 'SELL')} className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(parseFloat(e.target.value))} placeholder="Entry" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
          <input type="number" value={sl} onChange={(e) => setSl(parseFloat(e.target.value))} placeholder="SL" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
          <input type="number" value={tp} onChange={(e) => setTp(parseFloat(e.target.value))} placeholder="TP" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <button onClick={addTrade} className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={16} /> Add Scenario
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Entry</th>
              <th className="px-6 py-4">SL</th>
              <th className="px-6 py-4">TP</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">{trade.symbol}</td>
                <td className={`px-6 py-4 font-bold ${trade.type === 'BUY' ? 'text-green-600' : 'text-rose-600'}`}>{trade.type}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trade.entryPrice.toFixed(4)}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trade.sl.toFixed(4)}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trade.tp.toFixed(4)}</td>
                <td className="px-6 py-4">
                  <button onClick={() => removeTrade(trade.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
