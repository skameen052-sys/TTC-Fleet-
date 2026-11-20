import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './animatedTruck.css';

export const Animated3DTruck = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [telemetrySpeed, setTelemetrySpeed] = useState(68);

  // 3D tilt coordinates
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const animFrameRef = useRef(null);
  const offsetRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Road Perspective Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 560);
    let height = (canvas.height = canvas.offsetHeight || 140);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 560;
      height = canvas.height = canvas.offsetHeight || 140;
    };

    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let speed = 2.4;
    let particles = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 15 + Math.random() * 45,
        speed: 3 + Math.random() * 5,
        alpha: 0.15 + Math.random() * 0.45,
      });
    }

    const render = () => {
      if (isVisibleRef.current) {
        // Adjust speed on hover
        const targetSpeed = isHovered ? 5.2 : 2.5;
        speed += (targetSpeed - speed) * 0.08;

        ctx.clearRect(0, 0, width, height);

        // 1. Dark Asphalt Highway Base
        const roadGrad = ctx.createLinearGradient(0, 0, 0, height);
        roadGrad.addColorStop(0, 'rgba(8, 14, 28, 0.4)');
        roadGrad.addColorStop(0.3, 'rgba(12, 19, 36, 0.85)');
        roadGrad.addColorStop(1, '#080d19');
        ctx.fillStyle = roadGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Wet Surface Reflection Sheen
        const sheenGrad = ctx.createRadialGradient(
          width * 0.35,
          height * 0.7,
          10,
          width * 0.35,
          height * 0.7,
          width * 0.45
        );
        sheenGrad.addColorStop(0, 'rgba(255, 230, 180, 0.16)');
        sheenGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.08)');
        sheenGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sheenGrad;
        ctx.fillRect(0, 0, width, height);

        // 3. Perspective Road Dashed Centerlines
        offsetRef.current = (offsetRef.current + speed) % 50;

        const vanishingY = -20;
        const vanishingX = width * 0.38;
        const numStripes = 8;

        for (let i = 0; i < numStripes; i++) {
          const progress = ((i * (height / numStripes) + offsetRef.current) % height) / height;
          if (progress < 0.1) continue;

          // Perspective scaling
          const y = progress * height;
          const stripeLen = 10 + progress * 26;
          const stripeWidth = 1.2 + progress * 3.8;

          // Road lane position in 3D projection
          const leftStripeX = vanishingX + (progress - 0.5) * (width * 0.65);
          const centerStripeX = vanishingX + (progress - 0.5) * (width * 0.35);

          // Draw white/amber dashed line
          ctx.beginPath();
          ctx.fillStyle = `rgba(245, 245, 245, ${0.15 + progress * 0.75})`;
          ctx.rect(leftStripeX, y, stripeWidth, stripeLen);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `rgba(251, 191, 36, ${0.1 + progress * 0.65})`;
          ctx.rect(centerStripeX, y + 4, stripeWidth * 0.8, stripeLen * 0.9);
          ctx.fill();
        }

        // 4. Asphalt Speed Texture Streaks
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          p.x -= p.speed * (isHovered ? 1.8 : 1);
          if (p.x < -p.len) {
            p.x = width + Math.random() * 40;
            p.y = 20 + Math.random() * (height - 25);
          }
          ctx.strokeStyle = `rgba(226, 232, 240, ${p.alpha * (0.3 + (p.y / height) * 0.7)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.len, p.y);
          ctx.stroke();
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isHovered]);

  // Smooth Telemetry Speed update on hover
  useEffect(() => {
    const target = isHovered ? 94 : 68;
    const interval = setInterval(() => {
      setTelemetrySpeed((prev) => {
        if (prev < target) return Math.min(target, prev + 2);
        if (prev > target) return Math.max(target, prev - 2);
        return prev;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Mouse tilt tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    setTilt({
      rx: -normY * 4, // max 4 deg pitch
      ry: normX * 5, // max 5 deg yaw
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="hero-truck-3d-stage"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      title="TTC Fleet360 - Interactive 3D Logistics Cruising Engine"
    >
      {/* 3D Scene Wrapper with Interactive Tilt */}
      <div
        className="hero-truck-3d-scene"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
      >
        {/* Layer 1: Background Sky, Stars, Skyline, Holographic Globes */}
        <div className="truck-bg-layer">
          <div className="truck-sky-gradient" />
          <div className="truck-stars-field" />

          {/* Distant City Skyline with Parallax Shift */}
          <div
            className="truck-city-skyline"
            style={{
              transform: `translateX(${tilt.ry * -1.5}px)`,
            }}
          >
            {[45, 60, 35, 75, 50, 90, 65, 80, 40, 70, 55, 85, 45, 95, 60, 75].map((h, i) => (
              <div
                key={i}
                className="skyline-building"
                style={{
                  width: `${14 + (i % 3) * 6}px`,
                  height: `${h}px`,
                }}
              />
            ))}
          </div>

          {/* Holographic Earth Globe with Flight Arcs */}
          <div
            className="truck-holo-globes"
            style={{
              transform: `translate(${tilt.ry * -2}px, ${tilt.rx * -1.5}px)`,
            }}
          >
            <svg viewBox="0 0 380 150" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="globeGlow3d" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#0284c7" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="arcGlow3d" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Holographic Sphere 1 */}
              <circle cx="90" cy="70" r="55" fill="url(#globeGlow3d)" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <ellipse cx="90" cy="70" rx="55" ry="22" fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4" />
              <ellipse cx="90" cy="70" rx="22" ry="55" fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4" />

              {/* Holographic Sphere 2 */}
              <circle cx="280" cy="65" r="65" fill="url(#globeGlow3d)" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.7" />
              <ellipse cx="280" cy="65" rx="65" ry="26" fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4" />
              <ellipse cx="280" cy="65" rx="26" ry="65" fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4" />

              {/* Global Flight Route Arcs */}
              <path
                d="M 60,80 Q 180,10 310,60"
                fill="none"
                stroke="url(#arcGlow3d)"
                strokeWidth="1.8"
                strokeDasharray="6 4"
              />
              <path
                d="M 120,60 Q 200,-5 260,85"
                fill="none"
                stroke="url(#arcGlow3d)"
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />

              {/* Logistics Route Location Pins */}
              <circle cx="60" cy="80" r="3.5" fill="#f97316" filter="drop-shadow(0 0 6px #f97316)" />
              <circle cx="120" cy="60" r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
              <circle cx="260" cy="85" r="3.5" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)" />
              <circle cx="310" cy="60" r="4" fill="#f59e0b" filter="drop-shadow(0 0 8px #f59e0b)" />
            </svg>
          </div>

          {/* Cargo Airplane in the Dusk Sky */}
          <div className="truck-airplane">
            <svg viewBox="0 0 24 24" width="22" height="14" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <div className="plane-beacon" />
          </div>
        </div>

        {/* Layer 2: Moving Highway Canvas */}
        <canvas ref={canvasRef} className="truck-road-canvas" />

        {/* Layer 3: Headlights & Ground Light Pool */}
        <div className="headlight-system">
          <div className="headlight-beam-left" style={{ opacity: isHovered ? 1 : 0.8 }} />
          <div className="headlight-beam-right" style={{ opacity: isHovered ? 1 : 0.8 }} />
          <div className="headlight-ground-pool" />
        </div>

        {/* Layer 4: The Heavy Hauler Truck Actor */}
        <div className="truck-actor-wrapper">
          <div className="truck-chassis-body">
            {/* Photorealistic Composite Truck Image */}
            <img
              src="/assets/dashboard-truck-hero.jpg"
              alt="TTC Fleet360 Heavy Commercial Prime Mover"
              className="truck-composite-img"
              onError={(e) => {
                e.target.src = '/assets/hero-orange-truck.jpg';
              }}
            />

            {/* Layer 5: Continuously Rotating Wheels */}
            {/* Wheel 1: Front Steer Axle */}
            <div className="wheel-assembly wheel-cab-steer">
              <div className="wheel-rotor">
                <div className="wheel-motion-blur" />
              </div>
            </div>

            {/* Wheel 2: Rear Tractor Drive Axle */}
            <div className="wheel-assembly wheel-cab-drive">
              <div className="wheel-rotor">
                <div className="wheel-motion-blur" />
              </div>
            </div>

            {/* Wheel 3: Trailer Axle 1 */}
            <div className="wheel-assembly wheel-trailer-1">
              <div className="wheel-rotor">
                <div className="wheel-motion-blur" />
              </div>
            </div>

            {/* Wheel 4: Trailer Axle 2 */}
            <div className="wheel-assembly wheel-trailer-2">
              <div className="wheel-rotor">
                <div className="wheel-motion-blur" />
              </div>
            </div>

            {/* Wheel 5: Trailer Axle 3 */}
            <div className="wheel-assembly wheel-trailer-3">
              <div className="wheel-rotor">
                <div className="wheel-motion-blur" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 6: 3D 360° Glowing Orbital Energy Ring */}
        <div className="orbital-360-container">
          <div className="orbital-ring-path" />

          {/* Glowing 360° Badge */}
          <div className="badge-360-wrap">
            <span>360°</span>
            <ArrowRight size={14} color="#f97316" strokeWidth={2.5} />
          </div>
        </div>

        {/* Layer 7: Telemetry Live HUD (Top Right) */}
        <div className="truck-telemetry-hud">
          <div className="telemetry-pulse-dot" />
          <span>{telemetrySpeed} KM/H</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span style={{ color: isHovered ? '#f97316' : '#10b981' }}>
            {isHovered ? 'CRUISE BOOST' : 'TELEMETRY LIVE'}
          </span>
        </div>

        {/* Subtle Hover Hint */}
        <div className="truck-hover-hint">
          {isHovered ? '⚡ ACCELERATING ON HIGHWAY' : 'HOVER TO BOOST SPEED'}
        </div>
      </div>
    </div>
  );
};
