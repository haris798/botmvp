import { LayoutDashboard, Activity, History, FileText, Settings, LineChart, Server, AlertCircle, Calculator, PlayCircle, BarChart2 } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Signals', icon: Activity },
    { name: 'History', icon: History },
    { name: 'Performance', icon: LineChart },
    { name: 'Logs', icon: FileText },
    { name: 'Alerts', icon: AlertCircle },
    { name: 'Calculator', icon: Calculator },
    { name: 'Simulator', icon: PlayCircle },
    { name: 'Backtest', icon: BarChart2 },
    { name: 'System', icon: Server },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen p-4 flex flex-col">
      <div className="text-white font-bold text-lg mb-8 px-2">Forex Bot</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeView === item.name ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
