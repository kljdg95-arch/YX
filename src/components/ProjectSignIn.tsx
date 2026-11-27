import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useProjectAuth } from '@/hooks/useProjectAuth';
import type { ProjectId } from '@/lib/projectSupabase';

// Silent auth gate: obtains an anonymous session for cloud data operations
// without asking the user for email or password. The private lock is handled
// entirely by ProjectLockGate.
export default function ProjectSignIn({ project, children }: { project: ProjectId; appName: string; children: ReactNode }) {
  const auth = useProjectAuth(project);

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-muted">
        <Loader2 className="animate-spin" size={20} aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
