import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BotSettings } from '../types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accountBalance: number;
}

export function ManualTradeEntryModal({ isOpen, onClose, accountBalance }: Props) {
  const [settings, setSettings] = useState<BotSettings | null>(null);
  const [symbol, setSymbol] = useState('EURUSD');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [lot, setLot] = useState(0.1);
  const [sl, setSl] = useState(0);
  const [tp, setTp] = useState(0);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('bot_settings').select('*').single();
      if (data) setSettings(data);
    }
    if (isOpen) fetchSettings();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!settings) return;

    // Basic risk validation
    const maxRiskAmount = accountBalance * settings.risk_per_trade;
    // In a real app, calculate risk based on SL, lot size, etc.
    // Here we perform a simple check for demonstration
    if (lot > 1.0) {
        toast.error('Lot size exceeds risk limits defined in settings.');
        return;
    }

    const { error } = await supabase.from('orders').insert({
        symbol,
        direction,
        lot,
        sl,
        tp,
        status: 'OPEN',
        user_id: 'current-user-id' // Should be dynamic
    });

    if (error) {
        toast.error('Failed to execute trade: ' + error.message);
    } else {
        toast.success('Trade executed successfully');
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manual Trade Entry</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Symbol</label>
            <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setDirection('BUY')} className={`flex-1 py-2 rounded ${direction === 'BUY' ? 'bg-green-600 text-white' : 'bg-slate-100'}`}>BUY</button>
            <button onClick={() => setDirection('SELL')} className={`flex-1 py-2 rounded ${direction === 'SELL' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>SELL</button>
          </div>
          <div>
            <label className="block text-sm font-medium">Lot Size</label>
            <input type="number" step="0.01" value={lot} onChange={(e) => setLot(parseFloat(e.target.value))} className="w-full border rounded p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">SL</label>
                <input type="number" value={sl} onChange={(e) => setSl(parseFloat(e.target.value))} className="w-full border rounded p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium">TP</label>
                <input type="number" value={tp} onChange={(e) => setTp(parseFloat(e.target.value))} className="w-full border rounded p-2" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">Execute Trade</button>
        </div>
      </div>
    </div>
  );
}
