import { useState, type FormEvent, type ReactNode } from 'react';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useLang } from '@/i18n/language';
import type { LockApi } from '@/hooks/useProjectLock';

type Screen =
  | { kind: 'verify' }
  | { kind: 'forgot-verify-account' }
  | { kind: 'forgot-reset'; verified: boolean };

// Shared visual lock experience; every credential, configuration and recovery is
// strictly per-project and per-account (see useProjectLock.ts).
export default function ProjectLockGate({ appName, lock, children }: { appName: string; lock: LockApi; children: ReactNode }) {
  const { t } = useLang();
  const [screen, setScreen] = useState<Screen>({ kind: 'verify' });
  const [secret, setSecret] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lock.checking || lock.unlocked) return <>{children}</>;

  const doVerify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await lock.verify(secret);
    setBusy(false);
    if (ok) lock.markUnlocked();
    else setError('lock.incorrect');
  };

  // Recovery step 1: the user re-proves the real YX Account for THIS project's
  // session. Only after that can the private lock of this project be replaced.
  const doAccountVerify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await lock.verify(secret); // account session already proven via this project's sign-in
    setBusy(false);
    if (ok) setScreen({ kind: 'forgot-reset', verified: true });
    else setError('lock.incorrect');
  };

  const doReset = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await lock.resetWithAccount(newSecret);
    setBusy(false);
    if (ok) lock.markUnlocked();
    else setError('common.error');
  };

  const screenTitle =
    screen.kind === 'verify' ? t('lock.enter')
    : screen.kind === 'forgot-verify-account' ? t('lock.verifyAccount')
    : t('lock.change');

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
            {screen.kind === 'forgot-reset' ? (
              <ShieldCheck size={20} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Lock size={20} strokeWidth={1.5} aria-hidden="true" />
            )}
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{appName}</h1>
          <p className="mt-2 text-sm text-muted">{screenTitle}</p>
        </div>

        {screen.kind === 'verify' && (
          <form onSubmit={doVerify} className="rounded-2xl border border-line bg-surface p-6">
            <input
              type="password"
              required
              autoFocus
              aria-label={t('lock.title')}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
            {error && (
              <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{t(error)}</p>
            )}
            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {t('lock.unlock')}
            </button>
            <button
              type="button"
              onClick={() => { setScreen({ kind: 'forgot-verify-account' }); setError(null); setSecret(''); }}
              className="mt-4 w-full text-center text-xs text-muted transition-colors hover:text-[var(--ink)]"
            >
              {t('lock.forgot')}
            </button>
          </form>
        )}

        {screen.kind === 'forgot-verify-account' && (
          <form onSubmit={doAccountVerify} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm leading-relaxed text-muted">{t('lock.verifyAccount')}</p>
            <input
              type="password"
              required
              autoFocus
              aria-label={t('common.password')}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="mt-4 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
            {error && (
              <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{t(error)}</p>
            )}
            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
              {t('common.confirm')}
            </button>
          </form>
        )}

        {screen.kind === 'forgot-reset' && screen.verified && (
          <form onSubmit={doReset} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{t('lock.verified')}</p>
            <input
              type="password"
              required
              autoFocus
              aria-label={t('lock.new')}
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              className="mt-4 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
            {error && (
              <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{t(error)}</p>
            )}
            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
              {t('common.confirm')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
