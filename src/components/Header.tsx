import { ThemeToggle } from './ThemeToggle';

export function Header({ status }: { status: 'connected' | 'disconnected' }) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-slate-600 dark:text-slate-400">
            MT5 {status === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
