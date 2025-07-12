from fastapi import APIRouter
from .analyze import router as analyze_router

# Main router that combines all endpoint routers
router = APIRouter()

# Include the analyze router with /api prefix
router.include_router(analyze_router, prefix="/api", tags=["analysis"])

@router.get("/")
def root():
    """Root endpoint"""
    return {"message": "PromptPilot API is running", "version": "1.0.0"}