import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrainCircuit, Database, Code2, Server, Bot, Cpu, FlaskConical, Sparkles, ShieldCheck, Rocket, MousePointerClick, Telescope } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import { techFieldBySlug, fieldsByDivision } from '@/data/techFields';
import { divisionById } from '@/data/divisions';
import { projects } from '@/data/projects';
import { labEntries } from '@/data/labs';
import NotFound from '@/pages/NotFound';

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit, Database, Code2, Server, Bot, Cpu,
  FlaskConical, Sparkles, ShieldCheck, Rocket, MousePointerClick, Telescope,
};

export default function TechFieldDetail() {
  const { slug } = useParams<{ slug: string }>();
  const field = techFieldBySlug(slug);
  const ref = useReveal<HTMLElement>();

  useSeo({
    title: field ? field.name : 'Technology Field',
    description: field ? field.description : 'A technology field of YX.',
    path: `/technology/${slug ?? ''}`,
  });

  if (!field) return <NotFound />;

  const division = divisionById(field.division);
  const Icon = ICONS[field.icon] ?? Code2;
  const relatedProjects = projects.filter((p) => p.fields.includes(field.slug));
  const relatedResearch = labEntries.filter((e) => e.fields.includes(field.slug));
  const siblings = fieldsByDivision(field.division).filter((f) => f.slug !== field.slug);

  return (
    <section ref={ref} className="reveal is-visible pt-40 pb-28 md:pt-48 md:pb-36">
      <div className="container-yx max-w-4xl">
        <Link
          to="/technology"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Technology Explorer
        </Link>

        <div className="mt-10 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line text-accent">
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <Link
              to={division.slug}
              className="text-xs font-medium uppercase tracking-[0.25em] text-accent transition-opacity hover:opacity-80"
            >
              {division.name}
            </Link>
            <p className="mt-1 text-sm text-muted">Technology field</p>
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          {field.name}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{field.description}</p>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-8 md:p-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            About this field
          </h2>
          <p className="mt-5 text-base leading-relaxed">{field.detail}</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Areas within the field
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {field.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Related projects
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {relatedProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                  >
                    <span>
                      <span className="block text-base font-semibold tracking-tight">{p.name}</span>
                      <span className="mt-1 block text-sm text-muted">{p.description}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedResearch.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Related research
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {relatedResearch.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/labs/${e.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                  >
                    <span>
                      <span className="block text-base font-semibold tracking-tight">{e.title}</span>
                      <span className="mt-1 block text-sm text-muted">{e.summary}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {siblings.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              More in {division.name}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {siblings.map((f) => {
                const SibIcon = ICONS[f.icon] ?? Code2;
                return (
                  <Link
                    key={f.slug}
                    to={`/technology/${f.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                  >
                    <SibIcon size={18} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-sm font-medium">{f.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
