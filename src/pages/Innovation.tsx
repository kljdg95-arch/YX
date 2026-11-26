import useSeo from '@/hooks/useSeo';
import useReveal from '@/hooks/useReveal';
import PageHeader from '@/components/PageHeader';
import CtaSection from '@/components/CtaSection';

const INTERESTS = [
  {
    title: 'Emerging Technologies',
    body: 'Understanding technologies at the earliest stage of their development — evaluating them honestly and identifying where meaningful work can begin.',
  },
  {
    title: 'Advanced Computing',
    body: 'Following the evolution of compute — from new hardware paradigms to the software architectures that make large-scale systems possible.',
  },
  {
    title: 'Intelligent Systems',
    body: 'Exploring how intelligence can be embedded into software — from applied machine learning to autonomous, reasoning, and adaptive systems.',
  },
  {
    title: 'Unexplored Ideas',
    body: 'Keeping space for ideas that do not fit a category yet. Some of the most important technologies began as questions without answers.',
  },
  {
    title: 'Future Digital Experiences',
    body: 'Imagining how people will interact with technology in the decades ahead — and prototyping the interfaces that could make it real.',
  },
  {
    title: 'Innovative Engineering Concepts',
    body: 'Advancing engineering methods themselves — new ways of designing, building, and validating complex systems.',
  },
];

export default function Innovation() {
  useSeo({
    title: 'Innovation & Future',
    description:
      'The future-oriented vision of YX — emerging technologies, advanced computing, intelligent systems, and the ideas that will shape what comes next.',
    path: '/innovation',
  });

  const ref = useReveal<HTMLElement>();

  return (
    <>
      <PageHeader
        label="Innovation & Future"
        title="Looking where the map ends."
        lead="These are the subjects YX is interested in and actively exploring. They represent curiosity and direction — areas of interest rather than claims of finished technology."
      />

      <section ref={ref} className="reveal py-20 md:py-28">
        <div className="container-yx grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INTERESTS.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
            >
              <span className="text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-4 text-lg font-medium">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              <div className="mt-8 h-px w-8 bg-[var(--accent)] transition-all duration-500 group-hover:w-16" />
            </div>
          ))}
        </div>
      </section>

      <CtaSection
        title="Shape the future with us."
        body="If you are working on something ambitious, YX would like to hear about it."
        label="Contact YX"
        to="/contact"
      />
    </>
  );
}
