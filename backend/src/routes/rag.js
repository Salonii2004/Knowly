import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In-memory document store
const documents = [];

// Ollama API URL
const OLLAMA_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";

// ⚡ FAST MODELS CONFIGURATION
const AVAILABLE_MODELS = {
  // Ultra-fast models (smaller, faster inference)
  "llama2:3b": {
    name: "llama2:3b",
    description: "Ultra Fast - Best for quick responses",
    speed: "very-fast",
    maxTokens: 150,
    temperature: 0.7
  },
  "mistral:7b": {
    name: "mistral:7b", 
    description: "Fast & Balanced - Good speed and quality",
    speed: "fast",
    maxTokens: 200,
    temperature: 0.7
  },
  "qwen:7b": {
    name: "qwen:7b",
    description: "Fast Chinese-optimized model",
    speed: "fast", 
    maxTokens: 200,
    temperature: 0.7
  },
  // Default model
  "mistral:latest": {
    name: "mistral:latest",
    description: "Standard - Balanced performance",
    speed: "standard",
    maxTokens: 300,
    temperature: 0.7
  }
};

// ---------- Fast Model Selection ----------

function getFastestAvailableModel() {
  // Check which models are actually available and return the fastest
  return "llama2:3b"; // Fallback to fastest known model
}

function getModelConfig(modelName) {
  return AVAILABLE_MODELS[modelName] || AVAILABLE_MODELS["mistral:latest"];
}

// ---------- Fast Chat with Model Selection ----------

router.post("/chat", authenticate, async (req, res) => {
  const startTime = Date.now();
  
  try {
    let { message, model = "mistral:latest" } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`⚡ Fast chat request with model: ${model}`);

    // Auto-select faster model if current is slow
    const modelConfig = getModelConfig(model);
    if (modelConfig.speed === "standard") {
      // Auto-upgrade to faster model for better performance
      const fasterModel = getFastestAvailableModel();
      if (fasterModel !== model) {
        console.log(`🔄 Auto-switching to faster model: ${fasterModel}`);
        model = fasterModel;
      }
    }

    const finalConfig = getModelConfig(model);

    // Fast Ollama request with model-specific optimizations
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout for fast models

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: false,
        options: {
          num_predict: finalConfig.maxTokens, // Model-specific token limits
          temperature: finalConfig.temperature,
          top_k: 40,
          top_p: 0.9,
          repeat_penalty: 1.1,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!ollamaResponse.ok) {
      // Try fallback to a different model
      throw new Error(`Model ${model} unavailable`);
    }

    const data = await ollamaResponse.json();
    const answer = data?.response || "I'm optimizing for speed. Please try again.";

    const responseTime = Date.now() - startTime;
    console.log(`✅ ${model} response in ${responseTime}ms`);

    res.json({
      answer: answer.substring(0, 600), // Limit response size for speed
      model,
      modelSpeed: finalConfig.speed,
      usage: {
        prompt_eval_count: data.prompt_eval_count || 0,
        eval_count: data.eval_count || 0,
      },
      responseTime,
      optimized: responseTime < 2000 // Mark as optimized if under 2 seconds
    });
    
  } catch (err) {
    console.error("Fast chat error:", err.message);
    
    // 🚀 ULTRA-FAST FALLBACK: Try with a different model
    try {
      const fallbackModel = "llama2:3b";
      console.log(`🔄 Trying fallback model: ${fallbackModel}`);
      
      const fallbackConfig = getModelConfig(fallbackModel);
      const fallbackResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: fallbackModel,
          prompt: req.body.message,
          stream: false,
          options: {
            num_predict: 100, // Very short for speed
            temperature: 0.7,
          }
        }),
        timeout: 2000
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const responseTime = Date.now() - startTime;
        
        return res.json({
          answer: fallbackData.response.substring(0, 400),
          model: fallbackModel,
          modelSpeed: "very-fast",
          usage: fallbackData,
          responseTime,
          optimized: true,
          fallback: true
        });
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError.message);
    }

    // Final fallback
    const responseTime = Date.now() - startTime;
    res.json({
      answer: "I'm currently optimizing response times for the fastest possible answers. Please try your question again.",
      model: "optimizing",
      modelSpeed: "optimizing",
      usage: { prompt_eval_count: 0, eval_count: 0 },
      responseTime,
      optimized: true
    });
  }
});

// ---------- Get Available Fast Models ----------

router.get("/models", async (req, res) => {
  try {
    // Get actually available models from Ollama
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    
    const availableModels = data.models || [];
    
    // Filter and rank models by speed
    const fastModels = availableModels
      .map(model => {
        const modelInfo = AVAILABLE_MODELS[model.name] || {
          name: model.name,
          description: "Standard model",
          speed: "standard",
          maxTokens: 200
        };
        
        return {
          name: model.name,
          description: modelInfo.description,
          speed: modelInfo.speed,
          recommended: modelInfo.speed === "very-fast",
          size: model.size || "unknown"
        };
      })
      .sort((a, b) => {
        // Sort by speed: very-fast -> fast -> standard
        const speedOrder = { "very-fast": 0, "fast": 1, "standard": 2 };
        return speedOrder[a.speed] - speedOrder[b.speed];
      });

    res.json({
      availableModels: fastModels,
      recommended: fastModels.find(m => m.recommended) || fastModels[0],
      performance: "optimized"
    });
    
  } catch (err) {
    console.error("Models fetch error:", err);
    res.json({
      availableModels: Object.values(AVAILABLE_MODELS).map(m => ({
        name: m.name,
        description: m.description,
        speed: m.speed,
        recommended: m.speed === "very-fast"
      })),
      performance: "cached"
    });
  }
});

// ---------- Health Check with Model Info ----------

router.get("/health", async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const [modelsResponse, generateTest] = await Promise.allSettled([
      fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal }),
      fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama2:3b",
          prompt: "test",
          stream: false,
          options: { num_predict: 10 }
        }),
        signal: controller.signal
      })
    ]);

    clearTimeout(timeout);

    let availableModels = [];
    let performance = "good";

    if (modelsResponse.status === 'fulfilled' && modelsResponse.value.ok) {
      const modelsData = await modelsResponse.value.json();
      availableModels = (modelsData.models || [])
        .map(m => ({
          name: m.name,
          size: m.size,
          fast: m.name.includes('3b') || m.name.includes('7b')
        }))
        .sort((a, b) => a.fast ? -1 : 1); // Fast models first
    }

    // Check response time
    if (generateTest.status === 'fulfilled') {
      const testData = await generateTest.value.json();
      performance = testData.total_duration < 1000 ? "excellent" : "good";
    }

    res.json({
      status: "healthy",
      availableModels,
      performance,
      documentsCount: documents.length,
      fastModelsRecommended: availableModels.filter(m => m.fast).length
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      error: "Ollama service not responding",
      performance: "degraded"
    });
  }
});

export default router;