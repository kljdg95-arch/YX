import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import { journalArticles } from '@/data/journal';
import { techFieldBySlug } from '@/data/techFields';
import NotFound from '@/pages/NotFound';

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop - 200;
      const total = el.offsetHeight;
      const scrolled = Math.min(Math.max(window.scrollY - start, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, bodyRef };
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = journalArticles.find((a) => a.slug === slug);
  const ref = useReveal<HTMLElement>();
  const { progress, bodyRef } = useReadingProgress();

  useSeo({
    title: article ? article.title : 'Journal Article',
    description: article ? article.summary : 'An article from the YX Journal.',
    path: `/journal/${slug ?? ''}`,
  });

  if (!article) return <NotFound />;

  const related = journalArticles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.category === article.category ||
          a.fields?.some((f) => article.fields?.includes(f)))
    )
    .slice(0, 3);

  const relatedFields = (article.fields ?? [])
    .map((f) => techFieldBySlug(f))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent" aria-hidden="true">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <section ref={ref} className="reveal is-visible pt-40 pb-28 md:pt-48 md:pb-36">
        <article className="container-yx max-w-2xl">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            YX Journal
          </Link>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {article.category}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            {article.title}
          </h1>
          {article.publishedAt && (
            <p className="mt-6 text-sm text-muted">
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </p>
          )}
          <p className="mt-8 border-l-2 border-[var(--accent)] pl-6 text-lg leading-relaxed text-muted">
            {article.summary}
          </p>

          <div ref={bodyRef} className="mt-12 flex flex-col gap-6 text-base leading-[1.8]">
            {article.content ? (
              article.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="text-muted">
                The full text of this article has not been published yet.
              </p>
            )}
          </div>

          {relatedFields.length > 0 && (
            <div className="mt-14">
              <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Related technology
              </h2>
              <ul className="mt-5 flex flex-wrap gap-3">
                {relatedFields.map((f) => (
                  <li key={f.slug}>
                    <Link
                      to={`/technology/${f.slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted transition-all duration-300 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:text-accent"
                    >
                      {f.name}
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {related.length > 0 && (
          <div className="container-yx mt-20 max-w-2xl border-t border-line pt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Related articles
            </h2>
            <ul className="mt-8 flex flex-col gap-6">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link to={`/journal/${a.slug}`} className="group block">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                      {a.category}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{a.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
