import useSeo from '@/hooks/useSeo';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useSeo({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    path: '/404',
  });

  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">404</p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Page not found.</h1>
      <p className="max-w-md text-base leading-relaxed text-muted">
        The page you are looking for does not exist or has not been published yet.
      </p>
      <Link to="/" className="btn-ghost mt-4">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </section>
  );
}
