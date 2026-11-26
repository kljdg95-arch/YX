export type DivisionId = 'intelligence' | 'engineering' | 'research' | 'ventures';

export interface Division {
  id: DivisionId;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  mission: string;
  focus: string;
  icon: string;
}

export const divisions: Division[] = [
  {
    id: 'intelligence',
    slug: '/divisions/intelligence',
    name: 'YX Intelligence',
    tagline: 'Machines that understand.',
    description:
      'The intelligence division works on artificial intelligence, data, and information systems — technologies that perceive, reason, and decide.',
    mission:
      'To develop intelligent technologies that move beyond demonstration and into dependable, real-world systems.',
    focus:
      'Applied machine learning, reasoning systems, data infrastructure, and the engineering practices required to make intelligence reliable at scale.',
    icon: 'BrainCircuit',
  },
  {
    id: 'engineering',
    slug: '/divisions/engineering',
    name: 'YX Engineering',
    tagline: 'The discipline of building.',
    description:
      'The engineering division designs and builds the systems everything else stands on — software, infrastructure, robotics, and hardware.',
    mission:
      'To engineer complex systems where correctness, performance, and longevity are first-class requirements.',
    focus:
      'Software engineering, systems and infrastructure, robotics and automation, and hardware and electronics.',
    icon: 'Server',
  },
  {
    id: 'research',
    slug: '/divisions/research',
    name: 'YX Research',
    tagline: 'Questions before answers.',
    description:
      'The research division investigates new ideas, evaluates emerging technologies, and treats uncertainty as part of the engineering process.',
    mission:
      'To run structured experiments and produce knowledge the rest of the company can build on.',
    focus:
      'Research and development, emerging technology evaluation, cybersecurity, and experimental development.',
    icon: 'FlaskConical',
  },
  {
    id: 'ventures',
    slug: '/divisions/ventures',
    name: 'YX Ventures',
    tagline: 'Ambition, applied.',
    description:
      'The ventures division takes on the most ambitious directions — aerospace, new interfaces, and cross-disciplinary solutions that do not fit a single field.',
    mission:
      'To pursue future-oriented projects where multiple disciplines must come together to make something new possible.',
    focus:
      'Aerospace and space technologies, human-computer interaction and digital experiences, and advanced engineering.',
    icon: 'Rocket',
  },
];

export const divisionById = (id: DivisionId): Division =>
  divisions.find((d) => d.id === id) as Division;
