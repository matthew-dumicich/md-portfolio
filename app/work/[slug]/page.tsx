// app/work/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "../projects";
import dynamic from "next/dynamic";
const Starfield = dynamic(() => import("../../../components/Starfield"), { ssr: false });

type Params = { slug: string };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> } // ← must be Promise
): Promise<Metadata> {
  const { slug } = await params;           // ← await before use
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} · Matthew Dumicich`,
    description: p.desc,
  };
}

export default async function ProjectPage(
  { params }: { params: Promise<Params> }  // ← must be Promise
) {
  const { slug } = await params;           // ← await before use
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#0a0c10] to-[#0b0d10] text-[#f5f5f0] antialiased">
      <Starfield />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-medium tracking-tight text-[#f5f5f0]">md.</Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/#work" className="transition-opacity hover:opacity-80">Back to Work</Link>
            <Link href="/#contact" className="transition-opacity hover:opacity-80">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-10 md:py-14">
        <div className="mb-6 text-sm uppercase tracking-wide text-[#b6b6ad]">
          {p.year ?? ""} • Project
        </div>
        <h1 className="text-3xl font-semibold md:text-5xl">{p.title}</h1>
        <p className="mt-4 max-w-2xl text-[#dcdcd4]">{p.desc}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <li key={t} className="rounded-2xl border border-white/10 px-3 py-1 text-xs text-[#e0e0d8]">
              {t}
            </li>
          ))}
        </ul>

        {p.problem && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Problem</h2>
            <p className="max-w-prose text-[#dcdcd4]">{p.problem}</p>
          </section>
        )}

        {!!p.approach?.length && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Approach</h2>
            <ul className="grid list-disc gap-2 pl-5 text-[#dcdcd4]">
              {p.approach.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}

        {!!p.outcomes?.length && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Outcomes</h2>
            <ul className="grid list-disc gap-2 pl-5 text-[#dcdcd4]">
              {p.outcomes.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </section>
        )}

        {!!p.links?.length && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Links</h2>
            <ul className="flex flex-wrap gap-3 text-sm">
              {p.links.map((l) => (
                <li key={l.href}>
                  <a
                    className="rounded-2xl border border-[#f5f5f0]/20 px-4 py-2 transition hover:bg-white/5"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}