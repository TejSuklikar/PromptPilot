from fastapi import FastAPI
from app.api.routes import router

# Create the FastAPI app
app = FastAPI(
    title="PromptPilot API",
    description="AI-powered prompt evaluation and optimization",
    version="1.0.0"
)

# Include our API routes
app.include_router(router, prefix="/api")

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "PromptPilot API is running!", "status": "healthy"}