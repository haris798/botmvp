import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RiskEvent } from '../types';

export function Alerts() {
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase.from('risk_events').select('*').order('timestamp', { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold p-6">Risk Alerts & Anomalies</h2>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
          <tr>
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4">Symbol</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Value</th>
            <th className="px-6 py-4">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((event) => (
            <tr key={event.id}>
              <td className="px-6 py-4">{new Date(event.timestamp).toLocaleString()}</td>
              <td className="px-6 py-4 font-medium">{event.symbol}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${event.type === 'Slippage' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  {event.type}
                </span>
              </td>
              <td className="px-6 py-4">{event.value}</td>
              <td className="px-6 py-4 text-slate-600">{event.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
