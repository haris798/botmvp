import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Performance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      const { data, error } = await supabase
        .from('trades')
        .select('profit_loss, closed_at')
        .order('closed_at', { ascending: true });
        
      if (data) {
        let balance = 10000; // Starting balance
        const formattedData = data.map((t: any) => {
            balance += Number(t.profit_loss);
            return {
                date: new Date(t.closed_at).toLocaleDateString(),
                balance: balance
            };
        });
        setData(formattedData);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  if (loading) return <div>Loading performance data...</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Account Growth</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
