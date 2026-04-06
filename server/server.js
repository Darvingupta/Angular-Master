const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// The new @google/genai SDK requires initialization this way (or we use @google/generative-ai)
// Let's check which one was installed. We installed @google/genai.
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Try to initialize Gemini. If GEMINI_API_KEY is not set, we'll handle the error in requests.
let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI. Is the GEMINI_API_KEY valid?");
  }
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env");
}

const SYSTEM_PROMPT = `
You are a world-class UI/UX Designer and Angular Expert Agent integrated directly into an Angular application.
Your goal is to help the user build beautiful, highly accessible, and user-friendly interfaces.
For styling, use modern CSS/SCSS with nice color palettes, spacing, and micro-interactions.
Focus on the constraints and features of Angular (e.g., Signals, Control Flow).
Be concise, practical, and provide code snippets when asked. If the user asks for a UI layout, provide a solid flexbox or CSS grid based solution.
You can optionally return code components directly to be applied to the system if indicated.
`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  try {
    // Convert generic messages array [{role: 'user', content: '...'}] to the format expected by GenAI
    // The new @google/genai syntax:
    const chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction: SYSTEM_PROMPT
        }
    });
    
    // We can simulate the history or just send the latest message
    // For simplicity, let's just send the last message
    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to communicate with AI.", details: error.message });
  }
});

// 🔥 ✅ ADD ANGULAR STATIC SERVING HERE (IMPORTANT)
const distPath = path.join(__dirname, 'dist/vault-admin');

if (!fs.existsSync(distPath)) {
  console.error("❌ DIST folder not found:", distPath);
}

app.use(express.static(distPath));

// Angular routing support
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.post('/api/apply', async (req, res) => {
  const { filePath, content } = req.body;
  
  // Basic security: only allow writing within the src folder of this project
  const resolvedPath = path.resolve(__dirname, '..', filePath);
  if (!resolvedPath.startsWith(path.resolve(__dirname, '../src'))) {
    return res.status(403).json({ error: "Access denied. Can only apply code to the src/ directory." });
  }

  try {
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    fs.writeFileSync(resolvedPath, content, 'utf8');
    res.json({ success: true, message: `File updated successfully: ${filePath}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to write file.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI Agent Backend running on http://localhost:${PORT}`);
});
