import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Star, Trash2, Search, RotateCcw, Download, Upload,
  Check, FolderOpen, ChevronDown,
} from 'lucide-react';
import { useLang } from '@/i18n/language';
import TokenBadge from '@/components/TokenBadge';
import AppShell from '@/components/AppShell';
import {
  loadLinerData, saveLinerData, emptyPage, exportBackup, parseBackup,
  estimateStorageBytes, WORKSPACES, workspacePageTemplates,
  type LinerData, type LinerPage, type WorkspaceId,
} from '@/lib/linerStorage';

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LinerApp() {
  return (
    <AppShell project="liner" appName="LINER">
      {() => <LinerWorkspace />}
    </AppShell>
  );
}
function LinerWorkspace() {
  const { t, lang, dir } = useLang();
  const [data, setData] = useState<LinerData>(() => loadLinerData());
  const [workspace, setWorkspace] = useState<WorkspaceId>('personal');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewTrash, setViewTrash] = useState(false);
  const [query, setQuery] = useState('');
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [wsOpen, setWsOpen] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const first = useRef(true);

  const saveStateLabel =
    saveState === 'saved' ? t('liner.saved')
    : saveState === 'saving' ? t('liner.saving')
    : t('common.error');

  // Debounced, honest autosave: the indicator flips to "saved" only after the
  // write actually succeeded.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSaveState('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const ok = saveLinerData(data);
      setSaveState(ok ? 'saved' : 'error');
    }, 400);
    return () => window.clearTimeout(saveTimer.current);
  }, [data]);

  const pages = data.pages;

  const visiblePages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pages
      .filter((p) => p.trashed === viewTrash)
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
      .sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
        return b.updated_at - a.updated_at;
      });
  }, [pages, query, viewTrash]);

  const workspacePages = visiblePages.filter((p) => (viewTrash ? true : p.workspace === workspace));
  const selected = pages.find((p) => p.id === selectedId) ?? null;

  const createPage = useCallback((title?: string) => {
    const page = emptyPage(workspace);
    page.title = title ?? '';
    setData((d) => ({ pages: [page, ...d.pages] }));
    setSelectedId(page.id);
    setViewTrash(false);
  }, [workspace]);

  const patchPage = useCallback((id: string, patch: Partial<LinerPage>) => {
    setData((d) => ({
      pages: d.pages.map((p) => (p.id === id ? { ...p, ...patch, updated_at: Date.now() } : p)),
    }));
  }, []);

  const restorePage = useCallback((id: string) => {
    patchPage(id, { trashed: false });
  }, [patchPage]);

  const purgePage = useCallback((id: string) => {
    setData((d) => ({ pages: d.pages.filter((p) => p.id !== id) }));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const doExport = () => {
    const blob = new Blob([exportBackup(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseBackup(String(reader.result));
      if (parsed) {
        setData(parsed);
        setSelectedId(null);
      } else {
        alert(t('common.error'));
      }
    };
    reader.readAsText(file);
  };

  const templates = workspacePageTemplates()[workspace] ?? [];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-e border-line bg-surface md:flex">
        <div className="p-4">
          <button
            onClick={() => setWsOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm font-medium"
            aria-expanded={wsOpen}
          >
            <span className="flex items-center gap-2">
              <FolderOpen size={15} aria-hidden="true" />
              {t(WORKSPACES.find((w) => w.id === workspace)!.key)}
            </span>
            <ChevronDown size={14} className={`transition-transform ${wsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {wsOpen && (
            <ul className="mt-2 space-y-1">
              {WORKSPACES.map((w) => (
                <li key={w.id}>
                  <button
                    onClick={() => { setWorkspace(w.id); setWsOpen(false); setViewTrash(false); setSelectedId(null); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      workspace === w.id ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent' : 'text-muted hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{t(w.key)}</span>
                    <span className="text-[10px] tracking-widest opacity-60">{w.internal}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button onClick={() => createPage()} className="btn-primary mt-3 w-full justify-center !py-2 text-xs">
            <Plus size={14} aria-hidden="true" />
            {t('liner.newPage')}
          </button>

          <div className="relative mt-3">
            <Search size={14} className="pointer-events-none absolute inset-y-0 start-3 my-auto text-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.search')}
              aria-label={t('common.search')}
              className="w-full rounded-xl border border-line bg-transparent py-2 pe-3 ps-9 text-xs outline-none focus:border-[var(--accent)]"
            />
          </div>

          <button
            onClick={() => setViewTrash((v) => !v)}
            className={`mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
              viewTrash ? 'text-accent' : 'text-muted hover:text-[var(--ink)]'
            }`}
          >
            <Trash2 size={13} aria-hidden="true" />
            {t('liner.trash')}
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto border-t border-line px-2 py-2">
          {workspacePages.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-muted">{t('liner.empty')}</li>
          )}
          {workspacePages.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelectedId(p.id)}
                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                  selectedId === p.id ? 'bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] text-[var(--ink)]' : 'text-muted hover:text-[var(--ink)]'
                }`}
              >
                <span className="flex-1 truncate">{p.title || t('liner.newPage')}</span>
                {p.favorite && <Star size={12} className="shrink-0 fill-current text-accent" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-line p-4">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span data-testid="liner-save-state">{saveStateLabel}</span>
            <span>{formatBytes(estimateStorageBytes())}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={doExport} className="btn-ghost flex-1 justify-center !px-2 !py-1.5 text-[11px]">
              <Download size={12} aria-hidden="true" />
              {t('liner.exportBackup')}
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn-ghost flex-1 justify-center !px-2 !py-1.5 text-[11px]">
              <Upload size={12} aria-hidden="true" />
              {t('liner.importBackup')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
            />
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-line px-6 py-3">
          <TokenBadge />
          <span className="text-xs text-muted">{t('liner.localNote')}</span>
          <Link to="/liner" className="ms-auto shrink-0 text-xs text-muted transition-colors hover:text-[var(--ink)]">
            liner.yx
          </Link>
        </div>

        {selected && !selected.trashed ? (
          <div className="flex min-h-0 flex-1 flex-col p-6 md:p-10">
            <input
              value={selected.title}
              onChange={(e) => patchPage(selected.id, { title: e.target.value })}
              placeholder={t('common.name')}
              aria-label={t('common.name')}
              className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none"
            />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted">
              <button
                onClick={() => patchPage(selected.id, { favorite: !selected.favorite })}
                className="flex items-center gap-1.5 transition-colors hover:text-[var(--ink)]"
              >
                <Star size={13} className={selected.favorite ? 'fill-current text-accent' : ''} aria-hidden="true" />
                {t('liner.favorites')}
              </button>
              <span>{new Date(selected.updated_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-GB')}</span>
            </div>
            <textarea
              value={selected.content}
              onChange={(e) => patchPage(selected.id, { content: e.target.value })}
              aria-label={t('liner.pages')}
              placeholder={lang === 'fa' ? 'بنویسید…' : 'Start writing…'}
              className="mt-6 min-h-[50vh] flex-1 w-full resize-none rounded-2xl border border-line bg-surface p-6 text-sm leading-[1.8] outline-none focus:border-[var(--accent)]"
              dir="auto"
            />
          </div>
        ) : viewTrash ? (
          <div className="flex-1 p-6 md:p-10">
            <h2 className="text-lg font-semibold">{t('liner.trash')}</h2>
            <ul className="mt-6 space-y-2">
              {pages.filter((p) => p.trashed).map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-3">
                  <span className="truncate text-sm">{p.title || t('liner.newPage')}</span>
                  <span className="flex gap-3">
                    <button onClick={() => restorePage(p.id)} aria-label={t('common.confirm')} className="text-muted transition-colors hover:text-[var(--ink)]">
                      <RotateCcw size={15} aria-hidden="true" />
                    </button>
                    <button onClick={() => purgePage(p.id)} aria-label={t('common.delete')} className="text-muted transition-colors hover:text-[#b91c1c] dark:hover:text-[#f87171]">
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
              {pages.filter((p) => p.trashed).length === 0 && (
                <li className="text-sm text-muted">{lang === 'fa' ? 'سطل خالی است.' : 'Trash is empty.'}</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            {templates.length > 0 && pages.filter((p) => p.workspace === workspace && !p.trashed).length === 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                  {t(WORKSPACES.find((w) => w.id === workspace)!.key)} · {WORKSPACES.find((w) => w.id === workspace)!.internal}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {lang === 'fa'
                    ? 'برای شروع، یکی از قالب‌های این فضای کاری را بسازید — هر قالب یک صفحهٔ واقعی و قابل ویرایش است.'
                    : 'Start from one of this workspace’s templates — each one creates a real, editable page.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl}
                      onClick={() => createPage(tpl)}
                      className="rounded-full border border-line px-4 py-2 text-xs transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-accent"
                    >
                      <Check size={11} className="me-1.5 inline" aria-hidden="true" />
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{t('liner.pages')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspacePages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="group rounded-2xl border border-line bg-surface p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                >
                  <span className="block truncate text-sm font-medium">{p.title || t('liner.newPage')}</span>
                  <span className="mt-2 block truncate text-xs text-muted">{p.content.slice(0, 80) || '—'}</span>
                  <span className="mt-3 block text-[11px] text-muted">
                    {new Date(p.updated_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB')}
                  </span>
                </button>
              ))}
              {workspacePages.length === 0 && <p className="text-sm text-muted">{t('liner.empty')}</p>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
