class RiskManager:
    def __init__(self):
        self.risk_per_trade = 0.005 # 0.5%
        self.max_daily_loss = 0.02 # 2%
        self.max_drawdown = 0.10 # 10%
        self.max_open_positions = 3
        self.min_rr = 2 # 1:2

    def validate_order(self, order_details, current_positions):
        if len(current_positions) >= self.max_open_positions:
            return False, "Max open positions reached"
        return True, "Valid"
