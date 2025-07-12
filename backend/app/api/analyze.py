from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import random

# Create a router for our API endpoints
router = APIRouter()

# Request/Response Models
class AnalyzePromptRequest(BaseModel):
    prompt: str

class RefinedVersion(BaseModel):
    version: str
    prompt: str

class FeedbackData(BaseModel):
    strengths: List[str]
    improvements: List[str]

class AnalyzePromptResponse(BaseModel):
    overall_score: int
    criteria_scores: Dict[str, int]
    feedback: FeedbackData
    refined_versions: List[RefinedVersion]

@router.post("/analyze-prompt", response_model=AnalyzePromptResponse)
def analyze_prompt(request: AnalyzePromptRequest) -> AnalyzePromptResponse:
    """
    Mock endpoint that generates realistic fake analysis data.
    This simulates what a real AI analysis service would return.
    """
    
    # Generate random scores (60-100 range like the frontend was doing)
    scores = {
        "clarity": random.randint(60, 100),
        "specificity": random.randint(60, 100), 
        "context": random.randint(60, 100),
        "structure": random.randint(60, 100),
        "actionability": random.randint(60, 100),
        "completeness": random.randint(60, 100)
    }
    
    overall_score = sum(scores.values()) // len(scores)
    
    # Sample feedback (in real version, this would be AI-generated)
    sample_strengths = [
        "Clear and well-structured prompt",
        "Good use of specific examples", 
        "Appropriate context provided",
        "Well-defined expected output format",
        "Includes relevant constraints"
    ]
    
    sample_improvements = [
        "Consider adding more specific constraints",
        "Could benefit from clearer output format specification",
        "Add more context about the intended use case",
        "Include examples of desired vs undesired outputs",
        "Specify the target audience more clearly"
    ]
    
    # Randomly select 2-4 items from each list
    selected_strengths = random.sample(sample_strengths, random.randint(2, 4))
    selected_improvements = random.sample(sample_improvements, random.randint(2, 4))
    
    # Generate refined versions
    refined_versions = [
        RefinedVersion(
            version="Professional",
            prompt=f"{request.prompt} Please provide a professional and detailed response."
        ),
        RefinedVersion(
            version="Concise", 
            prompt=f"{request.prompt} Please provide a brief and concise response."
        ),
        RefinedVersion(
            version="Creative",
            prompt=f"{request.prompt} Please provide a creative and engaging response."
        )
    ]
    
    return AnalyzePromptResponse(
        overall_score=overall_score,
        criteria_scores=scores,
        feedback=FeedbackData(
            strengths=selected_strengths,
            improvements=selected_improvements
        ),
        refined_versions=refined_versions
    )

@router.get("/health")
def health_check():
    """Health check endpoint to verify the service is running"""
    return {"status": "healthy", "service": "PromptPilot API"}