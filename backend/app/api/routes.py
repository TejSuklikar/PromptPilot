from fastapi import APIRouter

# Create a router for our API endpoints
router = APIRouter()

@router.post("/analyze-prompt")
def analyze_prompt():
    return {
        "message": "Prompt analysis endpoint - coming soon!",
        "status": "under_development"
    }

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "PromptPilot API"}