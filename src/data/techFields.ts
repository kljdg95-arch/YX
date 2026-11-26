import type { DivisionId } from '@/data/divisions';

export interface TechField {
  slug: string;
  name: string;
  division: DivisionId;
  description: string;
  detail: string;
  topics: string[];
  icon: string;
}

/**
 * The 12 technology fields of YX. Content-only module: pages and the search
 * index derive from this list. Related projects/research join on `slug`.
 */
export const techFields: TechField[] = [
  {
    slug: 'ai',
    name: 'Artificial Intelligence & AI',
    division: 'intelligence',
    description:
      'Developing intelligent systems — from applied machine learning to reasoning and autonomous technologies.',
    detail:
      'YX approaches artificial intelligence as an engineering discipline. Work spans applied machine learning, reasoning systems, and the infrastructure required to move models from research into dependable products — with attention to evaluation, reliability, and long-term maintainability.',
    topics: ['Applied Machine Learning', 'Reasoning Systems', 'Autonomous Systems', 'Model Evaluation'],
    icon: 'BrainCircuit',
  },
  {
    slug: 'data',
    name: 'Data & Information Technologies',
    division: 'intelligence',
    description:
      'The systems that organize, move, and make sense of information at scale.',
    detail:
      'Data is the raw material of intelligent systems. This field covers data architecture, pipelines, storage technologies, and the information-retrieval systems that turn raw data into usable knowledge.',
    topics: ['Data Architecture', 'Pipelines & Processing', 'Information Retrieval', 'Knowledge Systems'],
    icon: 'Database',
  },
  {
    slug: 'software',
    name: 'Software Engineering',
    division: 'engineering',
    description:
      'Designing and engineering sophisticated software where correctness and longevity matter.',
    detail:
      'Software engineering at YX treats correctness, performance, and maintainability as first-class requirements. The work spans system design, programming languages and tooling, and the practices that keep large codebases healthy over years.',
    topics: ['System Design', 'Tooling & Languages', 'Performance Engineering', 'Software Practices'],
    icon: 'Code2',
  },
  {
    slug: 'systems',
    name: 'Systems & Infrastructure',
    division: 'engineering',
    description:
      'The foundational layers — distributed systems, compute, and platform engineering.',
    detail:
      'Ambitious projects need foundations. This field covers distributed systems, compute infrastructure, networking, and the platform tooling that other systems are built upon.',
    topics: ['Distributed Systems', 'Compute Infrastructure', 'Networking', 'Platform Tooling'],
    icon: 'Server',
  },
  {
    slug: 'robotics',
    name: 'Robotics & Automation',
    division: 'engineering',
    description:
      'Machines that act in the physical world — and the software that directs them.',
    detail:
      'Robotics sits where software meets physics. Work in this field involves control systems, perception, actuation, and the integration of intelligent software with mechanical hardware.',
    topics: ['Control Systems', 'Perception', 'Actuation & Mechanics', 'Software–Hardware Integration'],
    icon: 'Bot',
  },
  {
    slug: 'hardware',
    name: 'Hardware & Electronics',
    division: 'engineering',
    description:
      'Building from first principles — circuits, devices, and embedded systems.',
    detail:
      'Hardware is where computation begins. This field covers embedded systems, electronics design, sensing, and the physical engineering that software systems ultimately depend on.',
    topics: ['Embedded Systems', 'Electronics Design', 'Sensing & Instruments', 'Firmware'],
    icon: 'Cpu',
  },
  {
    slug: 'r-and-d',
    name: 'Research & Development',
    division: 'research',
    description:
      'Structured experiments, prototyping, and honest evaluation of new concepts.',
    detail:
      'Research and development at YX runs structured experiments and prototypes new concepts, treating uncertainty as part of the engineering process. The output is knowledge: validated ideas, documented failures, and directions worth pursuing.',
    topics: ['Experimentation', 'Prototyping', 'Evaluation Methods', 'Knowledge Transfer'],
    icon: 'FlaskConical',
  },
  {
    slug: 'emerging',
    name: 'Emerging Technologies',
    division: 'research',
    description:
      'Tracking and evaluating technologies at the edge of maturity.',
    detail:
      'This field exists to understand where new technologies are heading and where meaningful work can begin today. It involves horizon scanning, capability assessment, and early experimentation with technologies before they are established.',
    topics: ['Horizon Scanning', 'Capability Assessment', 'Early Experiments', 'Technology Foresight'],
    icon: 'Sparkles',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    division: 'research',
    description:
      'Protecting systems, understanding threats, and engineering for resilience.',
    detail:
      'Security is treated as an engineering property, not an afterthought. Work spans secure system design, threat analysis, cryptographic practice, and the resilience engineering needed to keep systems trustworthy.',
    topics: ['Secure Design', 'Threat Analysis', 'Cryptography Practice', 'Resilience Engineering'],
    icon: 'ShieldCheck',
  },
  {
    slug: 'aerospace',
    name: 'Aerospace & Space Technologies',
    division: 'ventures',
    description:
      'Technologies built for the hardest environment: space.',
    detail:
      'Aerospace represents the long-term ambition of YX — propulsion, orbital systems, and the extreme engineering requirements of operating beyond Earth. Work begins with study and progresses as capability grows.',
    topics: ['Orbital Systems', 'Propulsion Concepts', 'Extreme Environment Engineering', 'Space Systems Design'],
    icon: 'Rocket',
  },
  {
    slug: 'hci',
    name: 'Human-Computer Interaction & Digital Experiences',
    division: 'ventures',
    description:
      'How people will interact with technology in the decades ahead.',
    detail:
      'The interface is where technology meets people. This field explores new interaction paradigms, immersive and spatial computing, and the design of digital experiences that feel natural rather than mechanical.',
    topics: ['Interaction Paradigms', 'Spatial Computing', 'Experience Design', 'Interface Prototyping'],
    icon: 'MousePointerClick',
  },
  {
    slug: 'advanced-engineering',
    name: 'Advanced Engineering & Future Solutions',
    division: 'ventures',
    description:
      'Cross-disciplinary solutions for problems that do not fit a single field.',
    detail:
      'Some problems require several disciplines at once. This field is deliberately broad — combining hardware, software, and research methods into engineered solutions for ambitious, future-oriented projects.',
    topics: ['Cross-Disciplinary Systems', 'Engineering Methods', 'Complex Integration', 'Future Solutions'],
    icon: 'Telescope',
  },
];

export const techFieldBySlug = (slug: string | undefined) =>
  techFields.find((f) => f.slug === slug);

export const fieldsByDivision = (division: DivisionId) =>
  techFields.filter((f) => f.division === division);
