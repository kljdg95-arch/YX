import type { ReactNode } from 'react';
import useReveal from '@/hooks/useReveal';

interface SectionProps {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  border?: boolean;
  id?: string;
}

export default function Section({
  children,
  className = '',
  labelledBy,
  border = true,
  id,
}: SectionProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={`reveal ${border ? 'border-t border-line' : ''} py-24 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionLabel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
      {children}
    </p>
  );
}

export function SectionTitle({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`max-w-xl text-3xl font-semibold tracking-tight md:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}
