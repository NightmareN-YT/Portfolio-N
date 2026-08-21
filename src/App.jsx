import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Gamepad2, Box, Palette, Sparkles, Lock, Plus, Trash2, Pencil, X,
  ExternalLink, Upload, ChevronLeft, Check, ArrowRight, Mail,
  Globe, LogOut, Terminal, AlertCircle,
} from "lucide-react";

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3" />
  </svg>
);
const Linkedin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.11 20.45H3.56V9h3.55z" />
  </svg>
);

/* ============================================================
   SUPABASE CONFIG — fill these in with YOUR project's values
   Project Settings -> API -> Project URL / anon public key
   ============================================================ */
const SUPABASE_URL = "https://fktnbldkjgoouzsidraf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdG5ibGRramdvb3V6c2lkcmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODI2ODgsImV4cCI6MjEwMjg1ODY4OH0.d6mSMFqwKMqSZEOw8aFqtxejJhHbfQeYTrdTvpdmSlY";

const CATEGORIES = [
  { id: "games", label: "Games", short: "GAMES", icon: Gamepad2 },
  { id: "blender", label: "3D / Blender", short: "3D-BLENDER", icon: Box },
  { id: "2d-art", label: "2D Art", short: "2D-ART", icon: Palette },
  { id: "other", label: "Other", short: "OTHER", icon: Sparkles },
];

// Which image groups each category collects, in display order.
// "single: true" groups only ever hold one image (used as the card thumbnail).
const IMAGE_GROUPS = {
  games: [
    { key: "cover", label: "Cover Image", single: true },
    { key: "screenshot", label: "Screenshots", single: false },
  ],
  blender: [
    { key: "final", label: "Final Render", single: false },
    { key: "process", label: "Process", single: false },
  ],
  "2d-art": [
    { key: "final", label: "Final Render", single: false },
    { key: "process", label: "Process", single: false },
  ],
  other: [
    { key: "general", label: "Images", single: false },
  ],
};
const thumbnailOf = (project) => {
  const imgs = project.images || [];
  return (
    imgs.find((i) => i.group === "cover")?.url ||
    imgs.find((i) => i.group === "final")?.url ||
    imgs[0]?.url ||
    project.image_url ||
    ""
  );
};

const DEFAULT_META = {
  name: "Your Name",
  role: "Creator / Developer",
  tagline: "Building games, 3D worlds, art, and AI-powered tools.",
  bio: "Write a short bio here about who you are, what you make, and how you work. Edit this from the admin panel.",
  email: "",
  links: { github: "", linkedin: "", itch: "", artstation: "", other: "" },
  skills: [
    { group: "Programming", items: ["JavaScript", "Python", "C#"] },
    { group: "3D & Art Tools", items: ["Blender", "Photoshop", "Substance Painter"] },
    { group: "AI Tools", items: ["OpenAI API", "Claude API", "Stable Diffusion"] },
    { group: "Web Dev", items: ["React", "Node.js", "Tailwind CSS"] },
  ],
};

/* ============================================================
   STYLE
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .pf-root {
      --bg: #0B0D12; --surface: #12141B; --surface-2: #171A23; --line: #262B36;
      --text: #EDEEF2; --muted: #8B909C; --accent: #7C5CFF;
      --ai-yes: #FF9F43; --ai-yes-soft: rgba(255,159,67,0.12);
      --ai-no: #38D9A9; --ai-no-soft: rgba(56,209,169,0.12);
      background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif;
      min-height: 100vh; width: 100%;
    }
    .pf-root * { box-sizing: border-box; }
    .pf-mono { font-family: 'JetBrains Mono', monospace; }
    .pf-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
    .pf-scrollbar::-webkit-scrollbar-thumb { background: var(--line); }
    .pf-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .pf-badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 8px; border: 1px solid; }
    .pf-badge.yes { color: var(--ai-yes); background: var(--ai-yes-soft); border-color: rgba(255,159,67,0.35); }
    .pf-badge.no { color: var(--ai-no); background: var(--ai-no-soft); border-color: rgba(56,209,169,0.35); }
    .pf-card { background: var(--surface); border: 1px solid var(--line); transition: border-color .15s ease, transform .15s ease; cursor: pointer; }
    .pf-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .pf-nav-tab { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--muted); padding: 8px 12px; border: 1px solid transparent; cursor: pointer; white-space: nowrap; background: none; display: inline-flex; align-items: center; gap: 6px; }
    .pf-nav-tab:hover { color: var(--text); }
    .pf-nav-tab.active { color: var(--text); border-color: var(--line); background: var(--surface-2); }
    .pf-btn { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.04em; padding: 10px 16px; border: 1px solid var(--line); background: var(--surface); color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: border-color .15s ease, background .15s ease; }
    .pf-btn:hover { border-color: var(--accent); }
    .pf-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .pf-btn.primary { background: var(--accent); border-color: var(--accent); color: #0B0D12; font-weight: 700; }
    .pf-btn.primary:hover { opacity: 0.9; }
    .pf-btn.danger:hover { border-color: #FF6A6A; color: #FF6A6A; }
    .pf-input { width: 100%; background: var(--surface-2); border: 1px solid var(--line); color: var(--text); padding: 10px 12px; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; }
    .pf-input:focus { border-color: var(--accent); }
    .pf-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }
    .pf-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  `}</style>
);

/* ============================================================
   SUPABASE HELPERS (plain REST calls — no SDK needed)
   ============================================================ */
const REST = `${SUPABASE_URL}/rest/v1`;
const AUTH = `${SUPABASE_URL}/auth/v1`;
const STORAGE = `${SUPABASE_URL}/storage/v1`;
const CONFIGURED = !SUPABASE_URL.includes("YOUR-PROJECT-REF");

function headers(token) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

async function sbGet(path) {
  const res = await fetch(`${REST}/${path}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function sbInsert(table, body, token) {
  const res = await fetch(`${REST}/${table}`, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function sbUpdate(table, id, body, token) {
  const res = await fetch(`${REST}/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function sbUpdateMeta(body, token) {
  const res = await fetch(`${REST}/site_meta?id=eq.1`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function sbDelete(table, id, token) {
  const res = await fetch(`${REST}/${table}?id=eq.${id}`, { method: "DELETE", headers: headers(token) });
  if (!res.ok) throw new Error(await res.text());
}
async function sbLogin(email, password) {
  const res = await fetch(`${AUTH}/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Login failed");
  return data.access_token;
}
async function sbUploadFile(file, token, folder = "uploads") {
  const safeExt = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${safeExt}`;
  const res = await fetch(`${STORAGE}/object/project-images/${path}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}`, "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/project-images/${path}`;
}

function compressImage(file, maxDimension = 1200, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const longEdge = Math.max(img.width, img.height);
        const scale = Math.min(1, maxDimension / longEdge);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })), "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   SHARED UI
   ============================================================ */
const AiBadge = ({ used }) => (
  <span className={`pf-badge ${used ? "yes" : "no"}`}>
    <span className="pf-dot" style={{ background: used ? "#FF9F43" : "#38D9A9" }} />
    {used ? "AI: ASSISTED" : "AI: NONE"}
  </span>
);
const CategoryIcon = ({ id, size = 14 }) => {
  const cat = CATEGORIES.find((c) => c.id === id);
  const Icon = cat ? cat.icon : Sparkles;
  return <Icon size={size} strokeWidth={1.75} />;
};

function ProjectCard({ project, onOpen }) {
  const thumb = thumbnailOf(project);
  return (
    <div className="pf-card" style={{ minWidth: 240, maxWidth: 240 }} onClick={() => onOpen(project)}>
      <div style={{ height: 150, background: "var(--surface-2)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {thumb ? <img src={thumb} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CategoryIcon id={project.category} size={28} />}
      </div>
      <div style={{ padding: 12 }}>
        <div className="pf-mono" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{project.title}</div>
        <AiBadge used={project.ai_used} />
      </div>
    </div>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav({ route, setRoute, meta }) {
  const tabs = [...CATEGORIES.map((c) => ({ id: c.id, label: c.short })), { id: "skills", label: "SKILLS" }, { id: "about", label: "ABOUT" }, { id: "contact", label: "CONTACT" }];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(11,13,18,0.92)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div className="pf-mono" style={{ fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setRoute({ page: "home" })}>
          <Terminal size={16} color="var(--accent)" /> {meta.name}
        </div>
        <div className="pf-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {tabs.map((t) => <button key={t.id} className={`pf-nav-tab ${route.page === t.id ? "active" : ""}`} onClick={() => setRoute({ page: t.id })}>{t.label}</button>)}
        </div>
        <button className="pf-nav-tab" onClick={() => setRoute({ page: "admin" })}><Lock size={12} /> ADMIN</button>
      </div>
    </div>
  );
}

/* ============================================================
   HOME / CATEGORY / MODAL / SKILLS / ABOUT / CONTACT
   ============================================================ */
function Home({ meta, projects, setRoute, openProject }) {
  const featured = projects.slice(0, 6);
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 20px 40px" }}>
      <div className="pf-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 14 }}>$ whoami --role="{meta.role}"</div>
      <h1 className="pf-mono" style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 800, lineHeight: 1.1, margin: 0, maxWidth: 760 }}>{meta.name}</h1>
      <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560, marginTop: 16, lineHeight: 1.6 }}>{meta.tagline}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => <button key={c.id} className="pf-btn" onClick={() => setRoute({ page: c.id })}><c.icon size={14} /> {c.label}</button>)}
      </div>
      <div style={{ marginTop: 56 }}>
        <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 14 }}>// FEATURED</div>
        <div className="pf-scrollbar" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {featured.length === 0 && <div style={{ color: "var(--muted)" }}>No projects yet — add some from the admin panel.</div>}
          {featured.map((p) => <ProjectCard key={p.id} project={p} onOpen={openProject} />)}
        </div>
      </div>
      {CATEGORIES.map((c) => {
        const items = projects.filter((p) => p.category === c.id).slice(0, 3);
        if (items.length === 0) return null;
        return (
          <div key={c.id} style={{ marginTop: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}><c.icon size={13} /> {c.short}</div>
              <button className="pf-nav-tab" onClick={() => setRoute({ page: c.id })}>VIEW ALL <ArrowRight size={12} /></button>
            </div>
            <div className="pf-scrollbar" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
              {items.map((p) => <ProjectCard key={p.id} project={p} onOpen={openProject} />)}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 56 }}>
        <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 14 }}>// SKILLS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {meta.skills.flatMap((g) => g.items).slice(0, 14).map((s, i) => <span key={i} className="pf-mono" style={{ fontSize: 11, border: "1px solid var(--line)", padding: "6px 10px", color: "var(--muted)" }}>{s}</span>)}
        </div>
        <button className="pf-nav-tab" style={{ marginTop: 14, paddingLeft: 0 }} onClick={() => setRoute({ page: "skills" })}>VIEW ALL SKILLS <ArrowRight size={12} /></button>
      </div>
      <Footer meta={meta} />
    </div>
  );
}

function Footer({ meta }) {
  return (
    <div style={{ marginTop: 72, borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div className="pf-mono" style={{ fontSize: 11, color: "var(--muted)" }}>© {new Date().getFullYear()} {meta.name}</div>
      <div style={{ display: "flex", gap: 14 }}>
        {meta.email && <a href={`mailto:${meta.email}`} style={{ color: "var(--muted)" }}><Mail size={16} /></a>}
        {meta.links.github && <a href={meta.links.github} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}><Github size={16} /></a>}
        {meta.links.linkedin && <a href={meta.links.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}><Linkedin size={16} /></a>}
        {meta.links.other && <a href={meta.links.other} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}><Globe size={16} /></a>}
      </div>
    </div>
  );
}

function CategoryPage({ catId, projects, openProject, setRoute, meta }) {
  const [filter, setFilter] = useState("all");
  const cat = CATEGORIES.find((c) => c.id === catId);
  let items = projects.filter((p) => p.category === catId);
  if (filter === "ai") items = items.filter((p) => p.ai_used);
  if (filter === "manual") items = items.filter((p) => !p.ai_used);
  items = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> BACK</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><cat.icon size={22} /><h2 className="pf-mono" style={{ fontSize: 26, margin: 0 }}>{cat.label}</h2></div>
      <div style={{ display: "flex", gap: 8, margin: "18px 0 28px" }}>
        {[["all", "All"], ["ai", "AI-assisted"], ["manual", "No AI"]].map(([id, label]) => <button key={id} className={`pf-nav-tab ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{label}</button>)}
      </div>
      {items.length === 0 ? <div style={{ color: "var(--muted)" }}>No projects in this category yet.</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
          {items.map((p) => <ProjectCard key={p.id} project={p} onOpen={openProject} />)}
        </div>
      )}
      <Footer meta={meta} />
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const groups = IMAGE_GROUPS[project.category] || [];
  const imgs = project.images || [];
  const hero = thumbnailOf(project);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div className="pf-scrollbar" style={{ background: "var(--surface)", border: "1px solid var(--line)", maxWidth: 920, width: "100%", maxHeight: "92vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "rgba(18,20,27,0.95)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
          <button className="pf-nav-tab" style={{ paddingLeft: 0 }} onClick={onClose}><ChevronLeft size={12} /> BACK</button>
          <button className="pf-btn" onClick={onClose}><X size={14} /></button>
        </div>

        {hero && (
          <div style={{ maxHeight: "50vh", minHeight: 200, background: "var(--surface-2)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={hero} alt={project.title} style={{ width: "100%", maxHeight: "50vh", objectFit: "contain" }} />
          </div>
        )}

        <div style={{ padding: 28 }}>
          <h3 className="pf-mono" style={{ fontSize: 24, margin: 0 }}>{project.title}</h3>
          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            <AiBadge used={project.ai_used} />
            {project.date && <span className="pf-mono" style={{ fontSize: 11, color: "var(--muted)", border: "1px solid var(--line)", padding: "4px 8px" }}>{project.date}</span>}
          </div>
          {project.ai_used && project.ai_note && <p style={{ fontSize: 13, color: "var(--ai-yes)", background: "var(--ai-yes-soft)", padding: "8px 10px", border: "1px solid rgba(255,159,67,0.3)" }}>{project.ai_note}</p>}
          <p style={{ color: "var(--text)", lineHeight: 1.6, fontSize: 14, marginTop: 14, whiteSpace: "pre-wrap" }}>{project.description}</p>
          {project.role && <p style={{ color: "var(--muted)", fontSize: 13 }}><strong style={{ color: "var(--text)" }}>Role:</strong> {project.role}</p>}
          {project.tools?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {project.tools.map((t, i) => <span key={i} className="pf-mono" style={{ fontSize: 10, border: "1px solid var(--line)", padding: "4px 8px", color: "var(--muted)" }}>{t}</span>)}
            </div>
          )}
          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="pf-btn primary" style={{ marginTop: 20, textDecoration: "none" }}>View project <ExternalLink size={13} /></a>}

          {/* Category-specific image galleries (screenshots / process shots / general images) */}
          {groups.map((g) => {
            // For "single" groups (cover) we already showed it as the hero image up top — skip repeating it.
            if (g.single) return null;
            const items = imgs.filter((i) => i.group === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key} style={{ marginTop: 28 }}>
                <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 10 }}>{g.label.toUpperCase()}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
                  {items.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noreferrer" style={{ display: "block", border: "1px solid var(--line)", overflow: "hidden" }}>
                      <img src={img.url} alt={`${g.label} ${i + 1}`} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* PDF attachment (Other category) */}
          {project.pdf_url && (
            <div style={{ marginTop: 28 }}>
              <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 10 }}>ATTACHMENT</div>
              <a href={project.pdf_url} target="_blank" rel="noreferrer" className="pf-btn" style={{ textDecoration: "none" }}>
                <ExternalLink size={13} /> Open PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsPage({ meta, setRoute }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> BACK</button>
      <h2 className="pf-mono" style={{ fontSize: 26, marginBottom: 28 }}>Skills</h2>
      {meta.skills.map((g, i) => (
        <div key={i} style={{ marginBottom: 26 }}>
          <div className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--accent)", marginBottom: 10 }}>{g.group.toUpperCase()}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{g.items.map((s, j) => <span key={j} className="pf-mono" style={{ fontSize: 12, border: "1px solid var(--line)", padding: "7px 12px" }}>{s}</span>)}</div>
        </div>
      ))}
    </div>
  );
}
function AboutPage({ meta, setRoute }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> BACK</button>
      <h2 className="pf-mono" style={{ fontSize: 26, marginBottom: 20 }}>About</h2>
      <p style={{ lineHeight: 1.8, fontSize: 15, whiteSpace: "pre-wrap" }}>{meta.bio}</p>
    </div>
  );
}
function ContactPage({ meta, setRoute }) {
  const rows = [
    { icon: Mail, label: "Email", value: meta.email, href: meta.email ? `mailto:${meta.email}` : null },
    { icon: Github, label: "GitHub", value: meta.links.github, href: meta.links.github || null },
    { icon: Linkedin, label: "LinkedIn", value: meta.links.linkedin, href: meta.links.linkedin || null },
    { icon: Globe, label: "Itch.io", value: meta.links.itch, href: meta.links.itch || null },
    { icon: Globe, label: "ArtStation", value: meta.links.artstation, href: meta.links.artstation || null },
    { icon: Globe, label: "Other", value: meta.links.other, href: meta.links.other || null },
  ].filter((r) => r.value);
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> BACK</button>
      <h2 className="pf-mono" style={{ fontSize: 26, marginBottom: 20 }}>Contact</h2>
      {rows.length === 0 && <div style={{ color: "var(--muted)" }}>Add your contact links from the admin panel.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => (
          <a key={i} href={r.href} target="_blank" rel="noreferrer" className="pf-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, textDecoration: "none", color: "var(--text)" }}>
            <r.icon size={16} color="var(--accent)" />
            <div><div className="pf-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{r.label.toUpperCase()}</div><div style={{ fontSize: 14 }}>{r.value}</div></div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN
   ============================================================ */
const EMPTY_PROJECT = { title: "", category: "games", description: "", ai_used: false, ai_note: "", tools: [], role: "", date: "", link: "", images: [], pdf_url: "" };

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr("");
    try {
      const token = await sbLogin(email, pass);
      onLogin(token);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  if (!CONFIGURED) {
    return (
      <div style={{ maxWidth: 460, margin: "80px auto", padding: "0 20px" }}>
        <div className="pf-mono" style={{ display: "flex", gap: 10, color: "var(--ai-yes)", alignItems: "flex-start" }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Supabase isn't connected yet. Set SUPABASE_URL and SUPABASE_ANON_KEY at the top of the code to your project's values, then reload.</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: "0 20px" }}>
      <div className="pf-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 10 }}>$ admin --login</div>
      <h2 className="pf-mono" style={{ fontSize: 22, marginBottom: 20 }}>Admin access</h2>
      <label className="pf-label">Email</label>
      <input className="pf-input" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 14 }} />
      <label className="pf-label">Password</label>
      <input type="password" className="pf-input" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
      {err && <div style={{ color: "#FF6A6A", fontSize: 12, marginTop: 8 }}>{err}</div>}
      <button className="pf-btn primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} disabled={loading} onClick={submit}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 20, lineHeight: 1.6 }}>
        This account was created in your Supabase project under Authentication → Users. Sign-up is disabled for everyone else.
      </p>
    </div>
  );
}

function ImageGroupField({ group, images, onAdd, onRemove, uploadingKey, onUpload }) {
  const items = images.filter((i) => i.group === group.key);
  const fileRef = useRef();
  const isUploading = uploadingKey === group.key;

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    await onUpload(file, group.key, group.single);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <label className="pf-label">{group.label}{group.single ? "" : " (add as many as you like)"}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {items.map((img, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={img.url} alt="" style={{ width: 72, height: 72, objectFit: "cover", border: "1px solid var(--line)" }} />
            <button
              onClick={() => onRemove(group.key, i)}
              style={{ position: "absolute", top: -6, right: -6, background: "#FF6A6A", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={11} color="#0B0D12" />
            </button>
          </div>
        ))}
      </div>
      {(!group.single || items.length === 0) && (
        <button className="pf-btn" onClick={() => fileRef.current.click()} disabled={isUploading}>
          <Upload size={13} /> {isUploading ? "Uploading..." : `Upload ${group.single ? "image" : "image(s)"}`}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

function ProjectForm({ initial, token, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_PROJECT);
  const [toolsText, setToolsText] = useState((initial?.tools || []).join(", "));
  const [uploadingKey, setUploadingKey] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const pdfRef = useRef();

  const groups = IMAGE_GROUPS[form.category] || [];

  const uploadToGroup = async (file, groupKey, single) => {
    setUploadingKey(groupKey); setErr("");
    try {
      const compressed = await compressImage(file);
      const url = await sbUploadFile(compressed, token, "uploads");
      setForm((f) => {
        const others = single ? (f.images || []).filter((i) => i.group !== groupKey) : (f.images || []);
        return { ...f, images: [...others, { url, group: groupKey }] };
      });
    } catch (e2) {
      setErr("Image upload failed: " + e2.message);
    }
    setUploadingKey(null);
  };

  const removeImage = (groupKey, index) => {
    setForm((f) => {
      const items = (f.images || []).filter((i) => i.group === groupKey);
      const toRemove = items[index];
      return { ...f, images: (f.images || []).filter((i) => i !== toRemove) };
    });
  };

  const handlePdf = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") { setErr("Please choose a PDF file."); return; }
    setUploadingPdf(true); setErr("");
    try {
      const url = await sbUploadFile(file, token, "attachments");
      setForm((f) => ({ ...f, pdf_url: url }));
    } catch (e2) {
      setErr("PDF upload failed: " + e2.message);
    }
    setUploadingPdf(false);
  };

  const submit = async () => {
    if (!form.title.trim()) { setErr("Give the project a title."); return; }
    setSaving(true); setErr("");
    try {
      const tools = toolsText.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tools };
      await onSave(payload);
    } catch (e2) {
      setErr("Save failed: " + e2.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ border: "1px solid var(--line)", background: "var(--surface)", padding: 20, marginBottom: 20 }}>
      <div className="pf-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 16 }}>{initial ? "// EDIT PROJECT" : "// NEW PROJECT"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div><label className="pf-label">Title</label><input className="pf-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="pf-label">Category</label>
          <select className="pf-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <label className="pf-label">Description</label>
      <textarea className="pf-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginBottom: 14, resize: "vertical" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div><label className="pf-label">Your role</label><input className="pf-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Solo developer" /></div>
        <div><label className="pf-label">Date</label><input type="date" className="pf-input" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
      </div>
      <label className="pf-label">Tools used (comma separated)</label>
      <input className="pf-input" value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="Blender, Photoshop, Claude API" style={{ marginBottom: 14 }} />
      <label className="pf-label">Project link (optional)</label>
      <input className="pf-input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." style={{ marginBottom: 14 }} />
      <div style={{ marginBottom: 14 }}>
        <label className="pf-label">Was AI used in this project?</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`pf-btn ${form.ai_used ? "primary" : ""}`} onClick={() => setForm({ ...form, ai_used: true })}>Yes</button>
          <button className={`pf-btn ${!form.ai_used ? "primary" : ""}`} onClick={() => setForm({ ...form, ai_used: false, ai_note: "" })}>No</button>
        </div>
      </div>
      {form.ai_used && (
        <div style={{ marginBottom: 14 }}>
          <label className="pf-label">How was AI used? (shown on the project page)</label>
          <input className="pf-input" value={form.ai_note} onChange={(e) => setForm({ ...form, ai_note: e.target.value })} placeholder="e.g. AI used for concept sketches only" />
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 4 }}>
        {groups.map((g) => (
          <ImageGroupField
            key={g.key}
            group={g}
            images={form.images || []}
            onAdd={() => {}}
            onRemove={removeImage}
            uploadingKey={uploadingKey}
            onUpload={uploadToGroup}
          />
        ))}
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: -6, marginBottom: 4 }}>Images are resized, compressed, and uploaded to your Supabase storage bucket.</p>
      </div>

      {form.category === "other" && (
        <div style={{ marginTop: 18 }}>
          <label className="pf-label">PDF attachment (optional)</label>
          {form.pdf_url ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <a href={form.pdf_url} target="_blank" rel="noreferrer" className="pf-mono" style={{ fontSize: 12, color: "var(--accent)" }}>View current PDF</a>
              <button className="pf-btn danger" onClick={() => setForm({ ...form, pdf_url: "" })}><Trash2 size={12} /> Remove</button>
            </div>
          ) : (
            <button className="pf-btn" onClick={() => pdfRef.current.click()} disabled={uploadingPdf}>
              <Upload size={13} /> {uploadingPdf ? "Uploading..." : "Upload PDF"}
            </button>
          )}
          <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handlePdf} />
        </div>
      )}

      {err && <div style={{ color: "#FF6A6A", fontSize: 12, marginTop: 16, marginBottom: 4 }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="pf-btn primary" disabled={saving} onClick={submit}><Check size={13} /> {saving ? "Saving..." : "Save project"}</button>
        <button className="pf-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function AdminProjects({ projects, setProjects, token }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const saveProject = async (proj) => {
    if (proj.id) {
      const [updated] = await sbUpdate("projects", proj.id, proj, token);
      setProjects(projects.map((p) => (p.id === proj.id ? updated : p)));
    } else {
      const [created] = await sbInsert("projects", proj, token);
      setProjects([created, ...projects]);
    }
    setEditing(null); setAdding(false);
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await sbDelete("projects", id, token);
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div>
      {!adding && !editing && <button className="pf-btn primary" onClick={() => setAdding(true)} style={{ marginBottom: 20 }}><Plus size={14} /> Add new project</button>}
      {adding && <ProjectForm token={token} onSave={saveProject} onCancel={() => setAdding(false)} />}
      {editing && <ProjectForm initial={editing} token={token} onSave={saveProject} onCancel={() => setEditing(null)} />}
      {!adding && !editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projects.length === 0 && <div style={{ color: "var(--muted)" }}>No projects yet.</div>}
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid var(--line)", padding: 12, background: "var(--surface)" }}>
              <div style={{ width: 44, height: 44, background: "var(--surface-2)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {thumbnailOf(p) ? <img src={thumbnailOf(p)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CategoryIcon id={p.category} size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                <div className="pf-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{CATEGORIES.find((c) => c.id === p.category)?.short} · {p.date}</div>
              </div>
              <AiBadge used={p.ai_used} />
              <button className="pf-btn" onClick={() => setEditing(p)}><Pencil size={13} /></button>
              <button className="pf-btn danger" onClick={() => deleteProject(p.id)}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminSkills({ meta, setMeta, token }) {
  const [skills, setSkills] = useState(meta.skills);
  const [saving, setSaving] = useState(false);
  const updateGroup = (i, field, value) => setSkills(skills.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)));
  const addGroup = () => setSkills([...skills, { group: "New Group", items: [] }]);
  const removeGroup = (i) => setSkills(skills.filter((_, idx) => idx !== i));
  const save = async () => {
    setSaving(true);
    try {
      await sbUpdateMeta({ skills }, token);
      setMeta({ ...meta, skills });
      alert("Skills saved.");
    } catch (e) { alert("Save failed: " + e.message); }
    setSaving(false);
  };
  return (
    <div>
      {skills.map((g, i) => (
        <div key={i} style={{ border: "1px solid var(--line)", padding: 14, marginBottom: 12, background: "var(--surface)" }}>
          <label className="pf-label">Group name</label>
          <input className="pf-input" value={g.group} onChange={(e) => updateGroup(i, "group", e.target.value)} style={{ marginBottom: 10 }} />
          <label className="pf-label">Skills (comma separated)</label>
          <input className="pf-input" value={g.items.join(", ")} onChange={(e) => updateGroup(i, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
          <button className="pf-btn danger" style={{ marginTop: 10 }} onClick={() => removeGroup(i)}><Trash2 size={12} /> Remove group</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="pf-btn" onClick={addGroup}><Plus size={13} /> Add group</button>
        <button className="pf-btn primary" disabled={saving} onClick={save}><Check size={13} /> {saving ? "Saving..." : "Save skills"}</button>
      </div>
    </div>
  );
}

function AdminAboutContact({ meta, setMeta, token }) {
  const [form, setForm] = useState(meta);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await sbUpdateMeta({ name: form.name, role: form.role, tagline: form.tagline, bio: form.bio, email: form.email, links: form.links }, token);
      setMeta(form);
      alert("Saved.");
    } catch (e) { alert("Save failed: " + e.message); }
    setSaving(false);
  };
  return (
    <div style={{ maxWidth: 560 }}>
      <label className="pf-label">Name</label><input className="pf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 14 }} />
      <label className="pf-label">Role / title</label><input className="pf-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ marginBottom: 14 }} />
      <label className="pf-label">Homepage tagline</label><input className="pf-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} style={{ marginBottom: 14 }} />
      <label className="pf-label">About / bio</label><textarea className="pf-input" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ marginBottom: 14, resize: "vertical" }} />
      <label className="pf-label">Email</label><input className="pf-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 14 }} />
      {["github", "linkedin", "itch", "artstation", "other"].map((k) => (
        <div key={k}>
          <label className="pf-label">{k === "other" ? "Other link" : k[0].toUpperCase() + k.slice(1)}</label>
          <input className="pf-input" value={form.links[k]} onChange={(e) => setForm({ ...form, links: { ...form.links, [k]: e.target.value } })} style={{ marginBottom: 14 }} placeholder="https://..." />
        </div>
      ))}
      <button className="pf-btn primary" disabled={saving} onClick={save}><Check size={13} /> {saving ? "Saving..." : "Save"}</button>
    </div>
  );
}

function Admin({ projects, setProjects, meta, setMeta }) {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState("projects");
  if (!token) return <AdminLogin onLogin={setToken} />;
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="pf-mono" style={{ fontSize: 22, margin: 0 }}>Admin panel</h2>
        <button className="pf-btn" onClick={() => setToken(null)}><LogOut size={13} /> Log out</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
        {[["projects", "Projects"], ["skills", "Skills"], ["about", "About & Contact"]].map(([id, label]) => (
          <button key={id} className={`pf-nav-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === "projects" && <AdminProjects projects={projects} setProjects={setProjects} token={token} />}
      {tab === "skills" && <AdminSkills meta={meta} setMeta={setMeta} token={token} />}
      {tab === "about" && <AdminAboutContact meta={meta} setMeta={setMeta} token={token} />}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [activeProject, setActiveProject] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    if (!CONFIGURED) { setLoaded(true); return; }
    (async () => {
      try {
        const [p, m] = await Promise.all([sbGet("projects?order=date.desc"), sbGet("site_meta?id=eq.1")]);
        setProjects(p);
        if (m[0]) setMeta({ ...DEFAULT_META, ...m[0], links: { ...DEFAULT_META.links, ...(m[0].links || {}) }, skills: m[0].skills?.length ? m[0].skills : DEFAULT_META.skills });
      } catch (e) {
        setLoadErr(e.message);
      }
      setLoaded(true);
    })();
  }, []);

  const wrappedSetProjects = useCallback((p) => setProjects(p), []);
  const wrappedSetMeta = useCallback((m) => setMeta(m), []);

  if (!loaded) {
    return (
      <div className="pf-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <GlobalStyle /><div className="pf-mono" style={{ color: "var(--muted)" }}>$ loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="pf-root">
      <GlobalStyle />
      <Nav route={route} setRoute={setRoute} meta={meta} />
      {!CONFIGURED && (
        <div className="pf-mono" style={{ background: "var(--ai-yes-soft)", color: "var(--ai-yes)", padding: "10px 20px", fontSize: 12, textAlign: "center" }}>
          Supabase not connected — set SUPABASE_URL and SUPABASE_ANON_KEY at the top of the code.
        </div>
      )}
      {loadErr && <div className="pf-mono" style={{ background: "rgba(255,106,106,0.1)", color: "#FF6A6A", padding: "10px 20px", fontSize: 12, textAlign: "center" }}>Couldn't load data: {loadErr}</div>}
      {route.page === "home" && <Home meta={meta} projects={projects} setRoute={setRoute} openProject={setActiveProject} />}
      {CATEGORIES.some((c) => c.id === route.page) && <CategoryPage catId={route.page} projects={projects} openProject={setActiveProject} setRoute={setRoute} meta={meta} />}
      {route.page === "skills" && <SkillsPage meta={meta} setRoute={setRoute} />}
      {route.page === "about" && <AboutPage meta={meta} setRoute={setRoute} />}
      {route.page === "contact" && <ContactPage meta={meta} setRoute={setRoute} />}
      {route.page === "admin" && <Admin projects={projects} setProjects={wrappedSetProjects} meta={meta} setMeta={wrappedSetMeta} />}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
