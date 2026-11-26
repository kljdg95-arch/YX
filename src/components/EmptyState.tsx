import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

interface EmptyStateProps {
  code?: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: 'code' | 'search';
}

export default function EmptyState({
  code = '00',
  title,
  body,
  actionLabel,
  actionTo,
  icon = 'code',
}: EmptyStateProps) {
  return (
    <div className="flex aspect-[16/7] min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface">
      <div className="flex flex-col items-center gap-3 px-6 text-center text-muted">
        {icon === 'search' ? (
          <SearchX size={28} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <span className="text-4xl font-light tracking-widest" aria-hidden="true">{code}</span>
        )}
        <h2 className="text-sm font-medium uppercase tracking-[0.25em]">{title}</h2>
        <p className="max-w-sm text-sm leading-relaxed">{body}</p>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="btn-ghost mt-4">
            <ArrowLeft size={15} />
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
