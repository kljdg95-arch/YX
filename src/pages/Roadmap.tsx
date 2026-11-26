import { CircleCheck, CircleDashed, Circle, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';
import EmptyState from '@/components/EmptyState';
import { milestones, MILESTONE_STATUSES, type MilestoneStatus } from '@/data/roadmap';

const STATUS_ICONS: Record<MilestoneStatus, LucideIcon> = {
  Completed: CircleCheck,
  'In Progress': CircleDashed,
  Planned: Circle,
  'Under Consideration': HelpCircle,
};

const STATUS_STYLES: Record<MilestoneStatus, string> = {
  Completed: 'text-accent',
  'In Progress': 'text-accent',
  Planned: 'text-muted',
  'Under Consideration': 'text-muted',
};

export default function Roadmap() {
  useSeo({
    title: 'Roadmap',
    description:
      'The YX roadmap — company milestones, project and research milestones, and the planned technological directions ahead.',
    path: '/roadmap',
  });

  const ref = useReveal<HTMLElement>();
  const ordered = [...milestones].sort((a, b) => {
    const rank: Record<MilestoneStatus, number> = {
      Completed: 0,
      'In Progress': 1,
      Planned: 2,
      'Under Consideration': 3,
    };
    return rank[a.status] - rank[b.status];
  });

  return (
    <>
      <PageHeader
        label="Roadmap"
        title="The direction, in the open."
        lead="The development journey of YX — where the company has been, what is underway, and what lies ahead. Updated as the work itself advances."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx">
          <div className="flex flex-wrap gap-3" aria-label="Milestone status legend">
            {MILESTONE_STATUSES.map((s) => {
              const Icon = STATUS_ICONS[s];
              return (
                <span
                  key={s}
                  className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs ${STATUS_STYLES[s]}`}
                >
                  <Icon size={13} aria-hidden="true" />
                  {s}
                </span>
              );
            })}
          </div>

          {ordered.length === 0 ? (
            <div className="mt-14">
              <EmptyState
                title="Milestones will appear here"
                body="Company, project, and research milestones are published here as they are reached."
              />
            </div>
          ) : (
            <ol className="relative mt-16 flex flex-col gap-14 border-l border-line pl-8 md:pl-12">
              {ordered.map((m, i) => {
                const Icon = STATUS_ICONS[m.status];
                return (
                  <li key={`${m.title}-${i}`} className="relative">
                    <span
                      className={`absolute -left-[41px] top-0 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-[var(--paper)] md:-left-[57px] ${STATUS_STYLES[m.status]}`}
                      aria-hidden="true"
                    >
                      <Icon size={12} />
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
                        {m.kind}
                      </span>
                      {m.when && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
                          · {m.when}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{m.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                      {m.description}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      <CtaSection
        title="The future is built, not predicted."
        body="See the philosophy and long-term direction behind the roadmap."
        label="About YX"
        to="/about"
      />
    </>
  );
}
