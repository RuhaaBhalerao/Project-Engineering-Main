const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

/**
 * AI Chat Route
 */
app.post('/chat', async (req, res) => {
  try {
    // 1. Extract messages from request body
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // 2. Get API key from environment
    const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // 3. Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: messages
      })
    });

    const data = await response.json();

    // 4. Extract reply safely
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from AI" });
    }

    const reply = data.choices[0].message.content;

    // 5. Send back to frontend
    res.json({ reply });

  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});