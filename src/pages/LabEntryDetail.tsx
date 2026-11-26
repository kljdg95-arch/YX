import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import { labEntries } from '@/data/labs';
import { techFieldBySlug } from '@/data/techFields';
import NotFound from '@/pages/NotFound';
import StatusBadge from '@/components/StatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function LabEntryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const entry = labEntries.find((e) => e.slug === slug);
  const ref = useReveal<HTMLElement>();

  useSeo({
    title: entry ? entry.title : 'Research Entry',
    description: entry ? entry.summary : 'Research from YX Labs.',
    path: `/labs/${slug ?? ''}`,
  });

  if (!entry) return <NotFound />;

  const relatedFields = entry.fields
    .map((f) => techFieldBySlug(f))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <section ref={ref} className="reveal is-visible pt-40 pb-28 md:pt-48 md:pb-36">
      <div className="container-yx max-w-3xl">
        <Link
          to="/labs"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          YX Labs
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
            {entry.kind}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
            {entry.category}
          </span>
          <StatusBadge status={entry.status} />
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          {entry.title}
        </h1>
        {entry.publishedAt && (
          <p className="mt-4 text-sm text-muted">
            <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
          </p>
        )}
        <p className="mt-8 text-lg leading-relaxed text-muted">{entry.summary}</p>

        {entry.images && entry.images.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {entry.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${entry.title} — figure ${i + 1}`}
                loading="lazy"
                className="w-full rounded-2xl border border-line object-cover"
              />
            ))}
          </div>
        )}

        {entry.content && (
          <div className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Details</h2>
            <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed">
              {entry.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {relatedFields.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Related technologies
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
