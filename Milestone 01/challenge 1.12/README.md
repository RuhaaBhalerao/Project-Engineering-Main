# AI Chatbot

## What I Built
A minimal AI chatbot with a Node.js Express backend and a vanilla JS frontend. The chatbot supports conversation context by sending full message history.

## API and Model
**API:** OpenRouter  
**Model:** openai/gpt-4o-mini  

**Why backend only:**  
If the API key is placed in frontend JavaScript, anyone can open browser DevTools and steal it. A backend keeps the key secure and prevents misuse.

**Fallback provider:**  
Google Gemini API. Switching requires:
1. Changing base URL  
2. Changing model name  

## Live Deployment
Frontend: https://heartfelt-crumble-167252.netlify.app/ 
Backend: https://project-engineering-main-1.onrender.com