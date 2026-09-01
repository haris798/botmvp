from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

@app.get("/api/status")
async def get_status():
    return {"status": "running", "mode": os.getenv("MODE", "DEMO")}

@app.get("/api/account")
async def get_account():
    # Placeholder for Supabase/MT5 integration
    return {"balance": 10000, "currency": "USD"}
