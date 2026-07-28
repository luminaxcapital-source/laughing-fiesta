"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, ChevronRight,
} from "lucide-react";
import * as THREE from "three";

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
const STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * uSizeScale / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const STAR_FRAGMENT_SHADER = `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float alpha = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`;
const AMBIENT_VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vTwinkle = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * aSpeed + aPhase));
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const AMBIENT_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float alpha = (1.0 - smoothstep(0.0, 0.5, d)) * vTwinkle * 0.85;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const GOLD = new THREE.Color(224 / 255, 181 / 255, 90 / 255);
const VIOLET = new THREE.Color(140 / 255, 120 / 255, 230 / 255);
const WHITE = new THREE.Color(1, 1, 1);

function ParticleStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.z = 600;

    const group = new THREE.Group();
    scene.add(group);

    let R = 1;
    let sizeScale = 1;
    function computeR() {
      const safeHeight = height || 1;
      const safeWidth = width || 1;
      const worldHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const pxPerWorldUnit = safeHeight / worldHeight;
      R = (Math.min(safeWidth, safeHeight) * 0.36) / pxPerWorldUnit;
      sizeScale = 0.5 * safeHeight / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    }
    computeR();

    // Core glow sprite
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(224,181,90,0.35)");
    grad.addColorStop(0.55, "rgba(120,100,220,0.16)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowSprite = new THREE.Sprite(glowMaterial);
    scene.add(glowSprite);

    const COUNT = 3800;
    type Particle = {
      ux: number; uy: number; uz: number;
      scale: number; vel: number;
      breathePhase: number; breatheSpeed: number;
      bright: boolean; burstFactor: number;
    };
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      return {
        ux: Math.sin(phi) * Math.cos(theta),
        uy: Math.cos(phi),
        uz: Math.sin(phi) * Math.sin(theta),
        scale: 1,
        vel: 0,
        breathePhase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.3 + Math.random() * 0.9,
        bright: Math.random() < 0.05,
        burstFactor: 1.3 + Math.random() * 2.2,
      };
    });

    const starPositions = new Float32Array(COUNT * 3);
    const starColors = new Float32Array(COUNT * 3);
    const starSizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const roll = Math.random();
      const c = roll < 0.45 ? GOLD : roll < 0.8 ? VIOLET : WHITE;
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("aColor", new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));
    const starUniforms = {
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSizeScale: { value: sizeScale },
    };
    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    starPoints.frustumCulled = false;
    group.add(starPoints);

    const AMBIENT_COUNT = 300;
    const ambientPositions = new Float32Array(AMBIENT_COUNT * 3);
    const ambientColors = new Float32Array(AMBIENT_COUNT * 3);
    const ambientSizes = new Float32Array(AMBIENT_COUNT);
    const ambientPhases = new Float32Array(AMBIENT_COUNT);
    const ambientSpeeds = new Float32Array(AMBIENT_COUNT);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const roll = Math.random();
      const c = roll < 0.4 ? GOLD : roll < 0.75 ? VIOLET : WHITE;
      ambientColors[i * 3] = c.r;
      ambientColors[i * 3 + 1] = c.g;
      ambientColors[i * 3 + 2] = c.b;
      ambientPositions[i * 3] = (Math.random() - 0.5) * 1400;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 300 - 200;
      ambientSizes[i] = 1.5 + Math.random() * 4;
      ambientPhases[i] = Math.random() * Math.PI * 2;
      ambientSpeeds[i] = 0.6 + Math.random() * 1.4;
    }
    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute("position", new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeometry.setAttribute("aColor", new THREE.BufferAttribute(ambientColors, 3));
    ambientGeometry.setAttribute("aSize", new THREE.BufferAttribute(ambientSizes, 1));
    ambientGeometry.setAttribute("aPhase", new THREE.BufferAttribute(ambientPhases, 1));
    ambientGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(ambientSpeeds, 1));
    const ambientUniforms = { uTime: { value: 0 } };
    const ambientMaterial = new THREE.ShaderMaterial({
      vertexShader: AMBIENT_VERTEX_SHADER,
      fragmentShader: AMBIENT_FRAGMENT_SHADER,
      uniforms: ambientUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    ambientPoints.frustumCulled = false;
    scene.add(ambientPoints);

    function resize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      width = canvasEl.clientWidth || width;
      height = canvasEl.clientHeight || height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      computeR();
      starUniforms.uSizeScale.value = sizeScale;
    }
    window.addEventListener("resize", resize);

    let time = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let hoverX = -99999;
    let hoverY = -99999;

    const REPEL_RADIUS = 90;
    const REPEL_STRENGTH = 3.2;

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
      // No full-sphere tilt on touch — a finger dragging across the sphere
      // felt disorienting when it also rotated the whole group; only the
      // local repel dispersion near the finger is wanted here.
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

    const tmpVec = new THREE.Vector3();
    const screenMat = new THREE.Matrix4();
    let raf = 0;
    function draw() {
      raf = requestAnimationFrame(draw);
      time += 1;
      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;
      group.rotation.y += 0.0011;
      group.rotation.x = tiltX;
      group.rotation.z = tiltY * -1;

      ambientUniforms.uTime.value = time * 0.02;

      const posAttr = starGeometry.getAttribute("position") as THREE.BufferAttribute;
      const sizeAttr = starGeometry.getAttribute("aSize") as THREE.BufferAttribute;
      const hovering = hoverX > -50000;

      if (hovering) {
        group.updateMatrixWorld(true);
        camera.updateMatrixWorld();
        // Precompute one screen-space matrix per frame instead of running
        // .applyMatrix4().project() (3 matrix mults) per point. Same result,
        // but the per-point cost during touch drops to a single multiply.
        screenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(group.matrixWorld);
      }

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const target = exploded ? 1 + p.burstFactor : 1;
        p.vel += (target - p.scale) * 0.3;
        p.vel *= 0.6;
        p.vel = Math.max(-20, Math.min(20, p.vel));
        p.scale += p.vel * 0.05;
        p.scale = Math.max(0.05, Math.min(7, p.scale));

        const breathe = 1 + Math.sin(time * 0.02 * p.breatheSpeed + p.breathePhase) * 0.09;
        const rr = R * p.scale * breathe;
        const lx = p.ux * rr;
        const ly = p.uy * rr;
        const lz = p.uz * rr;

        posAttr.setXYZ(i, lx, ly, lz);
        const baseSize = (p.bright ? 5.2 : 2.4) * Math.min(p.scale, 1.6);
        sizeAttr.setX(i, baseSize);

        if (hovering) {
          tmpVec.set(lx, ly, lz).applyMatrix4(screenMat);
          const px = (tmpVec.x * 0.5 + 0.5) * width;
          const py = (1 - (tmpVec.y * 0.5 + 0.5)) * height;
          const dx = px - hoverX;
          const dy = py - hoverY;
          const distSq = dx * dx + dy * dy;
          if (distSq < REPEL_RADIUS * REPEL_RADIUS) {
            const dist = Math.sqrt(distSq);
            p.vel += (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          }
        }
      }
      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      renderer.render(scene, camera);
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
      starGeometry.dispose();
      starMaterial.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none select-none" />;
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
