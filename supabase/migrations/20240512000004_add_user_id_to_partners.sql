-- Link partners to Supabase auth users
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

-- RLS: partners can read their own record
CREATE POLICY IF NOT EXISTS "Partners can read own record"
  ON partners FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
