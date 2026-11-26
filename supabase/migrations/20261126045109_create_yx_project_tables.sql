/*
# YX project infrastructure tables (retry with correct pgcrypto schema)

1. New Tables
- `project_locks`: optional per-project private lock credentials, bound to both the
  YX Account (user_id) and the project (liner / yqro / yxai). Only a bcrypt hash of
  the lock password or PIN is stored — never plaintext.
- `yqro_codes`: YQRO account cloud library. Each row is one saved QR or barcode
  belonging to the authenticated YX Account.

2. Security changes
- RLS enabled on both tables; all policies scoped to authenticated users and
  `auth.uid() = user_id`, so no user can read or modify another user's rows.
- `set_project_lock`, `verify_project_lock`, `delete_project_lock`, `has_project_lock`
  are SECURITY DEFINER RPCs so lock verification and changes are enforced on the
  server, not in the browser. Execute revoked from PUBLIC/anon, granted to
  authenticated only.
- Grants: both tables reachable by authenticated only, minimal verbs.

3. Notes
- Supabase installs pgcrypto into the `extensions` schema, so crypt()/gen_salt()
  are referenced through that schema explicitly.
- The same lock password under a different account or a different project never
  matches, because verification is always keyed by auth.uid() + project.
- LINER workspace content is intentionally NOT stored here (local-first);
  only its lock binding lives in this database.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS project_locks (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project text NOT NULL CHECK (project IN ('liner', 'yqro', 'yxai')),
  secret_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, project)
);

ALTER TABLE project_locks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON project_locks TO authenticated;

DROP POLICY IF EXISTS "select_own_locks" ON project_locks;
CREATE POLICY "select_own_locks" ON project_locks FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_locks" ON project_locks;
CREATE POLICY "insert_own_locks" ON project_locks FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_locks" ON project_locks;
CREATE POLICY "update_own_locks" ON project_locks FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_locks" ON project_locks;
CREATE POLICY "delete_own_locks" ON project_locks FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS yqro_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('qr', 'barcode')),
  format text NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  options jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE yqro_codes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON yqro_codes TO authenticated;

DROP POLICY IF EXISTS "select_own_codes" ON yqro_codes;
CREATE POLICY "select_own_codes" ON yqro_codes FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_codes" ON yqro_codes;
CREATE POLICY "insert_own_codes" ON yqro_codes FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_codes" ON yqro_codes;
CREATE POLICY "delete_own_codes" ON yqro_codes FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION set_project_lock(p_project text, p_secret text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_secret IS NULL OR length(btrim(p_secret)) = 0 THEN
    RAISE EXCEPTION 'empty_secret';
  END IF;
  v_hash := extensions.crypt(p_secret, extensions.gen_salt('bf'));
  INSERT INTO project_locks (user_id, project, secret_hash)
  VALUES (auth.uid(), p_project, v_hash)
  ON CONFLICT (user_id, project)
  DO UPDATE SET secret_hash = excluded.secret_hash, updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION verify_project_lock(p_project text, p_secret text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_locks
    WHERE user_id = auth.uid()
      AND project = p_project
      AND secret_hash = extensions.crypt(p_secret, secret_hash)
  );
$$;

CREATE OR REPLACE FUNCTION delete_project_lock(p_project text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  DELETE FROM project_locks WHERE user_id = auth.uid() AND project = p_project;
END;
$$;

CREATE OR REPLACE FUNCTION has_project_lock(p_project text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_locks WHERE user_id = auth.uid() AND project = p_project
  );
$$;

REVOKE EXECUTE ON FUNCTION set_project_lock(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION verify_project_lock(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION delete_project_lock(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION has_project_lock(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION set_project_lock(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_project_lock(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_project_lock(text) TO authenticated;
GRANT EXECUTE ON FUNCTION has_project_lock(text) TO authenticated;