import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Server, FlaskConical, Rocket, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import { useLang } from '@/i18n/language';
import Section, { SectionLabel, SectionTitle } from '@/components/Section';
import CtaSection from '@/components/CtaSection';
import EmptyState from '@/components/EmptyState';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import { divisions, type DivisionId } from '@/data/divisions';
import { techFields } from '@/data/techFields';
import { labEntries } from '@/data/labs';

const DIVISION_ICONS: Record<DivisionId, LucideIcon> = {
  intelligence: BrainCircuit,
  engineering: Server,
  research: FlaskConical,
  ventures: Rocket,
};

function useScrolled(offset: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

function useParallax() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

export default function Home() {
  useSeo({
    title: 'YX',
    description:
      'YX is an independent technology company exploring new possibilities, engineering advanced systems, and developing ambitious projects that shape the future.',
    path: '/',
  });

  const scrolled = useScrolled(400);
  const parallaxRef = useParallax();
  const divisionsRef = useHomeSectionRef();
  const explorerRef = useHomeSectionRef();
  const workRef = useHomeSectionRef();
  const labsRef = useHomeSectionRef();
  const visionRef = useHomeSectionRef();

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-16">
        <div
          ref={parallaxRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
          <div className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)' }}
          />
          <div className="absolute left-[15%] top-[60%] h-64 w-64 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%)' }}
          />
          <div className="absolute right-[12%] top-[18%] h-72 w-72 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%)' }}
          />
        </div>

        <div className="container-yx relative flex flex-col items-center text-center">
          <LanguageSelector />
          <span className="yx-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            Technology Company
          </span>
          <h1 className="yx-fade-up yx-delay-1 text-5xl font-bold leading-[1.05] tracking-tight md:text-8xl">
            YX
            <span className="mt-2 block text-3xl tracking-tight text-muted md:text-5xl" style={{ fontWeight: 600 }}>
              BUILDING WHAT COMES NEXT.
            </span>
          </h1>
          <p className="yx-fade-up yx-delay-2 mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            An independent technology company exploring new possibilities, engineering
            advanced systems, and developing ambitious projects that shape the future.
          </p>
          <div className="yx-fade-up yx-delay-3 mt-12 flex flex-col gap-4 sm:flex-row">
            <Link to="/technology" className="btn-primary">
              Explore the technology
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              Our work
            </Link>
          </div>
        </div>

        <a
          href="#divisions"
          aria-label="Scroll to the divisions"
          className={`absolute bottom-8 flex flex-col items-center gap-2 text-muted transition-opacity duration-700 hover:text-[var(--ink)] ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="yx-scroll-dot" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </a>
      </section>

      <Section id="divisions" labelledBy="divisions-label" className="container-yx">
        <div ref={divisionsRef}>
          <SectionLabel id="divisions-label">The company</SectionLabel>
          <SectionTitle>Four divisions. One direction.</SectionTitle>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((d, i) => {
              const Icon = DIVISION_ICONS[d.id];
              return (
                <Link
                  key={d.id}
                  to={d.slug}
                  className="group relative flex flex-col rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                >
                  <span className="absolute right-6 top-6 text-xs text-muted" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line transition-colors duration-300 group-hover:text-accent">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{d.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-accent">{d.tagline}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{d.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    Division
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="container-yx" labelledBy="explorer-label">
        <div ref={explorerRef}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel id="explorer-label">Technology Explorer</SectionLabel>
              <SectionTitle>Twelve fields of engineering and exploration.</SectionTitle>
            </div>
            <Link to="/technology" className="nav-link text-sm text-muted hover:text-[var(--ink)]">
              Open the explorer
            </Link>
          </div>
          <ul className="mt-14 grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {techFields.map((field, i) => (
              <li key={field.slug}>
                <Link
                  to={`/technology/${field.slug}`}
                  className="group flex items-baseline gap-4 border-b border-line py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]"
                >
                  <span className="text-xs text-muted" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm font-medium transition-colors duration-300 group-hover:text-accent md:text-base">
                    {field.name}
                  </span>
                  <ArrowRight
                    size={15}
                    className="-translate-x-1 self-center text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="container-yx" labelledBy="work-label">
        <div ref={workRef}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel id="work-label">Featured Work</SectionLabel>
              <SectionTitle>Projects and developments.</SectionTitle>
            </div>
            <Link to="/projects" className="nav-link text-sm text-muted hover:text-[var(--ink)]">
              All projects
            </Link>
          </div>
          <div className="mt-14">
            {projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Projects will be published here"
                body="The project archive opens as work becomes real — each entry with its own page, status, and development information."
              />
            )}
          </div>
        </div>
      </Section>

      <Section className="container-yx" labelledBy="labs-label">
        <div ref={labsRef} className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <SectionLabel id="labs-label">YX Labs</SectionLabel>
            <SectionTitle className="max-w-none">
              Research and experimental development.
            </SectionTitle>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted">
              YX Labs is where unproven ideas are taken seriously. It is the exploratory side of
              the company — investigating emerging technologies, testing new concepts, and
              developing experimental solutions in areas that have not yet been fully developed.
            </p>
            {labEntries.length > 0 && (
              <ul className="mt-8 flex flex-col gap-3 border-l border-line pl-6">
                {labEntries.slice(0, 3).map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      to={`/labs/${entry.slug}`}
                      className="text-sm font-medium transition-colors hover:text-accent"
                    >
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/labs" className="btn-ghost mt-10">
              Enter the Labs
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="container-yx" labelledBy="vision-label" border>
        <div ref={visionRef} className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <SectionLabel id="vision-label">Development & Vision</SectionLabel>
            <SectionTitle className="max-w-none">
              Built to endure, and to grow.
            </SectionTitle>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted">
              YX is built to endure and to grow. The direction is deliberately broad: an
              independent technology organization that develops advanced systems, contributes
              meaningful research, and shapes the technologies the future will be built on.
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted">
              The roadmap is public — milestones reached, work underway, and the directions
              still ahead.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/roadmap" className="btn-primary">
                View the roadmap
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/journal" className="btn-ghost">
                YX Journal
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CtaSection
        title="Learn more about YX."
        body="The company, its direction, and the thinking behind the work."
        label="About YX"
        to="/about"
      />
    </>
  );
}

function useHomeSectionRef() {
  return useRef<HTMLDivElement | null>(null);
}

// The single language-selection point of the whole YX ecosystem. The choice is
// persisted and applies to every project and introduction page.
function LanguageSelector() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="yx-fade-up mb-6 inline-flex overflow-hidden rounded-full border border-line"
      role="group"
      aria-label="Language / زبان"
    >
      {(['en', 'fa'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-4 py-1.5 text-xs font-medium transition-colors ${
            lang === l ? 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent' : 'text-muted hover:text-[var(--ink)]'
          }`}
        >
          {l === 'en' ? 'English' : 'فارسی'}
        </button>
      ))}
    </div>
  );
}
