export type ArticleCategory =
  | 'Technical Article'
  | 'Research Publication'
  | 'Engineering Insight'
  | 'Technology Analysis'
  | 'Experimental Report'
  | 'Company Update';

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Technical Article',
  'Research Publication',
  'Engineering Insight',
  'Technology Analysis',
  'Experimental Report',
  'Company Update',
];

export interface JournalArticle {
  slug: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  /** ISO publication date */
  publishedAt?: string;
  /** Full body content, if written */
  content?: string;
  /** Technology field slugs this article relates to */
  fields?: string[];
}

/**
 * YX Journal articles. The archive, search, reading pages, and related
 * articles render automatically from this list. Add real articles only —
 * the archive shows an elegant empty state until the first piece is published.
 */
export const journalArticles: JournalArticle[] = [];

export const articleCategoriesInUse = Array.from(
  new Set(journalArticles.map((a) => a.category))
);
