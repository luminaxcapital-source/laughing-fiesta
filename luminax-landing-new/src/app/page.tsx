"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, ChevronRight,
} from "lucide-react";

function burstParticles() {
  window.dispatchEvent(new Event("luminax-burst"));
}

function explodeParticles() {
  window.dispatchEvent(new Event("luminax-explode"));
}

function reformParticles() {
  window.dispatchEvent(new Event("luminax-reform"));
}

/* ═══════════════════════════════════════════════════════════════════════════
   WAITLIST MODAL
═══════════════════════════════════════════════════════════════════════════ */
function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [visible, setVisible]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
           if (res.status === 409) {
        setError("You're already on the mail list!");
        return;
      }
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.06)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full relative overflow-hidden rounded-[28px]"
        style={{
          maxWidth: "440px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(12px)",
          transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-[28px] px-8 py-10 font-sans" style={{ background: "#000000" }}>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!submitted ? (
            <>
              {/* Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/luminax-badge.png" alt="LuminaX" className="h-36 w-36 mb-6" />

              {/* Heading */}
              <h2 className="text-white font-bold text-[32px] leading-tight tracking-[-0.03em] mb-2">
                Join the Waitlist
              </h2>
              <p className="text-white/50 text-[14px] leading-relaxed mb-12">
                Be the first to access LuminaX when we launch<br />
                No spam — just your invite
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoFocus
                  className="w-full px-4 py-4 rounded-[14px] text-[15px] text-white placeholder-white/20 outline-none font-sans transition-all border-none"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="px-10 py-3 rounded-full text-[15px] font-bold tracking-[-0.01em] transition-all duration-200 font-sans mx-auto"
                  style={{
                    background: isValid ? "linear-gradient(135deg, #e0b55a 0%, #c8922e 100%)" : "rgba(255,255,255,0.07)",
                    color:      isValid ? "#07101e" : "rgba(255,255,255,0.25)",
                    cursor:     isValid ? "pointer" : "not-allowed",
                  }}
                >
                  {loading ? "Joining…" : "Request Early Access"}
                </button>
                {error && (
                  <p className="text-[#e0837a] text-[13px] -mt-1">{error}</p>
                )}
              </form>

              <p className="text-center text-white/20 text-[11px] mt-5 tracking-wide">
                🔒 &nbsp;Your email is safe with us. Unsubscribe anytime.
              </p>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center text-center py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="LuminaX" className="h-40 w-auto mb-6" />
              <h2 className="text-white font-bold text-[24px] tracking-[-0.03em] text-center mb-6">You&apos;re on the list!</h2>
              <p className="text-white/50 text-[14px] leading-relaxed mb-8">
                We&apos;ll reach out to <span className="text-[#d4b896] font-medium">{email}</span> as soon as LuminaX is ready for you.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full text-[14px] font-semibold text-[#07101e] font-sans transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #e0b55a, #c8922e)" }}
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════════════════ */
function LandingNav({ onWaitlist, onLogin }: { onWaitlist: () => void; onLogin: () => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-4 pr-[52px] max-[480px]:pr-[20px] py-[22px]"
      style={{ background: "linear-gradient(to bottom, rgba(4,10,22,0.80) 0%, transparent 100%)" }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="LuminaX"
        className="h-[150px] max-[480px]:h-[110px] w-auto cursor-default"
      />

      {/* CTA */}
      <div className="flex items-center gap-4 max-[480px]:gap-2">
        <span
          onClick={() => { burstParticles(); onLogin(); }}
          className="font-sans text-[11px] max-[480px]:text-[9px] font-medium text-white/40 cursor-pointer hover:text-white/70 transition-colors duration-150 whitespace-nowrap"
        >
          Sign in
        </span>
        <button
          onClick={() => { burstParticles(); explodeParticles(); onWaitlist(); }}
          className="font-sans font-medium text-[12px] max-[480px]:text-[9px] text-white rounded-full px-[16px] max-[480px]:px-[10px] py-[6px] max-[480px]:py-[5px] cursor-pointer transition-all duration-200 tracking-[0.01em] whitespace-nowrap"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "none",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 18px rgba(0,0,0,0.22)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.22)";
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,0.4), 0 0 24px rgba(255,255,255,0.35), 0 4px 18px rgba(0,0,0,0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 18px rgba(0,0,0,0.22)";
          }}
        >
          Join the Waitlist
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE STAR (animated background — reacts to mouse, bursts on CTA click)
═══════════════════════════════════════════════════════════════════════════ */
function ParticleStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
    let width = 0;
    let height = 0;

    function resize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      width = canvasEl.clientWidth;
      height = canvasEl.clientHeight;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const COUNT = isMobile ? 900 : 3800;
    const particles = Array.from({ length: COUNT }, () => {
      const u = Math.random();
      const v = Math.random();
      const roll = Math.random();
      return {
        theta: 2 * Math.PI * u,
        phi: Math.acos(2 * v - 1),
        scale: 1,
        vel: 0,
        kind: roll < 0.45 ? "gold" : roll < 0.8 ? "violet" : "white",
        breathePhase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.3 + Math.random() * 0.9,
        bright: Math.random() < 0.05,
        burstFactor: 1.3 + Math.random() * 2.2,
      };
    });

    const AMBIENT_COUNT = isMobile ? 70 : 450;
    const ambient = Array.from({ length: AMBIENT_COUNT }, () => {
      const roll = Math.random();
      return {
        x: Math.random(),
        y: Math.random(),
        size: 0.6 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.4,
        driftX: (Math.random() - 0.5) * 0.00009,
        driftY: (Math.random() - 0.5) * 0.00007,
        kind: roll < 0.4 ? "gold" : roll < 0.75 ? "violet" : "white",
      };
    });

    let rotY = 0;
    let time = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let hoverX = -99999;
    let hoverY = -99999;

    const REPEL_RADIUS = 60;
    const REPEL_STRENGTH = 2.4;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      hoverX = e.clientX - rect.left;
      hoverY = e.clientY - rect.top;
      const nx = (hoverX - rect.width / 2) / (rect.width / 2);
      const ny = (hoverY - rect.height / 2) / (rect.height / 2);
      targetTiltY = Math.max(-1, Math.min(1, nx)) * 0.4;
      targetTiltX = Math.max(-1, Math.min(1, -ny)) * 0.28;
    }
    function onMouseLeave() {
      targetTiltX = 0;
      targetTiltY = 0;
      hoverX = -99999;
      hoverY = -99999;
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas!.getBoundingClientRect();
      hoverX = t.clientX - rect.left;
      hoverY = t.clientY - rect.top;
      const nx = (hoverX - rect.width / 2) / (rect.width / 2);
      const ny = (hoverY - rect.height / 2) / (rect.height / 2);
      targetTiltY = Math.max(-1, Math.min(1, nx)) * 0.4;
      targetTiltX = Math.max(-1, Math.min(1, -ny)) * 0.28;
    }
    function onTouchEnd() {
      targetTiltX = 0;
      targetTiltY = 0;
      hoverX = -99999;
      hoverY = -99999;
    }
    function onBurst() {
      for (const p of particles) p.vel += 5 + Math.random() * 7;
    }

    let exploded = false;
    function onExplode() {
      exploded = true;
    }
    function onReform() {
      exploded = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("luminax-burst", onBurst);
    window.addEventListener("luminax-explode", onExplode);
    window.addEventListener("luminax-reform", onReform);

        let raf = 0;
    let frameCount = 0;
    function draw() {
      raf = requestAnimationFrame(draw);
      if (isMobile) {
        frameCount++;
        if (frameCount % 2 !== 0) return;
      }
      ctx!.clearRect(0, 0, width, height);
      rotY += 0.0011;
      time += 1;
      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.36;

      for (const a of ambient) {
        a.x += a.driftX;
        a.y += a.driftY;
        if (a.x < 0) a.x += 1; else if (a.x > 1) a.x -= 1;
        if (a.y < 0) a.y += 1; else if (a.y > 1) a.y -= 1;

        const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * 0.02 * a.speed + a.phase));
        const alpha = twinkle * 0.85;
        const color =
          a.kind === "gold"
            ? `rgba(224,181,90,${alpha})`
            : a.kind === "violet"
              ? `rgba(140,120,230,${alpha})`
              : `rgba(255,255,255,${alpha})`;
        ctx!.beginPath();
        ctx!.arc(a.x * width, a.y * height, a.size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }

      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
      glow.addColorStop(0, "rgba(224,181,90,0.16)");
      glow.addColorStop(0.55, "rgba(120,100,220,0.07)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(cx - R * 0.6, cy - R * 0.6, R * 1.2, R * 1.2);

      const proj: { x: number; y: number; z: number; kind: string; scale: number; bright: boolean }[] = [];

      for (const p of particles) {
        const target = exploded ? 1 + p.burstFactor : 1;
        p.vel += (target - p.scale) * 0.3;
        p.vel *= 0.6;
        p.vel = Math.max(-20, Math.min(20, p.vel));
        p.scale += p.vel * 0.05;
        p.scale = Math.max(0.05, Math.min(7, p.scale));

        const breathe = 1 + Math.sin(time * 0.02 * p.breatheSpeed + p.breathePhase) * 0.09;
        const rr = R * p.scale * breathe;
        const x = rr * Math.sin(p.phi) * Math.cos(p.theta + rotY);
        const y = rr * Math.cos(p.phi);
        const z = rr * Math.sin(p.phi) * Math.sin(p.theta + rotY);

        const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
        const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
        const x3 = x * Math.cos(tiltY) + z2 * Math.sin(tiltY);
        const z3 = -x * Math.sin(tiltY) + z2 * Math.cos(tiltY);

        const dx = (cx + x3) - hoverX;
        const dy = (cy + y2) - hoverY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS) {
          p.vel += (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        }

        proj.push({ x: x3, y: y2, z: z3, kind: p.kind, scale: p.scale, bright: p.bright });
      }

      proj.sort((a, b) => a.z - b.z);

      for (const pt of proj) {
        const depth = (pt.z + R) / (2 * R);
        const size = Math.max(0.1, (0.4 + depth * 1.7) * Math.min(pt.scale, 1.6));
        const alpha = Math.max(0, Math.min(1, (0.15 + depth * 0.7) / Math.sqrt(Math.max(pt.scale, 1))));
        if (!Number.isFinite(size) || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) continue;
        const color =
          pt.kind === "gold"
            ? `rgba(224,181,90,${alpha})`
            : pt.kind === "violet"
              ? `rgba(140,120,230,${alpha})`
              : `rgba(255,255,255,${alpha * 0.9})`;

        if (pt.bright && !isMobile) {
          const haloR = size * 5;
          const halo = ctx!.createRadialGradient(cx + pt.x, cy + pt.y, 0, cx + pt.x, cy + pt.y, haloR);
          const haloColor =
            pt.kind === "gold" ? "224,181,90" : pt.kind === "violet" ? "140,120,230" : "255,255,255";
          halo.addColorStop(0, `rgba(${haloColor},${alpha * 0.5})`);
          halo.addColorStop(1, `rgba(${haloColor},0)`);
          ctx!.beginPath();
          ctx!.fillStyle = halo;
          ctx!.arc(cx + pt.x, cy + pt.y, haloR, 0, Math.PI * 2);
          ctx!.fill();
        }

                ctx!.beginPath();
        ctx!.arc(cx + pt.x, cy + pt.y, pt.bright ? size * 1.8 : size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("luminax-burst", onBurst);
      window.removeEventListener("luminax-explode", onExplode);
      window.removeEventListener("luminax-reform", onReform);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
function Hero({ onWaitlist }: { onWaitlist: () => void }) {
  return (
      <section
        className="relative h-screen overflow-hidden flex items-center justify-center"
        style={{
          background: `
            radial-gradient(ellipse 75% 60% at 50% 42%, rgba(110,90,190,0.20) 0%, transparent 62%),
            radial-gradient(ellipse 55% 45% at 18% 85%, rgba(200,140,40,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 85% 15%, rgba(90,70,170,0.12) 0%, transparent 70%),
            linear-gradient(180deg, #0a0f1f 0%, #05080f 55%, #020306 100%)
          `,
        }}
      >
        {/* Animated particle star */}
        <ParticleStar />

        {/* Dark overlay: heavier on left, fades right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.00) 70%)" }}
        />

        {/* Top vignette */}
        <div
          className="absolute top-0 left-0 right-0 h-[180px] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(4,10,22,0.75) 0%, transparent 100%)" }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(4,10,22,0.90) 0%, transparent 100%)" }}
        />

        {/* Text column */}
        <div className="relative z-[2] pt-[200px] pb-[100px] px-[24px] md:px-[56px] max-w-[820px] flex flex-col items-center text-center">

          {/* Headline */}
          <h1
            className="font-normal uppercase text-white m-0 mb-6 leading-[1.22] tracking-[0.02em] text-center"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: "clamp(20px, 6vw, 37.5px)",
              textShadow: "0 2px 40px rgba(0,0,0,0.6)",
            }}
          >
            The Home of<br />
            On-Chain<br />
            Investments
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans font-bold leading-[1.72] text-white mb-12 text-center mx-auto md:whitespace-nowrap"
            style={{ fontSize: "16px", textShadow: "0 1px 20px rgba(0,0,0,0.5)" }}
          >
            All-in one platform for digital assets.<br className="md:hidden" /> Stablecoins, RWAs, crypto and beyond
          </p>

          {/* CTA */}
          <button
            onClick={() => { burstParticles(); explodeParticles(); onWaitlist(); }}
            className="relative overflow-hidden font-sans font-semibold text-[15px] rounded-full px-[30px] py-[15px] cursor-pointer transition-all duration-[220ms] tracking-[-0.1px]"
            style={{
              color: "#e8c374",
              background: "linear-gradient(135deg, rgba(224,181,90,0.1) 0%, rgba(200,146,46,0.1) 100%)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 28px rgba(210,150,50,0.22), 0 0 40px rgba(210,150,50,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.color = "#07101e";
              e.currentTarget.style.background =
                "linear-gradient(120deg, #f8e2ab 0%, #e0b55a 22%, #c8922e 45%, #f4d78a 60%, #c8922e 78%, #e8c374 100%)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -6px 12px rgba(120,80,20,0.35), 0 8px 40px rgba(210,150,50,0.55), 0 0 60px rgba(210,150,50,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.color = "#e8c374";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(224,181,90,0.1) 0%, rgba(200,146,46,0.1) 100%)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 28px rgba(210,150,50,0.22), 0 0 40px rgba(210,150,50,0.08)";
            }}
          >
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))" }}
            />
            <span className="relative z-[1] inline-flex items-center gap-[10px]">
              Join the Waitlist
              <span className="w-6 h-6 rounded-full bg-white/[0.18] flex items-center justify-center">
                <ChevronRight size={14} />
              </span>
            </span>
          </button>

        </div>

        {/* Partners */}
        <div className="absolute bottom-[90px] md:bottom-[36px] left-0 right-0 z-[2] flex items-center justify-center gap-9 px-[56px]">
          {[
            { name: "Privy", logo: "/partners/privy.png" },
            { name: "Enzyme", logo: "/partners/enzyme-icon.png" },
            { name: "Transak", logo: "/partners/transak-icon.png" },
          ].map((p) => (
            <span key={p.name} className="font-sans text-[11px] font-medium text-white/40 flex items-center gap-[7px] whitespace-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                className="w-4 h-4 rounded-full object-contain opacity-90"
                style={{ filter: "grayscale(1) contrast(2.5)" }}
              />
              {p.name}
            </span>
          ))}
        </div>
      </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE (default export — entry point for the designer)
═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  // "Sign in" is a placeholder — wire up your auth solution here
  const handleLogin = () => {
    console.log("Sign in clicked — connect your auth provider here");
  };

  return (
    <div className="bg-[#040a16]">
      <LandingNav onWaitlist={() => setTimeout(() => setShowWaitlist(true), 500)} onLogin={handleLogin} />
      <Hero onWaitlist={() => setTimeout(() => setShowWaitlist(true), 500)} />
      {showWaitlist && <WaitlistModal onClose={() => { reformParticles(); setShowWaitlist(false); }} />}
    </div>
  );
}
