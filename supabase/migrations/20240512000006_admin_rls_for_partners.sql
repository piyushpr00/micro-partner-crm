-- Enable RLS on partners table (idempotent)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Admins and leaders can manage all partners
CREATE POLICY "Admins can manage all partners"
  ON partners FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'leader')
    )
  );
