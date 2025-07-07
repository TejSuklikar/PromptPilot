from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    plan = Column(String, default="free")  # free, pro_monthly, pro_yearly
    credits = Column(Integer, default=15)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationship to analyses
    analyses = relationship("PromptAnalysis", back_populates="user")

class PromptAnalysis(Base):
    __tablename__ = "prompt_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Original prompt data
    original_prompt = Column(Text, nullable=False)
    
    # Stage 1: Classification results
    classification = Column(JSON)  # Stores the extracted characteristics
    
    # Stage 2: Model predictions  
    predictions = Column(JSON)  # Stores scores for each model
    
    # Stage 3: Refinements
    refinements = Column(JSON)  # Stores optimized prompt versions
    
    # Summary scores
    overall_score = Column(Float)
    processing_time_seconds = Column(Float)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="completed")  # pending, completed, failed
    
    # Relationships
    user = relationship("User", back_populates="analyses")

class ModelBenchmark(Base):
    __tablename__ = "model_benchmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, index=True, nullable=False)
    task_type = Column(String, index=True)
    domain = Column(String, index=True)
    complexity = Column(String, index=True)
    audience = Column(String, index=True)
    tone = Column(String, index=True)
    
    # Performance metrics
    average_score = Column(Float, nullable=False)
    confidence = Column(Float)
    sample_size = Column(Integer)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())