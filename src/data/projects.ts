export type ProjectStatus =
  | 'Research'
  | 'Concept'
  | 'Experimental'
  | 'In Development'
  | 'Completed'
  | 'Released'
  | 'On Hold';

export const PROJECT_STATUSES: ProjectStatus[] = [
  'Research',
  'Concept',
  'Experimental',
  'In Development',
  'Completed',
  'Released',
  'On Hold',
];

export interface Project {
  slug: string;
  name: string;
  /** Short category label shown on cards, e.g. "Intelligence" */
  category: string;
  status: ProjectStatus;
  description: string;
  /** Longer detail shown on the project page */
  detail: string;
  /** Technology field slugs this project relates to */
  fields: string[];
  /** Optional gallery image URLs */
  gallery?: string[];
}

/**
 * Real projects only. To publish a new project, add an entry here — the
 * Projects page, filtering, search, and detail routes render automatically.
 * Never add fictional projects, progress, or achievements.
 */
export const projects: Project[] = [];

export const projectCategories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
