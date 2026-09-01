/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { Signals } from './components/Signals';
import { History } from './components/History';
import { Logs } from './components/Logs';
import { Performance } from './components/Performance';
import { Settings } from './components/Settings';
import { System } from './components/System';
import { Alerts } from './components/Alerts';
import { PositionSizeCalculator } from './components/PositionSizeCalculator';
import { PaperTradeSimulator } from './components/PaperTradeSimulator';
import { Backtest } from './components/Backtest';

export default function App() {
  const [activeView, setActiveView] = useState('Overview');
  const [mt5Status, setMt5Status] = useState<'connected' | 'disconnected'>('connected');

  useEffect(() => {
    // This demonstrates alerting on connection status changes
    if (mt5Status === 'connected') {
      toast.success('MT5 Connected');
    } else {
      toast.error('MT5 Disconnected');
    }
  }, [mt5Status]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-200">
      <Toaster position="top-right" />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header status={mt5Status} />
        <main className="flex-1 overflow-y-auto p-8">
          {activeView === 'Overview' && <Overview />}
          {activeView === 'Signals' && <Signals />}
          {activeView === 'History' && <History />}
          {activeView === 'Performance' && <Performance />}
          {activeView === 'Logs' && <Logs />}
          {activeView === 'System' && <System />}
          {activeView === 'Alerts' && <Alerts />}
          {activeView === 'Calculator' && <PositionSizeCalculator />}
          {activeView === 'Simulator' && <PaperTradeSimulator />}
          {activeView === 'Backtest' && <Backtest />}
          {activeView === 'Settings' && <Settings />}
          {activeView !== 'Overview' && activeView !== 'Signals' && activeView !== 'History' && activeView !== 'Performance' && activeView !== 'Logs' && activeView !== 'System' && activeView !== 'Alerts' && activeView !== 'Calculator' && activeView !== 'Simulator' && activeView !== 'Backtest' && activeView !== 'Settings' && (
            <div className="text-slate-600">View: {activeView} content goes here.</div>
          )}
        </main>
      </div>
    </div>
  );
}
