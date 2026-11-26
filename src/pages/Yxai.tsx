import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import {
  MessageSquare, PanelRight, Folder, FilePlus, Loader2, Download,
  RefreshCw, Monitor, Tablet, Smartphone, Maximize2, FolderOpen, Sparkles,
} from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import { useLang } from '@/i18n/language';
import TokenBadge from '@/components/TokenBadge';
import AppShell from '@/components/AppShell';
import { projectClients } from '@/lib/projectSupabase';

// ---------------------------------------------------------------------------
// YXAI app: three-panel layout (files | conversation | live preview) with real
// cloud project storage and real browser ZIP export. AI conversation needs the
// YXAI model gateway, which does not exist yet — it is honestly disabled.
// ---------------------------------------------------------------------------

interface YxaiProject { id: string; name: string; description: string }
interface YxaiFile { id: string; path: string; content: string }

function defaultSiteHtml(name: string, description: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${name}</title>
<style>
  :root { --ink: #0a0a0b; --paper: #fafafa; --accent: #0f766e; }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: var(--paper); color: var(--ink); }
  header { display: flex; justify-content: space-between; align-items: center; padding: 20px 6vw; }
  header strong { letter-spacing: 0.02em; }
  nav a { margin-inline-start: 20px; color: #6b6f76; text-decoration: none; font-size: 14px; }
  .hero { padding: 14vh 6vw 10vh; }
  .hero h1 { font-size: clamp(2rem, 6vw, 4rem); line-height: 1.05; letter-spacing: -0.02em; max-width: 18ch; }
  .hero p { margin-top: 20px; max-width: 46ch; color: #6b6f76; line-height: 1.6; }
  .cta { display: inline-block; margin-top: 32px; background: var(--ink); color: var(--paper); padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 14px; }
  .cards { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding: 0 6vw 12vh; }
  .card { border: 1px solid rgba(10,10,11,.08); background: #fff; border-radius: 16px; padding: 24px; }
  .card h3 { font-size: 15px; }
  .card p { margin-top: 8px; font-size: 13px; color: #6b6f76; line-height: 1.6; }
  footer { border-top: 1px solid rgba(10,10,11,.08); padding: 24px 6vw; font-size: 13px; color: #6b6f76; }
</style>
</head>
<body>
<header><strong>${name}</strong><nav><a href="#">Home</a><a href="#features">Features</a><a href="#about">About</a></nav></header>
<section class="hero">
  <h1>${description || 'A generated website, ready to evolve.'}</h1>
  <p>Edit any file in the workspace and the preview reloads instantly. Download the complete project as a ZIP whenever you like.</p>
  <a class="cta" href="#features">Explore features</a>
</section>
<section class="cards" id="features">
  <div class="card"><h3>Real preview</h3><p>The site actually runs in the preview panel — navigation and links work.</p></div>
  <div class="card"><h3>Your account</h3><p>Projects are stored on your YX Account and belong only to you.</p></div>
  <div class="card"><h3>Take it anywhere</h3><p>Export a complete ZIP with README and .env.example, no secrets included.</p></div>
</section>
<footer>© ${new Date().getFullYear()} ${name}</footer>
</body>
</html>`;
}

const DEFAULT_CSS = `/* base styles live inside index.html for this template */`;
const DEFAULT_README = (name: string) => `# ${name}

Generated with YXAI. A static website project.

## Run

Open \`index.html\` in a browser, or serve the folder with any static file server.

## Notes

- \`.env.example\` documents configuration keys; no real secrets are included in exports.
- External services required: none for this template.`;

const DEFAULT_ENV_EXAMPLE = `# Example configuration — copy to .env and fill in real values.
# Real secrets must never be committed or included in exports.
VITE_SITE_NAME="My Site"
`;

export default function Yxai() {
  useSeo({ title: 'YXAI — YX', description: 'YXAI is the AI creation and engineering platform of YX.', path: '/yxai' });
  const { t, lang } = useLang();

  return (
    <div className="pt-16">
      <section className="container-yx py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">YXAI</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          {lang === 'fa' ? 'ساخت و مهندسی با هوش مصنوعی' : 'Create and engineer with AI.'}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
          {lang === 'fa'
            ? 'گفتگو، ساخت وب‌سایت، پیش‌نمایش زنده، فضای کد و خروجی کامل پروژه — در یک محیط.'
            : 'Conversation, website generation, a real live preview, a code workspace and complete project export — in one environment.'}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/yxai/app" className="btn-primary">
            {t('yxai.app')}
            <ArrowRightIcon />
          </Link>
          <a href="#status" className="btn-ghost">{t('intro.status')}</a>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-yx grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MessageSquare, en: 'Conversation & workspace', fa: 'گفتگو و فضای کاری', dEn: 'A three-panel environment: files, conversation, and a real running preview.', dFa: 'محیط سه‌پنلی: فایل‌ها، گفتگو، و پیش‌نمایش واقعی در حال اجرا.' },
            { icon: PanelRight, en: 'Full live preview', fa: 'پیش‌نمایش زندهٔ کامل', dEn: 'The generated site actually renders — desktop, tablet and mobile viewports.', dFa: 'سایت ساخته‌شده واقعاً اجرا می‌شود — نمای دسکتاپ، تبلت و موبایل.' },
            { icon: Folder, en: 'Cloud projects', fa: 'پروژه‌های ابری', dEn: 'Projects and files are stored on your YX Account and belong only to you.', dFa: 'پروژه‌ها و فایل‌ها روی حساب YX شما ذخیره می‌شوند و فقط متعلق به شما هستند.' },
            { icon: Download, en: 'Real ZIP export', fa: 'خروجی واقعی ZIP', dEn: 'Download the complete project with README and .env.example. No secrets.', dFa: 'دانلود کامل پروژه با README و .env.example. بدون هیچ رمز یا کلید.' },
          ].map((c) => (
            <div key={c.en}>
              <c.icon size={20} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-semibold">{lang === 'fa' ? c.fa : c.en}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{lang === 'fa' ? c.dFa : c.dEn}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="status" className="container-yx py-20">
        <div className="rounded-2xl border border-amber-600/30 bg-amber-500/5 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            <Sparkles size={15} aria-hidden="true" />
            {t('common.inDevelopment')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t('yxai.aiNote')}</p>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-yx flex flex-col items-center py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t('intro.entry')}</h2>
          <Link to="/yxai/app" className="btn-primary mt-8">
            {t('yxai.app')}
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}

// ---------------------------------------------------------------------------
// The application
// ---------------------------------------------------------------------------

export function YxaiApp() {
  return (
    <AppShell project="yxai" appName="YXAI">
      {() => <YxaiWorkspace />}
    </AppShell>
  );
}

function YxaiWorkspace() {
  const { t, lang } = useLang();
  const client = projectClients.yxai;

  const [projects, setProjects] = useState<YxaiProject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [files, setFiles] = useState<YxaiFile[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zipBusy, setZipBusy] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [projectsOpen, setProjectsOpen] = useState(true);
  const saveTimer = useRef<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await client.from('yxai_projects').select('id, name, description').order('created_at', { ascending: false });
    if (!error && data) setProjects(data as YxaiProject[]);
    setLoading(false);
  }, [client]);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  const loadFiles = useCallback(async (projectId: string) => {
    const { data, error } = await client.from('yxai_files').select('id, path, content').eq('project_id', projectId).order('path');
    if (!error && data) {
      setFiles(data as YxaiFile[]);
      setSelectedPath((data as YxaiFile[]).find((f) => f.path === 'index.html')?.path ?? (data as YxaiFile[])[0]?.path ?? null);
    }
  }, [client]);

  const openProject = useCallback(async (id: string) => {
    setActiveId(id);
    await loadFiles(id);
  }, [loadFiles]);

  const createProject = useCallback(async () => {
    const name = lang === 'fa' ? `پروژهٔ ${projects.length + 1}` : `Project ${projects.length + 1}`;
    const { data, error } = await client.from('yxai_projects').insert({ name, description: newDesc }).select().maybeSingle();
    if (error || !data) return;
    const pid = data.id as string;
    await client.from('yxai_files').insert([
      { project_id: pid, path: 'index.html', content: defaultSiteHtml(name, newDesc) },
      { project_id: pid, path: 'styles.css', content: DEFAULT_CSS },
      { project_id: pid, path: 'README.md', content: DEFAULT_README(name) },
      { project_id: pid, path: '.env.example', content: DEFAULT_ENV_EXAMPLE },
    ]);
    setNewDesc('');
    await loadProjects();
    await openProject(pid);
  }, [client, projects.length, newDesc, lang, loadProjects, openProject]);

  const patchFile = useCallback((path: string, content: string) => {
    setFiles((fs) => fs.map((f) => (f.path === path ? { ...f, content } : f)));
  }, []);

  const activeProject = projects.find((p) => p.id === activeId) ?? null;
  const selected = files.find((f) => f.path === selectedPath) ?? null;

  // Debounced autosave to the account cloud storage; status shown honestly.
  useEffect(() => {
    if (!activeId || !selected) return;
    setSaving(true);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      await client.from('yxai_files').update({ content: selected.content }).eq('id', selected.id);
      setSaving(false);
    }, 600);
    return () => window.clearTimeout(saveTimer.current);
  }, [client, activeId, selected]);

  const previewDoc = useMemo(() => {
    const html = files.find((f) => f.path === 'index.html')?.content ?? '<p>No index.html</p>';
    const css = files.filter((f) => f.path.endsWith('.css')).map((f) => f.content).join('\n');
    return html.replace('</head>', `<style>${css}</style></head>`);
  }, [files]);

  const downloadZip = useCallback(async () => {
    if (!activeProject) return;
    setZipBusy(true);
    try {
      const zip = new JSZip();
      for (const f of files) zip.file(f.path, f.content);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.name.toLowerCase().replace(/\W+/g, '-') || 'yxai-project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipBusy(false);
    }
  }, [activeProject, files]);

  const vpClass = viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'w-[768px] max-w-full' : 'w-[390px] max-w-full';

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5 md:px-6">
        <TokenBadge />
        <button onClick={() => setProjectsOpen((o) => !o)} className="btn-ghost !px-3 !py-1.5 text-xs">
          <FolderOpen size={13} aria-hidden="true" /> {t('yxai.myProjects')}
        </button>
        {saving && <span className="text-[11px] text-muted">{t('liner.saving')}</span>}
        {!saving && activeProject && <span className="text-[11px] text-muted">{t('yxai.saved')}</span>}
        <div className="ms-auto flex items-center gap-2">
          <button onClick={() => setPreviewKey((k) => k + 1)} aria-label={t('yxai.reload')} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-[var(--ink)]">
            <RefreshCw size={13} aria-hidden="true" />
          </button>
          <div className="flex overflow-hidden rounded-full border border-line" role="group" aria-label="Viewport">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setViewport(v)}
                aria-pressed={viewport === v}
                className={`px-2.5 py-1.5 ${viewport === v ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent' : 'text-muted hover:text-[var(--ink)]'}`}
              >
                <Icon size={13} aria-hidden="true" />
              </button>
            ))}
          </div>
          <button onClick={() => void downloadZip()} disabled={!activeProject || zipBusy} className="btn-primary !px-3 !py-1.5 text-xs disabled:opacity-40">
            {zipBusy ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : <Download size={13} aria-hidden="true" />}
            {t('yxai.exportZip')}
          </button>
        </div>
      </div>

      {projectsOpen && (
        <div className="border-b border-line bg-surface px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-56 flex-1">
              <label htmlFor="yxai-desc" className="text-xs text-muted">{t('yxai.describeSite')}</label>
              <input
                id="yxai-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={lang === 'fa' ? 'مثلاً: وب‌سایت شرکتی برای یک استودیو معماری' : 'e.g. a corporate site for an architecture studio'}
                className="mt-1 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <button onClick={() => void createProject()} className="btn-primary !py-2 text-xs">
              {t('yxai.generateSite')}
            </button>
          </div>
          {loading ? (
            <Loader2 className="mt-4 animate-spin text-muted" size={16} aria-hidden="true" />
          ) : projects.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {projects.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => void openProject(p.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${activeId === p.id ? 'border-[var(--accent)] text-accent' : 'border-line text-muted hover:text-[var(--ink)]'}`}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-muted">{lang === 'fa' ? 'هنوز پروژه‌ای ندارید.' : 'No projects yet.'}</p>
          )}
        </div>
      )}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[16rem_20rem_1fr]">
        {/* Files */}
        <aside className="border-b border-line lg:border-b-0 lg:border-e">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('yxai.files')}</h2>
            <button
              onClick={() => {
                if (!activeId) return;
                const path = window.prompt(lang === 'fa' ? 'نام فایل:' : 'File name:');
                if (!path) return;
                void (async () => {
                  const { data } = await client.from('yxai_files').insert({ project_id: activeId, path, content: '' }).select().maybeSingle();
                  if (data) { setFiles((fs) => [...fs, data as YxaiFile]); setSelectedPath(path); }
                })();
              }}
              disabled={!activeId}
              aria-label={lang === 'fa' ? 'فایل جدید' : 'New file'}
              className="text-muted transition-colors hover:text-[var(--ink)] disabled:opacity-40"
            >
              <FilePlus size={14} aria-hidden="true" />
            </button>
          </div>
          <ul className="pb-3">
            {files.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => setSelectedPath(f.path)}
                  className={`flex w-full items-center gap-2 px-4 py-1.5 text-start font-mono text-xs transition-colors ${selectedPath === f.path ? 'text-accent' : 'text-muted hover:text-[var(--ink)]'}`}
                  dir="ltr"
                >
                  <FilePlus size={11} aria-hidden="true" />
                  <span className="truncate">{f.path}</span>
                </button>
              </li>
            ))}
            {files.length === 0 && <li className="px-4 py-3 text-xs text-muted">{lang === 'fa' ? 'پروژه‌ای باز نیست.' : 'No project open.'}</li>}
          </ul>
        </aside>

        {/* Conversation / editor */}
        <section className="border-b border-line lg:border-b-0 lg:border-e">
          <div className="px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('yxai.chat')}</h2>
          </div>
          <div className="mx-4 mb-4 rounded-xl border border-amber-600/30 bg-amber-500/5 p-3 text-[11px] leading-relaxed text-muted">
            {t('yxai.aiNote')}
          </div>
          {selected ? (
            <div className="px-4 pb-4">
              <p className="mb-2 font-mono text-[11px] text-muted" dir="ltr">{selected.path}</p>
              <textarea
                value={selected.content}
                onChange={(e) => patchFile(selected.path, e.target.value)}
                aria-label={selected.path}
                spellCheck={false}
                className="h-64 w-full resize-none rounded-xl border border-line bg-surface p-3 font-mono text-xs leading-relaxed outline-none focus:border-[var(--accent)] lg:h-[26rem]"
                dir="ltr"
              />
            </div>
          ) : (
            <p className="px-4 text-xs text-muted">{lang === 'fa' ? 'فایلی انتخاب نشده.' : 'No file selected.'}</p>
          )}
        </section>

        {/* Live preview */}
        <section className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between px-4 py-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('yxai.preview')}</h2>
            <button
              onClick={() => window.open(URL.createObjectURL(new Blob([previewDoc], { type: 'text/html' })), '_blank', 'noopener')}
              aria-label={lang === 'fa' ? 'تمام‌صفحه' : 'Full screen'}
              className="text-muted transition-colors hover:text-[var(--ink)]"
            >
              <Maximize2 size={13} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 justify-center overflow-hidden px-4 pb-4">
            <iframe
              key={previewKey}
              title="YXAI live preview"
              srcDoc={previewDoc}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className={`h-full min-h-[24rem] rounded-xl border border-line bg-white ${vpClass}`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
