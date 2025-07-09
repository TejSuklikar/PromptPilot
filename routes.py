# routes.py
from fastapi import APIRouter
from random import randint, choice
from models.analyze import AnalyzePromptRequest, AnalyzePromptResponse, RefinedPrompt

router = APIRouter()

# Sample strengths (positive feedback)
sample_strengths = [
    "Clear and well-structured prompt",
    "Good use of specific examples",
    "Appropriate context provided",
    "Well-defined scope and constraints",
    "Effective use of formatting",
    "Clear instructions and expectations",
    "Good balance of detail and brevity",
    "Logical flow and organization"
]

# Sample areas for improvement
sample_improvements = [
    "Consider adding more specific constraints",
    "Could benefit from clearer output format specification", 
    "Add more context about the intended use case",
    "Consider rephrasing for better clarity",
    "Try using more specific examples",
    "Add constraints to narrow the scope",
    "Include error handling instructions",
    "Specify desired response length or format"
]

refined_prompt_samples = [
    {
        "version": "Professional",
        "prompt": "You are an expert professional assistant. Please provide a comprehensive and detailed response to the following request, ensuring accuracy and thoroughness: {{input}}",
        "notes": "Enhanced with professional tone and detailed instruction structure."
    },
    {
        "version": "Concise", 
        "prompt": "Respond briefly and directly to: {{input}}",
        "notes": "Streamlined for concise, focused responses."
    },
    {
        "version": "Creative",
        "prompt": "Approach this creatively and think outside the box when responding to: {{input}}",
        "notes": "Optimized for creative and innovative responses."
    }
]

def calculate_overall_score(scores: list) -> str:
    """Calculate overall score based on individual metrics"""
    avg_score = sum(scores) / len(scores)
    
    if avg_score >= 85:
        return "EXCELLENT"
    elif avg_score >= 70:
        return "GOOD"
    elif avg_score >= 50:
        return "NEEDS_IMPROVEMENT"
    else:
        return "POOR"

@router.post("/analyze-prompt", response_model=AnalyzePromptResponse)
def analyze_prompt(request: AnalyzePromptRequest):
    # Generate random scores for each metric
    scores = {
        "clarity": randint(60, 100),
        "context": randint(60, 100),
        "specificity": randint(60, 100),
        "actionability": randint(60, 100),
        "completeness": randint(60, 100),
        "structure": randint(60, 100)
    }
    
    # Calculate overall score
    overall_score = calculate_overall_score(list(scores.values()))
    
    # Select random feedback
    strengths = [choice(sample_strengths) for _ in range(3)]
    areas_to_improve = [choice(sample_improvements) for _ in range(3)]
    
    return AnalyzePromptResponse(
        **scores,
        overall_score=overall_score,
        strengths=strengths,
        areas_to_improve=areas_to_improve,
        refined_prompts=[RefinedPrompt(**p) for p in refined_prompt_samples]
    )
