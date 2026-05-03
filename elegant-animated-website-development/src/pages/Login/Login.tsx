import { useState, useEffect, useRef } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
 

/* ─── tiny helpers ─────────────────────────────────────────── */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Animated background particles ───────────────────────── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; dx: number; dy: number; alpha: number };
    const particles: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
        ctx.fill();
      });

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ─── Floating 3-D cubes (CSS only) ───────────────────────── */
function FloatingCube({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-12 h-12 rounded-lg border border-purple-500/30 bg-purple-900/20 backdrop-blur-sm animate-float"
      style={style}
    />
  );
}

/* ─── Input field ──────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
}
function Input({ label, icon, rightIcon, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value);

  return (
    <div className="relative">
      {/* floating label */}
      <label
        className={cn(
          "absolute left-11 text-sm transition-all duration-300 pointer-events-none z-10",
          focused || hasValue
            ? "top-1 text-[10px] text-purple-400"
            : "top-1/2 -translate-y-1/2 text-gray-400"
        )}
      >
        {label}
      </label>

      {/* left icon */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
        {icon}
      </span>

      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={cn(
          "w-full pt-5 pb-2 pl-10 pr-10 rounded-xl bg-white/5 border text-white text-sm outline-none transition-all duration-300",
          focused
            ? "border-purple-500 shadow-[0_0_16px_2px_rgba(168,85,247,0.25)]"
            : "border-white/10 hover:border-white/20"
        )}
      />

      {/* right icon */}
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-300 transition-colors">
          {rightIcon}
        </span>
      )}
    </div>
  );
}

/* ─── Main Login Component ─────────────────────────────────── */
export default function Login() {
  // "signin" = Sign Up  |  "login" = Log In
  const [mode, setMode] = useState<"signin" | "login">("signin");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const switchMode = (m: "signin" | "login") => {
    setMode(m);
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    setShowPass(false); setShowConfirm(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0015] font-sans">

      {/* ── radial glow blobs ── */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-purple-900/20 blur-[80px] pointer-events-none" />

      {/* ── particle canvas ── */}
      <Particles />

      {/* ── floating cubes ── */}
      <FloatingCube style={{ top: "10%", left: "7%", animationDelay: "0s", opacity: 0.5 }} />
      <FloatingCube style={{ top: "70%", left: "5%", animationDelay: "1.2s", opacity: 0.35 }} />
      <FloatingCube style={{ top: "20%", right: "8%", animationDelay: "0.6s", opacity: 0.4 }} />
      <FloatingCube style={{ top: "75%", right: "6%", animationDelay: "2s", opacity: 0.3 }} />
      <FloatingCube style={{ top: "45%", left: "2%", animationDelay: "1.8s", opacity: 0.25 }} />
      <FloatingCube style={{ top: "50%", right: "3%", animationDelay: "0.9s", opacity: 0.3 }} />

      {/* ── card ── */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md mx-4 transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* glowing border wrapper */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/60 via-violet-600/40 to-purple-900/60 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
          <div className="rounded-2xl bg-[#0d0020]/90 backdrop-blur-2xl px-8 py-10">

            {/* ── logo + brand ── */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-700/40">
                {/* TV / screen icon to match site logo */}
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                {/* animated ping */}
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500" />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Bros<span className="text-purple-400">AI</span>
                </h1>
                <p className="text-[11px] text-purple-300/70 tracking-widest uppercase mt-0.5">
                  Your AI Bros, Always There.
                </p>
              </div>
            </div>

            {/* ── tab switcher: Sign In first, then Login ── */}
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-8">
              {(["signin", "login"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                    mode === m
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-700/40"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {m === "signin" ? "Sign Up" : "Log In"}
                </button>
              ))}
            </div>

            {/* ── heading ── */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-white">
                {mode === "signin" ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {mode === "signin"
                  ? "Join the future of AI collaboration"
                  : "Sign in to continue with BrosAI"}
              </p>
            </div>

            {/* ── social buttons ── */}
            <div className="flex gap-3 mb-6">
              {/* Google */}
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white transition-all duration-300 group">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12c0 .68-.1 1.33-.26 1.96H12v-3.72h7.47A7.11 7.11 0 0 0 5.27 9.76z" />
                  <path fill="#FBBC05" d="M5.27 9.76A7.08 7.08 0 0 0 4.93 12c0 .77.13 1.52.34 2.23L2.18 16.4A11.97 11.97 0 0 1 0 12c0-1.62.32-3.17.9-4.58l4.37 2.34z" />
                  <path fill="#34A853" d="M12 19.07c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25A7.07 7.07 0 0 1 4.27 14.23l-4.09 3.18A11.96 11.96 0 0 0 12 24c3.24 0 5.95-1.05 7.93-2.79l-2.9-2.25A7.08 7.08 0 0 1 12 19.07z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.47a5.56 5.56 0 0 1-2.4 3.6l2.89 2.24c1.7-1.57 2.53-3.88 2.53-7.87z" />
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub */}
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.19a11.06 11.06 0 0 1 5.78 0C17.3 5.8 18.27 6.1 18.27 6.1c.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                <span>GitHub</span>
              </button>

              {/* Discord */}
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.32 4.37A19.8 19.8 0 0 0 15.5 3c-.22.4-.48.93-.65 1.35a18.32 18.32 0 0 0-5.7 0A13.3 13.3 0 0 0 8.5 3a19.7 19.7 0 0 0-4.83 1.38C.52 8.93-.32 13.37.1 17.74A19.9 19.9 0 0 0 6.18 21c.48-.66.9-1.36 1.26-2.09a12.96 12.96 0 0 1-2-.97c.17-.12.33-.25.49-.37a14.14 14.14 0 0 0 12.14 0c.16.13.32.25.49.37a12.99 12.99 0 0 1-2 .97c.36.73.78 1.43 1.26 2.1A19.85 19.85 0 0 0 23.9 17.74c.5-5.02-.85-9.42-3.58-13.37zM8.02 15.33c-1.22 0-2.22-1.13-2.22-2.52 0-1.38.97-2.52 2.22-2.52 1.25 0 2.24 1.13 2.22 2.52 0 1.39-.97 2.52-2.22 2.52zm7.96 0c-1.22 0-2.22-1.13-2.22-2.52 0-1.38.97-2.52 2.22-2.52 1.25 0 2.24 1.13 2.22 2.52 0 1.39-.96 2.52-2.22 2.52z" />
                </svg>
                <span>Discord</span>
              </button>
            </div>

            {/* ── divider ── */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or continue with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* ── fields (animated height transition) ── */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

              {/* Name – only for sign up */}
              <div
                className={cn(
                  "transition-all duration-500 overflow-hidden",
                  mode === "signin" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoComplete="name"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                    </svg>
                  }
                />
              </div>

              {/* Email */}
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                }
              />

              {/* Password */}
              <Input
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                autoComplete={mode === "signin" ? "new-password" : "current-password"}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
                  </svg>
                }
                rightIcon={
                  <span onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 4.02-5.364M9.88 9.88a3 3 0 1 0 4.243 4.243M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </span>
                }
              />

              {/* Confirm Password – only for sign up */}
              <div
                className={cn(
                  "transition-all duration-500 overflow-hidden",
                  mode === "signin" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <Input
                  label="Confirm Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  rightIcon={
                    <span onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 4.02-5.364M9.88 9.88a3 3 0 1 0 4.243 4.243M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </span>
                  }
                />
              </div>

              {/* Forgot password – only for login */}
              {mode === "login" && (
                <div className="text-right -mt-1">
                  <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* ── CTA button ── */}
              <button
                type="submit"
                className="relative w-full mt-2 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden group transition-all duration-300 active:scale-95"
              >
                {/* gradient bg */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:from-purple-500 group-hover:to-violet-500" />
                {/* shimmer */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                {/* glow */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(168,85,247,0.6)] rounded-xl" />
                <span className="relative flex items-center justify-center gap-2">
                  {mode === "signin" ? "Create Account" : "Sign In"}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>

              {/* terms – only sign up */}
              {mode === "signin" && (
                <p className="text-center text-[11px] text-gray-500">
                  By creating an account you agree to our{" "}
                  <span className="text-purple-400 cursor-pointer hover:text-purple-300">Terms of Service</span>{" "}
                  &amp;{" "}
                  <span className="text-purple-400 cursor-pointer hover:text-purple-300">Privacy Policy</span>
                </p>
              )}
            </form>

            {/* ── bottom switch ── */}
            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === "signin" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => switchMode(mode === "signin" ? "login" : "signin")}
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                {mode === "signin" ? "Log In" : "Sign Up"}
              </button>
            </p>

          </div>
        </div>

        {/* bottom badge */}
        <p className="mt-4 text-center text-[11px] text-purple-400/50 tracking-widest uppercase">
          ✦ &nbsp; The Future of AI Collaboration &nbsp; ✦
        </p>
      </div>

      {/* global animation styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-14px) rotate(3deg); }
          66% { transform: translateY(-7px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
