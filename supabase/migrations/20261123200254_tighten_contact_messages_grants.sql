/*
# Tighten contact_messages privileges

1. Purpose
- The platform's default grants gave anon/authenticated table-wide SELECT, UPDATE,
  and DELETE on contact_messages. The contact form only needs INSERT.

2. Changes
- Revoke SELECT, UPDATE, DELETE from anon and authenticated on contact_messages.
- Keep the column-scoped INSERT grant (name, email, subject, message).

3. Security
- Visitors can still submit the form.
- Nobody browsing with the public key can read, modify, or delete submitted messages.
- service_role retains full access for future admin tooling.
*/

REVOKE SELECT, UPDATE, DELETE ON contact_messages FROM anon, authenticated;
