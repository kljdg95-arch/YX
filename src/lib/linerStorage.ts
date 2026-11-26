import type { ProjectId } from '@/lib/projectSupabase';

// LINER is local-first: workspace content lives in the browser (IndexedDB via
// localStorage-backed JSON snapshots per key for this release), never on the
// server. Only the project's private-lock binding is server-side.

export type WorkspaceId = 'personal' | 'business' | 'developer' | 'study' | 'creative' | 'custom';

export const WORKSPACES: { id: WorkspaceId; key: string; internal: string }[] = [
  { id: 'personal', key: 'liner.workspace.personal', internal: 'QELVI' },
  { id: 'business', key: 'liner.workspace.business', internal: 'ZUNOR' },
  { id: 'developer', key: 'liner.workspace.developer', internal: 'ZAVRI' },
  { id: 'study', key: 'liner.workspace.study', internal: 'DEYLO' },
  { id: 'creative', key: 'liner.workspace.creative', internal: 'FEYLO' },
  { id: 'custom', key: 'liner.workspace.custom', internal: 'NEXLI' },
];

export interface LinerPage {
  id: string;
  workspace: WorkspaceId;
  title: string;
  content: string;
  favorite: boolean;
  trashed: boolean;
  created_at: number;
  updated_at: number;
}

export interface LinerData {
  pages: LinerPage[];
}

const STORAGE_KEY = 'liner-local-workspace-v1';

export function loadLinerData(): LinerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LinerData;
      if (Array.isArray(parsed.pages)) return parsed;
    }
  } catch {
    // corrupted snapshot: fall through to empty
  }
  return { pages: [] };
}

export function saveLinerData(data: LinerData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function estimateStorageBytes(): number {
  try {
    return new Blob([localStorage.getItem(STORAGE_KEY) ?? '']).size;
  } catch {
    return 0;
  }
}

export function emptyPage(workspace: WorkspaceId): LinerPage {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    workspace,
    title: '',
    content: '',
    favorite: false,
    trashed: false,
    created_at: now,
    updated_at: now,
  };
}

export function exportBackup(data: LinerData): string {
  return JSON.stringify({ app: 'LINER', version: 1, exported_at: new Date().toISOString(), data }, null, 2);
}

export function parseBackup(text: string): LinerData | null {
  try {
    const parsed = JSON.parse(text) as { app?: string; data?: LinerData };
    if (parsed.app === 'LINER' && parsed.data && Array.isArray(parsed.data.pages)) return parsed.data;
    return null;
  } catch {
    return null;
  }
}

export function workspacePageTemplates(): Partial<Record<WorkspaceId, string[]>> {
  return {
    personal: ['Personal Journal', 'Private Notes', 'Goals Manager', 'Habit Tracker', 'Reading Log', 'Life Overview Dashboard'],
    business: ['Business Profile', 'Client Directory', 'Meeting Minutes', 'Invoice Builder', 'Risk Register', 'Business Overview Dashboard'],
    developer: ['Code Snippet Library', 'Terminal Command Vault', 'API Endpoint Catalog', 'Error and Fix Library', 'Developer Project Dashboard'],
    study: ['Course Organizer', 'Flashcards', 'Exam Planner', 'Formula Library', 'Study Progress Dashboard'],
    creative: ['Moodboard', 'Color Palette Library', 'Content Calendar', 'Creative Brief Builder', 'Portfolio Builder'],
    custom: ['Blank Workspace'],
  };
}
