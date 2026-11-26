import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import useReveal from '@/hooks/useReveal';

interface CtaSectionProps {
  title: string;
  body: string;
  label: string;
  to: string;
  children?: ReactNode;
}

export default function CtaSection({ title, body, label, to }: CtaSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal border-t border-line py-28 md:py-36">
      <div className="container-yx flex flex-col items-center text-center">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{body}</p>
        <a href={to} className="btn-primary mt-12">
          {label}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
