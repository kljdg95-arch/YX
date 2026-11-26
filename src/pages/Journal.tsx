import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import EmptyState from '@/components/EmptyState';
import { journalArticles, ARTICLE_CATEGORIES, type ArticleCategory } from '@/data/journal';

export default function Journal() {
  useSeo({
    title: 'YX Journal',
    description:
      'YX Journal — technical articles, research publications, engineering insights, technology analysis, and company development updates.',
    path: '/journal',
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ArticleCategory>('All');
  const ref = useReveal<HTMLElement>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return journalArticles
      .filter((a) => {
        if (category !== 'All' && a.category !== category) return false;
        if (q && !`${a.title} ${a.summary}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
  }, [query, category]);

  return (
    <>
      <PageHeader
        label="YX Journal"
        title="Notes from the edge of the work."
        lead="Technical articles, research publications, engineering insights, technology analysis, experimental reports, and updates on the company's development."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx max-w-3xl">
          {journalArticles.length === 0 ? (
            <EmptyState
              title="The first article is coming"
              body="The journal opens soon — technical writing, research publications, and engineering insights from the work at YX. Nothing is published until it is real."
            />
          ) : (
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
                    placeholder="Search articles…"
                    aria-label="Search articles"
                    className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-10 text-sm text-[var(--ink)] placeholder:text-muted transition-colors focus:border-[var(--accent)] focus:outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[var(--ink)]"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
                  <span className="mr-2 text-xs uppercase tracking-[0.2em] text-muted">Category</span>
                  {['All', ...ARTICLE_CATEGORIES].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c as 'All' | ArticleCategory)}
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
              </div>

              <div className="mt-14 flex flex-col">
                {filtered.length > 0 ? (
                  filtered.map((article) => (
                    <a
                      key={article.slug}
                      href={`/journal/${article.slug}`}
                      className="group border-t border-line py-10 transition-colors last:border-b hover:bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]"
                    >
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                        {article.category}
                      </span>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                        {article.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{article.summary}</p>
                      {article.publishedAt && (
                        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </p>
                      )}
                    </a>
                  ))
                ) : (
                  <EmptyState
                    icon="search"
                    title="No matching articles"
                    body="No articles match the current search and filters. Try broadening them."
                  />
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <CtaSection
        title="The work comes first."
        body="The journal publishes when there is something real to write about."
        label="Explore YX Labs"
        to="/labs"
      />
    </>
  );
}
