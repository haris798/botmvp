import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BotSettings, CustomAlert } from '../types';

export function Settings() {
  const [settings, setSettings] = useState<BotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from('settings').upsert(settings);
    setSaving(false);
    alert('Settings saved!');
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-lg">
      <h2 className="text-xl font-semibold mb-6">Risk Management Settings</h2>
      {settings && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Risk per Trade (%)</label>
            <input type="number" value={settings.risk_per_trade * 100} onChange={(e) => setSettings({...settings, risk_per_trade: parseFloat(e.target.value) / 100})} className="w-full border rounded p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Max Daily Loss (%)</label>
            <input type="number" value={settings.max_daily_loss * 100} onChange={(e) => setSettings({...settings, max_daily_loss: parseFloat(e.target.value) / 100})} className="w-full border rounded p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Max Drawdown (%)</label>
            <input type="number" value={settings.max_drawdown * 100} onChange={(e) => setSettings({...settings, max_drawdown: parseFloat(e.target.value) / 100})} className="w-full border rounded p-2 mt-1" />
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">Telegram Notification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Bot Token</label>
                <input type="text" value={settings.telegram_bot_token || ''} onChange={(e) => setSettings({...settings, telegram_bot_token: e.target.value})} className="w-full border rounded p-2 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Chat ID</label>
                <input type="text" value={settings.telegram_chat_id || ''} onChange={(e) => setSettings({...settings, telegram_chat_id: e.target.value})} className="w-full border rounded p-2 mt-1" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">Custom Alerts</h3>
            <div className="space-y-2">
              {settings.custom_alerts?.map((alert, index) => (
                <div key={alert.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded">
                  <span className="text-sm text-slate-600 flex-1">{alert.condition} {alert.threshold}% ({alert.channel})</span>
                  <button onClick={() => setSettings({...settings, custom_alerts: settings.custom_alerts.filter((_, i) => i !== index)})} className="text-red-500 text-xs">Remove</button>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <select id="new-alert-condition" className="border rounded p-1 text-sm">
                  <option value="Drawdown">Drawdown</option>
                  <option value="Profit">Profit</option>
                  <option value="Loss">Loss</option>
                </select>
                <input id="new-alert-threshold" type="number" placeholder="%" className="border rounded p-1 text-sm" />
                <select id="new-alert-channel" className="border rounded p-1 text-sm">
                  <option value="Telegram">Telegram</option>
                  <option value="Browser">Browser</option>
                </select>
              </div>
              <button onClick={() => {
                const condition = (document.getElementById('new-alert-condition') as HTMLSelectElement).value as CustomAlert['condition'];
                const threshold = parseFloat((document.getElementById('new-alert-threshold') as HTMLInputElement).value);
                const channel = (document.getElementById('new-alert-channel') as HTMLSelectElement).value as CustomAlert['channel'];
                if (threshold) {
                  setSettings({...settings, custom_alerts: [...(settings.custom_alerts || []), { id: Date.now().toString(), condition, threshold, channel }]});
                }
              }} className="w-full bg-slate-100 text-slate-700 p-2 rounded text-sm">Add Alert</button>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 text-white p-2 rounded mt-4">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}
