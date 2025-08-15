"use client";

import { useEffect, useRef } from "react";

/** STARFIELD – fixed timestep + visibility safe */
export default function Starfield({ density = 0.00018 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(false);
  const starsRef = useRef<Array<{ x: number; y: number; r: number; tw: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const count = Math.floor(w * h * density);
      const rand = (n = 1) => Math.random() * n;
      starsRef.current = Array.from({ length: count }, () => ({
        x: rand(canvas.width),
        y: rand(canvas.height),
        r: Math.max(0.4, Math.random() * 1.6) * dpr,
        tw: 0.5 + Math.random() * 1.2,
      }));
    };

    const mediaReduce: MediaQueryList | null =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let t = 0;
    let last = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      t += dt;

      const stars = starsRef.current;
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin((t * s.tw + i * 0.15) * 0.9));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 240, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      if (!mediaReduce?.matches) {
        const dx = 6 * dt;
        const dy = 5 * dt;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.x += dx * (i % 3 === 0 ? 1 : -1);
          s.y += dy * (i % 2 === 0 ? 1 : -1);
          if (s.x < 0) s.x += W; if (s.x > W) s.x -= W;
          if (s.y < 0) s.y += H; if (s.y > H) s.y -= H;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      last = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    };
    const stop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const onResize = () => {
      stop();
      init();
      start();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stop();
      } else {
        last = performance.now();
        start();
      }
    };

    const onPageHide = () => stop();
    const onPageShow = () => { init(); start(); };

    const onReduceChange = () => { stop(); start(); };

    // init & run
    init();
    start();

    // listeners
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    if (mediaReduce) {
      if (typeof mediaReduce.addEventListener === "function") {
        mediaReduce.addEventListener("change", onReduceChange);
      } else if (typeof (mediaReduce as { addListener?: (cb: (ev: MediaQueryListEvent) => void) => void }).addListener === "function") {
        (mediaReduce as { addListener: (cb: (ev: MediaQueryListEvent) => void) => void }).addListener(onReduceChange);
      }
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      if (mediaReduce) {
        if (typeof mediaReduce.removeEventListener === "function") {
          mediaReduce.removeEventListener("change", onReduceChange);
        } else if (typeof (mediaReduce as { removeListener?: (cb: (ev: MediaQueryListEvent) => void) => void }).removeListener === "function") {
          (mediaReduce as { removeListener: (cb: (ev: MediaQueryListEvent) => void) => void }).removeListener(onReduceChange);
        }
      }
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 block" />;
}
