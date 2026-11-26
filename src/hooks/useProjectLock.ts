import { useCallback, useEffect, useState } from 'react';
import { projectClients, type ProjectId } from '@/lib/projectSupabase';

export interface LockApi {
  lockEnabled: boolean;
  checking: boolean;
  unlocked: boolean;
  verify: (secret: string) => Promise<boolean>;
  enable: (secret: string) => Promise<boolean>;
  disable: (currentSecret: string) => Promise<boolean>;
  resetWithAccount: (newSecret: string) => Promise<boolean>;
  markUnlocked: () => void;
  lockNow: () => void;
}

// Private-lock state per project. The credential hash lives server-side bound to
// (account, project); "unlocked" for this browsing session lives in sessionStorage
// so closing the tab re-locks the app.
const unlockedKey = (project: ProjectId) => `yx-${project}-lock-unlocked`;

export function useProjectLock(project: ProjectId, authenticated: boolean): LockApi {
  const client = projectClients[project];
  const [lockEnabled, setLockEnabled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(unlockedKey(project)) === '1');

  useEffect(() => {
    setLockEnabled(false);
    setChecking(true);
    if (!authenticated) {
      setChecking(false);
      return;
    }
    void (async () => {
      const { data, error } = await client.rpc('has_project_lock', { p_project: project });
      if (error) {
        setLockEnabled(false);
      } else {
        setLockEnabled(data === true);
      }
      setChecking(false);
    })();
  }, [client, project, authenticated]);

  useEffect(() => {
    if (unlocked) sessionStorage.setItem(unlockedKey(project), '1');
    else sessionStorage.removeItem(unlockedKey(project));
  }, [project, unlocked]);

  const verify = useCallback(async (secret: string) => {
    const { data, error } = await client.rpc('verify_project_lock', { p_project: project, p_secret: secret });
    if (error) return false;
    return data === true;
  }, [client, project]);

  const enable = useCallback(async (secret: string) => {
    if (!secret.length) return false;
    const { error } = await client.rpc('set_project_lock', { p_project: project, p_secret: secret });
    if (error) return false;
    setLockEnabled(true);
    setUnlocked(true);
    return true;
  }, [client, project]);

  const disable = useCallback(async (currentSecret: string) => {
    const ok = await verify(currentSecret);
    if (!ok) return false;
    const { error } = await client.rpc('delete_project_lock', { p_project: project });
    if (error) return false;
    setLockEnabled(false);
    setUnlocked(false);
    return true;
  }, [client, project, verify]);

  // Account-verified recovery: replaces the lock only for this project, after the
  // user has re-authenticated their YX Account inside this project's session.
  const resetWithAccount = useCallback(async (newSecret: string) => {
    if (!newSecret.length) return false;
    const { error } = await client.rpc('set_project_lock', { p_project: project, p_secret: newSecret });
    if (error) return false;
    setLockEnabled(true);
    setUnlocked(true);
    return true;
  }, [client, project]);

  const markUnlocked = useCallback(() => setUnlocked(true), []);
  const lockNow = useCallback(() => setUnlocked(false), []);

  return { lockEnabled, checking, unlocked, verify, enable, disable, resetWithAccount, markUnlocked, lockNow };
}
