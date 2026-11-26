import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = 'YX';
const BASE_URL = 'https://yx.example.com';

function setMeta(selector: string, attr: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, value] = selector.match(/\[(\w+)="([^"]+)"\]/) ?? [];
    if (key && value) el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, content);
}

export default function useSeo({ title, description, path = '/' }: SeoOptions) {
  useEffect(() => {
    const fullTitle = path === '/' ? `${SITE_NAME} — Building What Comes Next` : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', `${BASE_URL}${path}`);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [title, description, path]);
}
