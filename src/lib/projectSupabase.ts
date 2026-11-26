import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ProjectId = 'liner' | 'yqro' | 'yxai';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error('Supabase configuration is missing');
}

export const PROJECTS: ProjectId[] = ['liner', 'yqro', 'yxai'];

// One shared YX Account identity, but a completely independent auth session per
// project: each client persists its session under its own storage key, so signing
// into one project never signs the user into another.
export const projectClients: Record<ProjectId, SupabaseClient> = {
  liner: createClient(url, anonKey, { auth: { storageKey: 'yx-account-session-liner' } }),
  yqro: createClient(url, anonKey, { auth: { storageKey: 'yx-account-session-yqro' } }),
  yxai: createClient(url, anonKey, { auth: { storageKey: 'yx-account-session-yxai' } }),
};
