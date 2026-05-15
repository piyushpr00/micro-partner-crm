-- Allow partners to manage their own leads directly via Supabase client
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Admins (via service role) already bypass RLS.
-- These policies cover authenticated partner users.

CREATE POLICY "Partners can read own leads"
  ON leads FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can insert own leads"
  ON leads FOR INSERT TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own leads"
  ON leads FOR UPDATE TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own leads"
  ON leads FOR DELETE TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Admins can manage all leads
CREATE POLICY "Admins can manage all leads"
  ON leads FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'leader')
    )
  );
