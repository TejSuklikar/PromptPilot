from pydantic import BaseModel
from typing import List

class AnalyzePromptRequest(BaseModel):
    prompt: str

class RefinedPrompt(BaseModel):
    version: str
    prompt: str
    notes: str

class AnalyzePromptResponse(BaseModel):
    clarity: int
    context: int
    specificity: int
    actionability: int
    completeness: int
    structure:int
    strengths: List[str]
    areas_to_improve: List[str]
    feedback: List[str]
    refined_prompts: List[RefinedPrompt]
    overall_score: str
