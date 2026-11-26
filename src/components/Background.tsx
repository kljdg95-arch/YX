import { useEffect, useRef } from 'react';

export default function Background() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = glowRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--line) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-60 blur-3xl transition-transform duration-700 ease-out will-change-transform dark:opacity-30"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)',
        }}
      />
      <div
        className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl dark:opacity-25"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)',
        }}
      />
    </div>
  );
}
