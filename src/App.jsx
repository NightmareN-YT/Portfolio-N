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

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --bg: #0b0d12;
      --bg-2: #11151d;
      --surface: #121821;
      --surface-strong: #161d2a;
      --surface-soft: #1a2230;
      --line: rgba(170, 180, 205, 0.16);
      --line-strong: rgba(170, 180, 205, 0.24);
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
      --panel: rgba(19, 25, 35, 0.86);
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--bg); color: var(--text); }
    a { color: inherit; }
    button, input, select, textarea { font: inherit; }
    .pf-root {
      background: linear-gradient(180deg, #0b0d12 0%, #111722 100%);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      width: 100%;
    }
    .pf-root * { box-sizing: border-box; }
    .pf-mono { font-family: 'JetBrains Mono', monospace; }
    .pf-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
    .pf-scrollbar::-webkit-scrollbar-thumb { background: rgba(170,180,205,0.2); border-radius: 999px; }
    .pf-scrollbar::-webkit-scrollbar-track { background: transparent; }

    .pf-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 5px 9px; border-radius: 999px; border: 1px solid;
      white-space: nowrap;
    }
    .pf-badge.yes { color: var(--ai-yes); background: var(--ai-yes-soft); border-color: rgba(247,178,103,0.35); }
    .pf-badge.no { color: var(--ai-no); background: var(--ai-no-soft); border-color: rgba(112,224,184,0.34); }

    .pf-card {
      background: rgba(18, 24, 33, 0.86);
      border: 1px solid var(--line);
      transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
    }
    .pf-card:hover {
      border-color: rgba(167,139,250,0.5);
      transform: translateY(-2px);
      box-shadow: 0 18px 30px rgba(10, 12, 18, 0.45);
    }

    .pf-nav-tab {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
      color: var(--muted); padding: 8px 12px; border: 1px solid transparent; cursor: pointer;
      white-space: nowrap; background: transparent; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 999px; transition: all 0.18s ease;
    }
    .pf-nav-tab:hover { color: var(--text); border-color: var(--line); }
    .pf-nav-tab.active {
      color: var(--text); border-color: var(--line); background: rgba(255,255,255,0.02);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    }
    .pf-btn {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.04em;
      padding: 10px 16px; border: 1px solid var(--line); background: rgba(255,255,255,0.01);
      color: var(--text); cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; transition: border-color 0.18s ease, transform 0.18s ease, background 0.18s ease;
      border-radius: 999px; text-transform: uppercase;
    }
    .pf-btn:hover { border-color: rgba(167,139,250,0.5); transform: translateY(-1px); }
    .pf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .pf-btn.primary {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      border-color: transparent; color: #0f1220; font-weight: 700;
    }
    .pf-btn.danger:hover { border-color: rgba(255,107,107,0.7); color: #ffb4b4; }
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
      background: linear-gradient(145deg, rgba(35, 40, 57, 0.98), rgba(18, 24, 33, 0.94) 55%, rgba(13, 16, 24, 0.98));
      color: var(--text); border: 1px solid var(--line); cursor: pointer; padding: 0;
      transition: transform 0.18s ease, border-color 0.18s ease;
    }
    .pf-project-card:hover { transform: translateY(-2px); border-color: rgba(167,139,250,0.5); }
    .pf-project-visual {
      position: relative; width: 100%; height: 260px; overflow: hidden; background: #111827;
      border-bottom: 1px solid var(--line);
    }
    .pf-project-visual img {
      width: 100%; height: 100%; display: block; object-fit: cover; object-position: center bottom;
      transition: transform 0.35s ease;
    }
    .pf-project-card:hover .pf-project-visual img { transform: scale(1.04); }
    .pf-project-overlay {
      position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,8,12,0.12), rgba(7,8,12,0.52));
      display: flex; align-items: flex-end; justify-content: space-between; padding: 14px;
    }
    .pf-project-category {
      color: var(--text); background: rgba(11,13,18,0.48); border: 1px solid rgba(255,255,255,0.08);
      padding: 5px 8px; border-radius: 999px; font-size: 9px; letter-spacing: 0.08em;
    }
    .pf-project-body {
      padding: 16px 16px 18px; background: linear-gradient(180deg, rgba(30, 36, 51, 0.74), rgba(16, 21, 30, 0.92));
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
      display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px;
    }
    .pf-tag {
      display: inline-flex; align-items: center; justify-content: center;
      border: 1px solid var(--line); border-radius: 999px; padding: 6px 8px; color: var(--muted);
      background: rgba(255,255,255,0.02); font-size: 10px; letter-spacing: 0.06em;
    }

    .pf-capability-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;
    }
    .pf-capability-card {
      text-align: left; border: 1px solid var(--line); background: rgba(18,24,33,0.82); border-radius: 18px;
      padding: 18px; color: var(--text); cursor: pointer; transition: border-color 0.18s ease, transform 0.18s ease;
    }
    .pf-capability-card:hover { border-color: rgba(167,139,250,0.5); transform: translateY(-2px); }
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
      border: 1px solid var(--line); background: rgba(18,24,33,0.82); border-radius: 18px;
      padding: 18px; margin-bottom: 18px;
    }

    .pf-about-preview { margin-top: 30px; }
    .pf-about-panel {
      border: 1px solid var(--line); background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(18,24,33,0.82));
      border-radius: 22px; padding: 26px; display: flex; align-items: center; justify-content: space-between; gap: 18px;
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

    .pf-contact-item { transition: border-color 0.18s ease, transform 0.18s ease; }
    .pf-contact-item:hover { border-color: rgba(167,139,250,0.5); }

    .pf-profile-manager {
      border: 1px solid var(--line); background: rgba(18,24,33,0.82); padding: 20px; border-radius: 18px;
    }
    .pf-profile-manager-preview {
      display: flex; justify-content: center; margin-bottom: 18px;
    }
    .pf-profile-manager-actions {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px;
    }
    .pf-nav-inner {
      max-width: 1440px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center;
      justify-content: space-between; gap: 18px; flex-wrap: wrap;
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
      .pf-nav-inner { display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 12px 16px; }
      .pf-nav-inner > div:nth-child(2) { grid-column: 1 / -1; grid-row: 2; justify-content: flex-start; width: calc(100vw - 32px); }
      .pf-nav-inner > button { justify-self: end; }
      .pf-nav-tab { font-size: 10px; padding: 8px 10px; }
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
      .pf-project-visual { height: 220px; }
      .pf-project-body h3 { font-size: 16px; }
      .pf-about-panel { padding: 18px; }
      .pf-profile-manager { padding: 16px; }
      .pf-btn, .pf-nav-tab { padding-left: 12px; padding-right: 12px; }
    }
  `}</style>
);

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

function ProjectCard({ project, onOpen, index = 0 }) {
  const thumb = thumbnailOf(project);
  const cat = CATEGORIES.find((c) => c.id === project.category);
  const displayTools = (project.tools || []).slice(0, 3);

  return (
    <button type="button" className="pf-project-card pf-card-in" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }} onClick={() => onOpen(project)}>
      <div className="pf-project-visual">
        {thumb ? <img src={thumb} alt={project.title} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "var(--muted)" }}><CategoryIcon id={project.category} size={28} /></div>}
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
}

function Nav({ route, setRoute, meta }) {
  const tabs = [...CATEGORIES.map((c) => ({ id: c.id, label: c.short })), { id: "skills", label: "SKILLS" }, { id: "about", label: "ABOUT" }, { id: "contact", label: "CONTACT" }];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(11,13,18,0.82)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
      <div className="pf-nav-inner">
        <div className="pf-mono" style={{ fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => setRoute({ page: "home" })}>
          <Terminal size={16} color="var(--accent)" /> {meta.name}
        </div>
        <div className="pf-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto", flex: 1, justifyContent: "center" }}>
          {tabs.map((t) => <button key={t.id} className={`pf-nav-tab ${route.page === t.id ? "active" : ""}`} onClick={() => setRoute({ page: t.id })}>{t.label}</button>)}
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
  const firstCategory = CATEGORIES[0]?.id || "games";
  const skillsPreview = meta.skills.flatMap((g) => g.items).slice(0, 14);
  const profile = getProfileImageConfig(meta);
  const disciplineCount = new Set(projects.map((project) => project.category).filter(Boolean)).size;

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 24px 40px" }}>
      <section className="pf-hero">
        <div className="pf-hero-copy">
          <div className="pf-mono pf-kicker">$ whoami --role="{meta.role}"</div>
          <h1>{meta.name}</h1>
          <p className="pf-tagline">{meta.tagline}</p>
          <p className="pf-lead">{meta.bio}</p>
          <div className="pf-actions">
            <button type="button" className="pf-btn primary" onClick={() => setRoute({ page: firstCategory })}><span>View Work</span> <ArrowRight size={14} /></button>
            <button type="button" className="pf-btn" onClick={() => setRoute({ page: "contact" })}>Contact</button>
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
          <button type="button" className="pf-nav-tab" onClick={() => setRoute({ page: firstCategory })}>View all <ArrowRight size={12} /></button>
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
              <button type="button" key={c.id} className="pf-capability-card" onClick={() => setRoute({ page: c.id })}>
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
          {skillsPreview.map((s, i) => <span key={i} className="pf-mono pf-tag">{s}</span>)}
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

function CategoryPage({ catId, projects, openProject, setRoute, meta }) {
  const [filter, setFilter] = useState("all");
  const cat = CATEGORIES.find((c) => c.id === catId);
  let items = projects.filter((p) => p.category === catId);
  if (filter === "ai") items = items.filter((p) => p.ai_used);
  if (filter === "manual") items = items.filter((p) => !p.ai_used);
  items = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 24px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 18 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-page-header">
        <div className="pf-page-header-label"><cat.icon size={18} /> <span className="pf-mono">{cat.short}</span></div>
        <h2>{cat.label}</h2>
      </div>
      <div className="pf-filter-row">
        {[["all", "All"], ["ai", "AI-assisted"], ["manual", "No AI"]].map(([id, label]) => (
          <button key={id} type="button" className={`pf-nav-tab ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>
      {items.length === 0 ? <div className="pf-empty">No projects in this category yet.</div> : (
        <div className="pf-project-grid">{items.map((p, i) => <ProjectCard key={p.id} project={p} onOpen={openProject} index={i} />)}</div>
      )}
      <Footer meta={meta} />
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [closing, setClosing] = useState(false);
  const [shown, setShown] = useState(project);

  useEffect(() => {
    if (project) { setShown(project); setClosing(false); }
  }, [project]);

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
  const p = shown;
  if (!p) return null;
  const groups = IMAGE_GROUPS[p.category] || [];
  const imgs = p.images || [];
  const hero = thumbnailOf(p);

  return (
    <div className={`pf-modal-backdrop ${closing ? "closing" : ""}`} style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.82)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={handleClose}>
      <div role="dialog" aria-modal="true" className={`pf-scrollbar pf-modal-panel ${closing ? "closing" : ""}`} style={{ background: "var(--surface)", border: "1px solid var(--line)", maxWidth: 960, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 26px 80px rgba(0,0,0,0.42)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "14px 20px", background: "rgba(18,20,27,0.96)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
          <button className="pf-btn" onClick={handleClose} aria-label="Close project details"><X size={14} /></button>
        </div>

        {hero && (
          <div style={{ background: "linear-gradient(180deg, rgba(124,92,255,0.06), rgba(0,0,0,0))", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={hero} alt={p.title} style={{ width: "100%", maxHeight: "52vh", objectFit: "contain", objectPosition: "center", display: "block" }} />
          </div>
        )}

        <div style={{ padding: 28 }}>
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
                      <img src={img.url} alt={`${g.label} ${i + 1}`} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {p.pdf_url && (
            <div style={{ marginTop: 28 }}>
              <div className="pf-mono pf-section-label" style={{ marginBottom: 10 }}>Attachment</div>
              <a href={p.pdf_url} target="_blank" rel="noreferrer" className="pf-btn" style={{ textDecoration: "none" }}>
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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-page-header" style={{ marginBottom: 24 }}>
        <div className="pf-page-header-label"><Terminal size={16} /> <span className="pf-mono">Skills</span></div>
        <h2>Capabilities</h2>
      </div>
      {meta.skills.map((g, i) => (
        <section key={i} className="pf-skill-card">
          <div className="pf-mono pf-section-label" style={{ marginBottom: 12 }}>{g.group.toUpperCase()}</div>
          <div className="pf-skill-tags">{g.items.map((s, j) => <span key={j} className="pf-mono pf-tag">{s}</span>)}</div>
        </section>
      ))}
    </div>
  );
}

function AboutPage({ meta, setRoute }) {
  const profile = getProfileImageConfig(meta);
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
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 60px" }}>
      <button className="pf-nav-tab" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={() => setRoute({ page: "home" })}><ChevronLeft size={12} /> Back</button>
      <div className="pf-page-header" style={{ marginBottom: 24 }}>
        <div className="pf-page-header-label"><Mail size={16} /> <span className="pf-mono">Contact</span></div>
        <h2>Let’s build something thoughtful.</h2>
      </div>
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
  const pdfRef = useRef();

  const groups = IMAGE_GROUPS[form.category] || [];

  const uploadToGroup = async (file, groupKey, single) => {
    setUploadingKey(groupKey); setErr("");
    try {
      const compressed = await compressImage(file);
      const url = await sbUploadFile(compressed, token, "uploads");
      const oldOnes = single ? (form.images || []).filter((i) => i.group === groupKey) : [];
      setForm((f) => {
        const others = single ? (f.images || []).filter((i) => i.group !== groupKey) : (f.images || []);
        return { ...f, images: [...others, { url, group: groupKey }] };
      });
      for (const old of oldOnes) await sbDeleteFile(old.url, token);
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
    await sbDeleteFile(toRemove.url, token);
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
              <button type="button" className="pf-btn danger" onClick={async () => { await sbDeleteFile(form.pdf_url, token); setForm({ ...form, pdf_url: "" }); }}><Trash2 size={12} /> Remove</button>
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
        <button type="button" className="pf-btn" onClick={onCancel}>Cancel</button>
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
      <div key={route.page} className="pf-page-transition">
        {route.page === "home" && <Home meta={meta} projects={projects} setRoute={setRoute} openProject={setActiveProject} />}
        {CATEGORIES.some((c) => c.id === route.page) && <CategoryPage catId={route.page} projects={projects} openProject={setActiveProject} setRoute={setRoute} meta={meta} />}
        {route.page === "skills" && <SkillsPage meta={meta} setRoute={setRoute} />}
        {route.page === "about" && <AboutPage meta={meta} setRoute={setRoute} />}
        {route.page === "contact" && <ContactPage meta={meta} setRoute={setRoute} />}
        {route.page === "admin" && <Admin projects={projects} setProjects={wrappedSetProjects} meta={meta} setMeta={wrappedSetMeta} />}
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
