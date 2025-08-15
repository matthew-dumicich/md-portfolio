"use client";
import { useEffect, useRef } from "react";

export default function Starfield({ density = 0.00018 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const scrollingRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const stars: Array<{ x: number; y: number; r: number; tw: number }> = [];

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const SCALE = 0.6; // slightly reduced render resolution

    const resize = () => {
      const w = Math.floor(window.innerWidth * SCALE);
      const h = Math.floor(window.innerHeight * SCALE);
      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      stars.length = 0;
      const count = Math.floor(window.innerWidth * window.innerHeight * density * SCALE);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          tw: Math.random() * 2 + 0.5,
        });
      }
    };

    let t = 0;
    const draw = () => {
      if (!runningRef.current) return;
      if (scrollingRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      t += 0.016;
      ctx.fillStyle = "#0a0c10";
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.tw + s.x);
        ctx.globalAlpha = 0.6 + 0.4 * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      if (scrollingRef.current) clearTimeout(scrollingRef.current);
      scrollingRef.current = window.setTimeout(() => {
        if (scrollingRef.current) clearTimeout(scrollingRef.current);
        scrollingRef.current = null;
      }, 120);
    };

    const start = () => {
      runningRef.current = true;
      resize();
      rafRef.current = requestAnimationFrame(draw);
    };

    // Defer starting until the browser is idle/after input
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(start, { timeout: 500 });
    } else {
      setTimeout(start, 0);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        runningRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(draw);
      }
    });

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 block"
      style={{ imageRendering: "auto" }}
      aria-hidden="true"
    />
  );
}