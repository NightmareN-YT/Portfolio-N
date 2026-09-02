import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Gamepad2, Box, Palette, Sparkles, Lock, Plus, Trash2, Pencil, X,
  ExternalLink, Upload, ChevronLeft, Check, ArrowRight, Mail,
  Globe, LogOut, Terminal, AlertCircle, Send,
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

const SUPABASE_URL = "https://fktnbldkjgoouzsidraf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdG5ibGRramdvb3V6c2lkcmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODI2ODgsImV4cCI6MjEwMjg1ODY4OH0.d6mSMFqwKMqSZEOw8aFqtxejJhHbfQeYTrdTvpdmSlY";

const CATEGORIES = [
  { id: "games", label: "Games", short: "GAMES", icon: Gamepad2 },
  { id: "blender", label: "3D / Blender", short: "3D-BLENDER", icon: Box },
  { id: "2d-art", label: "2D Art", short: "2D-ART", icon: Palette },
  { id: "other", label: "Other", short: "OTHER", icon: Sparkles },
];

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
  other: [{ key: "general", label: "Images", single: false }],
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
  links: {
    github: "",
    linkedin: "",
    itch: "",
    artstation: "",
    other: "",
    profile_image_url: "",
    profile_image_style: "rounded_rectangle",
    profile_image_aspect_ratio: "4:5",
    profile_image_position: "center",
  },
  profile_image_url: "",
  profile_image_style: "rounded_rectangle",
  profile_image_aspect_ratio: "4:5",
  profile_image_position: "center",
  skills: [
    { group: "Programming", items: ["JavaScript", "Python", "C#"] },
    { group: "3D & Art Tools", items: ["Blender", "Photoshop", "Substance Painter"] },
    { group: "AI Tools", items: ["OpenAI API", "Claude API", "Stable Diffusion"] },
    { group: "Web Dev", items: ["React", "Node.js", "Tailwind CSS"] },
  ],
};

const GlobalStyle = React.memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --bg: #0b0d12;
      --bg-2: #11151d;
      --surface: rgba(24, 30, 42, 0.5);
      --surface-strong: rgba(30, 38, 54, 0.62);
      --surface-soft: rgba(36, 46, 64, 0.4);
      --line: rgba(190, 200, 224, 0.14);
      --line-strong: rgba(200, 210, 234, 0.24);
      --glass-highlight: rgba(255, 255, 255, 0.09);
      --text: #edf2f8;
      --muted: #9ca7b8;
      --accent: #a78bfa;
      --accent-2: #8b5cf6;
      --accent-soft: rgba(167, 139, 250, 0.14);
      --ai-yes: #f7b267;
      --ai-yes-soft: rgba(247, 178, 103, 0.12);
      --ai-no: #70e0b8;
      --ai-no-soft: rgba(112, 224, 184, 0.12);
      --shadow: 0 18px 48px rgba(1, 4, 12, 0.52);
      --panel: rgba(19, 25, 35, 0.55);
      --glass-blur: blur(28px) saturate(200%);
      --glass-blur-soft: blur(16px) saturate(160%);
      --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --surface-2: var(--surface-soft);
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--bg); color: var(--text); }
    a { color: inherit; }
    button, input, select, textarea { font: inherit; }
    .pf-root {
      position: relative;
      isolation: isolate;
      background: #0b0d12;
      color: var(--text);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      width: 100%;
    }
    .pf-root::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(150deg, #1c1533 0%, #171029 18%, #120f22 38%, #0e0f1a 58%, #0b0c14 78%, #08090f 100%);
    }
    .pf-root::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(1400px 900px at 20% 0%, rgba(167,139,250,0.16), transparent 60%);
    }
    .pf-root > * { position: relative; z-index: 1; }
    .pf-root * { box-sizing: border-box; }
    .pf-mono { font-family: 'JetBrains Mono', monospace; }
    .pf-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
    .pf-scrollbar::-webkit-scrollbar-thumb { background: rgba(170,180,205,0.34); border-radius: 999px; }
    .pf-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 999px; }
    .pf-mobile-scrollbar { display: none; }

    .pf-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 5px 9px; border-radius: 999px; border: 1px solid;
      white-space: nowrap; backdrop-filter: var(--glass-blur-soft); -webkit-backdrop-filter: var(--glass-blur-soft);
    }
    .pf-badge.yes { color: #ffc27d; background: rgba(35, 27, 18, 0.6); border-color: rgba(247,178,103,0.62); box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.24); }
    .pf-badge.no { color: #8af0c9; background: rgba(14, 37, 34, 0.6); border-color: rgba(112,224,184,0.58); box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.24); }

    .pf-card {
      position: relative;
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.12);
      transition: transform 0.4s var(--spring), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      border-radius: 22px;
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.35),
        inset 0 -1px 0 rgba(255,255,255,0.04),
        inset 1px 0 0 rgba(255,255,255,0.06),
        0 1px 2px rgba(0,0,0,0.2),
        0 12px 28px rgba(4,6,12,0.28);
    }
    .pf-card::before {
      content: "";
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
      background: linear-gradient(165deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 30%, transparent 55%);
    }
    .pf-card:hover {
      border-color: rgba(167,139,250,0.55);
      transform: translateY(-3px) scale(1.008);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.45),
        inset 0 -1px 0 rgba(255,255,255,0.04),
        0 1px 2px rgba(0,0,0,0.2),
        0 20px 40px rgba(10, 12, 18, 0.4);
      background: var(--surface-strong);
    }
    .pf-card:active { transform: translateY(-1px) scale(0.99); transition: transform 0.15s ease; }

    .pf-nav-tab {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
      color: var(--muted); padding: 8px 12px; border: 1px solid transparent; cursor: pointer;
      white-space: nowrap; background: transparent; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 999px; transition: all 0.3s var(--spring);
    }
    .pf-nav-tab:hover { color: var(--text); border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.05); }
    .pf-nav-tab:active { transform: scale(0.94); }
    .pf-nav-tab.active {
      color: var(--text); border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.1);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.02);
    }
    .pf-nav-divider {
      width: 1px; height: 20px; align-self: center; background: rgba(190, 200, 224, 0.42); margin: 0 8px;
      flex: 0 0 1px; opacity: 1;
    }
    .pf-nav-tab.secondary-nav { color: #687386; }
    .pf-nav-tab.secondary-nav:hover, .pf-nav-tab.secondary-nav.active { color: var(--text); }
    .pf-nav-tab.ai-tab { font-weight: 700; }
    .pf-status-dot-ai {
      width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; transition: background 0.3s ease, box-shadow 0.3s ease;
    }
    .pf-status-dot-ai.local { background: #70e0b8; box-shadow: 0 0 6px rgba(112,224,184,0.8); }
    .pf-status-dot-ai.cloud { background: #7db8f0; box-shadow: 0 0 6px rgba(125,184,240,0.8); }
    .pf-status-dot-ai.offline { background: #6b7280; box-shadow: none; }
    .pf-status-dot-ai.checking { background: #9ca7b8; animation: pf-pulse-dot 1.2s ease infinite; }
    @keyframes pf-pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

    .pf-ai-trigger {
      position: fixed; bottom: 22px; right: 22px; z-index: 40;
      display: flex; align-items: center; gap: 8px; padding: 11px 18px 11px 14px;
      border-radius: 999px; background: rgba(20,16,32,0.72); border: 1px solid rgba(167,139,250,0.45);
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), 0 12px 28px rgba(0,0,0,0.4);
      cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: #c9b8ff; transition: transform 0.3s var(--spring), border-color 0.2s ease;
    }
    .pf-ai-trigger:hover { transform: translateY(-2px); border-color: rgba(167,139,250,0.75); }
    .pf-ai-trigger:active { transform: scale(0.95); }

    .pf-ai-panel {
      display: flex; flex-direction: column; background: rgba(15,13,22,0.86);
      border: 1px solid rgba(255,255,255,0.14); border-radius: 20px; overflow: hidden;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 26px 60px rgba(0,0,0,0.45);
    }
    .pf-ai-panel.floating {
      position: fixed; bottom: 22px; right: 22px; z-index: 40;
      width: min(380px, calc(100vw - 32px)); height: min(560px, calc(100vh - 100px));
    }
    .pf-ai-panel.inline { width: 100%; max-width: 720px; margin: 0 auto; height: 640px; max-height: 74vh; }

    .pf-ai-header {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;
    }
    .pf-ai-header-mark {
      width: 28px; height: 28px; border-radius: 9px; background: rgba(167,139,250,0.22);
      border: 1px solid rgba(167,139,250,0.5); display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #c9b8ff; flex-shrink: 0;
    }
    .pf-ai-header-title { font-size: 13.5px; font-weight: 600; color: var(--text); }
    .pf-ai-header-status { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.04em; }
    .pf-ai-header-status.local { color: #70e0b8; }
    .pf-ai-header-status.cloud { color: #7db8f0; }
    .pf-ai-header-status.offline { color: #9ca7b8; }
    .pf-ai-header-status.checking { color: #9ca7b8; }

    .pf-ai-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
    .pf-ai-msg-user {
      align-self: flex-end; max-width: 82%; background: rgba(167,139,250,0.22);
      border: 1px solid rgba(167,139,250,0.32); color: var(--text); font-size: 13px; line-height: 1.5;
      padding: 9px 13px; border-radius: 14px 14px 3px 14px;
    }
    .pf-ai-msg-assistant { display: flex; gap: 9px; max-width: 92%; }
    .pf-ai-msg-assistant-icon {
      width: 21px; height: 21px; border-radius: 6px; background: rgba(167,139,250,0.2); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace;
      font-size: 10px; color: #c9b8ff; margin-top: 1px;
    }
    .pf-ai-msg-assistant-text { font-size: 13.5px; line-height: 1.6; color: rgba(237,242,248,0.92); white-space: pre-wrap; }
    .pf-ai-typing { display: flex; gap: 4px; padding: 4px 0; }
    .pf-ai-typing span { width: 5px; height: 5px; border-radius: 50%; background: rgba(237,242,248,0.5); animation: pf-typing-bounce 1.1s ease infinite; }
    .pf-ai-typing span:nth-child(2) { animation-delay: 0.15s; }
    .pf-ai-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes pf-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }

    .pf-ai-empty { padding: 6px 2px 2px; }
    .pf-ai-empty p { font-size: 13px; color: var(--muted); line-height: 1.6; margin: 0 0 14px; }
    .pf-ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; }
    .pf-ai-chip {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #c9b8ff;
      background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.32);
      border-radius: 999px; padding: 7px 13px; cursor: pointer; transition: background 0.2s ease, transform 0.2s var(--spring);
    }
    .pf-ai-chip:hover { background: rgba(167,139,250,0.22); transform: translateY(-1px); }

    .pf-ai-offline-note {
      margin: 10px 16px 0; padding: 12px 14px; border-radius: 12px; font-size: 12.5px; line-height: 1.6;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(237,242,248,0.7);
    }

    .pf-ai-input-row {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; margin: 10px 12px 12px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 999px;
      flex-shrink: 0;
    }
    .pf-ai-input-row.disabled { opacity: 0.45; }
    .pf-ai-input {
      flex: 1; background: none; border: none; outline: none; color: var(--text); font-size: 13px;
      font-family: 'Inter', sans-serif; padding: 4px 4px 4px 8px;
    }
    .pf-ai-input::placeholder { color: rgba(237,242,248,0.35); }
    .pf-ai-send {
      width: 30px; height: 30px; border-radius: 50%; background: rgba(167,139,250,0.85); border: none;
      display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
      color: #14101f; transition: transform 0.2s var(--spring), opacity 0.2s ease;
    }
    .pf-ai-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .pf-ai-send:not(:disabled):active { transform: scale(0.88); }

    @media (max-width: 640px) {
      .pf-ai-panel.floating { width: calc(100vw - 24px); height: min(70vh, 520px); right: 12px; bottom: 12px; }
      .pf-ai-trigger { right: 12px; bottom: 12px; padding: 10px 14px 10px 12px; }
    }

    .pf-btn {
      position: relative; overflow: hidden;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.04em;
      padding: 10px 16px; border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      backdrop-filter: var(--glass-blur-soft); -webkit-backdrop-filter: var(--glass-blur-soft);
      color: var(--text); cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; transition: transform 0.3s var(--spring), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      border-radius: 999px; text-transform: uppercase;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.03), 0 1px 3px rgba(0,0,0,0.15);
    }
    .pf-btn:hover { border-color: rgba(167,139,250,0.55); transform: translateY(-1px); background: rgba(255,255,255,0.1); }
    .pf-btn:active { transform: translateY(0) scale(0.95); transition: transform 0.15s ease; }
    .pf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .pf-btn.primary {
      background: linear-gradient(160deg, rgba(255,255,255,0.3), transparent 40%), linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      border-color: rgba(255,255,255,0.3); color: #0f1220; font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 18px rgba(139,92,246,0.35);
    }
    .pf-btn.primary:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 10px 26px rgba(139,92,246,0.45); }
    .pf-btn.danger:hover { border-color: rgba(255,107,107,0.7); color: #ffb4b4; }
    .pf-pdf-link {
      background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(139,92,246,0.12));
      border-color: rgba(167,139,250,0.58); color: #ddd3ff; box-shadow: 0 8px 22px rgba(99,67,180,0.18);
    }
    .pf-pdf-link:hover { background: linear-gradient(135deg, rgba(167,139,250,0.3), rgba(139,92,246,0.2)); color: #fff; }
    .pf-input {
      width: 100%; background: rgba(255,255,255,0.02); border: 1px solid var(--line);
      color: var(--text); padding: 10px 12px; font-size: 14px; outline: none; border-radius: 12px;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }
    .pf-input:focus { border-color: rgba(167,139,250,0.6); box-shadow: 0 0 0 3px rgba(167,139,250,0.12); }
    .pf-label {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;
    }
    .pf-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .pf-form-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;
    }
    .pf-admin-row {
      display: flex; align-items: center; gap: 14px; border: 1px solid var(--line);
      padding: 12px; background: var(--surface); border-radius: 14px; flex-wrap: wrap;
    }

    .pf-page-transition { animation: pf-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .pf-card-in { animation: pf-fade-up 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .pf-modal-backdrop { animation: pf-backdrop-in 0.2s ease both; }
    .pf-modal-backdrop.closing { animation: pf-backdrop-out 0.18s ease both; }
    .pf-modal-panel { animation: pf-modal-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .pf-modal-panel.closing { animation: pf-modal-out 0.18s ease both; }

    @keyframes pf-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pf-modal-in {
      from { opacity: 0; transform: scale(0.97) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes pf-modal-out {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.97) translateY(8px); }
    }
    @keyframes pf-backdrop-in { from { opacity:0; } to { opacity:1; } }
    @keyframes pf-backdrop-out { from { opacity:1; } to { opacity:0; } }

    @media (prefers-reduced-motion: reduce) {
      .pf-page-transition, .pf-card-in, .pf-modal-backdrop, .pf-modal-panel { animation: none !important; }
    }

    .pf-hero {
      display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 48px; align-items: center;
      padding: 36px 0 20px; border-bottom: 1px solid var(--line); margin-bottom: 36px;
    }
    .pf-hero-copy { max-width: 620px; }
    .pf-kicker { color: var(--accent); font-size: 12px; letter-spacing: 0.12em; margin-bottom: 18px; }
    .pf-hero h1 {
      font-size: clamp(38px, 5vw, 72px); line-height: 0.95; margin: 0; letter-spacing: -0.06em; font-weight: 700;
    }
    .pf-tagline {
      margin: 22px 0 10px; color: var(--muted); font-size: clamp(17px, 2vw, 22px); line-height: 1.6;
      max-width: 560px;
    }
    .pf-lead {
      margin: 0; color: rgba(237,242,248,0.78); line-height: 1.8; font-size: 16px; max-width: 560px;
    }
    .pf-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
    .pf-status-row {
      margin-top: 22px; display: inline-flex; align-items: center; gap: 10px;
      color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 8px 12px;
      background: rgba(255,255,255,0.01);
    }
    .pf-status-dot {
      width: 9px; height: 9px; border-radius: 50%; background: linear-gradient(135deg, #7cfdc8, #9cdbff);
      box-shadow: 0 0 18px rgba(125, 253, 200, 0.75);
      display: inline-block;
    }
    .pf-stats {
      display: flex; align-items: stretch; gap: 0; margin-top: 22px; width: min(100%, 420px);
      border: 1px solid var(--line); background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(18,24,33,0.72));
      border-radius: 16px; overflow: hidden; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }
    .pf-stat {
      flex: 1; padding: 16px 18px; min-width: 0;
    }
    .pf-stat + .pf-stat { border-left: 1px solid var(--line); }
    .pf-stat-value {
      display: block; color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700;
      line-height: 1; margin-bottom: 8px;
    }
    .pf-stat-label {
      display: block; color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 9px;
      letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
    }

    .pf-profile-frame {
      position: relative; width: 100%; border-radius: 28px; background: linear-gradient(180deg, rgba(167,139,250,0.12), rgba(12,14,20,0.15));
      border: 1px solid rgba(167,139,250,0.22); overflow: hidden; box-shadow: var(--shadow);
      min-height: 320px;
    }
    .pf-profile-frame img {
      width: 100%; height: 100%; display: block; object-fit: cover; object-position: center;
      background: rgba(255,255,255,0.02);
    }
    .pf-profile-frame.pf-profile-style-portrait { border-radius: 26px; }
    .pf-profile-frame.pf-profile-style-square { border-radius: 22px; }
    .pf-profile-frame.pf-profile-style-circle { border-radius: 50%; aspect-ratio: 1/1 !important; }
    .pf-profile-frame.pf-profile-style-rounded_rectangle { border-radius: 30px; }
    .pf-profile-frame.pf-profile-style-landscape { border-radius: 22px; }
    .pf-profile-placeholder {
      display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;
      background: radial-gradient(circle at top, rgba(167,139,250,0.18), rgba(11,13,18,0.96));
      color: var(--text); font-size: clamp(22px, 4vw, 38px); font-family: 'JetBrains Mono', monospace; font-weight: 700;
      letter-spacing: 0.08em;
    }

    .pf-home-section { margin-top: 28px; }
    .pf-section-header {
      display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px;
    }
    .pf-section-label {
      font-size: 11px; letter-spacing: 0.12em; color: var(--muted); text-transform: uppercase;
    }
    .pf-feature-grid, .pf-project-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;
    }
    .pf-project-card {
      width: 100%; border-radius: 18px; overflow: hidden; text-align: left;
      background: linear-gradient(145deg, rgba(45, 54, 74, 0.5), rgba(28, 36, 52, 0.5) 55%, rgba(20, 25, 36, 0.55));
      color: var(--text); border: 1px solid var(--glass-highlight); cursor: pointer; padding: 0;
      display: flex; flex-direction: column; height: 100%;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 var(--glass-highlight), 0 14px 30px rgba(0,0,0,0.16);
      transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    .pf-project-card:hover { transform: translateY(-2px); border-color: rgba(167,139,250,0.55); box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 34px rgba(0,0,0,0.28); }
    .pf-project-visual {
      position: relative; width: 100%; height: 260px; overflow: hidden; background: #111827;
      border-bottom: 1px solid var(--line);
    }
    .pf-project-visual img {
      width: 100%; height: 100%; display: block; object-fit: cover;
      transition: transform 0.35s ease;
    }
    .pf-project-card:hover .pf-project-visual img { transform: scale(1.04); }
    .pf-project-overlay {
      position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,8,12,0.12), rgba(7,8,12,0.52));
      display: flex; align-items: flex-end; justify-content: space-between; padding: 14px;
    }
    .pf-project-category {
      color: #f2f5fb; background: rgba(10, 13, 19, 0.7); border: 1px solid rgba(207,216,235,0.34);
      padding: 5px 8px; border-radius: 999px; font-size: 9px; letter-spacing: 0.08em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.28);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    }
    .pf-project-body {
      padding: 16px 16px 18px; background: linear-gradient(180deg, rgba(38, 45, 63, 0.4), rgba(18, 23, 33, 0.55));
      display: flex; flex: 1; flex-direction: column;
    }
    .pf-project-head {
      display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px;
    }
    .pf-project-head h3 {
      margin: 0; color: var(--text); font-size: 18px; line-height: 1.3; letter-spacing: -0.03em;
    }
    .pf-project-body p {
      margin: 0; color: rgba(237,242,248,0.74); font-size: 14px; line-height: 1.65;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .pf-tool-row {
      display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 14px;
    }
    .pf-tag {
      display: inline-flex; align-items: center; justify-content: center;
      border: 1px solid var(--line); border-radius: 999px; padding: 6px 8px; color: var(--muted);
      background: rgba(255,255,255,0.02); font-size: 10px; letter-spacing: 0.06em;
    }
    .pf-skill-tag { background: rgba(255,255,255,0.035); }
    .pf-skill-tag.tone-0 { color: #a9c7ff; border-color: rgba(115,160,255,0.38); background: rgba(65,105,180,0.14); }
    .pf-skill-tag.tone-1 { color: #8ce5d0; border-color: rgba(76,205,173,0.38); background: rgba(35,137,113,0.14); }
    .pf-skill-tag.tone-2 { color: #e5b6ff; border-color: rgba(201,133,255,0.38); background: rgba(132,71,180,0.14); }
    .pf-skill-tag.tone-3 { color: #ffd08f; border-color: rgba(255,181,93,0.4); background: rgba(165,103,36,0.14); }
    .pf-home-skill-tag.tone-0 { color: #8f9fbd; border-color: rgba(115,140,185,0.26); background: rgba(65,105,180,0.08); }
    .pf-home-skill-tag.tone-1 { color: #83b2a8; border-color: rgba(76,155,140,0.26); background: rgba(35,137,113,0.08); }
    .pf-home-skill-tag.tone-2 { color: #ad91b9; border-color: rgba(155,112,180,0.26); background: rgba(132,71,180,0.08); }
    .pf-home-skill-tag.tone-3 { color: #bca681; border-color: rgba(180,140,80,0.28); background: rgba(165,103,36,0.08); }

    .pf-capability-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;
    }
    .pf-capability-card {
      text-align: left; border: 1px solid rgba(255,255,255,0.12); background: var(--surface); border-radius: 20px;
      padding: 18px; color: var(--text); cursor: pointer; transition: border-color 0.18s ease, transform 0.18s ease, background 0.18s ease;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.15), 0 12px 24px rgba(4,6,12,0.22);
    }
    .pf-capability-card:hover { border-color: rgba(167,139,250,0.5); transform: translateY(-2px); background: var(--surface-strong); }
    .pf-capability-topline {
      display: flex; align-items: center; gap: 8px; color: var(--muted); margin-bottom: 12px;
    }
    .pf-capability-card strong {
      display: block; font-size: 20px; margin-bottom: 8px; letter-spacing: -0.04em;
    }
    .pf-capability-card span:last-child {
      color: var(--muted); font-size: 13px;
    }

    .pf-skill-section { margin-bottom: 18px; }
    .pf-skill-tags {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .pf-skill-card {
      border: 1px solid rgba(255,255,255,0.12); background: var(--surface); border-radius: 20px;
      padding: 18px; margin-bottom: 18px;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.15), 0 12px 24px rgba(4,6,12,0.22);
    }

    .pf-about-preview { margin-top: 30px; }
    .pf-about-panel {
      border: 1px solid var(--line); background: linear-gradient(135deg, rgba(167,139,250,0.1), var(--surface));
      border-radius: 22px; padding: 26px; display: flex; align-items: center; justify-content: space-between; gap: 18px;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.15), 0 12px 24px rgba(4,6,12,0.22);
    }
    .pf-about-panel h3 { margin: 10px 0 10px; font-size: clamp(24px, 2vw, 38px); letter-spacing: -0.04em; }
    .pf-about-panel p { margin: 0; color: rgba(237,242,248,0.74); line-height: 1.7; max-width: 640px; }

    .pf-about-layout {
      display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 28px; align-items: center;
    }
    .pf-about-image-wrap { width: 100%; }
    .pf-about-copy h2 { margin: 12px 0 10px; font-size: clamp(28px, 4vw, 52px); letter-spacing: -0.06em; }
    .pf-role-line { color: var(--muted); margin: 0 0 18px; font-size: 18px; }
    .pf-about-copy p { margin: 0; color: rgba(237,242,248,0.78); line-height: 1.8; font-size: 16px; }

    .pf-page-header {
      display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;
    }
    .pf-page-header-label {
      display: inline-flex; align-items: center; gap: 8px; color: var(--muted);
      font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .pf-page-header h2 { margin: 0; font-size: clamp(30px, 4vw, 52px); line-height: 1; letter-spacing: -0.06em; }
    .pf-filter-row {
      display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 20px;
    }
    .pf-empty {
      color: var(--muted); border: 1px solid var(--line); background: rgba(255,255,255,0.01);
      border-radius: 14px; padding: 18px 20px; width: 100%;
    }

    .pf-footer {
      margin-top: 32px; padding-top: 22px; border-top: 1px solid var(--line);
      display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
      color: var(--muted);
    }
    .pf-footer-links { display: flex; align-items: center; gap: 14px; }
    .pf-footer-links a {
      display: inline-flex; width: 34px; height: 34px; align-items: center; justify-content: center;
      border-radius: 50%; border: 1px solid var(--line); background: rgba(255,255,255,0.01);
      color: var(--muted); transition: border-color 0.18s ease, color 0.18s ease;
    }
    .pf-footer-links a:hover { border-color: rgba(167,139,250,0.5); color: var(--text); }

    .pf-modal-meta {
      display: flex; flex-direction: column; gap: 14px; margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--line);
    }
    .pf-modal-meta p {
      margin: 0; color: var(--muted); display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
    }
    .pf-modal-meta strong { color: var(--text); }
    .pf-meta-tools { display: flex; flex-wrap: wrap; gap: 6px; }
    .pf-modal-hero {
      background: linear-gradient(145deg, rgba(38, 44, 64, 0.9), rgba(10, 14, 22, 0.98));
      border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .pf-modal-hero img {
      width: 100%; height: auto; max-height: 68vh; display: block; object-fit: contain; object-position: center;
    }

    .pf-contact-item { transition: border-color 0.18s ease, transform 0.18s ease; }
    .pf-contact-item:hover { border-color: rgba(167,139,250,0.5); }

    .pf-profile-manager {
      border: 1px solid var(--line); background: var(--surface); padding: 20px; border-radius: 18px;
      backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.15), 0 12px 24px rgba(4,6,12,0.22);
    }
    .pf-profile-manager-preview {
      display: flex; justify-content: center; margin-bottom: 18px;
    }
    .pf-profile-manager-actions {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px;
    }
    .pf-nav-inner {
      max-width: 1320px; margin: 12px auto; padding: 10px 18px; display: flex; align-items: center;
      justify-content: space-between; gap: 18px; flex-wrap: wrap;
      background: rgba(20, 24, 34, 0.45);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 999px;
      backdrop-filter: blur(32px) saturate(200%); -webkit-backdrop-filter: blur(32px) saturate(200%);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.3),
        inset 0 -1px 0 rgba(255,255,255,0.03),
        0 8px 24px rgba(0,0,0,0.35),
        0 1px 2px rgba(0,0,0,0.2);
    }
    .pf-profile-settings-grid {
      display: grid; gap: 16px;
    }
    .pf-option-list {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .pf-option-list.compact { gap: 6px; }
    .pf-option-pill {
      border: 1px solid var(--line); background: rgba(255,255,255,0.02); border-radius: 999px;
      color: var(--muted); padding: 7px 10px; cursor: pointer; transition: all 0.18s ease;
      font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .pf-option-pill.selected {
      border-color: rgba(167,139,250,0.5); color: var(--text); background: rgba(167,139,250,0.08);
    }

    @media (max-width: 900px) {
      .pf-hero, .pf-about-layout { grid-template-columns: 1fr; }
      .pf-hero { gap: 28px; padding-top: 20px; }
      .pf-about-panel { flex-direction: column; align-items: flex-start; }
      .pf-profile-frame { max-width: 460px; margin: 0 auto; }
      .pf-hero-copy { max-width: 720px; }
    }

    @media (max-width: 640px) {
      .pf-nav-inner { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 10px 14px; margin: 8px auto; width: 100%; min-width: 0; }
      .pf-nav-inner > div:nth-child(2) {
        grid-column: 1 / -1; grid-row: 2; justify-content: flex-start !important; gap: 2px !important;
        width: 100%; max-width: 100%; min-width: 0; margin-left: 0; padding: 0;
        position: relative; top: -6px;
        scrollbar-width: none;
      }
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar { display: none; }
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-button,
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-button:single-button,
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-button:start:decrement,
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-button:end:increment {
        display: none !important; width: 0; height: 0; background: transparent !important; background-image: none !important;
      }
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(232,238,248,0.52), rgba(170,180,205,0.32) 42%, rgba(96,106,124,0.42));
        border: 2px solid transparent; border-left-width: 32px; border-right-width: 32px;
        border-radius: 999px; background-clip: padding-box;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.28);
      }
      .pf-nav-inner > div:nth-child(2)::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 999px; }
      .pf-mobile-scrollbar {
        display: block; position: relative; grid-column: 1 / -1; grid-row: 3; height: 6px;
        margin: -2px 14px 0; border-radius: 999px; background: rgba(255,255,255,0.06);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.22);
        cursor: pointer;
      }
      .pf-mobile-scrollbar-thumb {
        position: absolute; top: 0; left: 0; width: 40%; height: 6px; border-radius: 999px;
        background: linear-gradient(180deg, rgba(232,238,248,0.52), rgba(170,180,205,0.32) 42%, rgba(96,106,124,0.42));
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.28);
        cursor: grab; touch-action: none;
      }
      .pf-mobile-scrollbar-thumb:active { cursor: grabbing; }
      .pf-nav-inner > div:first-child { margin-left: 16px; }
      .pf-nav-inner > button { justify-self: end; }
      .pf-nav-inner > button { margin-right: 15px; }
      .pf-nav-tab { font-size: 10px; padding: 7px 9px; }
      .pf-hero { padding: 28px 0 18px; margin-bottom: 26px; }
      .pf-hero-copy h1 { font-size: 42px; }
      .pf-tagline { font-size: 17px; line-height: 1.45; }
      .pf-lead { font-size: 14px; line-height: 1.7; }
      .pf-stats { width: 100%; }
      .pf-stat { padding: 14px 12px; }
      .pf-stat-value { font-size: 18px; }
      .pf-stat-label { font-size: 8px; }
      .pf-status-row { max-width: 100%; font-size: 11px; }
      .pf-profile-frame { min-height: 260px; }
      .pf-modal-hero img { max-height: 52vh; }
      .pf-project-visual { height: 220px; }
      .pf-project-body h3 { font-size: 16px; }
      .pf-about-panel { padding: 18px; }
      .pf-profile-manager { padding: 16px; }
      .pf-btn, .pf-nav-tab { padding-left: 12px; padding-right: 12px; }

      /* Prevent iOS Safari from zooming in when a form field is focused
         (it auto-zooms on any input/select/textarea under 16px font-size) */
      .pf-input, select.pf-input, textarea.pf-input { font-size: 16px; }

      /* Stack two-column admin form rows into one column on narrow screens */
      .pf-form-row { grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px; }

      /* Tighter padding inside the project modal so content isn't cramped */
      .pf-modal-body { padding: 18px !important; }

      /* Let admin project rows wrap instead of overflowing horizontally */
      .pf-admin-row { padding: 10px; }
      .pf-admin-row > div:nth-child(2) { flex-basis: 100%; order: 1; }
      .pf-admin-row > *:not(div:nth-child(2)) { order: 2; }
    }

    @media (max-width: 400px) {
      .pf-hero-copy h1 { font-size: 34px; }
      .pf-stats { grid-template-columns: 1fr; display: grid; }
      .pf-stat + .pf-stat { border-left: none; border-top: 1px solid var(--line); }
    }
  `}</style>
));

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
async function sbDeleteFile(publicUrl, token) {
  if (!publicUrl) return;
  const marker = "/object/public/project-images/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  try {
    await fetch(`${STORAGE}/object/project-images/${path}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore
  }
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

async function fetchAiStatus() {
  try {
    const res = await fetch("/api/ai-status");
    if (!res.ok) return { status: "offline" };
    return await res.json();
  } catch {
    return { status: "offline" };
  }
}

async function sendAiChat(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messages.slice(-10) }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Request failed");
  return data; // { reply, backend, model }
}

const AI_SUGGESTIONS = [
  "What projects use AI?",
  "What are your skills?",
  "Show me 3D work",
  "How do I contact you?",
];

function AiStatusLabel({ status }) {
  const map = {
    local: "ONLINE · running locally",
    cloud: "ONLINE · cloud fallback",
    offline: "OFFLINE · try again later",
    checking: "CHECKING…",
  };
  return (
    <span className={`pf-ai-header-status ${status}`}>
      <span className={`pf-status-dot-ai ${status}`} />
      {map[status] || map.checking}
    </span>
  );
}

function AiChatPanel({ variant, messages, status, loading, onSend, onClose }) {
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const isOffline = status === "offline";

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const submit = (text) => {
    const value = (text ?? draft).trim();
    if (!value || loading || isOffline) return;
    onSend(value);
    setDraft("");
  };

  return (
    <div className={`pf-ai-panel ${variant}`}>
      <div className="pf-ai-header">
        <div className="pf-ai-header-mark">&gt;_</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pf-ai-header-title">Niyon AI</div>
          <AiStatusLabel status={status} />
        </div>
        {onClose && <button className="pf-btn" onClick={onClose} aria-label="Close chat"><X size={14} /></button>}
      </div>

      <div className="pf-ai-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="pf-ai-empty">
            <p>Ask about my projects, skills, or how to get in touch — answers are grounded in what's actually on this site.</p>
            <div className="pf-ai-suggestions">
              {AI_SUGGESTIONS.map((s, i) => <button key={i} type="button" className="pf-ai-chip" onClick={() => submit(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {messages.map((m, i) => m.role === "user" ? (
          <div key={i} className="pf-ai-msg-user">{m.content}</div>
        ) : (
          <div key={i} className="pf-ai-msg-assistant">
            <div className="pf-ai-msg-assistant-icon">&gt;_</div>
            <div className="pf-ai-msg-assistant-text">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="pf-ai-msg-assistant">
            <div className="pf-ai-msg-assistant-icon">&gt;_</div>
            <div className="pf-ai-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {isOffline && (
        <div className="pf-ai-offline-note">
          My AI runs on my own PC to stay free and private — it's offline right now. Try again later, or use the Contact page.
        </div>
      )}

      <div className={`pf-ai-input-row ${isOffline ? "disabled" : ""}`}>
        <input
          className="pf-ai-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={isOffline ? "Unavailable right now…" : "Message Niyon AI…"}
          disabled={isOffline || loading}
        />
        <button className="pf-ai-send" onClick={() => submit()} disabled={isOffline || loading || !draft.trim()} aria-label="Send message">
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

function AiWidget({ route, setRoute, aiState }) {
  const { messages, status, loading, send } = aiState;
  const [open, setOpen] = useState(false);
  if (route.page === "ai" || route.page === "admin") return null;
  return (
    <>
      {open ? (
        <AiChatPanel variant="floating" messages={messages} status={status} loading={loading} onSend={send} onClose={() => setOpen(false)} />
      ) : (
        <button type="button" className="pf-ai-trigger" onClick={() => setOpen(true)}>
          <span className={`pf-status-dot-ai ${status}`} />
          &gt;_ ask niyon.ai
        </button>
      )}
    </>
  );
}

function AiPage({ aiState }) {
  const { messages, status, loading, send } = aiState;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px", display: "flex", justifyContent: "center" }}>
      <AiChatPanel variant="inline" messages={messages} status={status} loading={loading} onSend={send} />
    </div>
  );
}


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

const ProjectCard = React.memo(function ProjectCard({ project, onOpen, index = 0 }) {
  const thumb = thumbnailOf(project);
  const cat = CATEGORIES.find((c) => c.id === project.category);
  const displayTools = (project.tools || []).slice(0, 3);

  return (
    <button type="button" className="pf-project-card pf-card-in" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }} onClick={() => onOpen(project)}>
      <div className="pf-project-visual">
        {thumb ? <img src={thumb} alt={project.title} loading={index < 4 ? "eager" : "lazy"} decoding="async" /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "var(--muted)" }}><CategoryIcon id={project.category} size={28} /></div>}
        <div className="pf-project-overlay">
          <span className="pf-mono pf-project-category">{cat ? cat.short : "PROJECT"}</span>
          <AiBadge used={project.ai_used} />
        </div>
      </div>
      <div className="pf-project-body">
        <div className="pf-project-head">
          <h3>{project.title}</h3>
          <ArrowRight size={15} color="var(--muted)" />
        </div>
        <p>{project.description}</p>
        {displayTools.length > 0 && (
          <div className="pf-tool-row">
            {displayTools.map((tool, idx) => <span key={idx} className="pf-mono pf-tag">{tool}</span>)}
          </div>
        )}
      </div>
    </button>
  );
});

function Nav({ route, setRoute, meta, aiStatus }) {
  const navScrollRef = useRef(null);
  const navScrollThumbRef = useRef(null);
  const navDragRef = useRef(null);
  const tabs = [
    { id: "ai", label: "AI", isAi: true },
    { id: "__div1", divider: true },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.short, icon: c.icon, category: c.id })),
    { id: "__div2", divider: true },
    { id: "skills", label: "SKILLS" },
    { id: "about", label: "ABOUT" },
  ];
  useEffect(() => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollLeft = 0;
      if (navScrollThumbRef.current) navScrollThumbRef.current.style.left = "0%";
    }
  }, [route.page]);
  const updateNavScroll = () => {
    const element = navScrollRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const progress = maxScroll > 0 ? element.scrollLeft / maxScroll : 0;
    if (navScrollThumbRef.current) navScrollThumbRef.current.style.left = `${progress * 60}%`;
  };
  const seekNavScroll = (event) => {
    const element = navScrollRef.current;
    if (!element) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    element.scrollLeft = ratio * (element.scrollWidth - element.clientWidth);
  };
  const startNavDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navDragRef.current = { startX: event.clientX, startScroll: navScrollRef.current?.scrollLeft || 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveNavDrag = (event) => {
    const drag = navDragRef.current;
    const element = navScrollRef.current;
    if (!drag || !element) return;
    const trackWidth = event.currentTarget.parentElement.clientWidth;
    const thumbWidth = event.currentTarget.clientWidth;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const maxThumbOffset = Math.max(1, trackWidth - thumbWidth);
    element.scrollLeft = drag.startScroll + ((event.clientX - drag.startX) / maxThumbOffset) * maxScroll;
  };
  const endNavDrag = (event) => {
    navDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, padding: "0 16px" }}>
      <div className="pf-nav-inner">
        <div className="pf-mono" style={{ fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setRoute({ page: "home" })}>
          <Terminal size={16} color="var(--accent)" /> {meta.name}
        </div>
        <div ref={navScrollRef} onScroll={updateNavScroll} className="pf-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto", flex: 1, justifyContent: "center" }}>
          {tabs.map((t) =>
            t.divider ? (
              <span key={t.id} className="pf-nav-divider" aria-hidden="true" />
            ) : (
              <button key={t.id} className={`pf-nav-tab ${t.isAi ? "ai-tab" : ""} ${t.category ? (route.page === "work" && route.category === t.id ? "active" : "") : (route.page === t.id ? "active" : "")}`} onClick={() => (t.category !== undefined ? setRoute({ page: "work", category: t.id }) : setRoute({ page: t.id }))}>
                {t.isAi && <span className={`pf-status-dot-ai ${aiStatus}`} />}
                {t.icon && <t.icon size={13} strokeWidth={1.75} />}
                {t.label}
              </button>
            )
          )}
        </div>
        <div className="pf-mobile-scrollbar" onClick={seekNavScroll} aria-hidden="true">
          <span ref={navScrollThumbRef} className="pf-mobile-scrollbar-thumb" onPointerDown={startNavDrag} onPointerMove={moveNavDrag} onPointerUp={endNavDrag} onPointerCancel={endNavDrag} onClick={(event) => event.stopPropagation()} />
        </div>
        <button className="pf-nav-tab" onClick={() => setRoute({ page: "admin" })}><Lock size={12} /> ADMIN</button>
      </div>
    </div>
  );
}

function getProfileImageConfig(meta = {}) {
  const links = meta.links || {};
  return {
    url: meta.profile_image_url || links.profile_image_url || "",
    style: meta.profile_image_style || links.profile_image_style || "rounded_rectangle",
    aspect: meta.profile_image_aspect_ratio || links.profile_image_aspect_ratio || "4:5",
    position: meta.profile_image_position || links.profile_image_position || "center",
  };
}

function getObjectPosition(position) {
  const map = {
    center: "50% 50%",
    top: "50% 12%",
    bottom: "50% 88%",
    left: "12% 50%",
    right: "88% 50%",
  };
  return map[position] || map.center;
}

function Home({ meta, projects, setRoute, openProject }) {
  const featured = projects.slice(0, 4);
  const skillsPreview = meta.skills.flatMap((g) => g.items).slice(0, 14);
  const profile = getProfileImageConfig(meta);
  const disciplineCount = new Set(projects.map((project) => project.category).filter(Boolean)).size;

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 24px 40px" }}>
      <section className="pf-hero">
        <div className="pf-hero-copy">
          <div className="pf-mono pf-kicker">{meta.role}</div>
          <h1>{meta.name}</h1>
          <p className="pf-tagline">{meta.tagline}</p>
          <p className="pf-lead">{meta.bio}</p>
          <div className="pf-actions">
            <button type="button" className="pf-btn primary" onClick={() => setRoute({ page: "work" })}><span>View Work</span> <ArrowRight size={14} /></button>
            <button type="button" className="pf-btn" onClick={() => setRoute({ page: "about" })}>Contact</button>
          </div>
          <div className="pf-stats" aria-label="Portfolio statistics">
            <div className="pf-stat"><span className="pf-stat-value">{String(projects.length).padStart(2, "0")}</span><span className="pf-stat-label">Projects</span></div>
            <div className="pf-stat"><span className="pf-stat-value">{String(disciplineCount).padStart(2, "0")}</span><span className="pf-stat-label">Disciplines</span></div>
            <div className="pf-stat"><span className="pf-stat-value">{skillsPreview.length}</span><span className="pf-stat-label">Skills</span></div>
          </div>
          <div className="pf-status-row">
            <span className="pf-status-dot" />
            <span className="pf-mono">Available for selected collaborations</span>
          </div>
        </div>
        <div className="pf-hero-media">
          <div className={`pf-profile-frame pf-profile-style-${profile.style}`} style={{ aspectRatio: profile.aspect }}>
            {profile.url ? (
              <img src={profile.url} alt={`${meta.name} profile`} style={{ objectPosition: getObjectPosition(profile.position) }} />
            ) : (
              <div className="pf-profile-placeholder">
                <span>{meta.name ? meta.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "NN"}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pf-home-section">
        <div className="pf-section-header">
          <div className="pf-mono pf-section-label">// Selected Work</div>
          <button type="button" className="pf-nav-tab" onClick={() => setRoute({ page: "work" })}>View all <ArrowRight size={12} /></button>
        </div>
        <div className="pf-feature-grid">
          {featured.length === 0 && <div className="pf-empty">No projects yet — add some from the admin panel.</div>}
          {featured.map((p, i) => <ProjectCard key={p.id} project={p} onOpen={openProject} index={i} />)}
        </div>
      </section>

      <section className="pf-home-section">
        <div className="pf-section-header">
          <div className="pf-mono pf-section-label">// Capabilities</div>
        </div>
        <div className="pf-capability-grid">
          {CATEGORIES.map((c) => {
            const count = projects.filter((p) => p.category === c.id).length;
            return (
              <button type="button" key={c.id} className="pf-capability-card" onClick={() => setRoute({ page: "work", category: c.id })}>
                <div className="pf-capability-topline"><c.icon size={14} /><span className="pf-mono">{c.short}</span></div>
                <strong>{c.label}</strong>
                <span>{count} project{count === 1 ? "" : "s"}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pf-home-section pf-skill-section">
        <div className="pf-section-header">
          <div className="pf-mono pf-section-label">// Skills</div>
          <button type="button" className="pf-nav-tab" onClick={() => setRoute({ page: "skills" })}>View all <ArrowRight size={12} /></button>
        </div>
        <div className="pf-skill-tags">
          {skillsPreview.map((s, i) => <span key={i} className={`pf-mono pf-tag pf-skill-tag pf-home-skill-tag tone-${i % 4}`}>{s}</span>)}
        </div>
      </section>

      <section className="pf-home-section pf-about-preview">
        <div className="pf-about-panel">
          <div>
            <div className="pf-mono pf-section-label">// About</div>
            <h3>{meta.name}</h3>
            <p>{meta.bio}</p>
          </div>
          <button type="button" className="pf-btn" onClick={() => setRoute({ page: "about" })}>More about me</button>
        </div>
      </section>

      <Footer meta={meta} />
    </div>
  );
}

function Footer({ meta }) {
  return (
    <footer className="pf-footer">
      <div className="pf-mono">© {new Date().getFullYear()} {meta.name}</div>
      <div className="pf-footer-links">
        {meta.email && <a href={`mailto:${meta.email}`} aria-label="Email"><Mail size={16} /></a>}
        {meta.links.github && <a href={meta.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>}
        {meta.links.linkedin && <a href={meta.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>}
        {meta.links.other && <a href={meta.links.other} target="_blank" rel="noreferrer" aria-label="Website"><Globe size={16} /></a>}
      </div>
    </footer>
  );
}

function WorkPage({ initialCategory, projects, openProject, setRoute, meta }) {
  const [category, setCategory] = useState(initialCategory || "all");
  const [aiFilter, setAiFilter] = useState("all");

  useEffect(() => { setCategory(initialCategory || "all"); }, [initialCategory]);

  let items = category === "all" ? projects : projects.filter((p) => p.category === category);
  if (aiFilter === "ai") items = items.filter((p) => p.ai_used);
  if (aiFilter === "manual") items = items.filter((p) => !p.ai_used);
  items = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const activeCat = CATEGORIES.find((c) => c.id === category);

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 24px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 18 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-page-header">
        <div className="pf-page-header-label">
          {activeCat ? <activeCat.icon size={18} /> : <Sparkles size={18} />}
          <span className="pf-mono">{activeCat ? activeCat.short : "ALL WORK"}</span>
        </div>
        <h2>{activeCat ? activeCat.label : "All Work"}</h2>
      </div>

      <div className="pf-filter-row">
        {category !== "other" && (
          <button type="button" className={`pf-nav-tab ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>All</button>
        )}
        {CATEGORIES.filter((c) => !(category === "other" && c.id === "other")).map((c) => (
          <button key={c.id} type="button" className={`pf-nav-tab ${category === c.id ? "active" : ""}`} onClick={() => setCategory(c.id)}>
            <c.icon size={12} strokeWidth={1.75} /> {c.label}
          </button>
        ))}
      </div>
      <div className="pf-filter-row" style={{ marginTop: 8 }}>
        {[["all", "All"], ["ai", "AI-assisted"], ["manual", "No AI"]].map(([id, label]) => (
          <button key={id} type="button" className={`pf-nav-tab secondary-nav ${aiFilter === id ? "active" : ""}`} onClick={() => setAiFilter(id)}>{label}</button>
        ))}
      </div>

      {items.length === 0 ? <div className="pf-empty">No projects match these filters yet.</div> : (
        <div className="pf-project-grid">{items.map((p, i) => <ProjectCard key={p.id} project={p} onOpen={openProject} index={i} />)}</div>
      )}
      <Footer meta={meta} />
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [project]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  };

  if (!project && !closing) return null;
  const p = project;
  if (!p) return null;
  const groups = IMAGE_GROUPS[p.category] || [];
  const imgs = p.images || [];
  const hero = thumbnailOf(p);

  return (
    <div className={`pf-modal-backdrop ${closing ? "closing" : ""}`} style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.82)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={handleClose}>
      <div role="dialog" aria-modal="true" className={`pf-scrollbar pf-modal-panel ${closing ? "closing" : ""}`} style={{ background: "var(--surface-strong)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid var(--glass-highlight)", maxWidth: 960, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "inset 0 1px 0 var(--glass-highlight), 0 26px 80px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "14px 20px", background: "rgba(18,20,27,0.96)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
          <button className="pf-btn" onClick={handleClose} aria-label="Close project details"><X size={14} /></button>
        </div>

        {hero && (
          <div className="pf-modal-hero">
            <img src={hero} alt={p.title} />
          </div>
        )}

        <div className="pf-modal-body" style={{ padding: 28 }}>
          <div className="pf-mono pf-section-label">{CATEGORIES.find((c) => c.id === p.category)?.short || "PROJECT"}</div>
          <h3 style={{ margin: "8px 0 0", fontSize: "clamp(29px, 3vw, 42px)", lineHeight: 1.1 }}>{p.title}</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" }}>
            <AiBadge used={p.ai_used} />
            {p.date && <span className="pf-mono" style={{ fontSize: 11, color: "var(--muted)", border: "1px solid var(--line)", padding: "4px 8px", borderRadius: 999 }}>{p.date}</span>}
          </div>
          {p.ai_used && p.ai_note && <p style={{ fontSize: 13, color: "var(--ai-yes)", background: "var(--ai-yes-soft)", padding: "8px 10px", border: "1px solid rgba(255,159,67,0.3)", borderRadius: 10 }}>{p.ai_note}</p>}
          <p style={{ color: "var(--text)", lineHeight: 1.7, fontSize: 15, marginTop: 16, whiteSpace: "pre-wrap" }}>{p.description}</p>
          {(p.role || p.tools?.length) && (
            <div className="pf-modal-meta">
              {p.role && <p><strong>Role</strong> <span>{p.role}</span></p>}
              {p.tools?.length > 0 && (
                <div className="pf-meta-tools">
                  {p.tools.map((t, i) => <span key={i} className="pf-mono pf-tag">{t}</span>)}
                </div>
              )}
            </div>
          )}
          {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="pf-btn primary" style={{ marginTop: 20, textDecoration: "none" }}>View project <ExternalLink size={13} /></a>}

          {groups.map((g) => {
            if (g.single) return null;
            const items = imgs.filter((i) => i.group === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key} style={{ marginTop: 28 }}>
                <div className="pf-mono pf-section-label" style={{ marginBottom: 10 }}>{g.label.toUpperCase()}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
                  {items.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noreferrer" style={{ display: "block", border: "1px solid var(--line)", overflow: "hidden", background: "var(--surface-2)" }}>
                      <img src={img.url} alt={`${g.label} ${i + 1}`} loading="lazy" decoding="async" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {p.pdf_url && (
            <div style={{ marginTop: 28 }}>
              <div className="pf-mono pf-section-label" style={{ marginBottom: 10 }}>Attachment</div>
              <a href={p.pdf_url} target="_blank" rel="noreferrer" className="pf-btn pf-pdf-link" style={{ textDecoration: "none" }}>
                <ExternalLink size={18} strokeWidth={2.2} /> <span>Open PDF</span>
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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-page-header" style={{ marginBottom: 24 }}>
        <div className="pf-page-header-label"><Terminal size={16} /> <span className="pf-mono">Skills</span></div>
        <h2>Capabilities</h2>
      </div>
      {meta.skills.map((g, i) => (
        <section key={i} className="pf-skill-card">
          <div className="pf-mono pf-section-label" style={{ marginBottom: 12 }}>{g.group.toUpperCase()}</div>
          <div className="pf-skill-tags">{g.items.map((s, j) => <span key={j} className={`pf-mono pf-tag pf-skill-tag tone-${i % 4}`}>{s}</span>)}</div>
        </section>
      ))}
    </div>
  );
}

function AboutPage({ meta, setRoute }) {
  const profile = getProfileImageConfig(meta);
  const rows = [
    { icon: Mail, label: "Email", value: meta.email, href: meta.email ? `mailto:${meta.email}` : null },
    { icon: Github, label: "GitHub", value: meta.links.github, href: meta.links.github || null },
    { icon: Linkedin, label: "LinkedIn", value: meta.links.linkedin, href: meta.links.linkedin || null },
    { icon: Globe, label: "Itch.io", value: meta.links.itch, href: meta.links.itch || null },
    { icon: Globe, label: "ArtStation", value: meta.links.artstation, href: meta.links.artstation || null },
    { icon: Globe, label: "Other", value: meta.links.other, href: meta.links.other || null },
  ].filter((r) => r.value);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-about-layout">
        <div className="pf-about-image-wrap">
          <div className={`pf-profile-frame pf-profile-style-${profile.style}`} style={{ aspectRatio: profile.aspect }}>
            {profile.url ? (
              <img src={profile.url} alt={`${meta.name} portrait`} style={{ objectPosition: getObjectPosition(profile.position) }} />
            ) : (
              <div className="pf-profile-placeholder"><span>{meta.name ? meta.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "NN"}</span></div>
            )}
          </div>
        </div>
        <div className="pf-about-copy">
          <div className="pf-mono pf-section-label">// About</div>
          <h2>{meta.name}</h2>
          <p className="pf-role-line">{meta.role}</p>
          <p>{meta.bio}</p>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="pf-mono pf-section-label" style={{ marginBottom: 16 }}>// Contact</div>
        {rows.length === 0 && <div className="pf-empty">Add your contact links from the admin panel.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r, i) => (
            <a key={i} href={r.href} target="_blank" rel="noreferrer" className="pf-card pf-contact-item" style={{ display: "flex", alignItems: "center", gap: 14, padding: 18, textDecoration: "none", color: "var(--text)" }}>
              <r.icon size={18} color="var(--accent)" />
              <div>
                <div className="pf-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{r.label.toUpperCase()}</div>
                <div style={{ fontSize: 15 }}>{r.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function ImageGroupField({ group, images, onRemove, uploadingKey, onUpload }) {
  const items = images.filter((i) => i.group === group.key);
  const fileRef = useRef();
  const isUploading = uploadingKey === group.key;

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
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
              type="button"
              onClick={() => onRemove(group.key, i)}
              style={{ position: "absolute", top: -6, right: -6, background: "#FF6A6A", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={11} color="#0B0D12" />
            </button>
          </div>
        ))}
      </div>
      {(!group.single || items.length === 0) && (
        <button type="button" className="pf-btn" onClick={() => fileRef.current.click()} disabled={isUploading}>
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
  const [pendingDeleteUrls, setPendingDeleteUrls] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const pdfRef = useRef();

  const groups = IMAGE_GROUPS[form.category] || [];

  const uploadToGroup = async (file, groupKey, single) => {
    setUploadingKey(groupKey); setErr("");
    try {
      const compressed = await compressImage(file);
      const url = await sbUploadFile(compressed, token, "uploads");
      const oldOnes = single ? (form.images || []).filter((i) => i.group === groupKey) : [];
      setUploadedUrls((urls) => [...urls, url]);
      setForm((f) => {
        const others = single ? (f.images || []).filter((i) => i.group !== groupKey) : (f.images || []);
        return { ...f, images: [...others, { url, group: groupKey }] };
      });
      setPendingDeleteUrls((urls) => [...urls, ...oldOnes.map((old) => old.url)]);
    } catch (e2) {
      setErr("Image upload failed: " + e2.message);
    }
    setUploadingKey(null);
  };

  const removeImage = async (groupKey, index) => {
    const items = (form.images || []).filter((i) => i.group === groupKey);
    const toRemove = items[index];
    if (!toRemove) return;
    setForm((f) => ({ ...f, images: (f.images || []).filter((i) => i !== toRemove) }));
    if (!uploadedUrls.includes(toRemove.url)) {
      setPendingDeleteUrls((urls) => [...urls, toRemove.url]);
    } else {
      setUploadedUrls((urls) => urls.filter((url) => url !== toRemove.url));
      await sbDeleteFile(toRemove.url, token);
    }
  };

  const handlePdf = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") { setErr("Please choose a PDF file."); return; }
    setUploadingPdf(true); setErr("");
    try {
      const url = await sbUploadFile(file, token, "attachments");
      setUploadedUrls((urls) => [...urls, url]);
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
      for (const url of pendingDeleteUrls) await sbDeleteFile(url, token);
      setPendingDeleteUrls([]);
      setUploadedUrls([]);
    } catch (e2) {
      setErr("Save failed: " + e2.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ border: "1px solid var(--line)", background: "var(--surface)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", padding: 20, marginBottom: 20, borderRadius: 14 }}>
      <div className="pf-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 16 }}>{initial ? "// EDIT PROJECT" : "// NEW PROJECT"}</div>
      <div className="pf-form-row">
        <div><label className="pf-label">Title</label><input className="pf-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="pf-label">Category</label>
          <select className="pf-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>
      <label className="pf-label">Description</label>
      <textarea className="pf-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginBottom: 14, resize: "vertical" }} />
      <div className="pf-form-row">
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
          <button type="button" className={`pf-btn ${form.ai_used ? "primary" : ""}`} onClick={() => setForm({ ...form, ai_used: true })}>Yes</button>
          <button type="button" className={`pf-btn ${!form.ai_used ? "primary" : ""}`} onClick={() => setForm({ ...form, ai_used: false, ai_note: "" })}>No</button>
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
              <button type="button" className="pf-btn danger" onClick={() => { setPendingDeleteUrls((urls) => [...urls, form.pdf_url]); setForm({ ...form, pdf_url: "" }); }}><Trash2 size={12} /> Remove</button>
            </div>
          ) : (
            <button type="button" className="pf-btn" onClick={() => pdfRef.current.click()} disabled={uploadingPdf}>
              <Upload size={13} /> {uploadingPdf ? "Uploading..." : "Upload PDF"}
            </button>
          )}
          <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handlePdf} />
        </div>
      )}

      {err && <div style={{ color: "#FF6A6A", fontSize: 12, marginTop: 16, marginBottom: 4 }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button type="button" className="pf-btn primary" disabled={saving} onClick={submit}><Check size={13} /> {saving ? "Saving..." : "Save project"}</button>
        <button type="button" className="pf-btn" onClick={async () => {
          for (const url of uploadedUrls) await sbDeleteFile(url, token);
          onCancel();
        }}>Cancel</button>
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
    const proj = projects.find((p) => p.id === id);
    await sbDelete("projects", id, token);
    setProjects(projects.filter((p) => p.id !== id));
    if (proj) {
      for (const img of proj.images || []) await sbDeleteFile(img.url, token);
      if (proj.image_url) await sbDeleteFile(proj.image_url, token);
      if (proj.pdf_url) await sbDeleteFile(proj.pdf_url, token);
    }
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
            <div key={p.id} className="pf-admin-row">
              <div style={{ width: 44, height: 44, background: "var(--surface-2)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {thumbnailOf(p) ? <img src={thumbnailOf(p)} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CategoryIcon id={p.category} size={18} />}
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
        <div key={i} style={{ border: "1px solid var(--line)", padding: 14, marginBottom: 12, background: "var(--surface)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderRadius: 14 }}>
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

function ProfileImageField({ form, setForm, token }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const styleOptions = [
    { value: "portrait", label: "Portrait" },
    { value: "square", label: "Square" },
    { value: "circle", label: "Circle" },
    { value: "rounded_rectangle", label: "Rounded Rectangle" },
    { value: "landscape", label: "Landscape / Editorial" },
  ];
  const aspectOptions = ["4:5", "1:1", "3:4", "16:10", "16:9"];
  const positionOptions = ["center", "top", "bottom", "left", "right"];
  const currentAspect = form.profile_image_aspect_ratio || "4:5";
  const currentStyle = form.profile_image_style || "rounded_rectangle";
  const currentPosition = form.profile_image_position || "center";

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file, 1600, 0.8);
      const url = await sbUploadFile(compressed, token, "profile");
      const previous = form.profile_image_url;
      setForm((prev) => ({ ...prev, profile_image_url: url }));
      if (previous) await sbDeleteFile(previous, token);
    } catch (error) {
      alert("Profile image upload failed: " + error.message);
    }
    setUploading(false);
  };

  const removeImage = async () => {
    if (!form.profile_image_url) return;
    const previous = form.profile_image_url;
    setForm((prev) => ({ ...prev, profile_image_url: "" }));
    await sbDeleteFile(previous, token);
  };

  return (
    <div className="pf-profile-manager">
      <div className="pf-profile-manager-preview">
        <div className={`pf-profile-frame pf-profile-style-${currentStyle}`} style={{ aspectRatio: currentAspect }}>
          {form.profile_image_url ? (
            <img src={form.profile_image_url} alt="Profile preview" style={{ objectPosition: getObjectPosition(currentPosition) }} />
          ) : (
            <div className="pf-profile-placeholder"><span>{form.name ? form.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "NN"}</span></div>
          )}
        </div>
      </div>
      <div className="pf-profile-manager-actions">
        <button type="button" className="pf-btn" onClick={() => fileRef.current.click()} disabled={uploading}><Upload size={13} /> {uploading ? "Uploading..." : "Upload image"}</button>
        {form.profile_image_url && <button type="button" className="pf-btn danger" onClick={removeImage}><Trash2 size={13} /> Remove</button>}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
      </div>

      <div className="pf-profile-settings-grid">
        <div>
          <label className="pf-label">Display style</label>
          <div className="pf-option-list">
            {styleOptions.map((option) => (
              <button key={option.value} type="button" className={`pf-option-pill ${currentStyle === option.value ? "selected" : ""}`} onClick={() => setForm((prev) => ({ ...prev, profile_image_style: option.value }))}>{option.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="pf-label">Aspect ratio</label>
          <div className="pf-option-list compact">
            {aspectOptions.map((option) => (
              <button key={option} type="button" className={`pf-option-pill ${currentAspect === option ? "selected" : ""}`} onClick={() => setForm((prev) => ({ ...prev, profile_image_aspect_ratio: option }))}>{option}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="pf-label">Crop position</label>
          <div className="pf-option-list compact">
            {positionOptions.map((option) => (
              <button key={option} type="button" className={`pf-option-pill ${currentPosition === option ? "selected" : ""}`} onClick={() => setForm((prev) => ({ ...prev, profile_image_position: option }))}>{option}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminAboutContact({ meta, setMeta, token }) {
  const [form, setForm] = useState(() => ({
    ...meta,
    links: { ...DEFAULT_META.links, ...(meta.links || {}) },
    profile_image_url: meta.profile_image_url || meta.links?.profile_image_url || "",
    profile_image_style: meta.profile_image_style || meta.links?.profile_image_style || "rounded_rectangle",
    profile_image_aspect_ratio: meta.profile_image_aspect_ratio || meta.links?.profile_image_aspect_ratio || "4:5",
    profile_image_position: meta.profile_image_position || meta.links?.profile_image_position || "center",
  }));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const nextLinks = {
        ...form.links,
        profile_image_url: form.profile_image_url,
        profile_image_style: form.profile_image_style,
        profile_image_aspect_ratio: form.profile_image_aspect_ratio,
        profile_image_position: form.profile_image_position,
      };
      await sbUpdateMeta({ name: form.name, role: form.role, tagline: form.tagline, bio: form.bio, email: form.email, links: nextLinks }, token);
      const nextMeta = {
        ...form,
        links: nextLinks,
        profile_image_url: form.profile_image_url,
        profile_image_style: form.profile_image_style,
        profile_image_aspect_ratio: form.profile_image_aspect_ratio,
        profile_image_position: form.profile_image_position,
      };
      setMeta(nextMeta);
      alert("Saved.");
    } catch (e) { alert("Save failed: " + e.message); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <ProfileImageField form={form} setForm={setForm} token={token} />
      <div style={{ marginTop: 20 }}>
        <label className="pf-label">Name</label><input className="pf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 14 }} />
        <label className="pf-label">Role / title</label><input className="pf-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ marginBottom: 14 }} />
        <label className="pf-label">Homepage tagline</label><input className="pf-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} style={{ marginBottom: 14 }} />
        <label className="pf-label">About / bio</label><textarea className="pf-input" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ marginBottom: 14, resize: "vertical" }} />
        <label className="pf-label">Email</label><input className="pf-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 14 }} />
        {Object.keys(form.links || {}).filter((k) => k !== "profile_image_url" && k !== "profile_image_style" && k !== "profile_image_aspect_ratio" && k !== "profile_image_position").map((k) => (
          <div key={k}>
            <label className="pf-label">{k === "other" ? "Other link" : k[0].toUpperCase() + k.slice(1)}</label>
            <input className="pf-input" value={form.links[k]} onChange={(e) => setForm({ ...form, links: { ...form.links, [k]: e.target.value } })} style={{ marginBottom: 14 }} placeholder="https://..." />
          </div>
        ))}
        <button className="pf-btn primary" disabled={saving} onClick={save}><Check size={13} /> {saving ? "Saving..." : "Save"}</button>
      </div>
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
        {[ ["projects", "Projects"], ["skills", "Skills"], ["about", "About & Contact"] ].map(([id, label]) => (
          <button key={id} className={`pf-nav-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === "projects" && <AdminProjects projects={projects} setProjects={setProjects} token={token} />}
      {tab === "skills" && <AdminSkills meta={meta} setMeta={setMeta} token={token} />}
      {tab === "about" && <AdminAboutContact meta={meta} setMeta={setMeta} token={token} />}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [activeProject, setActiveProject] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const [aiMessages, setAiMessages] = useState([]);
  const [aiStatus, setAiStatus] = useState("checking");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!CONFIGURED) { setLoaded(true); return; }
    (async () => {
      try {
        const [p, m] = await Promise.all([sbGet("projects?order=date.desc"), sbGet("site_meta?id=eq.1")]);
        setProjects(p);
        if (m[0]) {
          const profile = getProfileImageConfig(m[0]);
          setMeta({
            ...DEFAULT_META,
            ...m[0],
            links: { ...DEFAULT_META.links, ...(m[0].links || {}) },
            profile_image_url: profile.url,
            profile_image_style: profile.style,
            profile_image_aspect_ratio: profile.aspect,
            profile_image_position: profile.position,
            skills: m[0].skills?.length ? m[0].skills : DEFAULT_META.skills,
          });
        }
      } catch (e) {
        setLoadErr(e.message);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const result = await fetchAiStatus();
      if (!cancelled) setAiStatus(result.status || "offline");
    };
    poll();
    const interval = setInterval(poll, 45000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const sendAiMessage = useCallback(async (text) => {
    setAiMessages((prev) => {
      const next = [...prev, { role: "user", content: text }];
      (async () => {
        setAiLoading(true);
        try {
          const data = await sendAiChat(next);
          setAiStatus(data.backend === "local" ? "local" : "cloud");
          setAiMessages((cur) => [...cur, { role: "assistant", content: data.reply }]);
        } catch {
          setAiStatus("offline");
          setAiMessages((cur) => [...cur, { role: "assistant", content: "I couldn't reach either backend just now. Try again in a bit, or use the Contact page." }]);
        }
        setAiLoading(false);
      })();
      return next;
    });
  }, []);

  const aiState = { messages: aiMessages, status: aiStatus, loading: aiLoading, send: sendAiMessage };

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
      <Nav route={route} setRoute={setRoute} meta={meta} aiStatus={aiStatus} />
      {!CONFIGURED && (
        <div className="pf-mono" style={{ background: "var(--ai-yes-soft)", color: "var(--ai-yes)", padding: "10px 20px", fontSize: 12, textAlign: "center" }}>
          Supabase not connected — set SUPABASE_URL and SUPABASE_ANON_KEY at the top of the code.
        </div>
      )}
      {loadErr && <div className="pf-mono" style={{ background: "rgba(255,106,106,0.1)", color: "#FF6A6A", padding: "10px 20px", fontSize: 12, textAlign: "center" }}>Couldn't load data: {loadErr}</div>}
      <div key={route.page} className="pf-page-transition">
        {route.page === "home" && <Home meta={meta} projects={projects} setRoute={setRoute} openProject={setActiveProject} />}
        {route.page === "work" && <WorkPage initialCategory={route.category || "all"} projects={projects} openProject={setActiveProject} setRoute={setRoute} meta={meta} />}
        {CATEGORIES.some((c) => c.id === route.page) && <WorkPage initialCategory={route.page} projects={projects} openProject={setActiveProject} setRoute={setRoute} meta={meta} />}
        {route.page === "skills" && <SkillsPage meta={meta} setRoute={setRoute} />}
        {route.page === "about" && <AboutPage meta={meta} setRoute={setRoute} />}
        {route.page === "ai" && <AiPage aiState={aiState} />}
        {route.page === "admin" && <Admin projects={projects} setProjects={wrappedSetProjects} meta={meta} setMeta={wrappedSetMeta} />}
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      <AiWidget route={route} setRoute={setRoute} aiState={aiState} />
    </div>
  );
}
