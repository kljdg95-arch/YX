import { useState, type FormEvent, type ReactNode } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useLang } from '@/i18n/language';
import { useProjectAuth } from '@/hooks/useProjectAuth';
import type { ProjectId } from '@/lib/projectSupabase';

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'auth.incorrectCredentials';
  if (m.includes('already registered') || m.includes('already exists')) return 'auth.accountExists';
  return 'common.error';
}

// Full per-project sign-in / sign-up flow. The YX Account identity is shared, but
// the session created here belongs only to this project (see projectSupabase.ts).
export default function ProjectSignIn({ project, appName, children }: { project: ProjectId; appName: string; children: ReactNode }) {
  const { t } = useLang();
  const auth = useProjectAuth(project);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-muted">
        <Loader2 className="animate-spin" size={20} aria-hidden="true" />
      </div>
    );
  }

  if (auth.user) return <>{children}</>;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = mode === 'signin' ? await auth.signIn(email, password) : await auth.signUp(email, password);
    setBusy(false);
    setError(err ? friendlyAuthError(err) : null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
            <Lock size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            {t('auth.yxAccount')} · {appName}
          </h1>
          <p className="mt-2 text-sm text-muted">{t('auth.oneAccountNote')}</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-6">
          <label className="block text-xs font-medium uppercase tracking-[0.15em] text-muted" htmlFor="yx-email">
            {t('common.email')}
          </label>
          <input
            id="yx-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />

          <label className="mt-5 block text-xs font-medium uppercase tracking-[0.15em] text-muted" htmlFor="yx-password">
            {t('common.password')}
          </label>
          <input
            id="yx-password"
            type="password"
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-line px-4 py-2.5 text-sm text-[#b91c1c] dark:text-[#f87171]">
              {t(error)}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
            {mode === 'signin' ? t('common.signIn') : t('common.signUp')}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            className="mt-4 w-full text-center text-xs text-muted transition-colors hover:text-[var(--ink)]"
          >
            {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
          </button>
        </form>
      </div>
    </div>
  );
}
