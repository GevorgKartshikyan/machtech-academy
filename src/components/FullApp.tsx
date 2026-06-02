// @ts-nocheck
"use client";
/* eslint-disable */
// ============================================================================
// MachTech Academy — FULL ported UI (Next.js client component)
// All original artifact components, with the data layer swapped to the API.
// ============================================================================
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { STATIC_STRINGS } from "@/lib/i18n";
import { DEFAULT_MODULES, DEFAULT_FINAL } from "@/lib/default-content";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Montserrat+Arm:wght@300;400;500;600;700;800;900&display=swap');`;

const BRAND = {
  dark: "#121516",
  light: "#F9F9F9",
  green: "#005043",
  mint: "#27D2B3",
};

// i18n lookup — keeps original (key, content) signature; content holds i18nOverrides
function s(key, content) {
  const overrides = content?.i18nOverrides || {};
  if (overrides[key] != null && overrides[key] !== "") return overrides[key];
  return STATIC_STRINGS[key] || key;
}

function MachTechIcon({ size = 28, variant = "light" }) {
  // light = on dark bg (white + mint), dark = on light bg (dark + mint)
  const stroke = variant === "light" ? "#FFFFFF" : "#121516";
  return (
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
        <defs>
          <linearGradient id="mtg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3FE6C4" />
            <stop offset="100%" stopColor="#005043" />
          </linearGradient>
        </defs>
        {/* Back arrow (white/dark) */}
        <path d="M 30 20 L 75 20 L 80 25 L 80 80 L 70 70 L 70 30 L 35 30 Z" fill={stroke} />
        {/* Front arrow (mint gradient) */}
        <path d="M 18 42 L 55 42 L 60 47 L 60 88 L 50 78 L 50 52 L 22 52 Z" fill="url(#mtg)" />
      </svg>
  );
}

/* Full horizontal MachTech wordmark */
function MachTechWordmark({ height = 32, variant = "light" }) {
  const c = variant === "light" ? "#FFFFFF" : "#121516";
  return (
      <div style={{ display: "flex", alignItems: "center", gap: height * 0.32, height }}>
        <MachTechIcon size={height} variant={variant} />
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: height * 0.7, color: c, letterSpacing: "-0.02em", lineHeight: 1 }}>
        Mach<span style={{ position: "relative" }}>Tech</span>
      </span>
      </div>
  );
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin1234";

/* ----------------------------- DEFAULT COURSE CONTENT ----------------------------- */
/* Editable: պահվում է storage-ում; admin-ը կարող է փոխել։ */
function scoreCategory(pct) {
  if (pct <= 40) return { key: "no", label: "Առայժմ խորհուրդ չի տրվում", color: "#e05252" };
  if (pct <= 70) return { key: "maybe", label: "Ունի ներուժ պրակտիկայով", color: "#e0a23a" };
  return { key: "internship", label: "Խորհուրդ է տրվում ստաժավորման", color: "#3aa86b" };
}

function makeTokens(_unused) {
  const c = {
    bg: "#F9F9F9", surface: "#FFFFFF", surface2: "#F1F3F5",
    border: "#E4E7EB", text: "#121516", muted: "#5B6470",
    accent: "#005043", accentLight: "#27D2B3", accentSoft: "#E0F7F1",
    dark: "#121516", good: "#005043", warn: "#C98A25", bad: "#CF4444"
  };
  return {
    c,
    appWrap: { fontFamily: "'Montserrat Arm', 'Montserrat', sans-serif", background: c.bg, color: c.text, minHeight: "100vh", lineHeight: 1.55 },
    muted: c.muted,
    card: { background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22 },
    toast: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: c.dark, color: "#fff", padding: "12px 22px", borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,.25)", zIndex: 200, fontSize: 14, fontWeight: 500, maxWidth: "90%", textAlign: "center" },
  };
}

function globalCSS(t) {
  return `
  *{box-sizing:border-box;} ::selection{background:${t.c.accentLight};color:${t.c.dark};}
  body, html { font-family: 'Montserrat Arm', 'Montserrat', sans-serif; }
  .b24-btn{font-family:'Montserrat Arm','Montserrat',sans-serif;cursor:pointer;border:none;border-radius:10px;font-weight:600;transition:.18s;letter-spacing:.01em;}
  .b24-btn:hover{transform:translateY(-1px);} .b24-btn:active{transform:translateY(0);}
  .b24-btn-primary{background:${t.c.dark};color:#fff;padding:13px 24px;font-size:14.5px;}
  .b24-btn-primary:hover{background:#000;box-shadow:0 6px 20px ${t.c.accentLight}55;}
  .b24-btn-accent{background:${t.c.accentLight};color:${t.c.dark};padding:13px 24px;font-size:14.5px;font-weight:700;}
  .b24-btn-accent:hover{background:#3FE6C4;box-shadow:0 6px 24px ${t.c.accentLight}77;}
  .b24-btn-ghost{background:transparent;color:${t.c.text};border:1px solid ${t.c.border};padding:11px 20px;font-size:13.5px;}
  .b24-btn-ghost:hover{background:${t.c.surface2};border-color:${t.c.dark};}
  .b24-btn-danger{background:${t.c.bad}15;color:${t.c.bad};border:1px solid ${t.c.bad};padding:8px 14px;font-size:12.5px;}
  .b24-input{width:100%;font-family:'Montserrat Arm','Montserrat',sans-serif;background:${t.c.surface};border:1.5px solid ${t.c.border};color:${t.c.text};border-radius:9px;padding:12px 14px;font-size:14px;outline:none;transition:.15s;}
  .b24-input:focus{border-color:${t.c.dark};box-shadow:0 0 0 3px ${t.c.accentLight}33;}
  .b24-card-hover{transition:.2s;} .b24-card-hover:hover{transform:translateY(-2px);border-color:${t.c.dark}!important;box-shadow:0 12px 30px rgba(18,21,22,.08);}
  .b24-fade{animation:b24fade .5s ease both;}
  @keyframes b24fade{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
  @keyframes b24float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes b24glow{0%,100%{opacity:.5;}50%{opacity:.9;}}
  @keyframes b24orbDrift{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(20px,-30px) scale(1.05);}66%{transform:translate(-25px,15px) scale(.95);}}
  @keyframes b24ping{0%{transform:scale(1);opacity:.7;}75%,100%{transform:scale(2.5);opacity:0;}}
  @keyframes b24bounce{0%,100%{transform:translateY(0) translateX(-50%);}50%{transform:translateY(-8px) translateX(-50%);}}
  @keyframes b24scrollDot{0%{transform:translate(-50%,0);opacity:1;}50%{transform:translate(-50%,8px);opacity:.5;}100%{transform:translate(-50%,0);opacity:1;}}
  @keyframes b24slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:none;}}
  @keyframes b24blink{0%,50%{opacity:1;}51%,100%{opacity:0;}}
  @keyframes b24spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes b24progFill{from{width:0;}to{width:73%;}}
  @keyframes b24shimmer{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}
  .b24-stagger>*{animation:b24fade .5s ease both;}
  ${[1,2,3,4,5,6,7,8,9,10].map(i=>`.b24-stagger>*:nth-child(${i}){animation-delay:${i*.06}s}`).join("")}
  a{color:${t.c.accent};text-decoration:none;}
  a:hover{color:${t.c.accentLight};}
  table{border-collapse:collapse;}
  h1,h2,h3,h4{font-family:'Montserrat Arm','Montserrat',sans-serif;letter-spacing:-0.02em;}
  code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:${t.c.surface2};padding:2px 6px;border-radius:5px;font-size:.88em;color:${t.c.dark};}

  /* === RESPONSIVE === */
  /* Tablet and up: hero becomes 2-column */
  @media (min-width: 768px) {
    .b24-hero-grid { grid-template-columns: 1.15fr .85fr !important; gap: 60px !important; padding: 90px 24px 110px !important; }
    .b24-hide-mobile { display: block; }
    .b24-show-mobile { display: none !important; }
  }
  @media (max-width: 767px) {
    .b24-hide-mobile { display: none !important; }
    .b24-show-mobile { display: block !important; }
    .b24-stack-mobile { grid-template-columns: 1fr !important; }
    .b24-pad-mobile { padding: 20px !important; }
    .b24-text-mobile-sm { font-size: 14px !important; }
    .b24-hero-stats { gap: 18px !important; }
    .b24-cta-pad { padding: 40px 22px !important; }
    .b24-footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
    .b24-tab-bar { overflow-x: auto; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; }
    .b24-tab-bar button { flex: 0 0 auto !important; white-space: nowrap; min-width: 110px; }
    .b24-modal-pad { padding: 8px !important; align-items: flex-start !important; padding-top: 16px !important; }
    .b24-table-card { padding: 0 !important; }
    .b24-card-mobile { padding: 16px !important; }
    .b24-h1-mobile { font-size: 32px !important; line-height: 1.05 !important; }
    .b24-section-pad { padding: 60px 18px 30px !important; }
    .b24-grid-2-stack { grid-template-columns: 1fr !important; }
    .b24-topbar { padding: 12px 16px !important; }
    .b24-topbar-badge { display: none !important; }
    .b24-btn-stack { width: 100% !important; }
    .b24-hero-orbit { display: none !important; }
    .b24-section-mobile-tight { padding: 40px 18px !important; }
  }
  `;
}

/* ----------------------------- ROOT ----------------------------- */
/* ----------------------------- COURSE CATALOG (multi-course) ----------------------------- */
function TopBar({ t, session, currentUser, onHome, onLogout, onLoginClick }) {
  return (
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.c.border}` }}>
        <div className="b24-topbar" style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <MachTechWordmark height={28} variant="dark" />
            <span className="b24-topbar-badge" style={{ marginLeft: 12, padding: "3px 10px", borderRadius: 99, background: t.c.dark, color: t.c.accentLight, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em" }}>ACADEMY</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {session ? (<>
              {currentUser && <span style={{ fontSize: 13.5, color: t.c.muted, fontWeight: 500 }}>{currentUser.fullName?.split(" ")[0]}</span>}
              {session === "ADMIN" && <span style={{ fontSize: 11, background: t.c.dark, color: t.c.accentLight, fontWeight: 700, padding: "3px 9px", borderRadius: 5, letterSpacing: ".08em" }}>ADMIN</span>}
              <button className="b24-btn b24-btn-ghost" onClick={onLogout}>Ելք</button>
            </>) : <button className="b24-btn b24-btn-primary" onClick={onLoginClick} style={{ padding: "10px 20px" }}>Մուտք / Գրանցում</button>}
          </div>
        </div>
      </div>
  );
}

/* ----------------------------- LANDING ----------------------------- */
/* ============== ANIMATED COUNTER hook ============== */
function useAnimatedNumber(target, duration = 1500, start = 0) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

/* ============== TYPING ROTATOR hook ============== */
function useTypingRotator(phrases, typeSpeed = 65, pauseMs = 1800) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | pause | deleting
  useEffect(() => {
    const cur = phrases[idx];
    if (phase === "typing") {
      if (text.length < cur.length) {
        const t = setTimeout(() => setText(cur.slice(0, text.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      } else { const t = setTimeout(() => setPhase("deleting"), pauseMs); return () => clearTimeout(t); }
    }
    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), typeSpeed / 2);
        return () => clearTimeout(t);
      } else { setIdx((idx + 1) % phrases.length); setPhase("typing"); }
    }
  }, [text, phase, idx, phrases, typeSpeed, pauseMs]);
  return text;
}

function Landing({ t, onStart, courses, content }) {
  const primary = courses.find((c) => c.id === "crm-foundation") || courses[0] || { modules: [] };
  const totalMin = primary.modules.reduce((s, m) => s + (parseInt(m.duration) || 20), 0);
  // shorthand: lookup with i18n overrides
  const $ = (k) => s(k, content);

  // Mouse-tracking for hero orb
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    const el = heroRef.current;
    if (el) el.addEventListener("mousemove", onMove);
    return () => { if (el) el.removeEventListener("mousemove", onMove); };
  }, []);

  // Scroll progress bar
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setScrollPct(Math.max(0, Math.min(1, scrolled)));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animated stat counters
  const n1 = useAnimatedNumber(primary.modules.length || 9, 1200);
  const n2 = useAnimatedNumber(Math.round(totalMin / 60) || 3, 1400);
  const n3 = useAnimatedNumber(43, 1600);
  const n4 = useAnimatedNumber(100, 1800);

  // Rotating headline word
  const rotator = useTypingRotator([
    s("landing.headline.role1", content),
    s("landing.headline.role2", content),
    s("landing.headline.role3", content),
    s("landing.headline.role4", content),
  ], 70, 2200);

  // Testimonials (rotating) — sourced from i18n
  const testimonials = [
    { name: $("landing.t1.name"), role: $("landing.t1.role"), text: $("landing.t1.text"), avatar: "🧑‍💻" },
    { name: $("landing.t2.name"), role: $("landing.t2.role"), text: $("landing.t2.text"), avatar: "👩‍💼" },
    { name: $("landing.t3.name"), role: $("landing.t3.role"), text: $("landing.t3.text"), avatar: "👨‍🔧" }
  ];
  const [testIdx, setTestIdx] = useState(0);
  useEffect(() => { const id = setInterval(() => setTestIdx(i => (i + 1) % testimonials.length), 5500); return () => clearInterval(id); }, []);

  // FAQ — sourced from i18n
  const faqs = [
    { q: $("landing.faq.q1"), a: $("landing.faq.a1") },
    { q: $("landing.faq.q2"), a: $("landing.faq.a2") },
    { q: $("landing.faq.q3"), a: $("landing.faq.a3") },
    { q: $("landing.faq.q4"), a: $("landing.faq.a4") },
    { q: $("landing.faq.q5"), a: $("landing.faq.a5") },
  ];
  const [openFaq, setOpenFaq] = useState(0);

  return (
      <div className="b24-fade">
        {/* SCROLL PROGRESS */}
        <div style={{ position: "fixed", top: 56, left: 0, height: 2, width: `${scrollPct * 100}%`, background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.mint})`, zIndex: 60, transition: "width .1s linear" }} />

        {/* ========== HERO ========== */}
        <section ref={heroRef} style={{ position: "relative", overflow: "hidden", background: t.c.dark, color: "#fff", padding: "0", minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Mouse-following gradient orb */}
          <div style={{ position: "absolute", top: `${mouse.y * 100}%`, left: `${mouse.x * 100}%`, width: 600, height: 600, background: `radial-gradient(circle, ${BRAND.mint}33, transparent 65%)`, pointerEvents: "none", transform: "translate(-50%, -50%)", transition: "all .3s cubic-bezier(.2,.8,.2,1)", filter: "blur(30px)" }} />
          <div style={{ position: "absolute", top: "-15%", right: "-5%", width: "55%", height: "100%", background: `radial-gradient(circle at 50% 50%, ${BRAND.green}99, transparent 60%)`, pointerEvents: "none", animation: "b24orbDrift 18s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-25%", left: "-10%", width: "50%", height: "70%", background: `radial-gradient(circle at 50% 50%, ${BRAND.mint}55, transparent 60%)`, pointerEvents: "none", animation: "b24orbDrift 22s ease-in-out infinite reverse" }} />

          {/* Dot pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${BRAND.mint}22 1.2px, transparent 1.2px)`, backgroundSize: "32px 32px", pointerEvents: "none", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)" }} />

          {/* Floating geometric shapes */}
          <div style={{ position: "absolute", top: "15%", left: "8%", animation: "b24float 8s ease-in-out infinite", opacity: .15 }}>
            <div style={{ width: 60, height: 60, border: `2px solid ${BRAND.mint}`, borderRadius: 12, transform: "rotate(15deg)" }} />
          </div>
          <div style={{ position: "absolute", top: "65%", right: "12%", animation: "b24float 10s ease-in-out infinite", animationDelay: "1.5s", opacity: .12 }}>
            <div style={{ width: 40, height: 40, border: `2px solid ${BRAND.mint}`, borderRadius: "50%" }} />
          </div>
          <div style={{ position: "absolute", top: "30%", right: "25%", animation: "b24float 9s ease-in-out infinite", animationDelay: "0.8s", opacity: .12 }}>
            <div style={{ width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderBottom: `35px solid ${BRAND.mint}`, transform: "rotate(15deg)" }} />
          </div>

          <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "70px 20px 90px", display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "center", width: "100%" }} className="b24-hero-grid">
            {/* LEFT */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 99, background: `${BRAND.mint}1a`, border: `1px solid ${BRAND.mint}55`, fontSize: 12, fontWeight: 600, color: BRAND.mint, marginBottom: 28, letterSpacing: ".08em", animation: "b24fade .6s ease both" }}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ position: "absolute", inset: -3, borderRadius: "50%", background: BRAND.mint, opacity: .5, animation: "b24ping 2s cubic-bezier(0,0,.2,1) infinite" }} />
                <span style={{ position: "relative", width: 6, height: 6, borderRadius: "50%", background: BRAND.mint }} />
              </span>
                {$("landing.badge")}
              </div>

              <h1 className="b24-h1-mobile" style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 900, lineHeight: 1, margin: "0 0 24px", letterSpacing: "-0.035em" }}>
                <div style={{ animation: "b24slideUp .7s ease both" }}>{$("landing.headline.prefix")}</div>
                <div style={{ animation: "b24slideUp .7s ease both", animationDelay: ".1s", minHeight: "1.15em" }}>
                  <span style={{ background: `linear-gradient(135deg, ${BRAND.mint}, #6FF0D4, #B5FFE9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{rotator}</span>
                  <span style={{ display: "inline-block", width: 4, height: "0.85em", background: BRAND.mint, marginLeft: 4, verticalAlign: "text-bottom", animation: "b24blink 1s steps(2) infinite" }} />
                </div>
              </h1>

              <p style={{ fontSize: "clamp(15px, 1.6vw, 19px)", color: "#A8B2BC", maxWidth: 540, lineHeight: 1.6, marginBottom: 36, animation: "b24slideUp .7s ease both", animationDelay: ".25s" }}>
                {$("landing.subhead")}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44, animation: "b24slideUp .7s ease both", animationDelay: ".4s" }}>
                <button className="b24-btn b24-btn-accent" onClick={onStart} style={{ padding: "16px 32px", fontSize: 15.5, position: "relative", overflow: "hidden" }}>
                  <span style={{ position: "relative", zIndex: 1 }}>{$("landing.cta.start")}</span>
                </button>
                <button className="b24-btn" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "16px 26px", fontSize: 14.5, background: "rgba(255,255,255,.06)", color: "#fff", border: "1px solid rgba(255,255,255,.18)", fontWeight: 500, backdropFilter: "blur(10px)" }}>
                  {$("landing.cta.how")}
                </button>
              </div>

              {/* Animated stats */}
              <div className="b24-hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, paddingTop: 30, borderTop: "1px solid rgba(255,255,255,.08)", animation: "b24slideUp .7s ease both", animationDelay: ".55s" }}>
                {[
                  [Math.round(n1), $("landing.hero.stat1.suffix"), $("landing.hero.stat1.label")],
                  [Math.round(n2), $("landing.hero.stat2.suffix"), $("landing.hero.stat2.label")],
                  [Math.round(n3), $("landing.hero.stat3.suffix"), $("landing.hero.stat3.label")],
                  [Math.round(n4), $("landing.hero.stat4.suffix"), $("landing.hero.stat4.label")]
                ].map(([v, suf, l], i) => (
                    <div key={i}>
                      <div style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: BRAND.mint, lineHeight: 1, letterSpacing: "-0.03em" }}>{v}{suf}</div>
                      <div style={{ fontSize: 11, color: "#8B95A0", marginTop: 6, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600 }}>{l}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* RIGHT — visual logo+cards */}
            <div className="b24-hero-orbit" style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Outer rotating ring */}
              <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", border: `1px dashed ${BRAND.mint}33`, animation: "b24spin 40s linear infinite" }}>
                <div style={{ position: "absolute", top: -6, left: "50%", width: 12, height: 12, borderRadius: "50%", background: BRAND.mint, transform: "translateX(-50%)", boxShadow: `0 0 20px ${BRAND.mint}` }} />
              </div>
              <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", border: `1px solid ${BRAND.mint}22`, animation: "b24spin 30s linear infinite reverse" }}>
                <div style={{ position: "absolute", bottom: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: BRAND.green, transform: "translateX(-50%)" }} />
              </div>
              <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: `1px solid ${BRAND.mint}11` }} />

              {/* Pulsing center logo */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 260, height: 260, animation: "b24float 6s ease-in-out infinite", position: "relative" }}>
                  <div style={{ position: "absolute", inset: -20, background: `radial-gradient(circle, ${BRAND.mint}33, transparent 65%)`, animation: "b24glow 3s ease-in-out infinite", borderRadius: "50%", filter: "blur(20px)" }} />
                  <MachTechIcon size={260} variant="light" />
                </div>
              </div>

              {/* Floating cards with stagger */}
              <div style={{ position: "absolute", top: 25, right: 0, background: "rgba(255,255,255,.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 18px", animation: "b24float 5s ease-in-out infinite", animationDelay: "1s", boxShadow: "0 20px 40px rgba(0,0,0,.3)" }}>
                <div style={{ fontSize: 11, color: BRAND.mint, fontWeight: 700, letterSpacing: ".1em" }}>{$("landing.hero.card1.eyebrow")}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 5 }}>{$("landing.hero.card1.title")}</div>
                <div style={{ fontSize: 11, color: "#8B95A0", marginTop: 2 }}>{$("landing.hero.card1.sub")}</div>
              </div>

              <div style={{ position: "absolute", bottom: 60, left: 0, background: "rgba(255,255,255,.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 18px", animation: "b24float 7s ease-in-out infinite", animationDelay: "2s", boxShadow: "0 20px 40px rgba(0,0,0,.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: `linear-gradient(135deg, ${BRAND.mint}, ${BRAND.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>✓</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{$("landing.hero.card2.title")}</div>
                    <div style={{ fontSize: 11, color: "#8B95A0" }}>{$("landing.hero.card2.sub")}</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, width: 140, height: 4, background: "rgba(255,255,255,.1)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: "73%", height: "100%", background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.mint})`, animation: "b24progFill 2s ease-out" }} />
                </div>
              </div>

              <div style={{ position: "absolute", top: "45%", left: -20, background: "rgba(255,255,255,.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "12px 16px", animation: "b24float 6s ease-in-out infinite", animationDelay: "0.5s", boxShadow: "0 20px 40px rgba(0,0,0,.3)" }}>
                <div style={{ fontSize: 11, color: BRAND.mint, fontWeight: 700, letterSpacing: ".1em" }}>{$("landing.hero.card3.eyebrow")}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#fff" }}>{$("landing.hero.card3.title")}</div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center", animation: "b24bounce 2.5s ease-in-out infinite", opacity: .6 }}>
            <div style={{ fontSize: 10, color: "#8B95A0", letterSpacing: ".2em", marginBottom: 6, fontWeight: 600 }}>{$("landing.hero.scroll")}</div>
            <div style={{ width: 22, height: 36, border: `1.5px solid ${BRAND.mint}66`, borderRadius: 11, margin: "0 auto", position: "relative" }}>
              <div style={{ width: 3, height: 8, background: BRAND.mint, borderRadius: 2, position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", animation: "b24scrollDot 1.8s ease-in-out infinite" }} />
            </div>
          </div>

          {/* Decorative tagline at bottom */}
          <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,.06)", padding: "18px 24px", textAlign: "center", fontSize: 11, color: "#5B6470", letterSpacing: ".3em", fontWeight: 600 }}>
            {$("landing.tagline")}
          </div>
        </section>

        {/* ========== TICKER STATS ========== */}
        <section style={{ background: t.c.dark, color: "#fff", padding: "30px 24px", borderTop: `1px solid rgba(255,255,255,.05)`, overflow: "hidden", position: "relative" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 30, alignItems: "center" }}>
            {[
              { v: $("landing.ticker.value1"), l: $("landing.ticker.title1") },
              { v: $("landing.ticker.value2"), l: $("landing.ticker.title2") },
              { v: $("landing.ticker.value3"), l: $("landing.ticker.title3") },
              { v: $("landing.ticker.value4"), l: $("landing.ticker.title4") }
            ].map((it, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: BRAND.mint, letterSpacing: "-0.03em", lineHeight: 1 }}>{it.v}</div>
                  <div style={{ fontSize: 12, color: "#8B95A0", marginTop: 6, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600 }}>{it.l}</div>
                </div>
            ))}
          </div>
        </section>

        {/* ========== WHAT YOU LEARN ========== */}
        <section id="how" style={{ maxWidth: 1180, margin: "0 auto", padding: "100px 24px 50px" }} className="b24-section-mobile-tight">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: t.c.accentSoft, fontSize: 12, color: t.c.accent, fontWeight: 700, letterSpacing: ".15em", marginBottom: 16 }}>{$("landing.learn.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.025em", lineHeight: 1.05 }}>{$("landing.learn.heading")}</h2>
            <p style={{ fontSize: 17, color: t.c.muted, maxWidth: 580, margin: "0 auto", lineHeight: 1.55 }}>{$("landing.learn.subtitle")}</p>
          </div>

          <div className="b24-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {[
              { num: "01", icon: "🎯", title: $("landing.learn.card1.title"), desc: $("landing.learn.card1.desc"), color: BRAND.mint },
              { num: "02", icon: "🧩", title: $("landing.learn.card2.title"), desc: $("landing.learn.card2.desc"), color: BRAND.green },
              { num: "03", icon: "📊", title: $("landing.learn.card3.title"), desc: $("landing.learn.card3.desc"), color: BRAND.mint },
              { num: "04", icon: "🧠", title: $("landing.learn.card4.title"), desc: $("landing.learn.card4.desc"), color: BRAND.green }
            ].map((x, i) => (
                <div key={i} className="b24-card-hover" style={{ ...t.card, padding: 26, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, fontWeight: 900, color: x.color, opacity: .08, letterSpacing: "-0.05em", lineHeight: 1 }}>{x.num}</div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 38, marginBottom: 14 }}>{x.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, letterSpacing: "-0.01em" }}>{x.title}</div>
                    <div style={{ color: t.c.muted, fontSize: 14, lineHeight: 1.6 }}>{x.desc}</div>
                  </div>
                </div>
            ))}
          </div>
        </section>

        {/* ========== LEARNING TRACKS — Bitrix24 specialist path ========== */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px" }} className="b24-section-mobile-tight">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: t.c.accentSoft, fontSize: 12, color: t.c.accent, fontWeight: 700, letterSpacing: ".15em", marginBottom: 16 }}>{$("landing.tracks.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{$("landing.tracks.heading")}</h2>
            <p style={{ fontSize: 16, color: t.c.muted, maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>{$("landing.tracks.subtitle")}</p>
          </div>

          {/* Track stages */}
          <div style={{ position: "relative" }}>
            <div className="b24-hide-mobile" style={{ position: "absolute", top: 50, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, ${BRAND.mint}, ${BRAND.green}, ${BRAND.mint}55)`, zIndex: 0 }} />
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
              {[
                { stage: "1", level: $("landing.tracks.s1.level"), title: $("landing.tracks.s1.title"), desc: $("landing.tracks.s1.desc"), status: "open", duration: $("landing.tracks.s1.duration"), color: BRAND.mint },
                { stage: "2", level: $("landing.tracks.s2.level"), title: $("landing.tracks.s2.title"), desc: $("landing.tracks.s2.desc"), status: "soon", duration: $("landing.tracks.s2.duration"), color: BRAND.green },
                { stage: "3", level: $("landing.tracks.s3.level"), title: $("landing.tracks.s3.title"), desc: $("landing.tracks.s3.desc"), status: "soon", duration: $("landing.tracks.s3.duration"), color: BRAND.green },
                { stage: "4", level: $("landing.tracks.s4.level"), title: $("landing.tracks.s4.title"), desc: $("landing.tracks.s4.desc"), status: "soon", duration: $("landing.tracks.s4.duration"), color: BRAND.mint }
              ].map((tr, i) => (
                  <div key={i} className="b24-card-hover" style={{ ...t.card, padding: 22, textAlign: "center", position: "relative" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${tr.color}, ${BRAND.mint})`, color: t.c.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, margin: "0 auto 14px", boxShadow: `0 6px 20px ${tr.color}55`, position: "relative", zIndex: 1 }}>{tr.stage}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: tr.color, letterSpacing: ".15em", marginBottom: 4 }}>{tr.level}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, letterSpacing: "-0.01em" }}>{tr.title}</div>
                    <div style={{ color: t.c.muted, fontSize: 12.5, lineHeight: 1.5, marginBottom: 10 }}>{tr.desc}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: t.c.surface2, color: t.c.muted, fontWeight: 600 }}>⏱ {tr.duration}</span>
                      <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: tr.status === "open" ? t.c.good + "22" : t.c.warn + "22", color: tr.status === "open" ? t.c.good : t.c.warn, fontWeight: 700, letterSpacing: ".05em" }}>{tr.status === "open" ? $("landing.tracks.status.open") : $("landing.tracks.status.soon")}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 30, fontSize: 13, color: t.c.muted }}>{$("landing.tracks.bottom")}</div>
        </section>

        {/* ========== HOW IT WORKS — TIMELINE ========== */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px" }} className="b24-section-mobile-tight">
          <div style={{ background: t.c.dark, color: "#fff", borderRadius: 28, padding: "70px 50px", position: "relative", overflow: "hidden" }} className="b24-cta-pad">
            <div style={{ position: "absolute", top: "-40%", right: "-15%", width: "55%", height: "180%", background: `radial-gradient(circle, ${BRAND.mint}22, transparent 60%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${BRAND.mint}1a 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none", maskImage: "linear-gradient(180deg, black, transparent)", WebkitMaskImage: "linear-gradient(180deg, black, transparent)" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: `${BRAND.mint}1a`, border: `1px solid ${BRAND.mint}44`, fontSize: 12, color: BRAND.mint, fontWeight: 700, letterSpacing: ".15em", marginBottom: 16 }}>{$("landing.path.eyebrow")}</div>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, margin: "0 0 50px", letterSpacing: "-0.025em", maxWidth: 600, lineHeight: 1.1 }}>{$("landing.path.heading")}</h2>

              <div style={{ position: "relative" }}>
                {/* Connecting line */}
                <div className="b24-hide-mobile" style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${BRAND.mint}33, ${BRAND.mint}33, transparent)`, transform: "translateY(-50%)", zIndex: 0 }} />

                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                  {[
                    { n: "01", title: $("landing.path.s1.title"), desc: $("landing.path.s1.desc"), icon: "📝" },
                    { n: "02", title: $("landing.path.s2.title"), desc: $("landing.path.s2.desc"), icon: "📚" },
                    { n: "03", title: $("landing.path.s3.title"), desc: $("landing.path.s3.desc"), icon: "🏁" },
                    { n: "04", title: $("landing.path.s4.title"), desc: $("landing.path.s4.desc"), icon: "🚀" }
                  ].map((s, i) => (
                      <div key={i} style={{ position: "relative", paddingTop: 4, textAlign: "center" }}>
                        <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px", boxShadow: `0 8px 30px ${BRAND.mint}55`, position: "relative", zIndex: 1 }}>
                          {s.icon}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: BRAND.mint, letterSpacing: ".15em", marginBottom: 4 }}>{s.n}</div>
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.title}</div>
                        <div style={{ color: "#A8B2BC", fontSize: 13.5, lineHeight: 1.55 }}>{s.desc}</div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIAL CAROUSEL ========== */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px" }} className="b24-section-mobile-tight">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: t.c.accentSoft, fontSize: 12, color: t.c.accent, fontWeight: 700, letterSpacing: ".15em", marginBottom: 14 }}>{$("landing.testimonials.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{$("landing.testimonials.heading")}</h2>
          </div>

          <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", minHeight: 240 }}>
            {testimonials.map((tst, i) => (
                <div key={i} style={{
                  position: i === testIdx ? "relative" : "absolute",
                  inset: 0,
                  opacity: i === testIdx ? 1 : 0,
                  transform: i === testIdx ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity .6s, transform .6s",
                  pointerEvents: i === testIdx ? "auto" : "none"
                }}>
                  <div style={{ ...t.card, padding: 36, textAlign: "center", position: "relative", overflow: "hidden" }} className="b24-card-mobile">
                    <div style={{ position: "absolute", top: -30, left: -10, fontSize: 200, color: BRAND.mint, opacity: .08, lineHeight: 1, fontFamily: "serif" }}>"</div>
                    <div style={{ position: "relative" }}>
                      <div style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24, fontStyle: "italic", color: t.c.text }}>"{tst.text}"</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{tst.avatar}</div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{tst.name}</div>
                          <div style={{ fontSize: 12.5, color: t.c.muted }}>{tst.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestIdx(i)} style={{ width: i === testIdx ? 28 : 8, height: 8, borderRadius: 99, background: i === testIdx ? BRAND.mint : t.c.border, border: "none", cursor: "pointer", padding: 0, transition: "width .3s" }} />
              ))}
            </div>
          </div>
        </section>

        {/* ========== FOR WHOM ========== */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 24px 60px" }} className="b24-section-mobile-tight">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{$("landing.forwhom.heading")}</h2>
            <p style={{ color: t.c.muted, fontSize: 15 }}>{$("landing.forwhom.subtitle")}</p>
          </div>
          <div className="b24-grid-2-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ ...t.card, padding: 32, borderLeft: `4px solid ${BRAND.mint}`, position: "relative", overflow: "hidden" }} className="b24-card-mobile">
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: .06 }}>✓</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 12, color: t.c.accent, fontWeight: 800, letterSpacing: ".15em", marginBottom: 12 }}>{$("landing.forwhom.yes.eyebrow")}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>{$("landing.forwhom.cardtitle")}</h3>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {[
                    $("landing.forwhom.yes.item1"),
                    $("landing.forwhom.yes.item2"),
                    $("landing.forwhom.yes.item3"),
                    $("landing.forwhom.yes.item4"),
                    $("landing.forwhom.yes.item5")
                  ].map((r, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, padding: "10px 0", fontSize: 14.5, lineHeight: 1.5 }}>
                        <span style={{ color: BRAND.mint, fontWeight: 800, fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>✓</span>{r}
                      </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ ...t.card, padding: 32, background: t.c.surface2, borderLeft: `4px solid ${t.c.muted}`, position: "relative", overflow: "hidden" }} className="b24-card-mobile">
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: .06 }}>✗</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 12, color: t.c.muted, fontWeight: 800, letterSpacing: ".15em", marginBottom: 12 }}>{$("landing.forwhom.no.eyebrow")}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>{$("landing.forwhom.cardtitle")}</h3>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {[
                    $("landing.forwhom.no.item1"),
                    $("landing.forwhom.no.item2"),
                    $("landing.forwhom.no.item3"),
                    $("landing.forwhom.no.item4"),
                    $("landing.forwhom.no.item5")
                  ].map((r, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, padding: "10px 0", fontSize: 14.5, lineHeight: 1.5, color: t.c.muted }}>
                        <span style={{ color: t.c.bad, fontWeight: 800, fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>✗</span>{r}
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "60px 24px" }} className="b24-section-mobile-tight">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 99, background: t.c.accentSoft, fontSize: 12, color: t.c.accent, fontWeight: 700, letterSpacing: ".15em", marginBottom: 14 }}>{$("landing.faq.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{$("landing.faq.heading")}</h2>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {faqs.map((f, i) => (
                <div key={i} style={{ ...t.card, padding: 0, overflow: "hidden", border: openFaq === i ? `1.5px solid ${BRAND.mint}` : `1px solid ${t.c.border}`, transition: "border .2s" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ width: "100%", padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, fontFamily: "inherit", color: t.c.text }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{f.q}</span>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: openFaq === i ? BRAND.mint : t.c.surface2, color: openFaq === i ? t.c.dark : t.c.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, transition: "all .2s", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                      <div style={{ padding: "0 22px 20px", color: t.c.muted, fontSize: 15, lineHeight: 1.65, animation: "b24fade .3s ease" }}>{f.a}</div>
                  )}
                </div>
            ))}
          </div>
        </section>

        {/* ========== CTA — final big push ========== */}
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
          <div className="b24-cta-pad" style={{ position: "relative", background: t.c.dark, borderRadius: 28, padding: "80px 50px", textAlign: "center", color: "#fff", overflow: "hidden" }}>
            {/* Animated background */}
            <div style={{ position: "absolute", top: "-50%", left: "20%", width: "60%", height: "200%", background: `radial-gradient(circle, ${BRAND.mint}33, transparent 60%)`, animation: "b24orbDrift 12s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "-50%", right: "10%", width: "50%", height: "150%", background: `radial-gradient(circle, ${BRAND.green}77, transparent 60%)`, animation: "b24orbDrift 15s ease-in-out infinite reverse" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${BRAND.mint}22 1.2px, transparent 1.2px)`, backgroundSize: "32px 32px", pointerEvents: "none", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)" }} />

            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🚀</div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                {$("landing.finalcta.heading")}<br/>{$("landing.finalcta.heading2").split(" ").slice(0, -1).join(" ")} <span style={{ color: BRAND.mint }}>{$("landing.finalcta.heading2").split(" ").slice(-1)}</span>
              </h2>
              <p style={{ fontSize: 17, color: "#A8B2BC", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.55 }}>{$("landing.finalcta.subtitle")}</p>
              <button className="b24-btn b24-btn-accent" onClick={onStart} style={{ padding: "18px 40px", fontSize: 16, position: "relative", boxShadow: `0 20px 50px ${BRAND.mint}55` }}>
                {$("landing.cta.start")}
              </button>
              <div style={{ marginTop: 20, fontSize: 12, color: "#5B6470", letterSpacing: ".08em" }}>{$("landing.finalcta.alreadyHave")} <a onClick={onStart} style={{ color: BRAND.mint, cursor: "pointer", textDecoration: "underline" }}>{$("landing.finalcta.loginLink")}</a></div>
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer style={{ background: t.c.dark, color: "#fff", padding: "60px 24px 30px", borderTop: `1px solid rgba(255,255,255,.05)` }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div className="b24-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 40, marginBottom: 36 }}>
              <div>
                <MachTechWordmark height={30} variant="light" />
                <p style={{ color: "#8B95A0", fontSize: 13.5, marginTop: 20, maxWidth: 340, lineHeight: 1.6 }}>
                  {$("footer.about")}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  {[["📘", "Facebook"], ["📸", "Instagram"], ["💼", "LinkedIn"], ["📺", "YouTube"]].map(([ic, name]) => (
                      <a key={name} title={name} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{ic}</a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: BRAND.mint, fontWeight: 700, letterSpacing: ".15em", marginBottom: 16 }}>{$("footer.contact")}</div>
                <div style={{ fontSize: 13.5, color: "#C8D0D8", display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="tel:+37455903390" style={{ color: "#C8D0D8" }}>📞 +374 55 90 33 90</a>
                  <a href="mailto:info@machtech.am" style={{ color: "#C8D0D8" }}>✉️ info@machtech.am</a>
                  <a href="https://machtech.am" style={{ color: "#C8D0D8" }}>🌐 machtech.am</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: BRAND.mint, fontWeight: 700, letterSpacing: ".15em", marginBottom: 16 }}>{$("footer.office")}</div>
                <div style={{ fontSize: 13.5, color: "#C8D0D8", lineHeight: 1.7 }}>
                  📍 {$("footer.address").split("\n").map((ln, i) => <React.Fragment key={i}>{i > 0 && <br/>}{ln}</React.Fragment>)}<br />
                  <span style={{ fontSize: 12, color: "#5B6470" }}>{$("footer.hours")}</span>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#5B6470" }}>
              <div>{$("footer.copyright").replace("{year}", new Date().getFullYear())}</div>
              <div style={{ letterSpacing: ".18em", fontWeight: 600 }}>{$("footer.brand")}</div>
            </div>
          </div>
        </footer>
      </div>
  );
}

/* ----------------------------- AUTH (simplified) ----------------------------- */
/* Demo data generator — ստեղծում է 2 մուտք գործելու դիմորդ + admin-ի կողմը լցնող թեկնածուներ */
// API-based Auth (register/login against the server)
function Auth({ t, showToast, onAuthed }) {
  const [mode, setMode] = useState("register");
  const [f, setF] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const doRegister = async () => {
    if (!f.fullName || !f.phone || !f.email || !f.password) return showToast("Լրացրու բոլոր դաշտերը");
    setBusy(true);
    try {
      const res = await api.register({ full_name: f.fullName, phone: f.phone, email: f.email, password: f.password });
      showToast("Գրանցումը հաջողվեց ✓");
      onAuthed(res.user);
    } catch (e) { showToast(e.message || "Սխալ"); } finally { setBusy(false); }
  };
  const doLogin = async () => {
    if (!f.email || !f.password) return showToast("Լրացրու դաշտերը");
    setBusy(true);
    try {
      const res = await api.login({ email: f.email, password: f.password });
      onAuthed(res.user);
    } catch (e) { showToast(e.message || "Սխալ email կամ գաղտնաբառ"); } finally { setBusy(false); }
  };

  return (
      <div className="b24-fade" style={{ maxWidth: 460, margin: "40px auto 0" }}>
        <div style={{ display: "flex", gap: 6, padding: 5, background: t.c.surface2, borderRadius: 13, marginBottom: 22 }}>
          {[["register", "Գրանցում"], ["login", "Մուտք"]].map(([k, l]) => (
              <button key={k} onClick={() => setMode(k)} className="b24-btn" style={{ flex: 1, padding: 10, background: mode === k ? t.c.surface : "transparent", color: t.c.text }}>{l}</button>
          ))}
        </div>
        <div style={t.card}>
          {mode === "register" ? (
              <div style={{ display: "grid", gap: 12 }}>
                <Field t={t} label="Անուն Ազգանուն" value={f.fullName} onChange={set("fullName")} />
                <Field t={t} label="Հեռախոսահամար" value={f.phone} onChange={set("phone")} placeholder="+374 ..." />
                <Field t={t} label="Email (որով կուղարկվի CV-ն)" type="email" value={f.email} onChange={set("email")} />
                <Field t={t} label="Գաղտնաբառ" type="password" value={f.password} onChange={set("password")} />
                <button className="b24-btn b24-btn-primary" onClick={doRegister} disabled={busy} style={{ marginTop: 6, opacity: busy ? .6 : 1 }}>{busy ? "..." : "Գրանցվել"}</button>
              </div>
          ) : (
              <div style={{ display: "grid", gap: 12 }}>
                <Field t={t} label="Email" value={f.email} onChange={set("email")} placeholder="email" />
                <Field t={t} label="Գաղտնաբառ" type="password" value={f.password} onChange={set("password")} />
                <button className="b24-btn b24-btn-primary" onClick={doLogin} disabled={busy} style={{ marginTop: 6, opacity: busy ? .6 : 1 }}>{busy ? "..." : "Մուտք գործել"}</button>
                <div style={{ fontSize: 12.5, color: t.c.muted, textAlign: "center" }}>Admin՝ seed-ով ստեղծված հաշիվը</div>
              </div>
          )}
        </div>
      </div>
  );
}

function Field({ t, label, type = "text", value, onChange, placeholder }) {
  return <label style={{ display: "block" }}><span style={{ fontSize: 13, color: t.c.muted, display: "block", marginBottom: 5 }}>{label}</span><input className="b24-input" type={type} value={value} onChange={onChange} placeholder={placeholder} /></label>;
}

function VideoEmbed({ url, caption, t }) {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,15})/);
  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  // Loom
  const lm = url.match(/loom\.com\/share\/([a-f0-9]{20,})/);
  let embedUrl = null;
  if (yt) embedUrl = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  else if (vm) embedUrl = `https://player.vimeo.com/video/${vm[1]}`;
  else if (lm) embedUrl = `https://www.loom.com/embed/${lm[1]}`;

  if (!embedUrl) {
    // Direct video file
    if (/\.(mp4|webm|mov)$/i.test(url)) {
      return (
          <figure style={{ margin: "16px 0" }}>
            <video controls style={{ width: "100%", borderRadius: 12, display: "block", background: "#000" }}><source src={url} /></video>
            {caption && <figcaption style={{ fontSize: 13, color: t.c.muted, marginTop: 6, textAlign: "center" }}>{caption}</figcaption>}
          </figure>
      );
    }
    return <div style={{ background: t.c.surface2, padding: 14, borderRadius: 10, fontSize: 13, color: t.c.muted, margin: "14px 0" }}>⚠️ Վիդեո URL-ը չհաջողվեց ճանաչել։ Աջակցվում են՝ YouTube, Vimeo, Loom, ուղիղ mp4/webm։ <a href={url} target="_blank" rel="noopener noreferrer">Բացել արտաքին</a></div>;
  }

  return (
      <figure style={{ margin: "16px 0" }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <iframe src={embedUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={caption || "Video"} />
        </div>
        {caption && <figcaption style={{ fontSize: 13, color: t.c.muted, marginTop: 6, textAlign: "center" }}>{caption}</figcaption>}
      </figure>
  );
}


/* ----------------------------- CATALOG (multi-course list for user) ----------------------------- */
function Catalog({ t, user, email, content, accessibleCourses, enrollUser, onOpenCourse }) {
  const enrolledIds = Object.keys(user.enrollments || {});
  const allCoursesById = content.courses;

  // Build sections
  const enrolled = enrolledIds.map((id) => allCoursesById[id]).filter(Boolean);
  const available = accessibleCourses.filter((c) => !enrolledIds.includes(c.id));
  const lockedRestricted = Object.values(allCoursesById).filter((c) => c.status === "published" && c.accessMode === "restricted" && !(user.accessGrants || []).includes(c.id));

  const enrollAndOpen = async (cid) => { await enrollUser(email, cid); onOpenCourse(cid); };

  return (
      <div className="b24-fade" style={{ paddingTop: 28 }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Բարի գալուստ, {user.fullName?.split(" ")[0]} 👋</h2>
          <p style={{ color: t.c.muted, marginTop: 0, fontSize: 15 }}>Ընտրիր դասընթաց ու սկսիր սովորել։</p>
        </div>

        {enrolled.length > 0 && (
            <Section2 t={t} title="📚 Իմ դասընթացները" subtitle="Ընթացքի մեջ կամ ավարտված">
              <CourseGrid t={t} courses={enrolled} user={user} onClick={(cid) => onOpenCourse(cid)} ctaLabel="Շարունակել" />
            </Section2>
        )}

        {available.length > 0 && (
            <Section2 t={t} title="✨ Հասանելի դասընթացներ" subtitle="Կարող ես գրանցվել անվճար">
              <CourseGrid t={t} courses={available} user={user} onClick={enrollAndOpen} ctaLabel="Սկսել →" />
            </Section2>
        )}

        {lockedRestricted.length > 0 && (
            <Section2 t={t} title="🔒 Փակ դասընթացներ" subtitle="Կպահանջի հրավեր MachTech-ի կողմից">
              <CourseGrid t={t} courses={lockedRestricted} user={user} locked />
            </Section2>
        )}

        {enrolled.length === 0 && available.length === 0 && lockedRestricted.length === 0 && (
            <div style={{ ...t.card, textAlign: "center", padding: 50, color: t.c.muted }}>Դեռ չկան հասանելի դասընթացներ։ Կպահանջի admin-ի ակտիվացում։</div>
        )}
      </div>
  );
}

function Section2({ t, title, subtitle, children }) {
  return (
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <div style={{ fontSize: 13.5, color: t.c.muted }}>{subtitle}</div>}
        </div>
        {children}
      </div>
  );
}

function CourseGrid({ t, courses, user, onClick, ctaLabel, locked }) {
  return (
      <div className="b24-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {courses.map((c) => {
          const enroll = user.enrollments?.[c.id];
          const done = enroll ? c.modules.filter((m) => enroll.progress?.[m.id]).length : 0;
          const total = c.modules.length;
          const pct = total ? Math.round(((done + (enroll?.final ? 1 : 0)) / (total + 1)) * 100) : 0;
          const totalMin = c.modules.reduce((s, m) => s + (parseInt(m.duration) || 20), 0);
          return (
              <div key={c.id} className={locked ? "" : "b24-card-hover"} style={{ ...t.card, padding: 22, cursor: locked ? "default" : "pointer", opacity: locked ? .6 : 1, position: "relative", overflow: "hidden" }} onClick={() => !locked && onClick && onClick(c.id)}>
                {/* Top accent stripe */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.mint})` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.icon || "📘"}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: t.c.muted, background: t.c.surface2, padding: "3px 8px", borderRadius: 5 }}>{c.level?.toUpperCase()}</span>
                    {c.modules.length === 0 && <span style={{ fontSize: 10, color: t.c.warn }}>Շուտով</span>}
                  </div>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{c.title}</h4>
                <p style={{ fontSize: 13.5, color: t.c.muted, margin: "0 0 14px", lineHeight: 1.5, minHeight: 40 }}>{c.description}</p>

                <div style={{ display: "flex", gap: 14, fontSize: 12, color: t.c.muted, marginBottom: 14 }}>
                  <span>📂 {c.modules.length} մոդուլ</span>
                  <span>⏱ ~{Math.round(totalMin / 60) || "?"}ժ</span>
                </div>

                {enroll && total > 0 && (<div style={{ marginBottom: 12 }}>
                  <ProgressBar t={t} pct={pct} />
                  <div style={{ fontSize: 12, color: t.c.muted, marginTop: 6, display: "flex", justifyContent: "space-between" }}><span>{done}/{total} մոդուլ</span><span>{pct}%</span></div>
                </div>)}

                {!locked && ctaLabel && (
                    <button className="b24-btn b24-btn-primary" style={{ width: "100%", marginTop: 4 }}>{ctaLabel}</button>
                )}
                {locked && <div style={{ marginTop: 6, padding: 10, background: t.c.surface2, borderRadius: 8, fontSize: 12.5, color: t.c.muted, textAlign: "center" }}>🔒 Հասանելի է միայն հրավերով</div>}
              </div>
          );
        })}
      </div>
  );
}

/* ----------------------------- DASHBOARD (in-course) ----------------------------- */
function Dashboard({ t, user, email, course, enrollment, onOpenModule, onOpenFinal, onOpenCert, onBackToCatalog }) {
  const modules = course.modules;
  const done = modules.filter((m) => enrollment.progress?.[m.id]).length;
  const totalSteps = modules.length + 1;
  const pct = totalSteps > 1 ? Math.round(((done + (enrollment.final ? 1 : 0)) / totalSteps) * 100) : 0;
  const allDone = modules.length > 0 && done === modules.length;
  const cat = enrollment.final ? scoreCategory(enrollment.final.pct) : null;
  const remainMin = modules.filter((m) => !enrollment.progress?.[m.id]).reduce((s, m) => s + (parseInt(m.duration) || 20), 0);

  return (
      <div className="b24-fade" style={{ paddingTop: 24 }}>
        <button className="b24-btn b24-btn-ghost" onClick={onBackToCatalog} style={{ marginBottom: 16 }}>← Բոլոր դասընթացները</button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{course.icon || "📘"}</div>
          <div>
            <div style={{ fontSize: 11, color: t.c.muted, letterSpacing: ".08em", fontWeight: 600 }}>{course.level?.toUpperCase()} • COURSE</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: "2px 0 0", letterSpacing: "-0.02em" }}>{course.title}</h2>
          </div>
        </div>
        <p style={{ color: t.c.muted, marginTop: 6, marginBottom: 22, fontSize: 14.5 }}>{course.description}</p>

        {modules.length === 0 ? (
            <div style={{ ...t.card, textAlign: "center", padding: 50, color: t.c.muted }}>Այս դասընթացի բովանդակությունը դեռ պատրաստվում է։</div>
        ) : (<>
          <div style={{ ...t.card, marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>Քո առաջընթացը</span><span style={{ color: t.c.accent, fontWeight: 700 }}>{pct}%</span>
            </div>
            <ProgressBar t={t} pct={pct} />
            <div style={{ fontSize: 13, color: t.c.muted, marginTop: 8, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <span>{done}/{modules.length} մոդուլ{enrollment.final ? " • Final ✓" : ""}</span>
              <span>⏱️ Մնացել է ~{remainMin} րոպե</span>
            </div>
          </div>

          {enrollment.final && cat && (
              <div style={{ ...t.card, marginBottom: 22, borderLeft: `4px solid ${cat.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <div><div style={{ fontSize: 13, color: t.c.muted }}>Քո վերջնական արդյունքը</div><div style={{ fontSize: 22, fontWeight: 800, color: cat.color }}>{enrollment.final.pct}% — {cat.label}</div></div>
                  {enrollment.final.pct > 70 && <button className="b24-btn b24-btn-primary" onClick={onOpenCert}>🎓 Վկայական</button>}
                </div>
              </div>
          )}

          <div className="b24-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {modules.map((m, i) => {
              const completed = enrollment.progress?.[m.id];
              const qs = enrollment.quizScores?.[m.id];
              const locked = enrollment.quizLocked?.[m.id];
              return (
                  <div key={m.id} className="b24-card-hover" onClick={() => onOpenModule(i)} style={{ ...t.card, cursor: "pointer", padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: completed ? t.c.good : t.c.surface2, color: completed ? "#fff" : t.c.muted, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{completed ? "✓" : m.n}</div>
                      <span style={{ fontSize: 12, color: t.c.muted }}>{m.duration}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 12 }}>{m.title}</div>
                    <div style={{ fontSize: 13.5, color: t.c.muted, marginTop: 5 }}>{m.desc}</div>
                    {qs != null && <div style={{ fontSize: 12.5, color: t.c.good, marginTop: 8 }}>Quiz՝ {qs}% {locked ? "🔒" : ""}</div>}
                  </div>
              );
            })}
          </div>

          {course.final && (course.final.theory.length > 0 || course.final.logic.length > 0 || course.final.practical.length > 0) && (
              <div style={{ ...t.card, marginTop: 22, textAlign: "center", background: allDone ? t.c.accentSoft : t.c.surface2, border: `1px solid ${allDone ? t.c.accent : t.c.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>🏁 Եզրափակիչ թեստ</div>
                <div style={{ fontSize: 14, color: t.c.muted, marginBottom: 14 }}>{allDone ? (enrollment.final ? "Թեստն արդեն հանձնված է (մեկ անգամ)։" : "Բոլոր մոդուլներն ավարտված են։ Պատրաստ ես։") : `Ավարտիր բոլոր մոդուլները (${done}/${modules.length})։`}</div>
                <button className="b24-btn b24-btn-primary" disabled={!allDone || enrollment.final} onClick={onOpenFinal} style={{ opacity: allDone && !enrollment.final ? 1 : .4, cursor: allDone && !enrollment.final ? "pointer" : "not-allowed" }}>
                  {enrollment.final ? "Հանձնված է ✓" : "Սկսել եզրափակիչ թեստը"}
                </button>
              </div>
          )}
        </>)}
      </div>
  );
}
function ProgressBar({ t, pct }) {
  return <div style={{ height: 8, background: t.c.surface2, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.mint})`, borderRadius: 99, transition: "width .5s" }} /></div>;
}

/* ----------------------------- MODULE VIEW (single-attempt quiz) ----------------------------- */
function ModuleView({ t, idx, enrollment, email, courseId, modules, updateEnrollment, showToast, onBack, onNext, onOpenFinal }) {
  const m = modules[idx];
  const alreadyLocked = !!enrollment.quizLocked?.[m?.id];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(alreadyLocked);
  const [practiceText, setPracticeText] = useState(enrollment.practice?.text || "");
  if (!m) return null;

  const isLast = idx >= modules.length - 1;
  const nextTitle = isLast ? null : modules[idx + 1]?.title;
  const goNext = () => onNext(idx + 1);

  useEffect(() => {
    setAnswers({});
    setSubmitted(!!enrollment.quizLocked?.[m?.id]);
    setPracticeText(enrollment.practice?.text || "");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const submitQuiz = () => {
    if (alreadyLocked) return;
    if (m.quiz.some((q, i) => !isAnswered(q, answers[i]))) return showToast("Պատասխանիր բոլոր հարցերին");
    let correct = 0; m.quiz.forEach((q, i) => { if (isAnswerCorrect(q, answers[i])) correct++; });
    const pct = Math.round((correct / m.quiz.length) * 100);
    setSubmitted(true);
    updateEnrollment(email, courseId, (e) => ({ ...e, quizScores: { ...e.quizScores, [m.id]: pct }, quizLocked: { ...e.quizLocked, [m.id]: true }, progress: { ...e.progress, [m.id]: true } }));
    showToast(`Quiz ավարտված՝ ${pct}% (մեկ անգամ) ✓`);
  };
  const submitPractice = () => {
    if (practiceText.trim().length < 40) return showToast("Գրիր ավելի մանրամասն (նվազ. 40 նիշ)");
    updateEnrollment(email, courseId, (e) => ({ ...e, practice: { text: practiceText, at: Date.now(), score: null, feedback: "" }, progress: { ...e.progress, [m.id]: true } }));
    showToast("Պատասխանը պահպանված է ✓ (admin-ը կգնահատի)");
    goNext();
  };

  const NextBlock = () => (
      <div style={{ ...t.card, marginTop: 16, textAlign: "center", background: t.c.accentSoft, border: `1px solid ${t.c.accent}` }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{isLast ? "🎉 Սա վերջին մոդուլն էր" : "✓ Մոդուլն ավարտված է"}</div>
        <div style={{ fontSize: 13.5, color: t.c.muted, marginBottom: 14 }}>{isLast ? "Բոլոր մոդուլներն անցել ես։ Կարող ես անցնել եզրափակիչ թեստին։" : `Հաջորդը՝ ${nextTitle}`}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="b24-btn b24-btn-ghost" onClick={onBack}>Dashboard</button>
          {isLast
              ? <button className="b24-btn b24-btn-primary" onClick={() => onOpenFinal()}>🏁 Եզրափակիչ թեստ →</button>
              : <button className="b24-btn b24-btn-primary" onClick={goNext}>Հաջորդ մոդուլ →</button>}
        </div>
      </div>
  );

  // Local alias so the existing JSX (user.X) continues to work without massive refactor
  const user = enrollment;

  // Block-based content renderer (for new flexible module structure)
  const renderBlock = (b, i) => {
    switch (b.type) {
      case "heading":
        return <h3 key={i} style={{ fontSize: b.level === 2 ? 24 : 19, fontWeight: 700, marginTop: i > 0 ? 22 : 0, marginBottom: 10, letterSpacing: "-0.01em" }}>{b.text}</h3>;
      case "text":
        return <p key={i} style={{ fontSize: 15.5, lineHeight: 1.7, margin: "0 0 14px", whiteSpace: "pre-wrap" }}>{b.text}</p>;
      case "video":
        return <VideoEmbed key={i} url={b.url} caption={b.caption} t={t} />;
      case "image":
        return (
            <figure key={i} style={{ margin: "16px 0" }}>
              <img src={b.url} alt={b.caption || ""} style={{ width: "100%", borderRadius: 12, display: "block", border: `1px solid ${t.c.border}` }} />
              {b.caption && <figcaption style={{ fontSize: 13, color: t.c.muted, marginTop: 6, textAlign: "center" }}>{b.caption}</figcaption>}
            </figure>
        );
      case "callout":
        const cVar = b.variant || "info";
        const cStyle = { info: { bg: t.c.accentSoft, br: t.c.accent, ic: "💡" }, warn: { bg: "#FFF6E0", br: t.c.warn, ic: "⚠️" }, success: { bg: "#E8F7EF", br: t.c.good, ic: "✓" }, danger: { bg: "#FBE8E8", br: t.c.bad, ic: "⛔" } }[cVar] || {};
        return (
            <div key={i} style={{ background: cStyle.bg, borderLeft: `4px solid ${cStyle.br}`, padding: "14px 16px", borderRadius: 8, margin: "14px 0", fontSize: 14.5, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{cStyle.ic} {b.title || (cVar === "warn" ? "Ուշադրություն" : cVar === "success" ? "Կարևոր" : cVar === "danger" ? "Զգուշացում" : "Նշում")}</div>
              <div style={{ color: t.c.text, whiteSpace: "pre-wrap" }}>{b.text}</div>
            </div>
        );
      case "list":
        return (
            <ul key={i} style={{ paddingLeft: 22, margin: "12px 0", lineHeight: 1.7 }}>
              {(b.items || []).map((it, j) => <li key={j} style={{ marginBottom: 6, fontSize: 15 }}>{it}</li>)}
            </ul>
        );
      case "quote":
        return (
            <blockquote key={i} style={{ borderLeft: `3px solid ${BRAND.mint}`, paddingLeft: 16, margin: "16px 0", fontStyle: "italic", color: t.c.muted, fontSize: 16, lineHeight: 1.6 }}>
              "{b.text}"
              {b.author && <div style={{ fontSize: 13, marginTop: 8, fontStyle: "normal", color: t.c.text, fontWeight: 600 }}>— {b.author}</div>}
            </blockquote>
        );
      case "code":
        return (
            <pre key={i} style={{ background: t.c.dark, color: "#E6E9EC", padding: 16, borderRadius: 10, overflowX: "auto", fontSize: 13.5, lineHeight: 1.6, margin: "14px 0" }}><code style={{ background: "transparent", padding: 0, color: "inherit", fontSize: "inherit" }}>{b.text}</code></pre>
        );
      case "file":
        return (
            <a key={i} href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, background: t.c.surface2, border: `1px solid ${t.c.border}`, borderRadius: 10, padding: "12px 16px", margin: "12px 0", textDecoration: "none", color: t.c.text }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📎</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.label || "Ֆայլ"}</div>
                <div style={{ fontSize: 12, color: t.c.muted }}>{b.size || "Ներբեռնել"}</div>
              </div>
              <span style={{ color: t.c.accent, fontSize: 13, fontWeight: 600 }}>↓</span>
            </a>
        );
      case "divider":
        return <hr key={i} style={{ border: "none", borderTop: `1px solid ${t.c.border}`, margin: "20px 0" }} />;
      case "embed":
        return <div key={i} style={{ margin: "14px 0" }} dangerouslySetInnerHTML={{ __html: b.html || "" }} />;
      default: return null;
    }
  };

  return (
      <div className="b24-fade" style={{ paddingTop: 24, maxWidth: 760, margin: "0 auto" }}>
        <button className="b24-btn b24-btn-ghost" onClick={onBack} style={{ marginBottom: 18 }}>← Վերադառնալ</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: t.c.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{m.n}</div>
          <span style={{ fontSize: 13, color: t.c.muted }}>{m.duration}</span>
        </div>
        <h2 style={{ fontFamily: "'Montserrat Arm', 'Montserrat', sans-serif", fontSize: 30, margin: "8px 0 6px" }}>{m.title}</h2>
        <p style={{ color: t.c.muted, marginTop: 0, fontSize: 15.5 }}>{m.desc}</p>

        <div style={{ ...t.card, marginTop: 18 }}>
          {m.blocks && m.blocks.length > 0 ? (
              // NEW block-based content
              m.blocks.map((b, i) => renderBlock(b, i))
          ) : (
              // LEGACY flat content (preserved for backward compatibility)
              m.lesson?.map((p, i) => <p key={i} style={{ margin: i === 0 ? "0 0 14px" : "14px 0", fontSize: 15.5 }}>{p}</p>)
          )}
        </div>

        {m.scenario && <div style={{ ...t.card, marginTop: 16, background: t.c.accentSoft, border: `1px solid ${t.c.accent}` }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>📋 Սցենար</div><p style={{ margin: 0, fontSize: 15 }}>{m.scenario}</p>
          {m.tasks && <ul style={{ marginTop: 12, paddingLeft: 20 }}>{m.tasks.map((tk, i) => <li key={i} style={{ marginBottom: 6, fontSize: 14.5 }}>{tk}</li>)}</ul>}
        </div>}
        {m.examples && <Section t={t} title="💡 Իրական օրինակներ">{m.examples.map((e, i) => <li key={i} style={{ marginBottom: 8, fontSize: 14.5 }}>{e}</li>)}</Section>}
        {m.notes && <div style={{ ...t.card, marginTop: 16, borderLeft: `4px solid ${t.c.warn}` }}><div style={{ fontWeight: 700, marginBottom: 8 }}>⚠️ Կարևոր նշումներ</div>{m.notes.map((n, i) => <p key={i} style={{ margin: "0 0 8px", fontSize: 14.5, color: t.c.muted }}>{n}</p>)}</div>}
        {m.miniTask && <div style={{ ...t.card, marginTop: 16 }}><div style={{ fontWeight: 700, marginBottom: 8 }}>🧠 Mini task</div><p style={{ margin: 0, fontSize: 14.5 }}>{m.miniTask}</p></div>}
        {m.practical && <div style={{ ...t.card, marginTop: 16 }}><div style={{ fontWeight: 700, marginBottom: 8 }}>✍️ Գործնական վարժություն</div><p style={{ margin: 0, fontSize: 14.5 }}>{m.practical}</p></div>}
        {m.selfAssessment && <Section t={t} title="🪞 Ինքնագնահատում">{m.selfAssessment.map((s, i) => <li key={i} style={{ marginBottom: 8, fontSize: 14.5 }}>{s}</li>)}</Section>}

        {m.isPractice && <div style={{ ...t.card, marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>📝 Քո պատասխանը</div>
          <textarea className="b24-input" rows={8} value={practiceText} onChange={(e) => setPracticeText(e.target.value)} placeholder="Մանրամասն պատասխանիր 4 կետերին..." style={{ resize: "vertical", lineHeight: 1.6 }} />
          {user.practice?.score != null && <div style={{ marginTop: 12, background: t.c.surface2, padding: 12, borderRadius: 10 }}><div style={{ fontWeight: 700, color: scoreCategory(user.practice.score).color }}>Admin գնահատական՝ {user.practice.score}/100</div>{user.practice.feedback && <div style={{ fontSize: 14, color: t.c.muted, marginTop: 4 }}>{user.practice.feedback}</div>}</div>}
          <button className="b24-btn b24-btn-primary" onClick={submitPractice} style={{ marginTop: 12 }}>{user.practice ? "Թարմացնել և շարունակել →" : "Պահպանել և շարունակել →"}</button>
        </div>}
        {m.isPractice && user.practice && <NextBlock />}

        {m.exercise && <div style={{ ...t.card, marginTop: 16, background: t.c.surface2 }}><div style={{ fontWeight: 700, marginBottom: 6 }}>🤔 Մտածողական վարժություն</div><p style={{ margin: 0, fontSize: 14.5 }}>{m.exercise}</p></div>}

        {m.quiz && <div style={{ ...t.card, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>📊 Quiz ({m.quiz.length} հարց)</div>
            {alreadyLocked && <span style={{ fontSize: 12.5, color: t.c.warn }}>🔒 Հանձնված է մեկ անգամ</span>}
          </div>
          {alreadyLocked ? (
              <div style={{ textAlign: "center", padding: 16 }}><div style={{ fontSize: 30, fontWeight: 800, color: t.c.good }}>{user.quizScores[m.id]}%</div><div style={{ color: t.c.muted, fontSize: 14 }}>Quiz-ն արդեն հանձնված է և չի կարող կրկնվել։</div></div>
          ) : (<>
            {m.quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 22, paddingBottom: 18, borderBottom: qi === m.quiz.length - 1 ? "none" : `1px dashed ${t.c.border}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <span style={{ background: t.c.dark, color: BRAND.mint, width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{qi + 1}</span>
                    <div style={{ fontWeight: 600, fontSize: 14.5, flex: 1, lineHeight: 1.5 }}>{q.q}</div>
                  </div>
                  <QuestionRenderer t={t} q={q} answer={answers[qi]} setAnswer={(v) => setAnswers({ ...answers, [qi]: v })} submitted={submitted} />
                </div>
            ))}
            {!submitted ? <button className="b24-btn b24-btn-primary" onClick={submitQuiz} style={{ width: "100%", marginTop: 6 }}>Հանձնել (մեկ անգամ)</button>
                : <div style={{ textAlign: "center", color: t.c.good, fontWeight: 700, marginTop: 6 }}>✓ Ավարտված՝ {user.quizScores?.[m.id]}%</div>}
          </>)}
        </div>}

        {/* Հաջորդ մոդուլ՝ quiz-ն ավարտված/կողպված լինելու դեպքում */}
        {m.quiz && (submitted || alreadyLocked) && <NextBlock />}

        {!m.quiz && !m.isPractice && (
            user.progress?.[m.id]
                ? <NextBlock />
                : <button className="b24-btn b24-btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={() => { updateEnrollment(email, courseId, (e) => ({ ...e, progress: { ...e.progress, [m.id]: true } })); showToast("Ավարտված ✓"); goNext(); }}>{isLast ? "Ավարտել ✓" : "Ավարտել և անցնել հաջորդին →"}</button>
        )}
      </div>
  );
}
function Section({ t, title, children }) {
  return <div style={{ ...t.card, marginTop: 16 }}><div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div><ul style={{ margin: 0, paddingLeft: 20 }}>{children}</ul></div>;
}

/* ============== USER-SIDE QUESTION RENDERER (all 4 types) ============== */
function QuestionRenderer({ t, q, answer, setAnswer, submitted }) {
  const tp = qType(q);
  const correctFinal = submitted ? isAnswerCorrect(q, answer) : null;

  if (tp === "single") {
    return (
        <div style={{ display: "grid", gap: 7 }}>
          {q.a.map((opt, oi) => {
            const chosen = answer === oi;
            const isCorrect = submitted && oi === q.correct;
            const isWrong = submitted && chosen && oi !== q.correct;
            return (
                <button key={oi} className="b24-btn" onClick={() => !submitted && setAnswer(oi)}
                        style={{ textAlign: "left", padding: "11px 14px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 10,
                          background: isCorrect ? t.c.good + "22" : isWrong ? t.c.bad + "22" : chosen ? t.c.accentSoft : t.c.surface2,
                          color: t.c.text, border: `1.5px solid ${isCorrect ? t.c.good : isWrong ? t.c.bad : chosen ? t.c.accent : t.c.border}`,
                          cursor: submitted ? "default" : "pointer" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${isCorrect ? t.c.good : isWrong ? t.c.bad : chosen ? t.c.accent : t.c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {chosen && <span style={{ width: 8, height: 8, borderRadius: "50%", background: isCorrect ? t.c.good : isWrong ? t.c.bad : t.c.accent }} />}
              </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {isCorrect && <span style={{ color: t.c.good, fontWeight: 700, fontSize: 16 }}>✓</span>}
                  {isWrong && <span style={{ color: t.c.bad, fontWeight: 700, fontSize: 16 }}>✗</span>}
                </button>
            );
          })}
        </div>
    );
  }

  if (tp === "multiple") {
    const arr = Array.isArray(answer) ? answer : [];
    const toggle = (oi) => {
      if (submitted) return;
      setAnswer(arr.includes(oi) ? arr.filter(x => x !== oi) : [...arr, oi]);
    };
    const correctArr = Array.isArray(q.correct) ? q.correct : [];
    return (<>
      <div style={{ fontSize: 12, color: t.c.muted, marginBottom: 8, fontStyle: "italic" }}>☑ Կարող ես ընտրել մի քանի տարբերակ</div>
      <div style={{ display: "grid", gap: 7 }}>
        {q.a.map((opt, oi) => {
          const chosen = arr.includes(oi);
          const isCorrectOpt = correctArr.includes(oi);
          const showCorrect = submitted && isCorrectOpt;
          const showWrong = submitted && chosen && !isCorrectOpt;
          const showMissed = submitted && !chosen && isCorrectOpt;
          return (
              <button key={oi} className="b24-btn" onClick={() => toggle(oi)}
                      style={{ textAlign: "left", padding: "11px 14px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 10,
                        background: showCorrect ? t.c.good + "22" : showWrong ? t.c.bad + "22" : showMissed ? t.c.warn + "1a" : chosen ? t.c.accentSoft : t.c.surface2,
                        color: t.c.text, border: `1.5px solid ${showCorrect ? t.c.good : showWrong ? t.c.bad : showMissed ? t.c.warn : chosen ? t.c.accent : t.c.border}`,
                        cursor: submitted ? "default" : "pointer" }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${showCorrect ? t.c.good : showWrong ? t.c.bad : showMissed ? t.c.warn : chosen ? t.c.accent : t.c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: chosen ? (showCorrect ? t.c.good : showWrong ? t.c.bad : t.c.accent) : "transparent" }}>
                {chosen && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {showCorrect && <span style={{ color: t.c.good, fontSize: 11, fontWeight: 700 }}>ՃԻՇՏ</span>}
                {showMissed && <span style={{ color: t.c.warn, fontSize: 11, fontWeight: 700 }}>բացակ.</span>}
              </button>
          );
        })}
      </div>
    </>);
  }

  if (tp === "text") {
    return (<>
      <input className="b24-input" type="text" value={answer || ""} onChange={(e) => !submitted && setAnswer(e.target.value)} placeholder="Քո պատասխանը..." disabled={submitted} style={{ borderColor: submitted ? (correctFinal ? t.c.good : t.c.bad) : t.c.border, fontSize: 15 }} />
      {submitted && (correctFinal
          ? <div style={{ marginTop: 8, padding: "8px 12px", background: t.c.good + "22", borderRadius: 7, fontSize: 13, color: t.c.good, fontWeight: 600 }}>✓ Ճիշտ պատասխան</div>
          : <div style={{ marginTop: 8, padding: "8px 12px", background: t.c.bad + "22", borderRadius: 7, fontSize: 13, color: t.c.bad }}>✗ Սխալ։ Ճիշտ պատասխանը՝ <b>{(q.accept || [])[0] || "—"}</b>{(q.accept || []).length > 1 && ` (կամ ${(q.accept || []).slice(1).join(", ")})`}</div>)}
    </>);
  }

  if (tp === "ordering") {
    // user's answer is array of items in their chosen order
    // initialize with shuffled items on first encounter
    const items = q.items || [];
    let userOrder = Array.isArray(answer) ? answer : null;
    if (!userOrder) {
      // deterministic shuffle based on question text (so it stays stable while user looks at it)
      const seed = (q.q || "").length;
      userOrder = [...items].sort((a, b) => {
        const ax = (a.charCodeAt(0) || 0) + seed;
        const bx = (b.charCodeAt(0) || 0) + seed * 2;
        return (ax * 31 % 7) - (bx * 31 % 7);
      });
      // if shuffle produced original order, swap first two
      if (userOrder.every((it, i) => it === items[i]) && userOrder.length >= 2) {
        [userOrder[0], userOrder[1]] = [userOrder[1], userOrder[0]];
      }
    }
    const move = (idx, dir) => {
      if (submitted) return;
      const j = idx + dir; if (j < 0 || j >= userOrder.length) return;
      const arr = [...userOrder]; [arr[idx], arr[j]] = [arr[j], arr[idx]];
      setAnswer(arr);
    };
    // Initialize on first render
    if (answer == null) {
      setTimeout(() => setAnswer(userOrder), 0);
    }
    return (<>
      <div style={{ fontSize: 12, color: t.c.muted, marginBottom: 8, fontStyle: "italic" }}>↕ Դասավորիր ճիշտ հերթականությամբ (օգտագործիր ↑↓ կոճակները)</div>
      <div style={{ display: "grid", gap: 6 }}>
        {userOrder.map((it, idx) => {
          const correctIdx = items.indexOf(it);
          const isAtRightPos = submitted && correctIdx === idx;
          const isAtWrongPos = submitted && correctIdx !== idx;
          return (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                background: isAtRightPos ? t.c.good + "22" : isAtWrongPos ? t.c.bad + "22" : t.c.surface2,
                border: `1.5px solid ${isAtRightPos ? t.c.good : isAtWrongPos ? t.c.bad : t.c.border}`
              }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{it}</span>
                {submitted ? (
                    isAtRightPos
                        ? <span style={{ color: t.c.good, fontWeight: 700, fontSize: 14 }}>✓</span>
                        : <span style={{ color: t.c.bad, fontSize: 11, fontWeight: 600 }}>→ դիրք {correctIdx + 1}</span>
                ) : (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ background: idx === 0 ? "transparent" : t.c.surface, border: `1px solid ${idx === 0 ? t.c.border : t.c.muted}`, borderRadius: 5, padding: "5px 10px", cursor: idx === 0 ? "not-allowed" : "pointer", color: idx === 0 ? t.c.border : t.c.text, fontSize: 13, flexShrink: 0 }}>↑</button>
                      <button onClick={() => move(idx, 1)} disabled={idx === userOrder.length - 1} style={{ background: idx === userOrder.length - 1 ? "transparent" : t.c.surface, border: `1px solid ${idx === userOrder.length - 1 ? t.c.border : t.c.muted}`, borderRadius: 5, padding: "5px 10px", cursor: idx === userOrder.length - 1 ? "not-allowed" : "pointer", color: idx === userOrder.length - 1 ? t.c.border : t.c.text, fontSize: 13, flexShrink: 0 }}>↓</button>
                    </div>
                )}
              </div>
          );
        })}
      </div>
    </>);
  }

  return null;
}


/* ----------------------------- FINAL TEST (single attempt, admin grades open Qs) ----------------------------- */
function FinalTest({ t, email, courseId, enrollment, finalDef, updateEnrollment, onDone, showToast }) {
  const TOTAL = 40 * 60;
  const [phase, setPhase] = useState("intro");
  const [theory, setTheory] = useState({});
  const [logic, setLogic] = useState({});
  const [practical, setPractical] = useState(finalDef.practical.map(() => ""));
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [result, setResult] = useState(null);
  const [warned, setWarned] = useState(false);

  useEffect(() => { if (phase !== "test") return; if (timeLeft <= 0) { finish(); return; } const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000); return () => clearTimeout(id); }, [phase, timeLeft]);
  useEffect(() => { if (phase !== "test") return; const onBlur = () => { if (!warned) { setWarned(true); showToast("⚠️ Մի լքիր թեստի էջը"); } }; window.addEventListener("blur", onBlur); return () => window.removeEventListener("blur", onBlur); }, [phase, warned]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0"), ss = String(timeLeft % 60).padStart(2, "0");

  const finish = () => {
    let tc = 0; finalDef.theory.forEach((q, i) => { if (isAnswerCorrect(q, theory[i])) tc++; });
    let lc = 0; finalDef.logic.forEach((q, i) => { if (isAnswerCorrect(q, logic[i])) lc++; });
    const theoryPct = finalDef.theory.length ? Math.round((tc / finalDef.theory.length) * 100) : 0;
    const logicPct = finalDef.logic.length ? Math.round((lc / finalDef.logic.length) * 100) : 0;
    const provisional = Math.round((theoryPct * 0.55 + logicPct * 0.45));
    const rec = { theoryPct, logicPct, practicalPct: null, practicalAnswers: practical, pct: provisional, objectivePct: provisional, at: Date.now(), durationSec: TOTAL - timeLeft, graded: false };
    updateEnrollment(email, courseId, { final: rec });
    setResult(rec); setPhase("result");
  };

  if (phase === "intro") return (
      <div className="b24-fade" style={{ maxWidth: 600, margin: "40px auto 0" }}>
        <div style={{ ...t.card, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏁</div>
          <h2 style={{ fontFamily: "'Montserrat Arm', 'Montserrat', sans-serif", margin: "0 0 10px" }}>Եզրափակիչ թեստ</h2>
          <p style={{ color: t.c.muted }}>3 մաս՝ տեսություն ({finalDef.theory.length}), տրամաբանություն ({finalDef.logic.length}), գործնական ({finalDef.practical.length} բաց հարց)։ <b style={{ color: t.c.accent }}>40 րոպե</b>։ Հանձնվում է <b>մեկ անգամ</b>։</p>
          <div style={{ background: t.c.surface2, borderRadius: 10, padding: 12, fontSize: 13.5, color: t.c.muted, margin: "14px 0", textAlign: "right" }}>⏱️ 40 րոպե • 🔒 Մեկ փորձ • ✍️ Բաց հարցերը գնահատում է admin-ը</div>
          <button className="b24-btn b24-btn-primary" onClick={() => setPhase("test")}>Սկսել թեստը</button>
          <div><button className="b24-btn b24-btn-ghost" onClick={onDone} style={{ marginTop: 10 }}>Չեղարկել</button></div>
        </div>
      </div>
  );

  if (phase === "result" && result) {
    const cat = scoreCategory(result.pct);
    return (
        <div className="b24-fade" style={{ maxWidth: 640, margin: "40px auto 0" }}>
          <div style={{ ...t.card, textAlign: "center", borderTop: `5px solid ${cat.color}` }}>
            <div style={{ fontSize: 13, color: t.c.muted }}>Նախնական արդյունք (օբյեկտիվ մաս)</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: cat.color, lineHeight: 1.1 }}>{result.pct}%</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{cat.label}</div>
            <p style={{ color: t.c.muted, maxWidth: 440, margin: "0 auto 18px", fontSize: 14 }}>Բաց հարցերը կգնահատի admin-ը, որից հետո վերջնական միավորը կարող է փոխվել։</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Տեսություն", result.theoryPct], ["Տրամաբանություն", result.logicPct]].map(([l, v]) => (
                  <div key={l} style={{ background: t.c.surface2, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: t.c.accent }}>{v}%</div><div style={{ fontSize: 12, color: t.c.muted }}>{l}</div></div>
              ))}
            </div>
            <button className="b24-btn b24-btn-primary" onClick={onDone}>Վերադառնալ dashboard</button>
          </div>
        </div>
    );
  }

  return (
      <div className="b24-fade" style={{ maxWidth: 760, margin: "20px auto 0" }}>
        <div style={{ position: "sticky", top: 60, zIndex: 30, background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontWeight: 700 }}>Եզրափակիչ թեստ</span>
          <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: timeLeft < 120 ? t.c.bad : t.c.accent }}>⏱ {mm}:{ss}</span>
        </div>
        <FinalBlock t={t} title={`Մաս 1 — Տեսություն (${finalDef.theory.length})`} questions={finalDef.theory} answers={theory} setAnswer={(i, v) => setTheory({ ...theory, [i]: v })} />
        <FinalBlock t={t} title={`Մաս 2 — Տրամաբանություն (${finalDef.logic.length})`} questions={finalDef.logic} answers={logic} setAnswer={(i, v) => setLogic({ ...logic, [i]: v })} />
        <div style={{ ...t.card, marginTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Մաս 3 — Գործնական ({finalDef.practical.length} բաց հարց)</div>
          {finalDef.practical.map((p, i) => (
              <div key={i} style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14.5 }}>{i + 1}. {p.q}</div>
                <textarea className="b24-input" rows={4} value={practical[i]} onChange={(e) => { const np = [...practical]; np[i] = e.target.value; setPractical(np); }} style={{ resize: "vertical" }} placeholder="Քո պատասխանը..." /></div>
          ))}
        </div>
        <button className="b24-btn b24-btn-primary" onClick={finish} style={{ width: "100%", marginTop: 18, padding: 15 }}>Ավարտել և ուղարկել (մեկ անգամ)</button>
      </div>
  );
}
function FinalBlock({ t, title, questions, answers, setAnswer }) {
  return (
      <div style={{ ...t.card, marginTop: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{title}</div>
        {questions.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: qi === questions.length - 1 ? "none" : `1px dashed ${t.c.border}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <span style={{ background: t.c.dark, color: BRAND.mint, width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{qi + 1}</span>
                <div style={{ fontWeight: 600, fontSize: 14.5, flex: 1, lineHeight: 1.5 }}>{q.q}</div>
              </div>
              <QuestionRenderer t={t} q={q} answer={answers[qi]} setAnswer={(v) => setAnswer(qi, v)} submitted={false} />
            </div>
        ))}
      </div>
  );
}

/* ----------------------------- CERTIFICATE ----------------------------- */
function Certificate({ t, user, enrollment, course, onBack }) {
  const date = new Date(enrollment.final.at).toLocaleDateString("hy-AM", { year: "numeric", month: "long", day: "numeric" });
  return (
      <div className="b24-fade" style={{ maxWidth: 760, margin: "30px auto 0" }}>
        <button className="b24-btn b24-btn-ghost" onClick={onBack} style={{ marginBottom: 18 }}>← Վերադառնալ</button>
        <div style={{ background: BRAND.dark, color: "#fff", borderRadius: 18, padding: "56px 48px", textAlign: "center", border: `1px solid ${BRAND.mint}33`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${BRAND.mint}33, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${BRAND.green}66, transparent 70%)` }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><MachTechWordmark height={26} variant="light" /></div>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 99, background: `${BRAND.mint}22`, border: `1px solid ${BRAND.mint}55`, fontSize: 11, letterSpacing: ".18em", color: BRAND.mint, fontWeight: 700, marginBottom: 18 }}>ACADEMY • CERTIFICATE</div>
            <div style={{ fontSize: 22, fontWeight: 600, margin: "6px 0 4px", opacity: .85 }}>{course.shortTitle || course.title}</div>
            <div style={{ fontSize: 13, opacity: .55, letterSpacing: ".08em" }}>{(course.level || "FOUNDATION").toUpperCase()} LEVEL</div>
            <div style={{ width: 50, height: 2, background: BRAND.mint, margin: "22px auto" }} />
            <div style={{ fontSize: 13, opacity: .7, marginBottom: 8 }}>Սույնով հաստատվում է, որ</div>
            <div style={{ fontFamily: "'Montserrat Arm', 'Montserrat', sans-serif", fontSize: 38, fontWeight: 800, margin: "8px 0", color: BRAND.mint, letterSpacing: "-0.02em" }}>{user.fullName}</div>
            <div style={{ fontSize: 14.5, opacity: .85, maxWidth: 480, margin: "10px auto 28px", lineHeight: 1.6 }}>հաջողությամբ ավարտել է MachTech Academy-ի «{course.title}» դասընթացը՝ <b style={{ color: "#fff" }}>{enrollment.final.pct}%</b> արդյունքով։</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: .55, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.1)", marginTop: 22 }}>
              <div>{date}</div>
              <div style={{ letterSpacing: ".15em" }}>MACHTECH.AM</div>
              <div>Cert #{(user.email || "").split("@")[0].toUpperCase()}-{String(enrollment.final.at).slice(-5)}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: t.c.muted }}>Տպելու համար՝ Ctrl/Cmd + P</div>
      </div>
  );
}

/* ----------------------------- ADMIN PANEL ----------------------------- */
function AdminPanel({ t, users, updateUser, content, persistContent, showToast }) {
  const [tab, setTab] = useState("candidates");
  const publishedCourses = Object.values(content.courses).filter(c => c.status === "published");
  const [selectedCourseId, setSelectedCourseId] = useState(publishedCourses[0]?.id || Object.keys(content.courses)[0]);
  const course = content.courses[selectedCourseId];

  return (
      <div className="b24-fade" style={{ paddingTop: 28 }}>
        <h2 style={{ fontFamily: "'Montserrat Arm', 'Montserrat', sans-serif", fontSize: 28, margin: "0 0 14px", letterSpacing: "-0.02em" }}>Admin վահանակ</h2>
        <div className="b24-tab-bar" style={{ display: "flex", gap: 6, padding: 5, background: t.c.surface2, borderRadius: 12, marginBottom: 20, maxWidth: 820, flexWrap: "wrap" }}>
          {[["candidates", "👥 Թեկնածուներ"], ["courses", "📚 Դասընթացներ"], ["access", "🔑 Հասանելիություն"], ["content", "✏️ Բովանդակություն"], ["i18n", "🌐 Տեքստեր"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className="b24-btn" style={{ flex: 1, padding: 10, background: tab === k ? t.c.surface : "transparent", color: t.c.text, fontSize: 13.5 }}>{l}</button>
          ))}
        </div>
        {(tab === "candidates" || tab === "content") && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: t.c.muted, fontWeight: 600, letterSpacing: ".06em", display: "block", marginBottom: 6 }}>ԴԱՍԸՆԹԱՑ</label>
              <select className="b24-input" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} style={{ maxWidth: 360 }}>
                {Object.values(content.courses).map(c => <option key={c.id} value={c.id}>{c.title} {c.status === "draft" ? "(draft)" : ""}</option>)}
              </select>
            </div>
        )}
        {tab === "candidates" && course && <AdminCandidates t={t} users={users} updateUser={updateUser} course={course} content={content} showToast={showToast} />}
        {tab === "courses" && <AdminCourses t={t} content={content} users={users} updateUser={updateUser} persistContent={persistContent} showToast={showToast} />}
        {tab === "access" && <AdminAccess t={t} content={content} users={users} updateUser={updateUser} persistContent={persistContent} showToast={showToast} />}
        {tab === "content" && course && <AdminContent t={t} course={course} content={content} persistContent={persistContent} showToast={showToast} />}
        {tab === "i18n" && <AdminI18n t={t} content={content} persistContent={persistContent} showToast={showToast} />}
      </div>
  );
}

function AdminCandidates({ t, users, updateUser, course, content, showToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const modules = course.modules;
  const cid = course.id;

  // Build view rows from enrollments
  const list = useMemo(() => {
    let arr = Object.values(users).map((u) => {
      const e = u.enrollments?.[cid];
      const done = e ? modules.filter((m) => e.progress?.[m.id]).length : 0;
      const pct = e?.final ? e.final.pct : null;
      return { ...u, enrolled: !!e, enrollment: e, modulesDone: done, finalPct: pct, cat: pct != null ? scoreCategory(pct) : null };
    });
    if (search) arr = arr.filter((u) => (u.fullName + u.email + (u.phone || "")).toLowerCase().includes(search.toLowerCase()));
    if (filter !== "all") {
      if (filter === "enrolled") arr = arr.filter(u => u.enrolled);
      else if (filter === "completed") arr = arr.filter((u) => u.finalPct != null);
      else if (filter === "needsGrading") arr = arr.filter((u) => u.enrollment?.final && !u.enrollment.final.graded);
      else arr = arr.filter((u) => u.cat?.key === filter);
    }
    return arr.sort((a, b) => (b.finalPct ?? -1) - (a.finalPct ?? -1));
  }, [users, search, filter, modules, cid]);

  const enrolledList = Object.values(users).filter(u => u.enrollments?.[cid]);
  const avg = useMemo(() => { const s = enrolledList.filter(u => u.enrollments[cid]?.final); return s.length ? Math.round(s.reduce((a, u) => a + u.enrollments[cid].final.pct, 0) / s.length) : 0; }, [users, cid]);

  const exportCSV = () => {
    const rows = [["Անուն", "Email", "Հեռախոս", "Մոդուլ", "Final%", "Տեսություն", "Տրամաբ", "Գործնական", "Գնահատված", "Կարգավիճակ", "Նշում"]];
    list.forEach((u) => rows.push([u.fullName, u.email, u.phone || "", `${u.modulesDone}/${modules.length}`, u.finalPct ?? "", u.enrollment?.final?.theoryPct ?? "", u.enrollment?.final?.logicPct ?? "", u.enrollment?.final?.practicalPct ?? "", u.enrollment?.final?.graded ? "Այո" : "Ոչ", u.adminStatus || "", (u.adminNote || "").replace(/\n/g, " ")]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })); a.download = `candidates-${cid}.csv`; a.click();
    showToast("CSV ներբեռնված ✓");
  };

  const sc = { rejected: t.c.bad, maybe: t.c.warn, internship: t.c.good };
  const sl = { rejected: "Մերժված", maybe: "Միգուցե", internship: "Ստաժ." };

  return (<>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
      {[["Գրանցված", enrolledList.length], ["Թեստ հանձնած", enrolledList.filter(u => u.enrollments[cid]?.final).length], ["Միջին", avg + "%"], ["Գնահ. սպասող", enrolledList.filter(u => u.enrollments[cid]?.final && !u.enrollments[cid].final.graded).length]].map(([l, v]) => (
          <div key={l} style={{ ...t.card, padding: 16 }}><div style={{ fontSize: 26, fontWeight: 800, color: t.c.accent }}>{v}</div><div style={{ fontSize: 13, color: t.c.muted }}>{l}</div></div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      <input className="b24-input" placeholder="🔍 Որոնել..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 200px", maxWidth: 280 }} />
      <select className="b24-input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "auto" }}>
        <option value="all">Բոլոր user-ները</option><option value="enrolled">Գրանցված կուրսին</option><option value="needsGrading">Գնահ. սպասող</option><option value="completed">Թեստ հանձնած</option>
        <option value="internship">71–100</option><option value="maybe">41–70</option><option value="no">0–40</option>
      </select>
      <button className="b24-btn b24-btn-primary" onClick={exportCSV}>⬇ CSV</button>
    </div>
    <div style={{ ...t.card, padding: 0, overflow: "hidden" }}>
      {list.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: t.c.muted }}>Թեկնածուներ չկան</div> : (<>
        {/* Desktop table */}
        <div style={{ overflowX: "auto" }} className="b24-hide-mobile"><table style={{ width: "100%", fontSize: 13.5, minWidth: 680 }}>
          <thead><tr style={{ background: t.c.surface2 }}>{["#", "Անուն", "Հեռախոս", "Մոդուլ", "Միավոր", "Կարգավիճակ", ""].map((h) => <th key={h} style={{ padding: "11px 14px", fontWeight: 600, color: t.c.muted, textAlign: "left" }}>{h}</th>)}</tr></thead>
          <tbody>{list.map((u, i) => (
              <tr key={u.email} style={{ borderTop: `1px solid ${t.c.border}`, opacity: u.enrolled ? 1 : .55 }}>
                <td style={{ padding: "11px 14px", color: t.c.muted }}>{i + 1}</td>
                <td style={{ padding: "11px 14px" }}><div style={{ fontWeight: 600 }}>{u.fullName} {!u.enrolled && <span style={{ fontSize: 10, color: t.c.muted, fontWeight: 500 }}>· չգրանցված</span>}</div><div style={{ fontSize: 12, color: t.c.muted }}>{u.email}</div></td>
                <td style={{ padding: "11px 14px", color: t.c.muted }}>{u.phone || "—"}</td>
                <td style={{ padding: "11px 14px" }}>{u.enrolled ? `${u.modulesDone}/${modules.length}` : "—"}</td>
                <td style={{ padding: "11px 14px" }}>{u.finalPct != null ? <span style={{ fontWeight: 700, color: u.cat.color }}>{u.finalPct}%{!u.enrollment.final.graded ? " ⏳" : ""}</span> : <span style={{ color: t.c.muted }}>—</span>}</td>
                <td style={{ padding: "11px 14px" }}>{u.adminStatus ? <span style={{ background: sc[u.adminStatus] + "22", color: sc[u.adminStatus], padding: "3px 9px", borderRadius: 7, fontSize: 12, fontWeight: 600 }}>{sl[u.adminStatus]}</span> : <span style={{ color: t.c.muted }}>—</span>}</td>
                <td style={{ padding: "11px 14px" }}><button className="b24-btn b24-btn-ghost" onClick={() => setSelected(u.email)} style={{ padding: "6px 12px", fontSize: 12.5 }}>Բացել</button></td>
              </tr>
          ))}</tbody>
        </table></div>
        {/* Mobile cards */}
        <div className="b24-show-mobile" style={{ display: "none", padding: 8 }}>
          {list.map((u, i) => (
              <div key={u.email} onClick={() => setSelected(u.email)} style={{ background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 10, padding: 12, marginBottom: 8, cursor: "pointer", opacity: u.enrolled ? 1 : .55 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{u.fullName}</div>
                    <div style={{ fontSize: 11.5, color: t.c.muted, marginBottom: 6 }}>{u.email}{u.phone && ` · ${u.phone}`}</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 11.5, color: t.c.muted, flexWrap: "wrap" }}>
                      <span>📂 {u.enrolled ? `${u.modulesDone}/${modules.length}` : "—"}</span>
                      {u.finalPct != null && <span style={{ fontWeight: 700, color: u.cat.color }}>{u.finalPct}%{!u.enrollment.final.graded ? " ⏳" : ""}</span>}
                    </div>
                  </div>
                  {u.adminStatus ? <span style={{ background: sc[u.adminStatus] + "22", color: sc[u.adminStatus], padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{sl[u.adminStatus]}</span> : <span style={{ fontSize: 14, color: t.c.muted, flexShrink: 0 }}>→</span>}
                </div>
              </div>
          ))}
        </div>
      </>)}
    </div>
    {selected && users[selected] && <CandidateModal t={t} u={users[selected]} updateUser={updateUser} course={course} content={content} onClose={() => setSelected(null)} sc={sc} sl={sl} showToast={showToast} />}
  </>);
}

function CandidateModal({ t, u, updateUser, course, content, onClose, sc, sl, showToast }) {
  const cid = course.id;
  const e = u.enrollments?.[cid]; // current course enrollment (may be undefined)
  const f = e?.final;
  const [note, setNote] = useState(u.adminNote || "");
  const [pracScore, setPracScore] = useState(f?.practicalPct ?? "");
  const [pracFb, setPracFb] = useState(f?.practicalFeedback ?? "");
  const [miniScore, setMiniScore] = useState(e?.practice?.score ?? "");
  const [miniFb, setMiniFb] = useState(e?.practice?.feedback ?? "");
  const cat = f ? scoreCategory(f.pct) : null;
  const dur = f?.durationSec ? `${Math.floor(f.durationSec / 60)}ր ${f.durationSec % 60}վ` : "—";
  const grants = u.accessGrants || [];

  const saveFinalGrade = () => {
    if (!f) return;
    const p = Math.max(0, Math.min(100, parseInt(pracScore) || 0));
    const finalPct = Math.round(f.theoryPct * 0.40 + f.logicPct * 0.25 + p * 0.35);
    const newEnroll = { ...e, final: { ...f, practicalPct: p, practicalFeedback: pracFb, pct: finalPct, graded: true } };
    updateUser(u.email, { enrollments: { ...u.enrollments, [cid]: newEnroll } });
    showToast("Վերջնական գնահատականը պահպանված ✓");
  };
  const saveMiniGrade = () => {
    if (!e?.practice) return;
    const s = Math.max(0, Math.min(100, parseInt(miniScore) || 0));
    const newEnroll = { ...e, practice: { ...e.practice, score: s, feedback: miniFb } };
    updateUser(u.email, { enrollments: { ...u.enrollments, [cid]: newEnroll } });
    showToast("Mini practice գնահատված ✓");
  };
  const toggleGrant = (courseId) => {
    const has = grants.includes(courseId);
    const next = has ? grants.filter(x => x !== courseId) : [...grants, courseId];
    updateUser(u.email, { accessGrants: next });
    showToast(has ? "Հասանելիությունը հանված է" : "Հասանելիությունը տրված է ✓");
  };

  const restrictedCourses = Object.values(content.courses).filter(c => c.accessMode === "restricted" && c.status === "published");

  return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} className="b24-modal-pad">
        <div onClick={(ev) => ev.stopPropagation()} className="b24-fade" style={{ ...t.card, maxWidth: 680, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><h3 style={{ margin: "0 0 2px", fontSize: 22 }}>{u.fullName}</h3><div style={{ fontSize: 13, color: t.c.muted }}>{u.email} • {u.phone}</div></div>
            <button className="b24-btn b24-btn-ghost" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
          </div>

          <div style={{ fontSize: 12, color: t.c.muted, marginTop: 14, letterSpacing: ".05em", fontWeight: 600 }}>ԴԱՍԸՆԹԱՑ՝ {course.title.toUpperCase()}</div>

          {cat ? <div style={{ background: t.c.surface2, borderRadius: 12, padding: 16, margin: "8px 0", borderLeft: `4px solid ${cat.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: cat.color }}>{f.pct}% — {cat.label} {!f.graded && <span style={{ fontSize: 13, color: t.c.warn }}>(բաց հարցերը դեռ չգնահատված)</span>}</div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: t.c.muted, marginTop: 8, flexWrap: "wrap" }}><span>Տեսություն՝ {f.theoryPct}%</span><span>Տրամաբ՝ {f.logicPct}%</span><span>Գործնական՝ {f.practicalPct ?? "—"}%</span><span>⏱ {dur}</span></div>
          </div> : <div style={{ color: t.c.muted, margin: "8px 0", fontSize: 14 }}>{e ? `Դեռ չի հանձնել եզրափակիչ թեստը։ Ավարտված մոդուլ՝ ${course.modules.filter((m) => e.progress?.[m.id]).length}/${course.modules.length}` : "Այս կուրսին դեռ գրանցված չէ։"}</div>}

          {f?.practicalAnswers && <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>🗒 Բաց պատասխաններ (final) — գնահատիր</div>
            {f.practicalAnswers.map((a, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12.5, color: t.c.muted, marginBottom: 3 }}>{course.final.practical[i]?.q}</div>
                  <div style={{ background: t.c.bg, border: `1px solid ${t.c.border}`, borderRadius: 8, padding: 10, fontSize: 13.5, whiteSpace: "pre-wrap" }}>{a || "(դատարկ)"}</div>
                </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <label style={{ flex: "1 1 110px" }}><span style={{ fontSize: 12.5, color: t.c.muted }}>Գործն. միավոր</span><input className="b24-input" type="number" value={pracScore} onChange={(ev) => setPracScore(ev.target.value)} /></label>
              <input className="b24-input" style={{ flex: "2 1 180px" }} placeholder="Կարճ feedback..." value={pracFb} onChange={(ev) => setPracFb(ev.target.value)} />
              <button className="b24-btn b24-btn-primary" onClick={saveFinalGrade} style={{ flex: "0 0 auto" }}>Պահպանել</button>
            </div>
          </div>}

          {e?.practice && <div style={{ marginBottom: 16, borderTop: `1px solid ${t.c.border}`, paddingTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>📝 Practice պատասխան — գնահատիր</div>
            <div style={{ background: t.c.bg, border: `1px solid ${t.c.border}`, borderRadius: 8, padding: 10, fontSize: 13.5, whiteSpace: "pre-wrap", color: t.c.muted }}>{e.practice.text}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <label style={{ flex: "1 1 110px" }}><span style={{ fontSize: 12.5, color: t.c.muted }}>Միավոր (0-100)</span><input className="b24-input" type="number" value={miniScore} onChange={(ev) => setMiniScore(ev.target.value)} /></label>
              <input className="b24-input" style={{ flex: "2 1 180px" }} placeholder="Feedback..." value={miniFb} onChange={(ev) => setMiniFb(ev.target.value)} />
              <button className="b24-btn b24-btn-primary" onClick={saveMiniGrade} style={{ flex: "0 0 auto" }}>Պահպանել</button>
            </div>
          </div>}

          {/* Access grants for restricted courses */}
          {restrictedCourses.length > 0 && <div style={{ borderTop: `1px solid ${t.c.border}`, paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>🔑 Փակ դասընթացների հասանելիություն</div>
            <div style={{ display: "grid", gap: 6 }}>
              {restrictedCourses.map(c => {
                const direct = grants.includes(c.id);
                const viaGroup = (u.groupIds || []).some(g => (c.grantedGroupIds || []).includes(g));
                const has = direct || viaGroup;
                return <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: has ? t.c.accentSoft : t.c.surface2, borderRadius: 8, cursor: viaGroup && !direct ? "default" : "pointer", fontSize: 13.5 }}>
                  <input type="checkbox" checked={direct} disabled={viaGroup && !direct} onChange={() => toggleGrant(c.id)} style={{ accentColor: BRAND.mint }} />
                  <span style={{ flex: 1 }}>{c.icon} {c.title}</span>
                  <span style={{ fontSize: 11, color: has ? t.c.accent : t.c.muted, fontWeight: 600 }}>{viaGroup && !direct ? "ԽՄԲԻ ՄԻՋՈՑՈՎ" : has ? "ՀԱՍԱՆԵԼԻ" : "ՓԱԿ"}</span>
                </label>;
              })}
            </div>
          </div>}

          {/* Groups */}
          {Object.keys(content.groups || {}).length > 0 && <div style={{ borderTop: `1px solid ${t.c.border}`, paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>👥 Խմբեր</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.values(content.groups).map(g => {
                const isMember = (u.groupIds || []).includes(g.id);
                return (
                    <button key={g.id} onClick={() => {
                      const gs = u.groupIds || [];
                      updateUser(u.email, { groupIds: isMember ? gs.filter(x => x !== g.id) : [...gs, g.id] });
                      showToast(isMember ? "Հանվեց խմբից" : "Ավելացվեց խմբի մեջ ✓");
                    }} className="b24-btn" style={{ padding: "6px 12px", fontSize: 12.5, background: isMember ? g.color : t.c.surface2, color: isMember ? "#fff" : t.c.text, border: `1px solid ${isMember ? g.color : t.c.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                      {isMember && "✓"} <span style={{ width: 8, height: 8, borderRadius: "50%", background: isMember ? "#fff" : g.color }} /> {g.name}
                    </button>
                );
              })}
            </div>
          </div>}

          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Admin նշում</div>
          <textarea className="b24-input" rows={2} value={note} onChange={(ev) => setNote(ev.target.value)} onBlur={() => updateUser(u.email, { adminNote: note })} style={{ marginBottom: 14, resize: "vertical" }} />
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Որոշում</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["rejected", "maybe", "internship"].map((s) => (
                <button key={s} className="b24-btn" onClick={() => updateUser(u.email, { adminStatus: u.adminStatus === s ? "" : s })} style={{ flex: 1, minWidth: 100, padding: 11, background: u.adminStatus === s ? sc[s] : t.c.surface2, color: u.adminStatus === s ? "#fff" : t.c.text, border: `1.5px solid ${sc[s]}` }}>{sl[s]}</button>
            ))}
          </div>
        </div>
      </div>
  );
}

/* ----------------------------- ADMIN I18N (static string editor) ----------------------------- */
function AdminI18n({ t, content, persistContent, showToast }) {
  const overrides = content.i18nOverrides || {};
  const [group, setGroup] = useState("landing");
  const [search, setSearch] = useState("");

  const setOverride = (key, val) => {
    const next = { ...overrides };
    if (val == null || val === "" || val === STATIC_STRINGS[key]) delete next[key];
    else next[key] = val;
    persistContent({ ...content, i18nOverrides: next });
  };
  const resetAll = () => {
    if (!confirm("Վերականգնե՞լ բոլոր փոփոխությունները ու վերադառնալ սկզբնական տեքստերին։")) return;
    persistContent({ ...content, i18nOverrides: {} });
    showToast("Բոլոր փոփոխությունները վերականգնված են ✓");
  };
  const exportOverrides = () => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "machtech-translations.json"; a.click();
    showToast("Տեքստերը արտահանված են ✓");
  };
  const importOverrides = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (typeof data !== "object" || Array.isArray(data)) return showToast("Անվավեր ֆայլ");
        persistContent({ ...content, i18nOverrides: data });
        showToast(`Ներբեռնվեց ${Object.keys(data).length} փոփոխություն ✓`);
      } catch (er) { showToast("JSON-ի սխալ"); }
    };
    reader.readAsText(file);
  };

  // Filter keys by group + search
  const filteredKeys = Object.keys(STATIC_STRINGS).filter(k => {
    if (group !== "all" && !k.startsWith(group + ".")) return false;
    if (search) {
      const q = search.toLowerCase();
      const def = (STATIC_STRINGS[k] || "").toLowerCase();
      const cur = (overrides[k] || "").toLowerCase();
      return k.toLowerCase().includes(q) || def.includes(q) || cur.includes(q);
    }
    return true;
  });

  const editedCount = Object.keys(overrides).length;
  const totalCount = Object.keys(STATIC_STRINGS).length;
  const fileRef = useRef(null);

  return (<>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
      <div>
        <p style={{ color: t.c.muted, margin: 0, fontSize: 14 }}>Կայքի կարծր տեքստերի խմբագրում · <span style={{ color: t.c.accent, fontWeight: 700 }}>{editedCount}</span> / {totalCount} փոփոխված</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input ref={fileRef} type="file" accept=".json" onChange={(e) => e.target.files[0] && importOverrides(e.target.files[0])} style={{ display: "none" }} />
        <button className="b24-btn b24-btn-ghost" onClick={() => fileRef.current?.click()} style={{ padding: "8px 14px", fontSize: 12.5 }}>📥 Import</button>
        <button className="b24-btn b24-btn-ghost" onClick={exportOverrides} disabled={editedCount === 0} style={{ padding: "8px 14px", fontSize: 12.5, opacity: editedCount === 0 ? .5 : 1 }}>📤 Export</button>
        {editedCount > 0 && <button className="b24-btn b24-btn-danger" onClick={resetAll} style={{ padding: "8px 14px", fontSize: 12.5 }}>↺ Բոլորը</button>}
      </div>
    </div>

    <div style={{ ...t.card, padding: 14, marginBottom: 14, background: t.c.accentSoft, border: `1px solid ${t.c.accent}33`, fontSize: 13, lineHeight: 1.55, color: t.c.text }}>
      💡 Այս tab-ից կարող ես խմբագրել կայքի բոլոր static տեքստերը։ Փոփոխությունները ակնթարթ կարտացոլվեն բոլոր օգտատերերի համար։ Կարող ես նաև Export անել՝ որպես backup, ու Import-ով կիսել մեկ ուրիշի հետ։
    </div>

    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      <select className="b24-input" value={group} onChange={(e) => setGroup(e.target.value)} style={{ maxWidth: 280 }}>
        <option value="all">Ցույց տալ բոլորը</option>
        {STATIC_STRING_GROUPS.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
      </select>
      <input className="b24-input" placeholder="🔍 Որոնել key կամ տեքստ..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 200px", maxWidth: 320 }} />
    </div>

    {filteredKeys.length === 0 ? (
        <div style={{ ...t.card, textAlign: "center", padding: 40, color: t.c.muted }}>Տեքստեր չկան այս զտիչով</div>
    ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {filteredKeys.map(key => {
            const def = STATIC_STRINGS[key];
            const cur = overrides[key];
            const isMultiline = def && (def.length > 80 || def.includes("\n"));
            const isEdited = cur != null && cur !== "";
            return (
                <div key={key} style={{ ...t.card, padding: 14, borderLeft: isEdited ? `3px solid ${BRAND.mint}` : `1px solid ${t.c.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <code style={{ fontSize: 11, color: t.c.muted, background: t.c.surface2, padding: "2px 6px", borderRadius: 4, fontFamily: "ui-monospace, Menlo, monospace" }}>{key}</code>
                    {isEdited && (<div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: BRAND.mint, fontWeight: 700, letterSpacing: ".05em" }}>ՓՈՓՈԽՎԱԾ</span>
                      <button onClick={() => setOverride(key, "")} title="Վերականգնել" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.c.muted, fontSize: 12, padding: "2px 6px" }}>↺</button>
                    </div>)}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.c.muted, marginBottom: 4, fontStyle: "italic" }}>Սկզբնական: «{def?.slice(0, 100)}{def && def.length > 100 ? "..." : ""}»</div>
                  {isMultiline ? (
                      <textarea className="b24-input" rows={3} value={isEdited ? cur : def} onChange={(e) => setOverride(key, e.target.value)} style={{ resize: "vertical", fontSize: 13.5, borderColor: isEdited ? BRAND.mint : t.c.border }} />
                  ) : (
                      <input className="b24-input" value={isEdited ? cur : def} onChange={(e) => setOverride(key, e.target.value)} style={{ fontSize: 13.5, borderColor: isEdited ? BRAND.mint : t.c.border }} />
                  )}
                </div>
            );
          })}
        </div>
    )}
  </>);
}

/* ----------------------------- ADMIN ACCESS (groups + bulk grants) ----------------------------- */
function AdminAccess({ t, content, users, updateUser, persistContent, showToast }) {
  const [view, setView] = useState("grant"); // 'grant' | 'groups'
  const [selectedCourseId, setSelectedCourseId] = useState(
      Object.values(content.courses).find(c => c.accessMode === "restricted")?.id || Object.keys(content.courses)[0]
  );
  const [search, setSearch] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupDraft, setGroupDraft] = useState({ name: "", description: "", color: "#27D2B3" });

  const groups = content.groups || {};
  const groupsList = Object.values(groups);
  const course = content.courses[selectedCourseId];
  const restrictedCourses = Object.values(content.courses).filter(c => c.accessMode === "restricted");

  /* === group operations === */
  const saveGroup = () => {
    if (!groupDraft.name.trim()) return showToast("Անունը պետք է");
    const id = editingGroup || ("g_" + Date.now());
    const g = { id, name: groupDraft.name, description: groupDraft.description, color: groupDraft.color, createdAt: groups[id]?.createdAt || Date.now() };
    persistContent({ ...content, groups: { ...groups, [id]: g } });
    setShowCreateGroup(false); setEditingGroup(null); setGroupDraft({ name: "", description: "", color: "#27D2B3" });
    showToast(editingGroup ? "Խումբը թարմացվեց ✓" : "Խումբը ստեղծվեց ✓");
  };
  const deleteGroup = (id) => {
    if (!confirm(`Ջնջե՞լ «${groups[id].name}» խումբը։ User-ները կպահպանվեն, բայց կդուրս գան խմբից։`)) return;
    const nextGroups = { ...groups }; delete nextGroups[id];
    // remove from users
    Object.values(users).forEach(u => {
      if ((u.groupIds || []).includes(id)) updateUser(u.email, { groupIds: u.groupIds.filter(g => g !== id) });
    });
    // remove from courses
    const nextCourses = { ...content.courses };
    Object.keys(nextCourses).forEach(cid => {
      const c = nextCourses[cid];
      if ((c.grantedGroupIds || []).includes(id)) nextCourses[cid] = { ...c, grantedGroupIds: c.grantedGroupIds.filter(g => g !== id) };
    });
    persistContent({ ...content, groups: nextGroups, courses: nextCourses });
    showToast("Խումբը ջնջվեց");
  };
  const startEdit = (g) => { setEditingGroup(g.id); setGroupDraft({ name: g.name, description: g.description || "", color: g.color || BRAND.mint }); setShowCreateGroup(true); };

  /* === user/group ↔ course grant operations === */
  const toggleUserGrant = (email, cid) => {
    const u = users[email]; const grants = u.accessGrants || [];
    const has = grants.includes(cid);
    updateUser(email, { accessGrants: has ? grants.filter(x => x !== cid) : [...grants, cid] });
  };
  const toggleGroupGrant = (groupId, cid) => {
    const c = content.courses[cid]; const g = c.grantedGroupIds || [];
    const has = g.includes(groupId);
    persistContent({ ...content, courses: { ...content.courses, [cid]: { ...c, grantedGroupIds: has ? g.filter(x => x !== groupId) : [...g, groupId] } } });
  };
  const toggleUserInGroup = (email, groupId) => {
    const u = users[email]; const gs = u.groupIds || [];
    const has = gs.includes(groupId);
    updateUser(email, { groupIds: has ? gs.filter(x => x !== groupId) : [...gs, groupId] });
  };

  const filteredUsers = Object.values(users).filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.fullName + u.email + (u.phone || "")).toLowerCase().includes(q);
  });

  /* ====== Sub-view: grants ====== */
  if (view === "grant") {
    if (!course) return <div style={{ ...t.card, textAlign: "center", padding: 30, color: t.c.muted }}>Չկա ընտրված կուրս։</div>;
    const grantedUsers = Object.values(users).filter(u => (u.accessGrants || []).includes(selectedCourseId));
    const grantedGroups = (course.grantedGroupIds || []).map(gid => groups[gid]).filter(Boolean);

    return (<>
      <div style={{ display: "flex", gap: 6, padding: 5, background: t.c.surface2, borderRadius: 10, marginBottom: 16, maxWidth: 360 }}>
        <button onClick={() => setView("grant")} className="b24-btn" style={{ flex: 1, padding: 9, background: view === "grant" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13 }}>🎯 Հասանելիություն</button>
        <button onClick={() => setView("groups")} className="b24-btn" style={{ flex: 1, padding: 9, background: view === "groups" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13 }}>👥 Խմբեր ({groupsList.length})</button>
      </div>

      <div style={{ ...t.card, marginBottom: 16, padding: 16 }}>
        <Lbl t={t}>ԴԱՍԸՆԹԱՑ՝ որի՞ հասանելիությունն ես կարգավորում</Lbl>
        <select className="b24-input" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} style={{ maxWidth: 420 }}>
          {Object.values(content.courses).map(c => <option key={c.id} value={c.id}>{c.icon} {c.title} {c.accessMode === "open" ? "· (բաց բոլորին)" : "· (փակ)"}</option>)}
        </select>
        {course.accessMode === "open" && (
            <div style={{ background: BRAND.mint + "1a", border: `1px solid ${BRAND.mint}55`, borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13, color: t.c.text }}>
              ℹ️ Այս կուրսը <b>բաց է բոլորին</b>։ Բոլոր գրանցված user-ները կարող են անցնել։ Անհատական հասանելիության կարիք չկա։ Փոխիր «Փակ»՝ <a onClick={() => persistContent({ ...content, courses: { ...content.courses, [selectedCourseId]: { ...course, accessMode: "restricted" } } })} style={{ cursor: "pointer", textDecoration: "underline", color: t.c.accent }}>սեղմելով այստեղ</a>։
            </div>
        )}
      </div>

      {course.accessMode === "restricted" && (<>
        {/* Granted groups */}
        <div style={{ ...t.card, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>👥 Հասանելի խմբեր ({grantedGroups.length})</div>
            <div style={{ fontSize: 12, color: t.c.muted }}>Քրտնակ դեպք՝ տուր մի ամբողջ խմբին միաժամանակ</div>
          </div>
          {groupsList.length === 0 ? (
              <div style={{ background: t.c.surface2, borderRadius: 8, padding: 14, fontSize: 13, color: t.c.muted, textAlign: "center" }}>Դեռ խումբ չկա։ <a onClick={() => setView("groups")} style={{ cursor: "pointer", textDecoration: "underline", color: t.c.accent }}>Ստեղծել խումբ</a></div>
          ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                {groupsList.map(g => {
                  const has = (course.grantedGroupIds || []).includes(g.id);
                  const memberCount = Object.values(users).filter(u => (u.groupIds || []).includes(g.id)).length;
                  return (
                      <label key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: has ? t.c.accentSoft : t.c.surface2, borderRadius: 8, cursor: "pointer", border: `1.5px solid ${has ? t.c.accent : "transparent"}` }}>
                        <input type="checkbox" checked={has} onChange={() => toggleGroupGrant(g.id, selectedCourseId)} style={{ accentColor: g.color }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: g.color }} />
                            {g.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: t.c.muted, marginTop: 2 }}>{memberCount} անդամ</div>
                        </div>
                      </label>
                  );
                })}
              </div>
          )}
        </div>

        {/* Granted individual users */}
        <div style={{ ...t.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>👤 Անհատական հասանելիություն ({grantedUsers.length})</div>
            <input className="b24-input" placeholder="🔍 Որոնել user-ի..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 240 }} />
          </div>
          <div style={{ display: "grid", gap: 4, maxHeight: 400, overflowY: "auto" }}>
            {filteredUsers.length === 0 && <div style={{ textAlign: "center", padding: 20, color: t.c.muted, fontSize: 13 }}>User-ներ չկան</div>}
            {filteredUsers.map(u => {
              const has = (u.accessGrants || []).includes(selectedCourseId);
              const viaGroup = (u.groupIds || []).some(g => (course.grantedGroupIds || []).includes(g));
              return (
                  <label key={u.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: has ? t.c.accentSoft : t.c.surface2, borderRadius: 6, cursor: "pointer", border: `1px solid ${has ? t.c.accent : "transparent"}` }}>
                    <input type="checkbox" checked={has} onChange={() => toggleUserGrant(u.email, selectedCourseId)} style={{ accentColor: BRAND.mint }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.fullName}</div>
                      <div style={{ fontSize: 11.5, color: t.c.muted }}>{u.email}{viaGroup && !has && <span style={{ marginLeft: 8, color: t.c.accent }}>✓ խմբի միջոցով</span>}</div>
                    </div>
                    {has && <span style={{ fontSize: 10, color: t.c.accent, fontWeight: 700, letterSpacing: ".05em" }}>ՀԱՍԱՆԵԼԻ</span>}
                  </label>
              );
            })}
          </div>
        </div>
      </>)}
    </>);
  }

  /* ====== Sub-view: groups ====== */
  return (<>
    <div style={{ display: "flex", gap: 6, padding: 5, background: t.c.surface2, borderRadius: 10, marginBottom: 16, maxWidth: 360 }}>
      <button onClick={() => setView("grant")} className="b24-btn" style={{ flex: 1, padding: 9, background: view === "grant" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13 }}>🎯 Հասանելիություն</button>
      <button onClick={() => setView("groups")} className="b24-btn" style={{ flex: 1, padding: 9, background: view === "groups" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13 }}>👥 Խմբեր ({groupsList.length})</button>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
      <p style={{ color: t.c.muted, margin: 0, fontSize: 14 }}>Խմբերը հնարավորություն են տալիս միանգամից ակտիվացնել կուրսը խումբի բոլոր անդամներին։</p>
      <button className="b24-btn b24-btn-primary" onClick={() => { setEditingGroup(null); setGroupDraft({ name: "", description: "", color: BRAND.mint }); setShowCreateGroup(true); }}>+ Նոր խումբ</button>
    </div>

    {groupsList.length === 0 ? (
        <div style={{ ...t.card, textAlign: "center", padding: 40, color: t.c.muted }}>Դեռ խումբ չկա։ Սեղմիր «+ Նոր խումբ»՝ առաջինը սարքելու համար։</div>
    ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {groupsList.map(g => {
            const members = Object.values(users).filter(u => (u.groupIds || []).includes(g.id));
            const grantedToCourses = Object.values(content.courses).filter(c => (c.grantedGroupIds || []).includes(g.id));
            return (
                <div key={g.id} style={{ ...t.card, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 280px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ width: 14, height: 14, borderRadius: 4, background: g.color }} />
                        <h4 style={{ margin: 0, fontSize: 16 }}>{g.name}</h4>
                      </div>
                      {g.description && <div style={{ fontSize: 13, color: t.c.muted, marginBottom: 6 }}>{g.description}</div>}
                      <div style={{ fontSize: 12, color: t.c.muted, display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <span>👤 {members.length} անդամ</span>
                        <span>📚 {grantedToCourses.length} կուրս հասանելի</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="b24-btn b24-btn-ghost" onClick={() => startEdit(g)}>✏️</button>
                      <button className="b24-btn b24-btn-danger" onClick={() => deleteGroup(g.id)}>🗑</button>
                    </div>
                  </div>

                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.c.accent }}>Կառավարել անդամներին ({members.length})</summary>
                    <div style={{ marginTop: 10, maxHeight: 240, overflowY: "auto", display: "grid", gap: 3 }}>
                      {Object.values(users).map(u => {
                        const isMember = (u.groupIds || []).includes(g.id);
                        return (
                            <label key={u.email} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: isMember ? g.color + "1a" : t.c.surface2, borderRadius: 5, cursor: "pointer", fontSize: 13 }}>
                              <input type="checkbox" checked={isMember} onChange={() => toggleUserInGroup(u.email, g.id)} style={{ accentColor: g.color }} />
                              <span style={{ flex: 1 }}>{u.fullName} <span style={{ color: t.c.muted, fontSize: 11.5 }}>· {u.email}</span></span>
                            </label>
                        );
                      })}
                    </div>
                  </details>

                  {grantedToCourses.length > 0 && <div style={{ marginTop: 10, fontSize: 12, color: t.c.muted }}>📚 Հասանելի կուրսեր՝ {grantedToCourses.map(c => c.icon + " " + c.shortTitle).join(", ")}</div>}
                </div>
            );
          })}
        </div>
    )}

    {showCreateGroup && (
        <div onClick={() => setShowCreateGroup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="b24-fade" style={{ ...t.card, maxWidth: 460, width: "100%" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 20 }}>{editingGroup ? "Խմբագրել խումբը" : "Նոր խումբ"}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <Field t={t} label="Անվանում" value={groupDraft.name} onChange={(e) => setGroupDraft({ ...groupDraft, name: e.target.value })} placeholder="օր. Հոկտեմբերի հոսք 2026" />
              <label><Lbl t={t}>Նկարագրություն (օպցիոն)</Lbl><textarea className="b24-input" rows={2} value={groupDraft.description} onChange={(e) => setGroupDraft({ ...groupDraft, description: e.target.value })} style={{ resize: "vertical" }} /></label>
              <div>
                <Lbl t={t}>Գույն</Lbl>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["#27D2B3", "#005043", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"].map(c => (
                      <button key={c} onClick={() => setGroupDraft({ ...groupDraft, color: c })} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: groupDraft.color === c ? `3px solid ${t.c.text}` : `1px solid ${t.c.border}`, cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
              <button className="b24-btn b24-btn-ghost" onClick={() => setShowCreateGroup(false)}>Չեղարկել</button>
              <button className="b24-btn b24-btn-primary" onClick={saveGroup}>{editingGroup ? "Պահպանել" : "Ստեղծել"}</button>
            </div>
          </div>
        </div>
    )}
  </>);
}

/* ----------------------------- ADMIN COURSES (full operations) ----------------------------- */
function AdminCourses({ t, content, users, updateUser, persistContent, showToast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", shortTitle: "", description: "", level: "Foundation", icon: "📘", accessMode: "open" });

  const updateCourse = (id, patch) => persistContent({ ...content, courses: { ...content.courses, [id]: { ...content.courses[id], ...patch } } });
  const deleteCourse = (id) => {
    if (id === "crm-foundation") return showToast("Հիմնական կուրսը չի կարող ջնջվել");
    if (!confirm(`Ջնջե՞լ «${content.courses[id].title}» կուրսը։ User-ների progress-ը այս կուրսի համար նույնպես կկորչի։`)) return;
    const next = { ...content.courses }; delete next[id];
    persistContent({ ...content, courses: next });
    showToast("Կուրսը ջնջվեց");
  };
  const duplicateCourse = (id) => {
    const orig = content.courses[id];
    const newId = "c_" + Date.now();
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = newId;
    copy.title = orig.title + " (պատճեն)";
    copy.status = "draft";
    copy.createdAt = Date.now();
    copy.grantedGroupIds = [];
    persistContent({ ...content, courses: { ...content.courses, [newId]: copy } });
    showToast("Կուրսը կրկնօրինակվեց ✓ Տեսնում ես ներքևում");
  };
  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft({ title: c.title, shortTitle: c.shortTitle || "", description: c.description || "", level: c.level || "Foundation", icon: c.icon || "📘", accessMode: c.accessMode });
    setShowCreate(true);
  };
  const saveCourse = () => {
    if (!draft.title.trim()) return showToast("Տիտղոս է պետք");
    if (editingId) {
      updateCourse(editingId, { title: draft.title, shortTitle: draft.shortTitle || draft.title, description: draft.description || "—", level: draft.level, icon: draft.icon || "📘", accessMode: draft.accessMode });
      showToast("Կուրսը թարմացվեց ✓");
    } else {
      const id = "c_" + Date.now();
      const newCourse = {
        id, title: draft.title, shortTitle: draft.shortTitle || draft.title, description: draft.description || "—",
        level: draft.level, icon: draft.icon || "📘",
        status: "draft", accessMode: draft.accessMode, createdAt: Date.now(),
        grantedGroupIds: [], modules: [], final: { theory: [], logic: [], practical: [] }
      };
      persistContent({ ...content, courses: { ...content.courses, [id]: newCourse } });
      showToast("Կուրսը ստեղծվեց ✓ Անցիր «Բովանդակություն» tab՝ լրացնելու համար");
    }
    setShowCreate(false); setEditingId(null);
    setDraft({ title: "", shortTitle: "", description: "", level: "Foundation", icon: "📘", accessMode: "open" });
  };
  const cancelEdit = () => { setShowCreate(false); setEditingId(null); setDraft({ title: "", shortTitle: "", description: "", level: "Foundation", icon: "📘", accessMode: "open" }); };

  const courses = Object.values(content.courses);

  return (<>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
      <p style={{ color: t.c.muted, margin: 0, fontSize: 14 }}>{courses.length} դասընթաց · ստեղծիր/խմբագրիր/կրկնօրինակիր</p>
      <button className="b24-btn b24-btn-primary" onClick={() => { setEditingId(null); setDraft({ title: "", shortTitle: "", description: "", level: "Foundation", icon: "📘", accessMode: "open" }); setShowCreate(true); }} style={{ padding: "10px 18px" }}>+ Նոր կուրս</button>
    </div>

    <div style={{ display: "grid", gap: 12 }}>
      {courses.map(c => {
        const enrolledCount = Object.values(users).filter(u => u.enrollments?.[c.id]).length;
        const grantedCount = Object.values(users).filter(u => (u.accessGrants || []).includes(c.id)).length;
        const isFoundation = c.id === "crm-foundation";
        return (
            <div key={c.id} style={{ ...t.card, padding: 16 }}>
              {/* TOP ROW: identity + status badges */}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: c.status === "published" ? t.c.good + "22" : t.c.warn + "22", color: c.status === "published" ? t.c.good : t.c.warn, letterSpacing: ".05em" }}>{c.status === "published" ? "ՀՐԱՊԱՐԱԿ." : "DRAFT"}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: c.accessMode === "open" ? BRAND.mint + "33" : t.c.surface2, color: c.accessMode === "open" ? t.c.accent : t.c.muted, letterSpacing: ".05em" }}>{c.accessMode === "open" ? "ԲԱՑ" : "ՓԱԿ"}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: t.c.surface2, color: t.c.muted, letterSpacing: ".05em" }}>{(c.level || "FOUNDATION").toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {c.description && <div style={{ fontSize: 13, color: t.c.muted, marginBottom: 12, lineHeight: 1.5 }}>{c.description}</div>}

              <div style={{ display: "flex", gap: 14, fontSize: 12, color: t.c.muted, flexWrap: "wrap", marginBottom: 14, paddingTop: 10, borderTop: `1px dashed ${t.c.border}` }}>
                <span>📂 {c.modules.length} մոդուլ</span>
                <span>👥 {enrolledCount} գրանցված</span>
                {c.accessMode === "restricted" && <span>🔑 {grantedCount} հասանելիություն</span>}
              </div>

              {/* QUICK TOGGLES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: t.c.muted }}>
                  <Lbl t={t}>Կարգավիճակ</Lbl>
                  <select className="b24-input" value={c.status} onChange={(e) => updateCourse(c.id, { status: e.target.value })} style={{ padding: "8px 10px", fontSize: 13 }}>
                    <option value="draft">Draft (թաքնված)</option><option value="published">Հրապարակված</option>
                  </select>
                </label>
                <label style={{ fontSize: 12, color: t.c.muted }}>
                  <Lbl t={t}>Հասանելիություն</Lbl>
                  <select className="b24-input" value={c.accessMode} onChange={(e) => updateCourse(c.id, { accessMode: e.target.value })} style={{ padding: "8px 10px", fontSize: 13 }}>
                    <option value="open">Բաց բոլորին</option><option value="restricted">Փակ (հրավերով)</option>
                  </select>
                </label>
              </div>

              {/* OPERATIONS ROW */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button className="b24-btn b24-btn-ghost" onClick={() => startEdit(c)} style={{ padding: "8px 14px", fontSize: 12.5, flex: "1 1 100px" }}>✏️ Խմբագրել</button>
                <button className="b24-btn b24-btn-ghost" onClick={() => duplicateCourse(c.id)} style={{ padding: "8px 14px", fontSize: 12.5, flex: "1 1 100px" }}>⎘ Կրկնօրինակ</button>
                {!isFoundation && <button className="b24-btn b24-btn-danger" onClick={() => deleteCourse(c.id)} style={{ padding: "8px 14px", fontSize: 12.5, flex: "0 0 auto" }}>🗑 Ջնջել</button>}
              </div>
            </div>
        );
      })}
    </div>

    {showCreate && (
        <div onClick={cancelEdit} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} className="b24-modal-pad">
          <div onClick={(e) => e.stopPropagation()} className="b24-fade" style={{ ...t.card, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 20 }}>{editingId ? "Խմբագրել կուրսը" : "Նոր դասընթաց"}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <Field t={t} label="Վերնագիր *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="օր. Bitrix24 Advanced" />
              <Field t={t} label="Կարճ անվանում (վկայականի համար)" value={draft.shortTitle} onChange={(e) => setDraft({ ...draft, shortTitle: e.target.value })} placeholder="Advanced Automation" />
              <label><Lbl t={t}>Նկարագրություն</Lbl><textarea className="b24-input" rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} style={{ resize: "vertical" }} /></label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }} className="b24-grid-2-stack">
                <Field t={t} label="Իկոնա (emoji)" value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} />
                <label><Lbl t={t}>Մակարդակ</Lbl><select className="b24-input" value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}><option>Foundation</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select></label>
                <label><Lbl t={t}>Հասանելիություն</Lbl><select className="b24-input" value={draft.accessMode} onChange={(e) => setDraft({ ...draft, accessMode: e.target.value })}><option value="open">Բաց</option><option value="restricted">Փակ</option></select></label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button className="b24-btn b24-btn-ghost" onClick={cancelEdit}>Չեղարկել</button>
              <button className="b24-btn b24-btn-primary" onClick={saveCourse}>{editingId ? "Պահպանել" : "Ստեղծել կուրս"}</button>
            </div>
          </div>
        </div>
    )}
  </>);
}

/* ----------------------------- ADMIN CONTENT EDITOR (per course) ----------------------------- */
/* ============== COURSE IMPORT/EXPORT ============== */
const COURSE_TEMPLATE = {
  __format: "machtech-course-v1",
  __readme: "Սա օրինակ տեմպլատ է։ Փոխիր թեմա, մոդուլներ ու հարցեր ըստ քո կուրսի։ Հետո բարձիր import-ի միջոցով։ Հաջող բարձումից հետո __format և __readme դաշտերը կանգնչվեն։",

  title: "Կուրսի վերնագիր (օրինակ՝ Bitrix24 Advanced)",
  shortTitle: "Կարճ անուն (վկայականի վրա)",
  description: "Կարճ նկարագրություն — 1-2 նախադասություն",
  level: "Foundation",
  icon: "📘",

  modules: [
    {
      id: "m1",
      n: 1,
      title: "Մոդուլի վերնագիր",
      duration: "20 րոպե",
      desc: "Կարճ նկարագրություն, որը երևում է dashboard-ի քարտի վրա",
      blocks: [
        { type: "heading", level: 3, text: "Բաժնի վերնագիր" },
        { type: "text", text: "Պարբերության տեքստ։ Կարող ես գրել մի քանի տողով՝ նոր տողն ավտոմատ պահվում է։" },
        { type: "video", url: "https://youtu.be/dQw4w9WgXcQ", caption: "Վիդեո բացատրությունը" },
        { type: "image", url: "https://images.example.com/diagram.png", caption: "Սխեմայի բացատրությունը" },
        { type: "callout", variant: "info", title: "Կարևոր", text: "Հիմնական ուղերձը այս բլոկում" },
        { type: "list", items: ["Կետ առաջին", "Կետ երկրորդ", "Կետ երրորդ"] },
        { type: "quote", text: "Բիզնեսը գործիք չէ լուծելու", author: "Peter Drucker" },
        { type: "code", text: "function example() {\n  return 'hello';\n}" },
        { type: "divider" }
      ],
      quiz: [
        {
          type: "single",
          q: "Single choice հարց — մեկ ճիշտ պատասխան",
          a: ["Տարբերակ 1", "Տարբերակ 2 (ճիշտ)", "Տարբերակ 3", "Տարբերակ 4"],
          correct: 1
        },
        {
          type: "multiple",
          q: "Multiple choice — մի քանի ճիշտ պատասխան",
          a: ["Ա ճիշտ", "Բ սխալ", "Գ ճիշտ", "Դ սխալ"],
          correct: [0, 2]
        },
        {
          type: "text",
          q: "Text input — ի՞նչ է Bitrix24-ը։ (պատասխանիր մեկ բառով)",
          accept: ["CRM", "ՍՌՄ", "system"],
          caseSensitive: false
        },
        {
          type: "ordering",
          q: "Դասավորիր ճիշտ հերթականությամբ",
          items: ["Առաջին քայլ", "Երկրորդ քայլ", "Երրորդ քայլ", "Չորրորդ քայլ"]
        }
      ]
    },
    {
      id: "m2",
      n: 2,
      title: "Երկրորդ մոդուլ",
      duration: "15 րոպե",
      desc: "Հաջորդ թեման",
      blocks: [
        { type: "text", text: "Նոր մոդուլի սկզբնական տեքստը։" }
      ],
      quiz: [
        { type: "single", q: "Օրինակ հարց", a: ["Ա", "Բ", "Գ", "Դ"], correct: 0 }
      ]
    }
  ],

  final: {
    theory: [
      { type: "single", q: "Տեսական հարց", a: ["Ա", "Բ ճիշտ", "Գ", "Դ"], correct: 1 }
    ],
    logic: [
      { type: "single", q: "Տրամաբանական հարց", a: ["Ա", "Բ", "Գ ճիշտ", "Դ"], correct: 2 }
    ],
    practical: [
      { q: "Բաց հարց՝ ի՞նչ կանեիր այս սցենարում... (admin-ը ձեռքով կգնահատի)" }
    ]
  }
};

function validateCourseData(data) {
  const errors = [];
  if (!data || typeof data !== "object") { errors.push("Ֆայլը վավեր JSON չէ"); return errors; }
  if (!data.title || typeof data.title !== "string") errors.push("Բացակայում է «title»");
  if (data.modules && !Array.isArray(data.modules)) errors.push("«modules» պետք է լինի array");
  if (Array.isArray(data.modules)) {
    data.modules.forEach((m, i) => {
      if (!m.id) errors.push(`Մոդուլ ${i + 1}՝ չկա «id»`);
      if (!m.title) errors.push(`Մոդուլ ${i + 1}՝ չկա «title»`);
      if (m.quiz && !Array.isArray(m.quiz)) errors.push(`Մոդուլ ${i + 1}՝ «quiz» պետք է լինի array`);
      (m.quiz || []).forEach((q, j) => {
        if (!q.q) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ չկա «q» (հարցի տեքստ)`);
        const tp = q.type || "single";
        if (!["single", "multiple", "text", "ordering"].includes(tp)) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ անհայտ տիպ «${tp}»`);
        if (tp === "single" && (typeof q.correct !== "number" || !Array.isArray(q.a))) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ single տիպը պահանջում է «a» array և «correct» number`);
        if (tp === "multiple" && (!Array.isArray(q.correct) || !Array.isArray(q.a))) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ multiple տիպը պահանջում է «a» array և «correct» array`);
        if (tp === "text" && !Array.isArray(q.accept)) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ text տիպը պահանջում է «accept» array`);
        if (tp === "ordering" && !Array.isArray(q.items)) errors.push(`Մոդուլ ${i + 1}, հարց ${j + 1}՝ ordering տիպը պահանջում է «items» array`);
      });
    });
  }
  if (data.final) {
    if (!Array.isArray(data.final.theory)) errors.push("«final.theory» պետք է լինի array");
    if (!Array.isArray(data.final.logic)) errors.push("«final.logic» պետք է լինի array");
    if (!Array.isArray(data.final.practical)) errors.push("«final.practical» պետք է լինի array");
  }
  return errors;
}

function ImportExportModal({ t, course, updateCourse, exportCourse, downloadTemplate, onClose, showToast }) {
  const [mode, setMode] = useState("import"); // 'import' | 'export'
  const [rawJson, setRawJson] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [importMode, setImportMode] = useState("replace"); // 'replace' | 'merge'
  const [importTarget, setImportTarget] = useState("all"); // 'all' | 'modules' | 'final'
  const fileRef = useRef(null);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setRawJson(text);
      tryParse(text);
    };
    reader.readAsText(file);
  };

  const tryParse = (text) => {
    try {
      const data = JSON.parse(text);
      const errs = validateCourseData(data);
      setParsedData(data);
      setErrors(errs);
    } catch (e) {
      setParsedData(null);
      setErrors(["JSON-ի ֆորմատը սխալ է՝ " + e.message]);
    }
  };

  const doImport = () => {
    if (!parsedData) return;
    const patch = {};
    if (importTarget === "all" || importTarget === "modules") {
      if (Array.isArray(parsedData.modules)) {
        // Re-number and ensure unique IDs
        const importedMods = parsedData.modules.map((m, i) => ({
          ...m,
          id: m.id || `m_imp_${Date.now()}_${i}`,
          n: i + 1
        }));
        if (importMode === "merge") {
          patch.modules = [...course.modules, ...importedMods.map((m, i) => ({ ...m, n: course.modules.length + i + 1 }))];
        } else {
          patch.modules = importedMods;
        }
      }
    }
    if (importTarget === "all" || importTarget === "final") {
      if (parsedData.final) {
        if (importMode === "merge" && course.final) {
          patch.final = {
            theory: [...(course.final.theory || []), ...(parsedData.final.theory || [])],
            logic: [...(course.final.logic || []), ...(parsedData.final.logic || [])],
            practical: [...(course.final.practical || []), ...(parsedData.final.practical || [])],
          };
        } else {
          patch.final = parsedData.final;
        }
      }
    }
    if (importTarget === "all") {
      if (parsedData.title) patch.title = parsedData.title;
      if (parsedData.shortTitle) patch.shortTitle = parsedData.shortTitle;
      if (parsedData.description) patch.description = parsedData.description;
      if (parsedData.level) patch.level = parsedData.level;
      if (parsedData.icon) patch.icon = parsedData.icon;
    }

    if (!confirm(`Հաստատի՞ր ներբեռնումը։ ${importMode === "replace" ? "ԶԳՈՒՇԱՑՈՒՄ՝ ընթացիկ տվյալները կփոխարինվեն" : "Նոր տվյալները կավելացվեն ընթացիկներին"}։`)) return;
    updateCourse(patch);
    showToast(`Կուրսը ներբեռնվեց ✓ ${parsedData.modules?.length || 0} մոդուլ, ${parsedData.final?.theory?.length || 0}+${parsedData.final?.logic?.length || 0} տեստ հարց`);
    onClose();
  };

  const moduleCount = parsedData?.modules?.length || 0;
  const questionCount = (parsedData?.modules || []).reduce((s, m) => s + (m.quiz?.length || 0), 0);
  const finalCount = (parsedData?.final?.theory?.length || 0) + (parsedData?.final?.logic?.length || 0) + (parsedData?.final?.practical?.length || 0);
  const blockCount = (parsedData?.modules || []).reduce((s, m) => s + (m.blocks?.length || 0), 0);

  return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} className="b24-modal-pad">
        <div onClick={(e) => e.stopPropagation()} className="b24-fade" style={{ ...t.card, maxWidth: 720, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 22 }}>📦 Import / Export</h3>
            <button className="b24-btn b24-btn-ghost" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
          </div>

          <div style={{ display: "flex", gap: 6, padding: 5, background: t.c.surface2, borderRadius: 10, marginBottom: 18 }}>
            <button onClick={() => setMode("import")} className="b24-btn" style={{ flex: 1, padding: 10, background: mode === "import" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13.5 }}>📥 Ներբեռնել</button>
            <button onClick={() => setMode("export")} className="b24-btn" style={{ flex: 1, padding: 10, background: mode === "export" ? t.c.surface : "transparent", color: t.c.text, fontSize: 13.5 }}>📤 Արտահանել</button>
          </div>

          {mode === "export" && (<>
            <div style={{ background: t.c.surface2, borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>«{course.title}»</div>
              <div style={{ fontSize: 12.5, color: t.c.muted, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span>📂 {course.modules.length} մոդուլ</span>
                <span>📊 {(course.modules || []).reduce((s, m) => s + (m.quiz?.length || 0), 0)} quiz հարց</span>
                <span>🏁 {(course.final?.theory?.length || 0) + (course.final?.logic?.length || 0) + (course.final?.practical?.length || 0)} final հարց</span>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: t.c.muted, lineHeight: 1.5, marginBottom: 14 }}>
              Արտահանումը կտա JSON ֆայլ, որտեղ կլինի կուրսի ամբողջ բովանդակությունը (մոդուլներ, բլոկներ, quiz հարցեր, final test)։ Կարող ես պահել որպես backup կամ կիսել կոլեգայի հետ։
            </p>
            <button className="b24-btn b24-btn-primary" onClick={exportCourse} style={{ width: "100%" }}>📤 Ներբեռնել կուրսի JSON</button>
          </>)}

          {mode === "import" && (<>
            <div style={{ background: t.c.accentSoft, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, lineHeight: 1.55 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>💡 Ինչպե՞ս աշխատի այս ֆունկցիոնալը</div>
              <div style={{ color: t.c.text, marginBottom: 10 }}>
                1) Ներբեռնիր <a onClick={downloadTemplate} style={{ cursor: "pointer", textDecoration: "underline", color: t.c.accent, fontWeight: 600 }}>JSON տեմպլատը</a> (օրինակով լցված)<br />
                2) Բացիր այն ինչ-որ տեքստային editor-ով (օր. VSCode, Notepad++) կամ Excel-ով՝ դարձրու քո կուրսին համապատասխան<br />
                3) Պահպանիր ու բարձիր այստեղ — բարձումից առաջ ստուգում ենք սխալները
              </div>
              <button className="b24-btn b24-btn-ghost" onClick={downloadTemplate} style={{ padding: "6px 12px", fontSize: 12.5 }}>↓ Տեմպլատ ներբեռնել</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <input ref={fileRef} type="file" accept=".json,application/json" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} className="b24-btn b24-btn-primary" style={{ width: "100%", padding: 14, fontSize: 14, background: t.c.surface, color: t.c.text, border: `2px dashed ${t.c.accent}` }}>📁 Ընտրել JSON ֆայլ</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <Lbl t={t}>Կամ paste-անել JSON-ը այստեղ</Lbl>
              <textarea className="b24-input" rows={6} value={rawJson} onChange={(e) => { setRawJson(e.target.value); tryParse(e.target.value); }} placeholder='{"__format": "machtech-course-v1", ...}' style={{ resize: "vertical", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12 }} />
            </div>

            {errors.length > 0 && (
                <div style={{ background: t.c.bad + "11", border: `1px solid ${t.c.bad}66`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: t.c.bad, fontSize: 13, marginBottom: 6 }}>⚠️ Սխալներ ({errors.length})</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: t.c.text }}>
                    {errors.slice(0, 8).map((er, i) => <li key={i} style={{ marginBottom: 3 }}>{er}</li>)}
                    {errors.length > 8 && <li style={{ color: t.c.muted }}>...և {errors.length - 8} ուրիշ սխալ</li>}
                  </ul>
                </div>
            )}

            {parsedData && errors.length === 0 && (<>
              <div style={{ background: t.c.good + "11", border: `1px solid ${t.c.good}55`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, color: t.c.good, fontSize: 13, marginBottom: 8 }}>✓ Վավեր ֆայլ — պատրաստ է բարձման</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, fontSize: 12.5 }}>
                  <div><div style={{ fontWeight: 700, fontSize: 18 }}>{moduleCount}</div><div style={{ color: t.c.muted }}>մոդուլ</div></div>
                  <div><div style={{ fontWeight: 700, fontSize: 18 }}>{blockCount}</div><div style={{ color: t.c.muted }}>բլոկ</div></div>
                  <div><div style={{ fontWeight: 700, fontSize: 18 }}>{questionCount}</div><div style={{ color: t.c.muted }}>quiz հարց</div></div>
                  <div><div style={{ fontWeight: 700, fontSize: 18 }}>{finalCount}</div><div style={{ color: t.c.muted }}>final հարց</div></div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }} className="b24-grid-2-stack">
                <div>
                  <Lbl t={t}>Ի՞նչ ներբեռնել</Lbl>
                  <select className="b24-input" value={importTarget} onChange={(e) => setImportTarget(e.target.value)}>
                    <option value="all">Ամեն ինչ (մոդուլ + final + meta)</option>
                    <option value="modules">Միայն մոդուլներ</option>
                    <option value="final">Միայն final test</option>
                  </select>
                </div>
                <div>
                  <Lbl t={t}>Ինչպե՞ս</Lbl>
                  <select className="b24-input" value={importMode} onChange={(e) => setImportMode(e.target.value)}>
                    <option value="replace">Փոխարինել (հիմա կորում)</option>
                    <option value="merge">Ավելացնել ընթացիկներին</option>
                  </select>
                </div>
              </div>

              <button onClick={doImport} className="b24-btn b24-btn-primary" style={{ width: "100%", padding: 14, fontSize: 14 }}>
                📥 Ներբեռնել «{course.title}»-ի մեջ
              </button>
            </>)}
          </>)}
        </div>
      </div>
  );
}


function AdminContent({ t, course, content, persistContent, showToast }) {
  const [openMod, setOpenMod] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const cid = course.id;

  const updateCourse = (patch) => persistContent({ ...content, courses: { ...content.courses, [cid]: { ...course, ...patch } } });
  const updateModule = (idx, patch) => { const mods = course.modules.map((m, i) => i === idx ? { ...m, ...patch } : m); updateCourse({ modules: mods }); };
  const updateQuiz = (idx, quiz) => updateModule(idx, { quiz });
  const addModule = () => {
    const newN = course.modules.length + 1;
    const newMod = { id: `m${Date.now()}`, n: newN, title: "Նոր մոդուլ", duration: "15 րոպե", desc: "Նկարագրությունը", blocks: [], quiz: [{ q: "Օրինակ հարց", a: ["Տ1", "Տ2", "Տ3", "Տ4"], correct: 0 }] };
    updateCourse({ modules: [...course.modules, newMod] });
    setOpenMod(course.modules.length);
    showToast("Մոդուլ ավելացված ✓ Կարող ես խմբագրել");
  };
  const deleteModule = (idx) => { if (confirm("Ջնջե՞լ այս մոդուլը։")) { updateCourse({ modules: course.modules.filter((_, i) => i !== idx) }); if (openMod === idx) setOpenMod(null); showToast("Մոդուլը ջնջվեց"); } };
  const moveModule = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= course.modules.length) return;
    const arr = [...course.modules];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    arr.forEach((m, i) => { m.n = i + 1; });
    updateCourse({ modules: arr });
    if (openMod === idx) setOpenMod(j); else if (openMod === j) setOpenMod(idx);
  };
  const duplicateModule = (idx) => {
    const orig = course.modules[idx];
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = `m${Date.now()}`;
    copy.title = orig.title + " (պատճեն)";
    const arr = [...course.modules];
    arr.splice(idx + 1, 0, copy);
    arr.forEach((m, i) => { m.n = i + 1; });
    updateCourse({ modules: arr });
    setOpenMod(idx + 1);
    showToast("Մոդուլը կրկնօրինակվեց ✓");
  };
  const resetCourse = () => {
    if (cid === "crm-foundation" && confirm("Վերականգնե՞լ CRM Foundation-ի սկզբնական բովանդակությունը։")) {
      updateCourse({ modules: DEFAULT_MODULES, final: DEFAULT_FINAL });
      showToast("Վերականգնված ✓");
    }
  };

  /* ============ IMPORT / EXPORT ============ */
  const exportCourse = () => {
    const data = {
      __format: "machtech-course-v1",
      title: course.title,
      shortTitle: course.shortTitle,
      description: course.description,
      level: course.level,
      icon: course.icon,
      modules: course.modules,
      final: course.final
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(course.shortTitle || course.title).toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    showToast("Կուրսը արտահանվեց JSON-ի ✓");
  };

  const downloadTemplate = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(COURSE_TEMPLATE, null, 2)], { type: "application/json" }));
    a.download = "machtech-course-template.json";
    a.click();
    showToast("Տեմպլատը ներբեռնված է ✓");
  };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: t.c.muted, margin: 0, fontSize: 14 }}>«{course.title}» · {course.modules.length} մոդուլ · ավտո-պահպանում</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="b24-btn b24-btn-ghost" onClick={() => setImportOpen(true)} style={{ padding: "10px 16px", fontSize: 13 }}>📥 Import / Export</button>
            <button className="b24-btn b24-btn-primary" onClick={addModule} style={{ padding: "10px 18px", fontSize: 13.5 }}>+ Նոր մոդուլ</button>
            {cid === "crm-foundation" && <button className="b24-btn b24-btn-danger" onClick={resetCourse}>↺ Սկզբնականը</button>}
          </div>
        </div>
        {importOpen && <ImportExportModal t={t} course={course} updateCourse={updateCourse} exportCourse={exportCourse} downloadTemplate={downloadTemplate} onClose={() => setImportOpen(false)} showToast={showToast} />}
        {course.modules.length === 0 && <div style={{ ...t.card, textAlign: "center", padding: 40, color: t.c.muted }}>
          Դեռ չկան մոդուլներ։ Սեղմիր «+ Նոր մոդուլ»՝ առաջինը ստեղծելու համար, կամ <a onClick={() => setImportOpen(true)} style={{ cursor: "pointer", textDecoration: "underline", color: t.c.accent }}>ներբեռնիր ֆայլից</a>։
        </div>}
        {course.modules.map((m, idx) => (
            <div key={m.id} style={{ ...t.card, marginBottom: 12, padding: 0, border: openMod === idx ? `2px solid ${t.c.accent}` : `1px solid ${t.c.border}` }}>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div onClick={() => setOpenMod(openMod === idx ? null : idx)} style={{ cursor: "pointer", flex: "1 1 200px", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{m.n}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                    <div style={{ fontSize: 11.5, color: t.c.muted }}>{m.blocks?.length || 0} բլոկ · {m.quiz?.length || 0} հարց · {m.duration}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); moveModule(idx, -1); }} disabled={idx === 0} title="Վերև" style={{ background: "transparent", border: `1px solid ${t.c.border}`, borderRadius: 6, cursor: idx === 0 ? "not-allowed" : "pointer", padding: "5px 9px", color: idx === 0 ? t.c.border : t.c.muted, fontSize: 13 }}>↑</button>
                  <button onClick={(e) => { e.stopPropagation(); moveModule(idx, 1); }} disabled={idx === course.modules.length - 1} title="Ներքև" style={{ background: "transparent", border: `1px solid ${t.c.border}`, borderRadius: 6, cursor: idx === course.modules.length - 1 ? "not-allowed" : "pointer", padding: "5px 9px", color: idx === course.modules.length - 1 ? t.c.border : t.c.muted, fontSize: 13 }}>↓</button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateModule(idx); }} title="Կրկնօրինակել" style={{ background: "transparent", border: `1px solid ${t.c.border}`, borderRadius: 6, cursor: "pointer", padding: "5px 9px", color: t.c.muted, fontSize: 12 }}>⎘</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteModule(idx); }} title="Ջնջել" style={{ background: t.c.bad + "11", border: `1px solid ${t.c.bad}55`, borderRadius: 6, cursor: "pointer", padding: "5px 9px", color: t.c.bad, fontSize: 12 }}>🗑</button>
                  <button onClick={() => setOpenMod(openMod === idx ? null : idx)} title={openMod === idx ? "Փակել" : "Բացել"} style={{ background: openMod === idx ? t.c.dark : "transparent", border: `1px solid ${openMod === idx ? t.c.dark : t.c.border}`, borderRadius: 6, cursor: "pointer", padding: "5px 11px", color: openMod === idx ? BRAND.mint : t.c.muted, fontSize: 13, fontWeight: 700 }}>{openMod === idx ? "▲" : "▼"}</button>
                </div>
              </div>
              {openMod === idx && <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${t.c.border}` }}>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }} className="b24-grid-2-stack">
                  <label><Lbl t={t}>Վերնագիր</Lbl><input className="b24-input" value={m.title} onChange={(e) => updateModule(idx, { title: e.target.value })} /></label>
                  <label><Lbl t={t}>Տևողություն</Lbl><input className="b24-input" value={m.duration} onChange={(e) => updateModule(idx, { duration: e.target.value })} placeholder="20 րոպե" /></label>
                  <label><Lbl t={t}>Համարը</Lbl><input className="b24-input" type="number" value={m.n} onChange={(e) => updateModule(idx, { n: parseInt(e.target.value) || idx + 1 })} /></label>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Lbl t={t}>Կարճ նկարագրություն (քարտի վրա)</Lbl>
                  <input className="b24-input" value={m.desc || ""} onChange={(e) => updateModule(idx, { desc: e.target.value })} />
                </div>

                <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${t.c.border}` }}>
                  <BlockEditor t={t} blocks={m.blocks || []} legacyLesson={m.lesson} onChange={(blocks) => updateModule(idx, { blocks })} showToast={showToast} />
                </div>

                {m.quiz && <QuizEditor t={t} quiz={m.quiz} onChange={(q) => updateQuiz(idx, q)} showToast={showToast} />}
              </div>}
            </div>
        ))}

        {/* Final test editor */}
        <div style={{ ...t.card, marginTop: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>🏁 Եզրափակիչ թեստ</div>
          <FinalEditor t={t} course={course} content={content} persistContent={persistContent} showToast={showToast} />
        </div>
      </div>
  );
}
function Lbl({ t, children }) { return <span style={{ fontSize: 12.5, color: t.c.muted, display: "block", marginBottom: 4 }}>{children}</span>; }

const BLOCK_TYPES = [
  { type: "heading", label: "📌 Վերնագիր", make: () => ({ type: "heading", level: 3, text: "Նոր վերնագիր" }) },
  { type: "text", label: "📝 Տեքստ", make: () => ({ type: "text", text: "Գրիր այստեղ..." }) },
  { type: "video", label: "🎬 Վիդեո", make: () => ({ type: "video", url: "", caption: "" }) },
  { type: "image", label: "🖼 Նկար", make: () => ({ type: "image", url: "", caption: "" }) },
  { type: "callout", label: "💡 Հիշեցում", make: () => ({ type: "callout", variant: "info", title: "", text: "Կարևոր նշում..." }) },
  { type: "list", label: "📋 Ցուցակ", make: () => ({ type: "list", items: ["Կետ 1", "Կետ 2", "Կետ 3"] }) },
  { type: "quote", label: "💬 Մեջբերում", make: () => ({ type: "quote", text: "Մեջբերում...", author: "" }) },
  { type: "code", label: "🧩 Կոդ", make: () => ({ type: "code", text: "// կոդը այստեղ" }) },
  { type: "file", label: "📎 Ֆայլ", make: () => ({ type: "file", url: "", label: "Ֆայլի անուն", size: "" }) },
  { type: "divider", label: "─ Բաժանարար", make: () => ({ type: "divider" }) },
  { type: "embed", label: "</> HTML", make: () => ({ type: "embed", html: "<!-- raw HTML embed -->" }) }
];

function BlockEditor({ t, blocks, legacyLesson, onChange, showToast }) {
  const [openType, setOpenType] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  // Migrate legacy lesson to blocks on first edit
  const migrateLegacy = () => {
    if (!legacyLesson || legacyLesson.length === 0) return;
    if (blocks.length > 0) return;
    onChange(legacyLesson.map(p => ({ type: "text", text: p })));
    showToast("Հին տեքստը փոխարկվեց block-ների ✓");
  };

  const addBlock = (def, atIdx = null) => {
    const newBlock = def.make();
    const next = [...blocks];
    if (atIdx === null || atIdx >= blocks.length) next.push(newBlock);
    else next.splice(atIdx, 0, newBlock);
    onChange(next);
    setOpenType(false);
    setEditingIdx(atIdx === null ? next.length - 1 : atIdx);
  };

  const updateBlock = (i, patch) => onChange(blocks.map((b, j) => j === i ? { ...b, ...patch } : b));
  const deleteBlock = (i) => { if (confirm("Ջնջե՞լ այս բլոկը։")) onChange(blocks.filter((_, j) => j !== i)); };
  const moveBlock = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const duplicateBlock = (i) => {
    const next = [...blocks];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(blocks[i])));
    onChange(next);
  };

  return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>📦 Բովանդակության բլոկներ ({blocks.length})</div>
          {(blocks.length === 0 && legacyLesson?.length > 0) && (
              <button className="b24-btn b24-btn-ghost" onClick={migrateLegacy} style={{ padding: "6px 12px", fontSize: 12.5 }}>↗ Փոխարկել հին տեքստը block-ների</button>
          )}
        </div>

        {blocks.length === 0 && (!legacyLesson || legacyLesson.length === 0) && (
            <div style={{ background: t.c.surface2, border: `1px dashed ${t.c.border}`, borderRadius: 10, padding: 24, textAlign: "center", color: t.c.muted, fontSize: 13.5, marginBottom: 12 }}>
              Դեռ չկան բլոկներ։ Սեղմիր ներքևի «+» կոճակը՝ առաջինը ավելացնելու համար։
            </div>
        )}

        {blocks.map((b, i) => (
            <div key={i} style={{ position: "relative", background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: t.c.surface2, borderBottom: `1px solid ${t.c.border}`, borderRadius: "10px 10px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: t.c.muted, letterSpacing: ".04em" }}>
                  <span style={{ background: t.c.dark, color: BRAND.mint, width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  {BLOCK_TYPES.find(bt => bt.type === b.type)?.label || b.type.toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => moveBlock(i, -1)} disabled={i === 0} title="Վերև" style={{ background: "transparent", border: "none", cursor: i === 0 ? "not-allowed" : "pointer", padding: "4px 7px", color: i === 0 ? t.c.border : t.c.muted, fontSize: 14 }}>↑</button>
                  <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} title="Ներքև" style={{ background: "transparent", border: "none", cursor: i === blocks.length - 1 ? "not-allowed" : "pointer", padding: "4px 7px", color: i === blocks.length - 1 ? t.c.border : t.c.muted, fontSize: 14 }}>↓</button>
                  <button onClick={() => duplicateBlock(i)} title="Կրկնօրինակել" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px 7px", color: t.c.muted, fontSize: 13 }}>⎘</button>
                  <button onClick={() => deleteBlock(i)} title="Ջնջել" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px 7px", color: t.c.bad, fontSize: 13 }}>🗑</button>
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <BlockFields t={t} block={b} onChange={(patch) => updateBlock(i, patch)} />
              </div>
              {/* Insert button between blocks */}
              <button onClick={() => { setEditingIdx(i + 1); setOpenType(true); }} style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 24, height: 24, borderRadius: "50%", background: t.c.surface, border: `1px solid ${t.c.border}`, cursor: "pointer", fontSize: 13, color: t.c.muted, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, zIndex: 1 }} title="Ավելացնել ներքևից">+</button>
            </div>
        ))}

        {/* Add block at end */}
        <div style={{ marginTop: 12 }}>
          {openType ? (
              <div style={{ background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Ընտրիր բլոկի տիպը</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6 }}>
                  {BLOCK_TYPES.map(bt => (
                      <button key={bt.type} onClick={() => addBlock(bt, editingIdx)} className="b24-btn b24-btn-ghost" style={{ padding: "10px 8px", fontSize: 12.5, textAlign: "left" }}>{bt.label}</button>
                  ))}
                </div>
                <button onClick={() => setOpenType(false)} className="b24-btn b24-btn-ghost" style={{ marginTop: 10, padding: "6px 12px", fontSize: 12 }}>Չեղարկել</button>
              </div>
          ) : (
              <button onClick={() => { setEditingIdx(null); setOpenType(true); }} className="b24-btn b24-btn-primary" style={{ width: "100%", padding: 12, fontSize: 13.5 }}>+ Ավելացնել բլոկ</button>
          )}
        </div>
      </div>
  );
}

function BlockFields({ t, block, onChange }) {
  switch (block.type) {
    case "heading":
      return (<>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="b24-input" value={block.level || 3} onChange={(e) => onChange({ level: parseInt(e.target.value) })} style={{ width: 80 }}>
            <option value={2}>H2</option><option value={3}>H3</option>
          </select>
          <input className="b24-input" value={block.text} onChange={(e) => onChange({ text: e.target.value })} placeholder="Վերնագիր" />
        </div>
      </>);
    case "text":
      return <textarea className="b24-input" rows={4} value={block.text} onChange={(e) => onChange({ text: e.target.value })} style={{ resize: "vertical", lineHeight: 1.6 }} />;
    case "video":
      return (<>
        <input className="b24-input" value={block.url || ""} onChange={(e) => onChange({ url: e.target.value })} placeholder="YouTube / Vimeo / Loom / .mp4 URL" />
        <input className="b24-input" value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value })} placeholder="Caption (օպցիոն)" style={{ marginTop: 6 }} />
        {block.url && <div style={{ marginTop: 10, fontSize: 12, color: t.c.muted }}>✓ Նախատեսված է embed-ի համար</div>}
      </>);
    case "image":
      return (<>
        <input className="b24-input" value={block.url || ""} onChange={(e) => onChange({ url: e.target.value })} placeholder="Նկարի URL (https://...)" />
        <input className="b24-input" value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value })} placeholder="Caption (օպցիոն)" style={{ marginTop: 6 }} />
        {block.url && <img src={block.url} alt="" style={{ width: "100%", marginTop: 8, borderRadius: 8, maxHeight: 180, objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />}
      </>);
    case "callout":
      return (<>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <select className="b24-input" value={block.variant || "info"} onChange={(e) => onChange({ variant: e.target.value })} style={{ width: 140 }}>
            <option value="info">💡 Տեղեկատու</option><option value="success">✓ Հաջողություն</option>
            <option value="warn">⚠️ Ուշադրություն</option><option value="danger">⛔ Զգուշացում</option>
          </select>
          <input className="b24-input" value={block.title || ""} onChange={(e) => onChange({ title: e.target.value })} placeholder="Կարճ վերնագիր (օպցիոն)" />
        </div>
        <textarea className="b24-input" rows={3} value={block.text} onChange={(e) => onChange({ text: e.target.value })} style={{ resize: "vertical" }} />
      </>);
    case "list":
      return (
          <div>
            {(block.items || []).map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <span style={{ color: t.c.muted, paddingTop: 11 }}>•</span>
                  <input className="b24-input" value={it} onChange={(e) => onChange({ items: block.items.map((x, j) => j === i ? e.target.value : x) })} />
                  <button onClick={() => onChange({ items: block.items.filter((_, j) => j !== i) })} className="b24-btn b24-btn-danger" style={{ padding: "8px 10px" }}>🗑</button>
                </div>
            ))}
            <button onClick={() => onChange({ items: [...(block.items || []), "Նոր կետ"] })} className="b24-btn b24-btn-ghost" style={{ padding: "6px 12px", fontSize: 12.5 }}>+ Կետ</button>
          </div>
      );
    case "quote":
      return (<>
        <textarea className="b24-input" rows={2} value={block.text} onChange={(e) => onChange({ text: e.target.value })} placeholder="Մեջբերման տեքստը..." style={{ resize: "vertical" }} />
        <input className="b24-input" value={block.author || ""} onChange={(e) => onChange({ author: e.target.value })} placeholder="Հեղինակ (օպցիոն)" style={{ marginTop: 6 }} />
      </>);
    case "code":
      return <textarea className="b24-input" rows={5} value={block.text} onChange={(e) => onChange({ text: e.target.value })} style={{ resize: "vertical", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 }} />;
    case "file":
      return (<>
        <input className="b24-input" value={block.url || ""} onChange={(e) => onChange({ url: e.target.value })} placeholder="Ֆայլի URL" />
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input className="b24-input" value={block.label || ""} onChange={(e) => onChange({ label: e.target.value })} placeholder="Ֆայլի անունը" />
          <input className="b24-input" value={block.size || ""} onChange={(e) => onChange({ size: e.target.value })} placeholder="Չափ (օպց.)" style={{ width: 120 }} />
        </div>
      </>);
    case "divider":
      return <div style={{ color: t.c.muted, fontSize: 13, fontStyle: "italic" }}>Բաժանարար գիծ (խմբագրման կարիք չունի)</div>;
    case "embed":
      return <textarea className="b24-input" rows={4} value={block.html || ""} onChange={(e) => onChange({ html: e.target.value })} style={{ resize: "vertical", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12.5 }} placeholder="<iframe ...> կամ ուրիշ HTML" />;
    default: return null;
  }
}

/* ============== QUESTION TYPES ==============
 * Backward compatible: questions without explicit `type` are treated as 'single'.
 *
 * 'single'   — single correct answer, radio. { type:'single', q, a:[opts], correct:Number }
 * 'multiple' — multiple correct answers, checkboxes. { type:'multiple', q, a:[opts], correct:[Numbers] }
 * 'text'     — free text answer. { type:'text', q, accept:[strings], caseSensitive:bool, placeholder? }
 * 'ordering' — drag-or-button to reorder. items[] are stored in CORRECT order. { type:'ordering', q, items:[strings] }
 */

const QUESTION_TYPES = {
  single:   { icon: "○", label: "Մեկ ճիշտ պատասխան", short: "Single" },
  multiple: { icon: "☑", label: "Մի քանի ճիշտ պատասխան", short: "Multiple" },
  text:     { icon: "✎", label: "Բաց պատասխան (տեքստ)", short: "Text" },
  ordering: { icon: "↕", label: "Ճիշտ հերթականությամբ դասավորել", short: "Ordering" },
};

function qType(q) { return q?.type || "single"; }

function makeBlankQuestion(type) {
  switch (type) {
    case "multiple": return { type: "multiple", q: "Նոր հարց", a: ["Տարբերակ 1", "Տարբերակ 2", "Տարբերակ 3", "Տարբերակ 4"], correct: [0, 1] };
    case "text":     return { type: "text", q: "Նոր հարց", accept: ["պատասխան"], caseSensitive: false };
    case "ordering": return { type: "ordering", q: "Դասավորիր ճիշտ հերթականությամբ", items: ["Առաջին", "Երկրորդ", "Երրորդ", "Չորրորդ"] };
    default:         return { type: "single", q: "Նոր հարց", a: ["Տարբերակ 1", "Տարբերակ 2", "Տարբերակ 3", "Տարբերակ 4"], correct: 0 };
  }
}

// Check if a user's answer matches the correct answer; returns boolean
function isAnswerCorrect(q, userAnswer) {
  const tp = qType(q);
  if (userAnswer == null) return false;
  if (tp === "single") return userAnswer === q.correct;
  if (tp === "multiple") {
    const c = Array.isArray(q.correct) ? q.correct : [];
    const u = Array.isArray(userAnswer) ? userAnswer : [];
    if (c.length !== u.length) return false;
    const cs = [...c].sort().join(","); const us = [...u].sort().join(",");
    return cs === us;
  }
  if (tp === "text") {
    const u = String(userAnswer).trim();
    const accepts = q.accept || [];
    if (q.caseSensitive) return accepts.some(a => a.trim() === u);
    return accepts.some(a => a.trim().toLowerCase() === u.toLowerCase());
  }
  if (tp === "ordering") {
    if (!Array.isArray(userAnswer)) return false;
    if (userAnswer.length !== q.items.length) return false;
    return userAnswer.every((it, i) => it === q.items[i]);
  }
  return false;
}

// True if user has provided any answer (for "answer all required" checks)
function isAnswered(q, ua) {
  const tp = qType(q);
  if (ua == null) return false;
  if (tp === "single") return typeof ua === "number";
  if (tp === "multiple") return Array.isArray(ua) && ua.length > 0;
  if (tp === "text") return String(ua).trim().length > 0;
  if (tp === "ordering") return Array.isArray(ua) && ua.length === q.items.length;
  return false;
}

function QuizEditor({ t, quiz, onChange, showToast }) {
  const upd = (qi, patch) => onChange(quiz.map((q, i) => i === qi ? { ...q, ...patch } : q));
  const addQ = (type = "single") => onChange([...quiz, makeBlankQuestion(type)]);
  const delQ = (qi) => { if (confirm("Ջնջե՞լ այս հարցը։")) onChange(quiz.filter((_, i) => i !== qi)); };
  const moveQ = (qi, dir) => {
    const j = qi + dir; if (j < 0 || j >= quiz.length) return;
    const arr = [...quiz]; [arr[qi], arr[j]] = [arr[j], arr[qi]]; onChange(arr);
  };
  const dupQ = (qi) => {
    const arr = [...quiz]; arr.splice(qi + 1, 0, JSON.parse(JSON.stringify(quiz[qi]))); onChange(arr);
  };
  const changeType = (qi, newType) => {
    if (qType(quiz[qi]) === newType) return;
    if (!confirm(`Փոխե՞լ հարցի տիպը «${QUESTION_TYPES[newType].label}»-ի։ Ընթացիկ պատասխանները կզրոյանան։`)) return;
    const blank = makeBlankQuestion(newType);
    upd(qi, { ...blank, q: quiz[qi].q }); // preserve only the question text
  };
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
      <div style={{ marginTop: 16, borderTop: `1px dashed ${t.c.border}`, paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>📊 Quiz հարցեր ({quiz.length})</div>
          <div style={{ position: "relative" }}>
            <button className="b24-btn b24-btn-primary" onClick={() => setShowAddMenu(!showAddMenu)} style={{ padding: "7px 14px", fontSize: 12.5 }}>+ Հարց ▾</button>
            {showAddMenu && <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 20, minWidth: 220, overflow: "hidden" }}>
              {Object.entries(QUESTION_TYPES).map(([k, info]) => (
                  <button key={k} onClick={() => { addQ(k); setShowAddMenu(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: 13, color: t.c.text, borderBottom: `1px solid ${t.c.border}` }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{info.icon}</span>
                    {info.label}
                  </button>
              ))}
            </div>}
          </div>
        </div>
        {quiz.length === 0 && <div style={{ background: t.c.surface2, border: `1px dashed ${t.c.border}`, borderRadius: 8, padding: 18, textAlign: "center", color: t.c.muted, fontSize: 13 }}>Quiz հարցեր չկան</div>}
        {quiz.map((q, qi) => {
          const tp = qType(q);
          const tinfo = QUESTION_TYPES[tp];
          return (
              <div key={qi} style={{ background: t.c.surface2, borderRadius: 10, padding: 0, marginBottom: 10, border: `1px solid ${t.c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderBottom: `1px solid ${t.c.border}`, background: t.c.surface, borderRadius: "10px 10px 0 0", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 auto", minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 12.5, color: t.c.muted, letterSpacing: ".05em" }}>ՀԱՐՑ {qi + 1}</span>
                    <select value={tp} onChange={(e) => changeType(qi, e.target.value)} style={{ background: t.c.surface2, border: `1px solid ${t.c.border}`, borderRadius: 6, padding: "3px 6px", fontSize: 11.5, color: t.c.text, fontFamily: "inherit", cursor: "pointer" }}>
                      {Object.entries(QUESTION_TYPES).map(([k, info]) => <option key={k} value={k}>{info.icon} {info.short}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    <button onClick={() => moveQ(qi, -1)} disabled={qi === 0} title="Վերև" style={{ background: "transparent", border: "none", cursor: qi === 0 ? "not-allowed" : "pointer", padding: "3px 7px", color: qi === 0 ? t.c.border : t.c.muted, fontSize: 13 }}>↑</button>
                    <button onClick={() => moveQ(qi, 1)} disabled={qi === quiz.length - 1} title="Ներքև" style={{ background: "transparent", border: "none", cursor: qi === quiz.length - 1 ? "not-allowed" : "pointer", padding: "3px 7px", color: qi === quiz.length - 1 ? t.c.border : t.c.muted, fontSize: 13 }}>↓</button>
                    <button onClick={() => dupQ(qi)} title="Կրկնօրինակել" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.muted, fontSize: 12 }}>⎘</button>
                    <button onClick={() => delQ(qi)} title="Ջնջել" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.bad, fontSize: 12 }}>🗑</button>
                  </div>
                </div>
                <div style={{ padding: 10 }}>
                  <textarea className="b24-input" rows={2} value={q.q} onChange={(e) => upd(qi, { q: e.target.value })} placeholder="Հարցի տեքստը..." style={{ resize: "vertical" }} />
                  <QuestionTypeEditor t={t} q={q} qi={qi} upd={upd} showToast={showToast} />
                </div>
              </div>
          );
        })}
      </div>
  );
}

/* Sub-editor that switches based on question type */
function QuestionTypeEditor({ t, q, qi, upd, showToast }) {
  const tp = qType(q);

  if (tp === "single") {
    const updOpt = (oi, val) => upd(qi, { a: q.a.map((o, i) => i === oi ? val : o) });
    const addOpt = () => upd(qi, { a: [...q.a, `Տարբերակ ${q.a.length + 1}`] });
    const delOpt = (oi) => {
      if (q.a.length <= 2) return showToast("Նվազ. 2 տարբերակ պետք է լինի");
      const newA = q.a.filter((_, i) => i !== oi);
      let nc = q.correct;
      if (nc === oi) nc = 0; else if (nc > oi) nc = nc - 1;
      upd(qi, { a: newA, correct: nc });
    };
    return (<>
      <div style={{ marginTop: 8, display: "grid", gap: 5 }}>
        {q.a.map((opt, oi) => (
            <div key={oi} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="radio" checked={q.correct === oi} onChange={() => upd(qi, { correct: oi })} title="Ճիշտ պատասխան" style={{ accentColor: t.c.good, flexShrink: 0 }} />
              <input className="b24-input" value={opt} onChange={(e) => updOpt(oi, e.target.value)} style={{ borderColor: q.correct === oi ? t.c.good : t.c.border, fontSize: 13 }} />
              <button onClick={() => delOpt(oi)} disabled={q.a.length <= 2} style={{ background: q.a.length <= 2 ? "transparent" : t.c.bad + "11", border: "none", cursor: q.a.length <= 2 ? "not-allowed" : "pointer", padding: "6px 9px", color: q.a.length <= 2 ? t.c.border : t.c.bad, fontSize: 12, borderRadius: 5, flexShrink: 0 }}>×</button>
            </div>
        ))}
      </div>
      <button onClick={addOpt} className="b24-btn b24-btn-ghost" style={{ padding: "5px 12px", fontSize: 12, marginTop: 7 }}>+ Տարբերակ</button>
      <div style={{ fontSize: 11.5, color: t.c.muted, marginTop: 8 }}>○ Ընտրիր մեկ ճիշտ պատասխան (կանաչ radio-ով)</div>
    </>);
  }

  if (tp === "multiple") {
    const correctArr = Array.isArray(q.correct) ? q.correct : [];
    const toggleCorrect = (oi) => {
      const next = correctArr.includes(oi) ? correctArr.filter(x => x !== oi) : [...correctArr, oi];
      upd(qi, { correct: next });
    };
    const updOpt = (oi, val) => upd(qi, { a: q.a.map((o, i) => i === oi ? val : o) });
    const addOpt = () => upd(qi, { a: [...q.a, `Տարբերակ ${q.a.length + 1}`] });
    const delOpt = (oi) => {
      if (q.a.length <= 2) return showToast("Նվազ. 2 տարբերակ պետք է լինի");
      const newA = q.a.filter((_, i) => i !== oi);
      const newCorrect = correctArr.filter(c => c !== oi).map(c => c > oi ? c - 1 : c);
      upd(qi, { a: newA, correct: newCorrect });
    };
    return (<>
      <div style={{ marginTop: 8, display: "grid", gap: 5 }}>
        {q.a.map((opt, oi) => {
          const isC = correctArr.includes(oi);
          return (
              <div key={oi} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="checkbox" checked={isC} onChange={() => toggleCorrect(oi)} title="Ճիշտ պատասխան" style={{ accentColor: t.c.good, flexShrink: 0 }} />
                <input className="b24-input" value={opt} onChange={(e) => updOpt(oi, e.target.value)} style={{ borderColor: isC ? t.c.good : t.c.border, fontSize: 13 }} />
                <button onClick={() => delOpt(oi)} disabled={q.a.length <= 2} style={{ background: q.a.length <= 2 ? "transparent" : t.c.bad + "11", border: "none", cursor: q.a.length <= 2 ? "not-allowed" : "pointer", padding: "6px 9px", color: q.a.length <= 2 ? t.c.border : t.c.bad, fontSize: 12, borderRadius: 5, flexShrink: 0 }}>×</button>
              </div>
          );
        })}
      </div>
      <button onClick={addOpt} className="b24-btn b24-btn-ghost" style={{ padding: "5px 12px", fontSize: 12, marginTop: 7 }}>+ Տարբերակ</button>
      <div style={{ fontSize: 11.5, color: t.c.muted, marginTop: 8 }}>☑ Նշիր <b>բոլոր</b> ճիշտ պատասխանները։ User-ը ստանում է միավոր, եթե ՃՇԳՐՏ ընտրի բոլորը։</div>
    </>);
  }

  if (tp === "text") {
    const accepts = q.accept || [];
    const updAcc = (i, val) => upd(qi, { accept: accepts.map((a, j) => j === i ? val : a) });
    const addAcc = () => upd(qi, { accept: [...accepts, ""] });
    const delAcc = (i) => upd(qi, { accept: accepts.filter((_, j) => j !== i) });
    return (<>
      <div style={{ marginTop: 8 }}>
        <Lbl t={t}>Ընդունելի պատասխաններ (user-ի մուտքը պետք է համընկնի որևէ մեկին)</Lbl>
        <div style={{ display: "grid", gap: 5 }}>
          {accepts.length === 0 && <div style={{ fontSize: 12, color: t.c.muted, fontStyle: "italic" }}>Չկա ընդունելի պատասխան — ավելացրու հիմա</div>}
          {accepts.map((a, ai) => (
              <div key={ai} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: t.c.good, fontSize: 14, flexShrink: 0 }}>✓</span>
                <input className="b24-input" value={a} onChange={(e) => updAcc(ai, e.target.value)} placeholder="օր. CRM" style={{ borderColor: t.c.good, fontSize: 13 }} />
                <button onClick={() => delAcc(ai)} style={{ background: t.c.bad + "11", border: "none", cursor: "pointer", padding: "6px 9px", color: t.c.bad, fontSize: 12, borderRadius: 5, flexShrink: 0 }}>×</button>
              </div>
          ))}
        </div>
        <button onClick={addAcc} className="b24-btn b24-btn-ghost" style={{ padding: "5px 12px", fontSize: 12, marginTop: 7 }}>+ Ընդունելի պատասխան</button>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12.5, cursor: "pointer", color: t.c.muted }}>
        <input type="checkbox" checked={!!q.caseSensitive} onChange={(e) => upd(qi, { caseSensitive: e.target.checked })} style={{ accentColor: BRAND.mint }} />
        Մեծատառերի զգայունություն (case-sensitive)
      </label>
      <div style={{ fontSize: 11.5, color: t.c.muted, marginTop: 6 }}>✎ User-ի պատասխանը trim է լինում ({q.caseSensitive ? "ՃՇՏ" : "case-insensitive"} համեմատվում է)</div>
    </>);
  }

  if (tp === "ordering") {
    const items = q.items || [];
    const updIt = (i, val) => upd(qi, { items: items.map((it, j) => j === i ? val : it) });
    const addIt = () => upd(qi, { items: [...items, `Կետ ${items.length + 1}`] });
    const delIt = (i) => {
      if (items.length <= 2) return showToast("Նվազ. 2 կետ պետք է լինի");
      upd(qi, { items: items.filter((_, j) => j !== i) });
    };
    const moveIt = (i, dir) => {
      const j = i + dir; if (j < 0 || j >= items.length) return;
      const arr = [...items]; [arr[i], arr[j]] = [arr[j], arr[i]]; upd(qi, { items: arr });
    };
    return (<>
      <div style={{ marginTop: 8 }}>
        <Lbl t={t}>Կետերը՝ <b>ճիշտ հերթականությամբ</b> (user-ին կներկայացվեն խառն)</Lbl>
        <div style={{ display: "grid", gap: 5 }}>
          {items.map((it, ii) => (
              <div key={ii} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: BRAND.mint, color: t.c.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{ii + 1}</span>
                <input className="b24-input" value={it} onChange={(e) => updIt(ii, e.target.value)} style={{ fontSize: 13 }} />
                <button onClick={() => moveIt(ii, -1)} disabled={ii === 0} style={{ background: "transparent", border: `1px solid ${t.c.border}`, borderRadius: 5, cursor: ii === 0 ? "not-allowed" : "pointer", padding: "4px 8px", color: ii === 0 ? t.c.border : t.c.muted, fontSize: 11, flexShrink: 0 }}>↑</button>
                <button onClick={() => moveIt(ii, 1)} disabled={ii === items.length - 1} style={{ background: "transparent", border: `1px solid ${t.c.border}`, borderRadius: 5, cursor: ii === items.length - 1 ? "not-allowed" : "pointer", padding: "4px 8px", color: ii === items.length - 1 ? t.c.border : t.c.muted, fontSize: 11, flexShrink: 0 }}>↓</button>
                <button onClick={() => delIt(ii)} disabled={items.length <= 2} style={{ background: items.length <= 2 ? "transparent" : t.c.bad + "11", border: "none", cursor: items.length <= 2 ? "not-allowed" : "pointer", padding: "6px 9px", color: items.length <= 2 ? t.c.border : t.c.bad, fontSize: 12, borderRadius: 5, flexShrink: 0 }}>×</button>
              </div>
          ))}
        </div>
        <button onClick={addIt} className="b24-btn b24-btn-ghost" style={{ padding: "5px 12px", fontSize: 12, marginTop: 7 }}>+ Կետ</button>
      </div>
      <div style={{ fontSize: 11.5, color: t.c.muted, marginTop: 8 }}>↕ User-ին կներկայացվեն խառն, ինքը պետք է դասավորի։ Ճիշտ համարվում է, եթե ՃՇՏ կարգով համընկնի։</div>
    </>);
  }

  return null;
}


function FinalEditor({ t, course, content, persistContent, showToast }) {
  const [section, setSection] = useState("theory");
  const cid = course.id;
  const setFinal = (patch) => persistContent({ ...content, courses: { ...content.courses, [cid]: { ...course, final: { ...course.final, ...patch } } } });
  const f = course.final;

  if (section === "practical") {
    const upd = (i, q) => setFinal({ practical: f.practical.map((p, idx) => idx === i ? { q } : p) });
    const add = () => setFinal({ practical: [...f.practical, { q: "Նոր բաց հարց" }] });
    const del = (i) => { if (confirm("Ջնջե՞լ")) setFinal({ practical: f.practical.filter((_, idx) => idx !== i) }); };
    const move = (i, dir) => { const j = i + dir; if (j < 0 || j >= f.practical.length) return; const arr = [...f.practical]; [arr[i], arr[j]] = [arr[j], arr[i]]; setFinal({ practical: arr }); };
    const dup = (i) => { const arr = [...f.practical]; arr.splice(i + 1, 0, JSON.parse(JSON.stringify(f.practical[i]))); setFinal({ practical: arr }); };
    return (<>
      <FinalTabs t={t} section={section} setSection={setSection} f={f} />
      <button className="b24-btn b24-btn-primary" onClick={add} style={{ padding: "7px 14px", fontSize: 12.5, marginBottom: 10 }}>+ Բաց հարց</button>
      {f.practical.length === 0 && <div style={{ background: t.c.surface2, border: `1px dashed ${t.c.border}`, borderRadius: 8, padding: 18, textAlign: "center", color: t.c.muted, fontSize: 13 }}>Բաց հարցեր չկան</div>}
      {f.practical.map((p, i) => (
          <div key={i} style={{ background: t.c.surface2, borderRadius: 10, marginBottom: 8, border: `1px solid ${t.c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderBottom: `1px solid ${t.c.border}`, background: t.c.surface, borderRadius: "10px 10px 0 0" }}>
              <span style={{ fontWeight: 700, fontSize: 12.5, color: t.c.muted, letterSpacing: ".05em" }}>ԲԱՑ ՀԱՐՑ {i + 1}</span>
              <div style={{ display: "flex", gap: 3 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: "transparent", border: "none", cursor: i === 0 ? "not-allowed" : "pointer", padding: "3px 7px", color: i === 0 ? t.c.border : t.c.muted, fontSize: 13 }}>↑</button>
                <button onClick={() => move(i, 1)} disabled={i === f.practical.length - 1} style={{ background: "transparent", border: "none", cursor: i === f.practical.length - 1 ? "not-allowed" : "pointer", padding: "3px 7px", color: i === f.practical.length - 1 ? t.c.border : t.c.muted, fontSize: 13 }}>↓</button>
                <button onClick={() => dup(i)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.muted, fontSize: 12 }}>⎘</button>
                <button onClick={() => del(i)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.bad, fontSize: 12 }}>🗑</button>
              </div>
            </div>
            <div style={{ padding: 10 }}>
              <textarea className="b24-input" rows={3} value={p.q} onChange={(e) => upd(i, e.target.value)} style={{ resize: "vertical" }} />
            </div>
          </div>
      ))}
    </>);
  }

  const arr = f[section];
  const upd = (qi, patch) => setFinal({ [section]: arr.map((q, i) => i === qi ? { ...q, ...patch } : q) });
  const addQ = (type = "single") => setFinal({ [section]: [...arr, makeBlankQuestion(type)] });
  const del = (qi) => { if (confirm("Ջնջե՞լ")) setFinal({ [section]: arr.filter((_, i) => i !== qi) }); };
  const move = (qi, dir) => { const j = qi + dir; if (j < 0 || j >= arr.length) return; const a2 = [...arr]; [a2[qi], a2[j]] = [a2[j], a2[qi]]; setFinal({ [section]: a2 }); };
  const dup = (qi) => { const a2 = [...arr]; a2.splice(qi + 1, 0, JSON.parse(JSON.stringify(arr[qi]))); setFinal({ [section]: a2 }); };
  const changeType = (qi, newType) => {
    if (qType(arr[qi]) === newType) return;
    if (!confirm(`Փոխե՞լ հարցի տիպը «${QUESTION_TYPES[newType].label}»-ի։ Ընթացիկ պատասխանները կզրոյանան։`)) return;
    const blank = makeBlankQuestion(newType);
    upd(qi, { ...blank, q: arr[qi].q });
  };
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (<>
    <FinalTabs t={t} section={section} setSection={setSection} f={f} />
    <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
      <button className="b24-btn b24-btn-primary" onClick={() => setShowAddMenu(!showAddMenu)} style={{ padding: "7px 14px", fontSize: 12.5 }}>+ Հարց ▾</button>
      {showAddMenu && <div style={{ position: "absolute", left: 0, top: "100%", marginTop: 4, background: t.c.surface, border: `1px solid ${t.c.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 20, minWidth: 220, overflow: "hidden" }}>
        {Object.entries(QUESTION_TYPES).map(([k, info]) => (
            <button key={k} onClick={() => { addQ(k); setShowAddMenu(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: 13, color: t.c.text, borderBottom: `1px solid ${t.c.border}` }}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: t.c.dark, color: BRAND.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{info.icon}</span>
              {info.label}
            </button>
        ))}
      </div>}
    </div>
    {arr.length === 0 && <div style={{ background: t.c.surface2, border: `1px dashed ${t.c.border}`, borderRadius: 8, padding: 18, textAlign: "center", color: t.c.muted, fontSize: 13 }}>Հարցեր չկան</div>}
    {arr.map((q, qi) => {
      const tp = qType(q);
      return (
          <div key={qi} style={{ background: t.c.surface2, borderRadius: 10, marginBottom: 10, border: `1px solid ${t.c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderBottom: `1px solid ${t.c.border}`, background: t.c.surface, borderRadius: "10px 10px 0 0", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 12.5, color: t.c.muted, letterSpacing: ".05em" }}>ՀԱՐՑ {qi + 1}</span>
                <select value={tp} onChange={(e) => changeType(qi, e.target.value)} style={{ background: t.c.surface2, border: `1px solid ${t.c.border}`, borderRadius: 6, padding: "3px 6px", fontSize: 11.5, color: t.c.text, fontFamily: "inherit", cursor: "pointer" }}>
                  {Object.entries(QUESTION_TYPES).map(([k, info]) => <option key={k} value={k}>{info.icon} {info.short}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <button onClick={() => move(qi, -1)} disabled={qi === 0} style={{ background: "transparent", border: "none", cursor: qi === 0 ? "not-allowed" : "pointer", padding: "3px 7px", color: qi === 0 ? t.c.border : t.c.muted, fontSize: 13 }}>↑</button>
                <button onClick={() => move(qi, 1)} disabled={qi === arr.length - 1} style={{ background: "transparent", border: "none", cursor: qi === arr.length - 1 ? "not-allowed" : "pointer", padding: "3px 7px", color: qi === arr.length - 1 ? t.c.border : t.c.muted, fontSize: 13 }}>↓</button>
                <button onClick={() => dup(qi)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.muted, fontSize: 12 }}>⎘</button>
                <button onClick={() => del(qi)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "3px 7px", color: t.c.bad, fontSize: 12 }}>🗑</button>
              </div>
            </div>
            <div style={{ padding: 10 }}>
              <textarea className="b24-input" rows={2} value={q.q} onChange={(e) => upd(qi, { q: e.target.value })} placeholder="Հարցի տեքստ..." style={{ resize: "vertical" }} />
              <QuestionTypeEditor t={t} q={q} qi={qi} upd={upd} showToast={showToast} />
            </div>
          </div>
      );
    })}
  </>);
}
function FinalTabs({ t, section, setSection, f }) {
  return <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
    {[["theory", `Տեսություն (${f.theory.length})`], ["logic", `Տրամաբ (${f.logic.length})`], ["practical", `Բաց (${f.practical.length})`]].map(([k, l]) => (
        <button key={k} onClick={() => setSection(k)} className="b24-btn" style={{ padding: "8px 14px", fontSize: 13, background: section === k ? t.c.accent : t.c.surface2, color: section === k ? "#fff" : t.c.text }}>{l}</button>
    ))}
  </div>;
}
/* ============================================================================
   APP — API-backed root (replaces the browser-storage version)
   Bridges server (snake_case) <-> artifact components (camelCase) shapes.
   ============================================================================ */

// Convert a server course row (+modules) to the artifact's camelCase shape
function courseToClient(c) {
  return {
    id: c.id,
    title: c.title,
    shortTitle: c.short_title,
    description: c.description,
    level: c.level,
    icon: c.icon,
    status: c.status,
    accessMode: c.access_mode,
    grantedGroupIds: c.granted_group_ids || [],
    position: c.position,
    modules: (c.modules || []).map((m) => ({
      id: m.id, n: m.n, title: m.title, duration: m.duration,
      desc: m.description, blocks: m.blocks || [], quiz: m.quiz || []
    })),
    final: c.final_def || { theory: [], logic: [], practical: [] }
  };
}

// Convert a server enrollment row to artifact shape
function enrollmentToClient(e) {
  if (!e) return null;
  return {
    enrolledAt: e.enrolled_at ? new Date(e.enrolled_at).getTime() : Date.now(),
    progress: e.progress || {},
    quizScores: e.quiz_scores || {},
    quizLocked: e.quiz_locked || {},
    practice: e.practice || null,
    final: e.final_result || null
  };
}

// Convert a server user row (+enrollments) to artifact shape keyed by email
function userToClient(u, enrollmentsByCourse) {
  return {
    id: u.id,
    fullName: u.full_name,
    phone: u.phone,
    email: u.email,
    role: u.role,
    createdAt: u.created_at ? new Date(u.created_at).getTime() : Date.now(),
    accessGrants: u.access_grants || [],
    groupIds: u.group_ids || [],
    adminStatus: u.admin_status || "",
    adminNote: u.admin_note || "",
    enrollments: enrollmentsByCourse || {}
  };
}

export default function App({ initialCourses = [], initialOverrides = {} }: { initialCourses?: any[]; initialOverrides?: Record<string, string> }) {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);     // { id, email, role }
  const [content, setContent] = useState({
    courses: Object.fromEntries((initialCourses || []).map((c) => [c.id, courseToClient(c)])),
    i18nOverrides: initialOverrides || {},
    groups: {}
  });
  const [myEnrollments, setMyEnrollments] = useState({}); // { courseId: clientEnrollment }
  const [adminUsers, setAdminUsers] = useState({});       // { email: clientUser } — admin only
  const [session, setSession] = useState(null);           // email | "ADMIN" | null
  const [view, setView] = useState("landing");
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  // Load all courses (admin sees drafts too) + current session on mount
  const refreshContent = useCallback(async (asAdmin) => {
    try {
      const { courses } = await api.courses("modules", asAdmin);
      setContent((prev) => ({ ...prev, courses: Object.fromEntries((courses || []).map((c) => [c.id, courseToClient(c)])) }));
    } catch (e) {}
  }, []);

  const refreshMyEnrollments = useCallback(async () => {
    try {
      const { enrollments } = await api.myEnrollments();
      const map = {};
      (enrollments || []).forEach((e) => { map[e.course_id] = enrollmentToClient(e); });
      setMyEnrollments(map);
    } catch (e) {}
  }, []);

  const refreshAdminUsers = useCallback(async () => {
    try {
      const { users, enrollments } = await api.adminUsers();
      const enrByUser = {};
      (enrollments || []).forEach((e) => { (enrByUser[e.user_id] ||= {})[e.course_id] = enrollmentToClient(e); });
      const map = {};
      (users || []).forEach((u) => { map[u.email] = userToClient(u, enrByUser[u.id] || {}); });
      setAdminUsers(map);
    } catch (e) {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api.me();
        if (user) {
          setAuthUser(user);
          if (user.role === "admin") {
            setSession("ADMIN"); setView("admin");
            await refreshContent(true); await refreshAdminUsers();
          } else {
            setSession(user.email); setView("catalog");
            await refreshMyEnrollments();
          }
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const onAuthed = async (user) => {
    setAuthUser(user);
    if (user.role === "admin") {
      setSession("ADMIN"); setView("admin");
      await refreshContent(true); await refreshAdminUsers();
    } else {
      setSession(user.email); setView("catalog");
      await refreshMyEnrollments();
    }
  };

  const onLogout = async () => {
    await api.logout().catch(() => {});
    setAuthUser(null); setSession(null); setActiveCourseId(null); setMyEnrollments({}); setView("landing");
  };

  // ---- Enrollment operations (persist to server, update local) ----
  const enrollUser = useCallback(async (_email, courseId) => {
    try { await api.enroll(courseId); await refreshMyEnrollments(); }
    catch (e) { showToast(e.message); }
  }, [refreshMyEnrollments]);

  const updateEnrollment = useCallback((_email, courseId, patch) => {
    setMyEnrollments((prev) => {
      const cur = prev[courseId] || { enrolledAt: Date.now(), progress: {}, quizScores: {}, quizLocked: {}, practice: null, final: null };
      const next = typeof patch === "function" ? patch(cur) : { ...cur, ...patch };
      // Persist (snake_case)
      api.updateEnrollment(courseId, {
        progress: next.progress, quiz_scores: next.quizScores, quiz_locked: next.quizLocked,
        practice: next.practice, final_result: next.final
      }).catch(() => {});
      return { ...prev, [courseId]: next };
    });
  }, []);

  // ---- Admin: update a user (grants, groups, status) ----
  const updateUser = useCallback((email, patch) => {
    setAdminUsers((prev) => {
      const u = prev[email]; if (!u) return prev;
      const merged = { ...u, ...patch };
      api.updateUser({
        id: u.id,
        access_grants: merged.accessGrants, group_ids: merged.groupIds,
        admin_status: merged.adminStatus, admin_note: merged.adminNote
      }).catch(() => {});
      return { ...prev, [email]: merged };
    });
  }, []);

  // ---- Admin: persist content — diffs prev vs next and writes to server ----
  const persistContent = useCallback((next) => {
    setContent((prev) => {
      // 1. i18n overrides
      if (JSON.stringify(prev.i18nOverrides) !== JSON.stringify(next.i18nOverrides)) {
        api.saveI18n(next.i18nOverrides || {}).catch(() => {});
      }

      const prevCourses = prev.courses || {};
      const nextCourses = next.courses || {};

      // 2. Deleted courses
      Object.keys(prevCourses).forEach((id) => {
        if (!nextCourses[id]) api.deleteCourse(id).catch(() => {});
      });

      // 3. New or changed courses
      Object.entries(nextCourses).forEach(([id, c]) => {
        const before = prevCourses[id];
        if (!before) {
          // New course
          api.createCourse({
            id: c.id, title: c.title, short_title: c.shortTitle, description: c.description,
            level: c.level, icon: c.icon, status: c.status, access_mode: c.accessMode,
            position: c.position || 0, final_def: c.final || { theory: [], logic: [], practical: [] }
          }).catch(() => {});
          if ((c.modules || []).length) {
            api.adminContent({ course_id: id, action: "save_modules", modules: c.modules }).catch(() => {});
          }
          return;
        }
        // Meta changed (title/status/accessMode/etc)?
        const metaChanged = before.title !== c.title || before.shortTitle !== c.shortTitle ||
            before.description !== c.description || before.level !== c.level || before.icon !== c.icon ||
            before.status !== c.status || before.accessMode !== c.accessMode || before.position !== c.position ||
            JSON.stringify(before.grantedGroupIds) !== JSON.stringify(c.grantedGroupIds);
        if (metaChanged) {
          api.updateCourse(id, {
            title: c.title, short_title: c.shortTitle, description: c.description, level: c.level,
            icon: c.icon, status: c.status, access_mode: c.accessMode, position: c.position
          }).catch(() => {});
        }
        // Modules changed?
        if (JSON.stringify(before.modules) !== JSON.stringify(c.modules)) {
          api.adminContent({ course_id: id, action: "save_modules", modules: c.modules || [] }).catch(() => {});
        }
        // Final changed?
        if (JSON.stringify(before.final) !== JSON.stringify(c.final)) {
          api.adminContent({ course_id: id, action: "save_final", final_def: c.final }).catch(() => {});
        }
      });

      return next;
    });
  }, []);

  const accessibleCourses = useCallback((user) => {
    if (!user) return [];
    return Object.values(content.courses).filter((c) => {
      if (c.status !== "published") return false;
      if (c.accessMode === "open") return true;
      if ((user.accessGrants || []).includes(c.id)) return true;
      const userGroups = user.groupIds || [];
      const courseGroups = c.grantedGroupIds || [];
      return userGroups.some((g) => courseGroups.includes(g));
    });
  }, [content]);

  // currentUser for students built from authUser + myEnrollments
  const currentUser = (session && session !== "ADMIN" && authUser)
      ? userToClient(
          { id: authUser.id, email: authUser.email, full_name: authUser.full_name, role: authUser.role,
            access_grants: authUser.access_grants, group_ids: authUser.group_ids, created_at: authUser.created_at },
          myEnrollments
      )
      : null;

  const activeCourse = activeCourseId ? content.courses[activeCourseId] : null;
  const activeEnrollment = activeCourseId ? (myEnrollments[activeCourseId] || null) : null;
  const t = makeTokens(false);

  if (loading) return <div style={{ ...t.appWrap, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}><div style={{ color: t.muted }}>Բեռնում...</div></div>;

  return (
      <div style={t.appWrap}>
        <style dangerouslySetInnerHTML={{ __html: globalCSS(t) }} />
        <TopBar t={t} session={session} currentUser={currentUser}
                onHome={() => { setActiveCourseId(null); setView(session === "ADMIN" ? "admin" : currentUser ? "catalog" : "landing"); }}
                onLogout={onLogout} onLoginClick={() => setView("auth")} />
        {view === "landing" ? (
            <Landing t={t} onStart={() => setView("auth")} courses={Object.values(content.courses).filter((c) => c.status === "published")} content={content} />
        ) : (
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 18px 90px" }}>
              {view === "auth" && <Auth t={t} showToast={showToast} onAuthed={onAuthed} />}
              {view === "catalog" && currentUser && <Catalog t={t} user={currentUser} email={session} content={content} accessibleCourses={accessibleCourses(currentUser)} enrollUser={enrollUser}
                                                             onOpenCourse={(cid) => { setActiveCourseId(cid); setView("dashboard"); }} />}
              {view === "dashboard" && currentUser && activeCourse && !activeEnrollment && (() => {
                // Race-condition guard: course opened but enrollment not yet synced.
                // Kick off enrollment in the background and show a loading state.
                api.enroll(activeCourseId).then(() => refreshMyEnrollments()).catch(() => {});
                return <div style={{ padding: 60, textAlign: "center", color: t.c.muted }}>Բացում ենք դասընթացը...</div>;
              })()}
              {view === "dashboard" && currentUser && activeCourse && activeEnrollment && <Dashboard t={t} user={currentUser} email={session} course={activeCourse} enrollment={activeEnrollment}
                                                                                                     onBackToCatalog={() => { setActiveCourseId(null); setView("catalog"); }}
                                                                                                     onOpenModule={(i) => setView("module:" + i)} onOpenFinal={() => setView("final")} onOpenCert={() => setView("cert")} />}
              {view.startsWith("module:") && currentUser && activeCourse && activeEnrollment && <ModuleView t={t} idx={parseInt(view.split(":")[1], 10)} enrollment={activeEnrollment} email={session} courseId={activeCourseId}
                                                                                                            modules={activeCourse.modules} updateEnrollment={updateEnrollment} showToast={showToast} onBack={() => setView("dashboard")}
                                                                                                            onNext={(i) => setView(i < activeCourse.modules.length ? "module:" + i : "dashboard")} onOpenFinal={() => setView("final")} />}
              {view === "final" && currentUser && activeCourse && activeEnrollment && <FinalTest t={t} email={session} courseId={activeCourseId} enrollment={activeEnrollment} finalDef={activeCourse.final} updateEnrollment={updateEnrollment} onDone={() => setView("dashboard")} showToast={showToast} />}
              {view === "cert" && currentUser && activeCourse && activeEnrollment && <Certificate t={t} user={currentUser} enrollment={activeEnrollment} course={activeCourse} onBack={() => setView("dashboard")} />}
              {view === "admin" && session === "ADMIN" && <AdminPanel t={t} users={adminUsers} updateUser={updateUser} content={content} persistContent={persistContent} showToast={showToast} refreshContent={() => refreshContent(true)} />}
            </div>
        )}
        {toast && <div style={t.toast}>{toast}</div>}
      </div>
  );
}
