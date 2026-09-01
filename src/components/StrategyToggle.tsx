import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BotSettings } from '../types';
import toast from 'react-hot-toast';

export function StrategyToggle() {
  const [strategy, setStrategy] = useState<BotSettings['active_strategy']>('Balanced');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('bot_settings').select('active_strategy').single();
      if (data) setStrategy(data.active_strategy);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = async (newStrategy: BotSettings['active_strategy']) => {
    setStrategy(newStrategy);
    const { error } = await supabase.from('bot_settings').update({ active_strategy: newStrategy }).eq('id', '1'); // Assuming single settings row
    if (error) {
      toast.error('Failed to update strategy');
    } else {
      toast.success(`Strategy set to ${newStrategy}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
      {(['Aggressive', 'Balanced', 'Conservative'] as const).map((s) => (
        <button
          key={s}
          onClick={() => handleChange(s)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${strategy === s ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
