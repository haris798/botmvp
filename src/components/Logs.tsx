import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BotLog } from '../types';
import { Download } from 'lucide-react';

export function Logs() {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      let query = supabase.from('bot_logs').select('*').order('timestamp', { ascending: false });
      if (levelFilter !== 'ALL') {
        query = query.eq('level', levelFilter);
      }
      const { data } = await query;
      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [levelFilter]);

  const handleDownloadCSV = () => {
    const headers = ['Timestamp', 'Level', 'Module', 'Event', 'Message'];
    const keys = ['timestamp', 'level', 'module', 'event', 'message'];
    const csvRows = [headers.join(',')];
    for (const row of logs) {
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
    a.download = 'bot_logs.csv';
    a.click();
  };

  if (loading) return <div>Loading logs...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
      <div className="flex gap-4 mb-4 justify-between">
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="border rounded p-2">
          <option value="ALL">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
        <button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
          <Download size={16} />
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className={`px-4 py-3 font-bold ${log.level === 'ERROR' ? 'text-red-600' : log.level === 'WARN' ? 'text-yellow-600' : 'text-blue-600'}`}>{log.level}</td>
                <td className="px-4 py-3">{log.module}</td>
                <td className="px-4 py-3">{log.event}</td>
                <td className="px-4 py-3 text-slate-600">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
