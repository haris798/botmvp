import { useEffect, useState } from 'react';
import { SystemMetrics, ProcessInfo } from '../types';

export function System() {
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpu_usage: 25, memory_usage: 45, disk_usage: 60 });
  const [processes, setProcesses] = useState<ProcessInfo[]>([
    { id: '1', name: 'Trading Engine', status: 'RUNNING', uptime: '12d 4h 30m' },
    { id: '2', name: 'MT5 Bridge', status: 'RUNNING', uptime: '5d 1h 10m' },
    { id: '3', name: 'Logger Service', status: 'RUNNING', uptime: '1d 12h 0m' },
  ]);

  useEffect(() => {
    // Simulate real-time monitoring updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu_usage: Math.min(100, Math.max(0, prev.cpu_usage + (Math.random() - 0.5) * 10)),
        memory_usage: Math.min(100, Math.max(0, prev.memory_usage + (Math.random() - 0.5) * 5)),
        disk_usage: prev.disk_usage,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">CPU Usage</h3>
          <p className="text-3xl font-bold mt-2">{metrics.cpu_usage.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Memory Usage</h3>
          <p className="text-3xl font-bold mt-2">{metrics.memory_usage.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Disk Usage</h3>
          <p className="text-3xl font-bold mt-2">{metrics.disk_usage.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-xl font-semibold p-6">Active Background Processes</h2>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processes.map((proc) => (
              <tr key={proc.id}>
                <td className="px-6 py-4 font-medium">{proc.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${proc.status === 'RUNNING' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {proc.status}
                  </span>
                </td>
                <td className="px-6 py-4">{proc.uptime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
