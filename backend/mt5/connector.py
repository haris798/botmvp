class MT5Connector:
    def connect(self): pass
    def disconnect(self): pass
    def get_account(self): pass
    def get_symbols(self): pass
    def get_tick(self, symbol): pass
    def get_candles(self, symbol, timeframe): pass
    def get_positions(self): pass
    def get_orders(self): pass
    def place_order(self, order_type, symbol, volume): pass
    def modify_position(self, ticket, sl, tp): pass
    def close_position(self, ticket): pass
