/*
# Create contact_messages table

1. Purpose
- Stores messages submitted through the public contact form on the YX website.
- Single-tenant, no-auth app: visitors submit anonymously.

2. New Tables
- `contact_messages`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email address
  - `subject` (text, not null) — message subject
  - `message` (text, not null) — message body
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on `contact_messages`.
- Grant INSERT to `anon, authenticated` so visitors can submit the form.
- Grant SELECT to `service_role` only (for future admin review via server code).
- Insert-only policy for anon/authenticated: visitors can write but never read back.
- No UPDATE/DELETE policies: messages are immutable once submitted.

4. Notes
- Validation of field shape/length happens in the frontend form.
- Email/phone and other contact details are not collected or displayed anywhere.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT (name, email, subject, message) ON contact_messages TO anon, authenticated;
GRANT SELECT ON contact_messages TO service_role;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_messages;
CREATE POLICY "Anyone can submit a contact message"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(subject) BETWEEN 1 AND 200
  AND length(message) BETWEEN 1 AND 5000
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
);
