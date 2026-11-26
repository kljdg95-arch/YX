import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, X } from 'lucide-react';
import { searchSite, type SearchItem, type SearchCategory } from '@/data/searchIndex';

const CATEGORY_ORDER: SearchCategory[] = ['Pages', 'Divisions', 'Technology', 'Projects', 'Research', 'Journal'];

function grouped(items: SearchItem[]) {
  const groups: { category: SearchCategory; items: SearchItem[] }[] = [];
  for (const category of CATEGORY_ORDER) {
    const inCategory = items.filter((i) => i.category === category);
    if (inCategory.length > 0) groups.push({ category, items: inCategory });
  }
  return groups;
}

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchSite(query), [query]);
  const groups = useMemo(() => grouped(results), [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const t = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  const go = useCallback(
    (item: SearchItem) => {
      onClose();
      navigate(item.href);
    },
    [navigate, onClose]
  );

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && flat[activeIndex]) {
        e.preventDefault();
        go(flat[activeIndex]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flat, activeIndex, go, onClose]);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] md:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_40%,transparent)] backdrop-blur-sm" />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={17} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, research, technology…"
            aria-label="Search"
            className="w-full bg-transparent py-4 text-sm text-[var(--ink)] placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-[var(--ink)]"
          >
            <X size={15} />
          </button>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain">
          {query.trim() === '' ? (
            <div className="px-5 py-10 text-center text-sm text-muted">
              <p>Type to search across the entire site.</p>
              <p className="mt-2 text-xs">Projects, technology fields, research, articles, and pages.</p>
            </div>
          ) : flat.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted">
              <p>No results for “{query}”.</p>
              <p className="mt-2 text-xs">Try a broader term, or a category like “robotics”.</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.category} role="group" aria-label={group.category}>
                <p className="sticky top-0 bg-surface px-5 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
                  {group.category}
                </p>
                {group.items.map((item) => {
                  runningIndex += 1;
                  const active = runningIndex === activeIndex;
                  return (
                    <button
                      key={item.id}
                      data-active={active}
                      onClick={() => go(item)}
                      onMouseEnter={() => setActiveIndex(runningIndex)}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                        active ? 'bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]' : ''
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[var(--ink)]">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {item.subtitle}
                          </span>
                      )}
                      </span>
                      {active && <CornerDownLeft size={14} className="shrink-0 text-accent" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] text-muted">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
