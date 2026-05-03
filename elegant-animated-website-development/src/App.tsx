import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import {
  Brain,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronDown,
  MessageSquare,
  BarChart3,
  Globe,
  Star,
  Play,
  Menu,
  X,
  Bot,
  Cpu,
  Network,
  Layers,
  TrendingUp,
  Lock,
  Rocket,
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Section Reveal ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Orb ─────────────────────────────────────────────────────────────
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── Particle ─────────────────────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-violet-400"
      style={style}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Cursor Glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(139,92,246,0.06), transparent 60%)`,
      }}
    />
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length === current.length) {
            setTimeout(() => setDeleting(true), 1800);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 50 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Features", "How It Works", "Pricing", "Contact"];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0512]/90 backdrop-blur-xl border-b border-violet-900/30 shadow-lg shadow-violet-950/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl rotate-3" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
          </div>
          <span className="text-white font-syne font-bold text-xl tracking-tight">
            Bros<span className="text-violet-400">AI</span>
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-violet-200/70 hover:text-white transition-colors duration-200 tracking-wide font-medium"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-violet-300 hover:text-white transition-colors px-4 py-2 font-medium">
            Sign in
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40"
          >
            Get Early Access
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0512]/95 backdrop-blur-xl border-t border-violet-900/30 px-6 py-4 space-y-3"
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setOpen(false)}
                className="block text-violet-200/80 hover:text-white py-2 text-sm font-medium transition-colors"
              >
                {l}
              </a>
            ))}
            <button className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold py-3 rounded-xl">
              Get Early Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const particles = Array.from({ length: 30 }, (_) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#07030f]" id="about">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orbs */}
      <FloatingOrb className="w-[600px] h-[600px] bg-violet-600 top-[-200px] left-[-200px]" delay={0} />
      <FloatingOrb className="w-[500px] h-[500px] bg-fuchsia-700 bottom-[-100px] right-[-150px]" delay={2} />
      <FloatingOrb className="w-[300px] h-[300px] bg-purple-500 top-1/3 left-1/2" delay={4} />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-500/30 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-xs font-semibold text-violet-300 tracking-widest uppercase">
            The Future of AI Collaboration is Here
          </span>
          <Sparkles size={14} className="text-violet-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-syne font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-6 tracking-tight"
        >
          Your AI Bros,
          <br />
          <Typewriter words={["Always Ready.", "Always Smart.", "Always There.", "Built for You."]} />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-violet-200/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Bros AI is a next-generation platform where specialized AI agents work as your personal
          team — thinking, creating, and executing alongside you. One platform. Infinite capability.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139,92,246,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-xl shadow-violet-900/50 transition-all duration-300"
          >
            Get Early Access
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 border border-violet-500/30 text-violet-200 hover:text-white hover:border-violet-400/60 font-medium px-8 py-4 rounded-2xl text-base backdrop-blur-sm bg-violet-950/20 transition-all duration-300"
          >
            <Play size={16} className="text-violet-400" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { val: 10, suffix: "x", label: "Productivity Boost" },
            { val: 50, suffix: "K+", label: "Beta Waitlist" },
            { val: 99, suffix: "%", label: "Uptime Guaranteed" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-syne font-bold text-3xl text-white mb-1">
                <AnimatedCounter end={s.val} suffix={s.suffix} />
              </p>
              <p className="text-xs text-violet-400/70 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-violet-400/50 uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={20} className="text-violet-500/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── ABOUT / VISION ───────────────────────────────────────────────────────────
function About() {
  return (
    <section className="relative bg-[#07030f] py-32 overflow-hidden" id="about-section">
      <FloatingOrb className="w-[400px] h-[400px] bg-violet-700 top-0 right-0" delay={1} />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-violet-500 font-mono text-sm">01</span>
              <div className="h-px w-12 bg-violet-500/40" />
              <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">About</span>
            </div>
            <h2 className="font-syne font-bold text-4xl md:text-5xl text-white leading-tight">
              We built the AI team
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                you always deserved.
              </span>
            </h2>
            <p className="text-violet-200/55 text-lg leading-relaxed">
              Bros AI reimagines how humans and artificial intelligence collaborate. Instead of a single monolithic AI,
              we give you a crew — specialized AI agents that each excel at specific tasks and seamlessly work together.
            </p>
            <p className="text-violet-200/55 text-lg leading-relaxed">
              Whether you're building a startup, managing a creative studio, or scaling operations — Bros AI is the
              intelligent co-pilot that adapts to <em className="text-violet-300">your</em> world.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 text-violet-400 hover:text-white font-medium transition-colors"
            >
              Learn our story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative">
            {/* Central card */}
            <div className="relative bg-gradient-to-br from-violet-950/60 to-purple-950/40 border border-violet-700/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl shadow-violet-950/50">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain, label: "Cognitive AI", color: "from-violet-600 to-purple-700" },
                  { icon: Zap, label: "Instant Actions", color: "from-fuchsia-600 to-pink-700" },
                  { icon: Users, label: "Team Sync", color: "from-indigo-600 to-blue-700" },
                  { icon: Shield, label: "Privacy First", color: "from-emerald-600 to-teal-700" },
                ].map(({ icon: Icon, label, color }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="bg-violet-950/50 border border-violet-800/30 rounded-2xl p-4 flex flex-col gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-violet-100">{label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Floating tag */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl px-4 py-2 shadow-lg shadow-violet-900/50 flex items-center gap-2"
              >
                <Sparkles size={14} className="text-white" />
                <span className="text-xs font-bold text-white">AI-Powered</span>
              </motion.div>
            </div>

            {/* Floating stats card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-[#0f0720]/90 border border-violet-700/40 rounded-2xl p-4 backdrop-blur-md shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-white font-syne">
                  <AnimatedCounter end={127} suffix="%" />
                </p>
                <p className="text-xs text-violet-400/70">Avg. Efficiency Gain</p>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "Cognitive Multi-Agent System",
    desc: "Deploy a network of specialized AI agents — each with unique expertise — working in harmony to tackle complex, multi-step tasks autonomously.",
    tag: "Core AI",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    desc: "Chat with your AI team in plain language. Bros AI understands context, intent, and nuance — no prompting expertise needed.",
    tag: "UX",
    gradient: "from-fuchsia-600 to-pink-700",
  },
  {
    icon: Network,
    title: "Agent Collaboration Hub",
    desc: "Watch agents coordinate in real-time. Assign tasks, review progress, and direct your AI crew through an intuitive command interface.",
    tag: "Collaboration",
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics Dashboard",
    desc: "Understand exactly how your AI team performs with rich insights, task breakdowns, and productivity metrics in one unified view.",
    tag: "Analytics",
    gradient: "from-cyan-600 to-teal-700",
  },
  {
    icon: Globe,
    title: "Universal Integrations",
    desc: "Connect Bros AI to every tool in your stack — Slack, Notion, GitHub, CRM, and 500+ apps. Your AI team lives where you work.",
    tag: "Integrations",
    gradient: "from-orange-600 to-amber-600",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    desc: "End-to-end encryption, zero-data retention options, SOC 2 compliance, and granular access controls. Your data stays yours.",
    tag: "Security",
    gradient: "from-emerald-600 to-green-700",
  },
];

function Features() {
  return (
    <section className="relative bg-[#05020c] py-32 overflow-hidden" id="features">
      {/* Subtle glow */}
      <FloatingOrb className="w-[600px] h-[600px] bg-purple-800 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" delay={0} />

      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-violet-500 font-mono text-sm">02</span>
            <div className="h-px w-12 bg-violet-500/40" />
            <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">What We Do</span>
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mb-5">
            Built for the way
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> you think.</span>
          </h2>
          <p className="text-violet-200/50 text-lg max-w-xl mx-auto">
            Every feature is designed to amplify human creativity and decision-making — not replace it.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 30px 60px rgba(109,40,217,0.15)" }}
                  className="group relative bg-gradient-to-br from-violet-950/40 to-purple-950/20 border border-violet-800/20 hover:border-violet-600/40 rounded-3xl p-7 backdrop-blur-sm transition-all duration-500"
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5" />

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>

                  <span className="inline-block text-[10px] uppercase tracking-widest text-violet-500 font-bold mb-3 bg-violet-500/10 px-2 py-1 rounded-full">
                    {f.tag}
                  </span>

                  <h3 className="font-syne font-semibold text-lg text-white mb-3">{f.title}</h3>
                  <p className="text-violet-200/50 text-sm leading-relaxed">{f.desc}</p>

                  <div className="mt-6 flex items-center gap-1 text-violet-500 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Learn more <ArrowRight size={12} />
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Define Your Mission",
    desc: "Tell Bros AI what you want to achieve. Describe your goal in natural language — as if you're briefing a brilliant team.",
    icon: MessageSquare,
  },
  {
    num: "02",
    title: "AI Agents Assemble",
    desc: "Bros AI automatically selects and configures the right agents for your task, creating a tailored team in seconds.",
    icon: Users,
  },
  {
    num: "03",
    title: "Collaborative Execution",
    desc: "Your agent team coordinates, divides work, and executes with superhuman speed — while you stay in control.",
    icon: Cpu,
  },
  {
    num: "04",
    title: "Results Delivered",
    desc: "Receive polished outputs, insights, and actions — ready to use. Iterate and refine with a single message.",
    icon: Rocket,
  },
];

function HowItWorks() {
  return (
    <section className="relative bg-[#07030f] py-32 overflow-hidden" id="how-it-works">
      <FloatingOrb className="w-[500px] h-[500px] bg-fuchsia-800 bottom-0 left-0" delay={2} />

      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-violet-500 font-mono text-sm">03</span>
            <div className="h-px w-12 bg-violet-500/40" />
            <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">How It Works</span>
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mb-5">
            From idea to execution —
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              in four steps.
            </span>
          </h2>
        </Reveal>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.num} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group text-center relative"
                  >
                    {/* Step circle */}
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-700 mx-auto mb-6 shadow-xl shadow-violet-900/50 group-hover:shadow-violet-700/40 transition-shadow duration-500">
                      <Icon size={26} className="text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#07030f] border border-violet-700/50 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-violet-400">{s.num}</span>
                      </div>
                    </div>

                    <h3 className="font-syne font-semibold text-lg text-white mb-3">{s.title}</h3>
                    <p className="text-violet-200/50 text-sm leading-relaxed">{s.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SHOWCASE / DEMO ──────────────────────────────────────────────────────────
function Showcase() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Research Agent", icon: Brain },
    { label: "Creative Agent", icon: Sparkles },
    { label: "Analytics Agent", icon: BarChart3 },
  ];

  const demos = [
    {
      prompt: "Research the latest trends in generative AI for 2025 and summarize key findings.",
      response: [
        "📡 Scanning 1,240 research papers and news sources...",
        "🧠 Analyzing patterns across 6 domains...",
        "✅ Summary ready: 5 key trends identified with market impact scores.",
      ],
    },
    {
      prompt: "Write a compelling product description for our new AI platform targeting enterprise CTOs.",
      response: [
        "✍️ Analyzing brand voice and target persona...",
        "🎨 Generating 3 tone variants (confident, technical, visionary)...",
        "✅ Deliverable: 3 polished product descriptions with A/B test hooks.",
      ],
    },
    {
      prompt: "Analyze our Q4 sales data and identify top-performing customer segments.",
      response: [
        "📊 Connecting to data warehouse...",
        "🔍 Running cohort analysis across 47,000 records...",
        "✅ Report: 5 high-value segments identified with revenue projections.",
      ],
    },
  ];

  return (
    <section className="relative bg-[#05020c] py-32 overflow-hidden" id="showcase">
      <FloatingOrb className="w-[400px] h-[400px] bg-violet-700 top-0 right-0" delay={0} />

      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-violet-500 font-mono text-sm">04</span>
            <div className="h-px w-12 bg-violet-500/40" />
            <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">Live Demo</span>
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mb-4">
            See your AI team
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> in action.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          {/* Browser mock */}
          <div className="bg-gradient-to-br from-violet-950/60 to-purple-950/40 border border-violet-700/30 rounded-3xl overflow-hidden shadow-2xl shadow-violet-950/60 backdrop-blur-md">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-violet-800/30 bg-[#0a0314]/60">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 bg-violet-950/60 border border-violet-800/30 rounded-lg px-4 py-1.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-xs text-violet-400/60 font-mono">app.brosai.com/workspace</span>
              </div>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.label}
                      onClick={() => setActiveTab(i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === i
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40"
                          : "bg-violet-950/40 text-violet-400/70 hover:text-violet-200 border border-violet-800/30"
                      }`}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Chat area */}
              <div className="space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm px-5 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-lg shadow-violet-900/30">
                    {demos[activeTab].prompt}
                  </div>
                </div>

                {/* Agent response */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="space-y-2 flex-1">
                    {demos[activeTab].response.map((line, i) => (
                      <motion.div
                        key={`${activeTab}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.4 }}
                        className="bg-violet-950/50 border border-violet-800/20 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-violet-200/80"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="mt-6 flex items-center gap-3 bg-violet-950/40 border border-violet-800/30 rounded-2xl px-4 py-3">
                <input
                  readOnly
                  placeholder="Ask your AI team anything..."
                  className="flex-1 bg-transparent text-sm text-violet-200/70 placeholder:text-violet-600/40 outline-none"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight size={14} className="text-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Perfect for individuals exploring AI collaboration.",
    features: ["3 AI Agents", "100 tasks/month", "Basic integrations", "Community support"],
    cta: "Get Started",
    highlighted: false,
    gradient: "",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    desc: "For power users and growing teams.",
    features: ["15 AI Agents", "Unlimited tasks", "500+ integrations", "Priority support", "Advanced analytics", "Custom workflows"],
    cta: "Start Free Trial",
    highlighted: true,
    gradient: "from-violet-600 to-fuchsia-600",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations that need full control.",
    features: ["Unlimited agents", "Dedicated infrastructure", "SSO & SAML", "SLA guarantee", "Custom training", "24/7 support"],
    cta: "Contact Sales",
    highlighted: false,
    gradient: "",
  },
];

function Pricing() {
  return (
    <section className="relative bg-[#07030f] py-32 overflow-hidden" id="pricing">
      <FloatingOrb className="w-[500px] h-[500px] bg-purple-700 top-0 left-1/2 -translate-x-1/2" delay={1} />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-violet-500 font-mono text-sm">05</span>
            <div className="h-px w-12 bg-violet-500/40" />
            <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">Pricing</span>
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mb-4">
            Simple, transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> pricing.</span>
          </h2>
          <p className="text-violet-200/50 max-w-md mx-auto">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative rounded-3xl p-8 ${
                  p.highlighted
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-700 shadow-2xl shadow-violet-900/60 scale-105 z-10"
                    : "bg-gradient-to-br from-violet-950/50 to-purple-950/30 border border-violet-800/20"
                } transition-all duration-500`}
              >
                {p.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <h3 className="font-syne font-bold text-xl text-white mb-1">{p.name}</h3>
                <p className={`text-sm mb-5 ${p.highlighted ? "text-violet-200" : "text-violet-400/60"}`}>{p.desc}</p>

                <div className="flex items-baseline gap-1 mb-7">
                  <span className="font-syne font-bold text-4xl text-white">{p.price}</span>
                  <span className={`text-sm ${p.highlighted ? "text-violet-200" : "text-violet-400/60"}`}>{p.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${p.highlighted ? "bg-white/20" : "bg-violet-500/20"}`}>
                        <Star size={8} className={p.highlighted ? "text-white" : "text-violet-400"} />
                      </div>
                      <span className={p.highlighted ? "text-violet-100" : "text-violet-300/70"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    p.highlighted
                      ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                      : "border border-violet-600/40 text-violet-300 hover:border-violet-500 hover:text-white bg-violet-950/40"
                  }`}
                >
                  {p.cta}
                </motion.button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Anika Sharma",
    role: "CTO, NovaTech",
    quote: "Bros AI replaced an entire department's worth of research work. It's genuinely the smartest piece of software I've used in 15 years of building tech.",
    stars: 5,
  },
  {
    name: "Marcus Reid",
    role: "Founder, Pixel Studio",
    quote: "The creative agent blows my mind every single day. It's like having a world-class creative director available 24/7 for $49 a month.",
    stars: 5,
  },
  {
    name: "Priya Kapoor",
    role: "VP Strategy, GlobalX",
    quote: "We ran a 3-month pilot and the ROI was undeniable. Our team went from 60-hour weeks to 40 — and the output quality actually went up.",
    stars: 5,
  },
];

function Testimonials() {
  return (
    <section className="relative bg-[#05020c] py-32 overflow-hidden">
      <FloatingOrb className="w-[400px] h-[400px] bg-violet-700 bottom-0 right-0" delay={3} />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-violet-500 font-mono text-sm">06</span>
            <div className="h-px w-12 bg-violet-500/40" />
            <span className="text-violet-400/70 text-sm uppercase tracking-widest font-medium">They Trust Us</span>
          </div>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white">
            Loved by builders
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> everywhere.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-violet-950/50 to-purple-950/30 border border-violet-800/20 hover:border-violet-600/30 rounded-3xl p-7 transition-all duration-500"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-violet-400 fill-violet-400" />
                  ))}
                </div>
                <p className="text-violet-200/70 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-violet-400/60 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Multi-Agent AI", "Real-Time Collaboration", "Privacy First", "50K+ Users", "500+ Integrations", "Enterprise Ready", "24/7 Agents", "Zero Downtime", "Built Different"];
  return (
    <div className="relative overflow-hidden bg-[#07030f] py-6 border-y border-violet-900/30">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-4 text-sm font-medium text-violet-400/60 uppercase tracking-widest">
            <Sparkles size={12} className="text-violet-600" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="relative bg-[#07030f] py-32 overflow-hidden" id="contact">
      <FloatingOrb className="w-[700px] h-[700px] bg-violet-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={0} />
      <FloatingOrb className="w-[300px] h-[300px] bg-fuchsia-700 top-0 right-0" delay={2} />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-700 mb-8 shadow-2xl shadow-violet-900/60"
          >
            <Layers size={36} className="text-white" />
          </motion.div>

          <h2 className="font-syne font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            Ready to meet your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              AI Bros?
            </span>
          </h2>

          <p className="text-violet-200/50 text-lg max-w-xl mx-auto mb-10">
            Join 50,000+ forward-thinkers already on the waitlist. Be among the first to experience the future of AI collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-violet-950/50 border border-violet-700/40 text-violet-100 placeholder:text-violet-500/50 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-violet-500/70 transition-colors backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139,92,246,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-violet-900/50 whitespace-nowrap transition-all duration-300"
            >
              Join Waitlist
            </motion.button>
          </div>

          <p className="text-violet-500/50 text-xs">
            No credit card required. Free forever plan available.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#04020a] border-t border-violet-900/30 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-xl flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="text-white font-syne font-bold text-xl">
                Bros<span className="text-violet-400">AI</span>
              </span>
            </div>
            <p className="text-violet-400/50 text-sm leading-relaxed max-w-xs">
              The next-generation AI collaboration platform. Built for creators, builders, and teams who move fast.
            </p>
          </div>

          {[
            {
              label: "Product",
              links: ["Features", "Pricing", "Changelog", "Roadmap"],
            },
            {
              label: "Company",
              links: ["About", "Blog", "Careers", "Press"],
            },
            {
              label: "Legal",
              links: ["Privacy", "Terms", "Security", "Cookies"],
            },
          ].map((col) => (
            <div key={col.label}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{col.label}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-violet-400/50 hover:text-violet-300 text-sm transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-violet-900/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-violet-500/40 text-xs">© 2025 Bros AI. All rights reserved.</p>
          <p className="text-violet-500/40 text-xs flex items-center gap-1.5">
            Built with <Sparkles size={10} className="text-violet-500" /> for the future
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .font-syne { font-family: 'Syne', sans-serif; }
        * { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #04020a; }
        ::-webkit-scrollbar-thumb { background: #6d28d9; border-radius: 3px; }
        ::selection { background: rgba(139,92,246,0.3); color: white; }
      `}</style>

      <CursorGlow />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Features />
      <HowItWorks />
      <Showcase />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
