from supabase import create_client
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def save_trade(trade_data):
    return supabase.table("trades").insert(trade_data).execute()
