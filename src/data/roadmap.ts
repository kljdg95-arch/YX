export type MilestoneStatus = 'Completed' | 'In Progress' | 'Planned' | 'Under Consideration';

export const MILESTONE_STATUSES: MilestoneStatus[] = [
  'Completed',
  'In Progress',
  'Planned',
  'Under Consideration',
];

export type MilestoneKind = 'Company' | 'Project' | 'Research' | 'Direction';

export interface Milestone {
  title: string;
  kind: MilestoneKind;
  status: MilestoneStatus;
  description: string;
  /** ISO date or label like "2026" / "Future" */
  when?: string;
}

/**
 * Company and development milestones. Data-driven: add real milestones here
 * and the timeline renders them in order. Never invent actual company history.
 */
export const milestones: Milestone[] = [
  {
    title: 'YX founded',
    kind: 'Company',
    status: 'Completed',
    description:
      'An independent technology company established to explore possibilities, engineer innovation, and build what comes next.',
    when: 'Foundation',
  },
  {
    title: 'Four divisions defined',
    kind: 'Company',
    status: 'Completed',
    description:
      'The company organized into YX Intelligence, YX Engineering, YX Research, and YX Ventures — twelve technology fields under one direction.',
    when: 'Structure',
  },
  {
    title: 'YX Labs established',
    kind: 'Research',
    status: 'In Progress',
    description:
      'A dedicated research and experimentation environment for unproven ideas, structured experiments, and early prototypes.',
  },
  {
    title: 'First real projects published',
    kind: 'Project',
    status: 'In Progress',
    description:
      'The project archive opens as work becomes real — each with its own page, status, and development information.',
  },
  {
    title: 'Research publications',
    kind: 'Research',
    status: 'Planned',
    description:
      'YX Labs begins publishing technical reports and experimental results through the YX Journal.',
  },
  {
    title: 'Advanced systems in development',
    kind: 'Direction',
    status: 'Planned',
    description:
      'Large-scale systems and complex projects move from concept into active, long-term development.',
  },
  {
    title: 'Aerospace program',
    kind: 'Direction',
    status: 'Under Consideration',
    description:
      'A long-term direction toward aerospace and space technologies, pursued as capability and resources grow.',
    when: 'Future',
  },
];
