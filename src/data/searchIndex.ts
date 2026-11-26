import { techFields } from '@/data/techFields';
import { divisions } from '@/data/divisions';
import { projects } from '@/data/projects';
import { labEntries } from '@/data/labs';
import { journalArticles } from '@/data/journal';

export type SearchCategory = 'Pages' | 'Divisions' | 'Technology' | 'Projects' | 'Research' | 'Journal';

export interface SearchItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
}

const staticPages: SearchItem[] = [
  { id: 'p-home', category: 'Pages', title: 'Home', href: '/', keywords: 'yx building what comes next technology company' },
  { id: 'p-about', category: 'Pages', title: 'About', href: '/about', keywords: 'vision mission philosophy company direction' },
  { id: 'p-tech', category: 'Pages', title: 'Technology Explorer', href: '/technology', keywords: 'fields divisions engineering science' },
  { id: 'p-projects', category: 'Pages', title: 'Projects', href: '/projects', keywords: 'work developments portfolio archive' },
  { id: 'p-labs', category: 'Pages', title: 'YX Labs', href: '/labs', keywords: 'research experiments laboratory prototypes' },
  { id: 'p-journal', category: 'Pages', title: 'YX Journal', href: '/journal', keywords: 'articles publications writing insights' },
  { id: 'p-roadmap', category: 'Pages', title: 'Roadmap', href: '/roadmap', keywords: 'timeline milestones future direction development journey' },
  { id: 'p-innovation', category: 'Pages', title: 'Innovation & Future', href: '/innovation', keywords: 'vision future emerging interests' },
  { id: 'p-contact', category: 'Pages', title: 'Contact', href: '/contact', keywords: 'message email get in touch form' },
];

export const searchIndex: SearchItem[] = [
  ...staticPages,
  ...divisions.map((d): SearchItem => ({
    id: `d-${d.id}`,
    category: 'Divisions',
    title: d.name,
    subtitle: d.tagline,
    href: d.slug,
    keywords: `${d.description} ${d.focus}`,
  })),
  ...techFields.map((f): SearchItem => ({
    id: `t-${f.slug}`,
    category: 'Technology',
    title: f.name,
    subtitle: f.description,
    href: `/technology/${f.slug}`,
    keywords: `${f.topics.join(' ')} ${f.detail}`,
  })),
  ...projects.map((p): SearchItem => ({
    id: `pr-${p.slug}`,
    category: 'Projects',
    title: p.name,
    subtitle: p.description,
    href: `/projects/${p.slug}`,
    keywords: `${p.category} ${p.status} ${p.detail}`,
  })),
  ...labEntries.map((e): SearchItem => ({
    id: `l-${e.slug}`,
    category: 'Research',
    title: e.title,
    subtitle: e.summary,
    href: `/labs/${e.slug}`,
    keywords: `${e.kind} ${e.category} ${e.status}`,
  })),
  ...journalArticles.map((a): SearchItem => ({
    id: `j-${a.slug}`,
    category: 'Journal',
    title: a.title,
    subtitle: a.summary,
    href: `/journal/${a.slug}`,
    keywords: `${a.category} ${a.summary}`,
  })),
];

export function searchSite(query: string, limit = 24): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return searchIndex
    .map((item) => {
      const haystack = `${item.title} ${item.subtitle ?? ''} ${item.keywords}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        const idx = haystack.indexOf(term);
        if (idx === -1) return null;
        score += item.title.toLowerCase().includes(term) ? 3 : 1;
        if (idx === 0) score += 1;
      }
      return { item, score };
    })
    .filter((r): r is { item: SearchItem; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
