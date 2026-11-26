import { Link } from 'react-router-dom';
import type { Project } from '@/data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
    >
      <div className="yx-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{project.category}</span>
        <span className="rounded-full border border-line px-3 py-1 text-xs">{project.status}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight">{project.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
      <span className="mt-8 text-sm font-medium text-accent">View project</span>
    </Link>
  );
}
