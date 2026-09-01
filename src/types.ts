export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  lot: number;
  entry_price: number;
  sl: number;
  tp: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  created_at: string;
}

export interface Position {
  id: string;
  order_id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  lot: number;
  entry_price: number;
  current_price: number;
  sl: number;
  tp: number;
  floating_pl: number;
  updated_at: string;
}

export interface Account {
  id: string;
  balance: number;
  equity: number;
  floating_pl: number;
  updated_at: string;
}
export interface Signal {
  id: string;
  symbol: string;
  timeframe: string;
  direction: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: string;
}

export interface BotLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  module: string;
  event: string;
  message: string;
}

export interface Trade {
  id: string;
  symbol: string;
  entry_price: number;
  exit_price: number;
  profit_loss: number;
  duration: string;
  strategy_version: string;
  closed_at: string;
}

export interface BotSettings {
  id: string;
  risk_per_trade: number;
  max_daily_loss: number;
  max_drawdown: number;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  active_strategy: 'Aggressive' | 'Balanced' | 'Conservative';
  custom_alerts: CustomAlert[];
  updated_at: string;
}

export interface CustomAlert {
  id: string;
  condition: 'Drawdown' | 'Profit' | 'Loss';
  threshold: number;
  channel: 'Telegram' | 'Browser';
}

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

export interface ProcessInfo {
  id: string;
  name: string;
  status: 'RUNNING' | 'STOPPED';
  uptime: string;
}

export interface RiskEvent {
  id: string;
  timestamp: string;
  symbol: string;
  type: 'Slippage' | 'Spread' | 'Other';
  value: number;
  message: string;
}
