import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Signal } from '../types';

export function Signals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [symbolFilter, setSymbolFilter] = useState('ALL');
  const [timeframeFilter, setTimeframeFilter] = useState('ALL');

  useEffect(() => {
    async function fetchSignals() {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('timestamp', { ascending: false });
      if (data) setSignals(data);
      setLoading(false);
    }
    fetchSignals();
  }, []);

  const symbols = useMemo(() => Array.from(new Set(signals.map(s => s.symbol))), [signals]);
  const timeframes = useMemo(() => Array.from(new Set(signals.map(s => s.timeframe))), [signals]);

  const filteredSignals = useMemo(() => {
    return signals.filter(s =>
      (symbolFilter === 'ALL' || s.symbol === symbolFilter) &&
      (timeframeFilter === 'ALL' || s.timeframe === timeframeFilter)
    );
  }, [signals, symbolFilter, timeframeFilter]);

  if (loading) return <div>Loading signals...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <select value={symbolFilter} onChange={(e) => setSymbolFilter(e.target.value)} className="border rounded p-2">
          <option value="ALL">All Symbols</option>
          {symbols.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={timeframeFilter} onChange={(e) => setTimeframeFilter(e.target.value)} className="border rounded p-2">
          <option value="ALL">All Timeframes</option>
          {timeframes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Timeframe</th>
              <th className="px-6 py-4">Direction</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSignals.map((signal) => (
              <tr key={signal.id}>
                <td className="px-6 py-4 font-medium">{signal.symbol}</td>
                <td className="px-6 py-4">{signal.timeframe}</td>
                <td className={`px-6 py-4 font-bold ${signal.direction === 'BUY' ? 'text-green-600' : signal.direction === 'SELL' ? 'text-red-600' : 'text-slate-600'}`}>
                  {signal.direction}
                </td>
                <td className="px-6 py-4">{(signal.confidence * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-slate-500">{new Date(signal.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
