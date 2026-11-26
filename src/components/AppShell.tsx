import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Lock, Power, Loader2, X } from 'lucide-react';
import { useLang } from '@/i18n/language';
import { useProjectAuth } from '@/hooks/useProjectAuth';
import { useProjectLock } from '@/hooks/useProjectLock';
import ProjectSignIn from '@/components/ProjectSignIn';
import ProjectLockGate from '@/components/ProjectLockGate';
import type { ProjectId } from '@/lib/projectSupabase';

// Per-project application frame. Everything inside is only rendered after this
// project's own sign-in succeeds and (optionally) its private lock is unlocked.
export default function AppShell({
  project,
  appName,
  children,
}: {
  project: ProjectId;
  appName: string;
  children: () => ReactNode;
}) {
  return (
    <ProjectSignIn project={project} appName={appName}>
      <ProjectAppInner project={project} appName={appName}>
        {children}
      </ProjectAppInner>
    </ProjectSignIn>
  );
}

function ProjectAppInner({
  project,
  appName,
  children,
}: {
  project: ProjectId;
  appName: string;
  children: () => ReactNode;
}) {
  const { t, dir } = useLang();
  const auth = useProjectAuth(project);
  const lock = useProjectLock(project, !!auth.user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth.user) lock.lockNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const act = async (fn: () => Promise<boolean>, ok: string) => {
    setBusy(true);
    setMsg(null);
    const okDone = await fn();
    setBusy(false);
    setMsg(okDone ? ok : t('lock.incorrect'));
    if (okDone) {
      setCurrent('');
      setNext('');
      setTimeout(() => setSettingsOpen(false), 700);
    }
  };

  const app = (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--paper)_85%,transparent)] backdrop-blur-xl">
        <div className="container-yx flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/${project}`}
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-[var(--ink)]"
              aria-label={`${appName} introduction`}
            >
              <ArrowLeft size={15} style={dir === 'rtl' ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true" />
              {appName}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs text-muted">
              {auth.user?.email}
            </span>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              aria-expanded={settingsOpen}
              aria-label={t('common.settings')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-[var(--ink)]"
            >
              {settingsOpen ? <X size={15} aria-hidden="true" /> : <Settings size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {settingsOpen && (
        <div className="fixed right-4 top-16 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-surface p-5 shadow-xl">
          <h2 className="text-sm font-semibold">{t('common.settings')}</h2>
          <p className="mt-1 text-xs text-muted">{auth.user?.email}</p>
          <p className="mt-3 text-xs text-muted">{t('token.note')}</p>

          <hr className="my-4 border-line" />

          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            <Lock size={12} aria-hidden="true" />
            {t('lock.title')}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">{t('lock.setNote')}</p>

          {msg && <p className="mt-3 text-xs" role="status">{msg}</p>}

          <div className="mt-3 flex flex-col gap-3">
            {lock.lockEnabled ? (
              <>
                <button
                  onClick={() => { lock.lockNow(); setSettingsOpen(false); }}
                  className="btn-ghost !py-2 justify-center text-xs"
                >
                  <Power size={13} aria-hidden="true" />
                  Lock now
                </button>
                <input
                  type="password"
                  placeholder={t('lock.current')}
                  aria-label={t('lock.current')}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full rounded-xl border border-line bg-transparent px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                />
                <input
                  type="password"
                  placeholder={t('lock.new')}
                  aria-label={t('lock.new')}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className="w-full rounded-xl border border-line bg-transparent px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                />
                <button
                  disabled={busy || !next.length}
                  onClick={() => act(() => lock.disable(current).then(async (removed) => removed ? lock.enable(next) : false), t('common.save'))}
                  className="btn-primary !py-2 justify-center text-xs disabled:opacity-60"
                >
                  {busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                  {t('lock.change')}
                </button>
                <button
                  disabled={busy || !current.length}
                  onClick={() => act(() => lock.disable(current), t('lock.disable'))}
                  className="text-xs text-[#b91c1c] transition-opacity hover:opacity-70 dark:text-[#f87171] disabled:opacity-50"
                >
                  {t('lock.disable')}
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder={t('lock.new')}
                  aria-label={t('lock.new')}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className="w-full rounded-xl border border-line bg-transparent px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                />
                <button
                  disabled={busy || !next.length}
                  onClick={() => act(() => lock.enable(next), t('lock.enable'))}
                  className="btn-primary !py-2 justify-center text-xs disabled:opacity-60"
                >
                  {busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                  {t('lock.enable')}
                </button>
              </>
            )}
          </div>

          <hr className="my-4 border-line" />
          <button onClick={() => auth.signOut()} className="w-full text-left text-xs text-muted transition-colors hover:text-[var(--ink)]">
            {t('common.signOut')}
          </button>
        </div>
      )}

      <main className="pt-14">{children()}</main>
    </div>
  );

  // The lock gate itself renders the app once unlocked; until then it shows the
  // shared lock screen bound to this account + this project.
  return <ProjectLockGate appName={appName} lock={lock}>{app}</ProjectLockGate>;
}
