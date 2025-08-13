"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, cubicBezier } from "framer-motion";

function Starfield({ density = 0.00018 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; tw: number }[]>([]);

  const resize = () => {
    const canvas = canvasRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const count = Math.floor(w * h * density);
    const rand = (n = 1) => Math.random() * n;
    starsRef.current = Array.from({ length: count }, () => ({
      x: rand(canvas.width),
      y: rand(canvas.height),
      r: Math.max(0.4, Math.random() * 1.6) * dpr,
      tw: 0.5 + Math.random() * 1.2,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let t = 0;
    const draw = () => {
      const stars = starsRef.current;
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin((t * s.tw + i) * 0.003));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 240, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += 0.005 * (i % 3 === 0 ? 1 : -1);
        s.y += 0.004 * (i % 2 === 0 ? 1 : -1);
        if (s.x < 0) s.x += W; if (s.x > W) s.x -= W;
        if (s.y < 0) s.y += H; if (s.y > H) s.y -= H;
      }
      t += 1;
      animationRef.current = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 block" />;
}

function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const onClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    links.forEach((a) => a.addEventListener("click", onClick));
    return () => links.forEach((a) => a.removeEventListener("click", onClick));
  }, []);
}

const easeFn = cubicBezier(0.16, 1, 0.3, 1);

const sectionVariant = {
  hidden: { opacity: 0, y: 80, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: easeFn },
  },
};

export default function Portfolio() {
  useSmoothScroll();
  const navItems = useMemo(() => [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "contact", label: "Contact" },
  ], []);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#0a0c10] to-[#0b0d10] text-[#f5f5f0] antialiased">
      <Starfield />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="#home" className="font-medium tracking-tight text-[#f5f5f0]">md.</a>
          <nav className="flex gap-5 text-sm">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="transition-opacity hover:opacity-80">{n.label}</a>
            ))}
          </nav>
        </div>
      </header>
      <div id="snapper" className="relative z-10 h-[100svh] overflow-y-auto snap-y snap-mandatory">
        <motion.section id="home" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="snap-start [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto w-full max-w-5xl">
            <h1 className="mb-4 text-4xl font-semibold md:text-6xl">Matthew Dumicich</h1>
            <p className="max-w-xl text-base text-[#dcdcd4] md:text-lg">AI-focused software engineer & final-year Computer Science (AI) student in Melbourne. I build tidy, reliable interfaces for messy, real-world data problems.</p>
            <div className="mt-8 flex gap-3 text-sm">
              <a href="#work" className="rounded-2xl border border-[#f5f5f0]/20 px-5 py-2 transition hover:bg-white/5">View Work</a>
              <a href="#contact" className="rounded-2xl border border-[#f5f5f0]/20 px-5 py-2 transition hover:bg-white/5">Contact</a>
            </div>
          </div>
        </motion.section>
        <motion.section id="about" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="snap-start [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="mb-4 text-2xl font-semibold">About</h2>
              <p className="max-w-prose text-[#dcdcd4]">I enjoy taking ambiguous data problems and turning them into simple, robust products. Recently that’s meant building face-embedding systems with metric learning, tightening anti-spoofing, and shipping small, useful apps that help people get answers quickly.</p>
              <p className="mt-4 max-w-prose text-[#dcdcd4]">I’m in my final year of a BCompSci (AI) at Swinburne. Outside uni, I manage weekends at a camping retailer — great training for calm problem-solving and clear comms.</p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-white/10 p-4">
                <div className="mb-2 text-sm font-medium text-[#bcbcb5]">Now</div>
                <ul className="grid gap-2 text-sm text-[#e0e0d8]">
                  <li>• Face verification & anti-spoofing experiments</li>
                  <li>• Anomaly detection for access logs</li>
                  <li>• <span className="italic">Testy</span>: teacher tools for MCQ generation</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
        <motion.section id="work" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="snap-start [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="mb-8 text-2xl font-semibold">Selected Work</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Face Verification & Anti-spoofing", desc: "TensorFlow + metric learning; anti-spoofing detection; production-ready API.", href: "#" },
                { title: "Anomaly Detection for Healthcare Access", desc: "Event pipelines, embeddings, and visual audit tools.", href: "#" },
                { title: "Testy — MCQ Generator for Teachers", desc: "Next.js + Firebase + GPT; generates curriculum-aligned MCQs.", href: "#" },
                { title: "Animal Classifier", desc: "Compact CNN for mobile with explainability tools.", href: "#" },
              ].map((p, i) => (
                <motion.li key={p.title} variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="group rounded-2xl border border-white/10 p-5 transition hover:bg-white/[0.04]">
                  <a href={p.href} className="block">
                    <div className="mb-1 text-sm uppercase tracking-wide text-[#b6b6ad]">Project {String(i + 1).padStart(2, "0")}</div>
                    <h3 className="text-lg font-medium">{p.title}</h3>
                    <p className="mt-2 text-sm text-[#d0d0c8]">{p.desc}</p>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>
        <motion.section id="contact" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="snap-start [scroll-snap-stop:always] min-h-[100svh] grid grid-rows-[1fr_auto] px-5">
          <div className="mx-auto w-full max-w-5xl self-center">
            <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
            <p className="max-w-2xl text-[#dcdcd4]">Available for internships, graduate roles, and collaborations.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a href="mailto:mdumicich@gmail.com" className="rounded-2xl border border-[#f5f5f0]/20 px-4 py-2 transition hover:bg-white/5">Email</a>
              <a href="https://www.linkedin.com/in/matthew-dumicich" className="rounded-2xl border border-[#f5f5f0]/20 px-4 py-2 transition hover:bg-white/5">LinkedIn</a>
              <a href="https://github.com/matthew-dumicich" className="rounded-2xl border border-[#f5f5f0]/20 px-4 py-2 transition hover:bg-white/5">GitHub</a>
            </div>
          </div>
          <footer className="pt-10 text-xs text-[#a8a89f] self-end text-center">© {new Date().getFullYear()} Matthew Dumicich. All rights reserved.</footer>
        </motion.section>
      </div>
    </main>
  );
}
