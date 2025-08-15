"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, cubicBezier } from "framer-motion";
import Starfield from "../components/Starfield";
import { projects } from "./work/projects";

/* smooth scrolling for hash links */
function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const onClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
    links.forEach((a) => a.addEventListener("click", onClick));
    return () => links.forEach((a) => a.removeEventListener("click", onClick));
  }, []);
}

const easeFn = cubicBezier(0.16, 1, 0.3, 1);

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeFn } },
};

export default function Page() {
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Measure header and apply padding + scroll-padding
  useEffect(() => {
    const update = () => {
      const h = headerRef.current?.offsetHeight ?? 64;
      const el = scrollerRef.current;
      if (el) {
        el.style.scrollPaddingTop = `${h}px`;
        el.style.scrollPaddingBottom = `${h}px`;
        el.style.paddingTop = `${h}px`;
        el.style.paddingBottom = `${h}px`;
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

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

      <header ref={headerRef} className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="#home" className="font-medium tracking-tight text-[#f5f5f0]">md.</a>
          <nav className="flex gap-5 text-sm">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="transition-opacity hover:opacity-80">{n.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <div id="snapper" ref={scrollerRef} className="relative z-10 h-[100svh] overflow-y-auto snap-y snap-mandatory">
        {/* HOME */}
        <motion.section id="home" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="snap-center [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto w-full max-w-5xl">
            <h1 className="mb-4 text-4xl font-semibold md:text-6xl">Matthew Dumicich</h1>
            <p className="max-w-xl text-base text-[#dcdcd4] md:text-lg">AI-focused software engineer & final-year Computer Science (AI) student in Melbourne. I build tidy, reliable interfaces for messy, real-world data problems.</p>
            <div className="mt-8 flex gap-3 text-sm">
              <a href="#work" className="rounded-2xl border border-[#f5f5f0]/20 px-5 py-2 transition hover:bg-white/5">View Work</a>
              <a href="#contact" className="rounded-2xl border border-[#f5f5f0]/20 px-5 py-2 transition hover:bg-white/5">Contact</a>
            </div>
          </div>
        </motion.section>

        {/* ABOUT */}
        <motion.section id="about" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="snap-center [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-12">
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

        {/* WORK */}
        <motion.section id="work" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="snap-center [scroll-snap-stop:always] min-h-[100svh] grid place-items-center px-5">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="mb-4 md:mb-6 text-2xl font-semibold">Selected Work</h2>
            <div className="relative">
              <ul
                className="grid gap-3 md:gap-4 md:grid-cols-2 pr-1 overflow-y-auto rounded-2xl"
                style={{ maxHeight: "min(70vh, calc(100svh - 12rem))", WebkitOverflowScrolling: "touch" as const }}
              >
                {projects.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    variants={sectionVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="group rounded-2xl border border-white/10 p-5 transition hover:bg-white/[0.04]"
                  >
                    <a href={`/work/${p.slug}`} className="block">
                      <div className="mb-1 text-sm uppercase tracking-wide text-[#b6b6ad]">
                        Project {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-lg font-medium">{p.title}</h3>
                      <p className="mt-2 text-sm text-[#d0d0c8]">{p.desc}</p>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0b0d10] to-transparent md:hidden" />
            </div>
          </div>
        </motion.section>

        {/* CONTACT */}
        <motion.section id="contact" variants={sectionVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="snap-center [scroll-snap-stop:always] min-h-[100svh] grid grid-rows-[1fr_auto] px-5">
          <div className="mx-auto w-full max-w-5xl self-center">
            <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
            <p className="max-w-2xl text-[#dcdcd4]">Available for full-time roles, graduate roles, and collaborations.</p>
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
