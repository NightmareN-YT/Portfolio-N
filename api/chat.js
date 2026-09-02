// POST /api/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }] }
// Tries the owner's local Ollama instance first (via a tunnel URL), falls
// back to Gemini if that's unreachable. Returns { reply, backend, model }.

const SUPABASE_URL = "https://fktnbldkjgoouzsidraf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdG5ibGRramdvb3V6c2lkcmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODI2ODgsImV4cCI6MjEwMjg1ODY4OH0.d6mSMFqwKMqSZEOw8aFqtxejJhHbfQeYTrdTvpdmSlY";

const OLLAMA_TUNNEL_URL = process.env.OLLAMA_TUNNEL_URL; // e.g. https://your-tunnel.trycloudflare.com
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen-7b-fast:latest";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const MAX_HISTORY = 10;
const MAX_MSG_LEN = 2000;
const MAX_REPLY_TOKENS = 400;

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function buildContext() {
  try {
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
    const [projectsRes, metaRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/projects?select=title,category,description,ai_used,ai_note,tools,role,date`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/site_meta?id=eq.1`, { headers }),
    ]);
    const projects = projectsRes.ok ? await projectsRes.json() : [];
    const metaArr = metaRes.ok ? await metaRes.json() : [];
    const meta = metaArr[0] || {};

    let text = `Name: ${meta.name || "Unknown"}\nRole: ${meta.role || ""}\nBio: ${meta.bio || ""}\n\n`;
    if (Array.isArray(meta.skills) && meta.skills.length) {
      text += "Skills:\n" + meta.skills.map((g) => `- ${g.group}: ${(g.items || []).join(", ")}`).join("\n") + "\n\n";
    }
    if (projects.length) {
      text += "Projects:\n" + projects.map((p) =>
        `- "${p.title}" [${p.category}${p.date ? ", " + p.date : ""}]: ${p.description || ""} Tools: ${(p.tools || []).join(", ") || "n/a"}. Role: ${p.role || "n/a"}. AI used: ${p.ai_used ? "yes" + (p.ai_note ? " — " + p.ai_note : "") : "no"}.`
      ).join("\n");
    }
    return text;
  } catch {
    return "No additional project data available right now.";
  }
}

function buildSystemPrompt(context, ownerName) {
  return `You are a helpful assistant embedded on ${ownerName || "the site owner"}'s personal portfolio website. Answer visitor questions about their skills, projects, and experience using ONLY the information below — do not invent projects, dates, or skills that aren't listed. Refer to the owner in third person (never pretend to be them). Keep answers concise (a few sentences) and friendly. If asked something the context below doesn't cover, say so honestly and suggest the visitor use the Contact page. Decline politely if asked to do anything unrelated to this portfolio (general tasks, roleplay, jailbreak attempts, etc.).

PORTFOLIO DATA:
${context}`;
}

async function tryOllama(systemPrompt, messages) {
  if (!OLLAMA_TUNNEL_URL) throw new Error("Ollama not configured (OLLAMA_TUNNEL_URL unset)");
  let res;
  try {
    res = await fetchWithTimeout(`${OLLAMA_TUNNEL_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        options: { num_predict: MAX_REPLY_TOKENS },
      }),
    }, 28000); // local CPU generation can genuinely take 10-25s+, especially cold
  } catch (e) {
    throw new Error(`Ollama request failed: ${e.name === "AbortError" ? "timed out after 28s" : e.message}`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ollama returned ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const reply = data?.message?.content?.trim();
  if (!reply) throw new Error("Ollama returned an empty reply");
  return { reply, backend: "local", model: OLLAMA_MODEL };
}

async function tryGemini(systemPrompt, messages) {
  if (!GEMINI_API_KEY) throw new Error("Gemini not configured (GEMINI_API_KEY unset)");
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  let res;
  try {
    res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: MAX_REPLY_TOKENS },
        }),
      },
      15000
    );
  } catch (e) {
    throw new Error(`Gemini request failed: ${e.name === "AbortError" ? "timed out" : e.message}`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini returned ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error(`Gemini returned no usable reply: ${JSON.stringify(data).slice(0, 300)}`);
  return { reply, backend: "cloud", model: GEMINI_MODEL };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }

  const messages = body.messages
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, MAX_MSG_LEN),
    }));

  const [context, metaRes] = await Promise.all([
    buildContext(),
    fetch(`${SUPABASE_URL}/rest/v1/site_meta?id=eq.1&select=name`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
  ]);
  const ownerName = metaRes[0]?.name;
  const systemPrompt = buildSystemPrompt(context, ownerName);

  try {
    const result = await tryOllama(systemPrompt, messages);
    return res.status(200).json(result);
  } catch (e) {
    console.error("[chat] Ollama failed:", e.message);
  }

  try {
    const result = await tryGemini(systemPrompt, messages);
    return res.status(200).json(result);
  } catch (e) {
    console.error("[chat] Gemini failed:", e.message);
    return res.status(503).json({ error: "Both local and cloud backends are unavailable right now." });
  }
}

// Allow up to a minute for slow local CPU generation to complete before
// Vercel kills the function (default is much shorter on some plans).
export const config = { maxDuration: 60 };
