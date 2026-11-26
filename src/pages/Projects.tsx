import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import EmptyState from '@/components/EmptyState';
import { ProjectCard } from '@/components/ProjectCard';
import { projects, projectCategories, PROJECT_STATUSES } from '@/data/projects';

export default function Projects() {
  useSeo({
    title: 'Projects',
    description:
      'Projects and developments from YX — current work, research efforts, and future releases, searchable and organized by category and status.',
    path: '/projects',
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<string>('All');
  const ref = useReveal<HTMLElement>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (status !== 'All' && p.status !== status) return false;
      if (q && !`${p.name} ${p.description} ${p.detail}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category, status]);

  const hasFilters = query.trim() !== '' || category !== 'All' || status !== 'All';

  return (
    <>
      <PageHeader
        label="Projects"
        title="Work in progress. Work to come."
        lead="The central place for YX's projects. Each entry carries its own page with details, status, and development information — published as work becomes real."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx">
          {projects.length > 0 ? (
            <>
              <div className="flex flex-col gap-6">
                <div className="relative max-w-md">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects…"
                    aria-label="Search projects"
                    className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-10 text-sm text-[var(--ink)] placeholder:text-muted transition-colors focus:border-[var(--accent)] focus:outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[var(--ink)]"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
                    <span className="mr-2 text-xs uppercase tracking-[0.2em] text-muted">Category</span>
                    {projectCategories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        aria-pressed={category === c}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                          category === c
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                            : 'border-line text-muted hover:border-[var(--accent)] hover:text-accent'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
                    <span className="mr-2 text-xs uppercase tracking-[0.2em] text-muted">Status</span>
                    {['All', ...PROJECT_STATUSES].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        aria-pressed={status === s}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
                          status === s
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                            : 'border-line text-muted hover:border-[var(--accent)] hover:text-accent'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
              </p>

              <div className="mt-6">
                {filtered.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="search"
                    title="No matching projects"
                    body={
                      hasFilters
                        ? 'No projects match the current search and filters. Try broadening them.'
                        : 'Projects will be published here as work becomes real.'
                    }
                  />
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="Projects will be published here"
              body="The project archive opens as work becomes real — each entry with its own page, status, and development information."
            />
          )}
        </div>
      </section>

      <CtaSection
        title="Have a project in mind?"
        body="YX is open to ambitious ideas and meaningful collaborations."
        label="Get in touch"
        to="/contact"
      />
    </>
  );
}
