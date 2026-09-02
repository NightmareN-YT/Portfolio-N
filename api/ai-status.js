// GET /api/ai-status
// Lightweight health check for the status dot — does NOT send a real chat
// message (that would cost tokens on every 45s poll). Just checks whether
// the local Ollama tunnel responds, falling back to reporting "cloud" if
// a Gemini key is configured, or "offline" if neither is reachable.

const OLLAMA_TUNNEL_URL = process.env.OLLAMA_TUNNEL_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function ollamaIsUp() {
  if (!OLLAMA_TUNNEL_URL) return false;
  try {
    // /api/tags just lists installed models — cheap, no generation involved.
    const res = await fetchWithTimeout(`${OLLAMA_TUNNEL_URL}/api/tags`, {}, 3000);
    return res.ok;
  } catch {
    return false;
  }
}

async function geminiIsUp() {
  if (!GEMINI_API_KEY) return false;
  try {
    // Minimal real call (1 output token) to confirm the key and model
    // actually work — checking for key *presence* alone was misleading
    // the status dot when the key or model name was wrong.
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "hi" }] }],
          generationConfig: { maxOutputTokens: 1 },
        }),
      },
      5000
    );
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (await ollamaIsUp()) {
    return res.status(200).json({ status: "local" });
  }
  if (await geminiIsUp()) {
    return res.status(200).json({ status: "cloud" });
  }
  return res.status(200).json({ status: "offline" });
}
