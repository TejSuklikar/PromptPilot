/**
 * Advanced Prompt Analysis Utility
 * 
 * Provides comprehensive prompt evaluation with detailed recommendations,
 * refined versions, and tone-based variations to help users write better prompts.
 */

// Prompt quality criteria and weights
const QUALITY_CRITERIA = {
  clarity: { weight: 0.25, name: 'Clarity & Specificity' },
  context: { weight: 0.20, name: 'Context & Background' },
  structure: { weight: 0.15, name: 'Structure & Format' },
  examples: { weight: 0.15, name: 'Examples & Constraints' },
  tone: { weight: 0.10, name: 'Tone & Style' },
  actionability: { weight: 0.15, name: 'Clear Instructions' }
};

// Tone variations for prompt refinement
const TONE_VARIATIONS = {
  professional: {
    name: 'Professional',
    description: 'Formal, business-appropriate language',
    modifiers: ['Please', 'Kindly', 'I would appreciate', 'Could you']
  },
  casual: {
    name: 'Casual',
    description: 'Friendly, conversational tone',
    modifiers: ['Hey', 'Can you', 'Help me', 'Let\'s']
  },
  technical: {
    name: 'Technical',
    description: 'Precise, detailed, expert-level',
    modifiers: ['Analyze', 'Implement', 'Optimize', 'Configure']
  },
  creative: {
    name: 'Creative',
    description: 'Imaginative, open-ended approach',
    modifiers: ['Imagine', 'Create', 'Design', 'Brainstorm']
  },
  educational: {
    name: 'Educational',
    description: 'Learning-focused, step-by-step',
    modifiers: ['Explain', 'Teach', 'Show me how', 'Break down']
  }
};

/**
 * Analyzes a prompt and returns comprehensive evaluation results
 */
export function analyzePrompt(prompt) {
  if (!prompt || prompt.trim().length === 0) {
    return null;
  }

  const analysis = {
    score: calculateOverallScore(prompt),
    criteria: evaluateCriteria(prompt),
    suggestions: generateSuggestions(prompt),
    refinedPrompt: generateRefinedPrompt(prompt),
    toneVariations: generateToneVariations(prompt),
    strengths: identifyStrengths(prompt),
    improvements: identifyImprovements(prompt)
  };

  return analysis;
}

/**
 * Calculates overall prompt quality score (0-100)
 */
function calculateOverallScore(prompt) {
  const scores = evaluateCriteria(prompt);
  let weightedSum = 0;
  
  Object.entries(QUALITY_CRITERIA).forEach(([key, criteria]) => {
    weightedSum += scores[key] * criteria.weight;
  });
  
  return Math.round(weightedSum);
}

/**
 * Evaluates prompt against each quality criteria
 */
function evaluateCriteria(prompt) {
  const text = prompt.toLowerCase();
  const wordCount = prompt.split(/\s+/).length;
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return {
    clarity: evaluateClarity(text, wordCount),
    context: evaluateContext(text, sentences),
    structure: evaluateStructure(prompt, sentences),
    examples: evaluateExamples(text),
    tone: evaluateTone(text),
    actionability: evaluateActionability(text)
  };
}

function evaluateClarity(text, wordCount) {
  let score = 50; // Base score
  
  // Check for specific terms
  if (text.includes('specific') || text.includes('exactly') || text.includes('precisely')) score += 15;
  
  // Check for vague terms (penalty)
  const vagueTerms = ['something', 'anything', 'stuff', 'things', 'maybe', 'perhaps'];
  const vagueCount = vagueTerms.filter(term => text.includes(term)).length;
  score -= vagueCount * 10;
  
  // Word count consideration
  if (wordCount >= 10 && wordCount <= 50) score += 20;
  else if (wordCount > 50) score += 10;
  else score -= 10;
  
  // Check for question words
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which'];
  if (questionWords.some(word => text.includes(word))) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function evaluateContext(text, sentences) {
  let score = 40;
  
  // Check for context-providing phrases
  const contextPhrases = ['background', 'context', 'situation', 'scenario', 'for', 'because', 'in order to'];
  const contextCount = contextPhrases.filter(phrase => text.includes(phrase)).length;
  score += contextCount * 15;
  
  // Multiple sentences usually provide more context
  if (sentences.length > 1) score += 20;
  if (sentences.length > 3) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function evaluateStructure(prompt, sentences) {
  let score = 45;
  
  // Check for structured elements
  if (prompt.includes(':') || prompt.includes('-') || prompt.includes('•')) score += 20;
  if (prompt.includes('\n')) score += 15;
  
  // Check for numbered lists or steps
  if (/\d+\.|\d+\)/.test(prompt)) score += 25;
  
  // Proper capitalization and punctuation
  if (prompt[0] === prompt[0].toUpperCase()) score += 10;
  if (prompt.endsWith('.') || prompt.endsWith('?') || prompt.endsWith('!')) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function evaluateExamples(text) {
  let score = 30;
  
  // Check for example indicators
  const exampleTerms = ['example', 'for instance', 'such as', 'like', 'including', 'e.g.'];
  const exampleCount = exampleTerms.filter(term => text.includes(term)).length;
  score += exampleCount * 20;
  
  // Check for constraint words
  const constraintTerms = ['must', 'should', 'avoid', 'don\'t', 'limit', 'maximum', 'minimum'];
  const constraintCount = constraintTerms.filter(term => text.includes(term)).length;
  score += constraintCount * 15;
  
  return Math.max(0, Math.min(100, score));
}

function evaluateTone(text) {
  let score = 60; // Neutral base
  
  // Check for polite language
  const politeTerms = ['please', 'thank you', 'could you', 'would you', 'kindly'];
  if (politeTerms.some(term => text.includes(term))) score += 20;
  
  // Check for clear directive language
  const directiveTerms = ['create', 'write', 'generate', 'analyze', 'explain', 'describe'];
  if (directiveTerms.some(term => text.includes(term))) score += 15;
  
  return Math.max(0, Math.min(100, score));
}

function evaluateActionability(text) {
  let score = 40;
  
  // Check for action verbs
  const actionVerbs = ['write', 'create', 'generate', 'analyze', 'explain', 'describe', 'list', 'compare', 'summarize'];
  const actionCount = actionVerbs.filter(verb => text.includes(verb)).length;
  score += actionCount * 15;
  
  // Check for output format specifications
  const formatTerms = ['format', 'structure', 'organize', 'bullet points', 'paragraph', 'list'];
  if (formatTerms.some(term => text.includes(term))) score += 20;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Generates specific improvement suggestions
 */
function generateSuggestions(prompt) {
  const suggestions = [];
  const text = prompt.toLowerCase();
  const criteria = evaluateCriteria(prompt);
  
  // Clarity suggestions
  if (criteria.clarity < 70) {
    suggestions.push({
      category: 'Clarity',
      suggestion: 'Be more specific about what you want. Instead of "write something about X", try "write a 300-word explanation of X that covers Y and Z aspects".',
      priority: 'high'
    });
  }
  
  // Context suggestions
  if (criteria.context < 60) {
    suggestions.push({
      category: 'Context',
      suggestion: 'Provide background information. Add context about your audience, purpose, or constraints to help generate more relevant responses.',
      priority: 'high'
    });
  }
  
  // Structure suggestions
  if (criteria.structure < 50) {
    suggestions.push({
      category: 'Structure',
      suggestion: 'Organize your prompt with clear sections. Use bullet points, numbers, or line breaks to separate different requirements.',
      priority: 'medium'
    });
  }
  
  // Examples suggestions
  if (criteria.examples < 40) {
    suggestions.push({
      category: 'Examples',
      suggestion: 'Include examples of what you want or don\'t want. This helps clarify your expectations and improves output quality.',
      priority: 'medium'
    });
  }
  
  // Format suggestions
  if (!text.includes('format') && !text.includes('structure')) {
    suggestions.push({
      category: 'Output Format',
      suggestion: 'Specify the desired output format (e.g., "in bullet points", "as a table", "in paragraph form") for better results.',
      priority: 'low'
    });
  }
  
  return suggestions;
}

/**
 * Generates a refined version of the prompt
 */
function generateRefinedPrompt(prompt) {
  const analysis = evaluateCriteria(prompt);
  let refined = prompt;
  
  // Add structure if missing
  if (analysis.structure < 50) {
    refined = addStructure(refined);
  }
  
  // Add context if missing
  if (analysis.context < 60) {
    refined = addContext(refined);
  }
  
  // Add format specification if missing
  if (!prompt.toLowerCase().includes('format')) {
    refined = addFormatSpecification(refined);
  }
  
  return refined;
}

function addStructure(prompt) {
  return `**Task:** ${prompt}\n\n**Requirements:**\n- Be specific and detailed\n- Use clear, professional language\n- Provide examples where relevant`;
}

function addContext(prompt) {
  return `${prompt}\n\n**Context:** Please consider this request in a professional context and tailor your response accordingly.`;
}

function addFormatSpecification(prompt) {
  return `${prompt}\n\n**Format:** Please structure your response with clear headings and bullet points for easy reading.`;
}

/**
 * Generates tone-based variations of the prompt
 */
function generateToneVariations(prompt) {
  const variations = {};
  
  Object.entries(TONE_VARIATIONS).forEach(([key, tone]) => {
    variations[key] = {
      name: tone.name,
      description: tone.description,
      prompt: adaptPromptToTone(prompt, tone)
    };
  });
  
  return variations;
}

function adaptPromptToTone(prompt, tone) {
  const modifier = tone.modifiers[Math.floor(Math.random() * tone.modifiers.length)];
  
  switch (tone.name) {
    case 'Professional':
      return `${modifier}, ${prompt.toLowerCase()}. I would appreciate a comprehensive and well-structured response.`;
    case 'Casual':
      return `${modifier} ${prompt.toLowerCase()}? Thanks!`;
    case 'Technical':
      return `${modifier} the following with technical precision: ${prompt}. Include specific details and methodologies.`;
    case 'Creative':
      return `${modifier} an innovative approach to: ${prompt}. Feel free to think outside the box and explore creative solutions.`;
    case 'Educational':
      return `${modifier} step-by-step how to: ${prompt}. Please include explanations for each step and relevant examples.`;
    default:
      return prompt;
  }
}

/**
 * Identifies prompt strengths
 */
function identifyStrengths(prompt) {
  const strengths = [];
  const criteria = evaluateCriteria(prompt);
  
  Object.entries(criteria).forEach(([key, score]) => {
    if (score >= 75) {
      strengths.push(QUALITY_CRITERIA[key].name);
    }
  });
  
  return strengths;
}

/**
 * Identifies areas for improvement
 */
function identifyImprovements(prompt) {
  const improvements = [];
  const criteria = evaluateCriteria(prompt);
  
  Object.entries(criteria).forEach(([key, score]) => {
    if (score < 60) {
      improvements.push({
        area: QUALITY_CRITERIA[key].name,
        score: score,
        priority: score < 40 ? 'high' : 'medium'
      });
    }
  });
  
  return improvements.sort((a, b) => a.score - b.score);
}