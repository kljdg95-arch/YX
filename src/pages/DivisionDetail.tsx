import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BrainCircuit, Server, FlaskConical, Rocket, Target, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import { divisions, type DivisionId } from '@/data/divisions';
import { fieldsByDivision } from '@/data/techFields';
import { projects } from '@/data/projects';
import { labEntries } from '@/data/labs';
import NotFound from '@/pages/NotFound';
import CtaSection from '@/components/CtaSection';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';

const DIVISION_ICONS: Record<DivisionId, LucideIcon> = {
  intelligence: BrainCircuit,
  engineering: Server,
  research: FlaskConical,
  ventures: Rocket,
};

export default function DivisionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const division = divisions.find((d) => d.id === slug);
  const ref = useReveal<HTMLElement>();

  useSeo({
    title: division ? division.name : 'Division',
    description: division ? division.description : 'A division of YX.',
    path: `/divisions/${slug ?? ''}`,
  });

  if (!division) return <NotFound />;

  const Icon = DIVISION_ICONS[division.id];
  const fields = fieldsByDivision(division.id);
  const fieldSlugs = fields.map((f) => f.slug);
  const relatedProjects = projects.filter((p) => p.fields.some((f) => fieldSlugs.includes(f)));
  const relatedResearch = labEntries.filter((e) => e.fields.some((f) => fieldSlugs.includes(f)));

  return (
    <>
      <section ref={ref} className="reveal is-visible border-b border-line pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="container-yx">
          <Link
            to="/technology"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Technology Explorer
          </Link>
          <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-line text-accent">
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {division.tagline}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            {division.name}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {division.description}
          </p>
        </div>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <div className="container-yx grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-accent" aria-hidden="true" />
              <h2 className="text-sm font-medium uppercase tracking-[0.2em]">Mission</h2>
            </div>
            <p className="mt-5 text-base leading-relaxed text-muted">{division.mission}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-8">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-accent" aria-hidden="true" />
              <h2 className="text-sm font-medium uppercase tracking-[0.2em]">Focus</h2>
            </div>
            <p className="mt-5 text-base leading-relaxed text-muted">{division.focus}</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-yx">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Technology fields
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <Link
                key={field.slug}
                to={`/technology/${field.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
              >
                <h3 className="text-lg font-semibold tracking-tight">{field.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{field.description}</p>
                <span className="mt-6 text-sm font-medium text-accent">Field details</span>
              </Link>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Related projects
              </h2>
              {relatedProjects.length > 0 ? (
                <ul className="mt-8 flex flex-col gap-4">
                  {relatedProjects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/projects/${p.slug}`}
                        className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                      >
                        <span>
                          <span className="block text-base font-semibold tracking-tight">{p.name}</span>
                          <span className="mt-1 block text-sm text-muted">{p.description}</span>
                        </span>
                        <ArrowRight size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-8">
                  <EmptyState
                    title="No projects yet"
                    body="Projects connected to this division will appear here as work becomes real."
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Research connections
              </h2>
              {relatedResearch.length > 0 ? (
                <ul className="mt-8 flex flex-col gap-4">
                  {relatedResearch.map((e) => (
                    <li key={e.slug}>
                      <Link
                        to={`/labs/${e.slug}`}
                        className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                      >
                        <span>
                          <span className="block text-base font-semibold tracking-tight">{e.title}</span>
                          <span className="mt-1 block text-sm text-muted">{e.summary}</span>
                        </span>
                        <StatusBadge status={e.status} className="mt-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-8">
                  <EmptyState
                    title="No research yet"
                    body="Research entries connected to this division will appear here as YX Labs work begins."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title="See the full landscape."
        body="All twelve technology fields, across all four divisions."
        label="Technology Explorer"
        to="/technology"
      />
    </>
  );
}
