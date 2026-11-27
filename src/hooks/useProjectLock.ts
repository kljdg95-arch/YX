import { useCallback, useEffect, useState } from 'react';
import type { ProjectId } from '@/lib/projectSupabase';

export interface LockApi {
  lockEnabled: boolean;
  checking: boolean;
  unlocked: boolean;
  setupSkipped: boolean;
  verify: (secret: string) => Promise<boolean>;
  enable: (secret: string) => Promise<boolean>;
  change: (currentSecret: string, newSecret: string) => Promise<boolean>;
  disable: (currentSecret: string) => Promise<boolean>;
  skipSetup: () => void;
  forceClear: () => void;
  markUnlocked: () => void;
  lockNow: () => void;
}

// Per-project private lock stored entirely in the browser via Web Crypto.
// Each project (liner / yqro / yxai) has its own independent password hash
// and setup state. No server round-trip is needed for lock operations.
// Passwords are never stored in plaintext — only PBKDF2 SHA-256 hashes.
const setupKey = (project: ProjectId) => `yx-${project}-setup-done`;
const hashKey = (project: ProjectId) => `yx-${project}-lock-hash`;
const saltKey = (project: ProjectId) => `yx-${project}-lock-salt`;
const unlockedKey = (project: ProjectId) => `yx-${project}-lock-unlocked`;

const enc = new TextEncoder();

async function deriveHash(secret: string, saltBytes: Uint8Array): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

function generateSalt(): Uint8Array {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return arr;
}

function saltToString(salt: Uint8Array): string {
  return btoa(String.fromCharCode(...salt));
}

function saltFromString(s: string): Uint8Array {
  return new Uint8Array(atob(s).split('').map((c) => c.charCodeAt(0)));
}

export function useProjectLock(project: ProjectId, _authenticated: boolean): LockApi {
  const [lockEnabled, setLockEnabled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [setupSkipped, setSetupSkipped] = useState(false);
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(unlockedKey(project)) === '1');

  useEffect(() => {
    const hasHash = !!localStorage.getItem(hashKey(project));
    const skipped = localStorage.getItem(setupKey(project)) === 'skipped';
    setLockEnabled(hasHash);
    setSetupSkipped(skipped);
    setChecking(false);
  }, [project]);

  useEffect(() => {
    if (unlocked) sessionStorage.setItem(unlockedKey(project), '1');
    else sessionStorage.removeItem(unlockedKey(project));
  }, [project, unlocked]);

  const verify = useCallback(async (secret: string) => {
    const storedHash = localStorage.getItem(hashKey(project));
    const storedSalt = localStorage.getItem(saltKey(project));
    if (!storedHash || !storedSalt) return false;
    const computed = await deriveHash(secret, saltFromString(storedSalt));
    return computed === storedHash;
  }, [project]);

  const enable = useCallback(async (secret: string) => {
    if (!secret.length) return false;
    const salt = generateSalt();
    const hash = await deriveHash(secret, salt);
    localStorage.setItem(hashKey(project), hash);
    localStorage.setItem(saltKey(project), saltToString(salt));
    localStorage.setItem(setupKey(project), 'password');
    setLockEnabled(true);
    setSetupSkipped(false);
    setUnlocked(true);
    return true;
  }, [project]);

  const change = useCallback(async (currentSecret: string, newSecret: string) => {
    if (!newSecret.length) return false;
    const ok = await verify(currentSecret);
    if (!ok) return false;
    const salt = generateSalt();
    const hash = await deriveHash(newSecret, salt);
    localStorage.setItem(hashKey(project), hash);
    localStorage.setItem(saltKey(project), saltToString(salt));
    return true;
  }, [project, verify]);

  const disable = useCallback(async (currentSecret: string) => {
    const ok = await verify(currentSecret);
    if (!ok) return false;
    localStorage.removeItem(hashKey(project));
    localStorage.removeItem(saltKey(project));
    localStorage.setItem(setupKey(project), 'skipped');
    setLockEnabled(false);
    setSetupSkipped(true);
    setUnlocked(true);
    return true;
  }, [project, verify]);

  const skipSetup = useCallback(() => {
    localStorage.setItem(setupKey(project), 'skipped');
    setSetupSkipped(true);
    setUnlocked(true);
  }, [project]);

  const forceClear = useCallback(() => {
    localStorage.removeItem(hashKey(project));
    localStorage.removeItem(saltKey(project));
    localStorage.removeItem(setupKey(project));
    setLockEnabled(false);
    setSetupSkipped(false);
    setUnlocked(false);
  }, [project]);

  const markUnlocked = useCallback(() => setUnlocked(true), []);
  const lockNow = useCallback(() => setUnlocked(false), []);

  return { lockEnabled, checking, unlocked, setupSkipped, verify, enable, change, disable, skipSetup, forceClear, markUnlocked, lockNow };
}
