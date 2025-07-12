from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from api.routes import router
from db.database import get_db, engine
from core.config import settings
import psycopg2

# Create the FastAPI app
app = FastAPI(
    title=settings.api_title,
    description="AI-powered prompt evaluation and optimization",
    version=settings.api_version
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include our API routes
app.include_router(router, prefix="/api")

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "PromptPilot API is running!", "status": "healthy"}




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