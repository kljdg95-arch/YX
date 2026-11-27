import { useState, type FormEvent, type ReactNode } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useLang } from '@/i18n/language';
import type { LockApi } from '@/hooks/useProjectLock';

type Screen = 'setup' | 'verify' | 'forgot-confirm';

// Shared visual lock experience. First-time visitors see the optional password
// setup screen; returning visitors with a password see the unlock screen;
// returning visitors who skipped setup pass through directly.
export default function ProjectLockGate({ appName, lock, children }: { appName: string; lock: LockApi; children: ReactNode }) {
  const { t } = useLang();
  const [screen, setScreen] = useState<Screen>('verify');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lock.checking) return <>{children}</>;

  // No lock and not skipped → show first-time setup
  const showSetup = !lock.lockEnabled && !lock.setupSkipped;
  // Lock enabled and not unlocked → show verify
  const showVerify = lock.lockEnabled && !lock.unlocked;

  if (!showSetup && !showVerify) {
    return <>{children}</>;
  }

  // Determine which screen to actually render
  let activeScreen: Screen;
  if (showSetup) {
    activeScreen = 'setup';
  } else if (showVerify) {
    activeScreen = screen === 'forgot-confirm' ? 'forgot-confirm' : 'verify';
  } else {
    activeScreen = screen;
  }

  const doSetup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pw1.length) {
      setError('entry.emptyPassword');
      return;
    }
    if (pw1 !== pw2) {
      setError('entry.mismatch');
      return;
    }
    setBusy(true);
    const ok = await lock.enable(pw1);
    setBusy(false);
    if (ok) lock.markUnlocked();
    else setError('common.error');
  };

  const doSkip = () => {
    lock.skipSetup();
    lock.markUnlocked();
  };

  const doVerify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const ok = await lock.verify(secret);
    setBusy(false);
    if (ok) lock.markUnlocked();
    else setError('lock.incorrect');
  };

  const doForceClear = () => {
    lock.forceClear();
    setScreen('setup');
    setError(null);
    setSecret('');
  };

  const screenTitle =
    activeScreen === 'setup' ? t('entry.protectApp')
    : activeScreen === 'verify' ? t('lock.enter')
    : t('entry.resetLock');

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
            <Lock size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{appName}</h1>
          <p className="mt-2 text-sm text-muted">{screenTitle}</p>
        </div>

        {activeScreen === 'setup' && (
          <form onSubmit={doSetup} className="rounded-2xl border border-line bg-surface p-6">
            <p className="mb-4 text-xs leading-relaxed text-muted">{t('entry.protectNote')}</p>

            <label className="block text-xs font-medium uppercase tracking-[0.15em] text-muted" htmlFor="yx-pw1">
              {t('entry.choosePassword')}
            </label>
            <input
              id="yx-pw1"
              type="password"
              required
              autoFocus
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />

            <label className="mt-5 block text-xs font-medium uppercase tracking-[0.15em] text-muted" htmlFor="yx-pw2">
              {t('entry.confirmPassword')}
            </label>
            <input
              id="yx-pw2"
              type="password"
              required
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />

            {error && (
              <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{t(error)}</p>
            )}

            <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {t('entry.setPassword')}
            </button>

            <div className="mt-5 border-t border-line pt-5">
              <button
                type="button"
                onClick={doSkip}
                className="w-full text-center text-xs text-muted transition-colors hover:text-[var(--ink)]"
              >
                {t('entry.skipPassword')}
              </button>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-muted">{t('entry.skipNote')}</p>
            </div>
          </form>
        )}

        {activeScreen === 'verify' && (
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
              onClick={() => { setScreen('forgot-confirm'); setError(null); setSecret(''); }}
              className="mt-4 w-full text-center text-xs text-muted transition-colors hover:text-[var(--ink)]"
            >
              {t('lock.forgot')}
            </button>
          </form>
        )}

        {activeScreen === 'forgot-confirm' && (
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm leading-relaxed text-muted">{t('entry.forgotNote')}</p>
            <button
              type="button"
              onClick={doForceClear}
              className="btn-primary mt-6 w-full justify-center"
            >
              {t('entry.resetLock')}
            </button>
            <button
              type="button"
              onClick={() => { setScreen('verify'); setError(null); setSecret(''); }}
              className="mt-4 w-full text-center text-xs text-muted transition-colors hover:text-[var(--ink)]"
            >
              {t('entry.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
