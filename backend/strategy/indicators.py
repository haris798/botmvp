import talib
import numpy as np

def calculate_indicators(data):
    # Data expected to be a pandas DataFrame or similar with 'close' column
    close = np.array(data['close'])
    ema20 = talib.EMA(close, timeperiod=20)
    ema50 = talib.EMA(close, timeperiod=50)
    ema200 = talib.EMA(close, timeperiod=200)
    rsi14 = talib.RSI(close, timeperiod=14)
    # ATR requires High, Low, Close
    return {"ema20": ema20, "ema50": ema50, "ema200": ema200, "rsi14": rsi14}
