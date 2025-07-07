from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api.routes import router
from app.db.database import get_db, engine
from app.core.config import settings

# Create the FastAPI app
app = FastAPI(
    title=settings.api_title,
    description="AI-powered prompt evaluation and optimization",
    version=settings.api_version
)

# Include our API routes
app.include_router(router, prefix="/api")

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "PromptPilot API is running!", "status": "healthy"}

import psycopg2
from app.core.config import settings

# Test database connection
@app.get("/test-db")
def test_database():
    try:
        # Test direct psycopg2 connection (bypass SQLAlchemy)
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=5432,
            database="promptpilot",
            user="postgres",
            password="password"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 'Direct connection works!'")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"database": "connected", "status": "success", "result": result[0]}
    except Exception as e:
        return {"database": "failed", "error": str(e), "error_type": type(e).__name__}