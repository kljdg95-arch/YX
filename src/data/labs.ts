export type ResearchStatus = 'Active' | 'Paused' | 'Archived';
export type ResearchKind = 'Research Topic' | 'Experimental Project' | 'Concept Exploration' | 'Prototype' | 'Publication' | 'Technical Report';

export const RESEARCH_KINDS: ResearchKind[] = [
  'Research Topic',
  'Experimental Project',
  'Concept Exploration',
  'Prototype',
  'Publication',
  'Technical Report',
];

export interface LabEntry {
  slug: string;
  title: string;
  kind: ResearchKind;
  category: string;
  status: ResearchStatus;
  summary: string;
  /** ISO date, if published */
  publishedAt?: string;
  /** Technology field slugs this entry relates to */
  fields: string[];
  /** Detailed body content, if written */
  content?: string;
  /** Image or diagram URLs, when available */
  images?: string[];
}

/**
 * Research entries from YX Labs. Add real entries here as work begins —
 * the Labs archive, filtering, search, and detail routes render automatically.
 * Never fabricate findings, results, or success claims.
 */
export const labEntries: LabEntry[] = [];

export const labCategories = Array.from(new Set(labEntries.map((e) => e.category)));

export const labTopics = [
  'Artificial Intelligence',
  'Advanced Computing',
  'Systems & Infrastructure',
  'Emerging Interfaces',
];
