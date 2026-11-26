import { Compass, Target, Scale, Cpu, Telescope } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';

const SECTIONS = [
  {
    icon: Compass,
    label: 'Vision',
    body: 'To explore new technological possibilities and contribute to building the future through advanced engineering, research, and innovation.',
  },
  {
    icon: Target,
    label: 'Mission',
    body: 'To develop complex technologies, build ambitious projects, investigate new ideas, and transform promising concepts into meaningful solutions.',
  },
  {
    icon: Scale,
    label: 'Philosophy',
    body: 'YX believes that technology should not be limited by existing possibilities. The company values exploration, experimentation, engineering excellence, and continuous development.',
  },
  {
    icon: Cpu,
    label: 'Approach to Technology',
    body: 'Technology is treated as an engineering discipline with a research mindset. Systems are designed carefully, ideas are tested honestly, and ambition is balanced with rigor — every project, at every scale.',
  },
  {
    icon: Telescope,
    label: 'Long-Term Direction',
    body: 'YX is built to endure and to grow. The direction is deliberately broad: an independent technology organization that develops advanced systems, contributes meaningful research, and shapes the technologies the future will be built on.',
  },
];

export default function About() {
  useSeo({
    title: 'About',
    description:
      'YX is an independent technology company. Its vision, mission, philosophy, and long-term direction — exploring possibilities and engineering what comes next.',
    path: '/about',
  });

  const ref = useReveal<HTMLElement>();

  return (
    <>
      <PageHeader
        label="About YX"
        title="A technology company exploring possibilities, engineering innovation, and building what comes next."
        lead="YX is an independent technology company focused on developing advanced technologies, building complex projects, researching new ideas, and exploring the possibilities of future technology."
      />

      <section ref={ref} className="reveal py-28 md:py-36">
        <div className="container-yx">
          <div className="flex flex-col gap-6">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="grid gap-6 rounded-2xl border border-line bg-surface p-8 transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] md:grid-cols-[80px_1fr_2fr] md:items-start md:p-10"
                >
                  <div className="flex items-center gap-4 md:flex-col md:gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-muted">0{i + 1}</span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">{s.label}</h2>
                  <p className="text-base leading-relaxed text-muted">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection
        title="See what YX is building."
        body="The technological fields, projects, and research the company is engaged in."
        label="Technology"
        to="/technology"
      />
    </>
  );
}
