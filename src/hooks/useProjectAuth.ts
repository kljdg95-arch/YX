import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { projectClients, type ProjectId } from '@/lib/projectSupabase';

export interface ProjectAuth {
  session: Session | null;
  user: User | null;
  loading: boolean;
  reload: () => Promise<void>;
}

// Silent anonymous auth: each project client automatically obtains a session
// without asking the user for email or password. The session is only used for
// cloud data operations (YXAI projects, YQRO library). The private lock is
// entirely client-side and does not depend on this session.
export function useProjectAuth(project: ProjectId): ProjectAuth {
  const client = projectClients[project];
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setSession(data.session);
        setLoading(false);
        return;
      }
      // No existing session — try anonymous sign-in silently.
      client.auth.signInAnonymously().then(({ data: anonData, error }) => {
        if (!mounted) return;
        if (!error && anonData.session) {
          setSession(anonData.session);
        }
        setLoading(false);
      }).catch(() => {
        if (mounted) setLoading(false);
      });
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, s) => {
      if (mounted) setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  const reload = useCallback(async () => {
    const { data } = await client.auth.getSession();
    setSession(data.session);
  }, [client]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    reload,
  };
}
