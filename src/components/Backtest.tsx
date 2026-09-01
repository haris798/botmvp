import { useState } from 'react';
import React from 'react';
import Papa from 'papaparse';
import { Upload, Play, BarChart2 } from 'lucide-react';

interface BacktestResult {
  totalTrades: number;
  winRate: number;
  netProfit: number;
}

export function Backtest() {
  const [candles, setCandles] = useState<any[]>([]);
  const [slPips, setSlPips] = useState(20);
  const [tpPips, setTpPips] = useState(40);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setCandles(results.data);
        },
      });
    }
  };

  const runBacktest = () => {
    if (candles.length === 0) return;

    let wins = 0;
    let losses = 0;
    let netProfit = 0;

    // Simplified backtest logic: Random trade simulation for demonstration
    // In a real scenario, this would use candle data + strategy logic
    candles.forEach((_, i) => {
      if (i % 10 === 0) { // Simulate a trade every 10 candles
        const isWin = Math.random() > 0.5;
        if (isWin) {
          wins++;
          netProfit += tpPips;
        } else {
          losses++;
          netProfit -= slPips;
        }
      }
    });

    setResults({
      totalTrades: wins + losses,
      winRate: (wins / (wins + losses)) * 100,
      netProfit,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Backtest</h2>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Upload Historical Data (CSV)</h3>
        <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Strategy Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={slPips} onChange={(e) => setSlPips(Number(e.target.value))} placeholder="SL Pips" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
          <input type="number" value={tpPips} onChange={(e) => setTpPips(Number(e.target.value))} placeholder="TP Pips" className="border rounded p-2 dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <button onClick={runBacktest} className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Play size={16} /> Run Backtest
        </button>
      </div>

      {results && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Simulation Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Trades</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{results.totalTrades}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Win Rate</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{results.winRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Net Profit (Pips)</p>
                <p className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-600' : 'text-rose-600'}`}>{results.netProfit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
