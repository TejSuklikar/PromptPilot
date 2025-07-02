// backend/routes/score.js

const express = require("express");
const { Anthropic } = require("@anthropic-ai/sdk");

// 1️⃣ Instantiate the Claude client with your API key
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // 2️⃣ Extract the user's prompt from the request body
    const { prompt } = req.body;

    // 3️⃣ Build a super-detailed system instruction
    const systemMessage = `
You are PromptPilot’s senior/expert/master AI prompt evaluation engine. Follow these instructions exactly:

1. **Overall Score**
   • On a scale of 1–10 (1 = unusable, 10 = perfect), rate the prompt for its likelihood to produce a correct, detailed, and focused response from a modern LLM.

2. **Category Tags**
   • Identify the prompt’s type by selecting one or more of:
     ["question", "instruction", "creative_writing", "code_generation", "translation", "summary", "analysis", "other"]

3. **Detailed Breakdown**
   For each criterion, assign a sub-score (1–10) and a concise comment (5–12 words):
   - Clarity: how clearly the request is phrased  
   - Specificity: how well it defines scope, constraints, or format  
   - Context: whether it includes necessary background or examples  
   - Brevity: how concise and focused the language is  
   - Feasibility: how likely an LLM can fulfill it without extra instructions  
   - Creativity: how much it encourages novel or original output  

4. **Success Prediction**
   • Predict the probability (0–100%) this prompt will succeed on each model:
     - GPT-o3  
     - Claude-4 Sonnet  
     - Gemini 1.5 Pro  

5. **Overall Comment**
   • Summarize in 1–2 sentences the prompt’s main strength and biggest weakness.  

6. **Improved Rewrite**
   • Provide a single-paragraph, fully-polished rewrite that addresses all identified issues.  

7. **Output Format**
   Respond in valid JSON ONLY, with exactly these keys (no extra text):

\`\`\`json
{
  "overall_score": <number 1–10>,
  "tags": [ "question", … ],
  "breakdown": {
    "clarity":    { "score": <1–10>, "comment": "<…>" },
    "specificity":{ "score": <1–10>, "comment": "<…>" },
    "context":    { "score": <1–10>, "comment": "<…>" },
    "brevity":    { "score": <1–10>, "comment": "<…>" },
    "feasibility":{ "score": <1–10>, "comment": "<…>" },
    "creativity": { "score": <1–10>, "comment": "<…>" }
  },
  "success_prediction": {
    "GPT-o3":    "<0–100%>",
    "Claude-4 Sonnet": "<0–100%>",
    "Gemini 1.5 Pro":  "<0–100%>"
  },
  "overall_comment": "<…>",
  "rewrite": "<…improved prompt…>"
}
\`\`\`

User Prompt:
"""${prompt}"""
`;

    // 4️⃣ Call Claude's Messages API
    const response = await claude.messages.create({
      model:      "claude-2",     // supported model
      system:     systemMessage,  // top-level instruction
      messages:   [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.0
    });

    // 5️⃣ Inspect the raw response
    console.log("🪵 Claude raw response:", response);

    // 6️⃣ Extract the generated text, handling various formats
    let text = null;

    // a) Completions-style
    if (typeof response.completion === "string") {
      text = response.completion;
    }
    // b) Chat-style (messages array)
    else if (
      Array.isArray(response.messages) &&
      typeof response.messages[0]?.content === "string"
    ) {
      text = response.messages[0].content;
    }
    // c) Chunked content array
    else if (
      Array.isArray(response.content) &&
      response.content.every((c) => typeof c.text === "string")
    ) {
      text = response.content.map((c) => c.text).join("");
    }

    if (!text) {
      console.error("⚠️ Couldn't find any text in Claude response");
      return res.status(500).json({ error: "No AI output found" });
    }

    // 7️⃣ Extract the JSON block between ```json ... ```
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (!match) {
      console.error("⚠️ No JSON fence found in Claude response:", text);
      return res.status(500).json({ error: "AI response missing JSON block" });
    }
    const jsonPayload = match[1];

    // 8️⃣ Parse and return the JSON
    let result;
    try {
      result = JSON.parse(jsonPayload);
    } catch (err) {
      console.error("📦 Failed to parse JSON:", err, jsonPayload);
      return res.status(500).json({ error: "AI JSON parse error" });
    }

    return res.json(result);

  } catch (err) {
    console.error("❌ Scoring error:", err);
    return res.status(500).json({ error: "Failed to score prompt" });
  }
});

module.exports = router;
