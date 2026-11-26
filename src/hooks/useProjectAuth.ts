import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { projectClients, type ProjectId } from '@/lib/projectSupabase';

export interface ProjectAuth {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useProjectAuth(project: ProjectId): ProjectAuth {
  const client = projectClients[project];
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: sub } = client.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [client]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, [client]);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await client.auth.signUp({ email, password });
    return error ? error.message : null;
  }, [client]);

  const signOut = useCallback(async () => {
    await client.auth.signOut();
  }, [client]);

  const reload = useCallback(async () => {
    const { data } = await client.auth.getSession();
    setSession(data.session);
  }, [client]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    reload,
  };
}
