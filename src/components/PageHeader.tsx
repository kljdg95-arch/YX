import type { ReactNode } from 'react';
import useReveal from '@/hooks/useReveal';

interface PageHeaderProps {
  label: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}

export default function PageHeader({ label, title, lead, children }: PageHeaderProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="reveal is-visible border-b border-line pt-40 pb-20 md:pt-48 md:pb-24">
      <div className="container-yx">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">{label}</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">{lead}</p>
        )}
        {children}
      </div>
    </div>
  );
}
