/*
# Tighten table grants for portfolio tables

Plain-English summary
- Removes the broad default permissions that Supabase gave visitors and signed-in users on the portfolio tables.
- Re-grants only what each role needs. Row-level rules still decide which rows can be touched.

1. Modified Tables
- `profile`, `skills`, `projects`, `messages`: default grants removed, then minimal grants restored.

2. Security
- Visitors (anon): read profile, skills, projects; insert messages only.
- Signed-in users: same as visitors, plus owner-only writes governed by policies.
- Message read flags are the only column the owner can change on messages.

3. Important Notes
- Re-running this migration is safe; REVOKE and GRANT are idempotent.
*/

REVOKE ALL ON profile, skills, projects, messages FROM anon, authenticated;

GRANT SELECT ON profile TO anon, authenticated;
GRANT UPDATE ON profile TO authenticated;

GRANT SELECT ON skills, projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON skills, projects TO authenticated;

GRANT INSERT ON messages TO anon, authenticated;
GRANT SELECT, DELETE ON messages TO authenticated;
GRANT UPDATE (is_read) ON messages TO authenticated;
