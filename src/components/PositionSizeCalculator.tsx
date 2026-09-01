import { useState } from 'react';

export function PositionSizeCalculator() {
  const [equity, setEquity] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [slPips, setSlPips] = useState(20);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    // Basic calculation: (Equity * Risk%) / (SL_pips * Pip_Value)
    // Assuming 1 pip = 10 USD per standard lot (1.0)
    // Lot Size = (Equity * (Risk% / 100)) / (SL_pips * 10)
    const riskAmount = equity * (riskPercent / 100);
    const lotSize = riskAmount / (slPips * 10);
    setResult(parseFloat(lotSize.toFixed(2)));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Position Size Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Equity ($)</label>
          <input type="number" value={equity} onChange={(e) => setEquity(parseFloat(e.target.value))} className="w-full border rounded p-2 mt-1 dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Risk (%)</label>
          <input type="number" value={riskPercent} onChange={(e) => setRiskPercent(parseFloat(e.target.value))} className="w-full border rounded p-2 mt-1 dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Stop Loss (Pips)</label>
          <input type="number" value={slPips} onChange={(e) => setSlPips(parseFloat(e.target.value))} className="w-full border rounded p-2 mt-1 dark:bg-slate-800 dark:border-slate-700" />
        </div>
        <button onClick={calculate} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">Calculate</button>
        {result !== null && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Required Lot Size:</span>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
