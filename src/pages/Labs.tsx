import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, BrainCircuit, Microscope, Atom, Radar, Search, X, ArrowRight } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { labEntries, labCategories, RESEARCH_KINDS, type ResearchKind } from '@/data/labs';

const TOPIC_ICONS: Record<string, typeof FlaskConical> = {
  'Artificial Intelligence': BrainCircuit,
  'Advanced Computing': Atom,
  'Systems & Infrastructure': Microscope,
  'Emerging Interfaces': Radar,
};

export default function Labs() {
  useSeo({
    title: 'YX Labs',
    description:
      'YX Labs — the research and experimentation division of YX. Research topics, experimental projects, prototypes, publications, and technical reports.',
    path: '/labs',
  });

  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'All' | ResearchKind>('All');
  const ref = useReveal<HTMLElement>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return labEntries.filter((e) => {
      if (kind !== 'All' && e.kind !== kind) return false;
      if (q && !`${e.title} ${e.summary} ${e.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, kind]);

  return (
    <>
      <PageHeader
        label="YX Labs"
        title="Where unproven ideas are taken seriously."
        lead="YX Labs is the research and experimentation environment of the company — research topics, experimental projects, concept explorations, prototypes, publications, and technical reports."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Research topics
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(TOPIC_ICONS).map(([topic, TopicIcon]) => (
              <div
                key={topic}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-sm"
              >
                <TopicIcon size={16} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
                {topic}
              </div>
            ))}
          </div>

          <div className="mt-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                  Research archive
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                  Every entry from YX Labs — experiments, explorations, prototypes, and published
                  work, organized by kind and searchable by title or topic.
                </p>
              </div>
              {labEntries.length > 0 && (
                <div className="relative w-full max-w-xs">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search research…"
                    aria-label="Search research"
                    className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-9 text-sm text-[var(--ink)] placeholder:text-muted transition-colors focus:border-[var(--accent)] focus:outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--ink)]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {labEntries.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by kind">
                <span className="mr-2 text-xs uppercase tracking-[0.2em] text-muted">Kind</span>
                {['All', ...RESEARCH_KINDS].map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k as 'All' | ResearchKind)}
                    aria-pressed={kind === k}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                      kind === k
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                        : 'border-line text-muted hover:border-[var(--accent)] hover:text-accent'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}

            {labEntries.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="Research updates will be published here"
                  body="Experiments, concept explorations, prototypes, and publications appear here as YX Labs work begins — with its own archive and detail pages."
                />
              </div>
            ) : filtered.length > 0 ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((entry) => (
                  <Link
                    key={entry.slug}
                    to={`/labs/${entry.slug}`}
                    className="group flex flex-col rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted">{entry.kind}</span>
                      <StatusBadge status={entry.status} />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{entry.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{entry.summary}</p>
                    <span className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                      Read entry
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState
                  icon="search"
                  title="No matching research"
                  body="No research entries match the current search and filters. Try broadening them."
                />
              </div>
            )}
          </div>

          {labCategories.length > 0 && (
            <div className="mt-20">
              <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Research categories
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {labCategories.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaSection
        title="Interested in the future?"
        body="Follow the company's direction — where YX is looking next."
        label="Innovation & Future"
        to="/innovation"
      />
    </>
  );
}
