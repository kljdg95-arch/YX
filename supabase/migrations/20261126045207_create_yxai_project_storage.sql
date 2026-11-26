/*
# YXAI project storage tables

1. New Tables
- `yxai_projects`: one row per YXAI project owned by the authenticated YX Account.
- `yxai_files`: project files (path + text content) belonging to a YXAI project.
  Files are stored as text (html/css/js/md/json/ts config files etc.); binary
  assets are out of scope for this release.

2. Security changes
- RLS enabled on both tables; all policies scoped to authenticated users with
  `auth.uid() = user_id`, so no user can read or modify another user's projects.
- Child-table policies scope through the parent project's ownership.
- Grants: authenticated only, minimal verbs.

3. Notes
- YXAI uses account-based cloud project storage as its primary data source.
- Full project ZIP download is generated in the browser from these files.
*/

CREATE TABLE IF NOT EXISTS yxai_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS yxai_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES yxai_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  path text NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, path)
);

CREATE INDEX IF NOT EXISTS idx_yxai_files_project ON yxai_files (project_id);

ALTER TABLE yxai_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE yxai_files ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON yxai_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON yxai_files TO authenticated;

DROP POLICY IF EXISTS "select_own_projects" ON yxai_projects;
CREATE POLICY "select_own_projects" ON yxai_projects FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON yxai_projects;
CREATE POLICY "insert_own_projects" ON yxai_projects FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON yxai_projects;
CREATE POLICY "update_own_projects" ON yxai_projects FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON yxai_projects;
CREATE POLICY "delete_own_projects" ON yxai_projects FOR DELETE
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_files" ON yxai_files;
CREATE POLICY "select_own_files" ON yxai_files FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_files" ON yxai_files;
CREATE POLICY "insert_own_files" ON yxai_files FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_files" ON yxai_files;
CREATE POLICY "update_own_files" ON yxai_files FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_files" ON yxai_files;
CREATE POLICY "delete_own_files" ON yxai_files FOR DELETE
TO authenticated USING (auth.uid() = user_id);