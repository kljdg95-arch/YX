import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import { projects } from '@/data/projects';
import { techFieldBySlug } from '@/data/techFields';
import NotFound from '@/pages/NotFound';
import StatusBadge from '@/components/StatusBadge';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const ref = useReveal<HTMLElement>();

  useSeo({
    title: project ? project.name : 'Project',
    description: project ? project.description : 'A project by YX.',
    path: `/projects/${slug ?? ''}`,
  });

  if (!project) return <NotFound />;

  const relatedFields = project.fields
    .map((f) => techFieldBySlug(f))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <section ref={ref} className="reveal is-visible pt-40 pb-28 md:pt-48 md:pb-36">
      <div className="container-yx max-w-3xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All projects
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
            {project.category}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">{project.name}</h1>
        <p className="mt-8 text-lg leading-relaxed text-muted">{project.description}</p>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-8 md:p-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            About the project
          </h2>
          <p className="mt-5 text-base leading-relaxed">{project.detail}</p>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${project.name} — figure ${i + 1}`}
                loading="lazy"
                className="w-full rounded-2xl border border-line object-cover"
              />
            ))}
          </div>
        )}

        {relatedFields.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Related technology
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
