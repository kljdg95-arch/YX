import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Database, Code2, Server, Bot, Cpu, FlaskConical, Sparkles, ShieldCheck, Rocket, MousePointerClick, Telescope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import PageHeader from '@/components/PageHeader';
import Section, { SectionLabel, SectionTitle } from '@/components/Section';
import CtaSection from '@/components/CtaSection';
import { divisions, type DivisionId } from '@/data/divisions';
import { fieldsByDivision } from '@/data/techFields';

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit, Database, Code2, Server, Bot, Cpu,
  FlaskConical, Sparkles, ShieldCheck, Rocket, MousePointerClick, Telescope,
};

function DivisionPanel({ divisionId }: { divisionId: DivisionId }) {
  const division = divisions.find((d) => d.id === divisionId)!;
  const fields = fieldsByDivision(divisionId);

  return (
    <div className="border-t border-line">
      <div className="grid gap-6 py-14 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14">
        <div>
          <SectionLabel>{division.tagline}</SectionLabel>
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{division.name}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">{division.description}</p>
          <Link
            to={division.slug}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:opacity-80"
          >
            About the division
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const Icon = ICONS[field.icon] ?? Code2;
            return (
              <li key={field.slug}>
                <Link
                  to={`/technology/${field.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-colors duration-300 group-hover:text-accent">
                      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <ArrowRight
                      size={16}
                      className="-translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                  <h4 className="mt-5 text-base font-semibold leading-snug tracking-tight">{field.name}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{field.description}</p>
                  <span className="mt-4 text-xs uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-accent">
                    Field details
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function Technology() {
  useSeo({
    title: 'Technology Explorer',
    description:
      'Explore the twelve technology fields of YX across four divisions — intelligence, engineering, research, and ventures.',
    path: '/technology',
  });

  return (
    <>
      <PageHeader
        label="Technology Explorer"
        title="Twelve fields. Four divisions. One direction."
        lead="The technological landscape of YX — organized into divisions that each pursue a distinct part of the same ambition."
      />

      <Section className="container-yx" labelledBy="tech-intro">
        <SectionLabel id="tech-intro">How YX is organized</SectionLabel>
        <SectionTitle>
          Each division owns a part of the future.
        </SectionTitle>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          The twelve fields below are not a menu of services — they are the map of where the
          company works. Every field has its own detail page, and connects to the projects and
          research that grow out of it.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { n: '04', t: 'Divisions' },
            { n: '12', t: 'Technology fields' },
            { n: '01', t: 'Research environment' },
            { n: '∞', t: 'Directions of exploration' },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-line bg-surface px-5 py-6">
              <p className="text-2xl font-semibold tracking-tight text-accent">{s.n}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{s.t}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="container-yx pb-24 md:pb-32">
        {divisions.map((d) => (
          <DivisionPanel key={d.id} divisionId={d.id} />
        ))}
      </div>

      <CtaSection
        title="Exploration is a full-time activity."
        body="YX Labs is the research and experimentation division of the company."
        label="Visit YX Labs"
        to="/labs"
      />
    </>
  );
}
