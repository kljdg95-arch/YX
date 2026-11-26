import type { ProjectStatus } from '@/data/projects';
import type { ResearchStatus } from '@/data/labs';
import type { MilestoneStatus } from '@/data/roadmap';

type AnyStatus = ProjectStatus | ResearchStatus | MilestoneStatus;

const STATUS_STYLES: Record<AnyStatus, string> = {
  Research: 'text-muted border-line',
  Concept: 'text-muted border-line',
  Experimental: 'text-accent border-[color-mix(in_srgb,var(--accent)_40%,transparent)]',
  'In Development': 'text-accent border-[color-mix(in_srgb,var(--accent)_40%,transparent)]',
  Active: 'text-accent border-[color-mix(in_srgb,var(--accent)_40%,transparent)]',
  Completed: 'text-[var(--ink)] border-line',
  Released: 'text-[var(--ink)] border-line',
  'On Hold': 'text-muted border-line',
  Paused: 'text-muted border-line',
  Archived: 'text-muted border-line',
  'In Progress': 'text-accent border-[color-mix(in_srgb,var(--accent)_40%,transparent)]',
  Planned: 'text-muted border-line',
  'Under Consideration': 'text-muted border-line',
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs ${STATUS_STYLES[status]} ${className}`}>
      {status}
    </span>
  );
}
